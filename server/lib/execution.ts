import { exec } from "child_process";
import type { Language, TestCase } from "@prisma/client";
import fs from "fs/promises";
import { templates } from "./templates";

export const executeCode = async (
  code: string,
  language: Language,
  testCases: TestCase[],
  userId: string
) => {
  const languageExecutors = {
    PYTHON: executePythonCode,
    JAVASCRIPT: executeJavascriptCode,
    JAVA: executeJavaCode,
    C: executeCCode,
    CPP: executeCppCode,
  };

  if (!languageExecutors[language]) {
    throw new Error("Language not supported");
  }

  const template = templates[language](code);

  return Promise.all(
    testCases.map(async (testCase) => {
      const { input, output } = testCase;
      const result = await languageExecutors[language](template, input, userId);
      return result.trim() === output.trim()
        ? { status: "ACCEPTED", output: result.trim() }
        : { status: "REJECTED", output: result.trim() };
    })
  ).catch((error) => {
    return { status: "ERROR", output: error.message };
  });
};

const execPromise = (command: string, input: string = ""): Promise<string> => {
  return new Promise((resolve, reject) => {
    const process = exec(command, (error, stdout, stderr) => {
      if (error || stderr) return reject(stderr || error);
      resolve(stdout);
    });

    if (input && process.stdin) {
      process.stdin.write(input);
      process.stdin.end();
    }
  });
};

const executePythonCode = async (
  code: string,
  input: string,
  userId: string
): Promise<string> => {
  await fs.writeFile(`main-${userId}.py`, code);
  const output = await execPromise(`python main-${userId}.py`, input);
  await fs.unlink("main-${userId}.py");
  return output;
};

const executeJavascriptCode = async (
  code: string,
  input: string,
  userId: string
): Promise<string> => {
  await fs.writeFile(`main-${userId}.js`, code);
  const output = await execPromise(`node main-${userId}.js`, input);
  await fs.unlink("main.js");
  return output;
};

const executeJavaCode = async (
  code: string,
  input: string,
  userId: string
): Promise<string> => {
  await fs.writeFile(`Main-${userId}.java`, code);
  await execPromise(`javac Main-${userId}.java`);
  const output = await execPromise(`java Main-${userId}`, input);
  await fs.unlink(`Main-${userId}.java`);
  await fs.unlink(`Main-${userId}.class`);
  return output;
};

const executeCCode = async (
  code: string,
  input: string,
  userId: string
): Promise<string> => {
  await fs.writeFile("main.c", code);
  await execPromise("gcc main.c -o main");
  const output = await execPromise("./main", input);
  await fs.unlink("main.c");
  await fs.unlink("main");
  return output;
};

const executeCppCode = async (
  code: string,
  input: string,
  userId: string
): Promise<string> => {
  await fs.writeFile("main.cpp", code);
  await execPromise("g++ main.cpp -o main");
  const output = await execPromise("./main", input);
  await fs.unlink("main.cpp");
  await fs.unlink("main");
  return output;
};
