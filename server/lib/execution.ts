import { exec } from "child_process";
import type { Language, TestCase } from "@prisma/client";
import fs from "fs/promises";

export const executeCode = async (
  code: string,
  language: Language,
  testCases: TestCase[]
) => {
  try {
    let results = [];

    for (const testCase of testCases) {
      const { input, output } = testCase;

      let result;
      switch (language) {
        case "PYTHON":
          result = await executePythonCode(code, input);
          break;
        case "JAVASCRIPT":
          result = await executeJavascriptCode(code, input);
          break;
        case "JAVA":
          result = await executeJavaCode(code, input);
          break;
        case "C":
          result = await executeCCode(code, input);
          break;
        case "CPP":
          result = await executeCppCode(code, input);
          break;
        default:
          throw new Error("Language not supported");
      }

      if (result.trim() === output.trim()) {
        results.push({ status: "ACCEPTED", output: result.trim() });
      } else {
        results.push({ status: "REJECTED", output: result.trim() });
      }
    }

    return results;
  } catch (error) {
    console.error("ERROR_EXECUTING_CODE", error);
    return [{ status: "ERROR", error: "ERROR_EXECUTING_CODE", message: error }];
  }
};

const executePythonCode = async (
  code: string,
  input: string
): Promise<string> => {
  try {
    await fs.writeFile("main.py", code);
    const { stdout, stderr } = await execPromise(`python main.py`, input);
    await fs.unlink("main.py");

    if (stderr) throw new Error(stderr);
    return stdout;
  } catch (error) {
    throw new Error(`Python execution error: ${error}`);
  }
};

const executeJavascriptCode = async (
  code: string,
  input: string
): Promise<string> => {
  try {
    await fs.writeFile("main.js", code);
    const { stdout, stderr } = await execPromise(`node main.js`, input);
    await fs.unlink("main.js");

    if (stderr) throw new Error(stderr);
    return stdout;
  } catch (error) {
    throw new Error(`JavaScript execution error: ${error}`);
  }
};

const executeJavaCode = async (
  code: string,
  input: string
): Promise<string> => {
  try {
    await fs.writeFile("Main.java", code);
    await execPromise(`javac Main.java`);
    const { stdout, stderr } = await execPromise(`java Main`, input);
    await fs.unlink("Main.java");
    await fs.unlink("Main.class");

    if (stderr) throw new Error(stderr);
    return stdout;
  } catch (error) {
    throw new Error(`Java execution error: ${error}`);
  }
};

const executeCCode = async (code: string, input: string): Promise<string> => {
  try {
    await fs.writeFile("main.c", code);
    await execPromise(`gcc main.c -o main`);
    const { stdout, stderr } = await execPromise(`./main`, input);
    await fs.unlink("main.c");
    await fs.unlink("main");

    if (stderr) throw new Error(stderr);
    return stdout;
  } catch (error) {
    throw new Error(`C execution error: ${error}`);
  }
};

const executeCppCode = async (code: string, input: string): Promise<string> => {
  try {
    await fs.writeFile("main.cpp", code);
    await execPromise(`g++ main.cpp -o main`);
    const { stdout, stderr } = await execPromise(`./main`, input);
    await fs.unlink("main.cpp");
    await fs.unlink("main");

    if (stderr) throw new Error(stderr);
    return stdout;
  } catch (error) {
    throw new Error(`C++ execution error: ${error}`);
  }
};

const execPromise = (
  command: string,
  input: string = ""
): Promise<{ stdout: string; stderr: string }> => {
  return new Promise((resolve, reject) => {
    const process = exec(command, (error, stdout, stderr) => {
      if (error) {
        reject({ stdout, stderr });
      } else {
        resolve({ stdout, stderr });
      }
    });

    if (input && process && process.stdin) {
      process.stdin.write(input);
      process.stdin.end();
    }
  });
};
