import * as React from "react";

import { cn } from "@/lib/utils";

type ProgressProps = React.ComponentProps<"div"> & {
  value?: number;
};

function Progress({ className, value = 0, ...props }: ProgressProps) {
  const clampedValue = Math.max(0, Math.min(100, value));

  return (
    <div
      data-slot="progress"
      role="progressbar"
      aria-valuenow={Math.round(clampedValue)}
      aria-valuemin={0}
      aria-valuemax={100}
      className={cn("relative h-3 w-full overflow-hidden rounded-full bg-orange-100", className)}
      {...props}
    >
      <div
        data-slot="progress-indicator"
        className="h-full w-full flex-1 bg-orange-500 transition-all duration-300 ease-out"
        style={{ transform: `translateX(-${100 - clampedValue}%)` }}
      />
    </div>
  );
}

export { Progress };
