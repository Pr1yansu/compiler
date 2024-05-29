import { Suspense, lazy, useEffect } from "react";
import { Route, Routes, useNavigate } from "react-router-dom";
import Loading from "@/components/ui/loading";
import { useGetUserQuery } from "@/store/services/userApi";
import DeleteModal from "@/components/modal/delete-question";
import UpdateModal from "@/components/modal/update-modal";
const Home = lazy(() => import("@/pages/home"));
const Login = lazy(() => import("@/components/auth/login"));
const Register = lazy(() => import("@/components/auth/register"));
const AllQuestions = lazy(() => import("@/pages/all-questions/all-questions"));

const App = () => {
  const navigate = useNavigate();
  const { data, isLoading, isError } = useGetUserQuery();

  useEffect(() => {
    if (isError) {
      navigate("/login");
    }
  }, []);

  if (isLoading) {
    return <Loading />;
  }

  return (
    <Suspense fallback={<Loading />}>
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
