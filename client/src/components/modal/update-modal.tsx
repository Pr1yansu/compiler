import { useUpdateQuestionModal } from "@/hooks/modal";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import QuestionForm from "../forms/question-form";

const UpdateModal = () => {
  const { isOpen, close, questionId } = useUpdateQuestionModal();
  const handleDelete = () => {
    console.log("Deleting question", questionId);
  };
  if (!isOpen) return null;
  return (
    <div
      className="fixed z-10 bg-black/40 inset-0 flex justify-center items-center p-2"
      onClick={close}
    >
      <div className="max-w-xl w-full" onClick={(e) => e.stopPropagation()}>
        <Card>
          <CardHeader>
            <CardTitle>Update Question</CardTitle>
          </CardHeader>
          <CardContent>
            <CardDescription>
              Are you sure you want to update this question?
            </CardDescription>
            <QuestionForm />
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default UpdateModal;
