// assets
import { IconDashboard,IconChartAreaLine,IconChartCircles,IconChartBubble, IconBrandTabler } from '@tabler/icons';

// constant
const icons = { IconDashboard,IconChartAreaLine,IconChartCircles,IconChartBubble, IconBrandTabler };

// ==============================|| DASHBOARD MENU ITEMS ||============================== //

const dashboard = {
  id: 'dashboard',
  title: 'Dashboard',
  type: 'group',
  children: [
    {
      id: 'default',
      title: 'Dashboard',
      type: 'item',
      url: '/dashboard/default',
      icon: icons.IconDashboard,
      breadcrumbs: false
    },
    {
      id: 'graphs-scatter',
      title: 'Scatter Plot',
      type: 'item',
      url: '/scatterplot',
      icon: icons.IconChartBubble,
      breadcrumbs: false
    },
    {
      id: 'table-data',
      title: 'Table',
      type: 'item',
      url: '/table',
      icon: icons.IconBrandTabler,
      breadcrumbs: false
    },
  ]
};

export default dashboard;
