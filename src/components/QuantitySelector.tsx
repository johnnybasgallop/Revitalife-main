"use client";


interface QuantitySelectorProps {
  quantity: number;
  onIncrease: () => void;
  onDecrease: () => void;
  minQuantity?: number;
  maxQuantity?: number;
}

export function QuantitySelector({
  quantity,
  onIncrease,
  onDecrease,
  minQuantity = 1,
  maxQuantity = 10,
}: QuantitySelectorProps) {
  return (
    <div className="flex items-center border border-gray-200 rounded-full inline-flex">
      <button
        onClick={onDecrease}
        disabled={quantity <= minQuantity}
        className="w-10 h-10 flex items-center justify-center text-gray-500 hover:text-emerald-600 disabled:text-gray-300 disabled:cursor-not-allowed"
        aria-label="Decrease quantity"
      >
        <svg
          xmlns="http://www.w3.org/2000/svg"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
          className="w-4 h-4"
        >
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 12H4" />
        </svg>
      </button>

      <span className="w-12 text-center text-gray-900">{quantity}</span>

      <button
        onClick={onIncrease}
        disabled={quantity >= maxQuantity}
        className="w-10 h-10 flex items-center justify-center text-gray-500 hover:text-emerald-600 disabled:text-gray-300 disabled:cursor-not-allowed"
        aria-label="Increase quantity"
      >
        <svg
          xmlns="http://www.w3.org/2000/svg"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
          className="w-4 h-4"
        >
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
        </svg>
      </button>
    </div>
  );
}
