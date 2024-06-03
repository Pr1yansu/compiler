export const templates = {
  PYTHON: (code: string) => `
  def user_function(input):
  ${code
    .split("\n")
    .map((line) => "    " + line)
    .join("\n")}
  
  if __name__ == "__main__":
      import sys
      input = sys.stdin.read().strip()
      result = user_function(input)
      print(result)
  `,
  JAVASCRIPT: (code: string) => `
  function userFunction(input) {
  ${code
    .split("\n")
    .map((line) => "    " + line)
    .join("\n")}
  }
  
  const readline = require('readline');
  const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout,
    terminal: false
  });
  
  let input = '';
  rl.on('line', (line) => {
    input += line + '\\n';
  });
  
  rl.on('close', () => {
    const result = userFunction(input.trim());
    console.log(result);
  });
  `,
  JAVA: (code: string) => `
  import java.util.Scanner;
  
  public class Main {
    ${code
      .split("\n")
      .map((line) => "  " + line)
      .join("\n")}
  
    public static void main(String[] args) {
      Scanner sc = new Scanner(System.in);
      StringBuilder inputBuilder = new StringBuilder();
      while (sc.hasNextLine()) {
        inputBuilder.append(sc.nextLine()).append("\\n");
      }
      String input = inputBuilder.toString().trim();
      String output = userFunction(input);
      System.out.println(output);
    }
  }
  `,
  C: (code: string) => `
  #include <stdio.h>
  #include <string.h>
  
  ${code}
  
  int main() {
    char input[1024];
    char *result = NULL;
    size_t len = 0;
    while (fgets(input + len, sizeof(input) - len, stdin)) {
      len += strlen(input + len);
      if (len > 0 && input[len - 1] == '\\n') {
        input[len - 1] = '\\0';
        break;
      }
    }
    result = user_function(input);
    printf("%s", result);
    return 0;
  }
  `,
  CPP: (code: string) => `
  #include <iostream>
  #include <string>
  #include <sstream>
  
  using namespace std;
  
  ${code}
  
  int main() {
    stringstream inputBuffer;
    string line;
    while (getline(cin, line)) {
      inputBuffer << line << "\\n";
    }
    string input = inputBuffer.str();
    string output = user_function(input);
    cout << output;
    return 0;
  }
  `,
};
