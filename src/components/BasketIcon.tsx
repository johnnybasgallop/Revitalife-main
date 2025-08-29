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
      className={`relative p-1.5 md:p-2 text-gray-700 hover:text-blue-600 transition-colors ${className}`}
      aria-label="Open shopping basket"
    >
      <FaShoppingCart className="h-5 w-5 md:h-6 md:w-6" />
      {state.itemCount > 0 && (
        <span className="absolute -top-0.5 -right-0.5 md:-top-1 md:-right-1 bg-red-500 text-white text-xs rounded-full h-4 w-4 md:h-5 md:w-5 flex items-center justify-center font-medium">
          {state.itemCount > 99 ? "99+" : state.itemCount}
        </span>
      )}
    </button>
  );
}
