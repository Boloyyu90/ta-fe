"use client"

import Image from "next/image"
import { LoaderCircle } from "lucide-react"
import { useTheme } from "next-themes"
import { Toaster as Sonner } from "sonner"

type ToasterProps = React.ComponentProps<typeof Sonner>

// Custom Logo Icon Component
const LogoIcon = () => (
    <div className="relative h-6 w-6 flex-shrink-0">
        <Image
            src="/images/logo/logo-prestige-white.svg"
            alt="Prestige"
            fill
            className="object-contain"
        />
    </div>
)

const Toaster = ({ ...props }: ToasterProps) => {
    const { theme = "system" } = useTheme()

    return (
        <Sonner
            theme={theme as ToasterProps["theme"]}
            className="toaster group"
            position="top-center"
            expand={true}
            closeButton
            duration={4000}
            icons={{
                success: <LogoIcon />,
                info: <LogoIcon />,
                warning: <LogoIcon />,
                error: <LogoIcon />,
                loading: <LoaderCircle className="h-5 w-5 animate-spin text-white" />,
            }}
            toastOptions={{
                classNames: {
                    toast:
                        "group toast group-[.toaster]:border-0 group-[.toaster]:shadow-large group-[.toaster]:rounded-xl",
                    title: "group-[.toast]:font-semibold group-[.toast]:text-base group-[.toast]:text-white",
                    description: "group-[.toast]:text-white/90 group-[.toast]:text-sm",
                    actionButton:
                        "group-[.toast]:bg-white/20 group-[.toast]:text-white group-[.toast]:rounded-lg group-[.toast]:font-medium group-[.toast]:hover:bg-white/30",
                    cancelButton:
                        "group-[.toast]:bg-white/10 group-[.toast]:text-white group-[.toast]:rounded-lg group-[.toast]:hover:bg-white/20",
                    closeButton:
                        "group-[.toast]:bg-white/20 group-[.toast]:border-0 group-[.toast]:text-white group-[.toast]:hover:bg-white/30 group-[.toast]:hover:text-white",
                    // Success toast - uses design system success color
                    success:
                        "group-[.toaster]:!bg-success group-[.toaster]:!text-success-foreground",
                    // Error toast - uses design system destructive color
                    error:
                        "group-[.toaster]:!bg-destructive group-[.toaster]:!text-destructive-foreground",
                    // Warning toast - uses design system warning color
                    warning:
                        "group-[.toaster]:!bg-warning group-[.toaster]:!text-warning-foreground",
                    // Info toast - uses design system info color
                    info:
                        "group-[.toaster]:!bg-info group-[.toaster]:!text-info-foreground",
                },
            }}
            {...props}
        />
    )
}

export { Toaster }