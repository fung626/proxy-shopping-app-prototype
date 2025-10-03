// Service imports
import { MessagesApiService } from './messagesApiService';
import { OffersApiService } from './offersApiService';
import { OrdersApiService } from './ordersApiService';
import { RequestsApiService } from './requestsApiService';
import { SystemApiService } from './systemApiService';
import { UserApiService } from './userApiService';

// Service exports
export { BaseApiService } from './baseApiService';
export { MessagesApiService } from './messagesApiService';
export { OffersApiService } from './offersApiService';
export { OrdersApiService } from './ordersApiService';
export { RequestsApiService } from './requestsApiService';
export { SystemApiService } from './systemApiService';
export { UserApiService } from './userApiService';

// Service instances (singleton pattern)
export const userService = new UserApiService();
export const offersService = new OffersApiService();
export const requestsService = new RequestsApiService();
export const ordersService = new OrdersApiService();
export const messagesService = new MessagesApiService();
export const systemService = new SystemApiService();

// Default export for backward compatibility
export default {
  user: userService,
  offers: offersService,
  requests: requestsService,
  orders: ordersService,
  messages: messagesService,
  system: systemService,
};
