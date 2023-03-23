import Head from "next/head";
import { useEffect, useRef, useState } from "react";
import Select from "react-select";
import PacmanLoader from "react-spinners/PacmanLoader";

import styles from "./index.module.scss";

export default function Home() {
  const [gameInput, setGameInput] = useState("Super Mario RPG");
  const [result, setResult] = useState();
  const [isLoading, setIsLoading] = useState(false);
  const [pageReady, setPageReady] = useState(false);
  const [heroImage, setHeroImage] = useState();
  const [showError, setShowError] = useState(false);
  const ageOptions = [
    { value: "classic", label: "classic" },
    { value: "modern", label: "modern" },
  ];
  const [ageInput, setAgeInput] = useState(ageOptions[0]);
  const resultRef = useRef();

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

  // scroll to results
  useEffect(() => {
    if (result) {
      resultRef.current.scrollIntoView({ behavior: "smooth" });
    }
  }, [result]);

  async function onSubmit(event) {
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

  // check if game input exists
  function isInputValid() {
    if (gameInput.trim().length === 0) {
      return false;
    }

    return true;
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
                  <Select
                    options={ageOptions}
                    defaultValue={ageOptions[0]}
                    onChange={setAgeInput}
                    styles={{
                      container: (baseStyles, state) => ({
                        ...baseStyles,
                        display: "inline-block",
                        marginBottom: "30px",
                      }),
                      control: (baseStyles) => ({
                        ...baseStyles,
                        width: "100%",
                        border: "none",
                        borderBottom: "3px solid #353740",
                        borderRadius: "0",
                        height: "80px",
                        padding: "0",
                        background: "transparent",
                        fontSize: "42px",
                        color: "rgb(72, 72, 72)",
                        fontWeight: "bold",
                        marginBottom: "0",
                        paddingLeft: "5px",
                        ":hover": {
                          borderBottomColor: "inherit",
                        },
                      }),
                      indicatorSeparator: (baseStyles) => ({
                        ...baseStyles,
                        display: "none",
                      }),
                      singleValue: (baseStyles) => ({
                        ...baseStyles,
                        color: "rgb(72, 72, 72)",
                      }),
                      dropdownIndicator: (provided) => ({
                        ...provided,
                        color: "rgb(72, 72, 72)",
                        ":hover": {
                          color: "inherit",
                        },
                      }),
                    }}
                  />
                </div>
                {/* name */}
                <div>
                  <span className={styles.text}>game like</span>{" "}
                  <input
                    className={`${styles.game}`}
                    type="text"
                    name="game"
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
                  <input
                    type="submit"
                    disabled={!isInputValid()}
                    className={styles.submit}
                    value="recommend me"
                  />
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
