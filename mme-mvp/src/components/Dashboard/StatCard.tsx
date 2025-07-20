import type { FC } from "react";

interface StatCardProps {
  title: string;
  value: string;
}

export const StatCard: FC<StatCardProps> = ({ title, value }) => {
  return (
    <div className="bg-transparent border border-slate-800 p-4 rounded-2xl shadow-sm ">
      <h3 className="text-white text-sm">{title}</h3>
      <p className="text-xl font-medium text-gray-500">{value}</p>
    </div>
  );
};
