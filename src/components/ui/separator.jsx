import React from "react";

export default function Separator({ orientation = "horizontal", className = "" }) {
  return (
    <div
      role="separator"
      aria-orientation={orientation}
      className={`${
        orientation === "horizontal" ? "h-px w-full" : "w-px h-full"
      } bg-gray-200 dark:bg-gray-700 ${className}`}
    />
  );
}
