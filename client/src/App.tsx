import { Suspense, lazy } from "react";
import { Route, Routes, useNavigate } from "react-router-dom";
import Loading from "@/components/ui/loading";
import { useGetUserQuery } from "@/store/services/userApi";
const Home = lazy(() => import("@/pages/home"));
const Login = lazy(() => import("@/components/auth/login"));
const Register = lazy(() => import("@/components/auth/register"));

const App = () => {
  const navigate = useNavigate();
  const { data, isLoading, isError } = useGetUserQuery();

  if (isLoading) {
    return <Loading />;
  }

  if (isError) {
    navigate("/login");
  }

  return (
    <Suspense fallback={<Loading />}>
      <Routes>
        {data && <Route path="/" element={<Home />} />}
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
      </Routes>
    </Suspense>
  );
};

export default App;
