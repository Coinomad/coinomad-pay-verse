import React from "react";

interface GenerateIconProps {
  color?: string;
  backgroundColor?: string;
  size?: number | string;
  className?: string;
}

const GenerateIcon: React.FC<GenerateIconProps> = ({
  color = "currentColor",
  backgroundColor = "transparent",
  size = 24,
  className = "",
}) => {
  return (
    <div
      className={`inline-flex items-center justify-center rounded ${className}`}
      style={{
        backgroundColor,
        width: size,
        height: (Number(size) * 12) / 14, // maintain 14:12 aspect ratio
      }}
    >
      <svg
        width={size}
        height={(Number(size) * 12) / 14}
        viewBox="0 0 14 12"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
      >
        <path
          d="M0 0.833333C0 0.373096 0.373096 0 0.833333 0H12.5C12.9602 0 13.3333 0.373096 13.3333 0.833333C13.3333 1.29357 12.9602 1.66667 12.5 1.66667H0.833333C0.373096 1.66667 0 1.29357 0 0.833333Z"
          fill={color}
        />
        <path
          d="M1.66667 5.83333C1.66667 5.3731 2.03976 5 2.5 5H10.8333C11.2936 5 11.6667 5.3731 11.6667 5.83333C11.6667 6.29357 11.2936 6.66667 10.8333 6.66667H2.5C2.03976 6.66667 1.66667 6.29357 1.66667 5.83333Z"
          fill={color}
        />
        <path
          d="M4.16667 10C3.70643 10 3.33333 10.3731 3.33333 10.8333C3.33333 11.2936 3.70643 11.6667 4.16667 11.6667H9.16667C9.6269 11.6667 10 11.2936 10 10.8333C10 10.3731 9.6269 10 9.16667 10H4.16667Z"
          fill={color}
        />
      </svg>
    </div>
  );
};

export default GenerateIcon;
