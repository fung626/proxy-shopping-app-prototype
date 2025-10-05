const getDefaultImage = (category: string) => {
  const defaultImages: { [key: string]: string } = {
    electronics:
      'https://images.unsplash.com/photo-1542725783-079749686aaa?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxvZmZpY2UlMjBlcXVpcG1lbnQlMjBsYXB0b3AlMjBjb21wdXRlcnxlbnwxfHx8fDE3NTg3MDU2MTN8MA&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral',
    beauty:
      'https://images.unsplash.com/photo-1686831451322-8d8e234a51e1?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxrb3JlYW4lMjBza2luY2FyZSUyMGJlYXV0eSUyMHByb2R1Y3RzfGVufDF8fHx8MTc1ODcwNTYxOXww&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral',
    fashion:
      'https://images.unsplash.com/photo-1575404199108-c7417489517d?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxmYXNoaW9uJTIwYWNjZXNzb3JpZXMlMjBwYXJpcyUyMGx1eHVyeXxlbnwxfHx8fDE3NTg3MDU2MjR8MA&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral',
    home: 'https://images.unsplash.com/photo-1756402664856-91a90f90b70b?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxjb25zdHJ1Y3Rpb24lMjB0b29scyUyMGluZHVzdHJpYWwlMjBlcXVpcG1lbnR8ZW58MXx8fHwxNzU4NzA1NjE1fDA&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral',
    default:
      'https://images.unsplash.com/photo-1542725783-079749686aaa?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxvZmZpY2UlMjBlcXVpcG1lbnQlMjBsYXB0b3AlMjBjb21wdXRlcnxlbnwxfHx8fDE3NTg3MDU2MTN8MA&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral',
  };
  return defaultImages[category] || defaultImages.default;
};

export { getDefaultImage };
