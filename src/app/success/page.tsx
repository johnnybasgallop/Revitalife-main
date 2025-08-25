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

        <h1 className="text-3xl font-bold text-gray-900 mb-4">
          Payment Successful!
        </h1>

        <p className="text-gray-600 mb-6">
          Thank you for your purchase. Your order has been confirmed and you
          will receive a confirmation email shortly.
        </p>

        {loading ? (
          <div className="text-center py-4">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-emerald-500 mx-auto mb-2"></div>
            <p className="text-sm text-gray-500">Loading order details...</p>
          </div>
        ) : orderDetails ? (
          <div className="space-y-4 mb-6">
            {/* Order Summary */}
            <div className="bg-emerald-50 rounded-lg p-4 border border-emerald-200">
              <h3 className="font-semibold text-emerald-800 mb-2 flex items-center">
                <FaCheckCircle className="w-4 h-4 mr-2" />
                Order Confirmed
              </h3>
              <div className="text-sm text-emerald-700">
                <p>
                  Order ID: <span className="font-mono">{orderDetails.id}</span>
                </p>
                <p>
                  Total: ${(orderDetails.amount_total / 100).toFixed(2)}{" "}
                  {orderDetails.currency?.toUpperCase()}
                </p>
                <p>
                  Status:{" "}
                  <span className="capitalize">
                    {orderDetails.payment_status}
                  </span>
                </p>
              </div>
            </div>

            {/* Shipping Information */}
            {orderDetails.shipping && (
              <div className="bg-blue-50 rounded-lg p-4 border border-blue-200">
                <h3 className="font-semibold text-blue-800 mb-2 flex items-center">
                  <FaShippingFast className="w-4 h-4 mr-2" />
                  Shipping Address
                </h3>
                <div className="text-sm text-blue-700">
                  <p className="font-medium">{orderDetails.shipping.name}</p>
                  <p>{orderDetails.shipping.address?.line1}</p>
                  {orderDetails.shipping.address?.line2 && (
                    <p>{orderDetails.shipping.address.line2}</p>
                  )}
                  <p>
                    {orderDetails.shipping.address?.city},{" "}
                    {orderDetails.shipping.address?.state}{" "}
                    {orderDetails.shipping.address?.postal_code}
                  </p>
                  <p>{orderDetails.shipping.address?.country}</p>
                </div>
              </div>
            )}

            {/* Customer Email */}
            {orderDetails.customer_email && (
              <div className="bg-purple-50 rounded-lg p-4 border border-purple-200">
                <h3 className="font-semibold text-purple-800 mb-2 flex items-center">
                  <FaEnvelope className="w-4 h-4 mr-2" />
                  Confirmation Email
                </h3>
                <p className="text-sm text-purple-700">
                  Sent to:{" "}
                  <span className="font-medium">
                    {orderDetails.customer_email}
                  </span>
                </p>
              </div>
            )}
          </div>
        ) : null}

        {sessionId && (
          <div className="bg-gray-50 rounded-lg p-4 mb-6">
            <p className="text-sm text-gray-500">Order ID:</p>
            <p className="font-mono text-sm text-gray-700">{sessionId}</p>
          </div>
        )}

        <button
          onClick={() => router.push("/")}
          className="w-full bg-blue-600 text-white py-3 px-6 rounded-lg font-medium hover:bg-blue-700 transition-colors"
        >
          Return to Home
        </button>
      </div>
    </div>
  );
}
