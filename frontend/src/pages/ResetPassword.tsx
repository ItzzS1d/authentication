import { useNavigate, useSearchParams } from "react-router-dom";
import { Button } from "../components/ui/button";
import { ArrowRight, Loader } from "lucide-react";
import Input from "../components/Input";
import Logo from "../components/Logo";
import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { handleResetPassword } from "../lib/api-client/userApi";
import { toast } from "../hooks/use-toast";

export type ResetPWTypes = {
  password: string;
  confirmPassword: string;
  verificationCode: string;
};

const ResetPassword = () => {
  const [params] = useSearchParams();
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string>("");
  const navigate = useNavigate();
  const verificationCode = params.get("code");
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<ResetPWTypes>();

  const handleFormSubmit = async (formData: ResetPWTypes) => {
    if (formData.password !== formData.confirmPassword) {
      setError("password does not match");
      return;
    }

    try {
      setLoading(true);
      const { data } = await handleResetPassword({
        password: formData.password,
        verificationCode,
      });
      navigate("/login");
      toast({
        title: "password reset successfully",
      });
    } catch (error) {
      setError(error.error);
    } finally {
      setLoading(false);
      setError("");
    }
  };

  useEffect(() => {
    if (!verificationCode) {
      navigate("/forgot-password");
    }
  }, []);
  return (
    <div>
      <div>
        <div className="mb-4">
          <Logo />
        </div>
        <div className="space-y-1">
          <h1 className="font-semibold text-xl">Set up a new password</h1>
          <div className="flex gap-1">
            <p>Your password must be different from previous one</p>{" "}
          </div>
        </div>
        <form
          className="flex flex-col gap-5 mt-4"
          onSubmit={handleSubmit(handleFormSubmit)}
        >
          <div>
            <Input
              label="Password"
              inputType="password"
              {...register("password", {
                required: "password is required",
              })}
            />
            {errors.password && (
              <p className="text-red-500 text-sm font-semibold">
                {errors.password.message}
              </p>
            )}
            {error && (
              <p className="text-red-500 text-sm font-semibold">{error}</p>
            )}
          </div>
          <div>
            <Input
              label="Confirm password"
              inputType="password"
              {...register("confirmPassword", {
                required: "confirm password is required",
              })}
            />
            {errors.confirmPassword && (
              <p className="text-red-500 text-sm font-semibold">
                {errors.confirmPassword.message}
              </p>
            )}
            {error && (
              <p className="text-red-500 text-sm font-semibold">{error}</p>
            )}
          </div>

          <Button
            disabled={loading}
            className="w-full text-[15px] h-[40px]  font-semibold"
            type="submit"
          >
            {loading && <Loader className="animate-spin " />}
            Reset Password
            <ArrowRight />
          </Button>
        </form>
      </div>
    </div>
  );
};

export default ResetPassword;
