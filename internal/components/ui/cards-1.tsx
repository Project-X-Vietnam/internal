import * as React from "react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Bookmark } from "lucide-react";

// Define the props for the component
interface ProductCardProps extends React.HTMLAttributes<HTMLDivElement> {
  imageUrl: string;
  title: string;
  category: string;
  description?: string;
  href: string;
  onSave?: () => void;
}

const ProductCard = React.forwardRef<HTMLDivElement, ProductCardProps>(
  ({ className, imageUrl, title, category, description, href, onSave, ...props }, ref) => {
    // Prevent click event from bubbling up from the button to the parent link
    const handleSaveClick = (e: React.MouseEvent<HTMLButtonElement>) => {
      e.preventDefault();
      e.stopPropagation();
      if (onSave) {
        onSave();
      }
    };

    return (
      <div
        ref={ref}
        className={cn(
          "group relative block overflow-hidden rounded-2xl bg-card text-card-foreground border-2 border-slate-100 dark:border-white/10 transition-all duration-300 ease-out hover:shadow-lg hover:scale-[1.02]",
          className
        )}
        {...props}
      >
        <a href={href} aria-label={title} className="flex flex-col h-full">
          {/* Image container with aspect ratio */}
          <div className="aspect-[4/3] overflow-hidden bg-muted">
            <img
              src={imageUrl}
              alt={title}
              className="h-full w-full object-cover transition-transform duration-500 ease-out group-hover:scale-105"
            />
          </div>
          {/* Card content */}
          <div className="flex flex-col flex-1 p-5 space-y-2">
            <p className="text-xs font-bold uppercase tracking-widest text-primary">{category}</p>
            <h3 className="font-bold text-lg leading-tight group-hover:text-primary transition-colors duration-200">{title}</h3>
            {description && (
              <p className="text-sm text-muted-foreground line-clamp-3">
                {description}
              </p>
            )}
          </div>
        </a>

        {/* Save button - appears on hover */}
        <Button
          variant="secondary"
          size="icon"
          className="absolute top-4 right-4 h-9 w-9 rounded-full opacity-0 translate-y-2 backdrop-blur-md bg-white/80 dark:bg-black/50 hover:bg-primary hover:text-primary-foreground transition-all duration-300 group-hover:opacity-100 group-hover:translate-y-0 shadow-sm"
          onClick={handleSaveClick}
          aria-label="Save item"
        >
          <Bookmark className="h-4 w-4" />
        </Button>
      </div>
    );
  }
);

ProductCard.displayName = "ProductCard";

export { ProductCard };