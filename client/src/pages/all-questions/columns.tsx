import { Button } from "@/components/ui/button";
import { formatLocalDate } from "@/lib/format-date";
import { Question } from "@/types/question";
import { ColumnDef } from "@tanstack/react-table";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { Pen, SendHorizonal, Trash2 } from "lucide-react";
import { useGetUserQuery } from "@/store/services/userApi";
const Actions = () => {
  const { data } = useGetUserQuery();
  const AuthorizeRoles = ["ADMIN"];
  if (!data) return null;
  if (!data.userProfile) return null;
  return (
    <div className="flex items-center space-x-2">
      {data.userProfile.role === "ADMIN" && (
        <>
          <TooltipProvider>
            <Tooltip>
              <TooltipTrigger asChild>
                <Button
                  variant={"outline"}
                  size={"icon"}
                  className="text-blue-500"
                >
                  <Pen size={16} />
                </Button>
              </TooltipTrigger>
              <TooltipContent>Edit Question</TooltipContent>
            </Tooltip>
          </TooltipProvider>
          <TooltipProvider>
            <Tooltip>
              <TooltipTrigger asChild>
                <Button
                  variant={"outline"}
                  size={"icon"}
                  className="text-red-400"
                >
                  <Trash2 size={16} />
                </Button>
              </TooltipTrigger>
              <TooltipContent>Delete Question</TooltipContent>
            </Tooltip>
          </TooltipProvider>
        </>
      )}
      <TooltipProvider>
        <Tooltip>
          <TooltipTrigger asChild>
            <Button variant={"outline"} size={"icon"} className="text-zinc-400">
              <SendHorizonal size={16} />
            </Button>
          </TooltipTrigger>
          <TooltipContent>Attend Question</TooltipContent>
        </Tooltip>
      </TooltipProvider>
    </div>
  );
};

export const columns: ColumnDef<Question>[] = [
  {
    accessorKey: "title",
    header: "Title",
    cell: ({ row }) => {
      return <div className="w-40 truncate">{row.original.title}</div>;
    },
  },
  {
    accessorKey: "description",
    header: "Description",
    cell: ({ row }) => {
      return <div className="w-20 truncate">{row.original.description}</div>;
    },
  },
  {
    accessorKey: "difficulty",
    header: "Difficulty",
    cell: ({ row }) => {
      return (
        <span className="px-2 py-1 text-xs font-semibold text-white bg-green-500 rounded-full">
          {row.original.difficulty}
        </span>
      );
    },
  },
  {
    accessorKey: "tags",
    header: "Tags",
    cell: ({ row }) => row.original.tags.join(", "),
  },
  {
    accessorKey: "createdAt",
    header: "Created At",
    cell: ({ row }) => {
      return <div>{formatLocalDate(row.original.createdAt)}</div>;
    },
  },
  {
    header: "Actions",
    cell: () => <Actions />,
  },
];