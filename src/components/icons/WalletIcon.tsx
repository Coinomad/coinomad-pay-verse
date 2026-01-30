import React from "react";

interface WalletIconProps {
  color?: string;
  backgroundColor?: string;
  size?: number | string;
  className?: string;
}

const WalletIcon: React.FC<WalletIconProps> = ({
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
        height: (Number(size) * 16) / 19, // keep 19:16 aspect ratio
      }}
    >
      <svg
        width={size}
        height={(Number(size) * 16) / 19}
        viewBox="0 0 19 16"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
      >
        <path
          d="M2.5 11.25C2.5 10.7898 2.8731 10.4167 3.33333 10.4167H10C10.4602 10.4167 10.8333 10.7898 10.8333 11.25C10.8333 11.7102 10.4602 12.0833 10 12.0833H3.33333C2.8731 12.0833 2.5 11.7102 2.5 11.25Z"
          fill={color}
        />
        <path
          d="M12.5 10.4167C12.0398 10.4167 11.6667 10.7898 11.6667 11.25C11.6667 11.7102 12.0398 12.0833 12.5 12.0833H14.1667C14.6269 12.0833 15 11.7102 15 11.25C15 10.7898 14.6269 10.4167 14.1667 10.4167H12.5Z"
          fill={color}
        />
        <path
          fillRule="evenodd"
          clipRule="evenodd"
          d="M0 3.33333C0 1.49238 1.49238 0 3.33333 0H15C16.8409 0 18.3333 1.49238 18.3333 3.33333V12.5C18.3333 14.3409 16.8409 15.8333 15 15.8333H3.33333C1.49238 15.8333 0 14.3409 0 12.5V3.33333ZM3.33333 1.66667C2.41286 1.66667 1.66667 2.41286 1.66667 3.33333V3.75H16.6667V3.33333C16.6667 2.41286 15.9205 1.66667 15 1.66667H3.33333ZM16.6667 5.41667H1.66667V12.5C1.66667 13.4205 2.41286 14.1667 3.33333 14.1667H15C15.9205 14.1667 16.6667 13.4205 16.6667 12.5V5.41667Z"
          fill={color}
        />
      </svg>
    </div>
  );
};

export default WalletIcon;
