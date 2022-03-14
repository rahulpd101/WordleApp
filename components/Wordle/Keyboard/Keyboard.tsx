import styles from "./keyboard.module.css";
import { useMemo } from "react";

type KeyPressHandlerType = (key: string) => void;

type KeyboardProps = {
	keyPressHandler: KeyPressHandlerType;
};

export default function Keyboard({ keyPressHandler }: KeyboardProps) {
	const top = useMemo(() => {
		return "qwertyuiop".split("").map((char) => {
			return <Key keyPressHandler={keyPressHandler} key={char} keyName={char} />;
		});
	}, [keyPressHandler]);

	const middle = useMemo(() => {
		return "asdfghjkl".split("").map((char) => {
			return <Key keyPressHandler={keyPressHandler} key={char} keyName={char} />;
		});
	}, [keyPressHandler]);

	const bottom = useMemo(() => {
		const letters = "zxcvbnm".split("").map((char) => {
			return <Key keyPressHandler={keyPressHandler} key={char} keyName={char} />;
		});
		const enterKey = <Key keyPressHandler={keyPressHandler} small key="Enter" keyName="Enter" />;

		const backSpaceKey = <Key keyPressHandler={keyPressHandler} key="Backspace" small keyName="Backspace" />;

		return [enterKey, ...letters, backSpaceKey];
	}, [keyPressHandler]);

	return (
		<div className={styles.wrapper}>
			<div className={styles.row}>{top}</div>
			<div className={styles.row}>{middle}</div>
			<div className={styles.row}>{bottom}</div>
		</div>
	);
}

type KeyProps = {
	small?: boolean; //small is an optional class to make backspace & enter keys small.
	keyName: string;
	keyPressHandler: KeyPressHandlerType;
};

const Key = ({ keyName, keyPressHandler, small }: KeyProps) => {
	return (
		<span
			className={`${styles.key} ${small ? styles.smallKey : ""}`}
			onClick={() => {
				keyPressHandler(keyName);
			}}>
			{keyName}
		</span>
	);
};
