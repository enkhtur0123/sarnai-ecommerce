import { Star } from "lucide-react";

export function Rating({ value, size = 13, label }: { value: number; size?: number; label?: string }) {
  return (
    <div className="flex items-center gap-0.5" role="img" aria-label={label}>
      {[1, 2, 3, 4, 5].map((i) => (
        <Star
          key={i}
          size={size}
          strokeWidth={2}
          className={i <= Math.round(value) ? "text-star" : "text-star-off"}
          aria-hidden="true"
        />
      ))}
    </div>
  );
}
