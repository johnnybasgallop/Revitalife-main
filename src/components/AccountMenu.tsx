"use client";

import { useEffect, useState } from "react";
import { FaSpinner, FaTimes } from "react-icons/fa";
import { useAuth } from "../contexts/AuthContext";
import { supabase } from "../lib/supabase";

interface AccountMenuProps {
  isOpen: boolean;
  onClose: () => void;
  activeMenuItem?: string;
  onMenuItemChange?: (itemId: string) => void;
}

interface UserProfile {
  id: string;
  email: string;
  full_name: string;
  stripe_customer_id: string | null;
  subscription_status: string | null;
  created_at: string;
}

interface UserSubscription {
  id: string;
  status: string;
  plan_type: string;
  current_period_start: string | null;
  current_period_end: string | null;
  quantity: number;
  cancel_at_period_end: boolean;
}

interface BillingDetails {
  shipping_address: {
    line1: string | null;
    line2: string | null;
    city: string | null;
    state: string | null;
    postal_code: string | null;
    country: string | null;
  } | null;
  payment_methods: Array<{
    id: string;
    type: string;
    card?: {
      brand: string;
      last4: string;
      exp_month: number;
      exp_year: number;
    };
  }>;
}

export default function AccountMenu({
  isOpen,
  onClose,
  activeMenuItem = "details",
  onMenuItemChange,
}: AccountMenuProps) {
  const [localActiveMenuItem, setLocalActiveMenuItem] =
    useState(activeMenuItem);
  const [userProfile, setUserProfile] = useState<UserProfile | null>(null);
  const [userSubscription, setUserSubscription] =
    useState<UserSubscription | null>(null);
  const [billingDetails, setBillingDetails] = useState<BillingDetails | null>(
    null
  );
  const [loading, setLoading] = useState(false);
  const { signOut, user } = useAuth();

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

  // Fetch user data when modal opens or user changes
  useEffect(() => {
    if (isOpen && user) {
      fetchUserData();
    }
  }, [isOpen, user]);

  // Prevent background scrolling when modal is open
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "unset";
    }

    // Cleanup function to restore scrolling when component unmounts
    return () => {
      document.body.style.overflow = "unset";
    };
  }, [isOpen]);

  const fetchUserData = async () => {
    if (!user) return;

    setLoading(true);
    try {
      // Fetch user profile
      const { data: profile, error: profileError } = await supabase
        .from("profiles")
        .select("*")
        .eq("id", user.id)
        .single();

      if (profileError) {
        console.error("Error fetching profile:", profileError);
      } else {
        setUserProfile(profile);

        // Fetch billing details if user has Stripe customer ID
        if (profile.stripe_customer_id) {
          await fetchBillingDetails(profile.stripe_customer_id);
        }
      }

      // Fetch user subscription
      const { data: subscription, error: subscriptionError } = await supabase
        .from("subscriptions")
        .select("*")
        .eq("user_id", user.id)
        .eq("status", "active")
        .single();

      if (subscriptionError && subscriptionError.code !== "PGRST116") {
        console.error("Error fetching subscription:", subscriptionError);
      } else {
        setUserSubscription(subscription);
      }
    } catch (error) {
      console.error("Error fetching user data:", error);
    } finally {
      setLoading(false);
    }
  };

  const fetchBillingDetails = async (stripeCustomerId: string) => {
    try {
      const response = await fetch("/api/get-billing-details", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ stripeCustomerId }),
      });

      if (response.ok) {
        const data = await response.json();
        setBillingDetails(data);
      } else {
        console.error("Failed to fetch billing details");
      }
    } catch (error) {
      console.error("Error fetching billing details:", error);
    }
  };

  if (!isOpen) return null;

  const handleLogout = () => {
    signOut();
    onClose();
  };

  const formatDate = (dateString: string | null | undefined) => {
    if (!dateString) return "N/A";
    return new Date(dateString).toLocaleDateString("en-GB", {
      year: "numeric",
      month: "long",
      day: "numeric",
    });
  };

  const getStatusBadge = (status: string | null | undefined) => {
    if (!status) return null;

    const statusConfig = {
      active: { color: "bg-green-100 text-green-800", label: "Active" },
      inactive: { color: "bg-gray-100 text-gray-800", label: "Inactive" },
      past_due: { color: "bg-yellow-100 text-yellow-800", label: "Past Due" },
      canceled: { color: "bg-red-100 text-red-800", label: "Canceled" },
    };

    const config =
      statusConfig[status as keyof typeof statusConfig] ||
      statusConfig.inactive;

    return (
      <span
        className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${config.color}`}
      >
        {config.label}
      </span>
    );
  };

  return (
    <>
      {/* Full screen overlay */}
      <div className="fixed inset-0 bg-black/25 bg-opacity-75 z-50" />

      {/* Centered modal container */}
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
        <div className="account-menu bg-white rounded-2xl shadow-2xl w-full max-w-5xl max-h-[90vh] overflow-hidden">
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
          <div className="flex h-96 md:h-[32rem]">
            {/* Left Sidebar */}
            <div className="w-16 md:w-1/3 bg-gray-50 border-r border-gray-200 p-2 md:p-4 flex-shrink-0">
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
            <div className="w-[calc(100%-4rem)] md:w-2/3 p-4 md:p-6 overflow-y-auto">
              {loading ? (
                <div className="h-full flex items-center justify-center">
                  <div className="text-center">
                    <FaSpinner className="h-8 w-8 animate-spin text-[#2d4a3e] mx-auto mb-4" />
                    <p className="text-gray-500">
                      Loading your account information...
                    </p>
                  </div>
                </div>
              ) : (
                <div className="h-full">
                  {currentActiveMenuItem === "details" && (
                    <div className="space-y-6">
                      <div>
                        <h3 className="text-xl font-semibold text-gray-900 mb-4">
                          Account Details
                        </h3>

                        {/* Profile Information */}
                        <div className="bg-gray-50 rounded-lg p-4 mb-4">
                          <h4 className="font-medium text-gray-900 mb-3">
                            Profile Information
                          </h4>
                          <div className="space-y-3">
                            <div className="flex justify-between">
                              <span className="text-gray-600">Full Name:</span>
                              <span className="font-medium">
                                {userProfile?.full_name || "N/A"}
                              </span>
                            </div>
                            <div className="flex justify-between">
                              <span className="text-gray-600">Email:</span>
                              <span className="font-medium">
                                {userProfile?.email || "N/A"}
                              </span>
                            </div>
                            <div className="flex justify-between">
                              <span className="text-gray-600">
                                Member Since:
                              </span>
                              <span className="font-medium">
                                {formatDate(userProfile?.created_at)}
                              </span>
                            </div>
                            <div className="flex justify-between">
                              <span className="text-gray-600">
                                Subscription Status:
                              </span>
                              <div>
                                {getStatusBadge(
                                  userProfile?.subscription_status
                                )}
                              </div>
                            </div>
                          </div>
                        </div>

                        {/* Subscription Information */}
                        {userSubscription && (
                          <div className="bg-blue-50 rounded-lg p-4">
                            <h4 className="font-medium text-gray-900 mb-3">
                              Active Subscription
                            </h4>
                            <div className="space-y-3">
                              <div className="flex justify-between">
                                <span className="text-gray-600">Plan:</span>
                                <span className="font-medium capitalize">
                                  {userSubscription.plan_type} Plan
                                </span>
                              </div>
                              <div className="flex justify-between">
                                <span className="text-gray-600">Quantity:</span>
                                <span className="font-medium">
                                  {userSubscription.quantity}
                                </span>
                              </div>
                              <div className="flex justify-between">
                                <span className="text-gray-600">
                                  Current Period:
                                </span>
                                <span className="font-medium">
                                  {formatDate(
                                    userSubscription.current_period_start
                                  )}{" "}
                                  -{" "}
                                  {formatDate(
                                    userSubscription.current_period_end
                                  )}
                                </span>
                              </div>
                              <div className="flex justify-between">
                                <span className="text-gray-600">Status:</span>
                                <div>
                                  {getStatusBadge(userSubscription.status)}
                                </div>
                              </div>
                              {userSubscription.cancel_at_period_end && (
                                <div className="bg-yellow-100 border border-yellow-200 rounded-lg p-3">
                                  <p className="text-yellow-800 text-sm">
                                    ⚠️ Your subscription will be canceled at the
                                    end of the current billing period.
                                  </p>
                                </div>
                              )}
                            </div>
                          </div>
                        )}

                        {!userSubscription &&
                          userProfile?.subscription_status === "inactive" && (
                            <div className="bg-gray-100 rounded-lg p-4 text-center">
                              <p className="text-gray-600 mb-3">
                                No active subscription
                              </p>
                              <button className="bg-[#2d4a3e] text-white px-4 py-2 rounded-lg hover:bg-[#1a2f26] transition-colors">
                                Subscribe Now
                              </button>
                            </div>
                          )}
                      </div>
                    </div>
                  )}

                  {currentActiveMenuItem === "billing" && (
                    <div className="space-y-6">
                      <h3 className="text-xl font-semibold text-gray-900 mb-4">
                        Billing Information
                      </h3>

                      {/* Stripe Customer ID */}
                      <div className="bg-gray-50 rounded-lg p-4">
                        <h4 className="font-medium text-gray-900 mb-3">
                          Account Information
                        </h4>
                        <div className="space-y-3">
                          <div className="flex justify-between">
                            <span className="text-gray-600">
                              Stripe Customer ID:
                            </span>
                            <span className="font-mono text-sm">
                              {userProfile?.stripe_customer_id ||
                                "Not available"}
                            </span>
                          </div>
                        </div>
                      </div>

                      {/* Shipping Address */}
                      {billingDetails?.shipping_address && (
                        <div className="bg-blue-50 rounded-lg p-4">
                          <h4 className="font-medium text-gray-900 mb-3">
                            Shipping Address
                          </h4>
                          <div className="space-y-2">
                            {billingDetails.shipping_address.line1 && (
                              <p className="text-gray-700">
                                {billingDetails.shipping_address.line1}
                              </p>
                            )}
                            {billingDetails.shipping_address.line2 && (
                              <p className="text-gray-700">
                                {billingDetails.shipping_address.line2}
                              </p>
                            )}
                            <p className="text-gray-700">
                              {billingDetails.shipping_address.city &&
                                billingDetails.shipping_address.city}
                              {billingDetails.shipping_address.state &&
                                `, ${billingDetails.shipping_address.state}`}
                              {billingDetails.shipping_address.postal_code &&
                                ` ${billingDetails.shipping_address.postal_code}`}
                            </p>
                            {billingDetails.shipping_address.country && (
                              <p className="text-gray-700">
                                {billingDetails.shipping_address.country}
                              </p>
                            )}
                          </div>
                        </div>
                      )}

                      {/* Payment Methods */}
                      {billingDetails?.payment_methods &&
                        billingDetails.payment_methods.length > 0 && (
                          <div className="bg-green-50 rounded-lg p-4">
                            <h4 className="font-medium text-gray-900 mb-3">
                              Payment Methods
                            </h4>
                            <div className="space-y-3">
                              {billingDetails.payment_methods.map((method) => (
                                <div
                                  key={method.id}
                                  className="flex items-center justify-between p-3 bg-white rounded-lg border"
                                >
                                  <div className="flex items-center space-x-3">
                                    <div className="w-8 h-8 bg-gray-100 rounded-full flex items-center justify-center">
                                      <span className="text-sm font-medium text-gray-600">
                                        {method.card?.brand
                                          ?.charAt(0)
                                          .toUpperCase() || "💳"}
                                      </span>
                                    </div>
                                    <div>
                                      <p className="font-medium text-gray-900">
                                        {method.card?.brand
                                          ? `${
                                              method.card.brand
                                                .charAt(0)
                                                .toUpperCase() +
                                              method.card.brand.slice(1)
                                            } ending in ${method.card.last4}`
                                          : "Payment Method"}
                                      </p>
                                      {method.card && (
                                        <p className="text-sm text-gray-500">
                                          Expires {method.card.exp_month}/
                                          {method.card.exp_year}
                                        </p>
                                      )}
                                    </div>
                                  </div>
                                  <button className="text-red-500 hover:text-red-700 text-sm font-medium">
                                    Remove
                                  </button>
                                </div>
                              ))}
                            </div>
                          </div>
                        )}

                      {!billingDetails?.shipping_address &&
                        !billingDetails?.payment_methods && (
                          <div className="bg-gray-100 rounded-lg p-4 text-center">
                            <p className="text-gray-600 mb-3">
                              No billing information available
                            </p>
                            <p className="text-sm text-gray-500">
                              Complete a purchase to see your billing details
                              here
                            </p>
                          </div>
                        )}
                    </div>
                  )}

                  {currentActiveMenuItem === "subscription" && (
                    <div className="space-y-6">
                      <h3 className="text-xl font-semibold text-gray-900 mb-4">
                        Subscription Management
                      </h3>
                      {userSubscription ? (
                        <div className="bg-blue-50 rounded-lg p-4">
                          <h4 className="font-medium text-gray-900 mb-3">
                            Current Subscription
                          </h4>
                          <div className="space-y-3">
                            <div className="flex justify-between">
                              <span className="text-gray-600">Status:</span>
                              <div>
                                {getStatusBadge(userSubscription.status)}
                              </div>
                            </div>
                            <div className="flex justify-between">
                              <span className="text-gray-600">
                                Next Billing:
                              </span>
                              <span className="font-medium">
                                {formatDate(
                                  userSubscription.current_period_end
                                )}
                              </span>
                            </div>
                          </div>
                          <div className="mt-4 space-y-2">
                            <button className="w-full bg-yellow-500 text-white px-4 py-2 rounded-lg hover:bg-yellow-600 transition-colors">
                              Pause Subscription
                            </button>
                            <button className="w-full bg-red-500 text-white px-4 py-2 rounded-lg hover:bg-red-600 transition-colors">
                              Cancel Subscription
                            </button>
                          </div>
                        </div>
                      ) : (
                        <div className="bg-gray-100 rounded-lg p-4 text-center">
                          <p className="text-gray-600 mb-3">
                            No active subscription
                          </p>
                          <button className="bg-[#2d4a3e] text-white px-4 py-2 rounded-lg hover:bg-[#1a2f26] transition-colors">
                            Subscribe Now
                          </button>
                        </div>
                      )}
                    </div>
                  )}

                  {currentActiveMenuItem === "settings" && (
                    <div className="space-y-6">
                      <h3 className="text-xl font-semibold text-gray-900 mb-4">
                        Account Settings
                      </h3>
                      <div className="bg-gray-50 rounded-lg p-4">
                        <p className="text-gray-600">
                          Account settings and preferences will be available
                          here.
                        </p>
                      </div>
                    </div>
                  )}

                  {currentActiveMenuItem === "logout" && (
                    <div className="space-y-6">
                      <h3 className="text-xl font-semibold text-gray-900 mb-4">
                        Logout
                      </h3>
                      <div className="bg-gray-50 rounded-lg p-4 text-center">
                        <p className="text-gray-600 mb-4">
                          Are you sure you want to log out?
                        </p>
                        <button
                          onClick={handleLogout}
                          className="bg-red-500 text-white px-6 py-2 rounded-lg hover:bg-red-600 transition-colors"
                        >
                          Logout
                        </button>
                      </div>
                    </div>
                  )}
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
