# cyclomatic-complexity

Detect cyclomatic complexity of your JavaScript and TypeScript code

## Basic Usage

Run with npx and pass a glob pattern to your source files:

```sh
npx cyclomatic-complexity './**/*'
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

## Requirements
* Node >= 16

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