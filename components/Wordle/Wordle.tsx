import { useEffect, useMemo, useState } from "react";
import styles from "./wordle.module.css";

const totalGuessMax = 6;

type WordleProps = {
	puzzleWord: string;
};

export default function Wordle({ puzzleWord }: WordleProps) {
	if (puzzleWord.length !== 5) {
		throw new Error(`Puzzle word must be 5 characters long. ${puzzleWord} is not a valid choice.`);
	}

	const [submittedGuesses, setSubmittedGuesses] = useState<Array<string[]>>([]);
	const [guess, setGuess] = useState<string[]>([]);

	useEffect(() => {
		function handleKeyDown({ key }: { key: string }) {
			// console.log(key);

			const isChar = /^[a-z]$/.test(key);
			const isBackspace = key === "Backspace";
			const isSubmit = key === "Enter";
			const isGuessFinished = guess.length === 5;

			if (isBackspace) {
				setGuess((prev) => {
					const temp = [...prev];
					temp.pop();
					return temp;
				});
			} else if (isChar && !isGuessFinished) {
				setGuess((prev) => [...prev, key]);
			} else if (isGuessFinished && isSubmit) {
				setSubmittedGuesses((prev) => [...prev, guess]);
				setGuess([]);
			}
		}

		window.addEventListener("keydown", handleKeyDown);

		return () => {
			window.removeEventListener("keydown", handleKeyDown);
		};
	}, [guess.length]);

	console.log(submittedGuesses);

	const isCorrect =
		submittedGuesses.length > 0 && submittedGuesses[submittedGuesses.length - 1].join("") === puzzleWord;

	const isFailure = !isCorrect && submittedGuesses.length === totalGuessMax;
	// favourite function yet written by me(sort of!).
	// got an error "type 'void' is not assignable to type 'Record<string,number>'" when the code wasn't returning the useMemo hook.
	const puzzleWordCharCount = useMemo(() => {
		return puzzleWord.split("").reduce<Record<string, number>>((acc, char) => {
			if (!acc.hasOwnProperty(char)) {
				acc[char] = 1;
			} else {
				acc[char] += 1;
			}
			return acc;
		}, {});
	}, [puzzleWord]);

	return (
		<div className={styles.wordle}>
			<SubmittedGuesses
				puzzleWord={puzzleWord}
				submittedGuesses={submittedGuesses}
				puzzleWordCharCount={puzzleWordCharCount}
			/>

			{!isCorrect && <CurrentGuess guess={guess} />}

			{Array.from({ length: totalGuessMax - submittedGuesses.length - (isCorrect ? 0 : 1) }).map((_, i) => {
				return <EmptyGuess key={i} />;
			})}
			{isCorrect && <div className={`${styles.message}`}>You did it! You are the smartest.</div>}
			{isFailure && <div className={`${styles.message}`}>Sorry, try again next time.</div>}
		</div>
	);
}
type SubmittedGuessesProps = {
	submittedGuesses: string[][];
	puzzleWord: string;
	puzzleWordCharCount: Record<string, number>;
};

type GuessProps = {
	guess: string[];
};

function SubmittedGuesses({ submittedGuesses, puzzleWord, puzzleWordCharCount }: SubmittedGuessesProps) {
	return (
		<>
			{submittedGuesses.map((guess, i) => {
				return (
					<SubmittedGuess
						puzzleWord={puzzleWord}
						key={i}
						guess={guess}
						puzzleWordCharCount={puzzleWordCharCount}
					/>
				);
			})}
		</>
	);
}

function SubmittedGuess({
	guess,
	puzzleWord,
	puzzleWordCharCount,
}: GuessProps & { puzzleWord: string; puzzleWordCharCount: Record<string, number> }) {
	const charMap = { ...puzzleWordCharCount };

	console.log({ charMap, guess });

	guess.forEach((guessChar, i) => {
		const isCorrect = puzzleWord[i] === guessChar;
		if (isCorrect) {
			charMap[guessChar] -= 1;
		}
	});
	return (
		<div className={styles.submittedGuess}>
			{Array.from({ length: 5 }).map((_, i) => {
				const guessChar = guess[i];
				const puzzleChar = puzzleWord[i];

				const isCorrect = guessChar === puzzleChar;

				let isPresent = false;
				if (!isCorrect && charMap[guessChar]) {
					isPresent = true;
					charMap[guessChar] -= 1;
				}
				// const isPresent = !isCorrect && !!puzzleWordCharCount[guessChar];
				return (
					<span
						className={`${styles.char} ${isCorrect ? styles.correctChar : ""}${
							isPresent ? styles.presentChar : ""
						}`}
						key={i}>
						{guessChar}
					</span>
				);
			})}
		</div>
	);
}

function CurrentGuess({ guess }: GuessProps) {
	return (
		<div className={`${styles.word} ${styles.currentGuess}`}>
			{Array.from({ length: 5 }).map((_, i) => {
				return (
					<span className={styles.char} key={i}>
						{guess[i] || ""}
					</span>
				);
			})}
		</div>
	);
}

function EmptyGuess() {
	return (
		<div className={styles.word}>
			{Array.from({ length: 5 }).map((_, i) => {
				return <span className={styles.char} key={i}></span>;
			})}
		</div>
	);
}
