import * as esprima from "esprima";

export interface FunctionComplexity {
  name: string;
  complexity: number;
  line: number;
}

export function calculateComplexity(code: string): FunctionComplexity[] {
  try {
    const ast = esprima.parseScript(code, { loc: true, jsx: true });
    let functionComplexities: FunctionComplexity[] = [
      { name: "global", complexity: 0, line: 0 },
    ];
    let functionStack: FunctionComplexity[] = [
      { name: "global", complexity: 1, line: 0 },
    ];
    let definedFunctions: Set<string> = new Set();
    let fatherName = "";

    function traverse(node: any): void {
      switch (node.type) {
        case "FunctionDeclaration":
          if (node.id) {
            definedFunctions.add(node.id.name);
            const newFunction = { name: node.id.name, complexity: 1, line: node.loc.start.line };
            functionStack.push(newFunction);
            functionComplexities.push(newFunction);
          }
          break;

        case "FunctionExpression":
        case "ArrowFunctionExpression":
          definedFunctions.add(fatherName);
          const newFunction = { name: `anonymous: ${fatherName}`, complexity: 1, line: node.loc.start.line };
          functionStack.push(newFunction);
          functionComplexities.push(newFunction);
          break;

        case "CallExpression":
          if (node.callee.type === "Identifier") {
            const functionName = node.callee.name;
            const functionDetail = functionStack.find(
              (f) => f.name === functionName,
            );
            if (!definedFunctions.has(functionName)) {
              functionStack[functionStack.length - 1].complexity++;
            }
          }
          break;

        case "IfStatement":
        case "ForStatement":
        case "WhileStatement":
        case "DoWhileStatement":
        case "SwitchCase":
          functionStack[functionStack.length - 1].complexity++;
          break;

        case "ConditionalExpression":
          functionStack[functionStack.length - 1].complexity++;
          break;

        case "LogicalExpression":
          functionStack[functionStack.length - 1].complexity +=
            node.operator === "&&" || node.operator === "||" ? 1 : 0;
          break;

        case "CatchClause":
          functionStack[functionStack.length - 1].complexity++;
          break;

        default:
          break;
      }

      for (const key in node) {
        if (node.hasOwnProperty(key)) {
          const child = node[key];
          if (typeof child === "object" && child !== null) {
            if( node.type === "Identifier" ) {
              fatherName =  node.name;
            }
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
  } catch (e) {
    return [];
  }
}
