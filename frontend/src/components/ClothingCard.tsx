import { useState } from "react";
import { Heart, Tag, MoreHorizontal } from "lucide-react";

interface ClothingCardProps {
  id?: number;
  name?: string;
  category?: string;
  color?: string;
  season?: string;
  imageIndex?: number;
  liked?: boolean;
  onLike?: (id: number) => void;
}

const CLOTHING_GRADIENTS = [
  "linear-gradient(135deg, rgba(200, 180, 160, 1) 0%, rgba(170, 145, 120, 1) 100%)",
  "linear-gradient(135deg, rgba(160, 185, 175, 1) 0%, rgba(100, 140, 120, 1) 100%)",
  "linear-gradient(135deg, rgba(220, 205, 185, 1) 0%, rgba(195, 175, 150, 1) 100%)",
  "linear-gradient(135deg, rgba(180, 165, 200, 1) 0%, rgba(140, 120, 165, 1) 100%)",
  "linear-gradient(135deg, rgba(195, 175, 155, 1) 0%, rgba(160, 135, 110, 1) 100%)",
  "linear-gradient(135deg, rgba(175, 195, 185, 1) 0%, rgba(120, 155, 140, 1) 100%)",
];

const CLOTHING_ICONS = ["👔", "👗", "👖", "🧥", "👘", "🥻", "🧣", "👟"];

const ClothingCard = ({
  id = 1,
  name = "休闲白衬衫",
  category = "上衣",
  color = "白色",
  season = "四季",
  imageIndex = 0,
  liked = false,
  onLike = () => {},
}: ClothingCardProps) => {
  const [isLiked, setIsLiked] = useState(liked);

  const gradient = CLOTHING_GRADIENTS[imageIndex % CLOTHING_GRADIENTS.length];
  const icon = CLOTHING_ICONS[imageIndex % CLOTHING_ICONS.length];

  const handleLike = () => {
    setIsLiked(!isLiked);
    onLike(id);
  };

  return (
    <div
      data-cmp="ClothingCard"
      className="bg-card rounded-xl overflow-hidden shadow-card hover-lift cursor-pointer group"
    >
      {/* Image Area */}
      <div
        className="relative h-52 flex items-center justify-center"
        style={{ background: gradient }}
      >
        <span className="text-5xl opacity-80">{icon}</span>
        <button
          onClick={handleLike}
          className="absolute top-3 right-3 w-8 h-8 rounded-full bg-card flex items-center justify-center shadow-card transition-transform duration-200 hover:scale-110"
        >
          <Heart
            className={`w-4 h-4 transition-colors duration-200 ${
              isLiked ? "fill-destructive text-destructive" : "text-muted-foreground"
            }`}
          />
        </button>
        <div className="absolute bottom-3 left-3">
          <span className="tag-pill text-xs">{category}</span>
        </div>
      </div>

      {/* Info Area */}
      <div className="p-4">
        <div className="flex items-start justify-between">
          <div>
            <h3 className="text-sm font-semibold text-foreground leading-tight">{name}</h3>
            <div className="flex items-center gap-2 mt-1.5">
              <span className="flex items-center gap-1 text-xs text-muted-foreground">
                <Tag className="w-3 h-3" />
                {color}
              </span>
              <span className="text-xs text-muted-foreground">·</span>
              <span className="text-xs text-muted-foreground">{season}</span>
            </div>
          </div>
          <button className="p-1 rounded-md hover:bg-muted transition-colors duration-200">
            <MoreHorizontal className="w-4 h-4 text-muted-foreground" />
          </button>
        </div>
      </div>
    </div>
  );
};

export default ClothingCard;