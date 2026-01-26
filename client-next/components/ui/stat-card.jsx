import { cn } from "@/lib/utils";
import { MoreVertical, TrendingUp, TrendingDown } from "lucide-react";

const colorVariants = {
  black: "bg-black border-gray-800",
  pink: "bg-pink-500 border-pink-600",
  blue: "bg-blue-500 border-blue-600",
  green: "bg-teal-500 border-teal-600",
};

export const StatCard = ({ 
  title, 
  value, 
  color = "black", 
  change = 0, 
  comparison = "Vs last month: N/A",
  className 
}) => {
  const colorClass = colorVariants[color] || colorVariants.black;
  const isPositive = change >= 0;
  
  return (
    <div
      className={cn(
        "flex flex-col p-6 rounded-2xl border text-white shadow-sm hover:shadow-md transition-shadow",
        colorClass,
        className
      )}
    >
      {/* Header with title and menu */}
      <div className="flex justify-between items-start mb-4">
        <h3 className="text-lg font-semibold">{title}</h3>
        <button className="text-white/70 hover:text-white transition-colors">
          <MoreVertical size={20} />
        </button>
      </div>

      {/* Main value and change */}
      <div className="flex items-end gap-3 mb-3">
        <p className="text-4xl font-bold">{value}</p>
        {change !== undefined && change !== 0 && (
          <div className={cn(
            "flex items-center gap-1 px-3 py-1 rounded-lg text-sm font-semibold",
            isPositive ? "bg-white/20" : "bg-white/20"
          )}>
            {isPositive ? (
              <TrendingUp size={16} />
            ) : (
              <TrendingDown size={16} />
            )}
            {Math.abs(change)}%
          </div>
        )}
      </div>

      {/* Comparison text */}
      <p className="text-sm text-white/70">{comparison}</p>
    </div>
  );
};
