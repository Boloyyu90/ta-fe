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
                        "group toast group-[.toaster]:border-0 group-[.toaster]:shadow-xl group-[.toaster]:rounded-xl",
                    title: "group-[.toast]:font-semibold group-[.toast]:text-base group-[.toast]:text-white",
                    description: "group-[.toast]:text-white/90 group-[.toast]:text-sm",
                    actionButton:
                        "group-[.toast]:bg-white/20 group-[.toast]:text-white group-[.toast]:rounded-lg group-[.toast]:font-medium group-[.toast]:hover:bg-white/30",
                    cancelButton:
                        "group-[.toast]:bg-white/10 group-[.toast]:text-white group-[.toast]:rounded-lg group-[.toast]:hover:bg-white/20",
                    closeButton:
                        "group-[.toast]:bg-white/20 group-[.toast]:border-0 group-[.toast]:text-white group-[.toast]:hover:bg-white/30 group-[.toast]:hover:text-white",
                    // Success toast - green background
                    success:
                        "group-[.toaster]:!bg-green-600 group-[.toaster]:!text-white",
                    // Error toast - red background
                    error:
                        "group-[.toaster]:!bg-red-600 group-[.toaster]:!text-white",
                    // Warning toast - brand secondary (amber/orange)
                    warning:
                        "group-[.toaster]:!bg-amber-500 group-[.toaster]:!text-white",
                    // Info toast - primary color
                    info:
                        "group-[.toaster]:!bg-primary group-[.toaster]:!text-white",
                },
            }}
            {...props}
        />
    )
}

export { Toaster }