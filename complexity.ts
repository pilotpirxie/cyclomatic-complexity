import * as esprima from 'esprima';

interface FunctionComplexity {
  name: string;
  complexity: number;
}

function calculateComplexity(code: string): number {
  const ast = esprima.parseScript(code, { loc: true });

  let globalComplexity = 1;
  let functionStack: FunctionComplexity[] = [{ name: 'global', complexity: 1 }];
  let definedFunctions: Set<string> = new Set();

  function traverse(node: any): void {
    switch (node.type) {
      case 'FunctionDeclaration':
        if (node.id) {
          definedFunctions.add(node.id.name);
          functionStack.push({ name: node.id.name, complexity: 1 });
        }
        break;

      case 'FunctionExpression':
      case 'ArrowFunctionExpression':
        definedFunctions.add('anonymous');
        functionStack.push({ name: 'anonymous', complexity: 1 });
        break;

      case 'CallExpression':
        if (node.callee.type === 'Identifier') {
          const functionName = node.callee.name;
          const functionDetail = functionStack.find(
            (f) => f.name === functionName
          );
          if (functionDetail) {
            functionDetail.complexity++;
          } else if (!definedFunctions.has(functionName)) {
            // Handle external function calls
            globalComplexity++;
          }
        }
        break;

      case 'IfStatement':
      case 'ForStatement':
      case 'WhileStatement':
      case 'DoWhileStatement':
      case 'SwitchCase':
        functionStack[functionStack.length - 1].complexity++;
        break;

      case 'ConditionalExpression':
        functionStack[functionStack.length - 1].complexity++;
        break;

      case 'LogicalExpression':
        functionStack[functionStack.length - 1].complexity += node.operator === '&&' || node.operator === '||' ? 1 : 0;
        break;

      case 'CatchClause':
        functionStack[functionStack.length - 1].complexity++;
        break;

      default:
        break;
    }

    for (const key in node) {
      if (node.hasOwnProperty(key)) {
        const child = node[key];
        if (typeof child === 'object' && child !== null) {
          traverse(child);
        }
      }
    }

    if (node.type === 'FunctionDeclaration' || node.type === 'FunctionExpression' || node.type === 'ArrowFunctionExpression') {
      const finishedFunction = functionStack.pop();
      if (finishedFunction) {
        globalComplexity += finishedFunction.complexity;
      }
    }
  }

  traverse(ast);

  return globalComplexity;
}

const code = `
function complexFunction(data) {
  let result = [];

  if (data && Array.isArray(data)) {
    data.forEach((item, index) => {
      let processedItem = processItem(item, index);
      if (processedItem) {
        result.push(processedItem);
      }
    });
  } else if (typeof data === 'object') {
    for (let key in data) {
      if (data.hasOwnProperty(key)) {
        let processedItem = processItem(data[key], key);
        if (processedItem) {
          result.push(processedItem);
        }
      }
    }
  } else {
    throw new Error("Invalid data type");
  }

  return result;
}

function processItem(item, identifier) {
  if (item == null) {
    return null;
  }

  if (Array.isArray(item)) {
    return item.map((subItem, index) => processItem(subItem, \`\${identifier}_\${index}\`));
  }

  if (typeof item === 'object') {
    let result = {};
    for (let key in item) {
      if (item.hasOwnProperty(key)) {
        result[key] = processItem(item[key], \`\${identifier}_\${key}\`);
      }
    }
    return result;
  }

  return item;
}

try {
  let data = {
    a: [1, 2, [3, 4]],
    b: {
      c: 5,
      d: [6, { e: 7, f: 8 }]
    },
    g: null
  };

  console.log(complexFunction(data));
} catch (error) {
  console.error(error);
}
`;

console.log(calculateComplexity(code));