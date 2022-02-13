import styled from "@emotion/styled";

interface SharePanelProps {
  shareData: string;
  won: boolean;
}

const Container = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  width: 100%;
  height: 100%;
`;

const ShareButton = styled.button`
  border: none;
  font-size: 1.5em;
  margin: 0.5em;
  padding: 0.5em;
  cursor: pointer;
  color: white;
  border-radius: 5px;
  height: 80px;
  width: 160px;
`;

const WinShareButton = styled(ShareButton)`
  background-color: rgb(98, 159, 91);
`;

const LoseShareButton = styled(ShareButton)`
  background-color: rgb(194, 170, 82);
`;

export function SharePanel(props: SharePanelProps) {
  const Button = props.won ? WinShareButton : LoseShareButton;
  function Share() {
    window.navigator.share({
      text: props.shareData,
    });
  }
  return (
    <Container>
      <Button onClick={Share}>שתף תוצאה</Button>
    </Container>
  );
}
