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
import { Link } from "react-router-dom";
import { useRegisterMutation } from "@/store/services/userApi";
import { motion as m, AnimatePresence } from "framer-motion";
import { Separator } from "@/components/ui/separator";
import { Mail, Loader2 } from "lucide-react";
import { FaGithubAlt } from "react-icons/fa";
import { FcGoogle } from "react-icons/fc";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

const classes = {
  loginContainer: "w-full h-screen flex justify-center items-center p-3",
};

const Register = () => {
  const [register, { isLoading }] = useRegisterMutation();
  const [error, setError] = useState<string | null>(null);
  const [data, setData] = useState({
    email: "",
    password: "",
    confirmPassword: "",
    firstName: "",
    lastName: "",
    role: "",
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

  useEffect(() => {
    if (data.firstName.length < 1) {
      setError(null);
      return;
    }

    if (data.firstName.match(/[^a-zA-Z]/)) {
      setError("First name and last name should only contain alphabets.");
    } else {
      setError(null);
    }
  }, [data.firstName]);

  useEffect(() => {
    if (data.lastName.length < 1) {
      setError(null);
      return;
    }
    if (data.lastName.match(/[^a-zA-Z]/)) {
      setError("First name and last name should only contain alphabets.");
    } else {
      setError(null);
    }
  }, [data.lastName]);

  const handleEmailLogin = async () => {
    try {
      if (!data.email || !data.password || !data.firstName || !data.lastName) {
        setError("Please fill in all fields.");
        return;
      }
      if (data.password !== data.confirmPassword) {
        setError("Passwords do not match.");
        return;
      }
      const name = `${data.firstName} ${data.lastName}`;

      const newData = {
        email: data.email,
        password: data.password,
        name,
        role: data.role ? data.role : ("USER" as any),
      };

      await register(newData).unwrap();

      setError(null);
    } catch (error) {
      console.log(error);

      if ((error as any).data) {
        setError((error as any).data.message);
      } else {
        setError("An error occurred. Please try again.");
      }
    } finally {
      setData({
        email: "",
        password: "",
        confirmPassword: "",
        firstName: "",
        lastName: "",
        role: "",
      });
    }
  };

  const handleGithubLogin = () => {
    window.open(
      `${import.meta.env.VITE_BACKEND_URL}/api/v1/user/github`,
      "_self"
    );
  };

  const handleGoogleLogin = () => {
    window.open(
      `${import.meta.env.VITE_BACKEND_URL}/api/v1/user/google`,
      "_self"
    );
  };

  return (
    <section className={classes.loginContainer}>
      <Card className="w-120">
        <CardHeader>
          <CardTitle className="text-xl font-bold">REGISTER WITH US</CardTitle>
          <CardDescription>
            You can use the compiler after signing up free of charge.😊
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-2">
          <div className="grid-cols-2 grid gap-2">
            <div className="col-span-1">
              <Label htmlFor="firstName">
                First Name
                <span className="text-red-500 ms-1">*</span>
              </Label>
              <Input
                id="firstName"
                type="text"
                placeholder="Enter your first name"
                className="mt-1"
                value={data.firstName}
                onChange={(e) =>
                  setData({ ...data, firstName: e.target.value })
                }
              />
            </div>
            <div className="col-span-1">
              <Label htmlFor="lastName">
                Last Name
                <span className="text-red-500 ms-1">*</span>
              </Label>
              <Input
                id="lastName"
                type="text"
                placeholder="Enter your last name"
                className="mt-1"
                value={data.lastName}
                onChange={(e) => setData({ ...data, lastName: e.target.value })}
              />
            </div>
          </div>
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
          <div>
            <Label htmlFor="role">
              Role
              <span className="text-muted-foreground ms-1 text-sm">
                (optional)
              </span>
            </Label>
            <Select
              onValueChange={(value) => setData({ ...data, role: value })}
            >
              <SelectTrigger className="w-full">
                <SelectValue placeholder="Select role" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="USER">User</SelectItem>
                <SelectItem value="ADMIN">Admin</SelectItem>
              </SelectContent>
            </Select>
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
          <div className="flex justify-end gap-2 text-sm">
            <h4> have an account? </h4>
            <Link
              to="/login"
              className="text-primary font-bold hover:underline"
            >
              Login
            </Link>
          </div>
        </CardContent>
        <CardFooter className="flex-wrap gap-2">
          <Button
            className="w-full text-zinc-700"
            variant={"outline"}
            disabled={isLoading}
            onClick={handleEmailLogin}
          >
            {isLoading ? (
              <Loader2 className="w-5 h-5 animate-spin" />
            ) : (
              <>
                Register with email
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
            disabled={isLoading}
            onClick={handleGoogleLogin}
          >
            Login with google
            <FcGoogle className="w-5 h-5 ml-2" />
          </Button>
          <Button
            className="w-full bg-gray-800 hover:bg-gray-800/90"
            disabled={isLoading}
            onClick={handleGithubLogin}
          >
            Login with github
            <FaGithubAlt className="w-5 h-5 ml-2" />
          </Button>
        </CardFooter>
      </Card>
    </section>
  );
};

export default Register;
