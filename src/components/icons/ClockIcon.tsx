import React from "react";

interface ClockIconProps {
    color?: string;
    backgroundColor?: string;
    size?: number | string;
    className?: string;
}

const ClockIcon: React.FC<ClockIconProps> = ({
    color = "currentColor",
    backgroundColor = "transparent",
    size = 24,
    className,
}) => {
    return (
        <div
            className={`inline-flex items-center justify-center rounded ${className}`}
            style={{
                backgroundColor,
                width: size,
                height: size,
            }}
        >
            <svg width="18" height="17" viewBox="0 0 18 17" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M0.244078 2.30647C-0.0813592 2.63191 -0.0813592 3.15955 0.244078 3.48498C0.569515 3.81042 1.09715 3.81042 1.42259 3.48498L3.48498 1.42259C3.81042 1.09715 3.81042 0.569515 3.48498 0.244078C3.15955 -0.0813592 2.63191 -0.0813592 2.30647 0.244078L0.244078 2.30647Z" fill={color} fillOpacity="0.8" />
                <path d="M8.73942 6.0311C8.73942 5.57087 8.36632 5.19777 7.90609 5.19777C7.44585 5.19777 7.07275 5.57087 7.07275 6.0311V10.1978C7.07275 10.658 7.44585 11.0311 7.90609 11.0311H10.4061C10.8663 11.0311 11.2394 10.658 11.2394 10.1978C11.2394 9.73753 10.8663 9.36444 10.4061 9.36444H8.73942V6.0311Z" fill={color} fillOpacity="0.8" />
                <path fillRule="evenodd" clipRule="evenodd" d="M8.73942 0.197771C4.13705 0.197771 0.406087 3.92873 0.406087 8.5311C0.406087 13.1335 4.13705 16.8644 8.73942 16.8644C13.3418 16.8644 17.0728 13.1335 17.0728 8.5311C17.0728 3.92873 13.3418 0.197771 8.73942 0.197771ZM2.07275 8.5311C2.07275 4.84921 5.05752 1.86444 8.73942 1.86444C12.4213 1.86444 15.4061 4.84921 15.4061 8.5311C15.4061 12.213 12.4213 15.1978 8.73942 15.1978C5.05752 15.1978 2.07275 12.213 2.07275 8.5311Z" fill={color} fillOpacity="0.8" />
                <path d="M13.9835 0.441848C14.3089 0.116412 14.8366 0.116412 15.162 0.441848L17.2244 2.50424C17.5498 2.82968 17.5498 3.35732 17.2244 3.68275C16.899 4.00819 16.3713 4.00819 16.0459 3.68275L13.9835 1.62036C13.6581 1.29492 13.6581 0.767285 13.9835 0.441848Z" fill={color} fillOpacity="0.8" />
            </svg>
        </div>
    );
};

export default ClockIcon;
