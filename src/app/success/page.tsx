"use client";
import { useRouter, useSearchParams } from "next/navigation";
import { useEffect, useState } from "react";
import { FaCheckCircle, FaEnvelope, FaShippingFast } from "react-icons/fa";
import { useBasket } from "../../contexts/BasketContext";

export default function SuccessPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { clearBasket } = useBasket();
  const sessionId = searchParams.get("session_id");
  const [orderDetails, setOrderDetails] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (sessionId) {
      // Clear the basket after successful payment
      clearBasket();

      // Fetch order details from Stripe
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
          <h1 className="text-3xl font-bold text-gray-900 mb-2">
            Payment Successful! 🎉
          </h1>
          <p className="text-gray-600">
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
            {/* Order Summary */}
            <div className="bg-gradient-to-r from-emerald-50 to-green-50 rounded-xl p-6 border border-emerald-200 shadow-sm">
              <div className="text-center">
                <FaCheckCircle className="w-16 h-16 text-emerald-600 mx-auto mb-4" />
                <h3 className="font-bold text-emerald-800 text-xl mb-2">
                  Order Confirmed
                </h3>
                <p className="text-emerald-700 text-lg font-semibold">
                  ${(orderDetails.amount_total / 100).toFixed(2)}{" "}
                  {orderDetails.currency?.toUpperCase()}
                </p>
              </div>
            </div>

            {/* Shipping Information */}
            {orderDetails.shipping && (
              <div className="bg-gradient-to-r from-blue-50 to-indigo-50 rounded-xl p-6 border border-blue-200 shadow-sm">
                <h3 className="font-bold text-blue-800 mb-4 flex items-center text-lg">
                  <FaShippingFast className="w-5 h-5 mr-3 text-blue-600" />
                  Shipping Address
                </h3>
                <div className="bg-white/60 rounded-lg p-4">
                  <div className="text-sm text-blue-700 space-y-2">
                    <p className="font-semibold text-blue-800 text-base">
                      {orderDetails.shipping.name}
                    </p>
                    <p className="text-blue-700">
                      {orderDetails.shipping.address?.line1}
                    </p>
                    {orderDetails.shipping.address?.line2 && (
                      <p className="text-blue-700">
                        {orderDetails.shipping.address.line2}
                      </p>
                    )}
                    <p className="text-blue-700">
                      {orderDetails.shipping.address?.city},{" "}
                      {orderDetails.shipping.address?.state}{" "}
                      {orderDetails.shipping.address?.postal_code}
                    </p>
                    <p className="text-blue-700 font-medium">
                      {orderDetails.shipping.address?.country}
                    </p>
                  </div>
                </div>
              </div>
            )}

            {/* Customer Email */}
            {orderDetails.customer_email && (
              <div className="bg-gradient-to-r from-purple-50 to-pink-50 rounded-xl p-6 border border-purple-200 shadow-sm">
                <h3 className="font-bold text-purple-800 mb-4 flex items-center text-lg">
                  <FaEnvelope className="w-5 h-5 mr-3 text-purple-600" />
                  Confirmation Email
                </h3>
                <div className="bg-white/60 rounded-lg p-4">
                  <p className="text-sm text-purple-700">
                    Sent to:{" "}
                    <span className="font-medium text-purple-800">
                      {orderDetails.customer_email}
                    </span>
                  </p>
                </div>
              </div>
            )}
          </div>
        ) : null}

        <button
          onClick={() => router.push("/")}
          className="w-full bg-gradient-to-r from-blue-600 to-blue-700 text-white py-4 px-6 rounded-xl font-semibold hover:from-blue-700 hover:to-blue-800 transition-all duration-200 transform hover:scale-[1.02] shadow-lg hover:shadow-xl"
        >
          Return to Home
        </button>
      </div>
    </div>
  );
}
