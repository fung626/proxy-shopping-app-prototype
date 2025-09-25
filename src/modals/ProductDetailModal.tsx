import { ArrowLeft, Heart, Share, Star, ShoppingBag } from 'lucide-react';
import { Card } from '../components/ui/card';
import { Badge } from '../components/ui/badge';
import { Button } from '../components/ui/button';
import { ImageWithFallback } from '../components/figma/ImageWithFallback';

interface ProductDetailModalProps {
  product: {
    id: number;
    title: string;
    category: string;
    budget: string;
    image: string;
    rating: number;
    reviews: number;
    bids: number;
    description?: string;
    brand?: string;
    color?: string;
  };
  onClose: () => void;
}

export function ProductDetailModal({ product, onClose }: ProductDetailModalProps) {
  const additionalImages = [
    product.image,
    product.image,
    product.image,
    product.image
  ];

  return (
    <div className="fixed inset-0 bg-white z-50 overflow-y-auto">
      {/* Header */}
      <div className="flex justify-between items-center p-4 pt-12 border-b">
        <Button variant="ghost" size="sm" onClick={onClose} className="p-2">
          <ArrowLeft className="h-5 w-5" />
        </Button>
        <div className="flex items-center space-x-3">
          <Button variant="ghost" size="sm" className="p-2">
            <Share className="h-5 w-5" />
          </Button>
          <Button variant="ghost" size="sm" className="p-2">
            <Heart className="h-5 w-5" />
          </Button>
        </div>
      </div>

      {/* Product Image */}
      <div className="relative">
        <ImageWithFallback 
          src={product.image}
          alt={product.title}
          className="w-full h-80 object-cover"
        />
        <div className="absolute bottom-4 right-4 bg-primary text-white px-2 py-1 rounded-lg flex items-center space-x-1">
          <ShoppingBag className="h-4 w-4" />
          <span className="text-sm">1</span>
        </div>
      </div>

      {/* Product Thumbnails */}
      <div className="flex space-x-2 p-4 overflow-x-auto">
        {additionalImages.slice(0, 4).map((img, index) => (
          <div key={index} className="flex-shrink-0">
            <ImageWithFallback 
              src={img}
              alt={`${product.title} ${index + 1}`}
              className="w-16 h-16 rounded-lg object-cover border-2 border-gray-200"
            />
          </div>
        ))}
      </div>

      {/* Product Info */}
      <div className="p-4 space-y-4">
        <div>
          <h1 className="text-xl mb-2">{product.title}</h1>
          <div className="flex items-center space-x-4 mb-3">
            <div className="flex items-center space-x-1">
              <Star className="h-4 w-4 fill-yellow-400 text-yellow-400" />
              <span className="text-sm">{product.rating} Ratings</span>
            </div>
            <span className="text-gray-300">•</span>
            <span className="text-sm text-gray-600">{product.reviews}+ Reviews</span>
            <span className="text-gray-300">•</span>
            <span className="text-sm text-gray-600">{product.bids}+ Sold</span>
          </div>
        </div>

        {/* Tabs */}
        <div className="flex space-x-6 border-b">
          <button className="pb-2 text-primary border-b-2 border-primary">About Item</button>
          <button className="pb-2 text-gray-500">Reviews</button>
        </div>

        {/* Product Details */}
        <div className="space-y-3">
          <div className="flex justify-between items-center">
            <span className="text-gray-600">Brand:</span>
            <span className="font-medium">{product.brand || 'OilArmagh'}</span>
          </div>
          <div className="flex justify-between items-center">
            <span className="text-gray-600">Color:</span>
            <span className="font-medium">{product.color || 'Apricot'}</span>
          </div>
        </div>

        {/* Price */}
        <div className="flex items-center justify-between py-4 border-t">
          <div>
            <span className="text-2xl text-primary font-medium">{product.budget.split(' - ')[0]}</span>
          </div>
          <div className="flex items-center space-x-2">
            <div className="flex items-center space-x-2 bg-primary/10 rounded-lg px-3 py-2">
              <span className="text-primary">1</span>
            </div>
            <Button className="flex-1 min-w-[120px]">
              Buy Now
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}