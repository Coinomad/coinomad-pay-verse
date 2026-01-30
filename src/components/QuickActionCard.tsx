import React, { useState } from "react";

interface ActionButton {
  label: string;
  outline?: boolean;
  icon?: React.FC<{ color?: string; size?: number | string }>; 
}

interface QuickActionCardProps {
  title: string;
  description: string;
  actions: ActionButton[][];
}

export const QuickActionCard: React.FC<QuickActionCardProps> = ({
  title,
  description,
  actions,
}) => {
  const [activeButton, setActiveButton] = useState<{ row: number; index: number } | null>(null);

  const handleButtonClick = (rowIndex: number, buttonIndex: number) => {
    setActiveButton({ row: rowIndex, index: buttonIndex });
  };

  return (
    <div className="w-full max-w-[392px] bg-stone-900 rounded-[10px] px-6 py-5 inline-flex flex-col justify-center items-start gap-3">
      <div className="w-full flex flex-col justify-start items-start gap-4">
        {/* Title & Description */}
        <div className="w-full flex flex-col justify-start items-start gap-1">
          <div className="text-white text-xl font-medium">{title}</div>
          <div className="text-white text-xs font-normal">{description}</div>
        </div>

        {/* Actions */}
        {actions.map((row, rowIndex) => (
          <div
            key={rowIndex}
            className="w-full inline-flex justify-start items-center gap-3 flex-wrap"
          >
            {row.map((action, index) => {
              const isActive =
                activeButton?.row === rowIndex && activeButton?.index === index;

              return (
                <button
                  key={index}
                  onClick={() => handleButtonClick(rowIndex, index)}
                  className={`flex-1 min-w-[120px] p-[5px] rounded-[10px] flex justify-center items-center gap-2 cursor-pointer transition-all duration-200 ${
                    isActive
                      ? "bg-[#F7EE24] text-black"
                      : "bg-stone-800 text-white hover:bg-stone-700"
                  }`}
                >
                  {action.icon && (
                    <action.icon
                      color={isActive ? "black" : "#B3B3B3"} // dynamic icon color
                      size={16}
                    />
                  )}
                  <span className="text-xs font-normal">{action.label}</span>
                </button>
              );
            })}
          </div>
        ))}
      </div>
    </div>
  );
};
