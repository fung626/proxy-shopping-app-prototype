// Service imports

// Supabase service imports
import { chatSupabaseService } from './chatSupabaseService';
import { OffersSupabaseService } from './offersSupabaseService';
import { ordersSupabaseService } from './ordersSupabaseService';
import { RequestsSupabaseService } from './requestsSupabaseService';
import { wishlistSupabaseService } from './wishlistSupabaseService';

// Supabase service exports
export { chatSupabaseService } from './chatSupabaseService';
export { OffersSupabaseService } from './offersSupabaseService';
export { ordersSupabaseService } from './ordersSupabaseService';
export { RequestsSupabaseService } from './requestsSupabaseService';
export { wishlistSupabaseService } from './wishlistSupabaseService';

// Supabase service instances
export const offersSupabaseService = new OffersSupabaseService();
export const requestsSupabaseService = new RequestsSupabaseService();
export const wishlistService = wishlistSupabaseService;

// Default export for backward compatibility
export default {
  // Supabase services
  offersSupabase: offersSupabaseService,
  requestsSupabase: requestsSupabaseService,
  ordersSupabase: ordersSupabaseService,
  chatSupabase: chatSupabaseService,
  wishlistSupabase: wishlistService,
};
