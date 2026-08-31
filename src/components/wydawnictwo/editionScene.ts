// src/components/wydawnictwo/editionScene.ts
import * as THREE from "three";
import type { EditionPage } from "@/lib/edition-pages";
import { framesFor, sheetCount, spreadAt } from "@/lib/spread";

/**
 * Scena książki — czysty moduł imperatywny, BEZ REACTA.
 *
 * React nie może renderować 60 razy na sekundę, a scena musi. Dlatego całość
 * żyje tutaj i wystawia dwie funkcje: `goTo` i `dispose`. Dzięki temu warstwę
 * widoku da się wymienić bez dotykania geometrii, a geometrię bez dotykania
 * dostępności.
 */

/** Ile stopni zwinięcia osiąga kartka w połowie obrotu. */
const BEND_MAX = 1.35;
/** Skręt wierszowy — róg prowadzi obrót po przekątnej, jak w prawdziwej książce. */
const LEAD = 0.32;
/** Podział siatki. Mniej niż 32 kolumny i zwinięcie widać jako łamaną. */
const SEG_X = 48;
const SEG_Y = 18;

/** Odcień papieru tam, gdzie nie ma tekstury — biel byłaby zimna i płaska. */
const PAPER_TINT = 0xf5f2ea;

export interface SceneHandle {
  /** Przejdź do stanu `o` (liczba arkuszy po lewej), animując obrót. */
  goTo(o: number): void;
  dispose(): void;
}

export function createScene(
  canvas: HTMLCanvasElement,
  pages: EditionPage[],
  opts: { reduced: boolean; onSettled: (o: number) => void },
): SceneHandle {
  const aspect = pages[0].width / pages[0].height;
  const PW = 1; // szerokość strony w jednostkach sceny
  const PH = PW / aspect;

  const renderer = new THREE.WebGLRenderer({ canvas, antialias: true, alpha: true });
  renderer.setPixelRatio(Math.min(devicePixelRatio, 2));
  renderer.toneMapping = THREE.ACESFilmicToneMapping;

  // Cienie to najdroższy element sceny. Na wąskich ekranach wyłączamy je
  // zamiast pozwolić, żeby całość się zacinała.
  const wantShadows = window.innerWidth >= 900 && !opts.reduced;
  renderer.shadowMap.enabled = wantShadows;
  renderer.shadowMap.type = THREE.PCFSoftShadowMap;

  const scene = new THREE.Scene();
  const camera = new THREE.PerspectiveCamera(32, 1, 0.1, 100);
  camera.position.set(0.35, 2.05, 2.15);
  camera.lookAt(0, 0, 0);

  const key = new THREE.DirectionalLight(0xfff1dd, 2.4);
  key.position.set(1.6, 3.0, 1.4);
  key.castShadow = wantShadows;
  key.shadow.mapSize.set(1024, 1024);
  scene.add(key);
  scene.add(new THREE.HemisphereLight(0xdfe8ff, 0x14161c, 0.6));
  scene.add(new THREE.AmbientLight(0xffffff, 0.25));

  const groundGeo = new THREE.PlaneGeometry(14, 14);
  const groundMat = new THREE.MeshStandardMaterial({ color: 0x1b1e26, roughness: 0.95 });
  const ground = new THREE.Mesh(groundGeo, groundMat);
  ground.rotation.x = -Math.PI / 2;
  ground.position.y = -0.02;
  ground.receiveShadow = wantShadows;
  scene.add(ground);

  let disposed = false;
  let raf = 0;

  /**
   * Jedno miejsce, które decyduje o narysowaniu klatki poza pętlą.
   *
   * Przy zredukowanym ruchu pętli rAF nie ma, a `TextureLoader.load` jest
   * asynchroniczne: jedyny render wypadłby PRZED dojściem obrazów i użytkownik
   * zobaczyłby biały prostokąt. To błąd dostępności, nie kosmetyka — więc każda
   * doładowana tekstura prosi tu o render. Gdy pętla działa (`raf !== 0`),
   * następna klatka i tak narysuje scenę, więc drugi render byłby marnotrawstwem.
   */
  const requestRender = () => {
    if (disposed || raf !== 0) return;
    renderer.render(scene, camera);
  };

  /**
   * Tekstura zastępcza 1×1. Trzyma zdefiniowany `USE_MAP` w materiale kartki
   * NAWET zanim dojdzie pierwsza strona — bez `map` three.js nie deklaruje
   * `vMapUv`, a nasza wstrzyknięta gałąź na `gl_FrontFacing` się do niego
   * odwołuje i shader nie skompilowałby się w ogóle.
   */
  const blank = new THREE.DataTexture(new Uint8Array([255, 255, 255, 255]), 1, 1);
  blank.needsUpdate = true;

  // Tekstury ładujemy leniwie — 130 stron naraz to kilkanaście megabajtów
  // w pamięci karty graficznej bez żadnego powodu.
  const loader = new THREE.TextureLoader();
  const cache = new Map<number, THREE.Texture>();
  const texture = (i: number | null): THREE.Texture | null => {
    if (i === null || i < 0 || i >= pages.length) return null;
    let t = cache.get(i);
    if (!t) {
      t = loader.load(pages[i].src, requestRender);
      t.colorSpace = THREE.SRGBColorSpace;
      t.anisotropy = renderer.capabilities.getMaxAnisotropy();
      cache.set(i, t);
    }
    return t;
  };

  const paper = (map: THREE.Texture | null) =>
    new THREE.MeshStandardMaterial({
      map,
      color: map ? 0xffffff : PAPER_TINT,
      roughness: 0.82,
      side: THREE.DoubleSide,
    });

  // Materiały statycznych stron są TRWAŁE. Tworzenie nowego przy każdym obrocie
  // zostawiałoby po sobie program shadera i bufory, których nikt nie zwalnia —
  // przy 130 stronach to setki wyciekniętych materiałów na jedną sesję.
  const leftMat = paper(null);
  const rightMat = paper(null);

  const flat = (x: number, material: THREE.MeshStandardMaterial) => {
    const m = new THREE.Mesh(new THREE.PlaneGeometry(PW, PH), material);
    m.rotation.x = -Math.PI / 2;
    m.position.set(x, 0, 0);
    m.receiveShadow = wantShadows;
    scene.add(m);
    return m;
  };
  const leftPage = flat(-PW / 2, leftMat);
  const rightPage = flat(PW / 2, rightMat);

  /**
   * Podmiana strony na trwałym materiale.
   *
   * `USE_MAP` zależy od tego, CZY tekstura jest — nie od tego, KTÓRA. Rekompilacji
   * shadera żądamy więc wyłącznie przy przejściu tekstura↔pustka, bo wymuszanie
   * jej co obrót powodowałoby zacięcie na każdej przewracanej kartce.
   */
  const setFace = (
    mesh: THREE.Mesh,
    material: THREE.MeshStandardMaterial,
    index: number | null,
  ) => {
    const t = texture(index);
    if ((material.map === null) !== (t === null)) material.needsUpdate = true;
    material.map = t;
    material.color.setHex(t ? 0xffffff : PAPER_TINT);
    mesh.visible = t !== null;
  };

  // Kartka w ruchu. Geometria jest współdzielona i deformowana co klatkę,
  // więc zapamiętujemy pozycje spoczynkowe — inaczej deformacja narastałaby.
  const leafGeo = new THREE.PlaneGeometry(PW, PH, SEG_X, SEG_Y);
  const rest = Float32Array.from(leafGeo.attributes.position.array);
  const leafMat = paper(blank);

  /**
   * Rewers kartki pokazuje INNĄ stronę niż awers. Gałąź na `gl_FrontFacing`
   * w jednym materiale zamiast dwóch siatek: dwie siatki w tej samej
   * płaszczyźnie migotałyby (z-fighting), a tak zostaje jedna, która poprawnie
   * się oświetla i rzuca jeden cień.
   *
   * Uniform jest TRWAŁY i żyje poza `onBeforeCompile`, bo ten callback odpala
   * się dopiero przy pierwszej kompilacji materiału — czyli przy pierwszym
   * renderze widocznej kartki, a więc PO pierwszym `startFlip`. Gdyby uniform
   * powstawał w środku, pierwsze przewrócenie ustawiałoby tył na obiekcie,
   * którego jeszcze nie ma, i rewers byłby bez tekstury.
   */
  const backUniform: { value: THREE.Texture | null } = { value: blank };
  leafMat.onBeforeCompile = (shader) => {
    shader.uniforms.backMap = backUniform;
    shader.fragmentShader = shader.fragmentShader
      .replace("#include <common>", "#include <common>\nuniform sampler2D backMap;")
      .replace(
        "#include <map_fragment>",
        `
        vec4 sampledDiffuseColor;
        if (gl_FrontFacing) {
          sampledDiffuseColor = texture2D(map, vMapUv);
        } else {
          // Odbicie U, żeby tył nie był lustrzany.
          sampledDiffuseColor = texture2D(backMap, vec2(1.0 - vMapUv.x, vMapUv.y));
        }
        diffuseColor *= sampledDiffuseColor;
        `,
      );
  };

  const leaf = new THREE.Mesh(leafGeo, leafMat);
  leaf.castShadow = wantShadows;
  // Kartka musi leżeć tak samo jak strony statyczne. Obrót -PI/2 wokół X
  // odwzorowuje lokalne (x, y, z) na światowe (x, z, -y): wysokość strony
  // idzie w -Z (zgodnie ze stronami statycznymi), a zwinięcie z `deform`
  // unosi się w +Y, czyli nad blat. Przesunięcie stawia grzbiet geometrii
  // (lokalne x = -PW/2) dokładnie w x = 0, więc w spoczynku kartka
  // pokrywa prawą stronę, a po obrocie — lewą.
  leaf.rotation.x = -Math.PI / 2;
  leaf.position.x = PW / 2;
  leaf.visible = false;
  scene.add(leaf);

  let o = 0;
  let target = 0;
  let tv = 0;
  let base = 0;

  const paintStatics = (state: number) => {
    const { verso, recto } = spreadAt(state, pages.length);
    setFace(leftPage, leftMat, verso);
    setFace(rightPage, rightMat, recto);
  };

  /**
   * Deformacja kartki dla postępu `t ∈ [0,1]`.
   *
   * Wierzchołek w odległości `s` od grzbietu owija walec o promieniu
   * `ρ = PW / bend`, a potem obraca się o `theta` wokół grzbietu.
   * `bend = sin(t·π)` sprawia, że zwinięcie narasta do połowy obrotu i opada —
   * bez tego kartka byłaby sztywną płytą.
   */
  const deform = (t: number) => {
    const pos = leafGeo.attributes.position;
    const theta = t * Math.PI;
    const bend = Math.max(0.0001, Math.sin(theta) * BEND_MAX);
    const rho = PW / bend;

    for (let i = 0; i < pos.count; i++) {
      const x0 = rest[i * 3];
      const y0 = rest[i * 3 + 1];
      const s = x0 + PW / 2; // odległość od grzbietu, 0..PW

      const a = (s / PW) * bend;
      const cx = rho * Math.sin(a);
      const cy = rho * (1 - Math.cos(a));

      const twist = theta + LEAD * (y0 / PH);
      const c = Math.cos(twist);
      const sn = Math.sin(twist);

      pos.setXYZ(i, -PW / 2 + cx * c, y0, cx * sn + cy * 0.35);
    }
    pos.needsUpdate = true;
    leafGeo.computeVertexNormals(); // bez tego zwinięcie oświetla się płasko
  };

  const startFlip = (from: number, to: number) => {
    base = Math.min(from, to);
    const f = framesFor(base, pages.length);
    setFace(leftPage, leftMat, f.staticVerso);
    setFace(rightPage, rightMat, f.staticRecto);

    // Awers NIGDY nie może zostać pusty: zniknięcie `map` zabrałoby `USE_MAP`
    // razem z `vMapUv`, na którym stoi gałąź rewersu. Stąd papierowa zastępka.
    leafMat.map = texture(f.leafFront) ?? blank;
    backUniform.value = texture(f.leafBack) ?? blank;
    // Bez `leafMat.needsUpdate`: podmieniamy jedną teksturę na drugą, defines się
    // nie zmieniają, a wymuszona rekompilacja shadera zacinałaby każdy obrót.
    leaf.visible = true;
    tv = to > from ? 0 : 1;
  };

  const tick = () => {
    raf = requestAnimationFrame(tick);
    if (leaf.visible) {
      const goal = target > o ? 1 : 0;
      tv += (goal - tv) * 0.12;
      if (Math.abs(goal - tv) < 0.004) {
        tv = goal;
        leaf.visible = false;
        o = target;
        paintStatics(o);
        opts.onSettled(o);
      } else {
        deform(tv);
      }
    }
    renderer.render(scene, camera);
  };

  const resize = () => {
    const { clientWidth: w, clientHeight: h } = canvas;
    // Płótno jeszcze nieułożone albo kontener chwilowo ukryty: `w / h` dałoby
    // Infinity lub NaN i zepsułoby macierz projekcji na stałe.
    if (w === 0 || h === 0) return;
    renderer.setSize(w, h, false);
    camera.aspect = w / h;
    camera.updateProjectionMatrix();
    requestRender();
  };
  const ro = new ResizeObserver(resize);
  ro.observe(canvas);
  resize();

  paintStatics(0);
  if (!opts.reduced) raf = requestAnimationFrame(tick);
  else renderer.render(scene, camera);

  return {
    goTo(next: number) {
      const clamped = Math.max(0, Math.min(sheetCount(pages.length), next));
      if (clamped === o) return;
      if (opts.reduced) {
        o = clamped;
        target = clamped;
        paintStatics(o);
        renderer.render(scene, camera);
        opts.onSettled(o);
        return;
      }
      target = clamped;
      startFlip(o, clamped);
    },
    dispose() {
      disposed = true;
      cancelAnimationFrame(raf);
      ro.disconnect();
      cache.forEach((t) => t.dispose());
      blank.dispose();
      groundGeo.dispose();
      groundMat.dispose();
      leftPage.geometry.dispose();
      rightPage.geometry.dispose();
      leftMat.dispose();
      rightMat.dispose();
      leafGeo.dispose();
      leafMat.dispose();
      renderer.dispose();
    },
  };
}
