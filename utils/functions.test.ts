import {
  mergeClasses,
  round,
  getValInRangeFromZeroToOne,
  getValueInRangeFromRangeInZeroToOne,
} from "./functions";

describe("mergeClasses function", () => {
  it("returns class if only one argument is put in", () => {
    expect(mergeClasses("px-1")).toBe<string>("px-1");
  });
  it("should merge 2 class names correctly", () => {
    expect(mergeClasses("px-1", "mt-1")).toBe<string>("px-1 mt-1");
  });

  it("should merge multiple class names correctly", () => {
    expect(mergeClasses("px-1", "mt-1", "opacity-300")).toBe<string>(
      "px-1 mt-1 opacity-300"
    );
  });

  it("should merge class names only if first item in array is true", () => {
    expect(
      mergeClasses("px-1", "mt-1", [1 + 1 === 2, "opacity-300"])
    ).toBe<string>("px-1 mt-1 opacity-300");
    expect(
      mergeClasses("px-1", "mt-1", [1 + 1 === 3, "opacity-300"])
    ).toBe<string>("px-1 mt-1");
  });

  it("should merge multiple class names only if first item in array is true", () => {
    expect(
      mergeClasses("px-1", "mt-1", [1 + 1 === 2, "opacity-300", "ml-3"])
    ).toBe<string>("px-1 mt-1 opacity-300 ml-3");
    expect(
      mergeClasses("px-1", "mt-1", [1 + 1 === 3, "opacity-300", "ml-3"])
    ).toBe<string>("px-1 mt-1");
  });

  it("recursively merges class names", () => {
    expect(
      mergeClasses("px-1", "mt-1", [
        1 + 1 === 2,
        "opacity-300",
        "ml-3",
        [1 + 1 === 2, "bold", "red"],
      ])
    ).toBe<string>("px-1 mt-1 opacity-300 ml-3 bold red");

    expect(
      mergeClasses("px-1", "mt-1", [
        1 + 1 === 2,
        "opacity-300",
        "ml-3",
        [1 + 1 === 1, "bold", "red"],
        [1 + 1 === 2, "green", "blue"],
        "orange",
      ])
    ).toBe<string>("px-1 mt-1 opacity-300 ml-3 green blue orange");
  });
});

describe("round function", () => {
  it("rounds number correctly", () => {
    expect(round(0.333, 1)).toBe<number>(0);
    expect(round(0.333, 10)).toBe<number>(0.3);
    expect(round(0.333, 100)).toBe<number>(0.33);
  });
});

describe("getValInRangeFromZeroToOne function", () => {
  it("gets value in range from 0 -> 1 correctly with an ascending range", () => {
    expect(round(getValInRangeFromZeroToOne(30, 900, 242), 100)).toBe<number>(
      0.24
    );
    expect(
      round(getValInRangeFromZeroToOne(0.01, 0.015, 0.012), 100)
    ).toBe<number>(0.4);
    expect(round(getValInRangeFromZeroToOne(0, 100, 50), 100)).toBe<number>(
      0.5
    );
  });
  it("gets value in range from 0 -> 1 correctly with an descending range", () => {
    expect(round(getValInRangeFromZeroToOne(900, 30, 242), 100)).toBe<number>(
      0.76
    );
    expect(
      round(getValInRangeFromZeroToOne(0.015, 0.01, 0.012), 100)
    ).toBe<number>(0.6);
    expect(round(getValInRangeFromZeroToOne(100, 0, 50), 100)).toBe<number>(
      0.5
    );
  });
  it("should throw an error of value is outisde of range", () => {
    expect(() => getValInRangeFromZeroToOne(30, 900, 29)).toThrowError(
      "The value 29, cannot be less than the minimum value 30 in the range"
    );
    expect(() => getValInRangeFromZeroToOne(900, 30, 901)).toThrowError(
      "The value 901, cannot be greater than the maximum value 900 in the range"
    );
    expect(() => getValInRangeFromZeroToOne(0.01, 0.015, 0.009)).toThrowError(
      "The value 0.009, cannot be less than the minimum value 0.01 in the range"
    );
    expect(() => getValInRangeFromZeroToOne(0.015, 0.01, 0.016)).toThrowError(
      "The value 0.016, cannot be greater than the maximum value 0.015 in the range"
    );
  });
});

describe("getValueInRangeFromRangeInZeroToOne function", () => {
  it("get's value in range from start -> end correctly with an ascending range", () => {
    expect(
      getValueInRangeFromRangeInZeroToOne(30, 900, 0.24367816091954023)
    ).toBe<number>(242);

    expect(getValueInRangeFromRangeInZeroToOne(0, 100, 0.5)).toBe<number>(50);
  });
  it("get's value in range from start -> end correctly with an decending range", () => {
    expect(
      getValueInRangeFromRangeInZeroToOne(900, 30, 1 - 0.24367816091954023)
    ).toBe<number>(242);

    expect(getValueInRangeFromRangeInZeroToOne(100, 0, 0.5)).toBe<number>(50);
  });

  it("should throw an error of value is outisde of range of 0 -> 1", () => {
    expect(() =>
      getValueInRangeFromRangeInZeroToOne(30, 900, -0.9)
    ).toThrowError("The value -0.9, cannot be less than 0");
    expect(() => getValueInRangeFromRangeInZeroToOne(30, 900, 2)).toThrowError(
      "The value 2, cannot be greater than 1"
    );
  });
});

export {};
