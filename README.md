# cyclomatic-complexity

Detect cyclomatic complexity of your JavaScript and TypeScript code. You can use it as a CLI tool or as a programmatic library.

Cyclomatic complexity is a software metric used to indicate the complexity of a program. It measures the number of linearly independent paths through a program's source code, providing insights into code maintainability and testability.

In simple words, it's a measure of how many different paths a piece of code can take. The higher the cyclomatic complexity, the more difficult it is to understand and maintain the code.

## Basic Usage

Run with npx and pass a glob pattern to your source files:

```sh
npx cyclomatic-complexity './**/*'
```

Example output:
```sh
src/utils/useLocalStorage.ts: 15 (OK)
  [line: 13] handler: 5 (OK)
  [line: 7] anonymous: useEffect: 4 (OK)
  [line: 24] anonymous: setValueWrap: 4 (OK)
  [line: 5] useLocalStorage: 1 (OK)
  [line: 20] anonymous: handler: 1 (OK)
  [line: 0] global: 0 (OK)

src/vite-env.d.ts: 0 (OK)
  [line: 0] global: 0 (OK)
```

Or install it globally and run it:

```sh
# npm
npm install -g cyclomatic-complexity

# yarn
yarn global add cyclomatic-complexity

# pnpm
pnpm install -g cyclomatic-complexity
```

## Advanced Usage

To check cyclomatic complexity of typescript files in `./src` folder and set warnings to 10 and errors to 20. Output as JSON:

```sh
npx cyclomatic-complexity './src/**/*.ts' --threshold-warnings 10 --threshold-errors 20 --json
```

Example output:
```json
[
  {
    "file": "src/vite-env.d.ts",
    "functionComplexities": [
      {
        "name": "global",
        "complexity": 0,
        "line": 0
      }
    ],
    "complexityLevel": "ok",
    "complexitySum": 0
  },
  {
    "file": "src/utils/useLocalStorage.ts",
    "functionComplexities": [
      {
        "name": "handler",
        "complexity": 5,
        "line": 13
      },
      {
        "name": "anonymous: useEffect",
        "complexity": 4,
        "line": 7
      },
      {
        "name": "anonymous: setValueWrap",
        "complexity": 4,
        "line": 24
      },
      {
        "name": "useLocalStorage",
        "complexity": 1,
        "line": 5
      },
      {
        "name": "anonymous: handler",
        "complexity": 1,
        "line": 20
      },
      {
        "name": "global",
        "complexity": 0,
        "line": 0
      }
    ],
    "complexityLevel": "ok",
    "complexitySum": 15
  }
]

```

## Requirements
* Node >= 18

## Options

```shell
Usage: code-complexity [options] <pattern>

Calculates code complexity of given files

Arguments:
  pattern                             Glob pattern for files to check

Options:
  -tw, --threshold-warnings <number>  Threshold for warnings (default: "10")
  -te, --threshold-errors <number>    Threshold for errors (default: "20")
  -j, --json                          Output as JSON (default: false)
  -e, --exclude <pattern>             Exclude pattern (default: "**/node_modules/**")
  -h, --help                          display help for command
```

## License

MIT