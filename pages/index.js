import Head from "next/head";
import { useState } from "react";
import PacmanLoader from "react-spinners/PacmanLoader";

import styles from "./index.module.scss";

export default function Home() {
  const [gameInput, setGameInput] = useState("Super Mario RPG");
  const [genreInput, setGenreInput] = useState("RPG");
  const [platformInput, setPlatformInput] = useState("");
  const [ageInput, setAgeInput] = useState("modern");
  const [result, setResult] = useState();
  const [isLoading, setIsLoading] = useState(false);

  const override = {
    display: "block",
    margin: "0 auto",
    position: "absolute",
    // borderColor: "red",
  };

  async function onSubmit(event) {
    event.preventDefault();
    setIsLoading(true);
    setResult("");

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
      const formattedResult = data.result.replace(/\n/g, "");
      setResult(JSON.parse(formattedResult));
      console.log(JSON.parse(formattedResult));
      setIsLoading(false);
    } catch (error) {
      console.error(error);
      setIsLoading(false);
    }
  }

  return (
    <div>
      <Head>
        <title>playwhat</title>
        {/* <link rel="icon" href="/dog.png" /> */}
      </Head>

      <main className={styles.main}>
        {/* <img src="/dog.png" className={styles.icon} /> */}
        <h1>playwhat</h1>

        <div className={styles.formContainer}>
          <form onSubmit={onSubmit}>
            <span className={styles.inlineForm}>
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
                <span className={styles.text}>.</span>
              </div>
              {/* <div>
                <span className={styles.text}> in the</span>{" "}
                <input
                  className={`${styles.inline} ${styles.genre}`}
                  type="text"
                  name="genre"
                  placeholder="RPG"
                  value={genreInput}
                  onChange={(e) => setGenreInput(e.target.value)}
                />{" "}
                genre.
              </div> */}
              {/* <input
              type="text"
              name="platform"
              placeholder="platform"
              value={platformInput}
              onChange={(e) => setPlatformInput(e.target.value)}
            /> */}
            </span>{" "}
            <div className={styles.submitContainer}>
              {isLoading ? (
                <>
                  <input type="submit" className={`${styles.submit} ${styles.loading}`} value=""></input>

                  <PacmanLoader
                    // loading={isLoading}
                    cssOverride={override}
                    className={styles.loader}
                    color="#484848"
                  />
                </>
              ) : (
                <input type="submit" className={styles.submit} value="recommend me" />
              )}
            </div>
          </form>
        </div>

        <div className={styles.result}>{formatResponse(result)}</div>
      </main>
    </div>
  );
}

function formatResponse(result) {
  return (
    <>
      {result?.games?.map((game) => (
        <div className={styles.game} key={game.name}>
          {/* <div className={styles.gameImg}>
        <img src={game.img} />
      </div> */}
          <h2>{game.name}</h2>
          <p>{game.description}</p>
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
