import { useDeleteQuestionModal } from "@/hooks/modal";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { useDeleteQuestionMutation } from "@/store/services/questionApi";
import { useNavigate } from "react-router-dom";

const DeleteModal = () => {
  const navigate = useNavigate();
  const { isOpen, close, questionId } = useDeleteQuestionModal();
  const [deleteQuestion] = useDeleteQuestionMutation();
  const handleDelete = async () => {
    try {
      await deleteQuestion(questionId);
      close();
      navigate(0);
    } catch (error) {
      console.error(error);
    }
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
            <CardTitle className="text-red-600 font-bold">
              Delete Question
            </CardTitle>
          </CardHeader>
          <CardContent>
            <CardDescription>
              Are you sure you want to delete this question?
            </CardDescription>
            <CardDescription>This action cannot be undone.</CardDescription>
          </CardContent>
          <CardFooter className="flex justify-end gap-4">
            <Button size={"sm"} variant={"outline"} onClick={close}>
              Cancel
            </Button>
            <Button size={"sm"} variant={"destructive"} onClick={handleDelete}>
              Delete
            </Button>
          </CardFooter>
        </Card>
      </div>
    </div>
  );
};

export default DeleteModal;
