interface CircularLoaderProps {
  className?: string;
  size?: "sm" | "md" | "lg";
}

const sizeClasses = {
  sm: "h-6 w-6 border-2",
  md: "h-10 w-10 border-2",
  lg: "h-12 w-12 border-[3px]",
};

export function CircularLoader({ className = "", size = "md" }: CircularLoaderProps) {
  return (
    <div
      className={`rounded-full border-slate-200 border-t-slate-600 animate-spin ${sizeClasses[size]} ${className}`}
      role="status"
      aria-label="Loading"
    />
  );
}
