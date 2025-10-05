// Service imports

// Supabase service imports
import { OffersSupabaseService } from './offersSupabaseService';
import { RequestsSupabaseService } from './requestsSupabaseService';

// Supabase service exports
export { OffersSupabaseService } from './offersSupabaseService';
export { RequestsSupabaseService } from './requestsSupabaseService';

// Supabase service instances
export const offersSupabaseService = new OffersSupabaseService();
export const requestsSupabaseService = new RequestsSupabaseService();

// Default export for backward compatibility
export default {
  // Supabase services
  offersSupabase: offersSupabaseService,
  requestsSupabase: requestsSupabaseService,
};
