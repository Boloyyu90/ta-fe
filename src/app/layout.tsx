import type { Metadata } from "next";
import { Poppins } from "next/font/google";
import { Providers } from "@/shared/lib/providers";
import { Toaster } from "@/shared/components/ui/sonner";
import "./globals.css";

const poppins = Poppins({
    variable: "--font-poppins",
    subsets: ["latin"],
    weight: ["300", "400", "500", "600", "700"],
    display: "swap", // Prevent FOIT (Flash of Invisible Text)
});

export const metadata: Metadata = {
    title: "Prestige Tryout Platform",
    description: "E-learning exam simulation with AI-powered proctoring",
};

export default function RootLayout({
                                       children,
                                   }: Readonly<{
    children: React.ReactNode;
}>) {
    return (
        <html lang="id">
        <body className={`${poppins.variable} font-sans antialiased`}>
        <Providers>
            {children}
            <Toaster />
        </Providers>
        </body>
        </html>
    );
}