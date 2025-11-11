import { supabase } from './client';

// Example: Real-time subscription for the 'messages' table
export const subscribeToMessages = () => {
  const subscription = supabase
    .channel('public:messages')
    .on(
      'postgres_changes',
      { event: '*', schema: 'public', table: 'messages' },
      (payload) => {
        console.log('Change received!', payload);
        // Handle the real-time event here
      }
    )
    .subscribe();

  return subscription;
};

// Example: Unsubscribe from the 'messages' table
export const unsubscribeFromMessages = (subscription: any) => {
  supabase.removeChannel(subscription);
};
