import { describe, expect, it } from "vitest";
import { formatTemp, weatherKind } from "./weather";

describe("weatherKind", () => {
  it("rozpoznaje pogodę bezchmurną i zachmurzenie", () => {
    expect(weatherKind(0)).toBe("clear");
    expect(weatherKind(1)).toBe("cloudy");
    expect(weatherKind(2)).toBe("cloudy");
    expect(weatherKind(3)).toBe("overcast");
  });

  it("łączy opad ciągły z przelotnym w jedno pojęcie", () => {
    // 61-67 to deszcz ciągły, 80-82 przelotny. Dla kogoś, kto sprawdza, czy
    // wziąć kurtkę, to ta sama informacja.
    expect(weatherKind(61)).toBe("rain");
    expect(weatherKind(67)).toBe("rain");
    expect(weatherKind(80)).toBe("rain");
    expect(weatherKind(82)).toBe("rain");
  });

  it("rozpoznaje śnieg, mgłę, mżawkę i burzę", () => {
    expect(weatherKind(71)).toBe("snow");
    expect(weatherKind(86)).toBe("snow");
    expect(weatherKind(45)).toBe("fog");
    expect(weatherKind(48)).toBe("fog");
    expect(weatherKind(51)).toBe("drizzle");
    expect(weatherKind(95)).toBe("storm");
    expect(weatherKind(99)).toBe("storm");
  });

  it("nieznany kod nie udaje znanej pogody", () => {
    // Lepiej ukryć komórkę niż wpisać zmyśloną pogodę.
    expect(weatherKind(4)).toBe("unknown");
    expect(weatherKind(-1)).toBe("unknown");
    expect(weatherKind(123)).toBe("unknown");
  });
});

describe("formatTemp", () => {
  it("zaokrągla do pełnych stopni", () => {
    expect(formatTemp(20.8)).toBe("21°C");
    expect(formatTemp(20.2)).toBe("20°C");
    expect(formatTemp(-3.6)).toBe("-4°C");
  });

  it("nie pokazuje minus zera", () => {
    // Math.round(-0.4) daje -0, a szablon zamieniłby to na „-0°C".
    expect(formatTemp(-0.4)).toBe("0°C");
  });
});
