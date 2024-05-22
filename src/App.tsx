import React, { useState, useEffect } from "react";
import "./App.css";
import { TonConnectButton } from "@tonconnect/ui-react";
import { RockPaperScissors } from "./components/RockPaperScissors";
import styled, { createGlobalStyle } from "styled-components";
import { useTonConnect } from "./hooks/useTonConnect";
import { CHAIN } from "@tonconnect/protocol";

const GlobalStyle = createGlobalStyle`
  body {
    font-family: 'Arial', sans-serif;
    margin: 0;
    padding: 0;
    background-color: #f0f0f0;
  }
`;

const StyledApp = styled.div`
  background-color: white;
  color: black;

  @media (prefers-color-scheme: dark) {
    background-color: #1c1c1c;
    color: white;
  }
  min-height: 100vh;
  display: flex;
  justify-content: center;
  align-items: center;
`;

const AppContainer = styled.div`
  max-width: 900px;
  margin: 0 auto;
  text-align: center;
`;

const NetworkIndicator = styled.div`
  margin-top: 10px;
  font-size: 0.9em;
  color: #666;
`;

const BalanceIndicator = styled.div`
  margin-top: 10px;
  font-size: 1em;
  color: #333;
`;

const App: React.FC = () => {
  const { network, connected, balance, playerAddress, peerAddress, setPeerAddress } = useTonConnect();

  useEffect(() => {
    // Simulate peer connection for demonstration
    // In a real application, you might use a signaling server or other peer discovery mechanism
    if (connected && !peerAddress) {
      setPeerAddress("PEER_WALLET_ADDRESS"); // Replace with actual logic to get the peer address
    }
  }, [connected, peerAddress, setPeerAddress]);

  return (
    <>
      <GlobalStyle />
      <StyledApp>
        <AppContainer>
          <TonConnectButton />
          {connected && (
            <>
              <NetworkIndicator>
                {network === CHAIN.MAINNET ? "Mainnet" : "Testnet"}
              </NetworkIndicator>
              <BalanceIndicator>
                Balance: {balance !== null ? `${balance} TON` : "Loading..."}
              </BalanceIndicator>
              {peerAddress ? (
                <RockPaperScissors />
              ) : (
                <p>Waiting for peer to connect...</p>
              )}
            </>
          )}
          {!connected && <p>Please connect your wallet to start.</p>}
        </AppContainer>
      </StyledApp>
    </>
  );
};

export default App;
