import Head from "next/head";
import Image from "next/image";
import { useEffect, useState } from "react";
import useAppStore from "../lib/store";
import Form from "../components/form";
import styles from "../styles/index.module.scss";
import Response from "../components/response";
import getRandomGame from "./api/randomGame";

// on load get random game data from server
export async function getServerSideProps() {
  const data = await getRandomGame();

  return {
    props: {
      data,
    },
  };
}

export default function Home({ data }) {
  const [result, setResult] = useState(null);
  const isLoading = useAppStore((state) => state.isLoading);
  const pageReady = useAppStore((state) => state.pageReady);
  const heroImage = useAppStore((state) => state.heroImage);
  const setIsLoading = useAppStore((state) => state.setIsLoading);
  const setHeroImage = useAppStore((state) => state.setHeroImage);
  const setPageReady = useAppStore((state) => state.setPageReady);
  const setShowError = useAppStore((state) => state.setShowError);
  const setGameInput = useAppStore((state) => state.setGameInput);

  // set random game name and image from server props on page load
  useEffect(() => {
    setHeroImage(data.image);
    setGameInput(data.name);
    setPageReady(true);
  }, []);

  async function onSubmit(event, gameInput, ageInput) {
    event.preventDefault();

    if (gameInput.trim().length === 0) {
      return;
    }

    setIsLoading(true);
    setResult("");
    setShowError(false);

    // submit openai prompt
    try {
      const response = await fetch("/api/generate", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ game: gameInput, age: ageInput.value }),
      });

      const data = await response.json();

      if (response.status !== 200) {
        throw data.error || new Error(`Request failed with status ${response.status}`);
      }

      // replace new line characters
      const formattedResult = JSON.parse(data.result.replace(/\n/g, ""));
      setResult(formattedResult);
      setIsLoading(false);
    } catch (error) {
      console.error(error);
      setIsLoading(false);
      setShowError(true);
    }
  }

  return (
    <div>
      <Head>
        <title>playwhat</title>
        <meta property="og:title" content="playwhat" key="title" />
        <meta property="og:description" content="Video game recommendations using AI." />
        <meta property="og:keywords" content="video games, AI, gaming" />
        <meta property="og:image" content="https://playwhatai.vercel.app/social.png" />
        <meta property="og:url" content="https://playwhatai.vercel.app/" />
        <link rel="icon" href="/logo.png" />
      </Head>

      <main className={styles.main}>
        <div className={`${styles.header} ${pageReady ? "" : styles.isLoading}`}>
          {/* logo */}
          <Image
            priority
            src="/logo.png"
            className={styles.icon}
            alt="play what logo"
            width={130}
            height={130}
          />

          {/* title */}
          <h1>playwhat</h1>
        </div>

        {/* form */}
        {heroImage && <Form onSubmit={onSubmit} heroImage={heroImage} isLoading={isLoading} />}

        {/* response */}
        {result && <Response result={result} />}
      </main>
    </div>
  );
}
