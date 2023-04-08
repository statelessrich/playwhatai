import React, { useEffect, useRef } from "react";
import styles from "../styles/response.module.scss";

export default function Response({ result }) {
  const resultRef = useRef();

  // scroll into view on load
  useEffect(() => {
    resultRef.current.scrollIntoView({ behavior: "smooth" });
  }, []);

  return (
    <div className={styles.result} ref={resultRef}>
      {/* list of games */}
      {result?.games?.map((game) => (
        <div className={styles.game} key={game.name}>
          <div className={styles.text}>
            {/* name */}
            <h2>{game.name}&nbsp;</h2>

            {/* platform */}
            <p className={styles.platform}>{game.platform}</p>

            {/* description */}
            <p>{game.description}</p>
          </div>
        </div>
      ))}

      {/* other games */}
      {result?.other && (
        <div className={styles.game}>
          <h2>Others</h2>

          {result.other.map((game) => (
            <p key={game}>{game}</p>
          ))}
        </div>
      )}
    </div>
  );
}
