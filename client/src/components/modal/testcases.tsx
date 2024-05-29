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
  const { close: closeTestCasesModal, isOpen: isTestCasesModalOpen } =
    useTestCasesModal();

  if (!isTestCasesModalOpen) return null;

  return (
    <div
      className="fixed -inset-full bg-black/40 flex justify-center items-center p-2"
      onClick={closeTestCasesModal}
    >
      <div
        onClick={(e) => e.stopPropagation()}
        className="bg-white rounded-md w-full max-w-md p-4 space-y-2 relative"
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
          Test Cases <span className="text-red-500">*</span>
        </FormLabel>
        {fields.map((field, index) => (
          <div key={index} className="space-y-2">
            <FormField
              control={form.control}
              name={`testCases.${index}.input`}
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Input</FormLabel>
                  <FormControl>
                    <Input placeholder="Test case input" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name={`testCases.${index}.output`}
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Output</FormLabel>
                  <FormControl>
                    <Input placeholder="Test case output" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <Button
              type="button"
              onClick={() => remove(index)}
              size={"sm"}
              variant={"destructive"}
            >
              Remove Test Case
            </Button>
          </div>
        ))}
        <div>
          <Button
            type="button"
            size={"sm"}
            onClick={() => append({ input: "", output: "" })}
          >
            Add Test Case
          </Button>
        </div>
      </div>
    </div>
  );
};

export default TestCasesModal;
