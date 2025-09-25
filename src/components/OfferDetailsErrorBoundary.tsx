import React, { Component, ReactNode } from 'react';
import { ArrowLeft, AlertTriangle } from 'lucide-react';

interface Props {
  children: ReactNode;
  onBack: () => void;
  offer?: any;
}

interface State {
  hasError: boolean;
  error?: Error;
}

export class OfferDetailsErrorBoundary extends Component<Props, State> {
  constructor(props: Props) {
    super(props);
    this.state = { hasError: false };
  }

  static getDerivedStateFromError(error: Error): State {
    console.error('OfferDetailsErrorBoundary caught error:', error);
    return { hasError: true, error };
  }

  componentDidCatch(error: Error, errorInfo: React.ErrorInfo) {
    console.error('OfferDetails error details:', { error, errorInfo, offer: this.props.offer });
  }

  render() {
    if (this.state.hasError) {
      return (
        <div className="min-h-screen bg-white">
          <div className="sticky top-0 z-10 bg-white border-b border-gray-200">
            <div className="flex items-center justify-between p-4">
              <button
                onClick={this.props.onBack}
                className="p-2 rounded-full hover:bg-gray-100"
              >
                <ArrowLeft className="h-5 w-5" />
              </button>
              <h1 className="text-lg font-semibold">Offer Details</h1>
              <div className="w-10" />
            </div>
          </div>

          <div className="flex items-center justify-center min-h-96 p-8">
            <div className="text-center max-w-md">
              <AlertTriangle className="h-12 w-12 text-red-500 mx-auto mb-4" />
              <h2 className="text-xl font-semibold mb-2">Unable to load offer details</h2>
              <p className="text-gray-600 mb-6">
                There was an issue loading this offer. Please try again or go back to browse other offers.
              </p>
              <button
                onClick={this.props.onBack}
                className="px-6 py-3 bg-red-600 text-white rounded-lg hover:bg-red-700"
              >
                Go Back
              </button>
            </div>
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}