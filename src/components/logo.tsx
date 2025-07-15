import { cn } from "@/lib/utils";
import * as React from "react";

export const Logo = ({ className, ...props }: React.SVGProps<SVGSVGElement>) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width="48"
    height="48"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="1.5"
    strokeLinecap="round"
    strokeLinejoin="round"
    className={cn("text-primary", className)}
    {...props}
  >
    <path d="M2 22l2-2" />
    <path d="M19.5 5.5c-1.5 1.5-3 3-3 6 0 2.5 1.5 4.5 3 6" />
    <path d="M17 9v1a2 2 0 0 0 2 2h1" />
    <path d="M22 2c-3.5 3.5-7 7-7 12.5 0 2.5 1 4.5 2.5 6s3.5 2.5 6 2.5" />
  </svg>
);
