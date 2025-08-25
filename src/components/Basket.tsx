"use client";

import { motion } from "framer-motion";
import { useState } from "react";
import { FaMinus, FaPlus, FaShoppingCart, FaTrash } from "react-icons/fa";
import { useBasket } from "../contexts/BasketContext";
import { useNotification } from "../contexts/NotificationContext";

export default function Basket() {
  const { state, removeItem, updateQuantity, setIsBasketOpen } = useBasket();
  const { addNotification } = useNotification();
  const [isCheckingOut, setIsCheckingOut] = useState(false);

  const handleCheckout = async () => {
    if (state.items.length === 0) return;

    setIsCheckingOut(true);
    try {
      const response = await fetch("/api/create-checkout-session", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          items: state.items,
        }),
      });

      if (response.ok) {
        const data = await response.json();

        // Validate the URL before redirecting
        if (!data.url || typeof data.url !== "string") {
          console.error("Invalid URL received from Stripe:", data);
          addNotification({
            type: "error",
            title: "Checkout Error",
            message: "Invalid checkout URL received from Stripe",
          });
          return;
        }

        // Validate URL format
        try {
          new URL(data.url);
        } catch (urlError) {
          console.error("Invalid URL format:", data.url, urlError);
          addNotification({
            type: "error",
            title: "Checkout Error",
            message: "Invalid checkout URL format",
          });
          return;
        }

        // Redirect to Stripe checkout
        console.log("Redirecting to Stripe checkout:", data.url);
        window.location.href = data.url;
      } else {
        const errorData = await response.json();
        console.error("Failed to create checkout session:", errorData.error);

        // Show error notification
        addNotification({
          type: "error",
          title: "Checkout Error",
          message: errorData.error || "Failed to create checkout session",
        });
      }
    } catch (error) {
      console.error("Error during checkout:", error);
    } finally {
      setIsCheckingOut(false);
    }
  };

  if (!state.isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 overflow-hidden">
      {/* Backdrop */}
      <div
        className="absolute inset-0 bg-none bg-opacity-50 transition-opacity"
        onClick={() => setIsBasketOpen(false)}
      />

      {/* Basket Panel */}
      <div className="absolute right-0 top-0 h-full w-full max-w-md bg-white shadow-xl transform transition-transform duration-300 ease-in-out">
        <div className="flex h-full flex-col">
          {/* Header */}
          <div className="relative bg-[#edf1e6] p-6 border-b border-[#d1d9c0]">
            {/* Decorative background */}
            <div className="absolute inset-0 bg-[linear-gradient(45deg,transparent_25%,rgba(45,74,62,0.03)_25%,rgba(45,74,62,0.03)_75%,transparent_75%)] bg-[size:20px_20px] opacity-60" />

            <div className="relative flex items-center justify-between">
              <div className="flex items-center space-x-3">
                <div className="w-10 h-10 bg-[#2d4a3e] rounded-full flex items-center justify-center shadow-lg">
                  <FaShoppingCart className="w-5 h-5 text-white" />
                </div>
                <div>
                  <h2 className="text-xl font-bold text-[#2d4a3e]">
                    Shopping Basket
                  </h2>
                  <p className="text-sm text-[#2d4a3e] font-medium">
                    {state.itemCount} item{state.itemCount !== 1 ? "s" : ""}
                  </p>
                </div>
              </div>

              <button
                onClick={() => setIsBasketOpen(false)}
                className="w-8 h-8 bg-white/80 hover:bg-white text-gray-500 hover:text-gray-700 rounded-full flex items-center justify-center shadow-sm transition-all duration-200 hover:scale-110 border border-gray-100"
                aria-label="Close basket"
              >
                <svg
                  className="h-5 w-5"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M6 18L18 6M6 6l12 12"
                  />
                </svg>
              </button>
            </div>
          </div>

          {/* Basket Items */}
          <div className="flex-1 overflow-y-auto p-6">
            {state.items.length === 0 ? (
              <div className="text-center py-12">
                {/* Enhanced empty state */}
                <div className="relative mb-6">
                  <div className="absolute inset-0 bg-[#d1d9c0] rounded-full w-24 h-24 mx-auto opacity-60 blur-xl" />
                  <FaShoppingCart className="relative mx-auto h-16 w-16 text-[#2d4a3e] mb-4" />
                </div>
                <h3 className="text-lg font-medium text-[#2d4a3e] mb-2">
                  Your basket is empty
                </h3>
                <p className="text-[#4a6b5a] mb-4">
                  Start your wellness journey today!
                </p>
                <div className="flex justify-center space-x-2">
                  <div className="w-2 h-2 bg-[#d1d9c0] rounded-full animate-pulse" />
                  <div
                    className="w-2 h-2 bg-[#b8c4a8] rounded-full animate-pulse"
                    style={{ animationDelay: "0.2s" }}
                  />
                  <div
                    className="w-2 h-2 bg-[#9fb08c] rounded-full animate-pulse"
                    style={{ animationDelay: "0.4s" }}
                  />
                </div>
              </div>
            ) : (
              <div className="space-y-4">
                {state.items.map((item, index) => (
                  <motion.div
                    key={item.id}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: index * 0.1 }}
                    className="group relative bg-white border border-[#d1d9c0] rounded-xl p-4 shadow-sm hover:shadow-md transition-all duration-300 hover:border-[#b8c4a8]"
                  >
                    {/* Decorative background elements */}
                    <div className="absolute inset-0 bg-[#edf1e6]/20 rounded-xl opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                    <h3 className="font-semibold pb-4 text-[#2d4a3e] text-lg mb-1 truncate group-hover:text-[#1a2f26] transition-colors">
                      {item.name}
                    </h3>
                    <div className="relative flex items-center space-x-8">
                      {/* Enhanced product image */}
                      <div className="relative">
                        <div className="absolute inset-0 bg-[#d1d9c0] rounded-lg opacity-20 blur-sm" />
                        <img
                          src={item.image}
                          alt={item.name}
                          className="relative w-20 h-20 object-cover rounded-lg shadow-md border-2 border-white"
                        />
                        {/* Quantity badge overlay */}
                        <div className="absolute -top-2 -right-2 bg-[#2d4a3e] text-white text-xs font-bold rounded-full w-6 h-6 flex items-center justify-center shadow-lg">
                          {item.quantity}
                        </div>
                      </div>

                      {/* Enhanced quantity controls */}
                      <div className="flex items-center space-x-2 bg-white rounded-lg p-1 shadow-sm border border-gray-100">
                        <button
                          onClick={() =>
                            updateQuantity(item.id, item.quantity - 1)
                          }
                          className="w-8 h-8 flex items-center justify-center text-[#6b8a7a] hover:text-[#2d4a3e] hover:bg-[#edf1e6] rounded-md transition-all duration-200 hover:scale-105"
                          aria-label="Decrease quantity"
                        >
                          <FaMinus className="h-3 w-3" />
                        </button>
                        <span className="w-8 text-center text-sm font-bold text-[#2d4a3e]">
                          {item.quantity}
                        </span>
                        <button
                          onClick={() =>
                            updateQuantity(item.id, item.quantity + 1)
                          }
                          className="w-8 h-8 flex items-center justify-center text-[#6b8a7a] hover:text-[#2d4a3e] hover:bg-[#edf1e6] rounded-md transition-all duration-200 hover:scale-105"
                          aria-label="Increase quantity"
                        >
                          <FaPlus className="h-3 w-3" />
                        </button>
                        {/* Enhanced remove button */}
                        <button
                          onClick={() => removeItem(item.id)}
                          className="p-2 text-gray-400 hover:text-red-500 hover:bg-red-50 rounded-lg transition-all duration-200 hover:scale-110 group/remove"
                          aria-label="Remove item"
                        >
                          <FaTrash className="h-4 w-4 group-hover/remove:rotate-12 transition-transform duration-200" />
                        </button>
                      </div>
                    </div>

                    {/* Subtle connection line to next item */}
                    {index < state.items.length - 1 && (
                      <div className="absolute bottom-0 left-1/2 transform -translate-x-1/2 w-px h-4 bg-gradient-to-b from-emerald-200 to-transparent" />
                    )}
                  </motion.div>
                ))}
              </div>
            )}
          </div>

          {/* Footer */}
          {state.items.length > 0 && (
            <div className="relative bg-[#edf1e6] border-t border-[#d1d9c0] p-6">
              {/* Decorative background */}
              <div className="absolute inset-0 bg-[linear-gradient(45deg,transparent_25%,rgba(45,74,62,0.02)_25%,rgba(45,74,62,0.02)_75%,transparent_75%)] bg-[size:15px_15px] opacity-40" />

              <div className="relative">
                {/* Total section with enhanced styling */}
                <div className="bg-white/80 backdrop-blur-sm rounded-xl p-4 mb-4 border border-[#d1d9c0] shadow-sm">
                  <div className="flex justify-between items-center mb-2">
                    <span className="text-lg font-medium text-[#2d4a3e]">
                      Subtotal:
                    </span>
                    <span className="text-lg font-medium text-[#2d4a3e]">
                      ${state.total.toFixed(2)}
                    </span>
                  </div>
                  <div className="flex justify-between items-center mb-2">
                    <span className="text-sm text-[#4a6b5a]">Shipping:</span>
                    <span className="text-sm text-[#2d4a3e] font-medium">
                      {state.total >= 50 ? "FREE" : "$5.99"}
                    </span>
                  </div>
                  <div className="border-t border-[#d1d9c0] pt-2">
                    <div className="flex justify-between items-center">
                      <span className="text-xl font-bold text-[#2d4a3e]">
                        Total:
                      </span>
                      <span className="text-2xl font-bold text-[#2d4a3e]">
                        $
                        {(state.total >= 50
                          ? state.total
                          : state.total + 5.99
                        ).toFixed(2)}
                      </span>
                    </div>
                    {state.total < 50 && (
                      <p className="text-xs text-[#2d4a3e] text-center mt-1">
                        Add ${(50 - state.total).toFixed(2)} more for free
                        shipping!
                      </p>
                    )}
                  </div>
                </div>

                {/* Enhanced checkout button */}
                <button
                  onClick={handleCheckout}
                  disabled={isCheckingOut}
                  className="w-full bg-[#2d4a3e] text-white py-4 px-6 rounded-xl font-semibold text-lg shadow-lg hover:shadow-xl disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-300 hover:scale-[1.02] active:scale-[0.98] relative overflow-hidden group"
                >
                  {/* Button background animation */}
                  <div className="absolute inset-0 bg-[#1a2f26] opacity-0 group-hover:opacity-100 transition-opacity duration-300" />

                  {/* Button content */}
                  <div className="relative flex items-center justify-center space-x-2">
                    {isCheckingOut ? (
                      <>
                        <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                        <span>Processing...</span>
                      </>
                    ) : (
                      <>
                        <svg
                          className="w-5 h-5"
                          fill="none"
                          viewBox="0 0 24 24"
                          stroke="currentColor"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M3 10h18M7 15h1m4 0h1m-7 4h12a3 3 0 003-3V8a3 3 0 00-3-3H6a3 3 0 00-3 3v8a3 3 0 003 3z"
                          />
                        </svg>
                        <span>Proceed to Checkout</span>
                      </>
                    )}
                  </div>
                </button>

                {/* Security badges */}
                <div className="flex items-center justify-center space-x-4 mt-4 text-xs text-[#4a6b5a]">
                  <div className="flex items-center space-x-1">
                    <svg
                      className="w-4 h-4 text-[#2d4a3e]"
                      fill="currentColor"
                      viewBox="0 0 20 20"
                    >
                      <path
                        fillRule="evenodd"
                        d="M5 9V7a5 5 0 0110 0v2a2 2 0 012 2v5a2 2 0 01-2 2H5a2 2 0 01-2-2v-5a2 2 0 012-2zm8-2v2H7V7a3 3 0 016 0z"
                        clipRule="evenodd"
                      />
                    </svg>
                    <span>Secure Checkout</span>
                  </div>
                  <div className="flex items-center space-x-1">
                    <svg
                      className="w-4 h-4 text-[#2d4a3e]"
                      fill="currentColor"
                      viewBox="0 0 20 20"
                    >
                      <path
                        fillRule="evenodd"
                        d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
                        clipRule="evenodd"
                      />
                    </svg>
                    <span>SSL Encrypted</span>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
