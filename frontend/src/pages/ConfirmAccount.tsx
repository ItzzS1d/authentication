import { useEffect, useState } from "react";
import { Link, useNavigate, useSearchParams } from "react-router-dom";
import { handleConfirmAccount } from "../lib/api-client/userApi";
import { useToast } from "../hooks/use-toast";
import { ArrowLeft, Frown } from "lucide-react";
import { Button } from "../components/ui/button";

const ConfirmAccount = () => {
  const [params] = useSearchParams();
  const [error, setError] = useState<string>("");
  const navigate = useNavigate();
  const code = params.get("code");
  const { toast } = useToast();
  useEffect(() => {
    const fetch = async () => {
      try {
        const response = await handleConfirmAccount(code);
        if (response.status === 200 && response.statusText === "OK") {
          navigate("/login", { replace: true });
          toast({
            title: "Success",
            description: "Account created successfully",
          });
        }
      } catch (error) {
        setError(error.error);
        toast({
          title: "error",
          description: error.error,
          variant: "destructive",
        });
      }
    };
    fetch();
  }, [code]);

  return (
    <div className="w-full h-[80vh] flex flex-col gap-2 items-center justify-center rounded-md">
      <div className="size-[48px]">
        <Frown size="48px" className="animate-bounce text-red-500" />
      </div>
      <h2 className="text-xl tracking-[-0.16px] dark:text-[#fcfdffef] font-bold">
        Invalid or expired reset link
      </h2>
      <p className="mb-2 text-center text-sm text-muted-foreground dark:text-[#f1f7feb5] font-normal">
        You can request a new password reset link
      </p>
      <Link to="/forgot-password">
        <Button className="h-[40px]">
          <ArrowLeft />
          Go to forgot password
        </Button>
      </Link>
    </div>
  );
};

export default ConfirmAccount;
