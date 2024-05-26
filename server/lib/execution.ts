import type { Language } from "@prisma/client";
import { exec } from "child_process";
import fs from "fs";

export const executeCode = async (
  code: string,
  language: Language,
  answer: string
) => {
  try {
    switch (language) {
      case "PYTHON":
        const pythonResult = await exceutePythonCode(code);
        if (pythonResult.trim() === answer.trim()) {
          return {
            status: "ACCEPTED",
            output: pythonResult.trim(),
          };
        }
        return {
          status: "REJECTED",
        };
      case "JAVASCRIPT":
        const javascriptResult = await exceuteJavascriptCode(code);
        if (javascriptResult.trim() === answer.trim()) {
          return {
            status: "ACCEPTED",
            output: javascriptResult.trim(),
          };
        }
        return {
          status: "REJECTED",
        };
      case "JAVA":
        const javaResult = await exceuteJavaCode(code);
        if (javaResult.trim() === answer.trim()) {
          return {
            status: "ACCEPTED",
            output: javaResult.trim(),
          };
        }
        return {
          status: "REJECTED",
        };
      case "C":
        const cResult = await exceuteCCode(code);
        if (cResult.trim() === answer.trim()) {
          return {
            status: "ACCEPTED",
            output: cResult.trim(),
          };
        }
        return {
          status: "REJECTED",
        };
      case "CPP":
        const cppResult = await exceuteCppCode(code);
        if (cppResult.trim() === answer.trim()) {
          return {
            status: "ACCEPTED",
            output: cppResult.trim(),
          };
        }
        return {
          status: "REJECTED",
        };
      default:
        console.log("Language not supported");
        return {
          status: "ERROR",
          error: "LANGUAGE_NOT_SUPPORTED",
        };
    }
  } catch (error) {
    console.log("ERROR_EXECUTING_CODE", error);
    return {
      status: "ERROR",
      error: "ERROR_EXECUTING_CODE",
    };
  }
};

const exceutePythonCode = async (code: string) => {
  return new Promise<string>((resolve, reject) => {
    fs.writeFile("main.py", code, (error) => {
      if (error) {
        reject(error);
      }

      exec("python main.py", (error, stdout, stderr) => {
        if (error) {
          reject(error);
          fs.unlink("main.py", (error) => {
            if (error) {
              console.log("ERROR_DELETING_PY_FILE", error);
            }
          });
        }

        resolve(stdout);
        fs.unlink("main.py", (error) => {
          if (error) {
            console.log("ERROR_DELETING_PY_FILE", error);
          }
        });
      });
    });
  });
};

const exceuteJavascriptCode = async (code: string) => {
  return new Promise<string>((resolve, reject) => {
    fs.writeFile("main.js", code, (error) => {
      if (error) {
        reject(error);
      }

      exec("node main.js", (error, stdout, stderr) => {
        if (error) {
          reject(error);
          fs.unlink("main.js", (error) => {
            if (error) {
              console.log("ERROR_DELETING_JS_FILE", error);
            }
          });
        }

        resolve(stdout);
        fs.unlink("main.js", (error) => {
          if (error) {
            console.log("ERROR_DELETING_JS_FILE", error);
          }
        });
      });
    });
  });
};

const exceuteJavaCode = async (code: string) => {
  return new Promise<string>((resolve, reject) => {
    fs.writeFile("Main.java", code, (error) => {
      if (error) {
        reject(error);
      }

      exec("javac Main.java", (error, stdout, stderr) => {
        if (error) {
          reject(error);
        }

        exec("java Main", (error, stdout, stderr) => {
          if (error) {
            reject(error);
            fs.unlink("Main.java", (error) => {
              if (error) {
                console.log("ERROR_DELETING_JAVA_FILE", error);
              }
            });
          }

          resolve(stdout);
          fs.unlink("Main.class", (error) => {
            if (error) {
              console.log("ERROR_DELETING_CLASS_FILE", error);
            }
          });
        });
      });
    });
  });
};

const exceuteCCode = async (code: string) => {
  return new Promise<string>((resolve, reject) => {
    fs.writeFile("main.c", code, (error) => {
      if (error) {
        reject(error);
      }

      exec("gcc main.c -o main", (error, stdout, stderr) => {
        if (error) {
          reject(error);
          fs.unlink("main.c", (error) => {
            if (error) {
              console.log("ERROR_DELETING_C_FILE", error);
            }
          });
        }

        exec("./main", (error, stdout, stderr) => {
          if (error) {
            reject(error);
            fs.unlink("main", (error) => {
              if (error) {
                console.log("ERROR_DELETING_C_FILE", error);
              }
            });
          }

          resolve(stdout);
          fs.unlink("main.c", (error) => {
            if (error) {
              console.log("ERROR_DELETING_C_FILE", error);
            }
          });
        });
      });
    });
  });
};

const exceuteCppCode = async (code: string) => {
  return new Promise<string>((resolve, reject) => {
    fs.writeFile("main.cpp", code, (error) => {
      if (error) {
        reject(error);
      }

      exec("g++ main.cpp -o main", (error, stdout, stderr) => {
        if (error) {
          reject(error);
          fs.unlink("main.cpp", (error) => {
            if (error) {
              console.log("ERROR_DELETING_CPP_FILE", error);
            }
          });
        }

        exec("./main", (error, stdout, stderr) => {
          if (error) {
            reject(error);
            fs.unlink("main", (error) => {
              if (error) {
                console.log("ERROR_DELETING_CPP_FILE", error);
              }
            });
          }

          resolve(stdout);
          fs.unlink("main.cpp", (error) => {
            if (error) {
              console.log("ERROR_DELETING_CPP_FILE", error);
            }
          });
        });
      });
    });
  });
};
