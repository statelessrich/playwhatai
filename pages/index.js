import Head from "next/head";
import Image from "next/image";
import { useContext, useEffect, useRef, useState } from "react";
import Form from "../components/Form";
import styles from "../styles/index.module.scss";
import { Context } from "../lib/context";

export default function Home() {
  // const [gameInput, setGameInput] = useState("Super Mario RPG");
  const [result, setResult] = useState(null);
  const resultRef = useRef();
  const { isLoading, pageReady, heroImage, showError, setIsLoading, setHeroImage, setPageReady } =
    useContext(Context);

  // on load get random game screenshot for hero image
  useEffect(() => {
    async function getHeroImage() {
      try {
        const response = await fetch("/api/heroImage", {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
          },
        });

        const data = await response.json();
        setHeroImage(data.image);
        setPageReady(true);
      } catch (error) {
        setIsLoading(false);
        setPageReady(true);
      }
    }

    getHeroImage();
  }, []);

  // scroll to results
  useEffect(() => {
    if (result) {
      resultRef.current.scrollIntoView({ behavior: "smooth" });
    }
  }, [result]);

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
          <Image src="/logo.png" className={styles.icon} alt="play what logo" width={130} height={130} />
          <h1>playwhat</h1>
        </div>

        {heroImage && <Form onSubmit={onSubmit} heroImage={heroImage} isLoading={isLoading} />}

        <div ref={resultRef} className={styles.result}>
          {formatResponse(result, heroImage)}
        </div>
      </main>
    </div>
  );
}

function formatResponse(result, screenshot) {
  return (
    <>
      {result?.games?.map((game) => (
        <div className={styles.game} key={game.name}>
          <div className={styles.text}>
            <h2>{game.name}&nbsp;</h2>
            <p className={styles.platform}>{game.platform}</p>
            <p>{game.description}</p>
          </div>
        </div>
      ))}

      {result?.other && (
        <div className={styles.game}>
          <h2>Others</h2>

          {result.other.map((game) => (
            <p key={game}>{game}</p>
          ))}
        </div>
      )}
    </>
  );
}
