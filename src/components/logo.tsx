import type { SVGProps } from "react";

export function Logo(props: SVGProps<SVGSVGElement>) {
  return (
    <svg
      width="32"
      height="32"
      viewBox="0 0 32 32"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      {...props}
    >
      <rect width="32" height="32" rx="8" fill="hsl(var(--primary))"/>
      <path d="M9 23V9H14V14H20V9H25V23H20V18H14V23H9Z" fill="hsl(var(--background))"/>
      <path d="M14 14H20V18H14V14Z" fill="hsl(var(--accent))"/>
    </svg>
  );
}
