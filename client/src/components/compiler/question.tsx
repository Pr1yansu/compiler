import { useGetQuestionByIdQuery } from "@/store/services/questionApi";
import { User } from "@/types/user";
import { useParams } from "react-router-dom";
import Loading from "@/components/ui/loading";
import { Separator } from "@/components/ui/separator";
import { Badge } from "@/components/ui/badge";
import { formatLocalDate } from "@/lib/format-date";

const Question = ({ data: profile }: { data: User }) => {
  const { id } = useParams<{ id: string }>();
  const { data, isLoading, isError } = useGetQuestionByIdQuery(id ?? "");
  if (!profile) return null;
  if (!id) return <div>You need to select a question</div>;
  if (isLoading) return <Loading />;
  if (isError) return <div>ERROR</div>;
  if (!data) return <div>ERROR</div>;
  return (
    <div className="p-5">
      <h3 className="text-2xl font-bold text-gray-700 dark:text-gray-100">
        Question
      </h3>
      <h4
        className={`text-sm font-bold ${
          data.problem?.difficulty === "EASY"
            ? "text-green-500"
            : data.problem?.difficulty === "MEDIUM"
            ? "text-yellow-500"
            : "text-red-500"
        }`}
      >
        {data.problem?.difficulty}
      </h4>
      <Separator />
      <h1 className="text-3xl font-bold text-gray-800 mt-2 mb-4 dark:text-gray-300">
        {data.problem?.title}
      </h1>
      <p className="text-gray-600 text-base font-medium dark:text-gray-400">
        {data.problem?.description}
      </p>
      <div className="flex flex-wrap gap-2 mt-3">
        {data.problem?.tags.map((tag) => (
          <Badge key={tag} variant={"outline"}>
            {tag}
          </Badge>
        ))}
      </div>
      <div className="mt-5 rounded-md">
        {data.problem?.TestCase.map((testCase, _) => (
          <div
            key={_}
            className="p-3 shadow-md hover:shadow-none duration-300 cursor-pointer bg-gray-50  dark:bg-zinc-900 rounded-md mt-2"
          >
            <h4 className="text-lg font-semibold text-gray-700 dark:text-gray-100">
              Test Case {_ + 1}
            </h4>
            <div className="flex gap-6 flex-wrap">
              <div className="space-y-2">
                <h5 className="text-base font-medium text-gray-600 dark:text-gray-400">
                  Input
                </h5>
                <p className="text-sm font-light text-gray-500 dark:text-gray-300">
                  {testCase.input}
                </p>
              </div>
              <div className="space-y-2">
                <h5 className="text-base font-medium text-gray-600 dark:text-gray-400">
                  Output
                </h5>
                <p className="text-sm font-light text-gray-500 dark:text-gray-300">
                  {testCase.output}
                </p>
              </div>
            </div>
          </div>
        ))}
      </div>
      {data.problem?.createdAt && (
        <div className="mt-4">
          <h4 className="text-lg font-semibold text-gray-700 dark:text-gray-100">
            Created At
          </h4>
          <p className="text-sm font-light text-gray-500 dark:text-gray-300">
            {formatLocalDate(data.problem?.createdAt)}
          </p>
        </div>
      )}
    </div>
  );
};

export default Question;
