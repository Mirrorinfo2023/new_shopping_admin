import {
  LayoutDashboard,
  Package,
  Users,
  ShoppingCart,
  MessageSquare,
  Settings,
  PlusCircle,
  List,
  UserCog,
  HelpCircle,
  BarChart3,
  MessageCircle,
  FileBarChart,
  AreaChart,
  LineChart,
  PieChart,
  ShoppingBag,
  Megaphone,
  PanelTop,
  LogOut,
  FileText,
  Banknote,
  ChevronDown,
  Search,
  Bell,
  Sun,
  Moon,
} from "lucide-react";
import { useState, useEffect } from "react";

const ICON_SIZE = {
  main: 20,
  sub: 18,
};

// Custom hook for sidebar functionality
const useSidebar = () => {
  const [expandedItems, setExpandedItems] = useState({});
  const [isCollapsed, setIsCollapsed] = useState(false);
  const [isDarkMode, setIsDarkMode] = useState(false);

  const toggleSubmenu = (title) => {
    setExpandedItems(prev => ({
      ...prev,
      [title]: !prev[title]
    }));
  };

  const toggleSidebar = () => {
    setIsCollapsed(!isCollapsed);
  };

  const toggleDarkMode = () => {
    setIsDarkMode(!isDarkMode);
  };

  return { 
    expandedItems, 
    toggleSubmenu, 
    isCollapsed, 
    toggleSidebar, 
    isDarkMode, 
    toggleDarkMode 
  };
};

// Sidebar Item Component with enhanced design
const SidebarItem = ({ 
  item, 
  isActive, 
  onClick, 
  level = 0, 
  expandedItems, 
  toggleSubmenu,
  isCollapsed 
}) => {
  const hasSubmenu = item.submenu && item.submenu.length > 0;
  const isExpanded = expandedItems[item.title];
  
  return (
    <div>
      <div
        onClick={() => hasSubmenu ? toggleSubmenu(item.title) : onClick(item)}
        className={`
          flex items-center justify-between px-4 py-3 mx-2 rounded-xl transition-all duration-300 cursor-pointer
          ${isActive 
            ? 'bg-gradient-to-r from-blue-500 to-blue-600 text-white shadow-lg shadow-blue-500/25' 
            : 'text-gray-700 hover:bg-blue-50 hover:text-blue-600 border border-transparent hover:border-blue-200'
          }
          ${level > 0 ? 'ml-4' : ''}
          group relative
          ${isCollapsed ? 'px-3 justify-center' : ''}
        `}
      >
        <div className={`flex items-center space-x-3 ${isCollapsed ? 'justify-center w-full' : ''}`}>
          <div className={`transition-all duration-300 ${
            isActive ? 'scale-110 transform' : 'group-hover:scale-105'
          } ${isCollapsed ? 'mx-auto' : ''}`}>
            {item.icon}
          </div>
          
          {!isCollapsed && (
            <span className="font-medium capitalize transition-all duration-300">
              {item.title}
            </span>
          )}
        </div>
        
        {hasSubmenu && !isCollapsed && (
          <div className={`transition-transform duration-300 ${isExpanded ? 'rotate-0' : '-rotate-90'}`}>
            <ChevronDown size={16} />
          </div>
        )}

        {/* Active indicator */}
        {isActive && (
          <div className="absolute left-0 top-1/2 transform -translate-y-1/2 w-1 h-8 bg-blue-500 rounded-r-full"></div>
        )}

        {/* Tooltip for collapsed mode */}
        {isCollapsed && (
          <div className="absolute left-full ml-2 px-2 py-1 bg-gray-900 text-white text-sm rounded opacity-0 group-hover:opacity-100 transition-opacity duration-200 z-50 whitespace-nowrap">
            {item.title}
            {hasSubmenu && item.submenu && (
              <div className="mt-1 bg-gray-800 rounded p-1">
                {item.submenu.map((sub, idx) => (
                  <div key={idx} className="px-2 py-1 hover:bg-gray-700 rounded">
                    {sub.title}
                  </div>
                ))}
              </div>
            )}
          </div>
        )}
      </div>

      {hasSubmenu && isExpanded && !isCollapsed && (
        <div className="mt-1 space-y-1 animate-fadeIn">
          {item.submenu.map((subItem, index) => (
            <SidebarItem
              key={index}
              item={subItem}
              isActive={isActive}
              onClick={onClick}
              level={level + 1}
              expandedItems={expandedItems}
              toggleSubmenu={toggleSubmenu}
              isCollapsed={isCollapsed}
            />
          ))}
        </div>
      )}
    </div>
  );
};

// Enhanced Sidebar Component
export const Sidebar = ({ activePath, onNavigate }) => {
  const { 
    expandedItems, 
    toggleSubmenu, 
    isCollapsed, 
    toggleSidebar, 
    isDarkMode, 
    toggleDarkMode 
  } = useSidebar();

  // Navigation data (same as your original structure)
  const mainNavItems = [
    {
      title: "Dashboard",
      path: "/dashboard/new",
      icon: <LayoutDashboard size={ICON_SIZE.main} />,
    },
  ];

  // Mirror App section
  // const plusCartItems = {
  //   title: "Mirror App",
  //   icon: <ShoppingBag size={ICON_SIZE.main} />,
  //   submenu: [
  //     {
  //       title: "UI Manager",
  //       path: "/pluscart/ui-manager",
  //       icon: <PanelTop size={ICON_SIZE.sub} />,
  //     },
  //     {
  //       title: "Overview",
  //       path: "/pluscart/overview",
  //       icon: <PanelTop size={ICON_SIZE.sub} />,
  //     },
  //     {
  //       title: "Promotions",
  //       path: "/pluscart/promotions",
  //       icon: <Megaphone size={ICON_SIZE.sub} />,
  //     },
  //   ],
  // };

  // Product management section
  const productItems = {
    title: "Products",
    icon: <Package size={ICON_SIZE.main} />,
    submenu: [
      // {
      //   title: "In House Product",
      //   path: "/products/inhouse-product",
      //   icon: <PlusCircle size={ICON_SIZE.sub} />,
      // },
      {
        title: "All Products",
        path: "/products",
        icon: <List size={ICON_SIZE.sub} />,
      },
      {
        title: "Add Product",
        path: "/products/add-product",
        icon: <PlusCircle size={ICON_SIZE.sub} />,
      },
      {
        title: "Category",
        path: "/category",
        icon: <PlusCircle size={ICON_SIZE.sub} />,
        // submenu: [
        //   // {
        //   //   title: "Categories List",
        //   //   path: "/category-list",
        //   //   icon: <List size={ICON_SIZE.sub} />,
        //   // },
        //   // {
        //   //   title: "Sub Categories List",
        //   //   path: "/category/sub-categories",
        //   //   icon: <List size={ICON_SIZE.sub} />,
        //   // },
        //   {
        //     title: "Category",
        //     path: "/category",
        //     icon: <PlusCircle size={ICON_SIZE.sub} />,
        //   },
        // ],
      },
      // {
      //   title: "Cancel Products",
      //   path: "/products/cancel",
      //   icon: <List size={ICON_SIZE.sub} />,
      // },
    ],
  };

  // Reports
  const reportItems = {
    title: "Reports",
    icon: <FileBarChart size={ICON_SIZE.main} />,
    submenu: [
      {
        title: "Sales Report",
        path: "/sales",
        icon: <AreaChart size={ICON_SIZE.sub} />,
      },
      {
        title: "Product Report",
        path: "/product-analytics",
        icon: <BarChart3 size={ICON_SIZE.sub} />,
      },
      {
        title: "Customer Report",
        path: "/customers-report",
        icon: <PieChart size={ICON_SIZE.sub} />,
      },
      {
        title: "Inventory Report",
        path: "/inventory-report",
        icon: <LineChart size={ICON_SIZE.sub} />,
      },
    ],
  };

  // Vendor section
  const vendorItems = {
    title: "Vendors",
    icon: <UserCog size={ICON_SIZE.main} />,
    submenu: [
      {
        title: "All Vendors",
        path: "/vendor",
        icon: <Users size={ICON_SIZE.sub} />,
      },
      // {
      //   title: "Vendor Analytics",
      //   path: "/vendor-analytics",
      //   icon: <LineChart size={ICON_SIZE.sub} />,
      // },
      // {
      //   title: "Vendor KYC",
      //   path: "/vendors-kyc",
      //   icon: <FileText size={ICON_SIZE.sub} />,
      // },
      // {
      //   title: "Vendor Withdrawal",
      //   path: "/vendors-withdrawal",
      //   icon: <Banknote size={ICON_SIZE.sub} />,
      // },
    ],
  };

  const promotionItems = {
    title: "Promotion Management",
    icon: <FileBarChart size={ICON_SIZE.main} />,
    submenu: [
      {
        title: "Banner Setup",
        path: "/permotions/banner-setup",
        icon: <AreaChart size={ICON_SIZE.sub} />,
      },
      {
        title: "Offers & Deals",
        path: "/promotions/offers-deals",
        icon: <BarChart3 size={ICON_SIZE.sub} />,
        submenu: [
          {
            title: "Coupon",
            path: "/permotions/coupons",
            icon: <BarChart3 size={ICON_SIZE.sub} />,
          },
          {
            title: "Fetured Deals",
            path: "/permotions/fetured-deals",
            icon: <BarChart3 size={ICON_SIZE.sub} />,
          },
        ],
      },
      {
        title: "Notification",
        path: "/permotions/notification",
        icon: <PieChart size={ICON_SIZE.sub} />,
      },
      {
        title: "Announcement",
        path: "/permotions/annoucement",
        icon: <LineChart size={ICON_SIZE.sub} />,
      },
    ],
  };

  // User management
  const userItems = {
    title: "User Management",
    icon: <Users size={ICON_SIZE.main} />,
    submenu: [
      {
        title: "All Users",
        path: "/users",
        icon: <UserCog size={ICON_SIZE.sub} />,
      },
      {
        title: "User Addresses",
        path: "/customer-address",
        icon: <BarChart3 size={ICON_SIZE.sub} />,
      },
      {
        title: "User Reviews",
        path: "/customer-review",
        icon: <BarChart3 size={ICON_SIZE.sub} />,
      },
    ],
  };

  // Order management
  const orderItems = {
    title: "Orders",
    icon: <ShoppingCart size={ICON_SIZE.main} />,
    submenu: [
      {
        title: "All Orders",
        path: "/orders",
        icon: <List size={ICON_SIZE.sub} />,
      },
      {
        title: "Order Analytics",
        path: "/orders-analytics",
        icon: <BarChart3 size={ICON_SIZE.sub} />,
      },
    ],
  };

  // Support
  const supportItems = {
    title: "Customer Support",
    icon: <MessageSquare size={ICON_SIZE.main} />,
    submenu: [
      {
        title: "Support Dashboard",
        path: "/CustomerSupport",
        icon: <HelpCircle size={ICON_SIZE.sub} />,
      },
      {
        title: "Live Chat",
        path: "/live-Chat",
        icon: <MessageCircle size={ICON_SIZE.sub} />,
      },
    ],
  };

  // Utility section
  const utilityItems = [
    {
      title: "Settings",
      path: "/settings",
      icon: <Settings size={ICON_SIZE.main} />,
    },
    {
      title: "Logout",
      path: "/logout",
      icon: <LogOut size={ICON_SIZE.main} />,
    },
  ];

  const sidebarSections = [
    ...mainNavItems,
    // plusCartItems,
    vendorItems,
    productItems,
    // reportItems,
    userItems,
    orderItems,
    // promotionItems,
    supportItems,
    ...utilityItems,
  ];

  return (
    <div className={`
      h-screen bg-gradient-to-b from-white to-gray-50/50 shadow-2xl border-r border-gray-200/60
      flex flex-col transition-all duration-300 ease-in-out
      ${isCollapsed ? 'w-20' : 'w-64'}
      ${isDarkMode ? 'dark bg-gradient-to-b from-gray-900 to-gray-800 border-gray-700' : ''}
    `}>
      
      {/* Header Section */}
      <div className="p-4 border-b border-gray-200/60 dark:border-gray-700">
        <div className={`flex items-center justify-between ${isCollapsed ? 'flex-col space-y-3' : 'space-x-3'}`}>
          
          {!isCollapsed && (
            <div className="flex items-center space-x-3 flex-1">
              <div className="w-10 h-10 bg-gradient-to-r from-blue-500 to-purple-600 rounded-xl flex items-center justify-center shadow-lg">
                <LayoutDashboard className="text-white" size={24} />
              </div>
              <div>
                <h1 className="text-xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent dark:from-blue-400 dark:to-purple-400">
                  AdminPanel
                </h1>
                <p className="text-gray-600 dark:text-gray-400 text-sm">Business Suite</p>
              </div>
            </div>
          )}
          
          {isCollapsed && (
            <div className="w-10 h-10 bg-gradient-to-r from-blue-500 to-purple-600 rounded-xl flex items-center justify-center shadow-lg">
              <LayoutDashboard className="text-white" size={24} />
            </div>
          )}

          {/* Toggle Button */}
          <button
            onClick={toggleSidebar}
            className="p-2 rounded-lg bg-gray-100 dark:bg-gray-800 hover:bg-gray-200 dark:hover:bg-gray-700 transition-colors duration-200"
          >
            <div className={`w-4 h-4 transition-transform duration-300 ${isCollapsed ? 'rotate-180' : ''}`}>
              <ChevronDown size={16} />
            </div>
          </button>
        </div>

        {/* Search Bar - Only visible when not collapsed */}
        {!isCollapsed && (
          <div className="mt-4 relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
            <input
              type="text"
              placeholder="Search..."
              className="w-full pl-10 pr-4 py-2 bg-gray-100 dark:bg-gray-800 border-0 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/50 transition-all duration-200"
            />
          </div>
        )}
      </div>

      {/* Navigation Sections */}
      <div className="flex-1 overflow-y-auto py-4 custom-scrollbar">
        <nav className="space-y-1 px-2">
          {sidebarSections.map((item, index) => (
            <SidebarItem
              key={index}
              item={item}
              isActive={activePath === item.path || (item.submenu && item.submenu.some(sub => sub.path === activePath))}
              onClick={onNavigate}
              expandedItems={expandedItems}
              toggleSubmenu={toggleSubmenu}
              isCollapsed={isCollapsed}
            />
          ))}
        </nav>
      </div>

      {/* Footer Section */}
      <div className="p-4 border-t border-gray-200/60 dark:border-gray-700 space-y-3">
        
        {/* Theme Toggle */}
        <button
          onClick={toggleDarkMode}
          className="w-full flex items-center justify-center p-2 rounded-lg bg-gray-100 dark:bg-gray-800 hover:bg-gray-200 dark:hover:bg-gray-700 transition-colors duration-200"
        >
          {isDarkMode ? (
            <Sun size={18} className="text-yellow-500" />
          ) : (
            <Moon size={18} className="text-gray-600" />
          )}
          {!isCollapsed && (
            <span className="ml-2 text-sm">
              {isDarkMode ? 'Light Mode' : 'Dark Mode'}
            </span>
          )}
        </button>

        {/* User Profile */}
        <div className={`flex items-center p-2 rounded-lg bg-blue-50 dark:bg-blue-900/20 border border-blue-100 dark:border-blue-800/50 ${isCollapsed ? 'justify-center' : 'space-x-3'}`}>
          <div className="w-8 h-8 bg-gradient-to-r from-blue-500 to-purple-500 rounded-full flex items-center justify-center shadow">
            <span className="text-white font-bold text-sm">A</span>
          </div>
          
          {!isCollapsed && (
            <div className="flex-1 min-w-0">
              <p className="text-sm font-medium text-gray-900 dark:text-white truncate">Admin User</p>
              <p className="text-xs text-gray-600 dark:text-gray-400 truncate">admin@example.com</p>
            </div>
          )}
          
          {!isCollapsed && (
            <button className="p-1 rounded hover:bg-blue-100 dark:hover:bg-blue-800/50 transition-colors">
              <Bell size={14} className="text-gray-600 dark:text-gray-400" />
            </button>
          )}
        </div>
      </div>

      <style jsx>{`
        .custom-scrollbar::-webkit-scrollbar {
          width: 4px;
        }
        .custom-scrollbar::-webkit-scrollbar-track {
          background: transparent;
        }
        .custom-scrollbar::-webkit-scrollbar-thumb {
          background: #cbd5e1;
          border-radius: 10px;
        }
        .custom-scrollbar::-webkit-scrollbar-thumb:hover {
          background: #94a3b8;
        }
        .dark .custom-scrollbar::-webkit-scrollbar-thumb {
          background: #475569;
        }
        .dark .custom-scrollbar::-webkit-scrollbar-thumb:hover {
          background: #64748b;
        }
        
        @keyframes fadeIn {
          from { opacity: 0; transform: translateY(-10px); }
          to { opacity: 1; transform: translateY(0); }
        }
        .animate-fadeIn {
          animation: fadeIn 0.2s ease-out;
        }
      `}</style>
    </div>
  );
};

// Enhanced sidebar data export (preserving all comments)
export const sidebarData = [
  {
    title: "Dashboard",
    path: "/dashboard/new",
    icon: <LayoutDashboard size={ICON_SIZE.main} />,
  },
  // {
  //   title: "Mirror App",
  //   icon: <ShoppingBag size={ICON_SIZE.main} />,
  //   submenu: [
  //     {
  //       title: "UI Manager",
  //       path: "/pluscart/ui-manager",
  //       icon: <PanelTop size={ICON_SIZE.sub} />,
  //     },
  //     {
  //       title: "Overview",
  //       path: "/pluscart/overview",
  //       icon: <PanelTop size={ICON_SIZE.sub} />,
  //     },
  //     {
  //       title: "Promotions",
  //       path: "/pluscart/promotions",
  //       icon: <Megaphone size={ICON_SIZE.sub} />,
  //     },
  //   ],
  // },
  {
    title: "Vendors",
    icon: <UserCog size={ICON_SIZE.main} />,
    submenu: [
      {
        title: "All Vendors",
        path: "/vendor",
        icon: <Users size={ICON_SIZE.sub} />,
      },
      // {
      //   title: "Vendor Analytics",
      //   path: "/vendor-analytics",
      //   icon: <LineChart size={ICON_SIZE.sub} />,
      // },
      // {
      //   title: "Vendor KYC",
      //   path: "/vendors-kyc",
      //   icon: <FileText size={ICON_SIZE.sub} />,
      // },
      // {
      //   title: "Vendor Withdrawal",
      //   path: "/vendors-withdrawal",
      //   icon: <Banknote size={ICON_SIZE.sub} />,
      // },
    ],
  },
  {
    title: "Products",
    icon: <Package size={ICON_SIZE.main} />,
    submenu: [
      // {
      //   title: "In House Product",
      //   path: "/products/inhouse-product",
      //   icon: <PlusCircle size={ICON_SIZE.sub} />,
      // },
      {
        title: "All Products",
        path: "/products",
        icon: <List size={ICON_SIZE.sub} />,
      },
      {
        title: "Add Product",
        path: "/products/add-product",
        icon: <PlusCircle size={ICON_SIZE.sub} />,
      },
      {
        title: "Category",
        path: "/category",
        icon: <PlusCircle size={ICON_SIZE.sub} />,
        // submenu: [
        //   // {
        //   //   title: "Categories List",
        //   //   path: "/category-list",
        //   //   icon: <List size={ICON_SIZE.sub} />,
        //   // },
        //   // {
        //   //   title: "Sub Categories List",
        //   //   path: "/category/sub-categories",
        //   //   icon: <List size={ICON_SIZE.sub} />,
        //   // },
        //   {
        //     title: "Category",
        //     path: "/category",
        //     icon: <PlusCircle size={ICON_SIZE.sub} />,
        //   },
        // ],
      },
      // {
      //   title: "Cancel Products",
      //   path: "/products/cancel",
      //   icon: <List size={ICON_SIZE.sub} />,
      // },
    ],
  },
  // {
  //   title: "Reports",
  //   icon: <FileBarChart size={ICON_SIZE.main} />,
  //   submenu: [
  //     {
  //       title: "Sales Report",
  //       path: "/sales",
  //       icon: <AreaChart size={ICON_SIZE.sub} />,
  //     },
  //     {
  //       title: "Product Report",
  //       path: "/product-analytics",
  //       icon: <BarChart3 size={ICON_SIZE.sub} />,
  //     },
  //     {
  //       title: "Customer Report",
  //       path: "/customers-report",
  //       icon: <PieChart size={ICON_SIZE.sub} />,
  //     },
  //     {
  //       title: "Inventory Report",
  //       path: "/inventory-report",
  //       icon: <LineChart size={ICON_SIZE.sub} />,
  //     },
  //   ],
  // },
  {
    title: "User Management",
    icon: <Users size={ICON_SIZE.main} />,
    submenu: [
      {
        title: "All Users",
        path: "/users",
        icon: <UserCog size={ICON_SIZE.sub} />,
      },
      {
        title: "User Addresses",
        path: "/customer-address",
        icon: <BarChart3 size={ICON_SIZE.sub} />,
      },
      {
        title: "User Reviews",
        path: "/customer-review",
        icon: <BarChart3 size={ICON_SIZE.sub} />,
      },
    ],
  },
  {
    title: "Orders",
    icon: <ShoppingCart size={ICON_SIZE.main} />,
    submenu: [
      {
        title: "All Orders",
        path: "/orders",
        icon: <List size={ICON_SIZE.sub} />,
      },
      {
        title: "Order Analytics",
        path: "/orders-analytics",
        icon: <BarChart3 size={ICON_SIZE.sub} />,
      },
    ],
  },
  // {
  //   title: "Promotion Management",
  //   icon: <FileBarChart size={ICON_SIZE.main} />,
  //   submenu: [
  //     {
  //       title: "Banner Setup",
  //       path: "/permotions/banner-setup",
  //       icon: <AreaChart size={ICON_SIZE.sub} />,
  //     },
  //     {
  //       title: "Offers & Deals",
  //       path: "/promotions/offers-deals",
  //       icon: <BarChart3 size={ICON_SIZE.sub} />,
  //       submenu: [
  //         {
  //           title: "Coupon",
  //           path: "/permotions/coupons",
  //           icon: <BarChart3 size={ICON_SIZE.sub} />,
  //         },
  //         {
  //           title: "Fetured Deals",
  //           path: "/permotions/fetured-deals",
  //           icon: <BarChart3 size={ICON_SIZE.sub} />,
  //         },
  //       ],
  //     },
  //     {
  //       title: "Notification",
  //       path: "/permotions/notification",
  //       icon: <PieChart size={ICON_SIZE.sub} />,
  //     },
  //     {
  //       title: "Announcement",
  //       path: "/permotions/annoucement",
  //       icon: <LineChart size={ICON_SIZE.sub} />,
  //     },
  //   ],
  // },
  {
    title: "Customer Support",
    icon: <MessageSquare size={ICON_SIZE.main} />,
    submenu: [
      {
        title: "Support Dashboard",
        path: "/CustomerSupport",
        icon: <HelpCircle size={ICON_SIZE.sub} />,
      },
      {
        title: "Live Chat",
        path: "/live-Chat",
        icon: <MessageCircle size={ICON_SIZE.sub} />,
      },
    ],
  },
  {
    title: "Settings",
    path: "/settings",
    icon: <Settings size={ICON_SIZE.main} />,
  },
  {
    title: "Logout",
    path: "/logout",
    icon: <LogOut size={ICON_SIZE.main} />,
  },
];

export default Sidebar;