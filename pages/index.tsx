import type { NextPage } from "next";
import Wordle from "../components/Wordle/Wordle";
import styles from "../styles/Home.module.css";

const Home: NextPage = () => {
	return (
		<div>
			<Wordle />
			<style jsx global>
				{`
					:root {
						--black: #040303;
						--white: #fafaff;
						--yellow: #ec9f05;
						--green: #9bc53d;

						background-color: var(--black);
						color: var(--white);
					}
				`}
			</style>
		</div>
	);
};

export default Home;
