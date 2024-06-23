import React from "react";
import {
  ResizableHandle,
  ResizablePanel,
  ResizablePanelGroup,
} from "@/components/ui/resizable";
import { User } from "@/types/user";
import { useNavigate, useParams } from "react-router-dom";
import Question from "@/components/compiler/question";
import CompilationArea from "@/components/compiler/compilation-area";
import Output from "@/components/compiler/output";

interface Props {
  data: User;
}

const Home: React.FC<Props> = ({ data }) => {
  const navigate = useNavigate();
  const { id } = useParams();
  const [codeSubmitted, setCodeSubmitted] = React.useState(false);
  if (!data) navigate("/login");
  return (
    <section className="min-h-screen">
      <ResizablePanelGroup
        direction="horizontal"
        className="rounded-lg border min-h-screen"
      >
        <ResizablePanel>
          <Question data={data} />
        </ResizablePanel>
        <ResizableHandle withHandle />
        <ResizablePanel>
          <ResizablePanelGroup direction="vertical">
            <ResizablePanel>
              <CompilationArea setCodeSubmitted={setCodeSubmitted} id={id} />
            </ResizablePanel>
            <ResizableHandle withHandle />
            <ResizablePanel>
              <Output codeSubmitted={codeSubmitted} />
            </ResizablePanel>
          </ResizablePanelGroup>
        </ResizablePanel>
      </ResizablePanelGroup>
    </section>
  );
};

export default Home;
