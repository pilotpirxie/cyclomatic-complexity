import * as esprima from "esprima";

export interface FunctionComplexity {
  name: string;
  complexity: number;
}

export function calculateComplexity(code: string): FunctionComplexity[] {
  const ast = esprima.parseScript(code, { loc: true });

  let functionComplexities: FunctionComplexity[] = [
    { name: "global", complexity: 1 },
  ];
  let functionStack: FunctionComplexity[] = [{ name: "global", complexity: 1 }];
  let definedFunctions: Set<string> = new Set();

  function traverse(node: any): void {
    switch (node.type) {
      case "FunctionDeclaration":
        if (node.id) {
          definedFunctions.add(node.id.name);
          const newFunction = { name: node.id.name, complexity: 1 };
          functionStack.push(newFunction);
          functionComplexities.push(newFunction);
        }
        break;

      case "FunctionExpression":
      case "ArrowFunctionExpression":
        definedFunctions.add("anonymous");
        const newFunction = { name: "anonymous", complexity: 1 };
        functionStack.push(newFunction);
        functionComplexities.push(newFunction);
        break;

      case "CallExpression":
        if (node.callee.type === "Identifier") {
          const functionName = node.callee.name;
          const functionDetail = functionStack.find(
            (f) => f.name === functionName,
          );
          if (functionDetail) {
            functionDetail.complexity++;
          } else if (!definedFunctions.has(functionName)) {
            // Handle external function calls
            functionStack[functionStack.length - 1].complexity++;
          }
        }
        break;

      // ... (keep the rest of your cases here)
    }

    for (const key in node) {
      if (node.hasOwnProperty(key)) {
        const child = node[key];
        if (typeof child === "object" && child !== null) {
          traverse(child);
        }
      }
    }

    if (
      node.type === "FunctionDeclaration" ||
      node.type === "FunctionExpression" ||
      node.type === "ArrowFunctionExpression"
    ) {
      functionStack.pop();
    }
  }

  traverse(ast);

  return functionComplexities;
}
