import { ComponentType, SVGProps } from 'react';
import AccessoriesIcon from '../assets/accessories.svg?react';
import BagsIcon from '../assets/bags.svg?react';
import CosmeticsIcon from '../assets/cosmetics.svg?react';
import CostOfLivingIcon from '../assets/cost-of-living.svg?react';
import FashionIcon from '../assets/fashion.svg?react';
import GadgetsIcon from '../assets/gadgets.svg?react';
import OthersIcon from '../assets/others.svg?react';
import RestaurantIcon from '../assets/restaurant.svg?react';
import SedanIcon from '../assets/sedan.svg?react';
import SportsIcon from '../assets/sport.svg?react';
import StationeryIcon from '../assets/stationery.svg?react';
import TicketIcon from '../assets/ticket.svg?react';
import ToysIcon from '../assets/toys.svg?react';

export interface Category {
  id: string;
  translationKey: string;
  icon: ComponentType<SVGProps<SVGSVGElement>>;
}

export const CATEGORIES: Category[] = [
  {
    id: 'beauty',
    translationKey: 'categories.beauty',
    icon: CosmeticsIcon,
  },
  {
    id: 'tickets',
    translationKey: 'categories.tickets',
    icon: TicketIcon,
  },
  {
    id: 'home',
    translationKey: 'categories.home',
    icon: CostOfLivingIcon,
  },
  {
    id: 'food',
    translationKey: 'categories.food',
    icon: RestaurantIcon,
  },
  {
    id: 'electronics',
    translationKey: 'categories.electronics',
    icon: GadgetsIcon,
  },
  {
    id: 'toys',
    translationKey: 'categories.toys',
    icon: ToysIcon,
  },
  {
    id: 'stationery',
    translationKey: 'categories.stationery',
    icon: StationeryIcon,
  },
  {
    id: 'fashion',
    translationKey: 'categories.fashion',
    icon: FashionIcon,
  },
  {
    id: 'sports',
    translationKey: 'categories.sports',
    icon: SportsIcon,
  },
  {
    id: 'accessories',
    translationKey: 'categories.accessories',
    icon: AccessoriesIcon,
  },
  {
    id: 'bags',
    translationKey: 'categories.bags',
    icon: BagsIcon,
  },
  {
    id: 'automotive',
    translationKey: 'categories.automotive',
    icon: SedanIcon,
  },
  {
    id: 'others',
    translationKey: 'categories.others',
    icon: OthersIcon,
  },
];
