import styled from "@emotion/styled";

export const Container = styled.div`
  position: fixed;
  top: 0;
  bottom: 0;
  left: 0;
  right: 0;
  display: grid;
  grid-template-rows: 130px 1fr 1fr;
  @media (prefers-color-scheme: dark) {
    background-color: rgb(34, 34, 34);
  }
  @media (max-height: 740px) {
    grid-template-rows: 70px 1fr 1fr;
  }
`;
