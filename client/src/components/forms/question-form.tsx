import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
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
import { useAddQuestionMutation } from "@/store/services/questionApi";
import { Difficulty } from "@/types/question";

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
  answer: z.string({
    required_error: "Answer is required",
  }),
  tags: z.string({
    required_error: "Tags are required",
  }),
});

const QuestionForm = () => {
  const [addQuestion] = useAddQuestionMutation();
  const form = useForm<z.infer<typeof QuestionFormSchema>>({
    resolver: zodResolver(QuestionFormSchema),
    defaultValues: {
      answer: "",
      description: "",
      difficulty: "EASY",
      tags: "",
      title: "",
    },
  });
  function onSubmit(values: z.infer<typeof QuestionFormSchema>) {
    const tagsArray: string[] = [];
    if (values.tags.length > 0) {
      const tags = values.tags;
      const tagsSplit = tags.split(",");
      tagsSplit.forEach((tag) => {
        tagsArray.push(tag.trim());
      });
    }
    const difficultyEnum = {
      EASY: Difficulty.EASY,
      MEDIUM: Difficulty.MEDIUM,
      HARD: Difficulty.HARD,
    };
    const difficultyValue = difficultyEnum[values.difficulty];
    const newValue = {
      ...values,
      tags: tagsArray,
      difficulty: difficultyValue,
    };
    addQuestion(newValue);
    console.log(newValue);
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
        <FormField
          control={form.control}
          name="answer"
          render={({ field }) => (
            <FormItem>
              <FormLabel>
                Answer <span className="text-red-500">*</span>
              </FormLabel>
              <FormControl>
                <Input placeholder="Select some tags" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <Button type="submit" size={"sm"}>
          Submit
        </Button>
      </form>
    </Form>
  );
};

export default QuestionForm;
