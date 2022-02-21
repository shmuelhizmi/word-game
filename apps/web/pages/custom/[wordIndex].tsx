import { Game } from "../../game";
import { allWords } from "../../utils/words";
import { useRouter } from "next/router";
import Head from "next/head";

export default function CustomGame() {
  const router = useRouter();
  const index = Number(router.query.wordIndex);

  return (
    <>
      <Head>
        <title>ווערטער</title>
      </Head>
      <Game word={allWords[index]} />
    </>
  );
}
