import { useEffect, useState } from "react";
import styles from "./wordle.module.css";

export default function Wordle() {
	const [guess, setGuess] = useState<Array<string>>([]);

	useEffect(() => {
		function handleKeyDown({ key }: { key: string }) {
			console.log(key);

			if (guess.length < 5) {
				const isChar = /^[a-z]$/.test(key);
				if (isChar) {
					setGuess((prev) => [...prev, key]);
				}
				console.log({ key, isChar });
			}
		}

		window.addEventListener("keydown", handleKeyDown);

		return () => {
			window.removeEventListener("keydown", handleKeyDown);
		};
	}, [guess.length]);
	console.log(guess);
	return (
		<div className={styles.wordle}>
			<div className={styles.word}>
				{guess.map((char, i) => {
					return (
						<span className={styles.char} key={i}>
							{char}
						</span>
					);
				})}
			</div>
		</div>
	);
}
