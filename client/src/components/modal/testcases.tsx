import { Button } from "@/components/ui/button";
import {
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { TestCase } from "@/types/question";
import { Input } from "@/components/ui/input";
import { useTestCasesModal } from "@/hooks/modal";
import { X } from "lucide-react";
import { useEffect } from "react";
import { useToast } from "@/components/ui/use-toast";

const TestCasesModal = ({
  fields,
  append,
  remove,
  form,
}: {
  fields: TestCase[];
  append: any;
  remove: any;
  form: any;
}) => {
  const { toast } = useToast();
  const {
    close: closeTestCasesModal,
    isOpen: isTestCasesModalOpen,
    currentTestCaseIndex,
    setCurrentTestCaseIndex,
  } = useTestCasesModal();

  useEffect(() => {
    if (fields.length > 0) {
      setCurrentTestCaseIndex(fields.length - 1);
    }
  }, [fields]);

  if (!isTestCasesModalOpen || currentTestCaseIndex === -1) return null;

  return (
    <div
      className="fixed -inset-full dark:bg-black/80 bg-black/40 flex justify-center items-center p-2"
      onClick={closeTestCasesModal}
    >
      <div
        onClick={(e) => e.stopPropagation()}
        className="bg-white rounded-md w-full max-w-md p-4 space-y-2 relative dark:bg-background dark:text-foreground"
      >
        <div className="absolute top-2 right-2">
          <button
            onClick={closeTestCasesModal}
            className="p-1 rounded-full hover:bg-gray-100"
            aria-label="Close modal"
          >
            <X size={16} />
          </button>
        </div>
        <FormLabel>
          Test Case {currentTestCaseIndex + 1}{" "}
          <span className="text-red-500">*</span>
        </FormLabel>
        <FormField
          control={form.control}
          name={`testCases.${currentTestCaseIndex}.input`}
          render={({ field }) => (
            <FormItem>
              <FormLabel>Input</FormLabel>
              <FormControl>
                <Input
                  placeholder="Test case input"
                  {...field}
                  value={form.getValues(
                    `testCases.${currentTestCaseIndex}.input`
                  )}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name={`testCases.${currentTestCaseIndex}.output`}
          render={({ field }) => (
            <FormItem>
              <FormLabel>Output</FormLabel>
              <FormControl>
                <Input
                  placeholder="Test case output"
                  {...field}
                  value={form.getValues(
                    `testCases.${currentTestCaseIndex}.output`
                  )}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <div className="flex items-center justify-between">
          <Button
            type="button"
            onClick={() => {
              remove(currentTestCaseIndex);
              setCurrentTestCaseIndex(-1);
            }}
            size={"sm"}
            variant={"destructive"}
          >
            Remove Test Case
          </Button>
          <Button
            type="button"
            onClick={() => {
              const input = form.getValues(
                `testCases.${currentTestCaseIndex}.input`
              );

              const output = form.getValues(
                `testCases.${currentTestCaseIndex}.output`
              );
              console.log(output);
              if (input === "" || output === "") {
                toast({
                  title: "Test case input and output cannot be empty",
                  description: "Please fill in the input and output fields",
                });
                return;
              }
              append({ input: "", output: "" });
            }}
            size={"sm"}
          >
            Add Another Test Case
          </Button>
        </div>
      </div>
    </div>
  );
};

export default TestCasesModal;
