"use client";

import { useRouter, useSearchParams } from "next/navigation";
import { useEffect } from "react";
import { FaCheckCircle } from "react-icons/fa";
import { useBasket } from "../../contexts/BasketContext";

export default function SuccessPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { clearBasket } = useBasket();
  const sessionId = searchParams.get("session_id");

  useEffect(() => {
    if (sessionId) {
      // Clear the basket after successful payment
      clearBasket();
    }
  }, [sessionId, clearBasket]);

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
