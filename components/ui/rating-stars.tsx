import { Star } from "lucide-react"
import { cn } from "@/lib/utils"

interface RatingStarsProps {
    rating: number
    maxRating?: number
    className?: string
    starClassName?: string
}

export function RatingStars({
    rating,
    maxRating = 5,
    className,
    starClassName,
}: RatingStarsProps) {
    return (
        <div className={cn("flex items-center space-x-1", className)}>
            {Array.from({ length: maxRating }).map((_, i) => (
                <Star
                    key={i}
                    className={cn(
                        "h-4 w-4",
                        i < rating
                            ? "fill-yellow-400 text-yellow-400"
                            : "fill-muted text-muted",
                        starClassName
                    )}
                />
            ))}
        </div>
    )
}
