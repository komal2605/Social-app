import { cn } from "@/lib/utils";

interface AvatarProps {
  src?: string;
  alt?: string;
  size?: "sm" | "md" | "lg";
  className?: string;
}

export const Avatar = ({ src, alt = "User avatar", size = "md", className }: AvatarProps) => {
  const sizeClasses = {
    sm: "w-8 h-8",
    md: "w-10 h-10",
    lg: "w-16 h-16",
  };

  return (
    <div className={cn(
      "relative rounded-full overflow-hidden bg-secondary",
      sizeClasses[size],
      className
    )}>
      {src ? (
        <img
          src={src}
          alt={alt}
          className="w-full h-full object-cover"
          loading="lazy"
        />
      ) : (
        <div className="w-full h-full flex items-center justify-center bg-secondary text-secondary-foreground">
          {alt.charAt(0).toUpperCase()}
        </div>
      )}
    </div>
  );
};