import Head from "next/head";
import { Game } from "../game";

export default function Index() {
  return (
    <>
      <Head>
        <title>ווערטער</title>
      </Head>
      <Game hardMode />
    </>
  );
}
