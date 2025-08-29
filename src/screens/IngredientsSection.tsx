"use client";

import { useState } from "react";
import { IngredientCard } from "../components/IngredientCard";
import { ingredients } from "../data/siteData";

export function IngredientsSection() {
  const [showAllIngredients, setShowAllIngredients] = useState(false);

  // Show first 5 ingredients on mobile, all on desktop
  const displayedIngredients = showAllIngredients
    ? ingredients
    : ingredients.slice(0, 5);

  return (
    <section
      id="ingredients"
      className=" py-0 pb-20 lg:py-24 min-h-[95vh] bg-white overflow-hidden relative snap-start snap-always"
    >
      <div className="container mx-auto px-4">
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
            Powered by Nature's Best Ingredients
          </h2>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            Every scoop of Revitalife contains 22 carefully selected superfoods
            to support your daily wellness goals.
          </p>
          {/* Mobile ingredient count */}
          <p className="text-sm text-gray-500 mt-2 lg:hidden">
            Showing {displayedIngredients.length} of {ingredients.length}{" "}
            ingredients
          </p>
        </div>

        {/* Mobile: Show first 5 ingredients with expand option */}
        <div className="lg:hidden">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 mb-8 transition-all duration-500 ease-in-out">
            {displayedIngredients.map((ingredient, index) => (
              <div
                key={index}
                className={`transition-all duration-500 ${
                  index >= 5 && showAllIngredients
                    ? "opacity-100 translate-y-0"
                    : index >= 5
                    ? "opacity-0 translate-y-4"
                    : "opacity-100 translate-y-0"
                }`}
              >
                <IngredientCard
                  name={ingredient.name}
                  description={ingredient.description}
                  icon={ingredient.icon}
                />
              </div>
            ))}
          </div>

          {/* Expand/Collapse button for mobile */}
          <div className="text-center">
            <button
              onClick={() => setShowAllIngredients(!showAllIngredients)}
              className="inline-flex items-center space-x-2 bg-amber-500 text-white px-6 py-3 rounded-lg hover:bg-amber-600 transition-all duration-300 font-medium shadow-lg hover:shadow-xl"
            >
              <span>
                {showAllIngredients
                  ? "Show Less"
                  : `Show All ${ingredients.length} Ingredients`}
              </span>
              <svg
                className={`w-5 h-5 transition-transform duration-300 ${
                  showAllIngredients ? "rotate-180" : ""
                }`}
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M19 9l-7 7-7-7"
                />
              </svg>
            </button>
          </div>
        </div>

        {/* Desktop: Show all ingredients */}
        <div className="hidden lg:grid grid-cols-4 gap-6">
          {ingredients.map((ingredient, index) => (
            <IngredientCard
              key={index}
              name={ingredient.name}
              description={ingredient.description}
              icon={ingredient.icon}
            />
          ))}
        </div>
      </div>
    </section>
  );
}
