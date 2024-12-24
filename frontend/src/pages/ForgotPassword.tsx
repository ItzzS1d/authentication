import React, { useState } from "react";
import { Link } from "react-router-dom";
import { Button } from "../components/ui/button";
import { ArrowRight, Loader, MailCheckIcon } from "lucide-react";
import Logo from "../components/Logo";
import { useForm } from "react-hook-form";
import Input from "../components/Input";
import { handleForgotPassword } from "../lib/api-client/userApi";

export type Email = {
  email: string;
};
const ForgotPassword = () => {
  const [loading, setLoading] = useState<boolean>(false);
  const [userEmail, setUserEmail] = useState<string | Email>("");
  const [error, setError] = useState<string>("");

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<Email>();
  const handleFormSubmit = async (email: Email) => {
    setLoading(true);
    try {
      const { data } = await handleForgotPassword(email);
      if (data.message) {
        setUserEmail(email.email);
      }
    } catch (error) {
      setError(error.error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div>
      {!userEmail ? (
        <div>
          <div className="mb-4">
            <Logo />
          </div>
          <div className="space-y-1">
            <h1 className="font-semibold text-xl">Create a Squeezy account</h1>
            <div className="flex gap-1">
              <p>Already have an account?</p>{" "}
              <Link to="/login" className="text-blue-500">
                Sign in
              </Link>
            </div>
          </div>
          <form
            className="flex flex-col gap-5 mt-4"
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
                    message: "enter a valid email address",
                  },
                })}
              />
              {errors.email && (
                <p className="text-red-500 text-sm font-semibold">
                  {errors.email.message}
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
              Send reset instructions
              <ArrowRight />
            </Button>
          </form>
        </div>
      ) : (
        <div className="w-full h-[80vh] flex flex-col gap-2 items-center justify-center rounded-md">
          <div className="size-[48px]">
            <MailCheckIcon size="48px" className="animate-bounce" />
          </div>
          <h2 className="text-xl tracking-[-0.16px] dark:text-[#fcfdffef] font-bold">
            Check your email
          </h2>
          <p className="mb-2 text-center text-sm text-muted-foreground dark:text-[#f1f7feb5] font-normal">
            We just sent a verification link to {userEmail}.
          </p>
          <Link to="/login">
            <Button className="h-[40px]">
              Go to login
              <ArrowRight />
            </Button>
          </Link>
        </div>
      )}
    </div>
  );
};

export default ForgotPassword;
