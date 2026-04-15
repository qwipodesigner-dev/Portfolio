import { cn } from "@/lib/cn";

type ContainerProps = {
  children: React.ReactNode;
  className?: string;
  as?: React.ElementType;
  size?: "sm" | "md" | "lg" | "full";
};

const sizeMap = {
  sm: "max-w-[720px]",
  md: "max-w-[960px]",
  lg: "max-w-[1280px]",
  full: "max-w-none",
};

export function Container({
  children,
  className,
  as: Tag = "div",
  size = "lg",
}: ContainerProps) {
  return (
    <Tag className={cn("mx-auto w-full px-6 md:px-10", sizeMap[size], className)}>
      {children}
    </Tag>
  );
}
