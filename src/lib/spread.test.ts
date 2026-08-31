import { describe, expect, it } from "vitest";
import { sheetCount, spreadAt, framesFor } from "./spread";

describe("sheetCount", () => {
  it("liczy arkusze z liczby stron", () => {
    expect(sheetCount(130)).toBe(65);
    expect(sheetCount(1)).toBe(1);
    expect(sheetCount(0)).toBe(0);
  });

  it("zaokrągla w górę przy nieparzystej liczbie stron", () => {
    expect(sheetCount(129)).toBe(65);
  });
});

describe("spreadAt", () => {
  it("zamknięta książka pokazuje samą okładkę po prawej", () => {
    expect(spreadAt(0, 130)).toEqual({ verso: null, recto: 0 });
  });

  it("pierwsza rozkładówka to strony 1 i 2", () => {
    expect(spreadAt(1, 130)).toEqual({ verso: 1, recto: 2 });
  });

  it("kolejna rozkładówka przesuwa się o dwie strony", () => {
    expect(spreadAt(2, 130)).toEqual({ verso: 3, recto: 4 });
  });

  it("na końcu tomu prawa strona jest pusta", () => {
    expect(spreadAt(65, 130)).toEqual({ verso: 129, recto: null });
  });
});

describe("framesFor", () => {
  it("kadruje obracany arkusz między stronami, które odsłania", () => {
    expect(framesFor(1, 130)).toEqual({
      staticVerso: 1,
      staticRecto: 4,
      leafFront: 2,
      leafBack: 3,
    });
  });

  it("przy pierwszym arkuszu lewa strona statyczna nie istnieje", () => {
    expect(framesFor(0, 130)).toEqual({
      staticVerso: null,
      staticRecto: 2,
      leafFront: 0,
      leafBack: 1,
    });
  });

  it("przy ostatnim arkuszu prawa strona statyczna nie istnieje", () => {
    expect(framesFor(64, 130)).toEqual({
      staticVerso: 127,
      staticRecto: null,
      leafFront: 128,
      leafBack: 129,
    });
  });
});
