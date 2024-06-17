import MonacoEditor from "@monaco-editor/react";
import { useTheme } from "@/components/theme/theme-provider";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useState, useEffect } from "react";
import { frontendTemplates } from "@/components/template/templates";
import { Button } from "@/components/ui/button";

const languages = [
  { label: "JavaScript", value: "javascript" },
  { label: "Python", value: "python" },
  { label: "Java", value: "java" },
  { label: "C", value: "c" },
  { label: "C++", value: "cpp" },
];

const CompilationArea = ({
  setCodeSubmitted,
}: {
  setCodeSubmitted: React.Dispatch<React.SetStateAction<boolean>>;
}) => {
  const { theme } = useTheme();
  const [selectedLanguage, setSelectedLanguage] = useState<string>("default");
  const [loading, setLoading] = useState<boolean>(false);
  const [editorContent, setEditorContent] =
    useState<string>("choose a language");

  useEffect(() => {
    if (selectedLanguage === "default") {
      setEditorContent("choose a language");
    } else {
      const templateFunction =
        frontendTemplates[
          selectedLanguage.toUpperCase() as keyof typeof frontendTemplates
        ];
      const newContent = templateFunction || "// Start coding here...";
      setEditorContent(newContent);
    }
  }, [selectedLanguage]);

  const handleEditorChange = (value: string | undefined) => {
    setEditorContent(value || "");
  };

  const handleRunCode = async () => {
    try {
      setLoading(true);
      const userCode = editorContent
        .split("{")
        .slice(1)
        .join("{")
        .split("}")
        .slice(0, -1)
        .join("}");
      console.log(userCode);
      setCodeSubmitted(true);
    } catch (error) {
      console.log(error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="h-full space-y-3">
      <div className="px-3">
        <h1 className="text-2xl font-semibold">Code Editor</h1>
      </div>
      <div className="px-3 flex justify-between">
        <Select onValueChange={(value) => setSelectedLanguage(value as string)}>
          <SelectTrigger className="w-[180px]">
            <SelectValue placeholder="Choose language" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value={"default"}>Choose language</SelectItem>
            {languages.map((lang) => (
              <SelectItem key={lang.value} value={lang.value}>
                {lang.label}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
        <div className="px-3">
          <Button onClick={handleRunCode}>Run Code</Button>
        </div>
      </div>
      {selectedLanguage === "default" && (
        <div className="flex items-center justify-center h-full">
          <p className="text-lg text-gray-500">Please choose a language</p>
        </div>
      )}
      {selectedLanguage !== "default" && (
        <MonacoEditor
          height="100%"
          key={selectedLanguage}
          language={selectedLanguage}
          value={editorContent}
          loading={loading}
          onChange={handleEditorChange}
          theme={theme === "dark" ? "vs-dark" : "light"}
          options={{
            minimap: { enabled: false },
            fontSize: 16,
            wordWrap: "on",
            scrollBeyondLastLine: false,
            automaticLayout: true,
          }}
        />
      )}
    </div>
  );
};

export default CompilationArea;
