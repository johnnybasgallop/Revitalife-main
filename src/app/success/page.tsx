"use client";
import { Suspense } from "react";

function SuccessPageContent() {
  const { useRouter, useSearchParams } = require("next/navigation");
  const { useEffect, useState } = require("react");
  const {
    FaCheckCircle,
    FaEnvelope,
    FaShippingFast,
  } = require("react-icons/fa");
  const { useBasket } = require("../../contexts/BasketContext");

  const router = useRouter();
  const searchParams = useSearchParams();
  const { clearBasket } = useBasket();
  const sessionId = searchParams.get("session_id");
  const [orderDetails, setOrderDetails] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (sessionId) {
      clearBasket();
      fetchOrderDetails(sessionId);
    } else {
      setLoading(false);
    }
  }, [sessionId, clearBasket]);

  const fetchOrderDetails = async (sessionId: string) => {
    try {
      const response = await fetch(
        `/api/get-order-details?session_id=${sessionId}`
      );
      if (response.ok) {
        const data = await response.json();
        setOrderDetails(data);
      }
    } catch (error) {
      console.error("Error fetching order details:", error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 to-blue-50 flex items-center justify-center px-4">
      <div className="max-w-md w-full bg-white rounded-2xl shadow-xl p-8 text-center">
        <div className="mb-6">
          <FaCheckCircle className="mx-auto h-16 w-16 text-green-500" />
        </div>

        <div className="text-center mb-6">
          <h1 className="text-3xl font-bold text-[#2d4a3e] mb-2">
            Payment Successful! 🎉
          </h1>
          <p className="text-[#4a6b5a]">
            Thank you for your purchase. Your order has been confirmed and you
            will receive a confirmation email shortly.
          </p>
        </div>

        {loading ? (
          <div className="text-center py-4">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-emerald-500 mx-auto mb-2"></div>
            <p className="text-sm text-gray-500">Loading order details...</p>
          </div>
        ) : orderDetails ? (
          <div className="space-y-4 mb-6">
            <div className="bg-[#edf1e6] rounded-xl p-6 border border-[#d1d9c0] shadow-sm">
              <div className="text-center">
                <FaCheckCircle className="w-16 h-16 text-[#2d4a3e] mx-auto mb-4" />
                <h3 className="font-bold text-[#2d4a3e] text-xl mb-2">
                  Order Confirmed
                </h3>
                <p className="text-[#4a6b5a] text-lg font-semibold">
                  {(orderDetails.amount_total / 100).toFixed(2)}{" "}
                  {orderDetails.currency?.toUpperCase()}
                </p>
              </div>
            </div>

            {orderDetails.shipping && (
              <div className="bg-[#edf1e6] rounded-xl p-6 border border-[#d1d9c0] shadow-sm">
                <h3 className="font-bold text-[#2d4a3e] mb-4 flex items-center text-lg">
                  <FaShippingFast className="w-5 h-5 mr-3 text-[#2d4a3e]" />
                  Shipping Address
                </h3>
                <div className="bg-white/80 rounded-lg p-4">
                  <div className="text-sm text-[#4a6b5a] space-y-2">
                    <p className="font-semibold text-[#2d4a3e] text-base">
                      {orderDetails.shipping.name}
                    </p>
                    <p className="text-[#4a6b5a]">
                      {orderDetails.shipping.address?.line1}
                    </p>
                    {orderDetails.shipping.address?.line2 && (
                      <p className="text-[#4a6b5a]">
                        {orderDetails.shipping.address.line2}
                      </p>
                    )}
                    <p className="text-[#4a6b5a]">
                      {orderDetails.shipping.address?.city},{" "}
                      {orderDetails.shipping.address?.state}{" "}
                      {orderDetails.shipping.address?.postal_code}
                    </p>
                    <p className="text-[#4a6b5a]">
                      {orderDetails.shipping.address?.country}
                    </p>
                  </div>
                </div>
              </div>
            )}

            <div className="bg-[#edf1e6] rounded-xl p-6 border border-[#d1d9c0] shadow-sm">
              <h3 className="font-bold text-[#2d4a3e] mb-4 flex items-center text-lg">
                <FaEnvelope className="w-5 h-5 mr-3 text-[#2d4a3e]" />
                Next Steps
              </h3>
              <div className="text-sm text-[#4a6b5a] space-y-3">
                <p>📧 Check your email for order confirmation</p>
                <p>📦 Your order will be shipped within 1-2 business days</p>
                <p>📱 You'll receive tracking information via email</p>
              </div>
            </div>
          </div>
        ) : (
          <div className="text-center py-4">
            <p className="text-sm text-gray-500">No order details available</p>
          </div>
        )}

        <div className="space-y-3">
          <button
            onClick={() => router.push("/")}
            className="w-full bg-[#2d4a3e] text-white py-3 px-6 rounded-xl font-semibold hover:bg-[#1a2f26] transition-colors duration-200"
          >
            Continue Shopping
          </button>
          <button
            onClick={() => router.push("/account")}
            className="w-full bg-white text-[#2d4a3e] py-3 px-6 rounded-xl font-semibold border-2 border-[#2d4a3e] hover:bg-[#2d4a3e] hover:text-white transition-colors duration-200"
          >
            View Account
          </button>
        </div>
      </div>
    </div>
  );
}

export default function SuccessPage() {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <SuccessPageContent />
    </Suspense>
  );
}
