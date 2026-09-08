import { describe, expect, it } from "vitest";

import { toRoman } from "@/lib/roman";

describe("toRoman", () => {
  it("should convert the numbers actually used (index de categorias, 1-7 grupos)", () => {
    expect(toRoman(1)).toBe("I");
    expect(toRoman(4)).toBe("IV");
    expect(toRoman(5)).toBe("V");
    expect(toRoman(7)).toBe("VII");
    expect(toRoman(9)).toBe("IX");
  });

  it("should handle values with subtractive notation beyond the current use case", () => {
    expect(toRoman(14)).toBe("XIV");
    expect(toRoman(40)).toBe("XL");
    expect(toRoman(90)).toBe("XC");
    expect(toRoman(1994)).toBe("MCMXCIV");
  });
});
