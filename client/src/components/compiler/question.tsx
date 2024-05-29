import { useGetQuestionByIdQuery } from "@/store/services/questionApi";
import { User } from "@/types/user";
import { useParams } from "react-router-dom";
import Loading from "@/components/ui/loading";
import { Separator } from "@/components/ui/separator";
import { Badge } from "@/components/ui/badge";

const Question = ({ data: profile }: { data: User }) => {
  const { id } = useParams<{ id: string }>();
  if (!profile) return null;
  if (!id) return <div>You need to select a question</div>;
  const { data, isLoading, isError, error } = useGetQuestionByIdQuery(id);
  if (isLoading) return <Loading />;
  if (isError) return <div>ERROR</div>;
  if (!data) return <div>ERROR</div>;
  return (
    <div className="p-5">
      <h3 className="text-2xl font-bold text-gray-700">Question</h3>
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
      <h1 className="text-3xl font-bold text-gray-800 mt-2 mb-4">
        {data.problem?.title}
      </h1>
      <p className="text-gray-600 text-lg">{data.problem?.description}</p>
      <div className="flex flex-wrap gap-2 mt-3">
        {data.problem?.tags.map((tag) => (
          <Badge key={tag} variant={"outline"}>
            {tag}
          </Badge>
        ))}
      </div>
    </div>
  );
};

export default Question;
