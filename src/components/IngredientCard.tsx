"use client";

interface IngredientCardProps {
  name: string;
  description: string;
  icon: string;
}

export function IngredientCard({
  name,
  description,
  icon,
}: IngredientCardProps) {
  return (
    <div className="bg-white rounded-2xl p-6 shadow-sm hover:shadow-md transition-shadow duration-300 border border-gray-100">
      {/* <div className="w-12 h-12 bg-emerald-50 rounded-full flex items-center justify-center mb-4">
        <Image
          src={icon}
          alt={name}
          width={24}
          height={24}
          className="text-emerald-600"
        />
      </div> */}
      <h3 className="text-lg font-medium text-gray-900 mb-2">{name}</h3>
      <p className="text-gray-600 text-sm">{description}</p>
    </div>
  );
}
