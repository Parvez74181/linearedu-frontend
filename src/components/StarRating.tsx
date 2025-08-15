import { Star } from "lucide-react";
import React, { useState } from "react";

interface StarRatingProps {
  rating?: number;
  onChange?: (rating: number) => void;
  count?: number;
  size?: number;
  color?: string;
  activeColor?: string;
  editable?: boolean;
}

const StarRating: React.FC<StarRatingProps> = ({
  rating = 0,
  onChange = () => {},
  count = 5,
  size = 24,
  color = "#d1d5db",
  activeColor = "#f59e0b",
  editable = true,
}) => {
  const [hoverRating, setHoverRating] = useState(0);
  const [currentRating, setCurrentRating] = useState(rating);

  const handleClick = (index: number) => {
    if (!editable) return;
    const newRating = index + 1;
    setCurrentRating(newRating);
    onChange(newRating);
  };

  const handleMouseEnter = (index: number) => {
    if (!editable) return;
    setHoverRating(index + 1);
  };

  const handleMouseLeave = () => {
    if (!editable) return;
    setHoverRating(0);
  };

  return (
    <div className="flex items-center">
      {[...Array(count)].map((_, index) => {
        const ratingValue = index + 1;
        const isActive = hoverRating ? ratingValue <= hoverRating : ratingValue <= currentRating;

        return (
          <button
            key={index}
            type="button"
            className="p-1 focus:outline-none"
            onClick={() => handleClick(index)}
            onMouseEnter={() => handleMouseEnter(index)}
            onMouseLeave={handleMouseLeave}
            disabled={!editable}
            aria-label={`Rate ${ratingValue} out of ${count}`}
          >
            <Star
              size={size}
              fill={isActive ? activeColor : color}
              color={isActive ? activeColor : color}
              className="transition-colors duration-200"
            />
          </button>
        );
      })}
    </div>
  );
};

export default StarRating;
