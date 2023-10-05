import { Providers } from "./providers";
import { Sora } from "next/font/google";
import "@/app/styles/global.css";

const sora = Sora({ subsets: ["latin"] });

export const metadata = {
  title: "Decentralized Lottery",
  description: "Portfolio project",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body className={sora.className}>
        <Providers>{children}</Providers>
      </body>
    </html>
  );
}
