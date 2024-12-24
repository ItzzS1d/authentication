import { Link, useNavigate } from "react-router-dom";
import Logo from "../../components/Logo";
import Input from "../../components/Input";
import { Button } from "../../components/ui/button";
import { ArrowRight, Loader } from "lucide-react";
import { useForm } from "react-hook-form";
import { handleLogin } from "../../lib/api-client/userApi";
import { useState } from "react";
import { toast } from "../../hooks/use-toast";

export type LoginFormData = {
  email: string;
  password: string;
};
const Login = () => {
  const [error, setError] = useState<string>("");
  const [loading, setLoading] = useState<boolean>(false);
  const navigate = useNavigate();
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<LoginFormData>();
  const handleFormSubmit = async (formData: LoginFormData) => {
    try {
      setLoading(true);
      await handleLogin(formData);

      navigate("/");
      toast({
        title: "Welcome back",
      });
    } catch (err: unknown) {
      const { error } = err;
      if (error === "mfa required") {
        navigate(`/verify-mfa/?email=${formData.email}`);
        return;
      } else {
        setError(error);
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div>
      <div className="mb-6">
        <Logo />
      </div>
      <div className="space-y-1">
        <h1>Welcome Back</h1>
        <div className="flex gap-1">
          <p>Don't have an account?</p>{" "}
          <Link to="/register" className="text-blue-500 hover:underline">
            Sign up
          </Link>
        </div>
      </div>
      <form
        className="flex flex-col gap-3 mt-4"
        onSubmit={handleSubmit(handleFormSubmit)}
      >
        <div>
          <Input
            label="Email"
            inputType="text"
            {...register("email", {
              required: "email is required",
              pattern: {
                value: /[A-Z0-9._%+-]+@[A-Z0-9-]+.+.[A-Z]{2,4}/gim,
                message: "enter a valid email",
              },
            })}
          />
          {errors.email && (
            <p className="text-red-500 text-sm font-semibold">
              {errors.email.message}
            </p>
          )}
        </div>
        <div>
          <Input
            label="Password"
            inputType="password"
            {...register("password", { required: "password is required" })}
          />
          {errors.password && (
            <p className="text-red-500 text-sm font-semibold">
              {errors.password.message}
            </p>
          )}
          {error && (
            <p className="text-red-500 text-sm font-semibold mt-2">{error}</p>
          )}
          <div className="flex justify-end mt-1">
            <Link to={"/forgot-password"} className="hover:underline">
              Forgot password?
            </Link>
          </div>
        </div>
        <Button
          disabled={loading}
          className="w-[100%] text-[15px] h-[40px]  font-semibold "
          type="submit"
        >
          {loading && <Loader className="animate-spin" />}
          Sign in
          <ArrowRight />
        </Button>
      </form>
    </div>
  );
};

export default Login;
