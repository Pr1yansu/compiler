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
  }, [fields, setCurrentTestCaseIndex]);

  if (!isTestCasesModalOpen || currentTestCaseIndex === -1) return null;

  const handleNext = () => {
    if (currentTestCaseIndex < fields.length - 1) {
      setCurrentTestCaseIndex(currentTestCaseIndex + 1);
    }
  };

  const handlePrev = () => {
    if (currentTestCaseIndex > 0) {
      setCurrentTestCaseIndex(currentTestCaseIndex - 1);
    }
  };

  return (
    <div
      className="fixed inset-0 dark:bg-black/80 bg-black/40 flex justify-center items-center p-2"
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
          Test Case {currentTestCaseIndex + 1} of {fields.length}{" "}
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

        {fields.length > 0 && (
          <div className="flex space-x-2">
            <Button type="button" onClick={handlePrev} size={"sm"}>
              Previous
            </Button>
            <Button type="button" onClick={handleNext} size={"sm"}>
              Next
            </Button>
          </div>
        )}
        <div className="flex items-center justify-between">
          {fields.length > 0 && (
            <Button
              type="button"
              onClick={() => {
                remove(currentTestCaseIndex);
                setCurrentTestCaseIndex(currentTestCaseIndex - 1);
              }}
              size={"sm"}
              variant={"destructive"}
            >
              Remove Test Case
            </Button>
          )}
          <Button
            type="button"
            onClick={() => {
              const input = form.getValues(
                `testCases.${currentTestCaseIndex}.input`
              );
              const output = form.getValues(
                `testCases.${currentTestCaseIndex}.output`
              );

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
