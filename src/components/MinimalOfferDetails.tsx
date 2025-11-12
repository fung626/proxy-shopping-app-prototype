interface MinimalOfferDetailsProps {
  offer: any;

  onContactAgent: (agentId: string) => void;
  onCreateOrder?: (offer: any) => void;
}

export function MinimalOfferDetails({
  offer,
  onBack,
  onContactAgent,
  onCreateOrder,
}: MinimalOfferDetailsProps) {
  console.log('MinimalOfferDetails rendering with offer:', offer);

  // Super simple offer data
  const title = offer?.title || 'Product Offer';
  const price = offer?.price || 89.99;
  const agentName = offer?.agentName || 'Agent';
  const agentId = offer?.agentId || 'agent_default';

  const handleContactAgent = () => {
    console.log('Contact agent clicked:', agentId);
    onContactAgent(agentId);
  };

  const handleCreateOrder = () => {
    console.log('Create order clicked');
    if (onCreateOrder) {
      onCreateOrder(offer);
    }
  };

  return (
    <div className="min-h-screen bg-white">
      {/* Header */}
      <div className="sticky top-0 z-10 bg-white border-b border-gray-200">
        <div className="flex items-center justify-between p-4">
          <button
            onClick={onBack}
            className="p-2 rounded-full hover:bg-gray-100"
          >
            ←
          </button>
          <h1 className="text-lg font-semibold">Offer Details</h1>
          <div className="w-10" />
        </div>
      </div>

      {/* Content */}
      <div className="p-4 pb-32">
        {/* Simple placeholder image */}
        <div className="w-full h-64 bg-gray-200 rounded-lg mb-4 flex items-center justify-center">
          <span className="text-gray-500">Product Image</span>
        </div>

        {/* Title and Price */}
        <div className="mb-6">
          <h2 className="text-xl font-semibold mb-2">{title}</h2>
          <div className="text-2xl font-bold text-red-600">
            ${price}
          </div>
        </div>

        {/* Agent Info */}
        <div className="bg-gray-50 rounded-lg p-4 mb-6">
          <div className="flex items-center space-x-3">
            <div className="w-12 h-12 bg-red-100 rounded-full flex items-center justify-center">
              <span className="text-red-600 font-medium">
                {agentName
                  .split(' ')
                  .map((n) => n[0])
                  .join('')}
              </span>
            </div>
            <div>
              <h3 className="font-medium">{agentName}</h3>
              <p className="text-sm text-gray-600">Verified Agent</p>
            </div>
          </div>
        </div>

        {/* Simple description */}
        <div>
          <h3 className="font-medium mb-2">Description</h3>
          <p className="text-gray-600">
            High-quality product available for purchase through our
            trusted agent network.
          </p>
        </div>
      </div>

      {/* Sticky Bottom */}
      <div className="fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200">
        <div className="p-4">
          <div className="mb-3">
            <div className="text-xl font-semibold">${price}</div>
            <p className="text-sm text-gray-600">Total price</p>
          </div>

          <div className="flex space-x-3">
            <button
              onClick={handleContactAgent}
              className="flex-1 px-4 py-3 border border-gray-300 rounded-lg hover:bg-gray-50"
            >
              💬 Message
            </button>
            <button
              onClick={handleCreateOrder}
              disabled={!onCreateOrder}
              className="flex-1 px-4 py-3 bg-red-600 text-white rounded-lg hover:bg-red-700 disabled:opacity-50"
            >
              📦 Order Now
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
