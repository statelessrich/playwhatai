import "./globals.scss";
import Header from "components/Header";
import Footer from "components/Footer";

export const metadata = {
  title: "playwhat",
  description: "AI-powered video game recommendations",
  keywords: "video games, AI, gaming",
  image: "https://playwhatai.vercel.app/social.png",
  url: "https://playwhatai.vercel.app",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body className="">
        <Header />
        {children}
        <Footer />
      </body>
    </html>
  );
}
