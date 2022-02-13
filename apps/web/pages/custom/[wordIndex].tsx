import { Game } from "../../game";
import { allWords } from "../../utils/words";
import { useRouter } from 'next/router'

export default function CustomGame() {
  const router = useRouter()
  const index = Number(router.query.wordIndex);

  return (
    <Game word={allWords[index]} />
  )
}
