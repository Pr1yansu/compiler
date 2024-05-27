import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { useLoginMutation } from "@/store/services/userApi";
import { motion as m, AnimatePresence } from "framer-motion";
import { useNavigate, Link } from "react-router-dom";
import { Separator } from "@/components/ui/separator";
import { Mail, Loader2 } from "lucide-react";
import { FaGithubAlt } from "react-icons/fa";
import { FcGoogle } from "react-icons/fc";

const classes = {
  loginContainer: "w-full h-screen flex justify-center items-center p-3",
};

const Login = () => {
  const navigate = useNavigate();
  const [login] = useLoginMutation();
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const [data, setData] = useState({
    email: "",
    password: "",
    confirmPassword: "",
  });

  useEffect(() => {
    if (data.password.length < 1) {
      setError(null);
      return;
    }
    if (data.confirmPassword.length < 1) {
      setError(null);
      return;
    }
    if (data.password !== data.confirmPassword) {
      setError("Passwords do not match.");
    } else {
      setError(null);
    }
  }, [data.password, data.confirmPassword]);

  const handleEmailLogin = async () => {
    try {
      setLoading(true);
      if (!data.email || !data.password) {
        setError("Please fill in all fields.");
        return;
      }
      await login({
        email: data.email,
        password: data.password,
      }).unwrap();
      navigate("/");
    } catch (error) {
      console.log(error);
      if ((error as any).data.message) {
        setError((error as any).data.message);
        return;
      }
      setError("Credentials do not match. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const handleGithubLogin = () => {};

  const handleGoogleLogin = () => {};

  return (
    <section className={classes.loginContainer}>
      <Card className="w-120">
        <CardHeader>
          <CardTitle className="text-xl font-bold">LOGIN WITH US</CardTitle>
          <CardDescription>
            You can use the compiler after signing up free of charge.😊
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-2">
          <div>
            <Label htmlFor="email">
              Email
              <span className="text-red-500 ms-1">*</span>
            </Label>
            <Input
              id="email"
              type="email"
              placeholder="Enter your email"
              className="mt-1"
              value={data.email}
              onChange={(e) => setData({ ...data, email: e.target.value })}
            />
          </div>
          <div>
            <Label htmlFor="password">
              Password
              <span className="text-red-500 ms-1">*</span>
            </Label>
            <Input
              id="password"
              type="password"
              placeholder="Enter your password"
              className="mt-1"
              value={data.password}
              onChange={(e) => setData({ ...data, password: e.target.value })}
            />
          </div>
          <div>
            <Label htmlFor="confirmPassword">
              Confirm Password
              <span className="text-red-500 ms-1">*</span>
            </Label>
            <Input
              id="confirmPassword"
              type="password"
              placeholder="Confirm your password"
              className="mt-1"
              value={data.confirmPassword}
              onChange={(e) =>
                setData({ ...data, confirmPassword: e.target.value })
              }
            />
          </div>
          <AnimatePresence>
            {error && (
              <m.p
                className="text-red-500 text-sm text-center bg-red-500/20 p-2 rounded-md font-semibold"
                initial={{ opacity: 0, x: "-50%" }}
                animate={{ opacity: 1, x: "0%" }}
                exit={{ opacity: 0, x: "-50%" }}
              >
                {error}
              </m.p>
            )}
          </AnimatePresence>
          <div>
            <h4>Don&apos;t have an account? </h4>
            <Link to="/register" className="text-accent hover:underline">
              Register
            </Link>
          </div>
        </CardContent>
        <CardFooter className="flex-wrap gap-2">
          <Button
            className="w-full text-zinc-700"
            variant={"outline"}
            disabled={loading}
            onClick={handleEmailLogin}
          >
            {loading ? (
              <Loader2 className="w-5 h-5 animate-spin" />
            ) : (
              <>
                Login with email
                <Mail className="w-5 h-5 ml-2" />
              </>
            )}
          </Button>
          <div className="relative my-2 w-full">
            <Separator />
            <span className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 px-3 bg-background text-muted-foreground font-semibold">
              or
            </span>
          </div>
          <Button
            className="w-full"
            disabled={loading}
            onClick={handleGithubLogin}
          >
            Login with google
            <FcGoogle className="w-5 h-5 ml-2" />
          </Button>
          <Button
            className="w-full bg-gray-800 hover:bg-gray-800/90"
            disabled={loading}
            onClick={handleGoogleLogin}
          >
            Login with github
            <FaGithubAlt className="w-5 h-5 ml-2" />
          </Button>
        </CardFooter>
      </Card>
    </section>
  );
};

export default Login;
