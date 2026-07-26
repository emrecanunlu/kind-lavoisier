import type { Metadata } from "next";
import { Playfair_Display, Dancing_Script, Plus_Jakarta_Sans } from "next/font/google";
import "./globals.css";

const playfair = Playfair_Display({
  subsets: ["latin", "latin-ext"],
  variable: "--font-playfair",
});

const dancing = Dancing_Script({
  subsets: ["latin", "latin-ext"],
  variable: "--font-dancing",
});

const jakarta = Plus_Jakarta_Sans({
  subsets: ["latin", "latin-ext"],
  variable: "--font-jakarta",
});

export const metadata: Metadata = {
  title: "Aşkımızın Sayfası ❤️ | Uzak Mesafeler, Yakın Kalpler",
  description: "Uzak mesafe ilişkimiz için özel olarak tasarlanmış romantik web uygulaması. Geri sayım, anılarımız, mühürlü zarf ve aşk kuponları.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="tr"
      className={`${playfair.variable} ${dancing.variable} ${jakarta.variable} scroll-smooth h-full antialiased`}
    >
      <body className="min-h-full bg-slate-950 text-slate-100 font-sans">{children}</body>
    </html>
  );
}
