import { useCallback, useEffect, useMemo, useState } from "react";
import type { GuessType, PuzzleWordCharCountType } from "./types";
import Keyboard from "./Keyboard/Keyboard";
import SubmittedGuess from "./SubmittedGuess/SubmittedGuess";
import styles from "./wordle.module.css";

const totalGuessMax = 6;

function useWordOfTheDay() {
  const [word, setWord] = useState<null | string>(null);

  useEffect(() => {
    async function fetchWord() {
      const response = await fetch("/api/word").then((res) => res.json());
      console.log(response);
      setWord(response.word);
    }
    fetchWord();
  }, []);
  return word;
}

function useCharCountMap(word: string | null) {
  return useMemo(() => {
    if (word === null) {
      return {};
    }
    return word.split("").reduce<PuzzleWordCharCountType>((acc, char) => {
      if (!acc.hasOwnProperty(char)) {
        acc[char] = 1;
      } else {
        acc[char] += 1;
      }
      return acc;
    }, {});
  }, [word]);
}

export default function Wordle() {
  const [submittedGuesses, setSubmittedGuesses] = useState<Array<string[]>>([]);
  const [guess, setGuess] = useState<string[]>([]);

  const wordOfTheDay = useWordOfTheDay();
  const handleKeyInput = useCallback(
    (key: string) => {
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
    },
    [guess]
  );

  useEffect(() => {
    function handleKeyDown({ key }: { key: string }) {
      handleKeyInput(key);
    }
    window.addEventListener("keydown", handleKeyDown);

    return () => {
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, [guess.length, guess, handleKeyInput]);

  const puzzleWordCharCount = useCharCountMap(wordOfTheDay);

  if (wordOfTheDay === null) {
    return <p>Loading...</p>;
  }

  const isCorrect =
    submittedGuesses.length > 0 &&
    submittedGuesses[submittedGuesses.length - 1].join("") === wordOfTheDay;

  const isFailure = !isCorrect && submittedGuesses.length === totalGuessMax;
  // favourite function yet written by me(sort of!).
  // got an error "type 'void' is not assignable to type 'Record<string,number>'" when the code wasn't returning the useMemo hook.

  return (
    <div className={styles.wordle}>
      <h3>Guess&apos;em!</h3>
      <div className={styles.boardPositioner}>
        <div className={styles.wordleBoard}>
          <SubmittedGuesses
            puzzleWord={wordOfTheDay}
            submittedGuesses={submittedGuesses}
            puzzleWordCharCount={puzzleWordCharCount}
          />

          {!isFailure && !isCorrect && <CurrentGuess guess={guess} />}

          {Array.from({
            length:
              totalGuessMax - submittedGuesses.length - (isCorrect ? 0 : 1),
          }).map((_, i) => {
            return <EmptyGuess key={i} />;
          })}
          {isCorrect && (
            <div className={`${styles.message}`}>
              You did it! You are the smartest.
            </div>
          )}
          {isFailure && (
            <div className={`${styles.message}`}>
              Sorry, try again next time.
            </div>
          )}
        </div>
      </div>
      <Keyboard keyPressHandler={handleKeyInput} />
    </div>
  );
}

type SubmittedGuessesProps = {
  submittedGuesses: string[][];
  puzzleWord: string;
  puzzleWordCharCount: PuzzleWordCharCountType;
};

function SubmittedGuesses({
  submittedGuesses,
  puzzleWord,
  puzzleWordCharCount,
}: SubmittedGuessesProps) {
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

type CurrentGuessProps = {
  guess: GuessType;
};

function CurrentGuess({ guess }: CurrentGuessProps) {
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
