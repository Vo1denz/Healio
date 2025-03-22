import type { Metadata } from "next";
import { ThemeProvider } from "next-themes";
import { League_Spartan } from "next/font/google";
import "./globals.css";
import ReactLenis from "lenis/react";

const leagueSpartan = League_Spartan({
  subsets: ["latin"],
});


export const metadata: Metadata = {
  title: "Healio",
  description: "The Mental Health App you Look For...",
};

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
      <html lang="en" suppressHydrationWarning>
        <ReactLenis root>
          <body className={`${leagueSpartan.className} antialiased bg-background`}>
            <ThemeProvider
              attribute="class"
              defaultTheme="system"
              enableSystem
              disableTransitionOnChange
            >
                <div className="min-h-screen">
                  <main className="min-h-screen">{children}</main>
                </div>
              
            </ThemeProvider>
          </body>
        </ReactLenis>
      </html>
  );
}
