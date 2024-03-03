import { calculateComplexity } from "./complexity";

describe("complexity", () => {
  test("should return 1 for a simple function", () => {
    const code = `function a() {
      return 1;
    }`;
    const result = calculateComplexity(code);
    expect(result).toEqual([
      { name: "global", complexity: 0, line: 0 },
      { name: "a", complexity: 1, line: 1 },
    ]);
  });

  test("should return 2 for a function with a function call", () => {
    const code = `function a() {
      b();
    }`;
    const result = calculateComplexity(code);
    expect(result).toEqual([
      { name: "global", complexity: 0, line: 0 },
      { name: "a", complexity: 2, line: 1 },
    ]);
  });

  test("should return 3 for a function with a function call", () => {
    const code = `function a() {
      b();
      c();
    }`;
    const result = calculateComplexity(code);
    expect(result).toEqual([
      { name: "global", complexity: 0, line: 0 },
      { name: "a", complexity: 3, line: 1 },
    ]);
  });

  test("should return 2 for a function with a function call", () => {
    const code = `function a() {
      if (true) {
        return 1;
      }
      return 2;
    }`;
    const result = calculateComplexity(code);
    expect(result).toEqual([
      { name: "global", complexity: 0, line: 0 },
      { name: "a", complexity: 2, line: 1 },
    ]);
  });

  test("should return 0 for an empty code block", () => {
    const code = ``;
    const result = calculateComplexity(code);
    expect(result).toEqual([{ name: "global", complexity: 0, line: 0 }]);
  });

  test("should return 3 for a function with recursive function call", () => {
    const code = `
      "use strict";
      class C {
          constructor() {
              this.x = a || b || c;
          }
      }
      class D {
      }
      (() => {
          if (foo) {
              bar = baz || qux;
          }
    })();`;
    const result = calculateComplexity(code);
    expect(result).toEqual([
      { name: "global", complexity: 0, line: 0},
      { name: "constructor", complexity: 3, line: 4 },
      { name: "D", complexity: 3, line: 10 },
    ]);
  });


  

});
