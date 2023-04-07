import React, { useContext, useState } from "react";
import Select from "react-select";
import Image from "next/image";
import styles from "../styles/form.module.scss";
import PacmanLoader from "react-spinners/PacmanLoader";
import { Context } from "../lib/context";

export default function Form({ heroImage, onSubmit, isLoading }) {
  const context = useContext(Context);

  const ageOptions = [
    { value: "classic", label: "classic" },
    { value: "modern", label: "modern" },
  ];

  const [ageInput, setAgeInput] = useState(ageOptions[0]);
  const [gameInput, setGameInput] = useState("Super Mario RPG");

  const override = {
    display: "block",
    margin: "0 auto",
    position: "absolute",
  };

  // check if game input exists
  function isInputValid() {
    if (gameInput.trim().length === 0) {
      return false;
    }

    return true;
  }

  return (
    <div className={styles.formContainer}>
      {/* hero img */}
      <Image src={heroImage} alt="playwhat" width={1920} height={1080} />

      {/* form */}
      <form onSubmit={(e) => onSubmit(e, gameInput, ageInput)}>
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
            <input type="submit" disabled={!isInputValid()} className={styles.submit} value="recommend me" />
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
  );
}
