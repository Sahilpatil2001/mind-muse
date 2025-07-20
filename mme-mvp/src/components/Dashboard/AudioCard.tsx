import type { FC } from "react";
import type { AudioCardProps } from "../../types/AudioCardProps";

export const AudioCard: FC<AudioCardProps> = ({
  title,
  voice,
  date,
  duration,
}) => {
  return (
    <div className="flex items-center justify-between bg-transparent p-4 rounded-xl shadow-sm border border-slate-800">
      <div>
        <h4 className="font-medium">{title}</h4>
        <p className="text-sm text-gray-500">
          {voice} • {date}
        </p>
      </div>
      <div className="flex items-center gap-4">
        <span className="text-sm text-gray-500">{duration}</span>
        <button className="text-blue-600 hover:text-blue-800">▶️</button>
      </div>
    </div>
  );
};
