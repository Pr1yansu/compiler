import { exec } from "child_process";
import type { Language, TestCase } from "@prisma/client";
import fs from "fs/promises";

export const executeCode = async (
  code: string,
  language: Language,
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

  return languageExecutors[language](code, userId)
    .then((output) => {
      return { status: "SUCCESS", output };
    })
    .catch((error) => {
      return { status: "ERROR", output: error.message };
    });
};

const execPromise = (command: string): Promise<string> => {
  return new Promise((resolve, reject) => {
    const process = exec(command, (error, stdout, stderr) => {
      if (error || stderr) return reject(stderr || error);
      resolve(stdout);
    });
  });
};

const executePythonCode = async (
  code: string,
  userId: string
): Promise<string> => {
  await fs.writeFile(`main-${userId}.py`, code);
  const output = await execPromise(`python main-${userId}.py`);
  await fs.unlink(`main-${userId}.py`);
  return output;
};

const executeJavascriptCode = async (
  code: string,
  userId: string
): Promise<string> => {
  await fs.writeFile(`main-${userId}.js`, code);
  const output = await execPromise(`node main-${userId}.js`);
  await fs.unlink(`main-${userId}.js`);
  return output;
};

const executeJavaCode = async (
  code: string,
  userId: string
): Promise<string> => {
  await fs.writeFile(`Main-${userId}.java`, code);
  await execPromise(`javac Main-${userId}.java`);
  const output = await execPromise(`java Main-${userId}`);
  await fs.unlink(`Main-${userId}.java`);
  await fs.unlink(`Main-${userId}.class`);
  return output;
};

const executeCCode = async (code: string, userId: string): Promise<string> => {
  await fs.writeFile(`main-${userId}.c`, code);
  await execPromise(`gcc main-${userId}.c -o main-${userId}`);
  const output = await execPromise(`./main-${userId}`);
  await fs.unlink(`main-${userId}.c`);
  return output;
};

const executeCppCode = async (
  code: string,
  userId: string
): Promise<string> => {
  await fs.writeFile(`main-${userId}.cpp`, code);
  await execPromise(`g++ main-${userId}.cpp -o main-${userId}`);
  const output = await execPromise(`./main-${userId}`);
  await fs.unlink(`main-${userId}.cpp`);
  return output;
};
