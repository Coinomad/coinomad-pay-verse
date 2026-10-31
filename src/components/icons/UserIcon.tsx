import React from "react";

interface IconProps extends React.SVGProps<SVGSVGElement> {
  size?: number;       // width & height
  colorFill?: string;  // primary fill color
  colorStroke?: string; // stroke color
}

const UserIcon: React.FC<IconProps> = ({
  size = 30,
  colorFill = "#F7EE24",
  colorStroke = "#F7EE24",
  ...props
}) => {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 30 30"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      {...props}
    >
      <rect x="0.5" y="0.5" width="29" height="29" rx="14.5" fill="#0D0D0D"/>
      <rect x="0.5" y="0.5" width="29" height="29" rx="14.5" stroke={colorStroke}/>
      <path
        d="M15 14.1667C16.8409 14.1667 18.3333 12.6743 18.3333 10.8333C18.3333 8.99238 16.8409 7.5 15 7.5C13.159 7.5 11.6666 8.99238 11.6666 10.8333C11.6666 12.6743 13.159 14.1667 15 14.1667Z"
        fill={colorFill}
      />
      <path
        d="M9.42134 20C8.04084 22.2251 12.6106 23.3333 15 23.3333C17.3893 23.3333 21.9591 22.2251 20.5786 20C19.5404 18.3267 17.4406 16.6667 15 16.6667C12.5593 16.6667 10.4595 18.3267 9.42134 20Z"
        fill={colorFill}
      />
    </svg>
  );
};

export default UserIcon;
