"use client";

import { FaShoppingCart } from "react-icons/fa";
import { useBasket } from "../contexts/BasketContext";

interface BasketIconProps {
  onClick: () => void;
  className?: string;
}

export default function BasketIcon({
  onClick,
  className = "",
}: BasketIconProps) {
  const { state } = useBasket();

  return (
    <button
      onClick={onClick}
      className={`relative p-2 text-gray-700 hover:text-blue-600 transition-colors ${className}`}
      aria-label="Open shopping basket"
    >
      <FaShoppingCart className="h-6 w-6" />
      {state.itemCount > 0 && (
        <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs rounded-full h-5 w-5 flex items-center justify-center font-medium">
          {state.itemCount > 99 ? "99+" : state.itemCount}
        </span>
      )}
    </button>
  );
}
