import React, { useState, useRef, useEffect } from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { ImageWithFallback } from './figma/ImageWithFallback';

interface CarouselItem {
  id: string;
  imageUrl: string;
  title?: string;
  description?: string;
  link?: string;
  onClick?: () => void;
}

interface ProductCarouselProps {
  items: CarouselItem[];
  className?: string;
  showTitles?: boolean;
  showArrows?: boolean;
  autoPlay?: boolean;
  autoPlayInterval?: number;
  aspectRatio?: 'square' | '4:3' | '16:9' | '3:4';
  itemWidth?: string;
  gap?: string;
}

export const ProductCarousel: React.FC<ProductCarouselProps> = ({
  items,
  className = '',
  showTitles = true,
  showArrows = true,
  autoPlay = false,
  autoPlayInterval = 3000,
  aspectRatio = 'square',
  itemWidth = 'w-64',
  gap = 'gap-3'
}) => {
  const maxScrollWidth = useRef(0);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isHovered, setIsHovered] = useState(false);
  const carousel = useRef<HTMLDivElement>(null);
  const autoPlayRef = useRef<NodeJS.Timeout>();

  // Auto-play functionality
  useEffect(() => {
    if (autoPlay && !isHovered && items.length > 1) {
      autoPlayRef.current = setInterval(() => {
        moveNext();
      }, autoPlayInterval);
    } else {
      if (autoPlayRef.current) {
        clearInterval(autoPlayRef.current);
      }
    }

    return () => {
      if (autoPlayRef.current) {
        clearInterval(autoPlayRef.current);
      }
    };
  }, [autoPlay, isHovered, currentIndex, autoPlayInterval]);

  const movePrev = () => {
    if (currentIndex > 0) {
      setCurrentIndex((prevState) => prevState - 1);
    }
  };

  const moveNext = () => {
    if (
      carousel.current !== null &&
      carousel.current.offsetWidth * currentIndex <= maxScrollWidth.current
    ) {
      setCurrentIndex((prevState) => prevState + 1);
    } else if (autoPlay && currentIndex >= Math.floor(maxScrollWidth.current / (carousel.current?.offsetWidth || 1))) {
      // Reset to beginning for auto-play
      setCurrentIndex(0);
    }
  };

  const isDisabled = (direction: 'prev' | 'next') => {
    if (direction === 'prev') {
      return currentIndex <= 0;
    }

    if (direction === 'next' && carousel.current !== null) {
      return (
        carousel.current.offsetWidth * currentIndex >= maxScrollWidth.current
      );
    }

    return false;
  };

  const getAspectRatioClass = () => {
    switch (aspectRatio) {
      case 'square':
        return 'aspect-square';
      case '4:3':
        return 'aspect-[4/3]';
      case '16:9':
        return 'aspect-[16/9]';
      case '3:4':
        return 'aspect-[3/4]';
      default:
        return 'aspect-square';
    }
  };

  useEffect(() => {
    if (carousel !== null && carousel.current !== null) {
      carousel.current.scrollLeft = carousel.current.offsetWidth * currentIndex;
    }
  }, [currentIndex]);

  useEffect(() => {
    maxScrollWidth.current = carousel.current
      ? carousel.current.scrollWidth - carousel.current.offsetWidth
      : 0;
  }, []);

  const handleItemClick = (item: CarouselItem) => {
    if (item.onClick) {
      item.onClick();
    } else if (item.link) {
      window.open(item.link, '_blank');
    }
  };

  if (!items || items.length === 0) {
    return null;
  }

  return (
    <div 
      className={`relative ${className}`}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      {/* Navigation Arrows */}
      {showArrows && items.length > 1 && (
        <>
          {/* Previous Button */}
          <button
            onClick={movePrev}
            disabled={isDisabled('prev')}
            className="absolute left-2 top-1/2 -translate-y-1/2 z-20 p-2 rounded-full bg-white/90 hover:bg-white shadow-lg border border-border disabled:opacity-30 disabled:cursor-not-allowed transition-all duration-200 hover:scale-105 focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2"
            aria-label="Previous image"
          >
            <ChevronLeft className="h-5 w-5 text-foreground" />
          </button>

          {/* Next Button */}
          <button
            onClick={moveNext}
            disabled={isDisabled('next')}
            className="absolute right-2 top-1/2 -translate-y-1/2 z-20 p-2 rounded-full bg-white/90 hover:bg-white shadow-lg border border-border disabled:opacity-30 disabled:cursor-not-allowed transition-all duration-200 hover:scale-105 focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2"
            aria-label="Next image"
          >
            <ChevronRight className="h-5 w-5 text-foreground" />
          </button>
        </>
      )}

      {/* Carousel Container */}
      <div className="overflow-hidden rounded-lg">
        <div
          ref={carousel}
          className={`carousel-container relative flex ${gap} overflow-hidden scroll-smooth snap-x snap-mandatory touch-pan-x scrollbar-hide`}
          style={{ scrollBehavior: 'smooth' }}
        >
          {items.map((item, index) => (
            <div
              key={item.id}
              className={`carousel-item relative ${itemWidth} flex-shrink-0 snap-start group`}
            >
              {/* Image Container */}
              <div 
                className={`relative ${getAspectRatioClass()} w-full overflow-hidden rounded-lg bg-muted cursor-pointer transition-transform duration-200 group-hover:scale-[1.02]`}
                onClick={() => handleItemClick(item)}
              >
                <ImageWithFallback
                  src={item.imageUrl}
                  alt={item.title || `Product image ${index + 1}`}
                  className="w-full h-full object-cover"
                />
                
                {/* Overlay for Title/Description */}
                {showTitles && (item.title || item.description) && (
                  <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-end">
                    <div className="p-4 text-white w-full">
                      {item.title && (
                        <h3 className="font-medium text-sm line-clamp-2 mb-1">
                          {item.title}
                        </h3>
                      )}
                      {item.description && (
                        <p className="text-xs text-white/80 line-clamp-2">
                          {item.description}
                        </p>
                      )}
                    </div>
                  </div>
                )}

                {/* Click indicator */}
                {(item.onClick || item.link) && (
                  <div className="absolute top-3 right-3 w-8 h-8 bg-white/90 rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-200 shadow-lg">
                    <ChevronRight className="h-4 w-4 text-foreground" />
                  </div>
                )}
              </div>

              {/* Title Below Image (optional) */}
              {showTitles && item.title && (
                <div className="mt-3 px-1">
                  <h4 className="font-medium text-sm text-foreground line-clamp-2">
                    {item.title}
                  </h4>
                  {item.description && (
                    <p className="text-xs text-muted-foreground mt-1 line-clamp-2">
                      {item.description}
                    </p>
                  )}
                </div>
              )}
            </div>
          ))}
        </div>
      </div>

      {/* Dots Indicator */}
      {items.length > 1 && (
        <div className="flex justify-center mt-4 space-x-2">
          {Array.from({ length: Math.ceil(items.length / Math.max(1, Math.floor((carousel.current?.offsetWidth || 256) / 256))) }).map((_, index) => (
            <button
              key={index}
              onClick={() => setCurrentIndex(index)}
              className={`w-2 h-2 rounded-full transition-all duration-200 ${
                index === Math.floor(currentIndex / Math.max(1, Math.floor((carousel.current?.offsetWidth || 256) / 256)))
                  ? 'bg-primary w-6'
                  : 'bg-muted-foreground/30 hover:bg-muted-foreground/50'
              }`}
              aria-label={`Go to slide ${index + 1}`}
            />
          ))}
        </div>
      )}
    </div>
  );
};

// Preset configurations for common use cases
export const ProductImageCarousel: React.FC<Omit<ProductCarouselProps, 'aspectRatio' | 'itemWidth'>> = (props) => (
  <ProductCarousel {...props} aspectRatio="square" itemWidth="w-80" />
);

export const ProductThumbnailCarousel: React.FC<Omit<ProductCarouselProps, 'aspectRatio' | 'itemWidth' | 'showTitles'>> = (props) => (
  <ProductCarousel {...props} aspectRatio="square" itemWidth="w-24" showTitles={false} gap="gap-2" />
);

export const ProductGalleryCarousel: React.FC<Omit<ProductCarouselProps, 'aspectRatio' | 'itemWidth'>> = (props) => (
  <ProductCarousel {...props} aspectRatio="4:3" itemWidth="w-full" gap="gap-0" showArrows={false} />
);