import { motion } from "framer-motion"
import { Monitor, Moon, Sun } from "lucide-react"
import { useTheme } from "./theme-provider"
import { cn } from "../lib/utils"

export function ThemeSwitcher() {
    const { theme, setTheme } = useTheme()

    const tabs = [
        { id: 'system', icon: Monitor, label: 'System theme' },
        { id: 'light', icon: Sun, label: 'Light theme' },
        { id: 'dark', icon: Moon, label: 'Dark theme' },
    ] as const;

    return (
        <div
            className="flex items-center gap-1 p-1 rounded-full bg-surface border border-border/40 shadow-sm backdrop-blur-md"
            role="radiogroup"
            aria-label="Select a display theme"
        >
            {tabs.map((tab) => {
                const Icon = tab.icon;
                const isActive = theme === tab.id;

                return (
                    <button
                        key={tab.id}
                        type="button"
                        onClick={() => setTheme(tab.id)}
                        className={cn(
                            "relative flex items-center justify-center w-8 h-8 rounded-full transition-colors duration-200 z-10",
                            isActive ? "text-primary" : "text-tertiary hover:text-secondary"
                        )}
                        aria-label={tab.label}
                        title={tab.label}
                        aria-checked={isActive}
                        role="radio"
                    >
                        {isActive && (
                            <motion.div
                                layoutId="theme-switcher-active"
                                className="absolute inset-0 bg-secondary/15 dark:bg-accent/20 rounded-full z-[-1]"
                                transition={{ type: "spring", stiffness: 300, damping: 30 }}
                            />
                        )}
                        <Icon className="w-4 h-4" />
                    </button>
                )
            })}
        </div>
    )
}
