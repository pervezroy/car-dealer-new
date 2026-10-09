import Link from "next/link";
import { Archivo } from "next/font/google";
import { brand } from "@/lib/brand";
import "./globals.css";

const font = Archivo({ subsets: ["latin"] });

export const metadata = {
  title: { default: `${brand.name}: ${brand.tagline}`, template: `%s | ${brand.name}` },
  description: brand.tagline,
};

export default function RootLayout({ children }) {
  return (
    <html lang="en-GB">
      <body className={font.className}>
        <header>
          <div className="wrap nav">
            <Link href="/" className="logo">{brand.name}</Link>
            <Link href="/cars">Buy a car</Link>
            <Link href="/sell-your-car">Sell your car</Link>
            <a href={`tel:${brand.phone.replace(/\s/g, "")}`}>{brand.phone}</a>
          </div>
        </header>
        <main>{children}</main>
        <footer>
          <div className="wrap">
            <p><b>{brand.name}</b> · {brand.email}</p>
            <p>Finance examples are representative only and subject to status. Replace this line with your FCA authorisation and company details.</p>
          </div>
        </footer>
      </body>
    </html>
  );
}
