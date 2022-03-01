import type { NextApiRequest, NextApiResponse } from "next";

const wordDb = ["abbey", "proxy", "metal", "space", "wrong", "games", "taboo"];

function getIndexFromDate() {
	return 0;
}

export default function word(req: NextApiRequest, res: NextApiResponse) {
	const todaysWord = wordDb[getIndexFromDate()];
	res.status(200).json({ word: todaysWord });
}
