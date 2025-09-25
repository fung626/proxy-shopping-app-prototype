import { ImageWithFallback } from './figma/ImageWithFallback';

interface LazyImageProps {
  src: string;
  alt: string;
  className?: string;
  style?: React.CSSProperties;
}

// Simplified LazyImage - just use ImageWithFallback directly for now
export function LazyImage({ src, alt, className, style }: LazyImageProps) {
  return (
    <ImageWithFallback
      src={src}
      alt={alt}
      className={className}
      style={style}
    />
  );
}