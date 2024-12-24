import { ComputerIcon, Trash2 } from "lucide-react";
import { Button } from "../ui/button";
import { parseUserAgent } from "../../lib/userAgentParser";
import { useEffect, useState } from "react";

type SessionItem = {
  id: string;
  userAgent: string;
  date: string;
  isCurrent?: boolean;
};
const SessionItem = ({ userAgent, date, isCurrent }: SessionItem) => {
  const [parsedData, setParsedData] = useState("");
  console.log(parsedData);
  useEffect(() => {
    if (date) {
      const data = parseUserAgent(userAgent, date);
      setParsedData(data);
    }
  }, [userAgent, date]);
  return (
    <div className="w-full flex items-center ">
      <div
        className="shrink-0 mr-[16px] flex items-center justify-center
       w-[48px] h-[48px] rounded-full border dorder-[#eee] dark:border-[rgb(42,45,48)]"
      >
        <ComputerIcon />
      </div>
      <div className="flex-1 flex items-center justify-between">
        <div className="flex-1">
          <h5 className="text-sm font-medium leading-1">
            {parsedData.deviceType}
          </h5>
          <div className="flex items-center">
            <span className="mr-[16px] text-[13px] text-muted-foreground font-normal">
              {parsedData.timeAgo}
            </span>
            {isCurrent && (
              <div
                className="bg-green-500/80 h-[20px] px-2 w-[81px] 
              flex items-center justify-center text-xs text-white rounded-lg"
              >
                Active now
              </div>
            )}
          </div>
        </div>

        {!isCurrent && (
          <Button variant="ghost" size="icon">
            <Trash2 size="29px" />
          </Button>
        )}
      </div>
    </div>
  );
};

export default SessionItem;
