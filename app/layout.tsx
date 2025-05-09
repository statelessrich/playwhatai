import "./globals.scss";
import Footer from "./components/footer";
import Header from "./components/header";
import { Providers } from "./redux/provider";

export const metadata = {
	title: "playwhat",
	description: "AI-powered video game recommendations",
	keywords: "video games, AI, gaming",
	image: "https://playwhatai.vercel.app/social.png",
	url: "https://playwhatai.vercel.app",
};

export default function RootLayout({
	children,
}: { children: React.ReactNode }) {
	return (
		<html lang="en">
			<body className="">
				<Header />
				<Providers>{children}</Providers>
				<Footer />
			</body>
		</html>
	);
}
