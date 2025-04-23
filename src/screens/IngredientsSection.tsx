"use client";

import { IngredientCard } from "../components/IngredientCard";
import { ingredients } from "../data/siteData";

export function IngredientsSection() {
  return (
    <section id="ingredients" className="py-20 bg-gray-50">
      <div className="container mx-auto px-4">
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
            Powered by Nature's Best Ingredients
          </h2>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            Every scoop of Revitalife contains 22 carefully selected superfoods to support your daily wellness goals.
          </p>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
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
