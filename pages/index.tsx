import type { NextPage } from "next";
import Wordle from "../components/Wordle/Wordle";
import styles from "../styles/Home.module.css";

const Home: NextPage = () => {
	return (
		<div>
			<Wordle />
		</div>
	);
};

export default Home;
