import '../../../../assets/dist/tailwind.css';
import * as React from "react";

interface ProgressBarProps {
    PercentageComplete: number;
}

const ProgressBar: React.FC<ProgressBarProps> = ({ PercentageComplete }) => {
    return (
        <div className="relative w-20 h-20 flex items-center justify-center">
            <svg className="w-full h-full -rotate-90" viewBox="0 0 36 36" xmlns="http://www.w3.org/2000/svg">
                {/* Background Circle */}
                <circle cx="18" cy="18" r="16" fill="none" className="stroke-current text-gray-200" strokeWidth="4"/>
                {/* Foreground Circle */}
                <circle
                    cx="18"
                    cy="18"
                    r="16"
                    fill="none"
                    className="stroke-current text-[3E2639]"
                    strokeWidth="4"
                    strokeDasharray="100"
                    strokeDashoffset={100 - PercentageComplete}
                    strokeLinecap="round"
                />
            </svg>
            {/* Progress Percentage Text */}
            <div className="absolute inset-0 flex items-center justify-center text-xl font-extrabold font-Poppins text-stone-700">
                {PercentageComplete}%
            </div>
        </div>
    );
};

export default ProgressBar;