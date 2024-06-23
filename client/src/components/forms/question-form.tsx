import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm, useFieldArray } from "react-hook-form";
import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import {
  useAddQuestionMutation,
  useGetQuestionByIdQuery,
  useUpdateQuestionMutation,
} from "@/store/services/questionApi";
import { useNavigate } from "react-router-dom";
import { useUpdateQuestionModal } from "@/hooks/modal";
import { useEffect } from "react";
import Loading from "@/components/ui/loading";
import TestCasesModal from "../modal/testcases";
import { Plus } from "lucide-react";
import { useTestCasesModal } from "@/hooks/modal";

const QuestionFormSchema = z.object({
  title: z.string({
    required_error: "Title is required",
  }),
  description: z.string({
    required_error: "Description is required",
  }),
  difficulty: z.enum(["EASY", "MEDIUM", "HARD"], {
    required_error: "Difficulty is required",
  }),
  testCases: z.array(
    z.object({
      input: z.string(),
      output: z.string(),
    })
  ),
  tags: z.string({
    required_error: "Tags are required",
  }),
});

const QuestionForm = () => {
  const navigate = useNavigate();
  const { questionId } = useUpdateQuestionModal();
  const { data: question, isLoading } = useGetQuestionByIdQuery(questionId);
  const { open: openTestCasesModal } = useTestCasesModal();

  const [updateQuestion] = useUpdateQuestionMutation();
  const [addQuestion] = useAddQuestionMutation();

  const form = useForm<z.infer<typeof QuestionFormSchema>>({
    resolver: zodResolver(QuestionFormSchema),
    defaultValues: {
      testCases: [{ input: "", output: "" }],
      description: "",
      difficulty: "EASY",
      tags: "",
      title: "",
    },
  });

  const { fields, append, remove } = useFieldArray({
    control: form.control,
    name: "testCases",
  });

  useEffect(() => {
    if (questionId && question && question.problem) {
      form.setValue("title", question.problem.title);
      form.setValue("description", question.problem.description);
      form.setValue("difficulty", question.problem.difficulty);
      form.setValue("tags", question.problem.tags.join(","));
      form.setValue("testCases", question.problem.TestCase);
    }
  }, [question, questionId, form]);

  async function onSubmit(values: z.infer<typeof QuestionFormSchema>) {
    try {
      const tagsArray: string[] = [];
      if (values.tags.length > 0) {
        const tags = values.tags;
        const tagsSplit = tags.split(",");
        tagsSplit.forEach((tag) => {
          tagsArray.push(tag.trim());
        });
      }
      const testCases = values.testCases.filter(
        (testCase) => testCase.input && testCase.output
      );
      const newValue = {
        ...values,
        TestCase: testCases,
        tags: tagsArray,
      };

      if (questionId && question && question.problem) {
        const { data, error } = await updateQuestion({
          ...newValue,
          id: questionId,
        });
        if (data && data.problem) {
          navigate(0);
          return;
        }
        if (error) {
          console.log("ERROR_UPDATING_QUESTION", error);
          return;
        }
        return;
      }

      const { data, error } = await addQuestion(newValue);

      if (data && data.problem) {
        navigate(0);
      }
      if (error) {
        console.log("ERROR_ADDING_QUESTION", error);
        return;
      }
    } catch (error) {
      console.log("ERROR_ADDING_QUESTION", error);
      return;
    }
  }

  if (isLoading) {
    return <Loading />;
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-2">
        <FormField
          control={form.control}
          name="title"
          render={({ field }) => (
            <FormItem>
              <FormLabel>
                Title <span className="text-red-500">*</span>
              </FormLabel>
              <FormControl>
                <Input placeholder="Enter title of the problem" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="description"
          render={({ field }) => (
            <FormItem>
              <FormLabel>
                Description <span className="text-red-500">*</span>
              </FormLabel>
              <FormControl>
                <Textarea placeholder="Insert description" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <Label htmlFor="difficulty">
          Difficulty <span className="text-red-500">*</span>
        </Label>
        <Select
          defaultValue={
            questionId && question ? question.problem?.difficulty : ""
          }
          onValueChange={(value) => {
            const typedValue = value as "EASY" | "MEDIUM" | "HARD";
            form.setValue("difficulty", typedValue);
          }}
        >
          <SelectTrigger className="w-[180px]">
            <SelectValue placeholder="Difficulty" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="EASY">EASY</SelectItem>
            <SelectItem value="MEDIUM">MEDIUM</SelectItem>
            <SelectItem value="HARD">HARD</SelectItem>
          </SelectContent>
        </Select>
        <FormField
          control={form.control}
          name="tags"
          render={({ field }) => (
            <FormItem>
              <FormLabel>
                Tags <span className="text-red-500">*</span>
              </FormLabel>
              <FormControl>
                <Input placeholder="Select some tags" {...field} />
              </FormControl>
              <FormDescription>
                Separate tags with commas (e.g. array, sorting,
                dynamic-programming)
              </FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />
        <div className="flex items-center justify-between">
          <TestCasesModal
            form={form}
            fields={fields}
            append={append}
            remove={remove}
          />
          <Button
            type="button"
            size={"sm"}
            variant={"outline"}
            onClick={openTestCasesModal}
          >
            <Plus size={16} />
          </Button>
        </div>
        <Button type="submit" size={"sm"}>
          {questionId && question && question.problem
            ? "Update Question"
            : "Add Question"}
        </Button>
      </form>
    </Form>
  );
};

export default QuestionForm;
