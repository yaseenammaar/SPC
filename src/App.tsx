import React from "react";
import "./App.css";
import { TonConnectButton } from "@tonconnect/ui-react";
import { RockPaperScissors } from "./components/RockPaperScissors";
import styled from "styled-components";
import { useTonConnect } from "./hooks/useTonConnect";
import { CHAIN } from "@tonconnect/protocol";
import "@twa-dev/sdk";

const StyledApp = styled.div`
  background-color: #e8e8e8;
  color: black;

  @media (prefers-color-scheme: dark) {
    background-color: #222;
    color: white;
  }
  min-height: 100vh;
  display: flex;
  justify-content: center;
  align-items: center;
`;

const CenteredContainer = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  text-align: center;
`;

const TelegramEmoji = styled.div`
  font-size: 48px;
`;

const App: React.FC = () => {
  const { network, connected } = useTonConnect();

  return (
    <StyledApp>
      {!connected ? (
        <CenteredContainer>
          <TonConnectButton />
          <TelegramEmoji>🤖</TelegramEmoji>
        </CenteredContainer>
      ) : (
        <RockPaperScissors />
      )}
    </StyledApp>
  );
};

export default App;
