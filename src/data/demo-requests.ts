// Demo account requests - Ethan O'Neill (6ba7b810-9dad-11d1-80b4-00c04fd430c8) has 2 product requests
export const DEMO_ACCOUNT_REQUESTS = [
  // Ethan O'Neill (e2@gmail.com) - Construction & Industrial specialist from Hong Kong
  {
    userId: '6ba7b810-9dad-11d1-80b4-00c04fd430c8', // e2@gmail.com
    requests: [
      {
        id: 'req-001-makita-power-tools',
        title: 'Industrial Grade Power Tools - Makita 18V LXT Set',
        description: 'Looking for authentic Makita 18V LXT cordless tool set including drill, impact driver, circular saw, angle grinder, and reciprocating saw. Must be genuine Makita with original batteries and charger. Needed for construction project in Hong Kong.',
        category: 'construction',
        budget: { min: 800, max: 1200 },
        currency: 'USD',
        images: [
          'https://images.unsplash.com/photo-1504148455328-c376907d081c?w=400',
          'https://images.unsplash.com/photo-1581092918056-0c4c3acd3789?w=400'
        ],
        targetLocation: 'United States, Japan, or Germany',
        preferredShoppingLocation: 'Home Depot, Lowes, or Official Makita Dealers',
        quantity: 1,
        urgency: 'medium',
        expectedDelivery: { start: 7, end: 14, unit: 'days' },
        requirements: ['Genuine Makita Brand', '18V LXT Platform', 'Original Batteries (4.0Ah minimum)', 'Hard Case Included'],
        tags: ['makita', 'power-tools', 'construction', 'industrial', 'cordless'],
        status: 'active',
        deadline: '2024-02-15'
      },
      {
        id: 'req-002-3m-safety-equipment',
        title: 'Heavy Duty Safety Equipment - 3M Construction Safety Gear',
        description: 'Need comprehensive safety equipment for construction site including 3M hard hats, safety harnesses, high-visibility vests, safety glasses, and steel-toe boots (size 10 US). Must meet OSHA and international safety standards.',
        category: 'industrial',
        budget: { min: 300, max: 600 },
        currency: 'USD',
        images: [
          'https://images.unsplash.com/photo-1578662996442-48f60103fc96?w=400',
          'https://images.unsplash.com/photo-1621905252507-b35492cc74b4?w=400'
        ],
        targetLocation: 'United States or Canada',
        preferredShoppingLocation: 'Grainger, Fastenal, or 3M Authorized Dealers',
        quantity: 1,
        urgency: 'high',
        expectedDelivery: { start: 5, end: 10, unit: 'days' },
        requirements: ['OSHA Compliant', '3M Brand Preferred', 'Size 10 US Boots', 'Hi-Vis Class 2 Vests'],
        tags: ['3m', 'safety-equipment', 'construction', 'osha', 'ppe'],
        status: 'active',
        deadline: '2024-02-10'
      }
    ]
  }
];