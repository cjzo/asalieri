import { Outlet } from 'react-router-dom'
import { Header } from './Header'
import { useRef, useEffect } from 'react'

export function Layout() {
    const glowRef = useRef<HTMLDivElement>(null)

    useEffect(() => {
        const handleMove = (e: MouseEvent) => {
            if (glowRef.current) {
                glowRef.current.style.setProperty('--mouse-x', `${e.clientX}px`)
                glowRef.current.style.setProperty('--mouse-y', `${e.clientY}px`)
            }
        }
        window.addEventListener('mousemove', handleMove)
        return () => window.removeEventListener('mousemove', handleMove)
    }, [])

    return (
        <div className="min-h-screen relative overflow-x-hidden text-foreground selection:bg-accent/30 selection:text-white flex flex-col items-center">
            {/* Global Dynamic Background */}
            <div
                ref={glowRef}
                className="app-grid-glow fixed inset-0 pointer-events-none z-[-1]"
            />
            {/* Default Global Gradient */}
            <div
                className="fixed inset-0 pointer-events-none z-[-4]"
                style={{ background: 'radial-gradient(circle at 50% 50%, var(--surface) 0%, var(--bg) 100%)' }}
            />

            <div className="w-full max-w-5xl mx-auto px-6 py-12 flex flex-col items-center flex-grow transition-all duration-500 z-10">
                <Header />
                <Outlet />
            </div>
        </div>
    )
}
