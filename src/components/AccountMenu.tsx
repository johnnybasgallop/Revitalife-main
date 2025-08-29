"use client";

import { useEffect, useState } from "react";
import { FaSpinner, FaTimes } from "react-icons/fa";
import { useAuth } from "../contexts/AuthContext";
import { supabase } from "../lib/supabase";

interface AccountMenuProps {
  isOpen: boolean;
  onClose: () => void;
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

export default function AccountMenu({ isOpen, onClose }: AccountMenuProps) {
  const [userProfile, setUserProfile] = useState<UserProfile | null>(null);
  const [userSubscription, setUserSubscription] =
    useState<UserSubscription | null>(null);
  const [loading, setLoading] = useState(false);
  const { signOut, user } = useAuth();

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

  const openStripeCustomerPortal = async () => {
    if (!userProfile?.stripe_customer_id) {
      console.error("❌ No Stripe customer ID found in user profile");
      alert(
        "No billing information available. Please complete a purchase first."
      );
      return;
    }

    try {
      const response = await fetch("/api/create-portal-session", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          stripeCustomerId: userProfile.stripe_customer_id,
          returnUrl: window.location.href,
        }),
      });

      const data = await response.json();

      if (response.ok && data.url) {
        console.log("🚀 Redirecting to Stripe Customer Portal:", data.url);
        window.location.href = data.url;
      } else {
        console.error(
          "❌ Failed to create portal session:",
          data.error || "Unknown error"
        );
        alert(
          `Unable to open billing portal: ${
            data.error || "Please try again later"
          }`
        );
      }
    } catch (error) {
      console.error("❌ Error opening customer portal:", error);
      alert("Unable to open billing portal. Please try again later.");
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
          <div className="h-96 md:h-[32rem] overflow-y-auto p-6">
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
              <div className="space-y-6">
                {/* Account Details Section */}
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
                        <span className="text-gray-600">Member Since:</span>
                        <span className="font-medium">
                          {formatDate(userProfile?.created_at)}
                        </span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-600">
                          Subscription Status:
                        </span>
                        <div>
                          {getStatusBadge(userProfile?.subscription_status)}
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
                          <span className="text-gray-600">Current Period:</span>
                          <span className="font-medium">
                            {formatDate(userSubscription.current_period_start)}{" "}
                            - {formatDate(userSubscription.current_period_end)}
                          </span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-gray-600">Status:</span>
                          <div>{getStatusBadge(userSubscription.status)}</div>
                        </div>
                        {userSubscription.cancel_at_period_end && (
                          <div className="bg-yellow-100 border border-yellow-200 rounded-lg p-3">
                            <p className="text-yellow-800 text-sm">
                              ⚠️ Your subscription will be canceled at the end
                              of the current billing period.
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

                {/* Subscription Management Section */}
                <div>
                  <h3 className="text-xl font-semibold text-gray-900 mb-4">
                    Subscription Management
                  </h3>
                  {userSubscription ? (
                    <div className="bg-gray-50 rounded-lg p-4">
                      <div className="mb-4 p-3 bg-blue-50 rounded-lg">
                        <p className="text-sm text-blue-800">
                          💡 Use the "Manage Subscription & Billing" button
                          above to:
                        </p>
                        <ul className="text-sm text-blue-800 mt-2 ml-4 list-disc">
                          <li>Pause or cancel your subscription</li>
                          <li>Update payment methods</li>
                          <li>Change shipping and billing addresses</li>
                          <li>View billing history and invoices</li>
                        </ul>
                      </div>

                      <div className="mt-4 w-full flex items-center justify-center py-2">
                        <button
                          onClick={openStripeCustomerPortal}
                          className="w-full  bg-[#2d4a3e] text-white px-4 py-3 rounded-lg hover:bg-[#1a2f26] transition-colors"
                        >
                          Manage Subscription & Billing
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

                {/* Logout Section */}
                <div className="pt-6 border-t border-gray-200">
                  <div className="text-center">
                    <button
                      onClick={handleLogout}
                      className="bg-red-500 text-white px-8 py-3 rounded-lg hover:bg-red-600 transition-colors font-medium"
                    >
                      Logout
                    </button>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </>
  );
}
