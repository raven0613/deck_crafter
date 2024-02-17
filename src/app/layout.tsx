import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import Providers from "./components/Providers";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Deck Crafter",
  description: "Generated by create next app",
};

export default function RootLayout({ children }: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={inter.className}>
        <Providers>
          {children}
        </Providers>
      </body>
    </html>
  );
}


// export default function RootLayout({ children, pageProps: { session, ...pageProps } }: Readonly<{
//   children: React.ReactNode;
//   pageProps: { session: Session }
// }>) {
//   return (
//     <SessionProvider session={session}>
//       <html lang="en">
//         <body className={inter.className}>{children}</body>
//       </html>
//     </SessionProvider>
//   );
// }
