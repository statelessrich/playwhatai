import Head from "next/head";
import Footer from "./footer";

export default function Layout({ children }) {
  return (
    <>
      <Head>
        <title>playwhat</title>
        <meta property="og:title" content="playwhat" key="title" />
        <meta property="og:description" content="Video game recommendations using AI." />
        <meta property="og:keywords" content="video games, AI, gaming" />
        <meta property="og:image" content="https://playwhatai.vercel.app/social.png" />
        <meta property="og:url" content="https://playwhatai.vercel.app/" />
        <link rel="icon" href="/logo.png" />
      </Head>
      <main className="main flex flex-col items-center pb-20 bg-[#F5F5F5]">{children}</main>
      <Footer />
    </>
  );
}
