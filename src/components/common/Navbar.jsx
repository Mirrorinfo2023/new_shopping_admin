'use client';

import React, { useState, useEffect, useRef } from "react";
import { useRouter } from "next/navigation";
import { Bell, User, Settings, LogOut, Sun, Moon, ChevronDown, Search, X } from "lucide-react";
import { logout } from "../../api/apicall/auth";

const Navbar = () => {
  const [isProfileOpen, setIsProfileOpen] = useState(false);
  const [isNotificationsOpen, setIsNotificationsOpen] = useState(false);
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [isDarkMode, setIsDarkMode] = useState(false);

  const router = useRouter(); 
  const profileRef = useRef(null);
  const notificationsRef = useRef(null);
  const searchRef = useRef(null);

  const [notifications] = useState([
    { id: 1, message: "New order received", time: "5 mins ago" },
    { id: 2, message: "Product stock low", time: "10 mins ago" },
  ]);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (profileRef.current && !profileRef.current.contains(event.target)) setIsProfileOpen(false);
      if (notificationsRef.current && !notificationsRef.current.contains(event.target)) setIsNotificationsOpen(false);
      if (searchRef.current && !searchRef.current.contains(event.target) && window.innerWidth < 640) setIsSearchOpen(false);
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const toggleProfileMenu = () => {
    setIsProfileOpen(!isProfileOpen);
    if (isNotificationsOpen) setIsNotificationsOpen(false);
    if (isSearchOpen && window.innerWidth < 640) setIsSearchOpen(false);
  };

  const toggleNotifications = () => {
    setIsNotificationsOpen(!isNotificationsOpen);
    if (isProfileOpen) setIsProfileOpen(false);
    if (isSearchOpen && window.innerWidth < 640) setIsSearchOpen(false);
  };

  const toggleSearchBar = () => {
    setIsSearchOpen(!isSearchOpen);
    if (isProfileOpen) setIsProfileOpen(false);
    if (isNotificationsOpen) setIsNotificationsOpen(false);
  };

  const toggleDarkMode = () => {
    setIsDarkMode(!isDarkMode);
    document.documentElement.classList.toggle("dark");
  };

  const handleLogout = () => {
    logout(() => {
      router.push("/login"); 
    });
  };

  return (
    <nav className="fixed top-0 right-0 left-0 lg:left-64 bg-white shadow-md dark:bg-gray-800 z-30 transition-all duration-300">
      <div className="h-16 px-4 flex items-center justify-between">
        <div className="lg:hidden text-xl font-bold text-blue-600">Mirror</div>

        <div className="flex items-center gap-1 sm:gap-2 ml-auto">
          <div ref={profileRef} className="relative">
            <button onClick={toggleProfileMenu} className="flex items-center gap-2 cursor-pointer p-1 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg transition-colors">
              <div className="w-8 h-8 rounded-full bg-blue-600 flex items-center justify-center text-white">A</div>
              <span className="hidden sm:block text-sm font-medium text-gray-700 dark:text-gray-300">Admin</span>
              <ChevronDown className="hidden sm:block h-4 w-4 text-gray-500 dark:text-gray-400" />
            </button>

            {isProfileOpen && (
              <div className="absolute right-0 mt-2 w-48 bg-white dark:bg-gray-800 rounded-lg shadow-lg overflow-hidden z-10 border dark:border-gray-700 animate-fadeIn">
                <div className="py-1">
                  <button
                    onClick={() => { setIsProfileOpen(false); router.push("/profile"); }}
                    className="flex items-center gap-2 w-full px-4 py-2 text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors text-left"
                  >
                    <User className="h-4 w-4" />
                    Your Profile
                  </button>
                  <button
                    onClick={() => { setIsProfileOpen(false); router.push("/settings"); }}
                    className="flex items-center gap-2 w-full px-4 py-2 text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors text-left"
                  >
                    <Settings className="h-4 w-4" />
                    Settings
                  </button>
                  <button
                    onClick={handleLogout}
                    className="flex items-center gap-2 w-full px-4 py-2 text-sm text-red-600 dark:text-red-400 hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors text-left"
                  >
                    <LogOut className="h-4 w-4" />
                    Logout
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
