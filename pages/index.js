import Head from "next/head";
import { useState } from "react";
import styles from "./index.module.scss";

export default function Home() {
  const [gameInput, setGameInput] = useState("Super Mario RPG");
  const [genreInput, setGenreInput] = useState("RPG");
  const [platformInput, setPlatformInput] = useState("");
  const [ageInput, setAgeInput] = useState("modern");
  const [result, setResult] = useState();

  async function onSubmit(event) {
    event.preventDefault();
    try {
      const response = await fetch("/api/generate", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ game: gameInput, genre: genreInput, platform: platformInput, age: ageInput }),
      });

      const data = await response.json();
      if (response.status !== 200) {
        throw data.error || new Error(`Request failed with status ${response.status}`);
      }

      const formattedResult = data.result.replace(/\n/g, "");
      setResult(JSON.parse(formattedResult));
    } catch (error) {
      // Consider implementing your own error handling logic here
      console.error(error);
      alert(error.message);
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
              </div>
              <div>
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
              </div>
              {/* <input
              type="text"
              name="platform"
              placeholder="platform"
              value={platformInput}
              onChange={(e) => setPlatformInput(e.target.value)}
            /> */}
            </span>{" "}
            <input type="submit" className={styles.submit} value="recommend me" />
          </form>
        </div>

        <div className={styles.result}>{formatResponse(result)}</div>
      </main>
    </div>
  );
}

function formatResponse(result) {
  return result?.games?.map((game) => (
    <div className={styles.game} key={game.name}>
      {/* <div className={styles.gameImg}>
        <img src={game.img} />
      </div> */}
      <div className={styles.gameName}>{game.name}</div>
      <div className={styles.gameDescription}>{game.description}</div>
    </div>
  ));
}
