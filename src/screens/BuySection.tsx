"use client";

import Image from "next/image";
import { useState } from "react";
import { Button } from "../components/Button";
import { QuantitySelector } from "../components/QuantitySelector";

export function BuySection() {
  const [quantity, setQuantity] = useState(1);

  const increaseQuantity = () => {
    setQuantity(prev => Math.min(prev + 1, 10));
  };

  const decreaseQuantity = () => {
    setQuantity(prev => Math.max(prev - 1, 1));
  };

  return (
    <section id="buy" className="pt-10 pb-20 bg-white">
      <div className="w-full container mx-auto px-4">
        <div className="bg-white rounded-3xl shadow-lg overflow-hidden w-full min-h-[70vh] mx-auto">
          <div className="grid md:grid-cols-2 gap-0">
            <div className="bg-emerald-50 p-8 flex items-center justify-center h-[70vh]">
              <div className="relative h-[350px] w-[350px]">
                <Image
                  src="/Product-Single-Light.jpeg"
                  alt="Revitalife Superfood Powder Package"
                  fill
                  className="object-contain"
                />
              </div>
            </div>
            <div className="p-8 md:p-12 flex flex-col justify-center">
              <h2 className="text-3xl font-bold text-gray-900 mb-2">Revitalife Superfood Mix</h2>
              <p className="text-emerald-600 font-medium mb-4">Mango Flavor • 30 Servings</p>
              <div className="flex items-end gap-2 mb-6">
                <span className="text-3xl font-bold text-gray-900">$59.99</span>
                <span className="text-gray-500 line-through">$69.99</span>
                <span className="bg-emerald-100 text-emerald-800 text-sm px-2 py-1 rounded-full ml-2">Save 15%</span>
              </div>
              <p className="text-gray-600 mb-8">
                One-time purchase. Free shipping on orders over $50.
              </p>
              <div className="flex flex-col gap-6">
                <div className="flex items-center gap-4">
                  <span className="text-gray-700">Quantity:</span>
                  <QuantitySelector
                    quantity={quantity}
                    onIncrease={increaseQuantity}
                    onDecrease={decreaseQuantity}
                  />
                </div>
                <Button size="lg">Add to Cart</Button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
