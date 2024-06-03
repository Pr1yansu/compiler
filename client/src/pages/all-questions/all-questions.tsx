import { useGetQuestionsQuery } from "@/store/services/questionApi";
import { DataTable } from "./data-table";
import { columns } from "./columns";
import Loading from "@/components/ui/loading";
import { Button } from "@/components/ui/button";
import { Plus } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Skeleton } from "@/components/ui/skeleton";
import QuestionForm from "@/components/forms/question-form";
import { useGetUserQuery } from "@/store/services/userApi";

const Questions = () => {
  const { data, isLoading } = useGetQuestionsQuery();
  const { data: profile, isLoading: profileLoading } = useGetUserQuery();

  if (isLoading) {
    return <Loading />;
  }

  return (
    <div className="container mx-auto py-6 space-y-4">
      <h4 className="text-2xl font-bold text-gray-700 dark:text-foreground">
        All Questions
      </h4>
      <DataTable
        data={data && data.problems ? data.problems : []}
        columns={columns}
      />
      {profileLoading ? (
        <>
          <Skeleton className="w-[100px] h-[20px] rounded-full" />
        </>
      ) : (
        <>
          {profile &&
            profile.userProfile &&
            profile.userProfile.role === "ADMIN" && (
              <div className="flex justify-end">
                <Dialog>
                  <DialogTrigger asChild>
                    <Button>
                      ADD NEW QUESTION
                      <Plus size={16} className="ms-2" />
                    </Button>
                  </DialogTrigger>
                  <DialogContent>
                    <DialogHeader>
                      <DialogTitle>Add new Question</DialogTitle>
                      <DialogDescription asChild>
                        <p>
                          You can add a new question by filling in the form
                          below.
                        </p>
                      </DialogDescription>
                      <QuestionForm />
                    </DialogHeader>
                  </DialogContent>
                </Dialog>
              </div>
            )}
        </>
      )}
    </div>
  );
};

export default Questions;
