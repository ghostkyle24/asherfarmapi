import { cn } from "./utils";
import type { InputHTMLAttributes } from "react";

type Props = InputHTMLAttributes<HTMLInputElement>;

export function Input({ className, ...props }: Props) {
  return (
    <input
      className={cn(
        "w-full bg-neutral-900 border border-neutral-800 rounded px-3 py-2 outline-none focus:ring-2 focus:ring-neutral-600",
        className
      )}
      {...props}
    />
  );
}


