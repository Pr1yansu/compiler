import { Suspense, lazy } from "react";
import { Route, Routes } from "react-router-dom";
import Loading from "@/components/ui/loading";
const Home = lazy(() => import("@/pages/home"));
const Login = lazy(() => import("@/components/auth/login"));
const Register = lazy(() => import("@/components/auth/register"));

const App = () => {
  return (
    <Suspense fallback={<Loading />}>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
      </Routes>
    </Suspense>
  );
};

export default App;
