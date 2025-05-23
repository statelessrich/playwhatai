"use client";
import Image from "next/image";
import { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import Select from "react-select";
import PacmanLoader from "react-spinners/PacmanLoader";
import { setGameInput } from "../../redux/features/formSlice";
import styles from "./form.module.scss";

/**
 * Form component for user to input game name and age
 */
export default function Form({ onSubmit }) {
	const dispatch = useDispatch();

	// age input
	const ageOptions = [
		{ value: "retro", label: "retro" },

		{ value: "modern", label: "modern" },
	];
	const [ageInput, setAgeInput] = useState(ageOptions[0]);

	// form state values
	const { isLoading, heroImage, showError, gameInput } = useSelector(
		(state) => state.form,
	);

	// override styles for react-spinner component
	const loaderStyleOverride = {
		display: "block",
		margin: "0 auto",
		position: "absolute",
	};

	// check if game input exists
	function isInputValid() {
		if (gameInput?.trim().length === 0) {
			return false;
		}

		return true;
	}

	return (
		// form container
		<div
			className={`md:w-full mt-20 overflow-hidden relative bg-gray-50 mx-auto ${styles.formContainer}`}
		>
			{/* background hero image */}
			<Image
				priority
				src={heroImage}
				alt="playwhat"
				width={1920}
				height={1080}
				className="absolute w-full h-full top-0 left-0 right-0 bottom-0 object-cover"
			/>

			{/* form */}
			<form
				onSubmit={(e) => onSubmit(e, gameInput, ageInput)}
				className="relative flex flex-col mx-auto text-3xl py-32 px-0 max-w-[80%]"
			>
				<span
					className={`${styles.inlineForm} md:max-w-xl md:w-full md:mx-auto p-5`}
				>
					<div>
						<label htmlFor="game-age" className="block md:inline-block h-10">
							I wanna play a
						</label>{" "}
						{/* game age input (retro/modern) */}
						<Select
							inputId="game-age"
							isSearchable={false}
							options={ageOptions}
							defaultValue={ageOptions[0]}
							onChange={setAgeInput}
							styles={{
								container: (baseStyles) => ({
									...baseStyles,
									display: "inline-block",
								}),
								control: (baseStyles) => ({
									...baseStyles,
									width: "100%",
									border: "none",
									borderBottom: "4px solid rgb(75, 85, 99)",
									borderRadius: "0",
									height: "80px",
									padding: "0",
									background: "transparent",
									fontSize: "1.875rem",
									color: "#666",
									fontWeight: "bold",
									marginBottom: "0",
									paddingLeft: "5px",
									caretColor: "transparent",

									":hover": {
										borderBottomColor: "#353740",
									},
								}),
								indicatorSeparator: (baseStyles) => ({
									...baseStyles,
									display: "none",
								}),
								singleValue: (baseStyles) => ({
									...baseStyles,
									color: "#666",
								}),
								dropdownIndicator: (provided) => ({
									...provided,
									color: "#353740",
									":hover": {
										color: "inherit",
									},
								}),
							}}
						/>
					</div>

					{/* game name input */}
					<div>
						<label htmlFor="game-input" className="mt-8 inline-block h-10">
							game like
						</label>{" "}
						<input
							id="game-input"
							className="inline-block w-full md:max-w-xs focus:outline-blue-400 border-b-4 border-gray-600 bg-transparent text-inherit font-bold px-3 h-20"
							type="text"
							name="game"
							value={gameInput}
							onChange={(e) => dispatch(setGameInput(e.target.value))}
						/>
					</div>
				</span>

				{/* submit container*/}
				<div className="relative flex justify-center items-center mt-10">
					{isLoading ? (
						<>
							{/* submit button to contain loading graphic */}
							<input
								type="submit"
								className={`${styles.submit} ${styles.loading} ${
									isLoading && "pointer-events-none bg-white"
								}`}
								value=""
							/>

							{/* loading graphic */}
							<PacmanLoader
								size={20}
								cssOverride={loaderStyleOverride}
								className="absolute"
								color="#484848"
							/>
						</>
					) : (
						// submit button
						<input
							type="submit"
							disabled={!isInputValid()}
							className={`${styles.submit}`}
							value="recommend"
						/>
					)}
				</div>

				{/* error message */}
				{showError && (
					<div className="text-22 font-bold bg-white bg-opacity-90 mx-auto max-w-md w-full text-center text-red-500 mt-6 p-4">
						Something went wrong :(
						<br />
						Please try again
					</div>
				)}
			</form>
		</div>
	);
}
