#!/usr/bin/env node
import { Command } from "@commander-js/extra-typings";
import { calculateComplexity, FunctionComplexity } from "./complexity";
import { globSync } from "glob";
import fs from "fs";
import typescript from "typescript";

const program = new Command();

type ComplexityLevel = "warning" | "error" | "ok";

type FileComplexity = {
  file: string;
  functionComplexities: FunctionComplexity[];
  complexityLevel: ComplexityLevel;
  complexitySum: number;
};

program
  .name("code-complexity")
  .description("Calculates code complexity of given files")
  .argument("<pattern>", "Glob pattern for files to check")
  .option("-tw, --threshold-warnings <number>", "Threshold for warnings", "10")
  .option("-te, --threshold-errors <number>", "Threshold for errors", "20")
  .option("-j, --json", "Output as JSON", false)
  .action((pattern, { thresholdWarnings, thresholdErrors, json }) => {
    function getComplexityLevel(complexity: number): ComplexityLevel {
      if (complexity >= Number(thresholdErrors)) {
        return "error";
      } else if (complexity >= Number(thresholdWarnings)) {
        return "warning";
      } else {
        return "ok";
      }
    }

    const files = globSync(pattern);

    let filesComplexity: FileComplexity[] = [];

    for (const file of files) {
      if (!file.endsWith(".ts") && !file.endsWith(".js")) {
        continue;
      }

      const fileContent = fs.readFileSync(file, "utf-8");

      if (file.endsWith(".ts")) {
        const result = typescript.transpileModule(fileContent, {
          compilerOptions: {
            module: typescript.ModuleKind.CommonJS,
          },
        });

        const functionComplexities = calculateComplexity(result.outputText);

        const highestComplexity = functionComplexities.reduce(
          (prev, current) =>
            prev.complexity > current.complexity ? prev : current,
          { name: "", complexity: 0 },
        );

        let complexityLevel: ComplexityLevel = getComplexityLevel(
          highestComplexity.complexity,
        );

        filesComplexity.push({
          file,
          functionComplexities: functionComplexities.sort(
            (a, b) => b.complexity - a.complexity,
          ),
          complexityLevel,
          complexitySum: functionComplexities.reduce(
            (prev, current) => prev + current.complexity,
            0,
          ),
        });

        continue;
      }

      const functionComplexities = calculateComplexity(fileContent);

      const highestComplexity = functionComplexities.reduce(
        (prev, current) =>
          prev.complexity > current.complexity ? prev : current,
        { name: "", complexity: 0 },
      );

      let complexityLevel: ComplexityLevel = getComplexityLevel(
        highestComplexity.complexity,
      );

      filesComplexity.push({
        file,
        functionComplexities: functionComplexities.sort(
          (a, b) => b.complexity - a.complexity,
        ),
        complexityLevel,
        complexitySum: functionComplexities.reduce(
          (prev, current) => prev + current.complexity,
          0,
        ),
      });
    }

    const errors = filesComplexity.filter((f) => f.complexityLevel === "error");
    const warnings = filesComplexity.filter(
      (f) => f.complexityLevel === "warning",
    );
    const none = filesComplexity.filter((f) => f.complexityLevel === "ok");

    const sorted = [
      ...errors.sort((a, b) => b.complexitySum - a.complexitySum),
      ...warnings.sort((a, b) => b.complexitySum - a.complexitySum),
      ...none.sort((a, b) => b.complexitySum - a.complexitySum),
    ];

    if (json) {
      console.log(JSON.stringify(filesComplexity, null, 2));
      return;
    } else {
      for (const file of sorted) {
        console.log(
          `${file.file}: ${
            file.complexitySum
          } (${file.complexityLevel.toUpperCase()})`,
        );

        for (const functionComplexity of file.functionComplexities) {
          console.log(
            `  ${functionComplexity.name}: ${
              functionComplexity.complexity
            } (${getComplexityLevel(
              functionComplexity.complexity,
            ).toUpperCase()})`,
          );
        }
      }

      if (errors.length === 0 && warnings.length === 0) {
        console.log("No issues found");
      }

      if (errors.length > 0) {
        console.log(`Found ${errors.length} files with errors`);

        process.exit(1);
      }
    }
  })
  .parse(process.argv);
