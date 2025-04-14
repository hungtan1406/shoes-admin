import {
  LuLayoutDashboard,
  LuVote,
  LuShoppingCart,
  LuListCheck,
  LuLogOut,
  LuContactRound,
} from 'react-icons/lu';
import { VscPreview } from 'react-icons/vsc';
export const SIDE_MENU_DATA = [
  {
    id: '01',
    label: 'Dashboard',
    icon: LuLayoutDashboard,
    path: '/dashboard',
  },
  {
    id: '02',
    label: 'Add Product',
    icon: LuVote,
    path: '/add-product',
  },
  {
    id: '03',
    label: 'Orders',
    icon: LuShoppingCart,
    path: '/orders',
  },
  {
    id: '04',
    label: 'List Products',
    icon: LuListCheck,
    path: '/list',
  },
  {
    id: '05',
    label: 'Customers',
    icon: LuContactRound,
    path: '/customers',
  },
  {
    id: '06',
    label: 'Reviews',
    icon: VscPreview,
    path: '/reviews',
  },
  {
    id: '07',
    label: 'Log out',
    icon: LuLogOut,
    path: 'logout',
  },
];
