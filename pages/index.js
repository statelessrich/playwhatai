import Head from "next/head";
import { useEffect, useState } from "react";
import PacmanLoader from "react-spinners/PacmanLoader";

import styles from "./index.module.scss";

export default function Home() {
  const [gameInput, setGameInput] = useState("Super Mario RPG");
  const [ageInput, setAgeInput] = useState("modern");
  const [result, setResult] = useState();
  const [isLoading, setIsLoading] = useState(false);
  const [pageReady, setPageReady] = useState(false);
  const [heroImage, setHeroImage] = useState();
  const [showError, setShowError] = useState(false);

  const override = {
    display: "block",
    margin: "0 auto",
    position: "absolute",
  };

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

  async function onSubmit(event) {
    event.preventDefault();
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
        body: JSON.stringify({ game: gameInput, age: ageInput }),
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
        <link rel="icon" href="/logo.png" />
      </Head>

      <main className={styles.main}>
        <div className={`${styles.header} ${pageReady ? "" : styles.isLoading}`}>
          <img src="/logo.png" className={styles.icon} alt="play what logo" />
          <h1>playwhat</h1>
        </div>

        {pageReady && (
          <div className={styles.formContainer}>
            {/* hero img */}
            {heroImage && <img src={heroImage} alt="playwhat" />}

            {/* form */}
            <form onSubmit={onSubmit}>
              <span className={styles.inlineForm}>
                {/* age */}
                <div>
                  <span className={styles.text}>I wanna play a</span>{" "}
                  <select
                    name="age"
                    className={styles.age}
                    value={ageInput}
                    onChange={(e) => setAgeInput(e.target.value)}
                  >
                    <option value="classic">classic</option>
                    <option value="modern">modern</option>
                  </select>{" "}
                </div>
                {/* name */}
                <div>
                  <span className={styles.text}>game like</span>{" "}
                  <input
                    className={`${styles.inline} ${styles.game}`}
                    type="text"
                    name="game"
                    placeholder="game"
                    value={gameInput}
                    onChange={(e) => setGameInput(e.target.value)}
                  />
                </div>
              </span>

              {/* submit */}
              <div className={styles.submitContainer}>
                {isLoading ? (
                  <>
                    <input type="submit" className={`${styles.submit} ${styles.loading}`} value=""></input>

                    <PacmanLoader cssOverride={override} className={styles.loader} color="#484848" />
                  </>
                ) : (
                  <input type="submit" className={styles.submit} value="recommend me" />
                )}
              </div>

              {/* error */}
              {showError && (
                <div className={styles.error}>
                  Something went wrong :(
                  <br />
                  Please try again
                </div>
              )}
            </form>
          </div>
        )}

        <div className={styles.result}>{formatResponse(result, heroImage)}</div>
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
            <h2>
              {game.name}&nbsp;
              <small>{game.platform}</small>
            </h2>
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
