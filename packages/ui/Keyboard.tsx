import styled from "@emotion/styled";

const KeyboardContainer = styled.div`
  display: flex;
  flex-direction: column;
  padding-top: 10px;
  border-radius: 10px;
  gap: 6px;
  width: 100vw;
  text-align: center;
  div {
    overflow: hidden;
    display: flex;
    justify-content: center;
    margin-right: 14px;
    width: 100%;
  }
  button {
    touch-action: manipulation;
    width: clamp(1vw, 10vw, 40px);
    height: 50px;
    font-family: "Secular One";
    text-align: center;
    font-size: clamp(0.2vw, 8vw, 17px);
    border: none;
    border-radius: 5px;
    margin: clamp(0.3vw, 0.5vw, 2px);
    padding: 0;
  }
`;

const Letter = styled.button`
  background-color: rgb(209, 209, 209);
  color: black;
`;

const LossingLetter = styled(Letter)`
  background-color: rgb(109, 113, 115);
`;

const WinningLetter = styled(Letter)`
  background-color: rgb(98, 159, 91);
`;

const PartiallyWinningLetter = styled(Letter)`
  background-color: rgb(194, 170, 82);
`;

const Send = styled.button`
  color: rgb(255, 255, 255);
  width: clamp(1.8vw, 45vw, 200px) !important;
  background-color: rgb(110, 110, 110);
`;

const Clear = styled.button`
  color: rgb(235, 235, 235);
  background-color: rgb(110, 110, 110);
`;

const Letters = [
  ["ק", "ר", "א", "ט", "ו", "פ"],
  ["ש", "ד", "ג", "כ", "ע", "י", "ח", "ל"],
  ["ז", "ס", "ב", "ה", "נ", "מ", "צ", "ת"],
];

interface KeyboardProps {
  onLetterClick: (letter: string) => void;
  onSendClick: () => void;
  onBackspaceClick: () => void;
  currectLetters: string;
  partialLetters: string;
  wrongLetters: string;
}

interface LetterRendererProps {
  letter: string;
  currectLetters: string;
  partialLetters: string;
  wrongLetters: string;
  onClick(): void;
}

function LetterRenderer(props: LetterRendererProps) {
  if (props.currectLetters.includes(props.letter)) {
    return (
      <WinningLetter onClick={props.onClick}>{props.letter}</WinningLetter>
    );
  }
  if (props.partialLetters.includes(props.letter)) {
    return (
      <PartiallyWinningLetter onClick={props.onClick}>
        {props.letter}
      </PartiallyWinningLetter>
    );
  }
  if (props.wrongLetters.includes(props.letter)) {
    return (
      <LossingLetter onClick={props.onClick}>{props.letter}</LossingLetter>
    );
  }
  return <Letter onClick={props.onClick}>{props.letter}</Letter>;
}

export function Keyboard(props: KeyboardProps) {
  return (
    <KeyboardContainer>
      {Letters.map((row, i) => (
        <div key={i}>
          {i === 0 && <Clear onClick={props.onBackspaceClick}>{"<"}</Clear>}
          {row.map((letter, j) => (
            <LetterRenderer key={j} onClick={() => props.onLetterClick(letter)} {...props} letter={letter} />
          ))}
        </div>
      ))}
      <div>
        <Send onClick={props.onSendClick}>שלח</Send>
      </div>
    </KeyboardContainer>
  );
}
