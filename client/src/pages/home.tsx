import React from "react";
import {
  ResizableHandle,
  ResizablePanel,
  ResizablePanelGroup,
} from "@/components/ui/resizable";
import { User } from "@/types/user";
import { useNavigate } from "react-router-dom";
import Question from "@/components/compiler/question";

interface Props {
  data: User;
}

const Home: React.FC<Props> = ({ data }) => {
  const navigate = useNavigate();
  if (!data) navigate("/login");
  return (
    <section className="min-h-screen">
      <ResizablePanelGroup
        direction="horizontal"
        className="rounded-lg border min-h-screen"
      >
        <ResizablePanel>
          <Question />
        </ResizablePanel>
        <ResizableHandle withHandle />
        <ResizablePanel>
          <ResizablePanelGroup direction="vertical">
            <ResizablePanel>
              <span className="font-semibold">Two</span>
            </ResizablePanel>
            <ResizableHandle withHandle />
            <ResizablePanel>
              <span className="font-semibold">Three</span>
            </ResizablePanel>
          </ResizablePanelGroup>
        </ResizablePanel>
      </ResizablePanelGroup>
    </section>
  );
};

export default Home;
