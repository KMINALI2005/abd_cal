import type { Metadata } from "next";
import { Tajawal } from "next/font/google";
import { ThemeProvider } from "@/components/theme-provider";
import { InvoicesProvider } from "@/context/invoices-context";
import { Toaster } from "react-hot-toast";
import "./globals.css";

const tajawal = Tajawal({
  subsets: ["arabic"],
  variable: "--font-tajawal",
  weight: ["400", "700"],
});

export const metadata: Metadata = {
  title: "تطبيق الفواتير",
  description: "إدارة الفواتير للمحال التجارية",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="ar" dir="rtl" suppressHydrationWarning>
      <body className={`${tajawal.variable} font-sans antialiased`}>
        <ThemeProvider
          attribute="class"
          defaultTheme="system"
          enableSystem
          disableTransitionOnChange
        >
          <InvoicesProvider>
            {children}
            <Toaster position="bottom-center" />
          </InvoicesProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}
