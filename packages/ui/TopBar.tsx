import Image from "next/image";
import styled from "@emotion/styled";
import { GoMute, GoUnmute, GoPlus } from "react-icons/go";

const Container = styled.div`
  margin: auto;
  display: flex;
  justify-content: center;
  width: clamp(5vw, 100vw, 90%);
  height: 100%;
  font-family: "Secular One";
  overflow: hidden;
  font-size: clamp(0.5vw, 5vw, 15px);
  div {
    border-radius: 10px;
    margin: 5px;
  }
  img {
    border-radius: 10px;
    width: 100%;
    height: 100%;
    border: solid rgb(212, 212, 212) 3px;
  }
  @media (prefers-color-scheme: _dark) {
    color: white;
  }
`;

export const TopBar = ({ image }: TopBarProps) => {
  return (
    <Container>
      <div>
        <img src={image} />
      </div>
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
  // newGame: () => void;
  // muted: boolean;
  // onMuteClick: () => void;
  // overrideHeader: string;
  image: string;
}
