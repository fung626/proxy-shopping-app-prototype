// Demo account offers - Allison Gonzalez (f47ac10b-58cc-4372-a567-0e02b2c3d479) has 3 product offers
export const DEMO_ACCOUNT_OFFERS = [
  // Allison Gonzalez (e1@gmail.com) - Electronics & Office Supplies specialist from US
  {
    userId: 'f47ac10b-58cc-4372-a567-0e02b2c3d479', // e1@gmail.com
    offers: [
      {
        id: 'offer-001-macbook-pro-16',
        title: 'MacBook Pro 16" - M3 Max Chip Professional Setup',
        description: 'Brand new MacBook Pro 16-inch with M3 Max chip, 32GB RAM, 1TB SSD. Perfect for professional work and creative projects. Sourced directly from Apple Store in Manhattan. Includes original packaging, chargers, and 1-year Apple warranty.',
        category: 'electronics',
        price: 3499,
        currency: 'USD',
        images: [
          'https://images.unsplash.com/photo-1517336714731-489689fd1ca8?w=400',
          'https://images.unsplash.com/photo-1611186871348-b1ce696e52c9?w=400'
        ],
        location: 'New York, United States',
        shoppingLocation: 'Apple Store Fifth Avenue',
        deliveryOptions: ['ship', 'pickup'],
        availableQuantity: 2,
        estimatedDelivery: { start: 2, end: 3, unit: 'days' },
        specifications: ['M3 Max Chip', '32GB Unified Memory', '1TB SSD Storage', 'Space Black', '1-Year Warranty'],
        tags: ['apple', 'macbook', 'professional', 'laptop', 'tech'],
        status: 'active'
      },
      {
        id: 'offer-002-herman-miller-aeron',
        title: 'Herman Miller Aeron Chair - Size B Ergonomic Office Chair',
        description: 'Authentic Herman Miller Aeron chair in excellent condition. Size B (Medium) with all adjustments working perfectly. Ideal for long work sessions with superior lumbar support. Can source new or certified pre-owned.',
        category: 'office',
        price: 1395,
        currency: 'USD',
        images: [
          'https://images.unsplash.com/photo-1586023492125-27b2c045efd7?w=400',
          'https://images.unsplash.com/photo-1541558869434-2840d308329a?w=400'
        ],
        location: 'Los Angeles, United States',
        shoppingLocation: 'Herman Miller Store Beverly Hills',
        deliveryOptions: ['ship'],
        availableQuantity: 1,
        estimatedDelivery: { start: 5, end: 7, unit: 'days' },
        specifications: ['Size B (Medium)', 'Graphite Frame', 'All Adjustments Functional', '12-Year Warranty'],
        tags: ['herman-miller', 'office-chair', 'ergonomic', 'furniture', 'professional'],
        status: 'active'
      },
      {
        id: 'offer-003-dual-dell-monitors',
        title: 'Professional Monitor Setup - Dual 4K Dell UltraSharp',
        description: 'Complete dual monitor setup with two Dell UltraSharp 27" 4K monitors (U2723QE). Includes monitor arms, cables, and professional calibration. Perfect for software development, design work, or financial trading.',
        category: 'electronics',
        price: 1299,
        currency: 'USD',
        images: [
          'https://images.unsplash.com/photo-1527864550417-7fd91fc51a46?w=400',
          'https://images.unsplash.com/photo-1593640408182-31c70c8268f5?w=400'
        ],
        location: 'Chicago, United States',
        shoppingLocation: 'Best Buy Corporate',
        deliveryOptions: ['ship', 'pickup'],
        availableQuantity: 3,
        estimatedDelivery: { start: 3, end: 5, unit: 'days' },
        specifications: ['27" 4K IPS Display', 'USB-C Hub', 'Height Adjustable Stand', 'Professional Calibration'],
        tags: ['dell', 'monitor', 'dual-setup', '4k', 'professional'],
        status: 'active'
      }
    ]
  }
];