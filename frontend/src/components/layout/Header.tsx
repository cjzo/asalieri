import { Link, useLocation } from 'react-router-dom'
import { ThemeSwitcher } from '../ui/theme-switcher'

export function Header() {
    const location = useLocation()

    return (
        <header className="w-full flex justify-between items-center mb-16 h-12">
            <Link
                to="/"
                className="text-xl font-semibold tracking-tighter text-primary cursor-pointer hover:text-accent transition-colors"
            >
                asalieri
            </Link>
            <div className="flex items-center gap-6">
                <Link
                    to="/tools"
                    className={`text-sm font-medium transition-colors hover:text-primary ${location.pathname.startsWith('/tools') ? 'text-primary' : 'text-secondary'}`}
                >
                    Tools
                </Link>
                <ThemeSwitcher />
            </div>
        </header>
    )
}
