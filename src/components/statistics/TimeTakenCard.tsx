import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Hourglass } from "lucide-react";
import { formatTimeDelta } from "@/lib/utils";
import { differenceInSeconds } from "date-fns";

type Props = {
  timeEnded: Date;
  timeStarted: Date;
};

const TimeTakenCard = ({ timeEnded, timeStarted }: Props) => {
  const timeDifference = differenceInSeconds(timeEnded, timeStarted);

  return (
    <Card className="md:col-span-4 transition-all duration-300 hover:scale-[1.02] hover:shadow-md animate-in fade-in zoom-in-95">
      <CardHeader className="flex flex-row items-center justify-between pb-2 space-y-0">
        <CardTitle className="text-sm font-medium uppercase tracking-wider text-muted-foreground">
          Time Taken
        </CardTitle>
        <Hourglass className="h-5 w-5 text-muted-foreground" />
      </CardHeader>
      <CardContent>
        <div className="flex flex-col gap-1">
          <span className="text-4xl font-bold tracking-tight text-zinc-800 dark:text-zinc-100">
            {formatTimeDelta(timeDifference)}
          </span>
          <span className="text-sm text-muted-foreground">
            Total duration of the quiz
          </span>
        </div>
      </CardContent>
    </Card>
  );
};

export default TimeTakenCard;