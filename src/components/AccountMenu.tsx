"use client";

import { useEffect, useState } from "react";
import { FaTimes } from "react-icons/fa";
import { useAuth } from "../contexts/AuthContext";

interface AccountMenuProps {
  isOpen: boolean;
  onClose: () => void;
  activeMenuItem?: string;
  onMenuItemChange?: (itemId: string) => void;
}

export default function AccountMenu({
  isOpen,
  onClose,
  activeMenuItem = "details",
  onMenuItemChange,
}: AccountMenuProps) {
  const [localActiveMenuItem, setLocalActiveMenuItem] =
    useState(activeMenuItem);
  const { signOut } = useAuth();

  // Use local state if no external control, otherwise use props
  const currentActiveMenuItem = onMenuItemChange
    ? activeMenuItem
    : localActiveMenuItem;
  const setCurrentActiveMenuItem = onMenuItemChange || setLocalActiveMenuItem;

  // Sync local state when prop changes
  useEffect(() => {
    if (onMenuItemChange) {
      setLocalActiveMenuItem(activeMenuItem);
    }
  }, [activeMenuItem, onMenuItemChange]);

  if (!isOpen) return null;

  const handleLogout = () => {
    signOut();
    onClose();
  };

  return (
    <>
      {/* Full screen overlay */}
      <div className="fixed inset-0 bg-black/25 bg-opacity-75 z-50" />

      {/* Centered modal container */}
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
        <div className="account-menu bg-white rounded-2xl shadow-2xl w-full max-w-5xl overflow-hidden">
          {/* Header */}
          <div className="bg-gradient-to-r from-[#2d4a3e] to-[#4a6b5a] p-6 text-white relative">
            <button
              onClick={onClose}
              className="absolute top-4 right-4 text-white hover:text-gray-200 transition-colors"
              aria-label="Close menu"
            >
              <FaTimes className="h-5 w-5" />
            </button>
            <h2 className="text-2xl font-bold text-center">Account Settings</h2>
            <p className="text-center text-gray-100 mt-2">
              Manage your account and preferences
            </p>
          </div>

          {/* Menu Content */}
          <div className="flex h-[28rem] md:h-96">
            {/* Left Sidebar */}
            <div className="w-16 md:w-1/3 bg-gray-50 border-r border-gray-200 p-2 md:p-4">
              <nav className="space-y-2">
                {[
                  {
                    id: "details",
                    label: "Details",
                    icon: "👤",
                  },
                  {
                    id: "billing",
                    label: "Billing Info",
                    icon: "💳",
                  },
                  {
                    id: "subscription",
                    label: "Subscription",
                    icon: "📅",
                  },
                  {
                    id: "settings",
                    label: "Settings",
                    icon: "⚙️",
                  },
                  {
                    id: "logout",
                    label: "Logout",
                    icon: "🚪",
                  },
                ].map((item) => (
                  <button
                    key={item.id}
                    onClick={() => {
                      if (item.id === "logout") {
                        handleLogout();
                      } else {
                        setCurrentActiveMenuItem(item.id);
                      }
                    }}
                    title={item.label}
                    className={`w-full flex flex-col md:flex-row items-center justify-center md:justify-start px-2 md:px-4 py-3 rounded-lg transition-colors ${
                      currentActiveMenuItem === item.id
                        ? "bg-[#2d4a3e] text-white"
                        : "text-gray-700 hover:bg-gray-200"
                    }`}
                  >
                    <span className="text-lg md:text-base md:mr-3">
                      {item.icon}
                    </span>
                    <span className="hidden md:inline">{item.label}</span>
                  </button>
                ))}
              </nav>
            </div>

            {/* Right Content Area */}
            <div className="w-[calc(100%-4rem)] md:w-2/3 p-4 md:p-6">
              <div className="h-full flex items-center justify-center text-gray-500">
                <div className="text-center">
                  <div className="text-6xl mb-4">📋</div>
                  <h3 className="text-xl font-semibold mb-2">
                    {currentActiveMenuItem === "details" && "Account Details"}
                    {currentActiveMenuItem === "billing" &&
                      "Billing Information"}
                    {currentActiveMenuItem === "subscription" &&
                      "Subscription Management"}
                    {currentActiveMenuItem === "settings" && "Account Settings"}
                    {currentActiveMenuItem === "logout" && "Logout"}
                  </h3>
                  <p className="text-gray-500">
                    Content for {currentActiveMenuItem} will appear here
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
