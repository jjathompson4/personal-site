'use client'

import { useTheme } from 'next-themes'
import { useEffect, useState } from 'react'

// Helper component for the prism effect
// Helper component for the prism effect
// Helper component for the prism effect removed

export function SolarGradient({ children }: { children: React.ReactNode }) {
    const { theme, systemTheme } = useTheme()
    const [mounted, setMounted] = useState(false)

    const [mousePos, setMousePos] = useState({ x: 0, y: 0 });
    const [scrollOffset, setScrollOffset] = useState(0)

    useEffect(() => {
        setMounted(true)

        const handleScroll = () => {
            const scrollY = window.scrollY
            const maxScroll = document.documentElement.scrollHeight - window.innerHeight
            const scrollPercent = maxScroll > 0 ? scrollY / maxScroll : 0
            setScrollOffset(scrollPercent)
        }

        const handleMouseMove = (e: MouseEvent) => {
            const x = (e.clientX / window.innerWidth) * 2 - 1
            const y = (e.clientY / window.innerHeight) * 2 - 1
            setMousePos({ x, y })
        }

        window.addEventListener('scroll', handleScroll, { passive: true })
        window.addEventListener('mousemove', handleMouseMove, { passive: true })

        return () => {
            window.removeEventListener('scroll', handleScroll)
            window.removeEventListener('mousemove', handleMouseMove)
        }
    }, [])

    if (!mounted) {
        return <>{children}</>
    }

    const horizonShift = scrollOffset * 8

    return (
        <div className="flex-1 flex flex-col relative h-full w-full isolate">
            <div className="fixed inset-0 z-0 w-full h-full pointer-events-none">
                {/* Layer 0: Base Solar Gradient (Always visible, provides the atmospheric tint) */}
                <div
                    className="absolute inset-0 solar-gradient-bg transition-opacity duration-1000"
                    style={{
                        '--solar-pos-2': `${50 - horizonShift / 2}%`,
                        '--solar-pos-3': `${95 - horizonShift}%`,
                    } as React.CSSProperties}
                />

                {/* Layer 1: Vibrant Mesh (Visible only at edges via Mask) */}
                <div
                    className="absolute inset-0 overflow-hidden"
                    style={{
                        maskImage: 'radial-gradient(circle at center, transparent 10%, black 100%)',
                        WebkitMaskImage: 'radial-gradient(circle at center, transparent 10%, black 100%)'
                    }}
                >
                    {/* Top Left - Teal/Purple Swirl */}
                    <div
                        className="absolute top-[-20%] left-[-20%] w-[100vw] h-[100vw] rounded-full blur-[100px] ease-out will-change-transform"
                        style={{
                            opacity: 'var(--orb-opacity)',
                            background: 'radial-gradient(circle at center, var(--orb-1) 0%, var(--orb-3) 60%, transparent 70%)',
                            transform: `translate(${mousePos.x * -400}px, ${mousePos.y * -400}px)`
                        }}
                    />

                    {/* Bottom Right - Blue/Teal Swirl */}
                    <div
                        className="absolute bottom-[-20%] right-[-20%] w-[100vw] h-[100vw] rounded-full blur-[100px] ease-out will-change-transform"
                        style={{
                            opacity: 'var(--orb-opacity)',
                            background: 'radial-gradient(circle at center, var(--orb-2) 0%, var(--orb-1) 60%, transparent 70%)',
                            transform: `translate(${mousePos.x * 400}px, ${mousePos.y * 400}px)`
                        }}
                    />

                    {/* Top Right - Warm Gold Primary (Promoted to Corner) */}
                    <div
                        className="absolute top-[-30%] right-[-10%] w-[90vw] h-[90vw] rounded-full blur-[100px] ease-out will-change-transform"
                        style={{
                            opacity: 'var(--orb-opacity)',
                            background: 'radial-gradient(circle at center, var(--orb-4) 0%, var(--orb-3) 70%, transparent 70%)',
                            transform: `translate(${mousePos.x * 200}px, ${mousePos.y * -200}px)`
                        }}
                    />

                    {/* Bottom Left - Teal/Blue Anchor */}
                    <div
                        className="absolute bottom-[-10%] left-[-10%] w-[80vw] h-[80vw] rounded-full blur-[120px] ease-out will-change-transform"
                        style={{
                            opacity: 'calc(var(--orb-opacity) * 0.6)',
                            background: 'radial-gradient(circle at center, var(--orb-1) 0%, var(--orb-2) 60%, transparent 70%)',
                            transform: `translate(${mousePos.x * -200}px, ${mousePos.y * 200}px)`
                        }}
                    />

                    {/* Top Center - Purple Accent (Moved to center) */}
                    <div
                        className="absolute top-[-35%] left-[30%] w-[60vw] h-[60vw] rounded-full blur-[120px] ease-out will-change-transform"
                        style={{
                            opacity: 'calc(var(--orb-opacity) * 0.5)',
                            background: 'radial-gradient(circle at center, var(--orb-3) 0%, transparent 60%)',
                            transform: `translate(${mousePos.x * 50}px, ${mousePos.y * 350}px)`
                        }}
                    />
                </div>

                {/* Noise Overlay */}
                <div className="absolute inset-0 bg-noise opacity-[0.07]" />
            </div>

            {/* Content Container */}
            <div className="flex-1 flex flex-col relative z-10">
                {children}
            </div>
        </div>
    )
}
