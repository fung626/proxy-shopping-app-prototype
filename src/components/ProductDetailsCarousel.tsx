import { useLanguage } from '@/store/LanguageContext';
import React, { useState } from 'react';
import {
  ProductCarousel,
  ProductThumbnailCarousel,
} from './ProductCarousel';

interface ProductImage {
  id: string;
  imageUrl: string;
  title?: string;
  description?: string;
}

interface ProductDetailsCarouselProps {
  images: ProductImage[];
  productTitle?: string;
  onImageClick?: (image: ProductImage, index: number) => void;
  className?: string;
}

export const ProductDetailsCarousel: React.FC<
  ProductDetailsCarouselProps
> = ({ images, productTitle, onImageClick, className = '' }) => {
  const { t } = useLanguage();
  const [selectedImageIndex, setSelectedImageIndex] = useState(0);

  const handleMainImageClick = (
    image: ProductImage,
    index: number
  ) => {
    if (onImageClick) {
      onImageClick(image, index);
    }
  };

  const handleThumbnailClick = (index: number) => {
    setSelectedImageIndex(index);
  };

  if (!images || images.length === 0) {
    return (
      <div
        className={`bg-muted rounded-lg aspect-square flex items-center justify-center ${className}`}
      >
        <p className="text-muted-foreground text-sm">
          {t('noImagesAvailable')}
        </p>
      </div>
    );
  }

  const mainImage = images[selectedImageIndex] || images[0];

  return (
    <div className={`space-y-4 ${className}`}>
      {/* Main Image Display */}
      <div className="relative">
        <ProductCarousel
          items={[
            {
              ...mainImage,
              onClick: () =>
                handleMainImageClick(mainImage, selectedImageIndex),
            },
          ]}
          aspectRatio="square"
          itemWidth="w-full"
          showArrows={false}
          showTitles={false}
          gap="gap-0"
        />

        {/* Image Counter */}
        {images.length > 1 && (
          <div className="absolute top-4 right-4 bg-black/70 text-white text-xs px-2 py-1 rounded-full">
            {selectedImageIndex + 1} / {images.length}
          </div>
        )}
      </div>

      {/* Thumbnail Navigation */}
      {images.length > 1 && (
        <div className="w-full">
          <ProductThumbnailCarousel
            items={images.map((image, index) => ({
              ...image,
              onClick: () => handleThumbnailClick(index),
            }))}
            showArrows={images.length > 4}
            className="px-2"
          />
        </div>
      )}

      {/* Product Title */}
      {productTitle && (
        <div className="px-1">
          <h3 className="font-medium text-lg text-foreground">
            {productTitle}
          </h3>
        </div>
      )}
    </div>
  );
};

// Compact version for smaller spaces
export const CompactProductCarousel: React.FC<{
  images: ProductImage[];
  onImageClick?: (image: ProductImage, index: number) => void;
  className?: string;
}> = ({ images, onImageClick, className = '' }) => {
  return (
    <ProductCarousel
      items={images.map((image, index) => ({
        ...image,
        onClick: onImageClick
          ? () => onImageClick(image, index)
          : undefined,
      }))}
      aspectRatio="square"
      itemWidth="w-48"
      showTitles={false}
      showArrows={true}
      autoPlay={true}
      autoPlayInterval={4000}
      className={className}
    />
  );
};

// Full-width gallery for product pages
export const ProductGallery: React.FC<{
  images: ProductImage[];
  onImageClick?: (image: ProductImage, index: number) => void;
  className?: string;
}> = ({ images, onImageClick, className = '' }) => {
  return (
    <div className={className}>
      <ProductCarousel
        items={images.map((image, index) => ({
          ...image,
          onClick: onImageClick
            ? () => onImageClick(image, index)
            : undefined,
        }))}
        aspectRatio="16:9"
        itemWidth="w-full"
        showTitles={true}
        showArrows={true}
        gap="gap-4"
        className="mb-6"
      />
    </div>
  );
};
