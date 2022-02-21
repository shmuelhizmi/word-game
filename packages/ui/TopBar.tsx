import Image from "next/image";
import styled from "@emotion/styled";
import { GoMute, GoUnmute, GoPlus } from "react-icons/go";

const Container = styled.div`
  margin: auto;
  display: flex;
  justify-content: space-evenly;
  width: clamp(5vw, 100vw, 320px);
  height: 60px;
  font-family: "Secular One";
  overflow: hidden;
  font-size: clamp(0.5vw, 5vw, 15px);
  div {
    text-align: center;
    align-self: center;
    /* justify-self: center; */
  }
  button {
    border: none;
    background-color: transparent;
    color: rgb(194, 170, 82);
  }
  > :first-of-type > button {
    color: rgb(98, 159, 91);
  }
  img {
    width: clamp(0.5vw, 13vw, 40px);
  }
  @media (prefers-color-scheme: dark) {
    color: white;
  }
`;

export const TopBar = ({ newGame, muted, onMuteClick, overrideHeader }: TopBarProps) => {
  return (
    <Container>
      <div>
        <button onClick={newGame}>
          <GoPlus style={{ width: 40, height: 40 }} />
        </button>
      </div>
      <div>
        <h1>{overrideHeader ?? "ווערטער"}</h1>
      </div>
      <div>
        <button onClick={onMuteClick}>
          {muted ? (
            <GoMute style={{ width: 40, height: 40 }} />
          ) : (
            <GoUnmute style={{ width: 40, height: 40 }} />
          )}
        </button>
      </div>
      <div>&nbsp; </div>
    </Container>
  );
};

export const MiniTopBar = () => {
  return (
    <Container>
      <div>
        <h1>בחרו מילה</h1>
      </div>
    </Container>
  );
};

interface TopBarProps {
  newGame: () => void;
  muted: boolean;
  onMuteClick: () => void;
  overrideHeader: string;
}
