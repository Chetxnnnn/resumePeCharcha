import React from "react";

const colorMap = {
    // Semantic states
    success: {
        bg: "bg-emerald-50",
        border: "border-emerald-200",
        title: "text-emerald-700",
        score: "text-emerald-900",
    },
    warning: {
        bg: "bg-amber-50",
        border: "border-amber-200",
        title: "text-amber-700",
        score: "text-amber-900",
    },
    danger: {
        bg: "bg-rose-50",
        border: "border-rose-200",
        title: "text-rose-700",
        score: "text-rose-900",
    },

    // Optional extra colors (if you still want them)
    emerald: {
        bg: "bg-emerald-50",
        border: "border-emerald-200",
        title: "text-emerald-700",
        score: "text-emerald-900",
    },
    sky: {
        bg: "bg-sky-50",
        border: "border-sky-200",
        title: "text-sky-700",
        score: "text-sky-900",
    },
    violet: {
        bg: "bg-violet-50",
        border: "border-violet-200",
        title: "text-violet-700",
        score: "text-violet-900",
    },
};


const PercentageCard = ({ title, score, color = "emerald" }) => {
    const styles = colorMap[color] || colorMap.emerald;

    return (
        <div
            className={`flex w-full flex-col items-center justify-center gap-4 rounded-xl border p-4 shadow-sm
        ${styles.bg} ${styles.border}`}
        >
            <h1 className={`text-sm font-medium text-center ${styles.title}`}>
                {title}
            </h1>

            <h3 className={`text-6xl font-bold ${styles.score}`}>
                {score}
            </h3>
        </div>
    );
};

export default PercentageCard;
