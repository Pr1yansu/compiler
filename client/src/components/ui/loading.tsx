import Lottie from "react-lottie";
import animationData from "@/assets/animations/loader.json";

const Loading = () => {
  const defaultOptions = {
    loop: true,
    autoplay: true,
    animationData: animationData,
    rendererSettings: {
      preserveAspectRatio: "xMidYMid slice",
    },
  };
  return (
    <div className="h-screen w-full flex justify-center items-center">
      <Lottie
        options={defaultOptions}
        height={600}
        width={600}
        isClickToPauseDisabled={true}
      />
    </div>
  );
};

export default Loading;
