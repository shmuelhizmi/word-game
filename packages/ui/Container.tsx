import styled from "@emotion/styled";

export const Container = styled.div`
  position: fixed;
  top: 0;
  bottom: 0;
  left: 0;
  right: 0;
  display: grid;
  @media (prefers-color-scheme: _dark) {
    background-color: rgb(34, 34, 34);
  }
`;
