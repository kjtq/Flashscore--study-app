export interface MenuItem {
  id: string;
  title: string;
  link: string;
  subMenu?: MenuItem[];
}

export const menuItems: MenuItem[] = [
  { id: 'home', title: 'Home', link: '/' },
  { id: 'news', title: 'News', link: '/news' },
  { id: 'predictions', title: 'Predictions', link: '/predictions' },
  { id: 'leaderboard', title: 'Leaderboard', link: '/leaderboard' },
  { id: 'wallet', title: 'Pi Wallet', link: '/wallet' },
  {
    id: 'more',
    title: 'More',
    link: '#',
    subMenu: [
      { id: 'about', title: 'About Us', link: '/about' },
      { id: 'contact', title: 'Contact', link: '/contact' },
    ],
  },
];