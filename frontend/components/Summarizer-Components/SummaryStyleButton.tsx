interface SummaryStyleButtonProps {
    style: 'harsh' | 'standard' | 'detailed';
    selected: boolean;
    onClick: () => void;
}

import { Tooltip } from "../Tooltip";

const styleConfig = {
    harsh: {
        label: 'Harsh',
        tooltip: 'Shortest - Get the core message in a few sentences',
        selectedBg: 'bg-red-600 dark:bg-red-400',
        selectedHover: 'hover:bg-red-700 dark:hover:bg-red-500',
        textColor: 'text-white'
    },
    standard: {
        label: 'Standard',
        tooltip: 'Medium - Perfect balance of detail and brevity',
        selectedBg: 'bg-yellow-600 dark:bg-yellow-400',
        selectedHover: 'hover:bg-yellow-700 dark:hover:bg-yellow-500',
        textColor: 'text-white'
    },
    detailed: {
        label: 'Detailed',
        tooltip: 'Comprehensive - Capturing more nuances',
        selectedBg: 'bg-green-600 dark:bg-green-400',
        selectedHover: 'hover:bg-green-700 dark:hover:bg-green-500',
        textColor: 'text-white'
    }
};

export const SummaryStyleButton: React.FC<SummaryStyleButtonProps> = ({
    style,
    selected,
    onClick
}) => {
    const config = styleConfig[style];

    return (
        <Tooltip content={config.tooltip}>
            <button
                onClick={onClick}
                className={`
                w-40 px-6 py-2 rounded-lg font-semibold cursor-pointer
                ${selected
                        ? `${config.selectedBg} ${config.selectedHover} ${config.textColor} shadow-lg`
                        : 'bg-gray-300 dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-400 dark:hover:bg-gray-600'
                    }
            `}
            >
                {config.label}
            </button>
        </Tooltip>
    );
};