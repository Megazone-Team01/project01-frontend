import {cn} from "@/lib/utils.js";
import {Button} from "@/components/ui/button.js";


export function TabButtons({ tabs, activeTab, onTabChange, className }) {
    return (
        <div className={cn("flex gap-2 justify-center mb-20 *:cursor-pointer", className)}>
            {tabs.map((tab) => (
                <Button
                    key={tab.id}
                    onClick={() => onTabChange(tab.id)}
                    className={cn(
                        "px-6 py-3 rounded-lg font-semibold transition-colors",
                        activeTab === tab.id
                            ? "bg-primary text-white"
                            : "bg-white text-gray-700 transition-colors hover:opacity-75 border border-gray-300 hover:bg-gray-50"
                    )}
                >
                    {tab.label}
                </Button>
            ))}
        </div>
    );
}