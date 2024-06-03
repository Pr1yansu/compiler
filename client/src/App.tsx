import { Suspense, lazy } from "react";
import { Route, Routes, useNavigate } from "react-router-dom";
import Loading from "@/components/ui/loading";
import { useGetUserQuery } from "@/store/services/userApi";
import DeleteModal from "@/components/modal/delete-question";
import UpdateModal from "@/components/modal/update-modal";
import { ModeToggle } from "./components/theme/mode-toggle";
import { Toaster } from "@/components/ui/toaster";
const Home = lazy(() => import("@/pages/home"));
const Login = lazy(() => import("@/components/auth/login"));
const Register = lazy(() => import("@/components/auth/register"));
const AllQuestions = lazy(() => import("@/pages/all-questions/all-questions"));

const App = () => {
  const navigate = useNavigate();
  const { data, isLoading, isError } = useGetUserQuery();

  if (isLoading) {
    return <Loading />;
  }

  if (isError) {
    navigate("/login");
  }

  if (!data) {
    navigate("/login");
  }

  return (
    <Suspense fallback={<Loading />}>
      <ModeToggle />
      <Toaster />
      <Routes>
        {data && data.userProfile && (
          <>
            <Route path="/" element={<AllQuestions />} />
            <Route path="/:id" element={<Home data={data.userProfile} />} />
          </>
        )}

        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
      </Routes>
      <DeleteModal />
      <UpdateModal />
    </Suspense>
  );
};

export default App;
