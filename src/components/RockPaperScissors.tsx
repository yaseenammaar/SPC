import React, { useState } from "react";
import { useTonConnect } from "../hooks/useTonConnect";
import styled from "styled-components";

const GameContainer = styled.div`
  margin-top: 20px;
`;

const ChoiceButton = styled.button`
  margin: 10px;
  padding: 10px;
  font-size: 1em;
`;

const Result = styled.div`
  margin-top: 20px;
  font-size: 1.2em;
`;

export const RockPaperScissors: React.FC = () => {
  const { playerAddress, peerAddress, stakeAndPlay, distributeRewards } = useTonConnect();
  const [result, setResult] = useState<string | null>(null);

  const playGame = async (choice: string) => {
    const opponentChoice = ["rock", "paper", "scissors"][Math.floor(Math.random() * 3)];
    const outcome = determineWinner(choice, opponentChoice);

    setResult(`You chose ${choice}. Opponent chose ${opponentChoice}. ${outcome}`);
    
    const amount = 1; // 1 TON

    await stakeAndPlay(amount);
    
    if (outcome.includes("win")) {
      await distributeRewards(playerAddress!, amount * 2);
    } else if (outcome.includes("lose")) {
      await distributeRewards(peerAddress!, amount * 2);
    }
  };

  const determineWinner = (userChoice: string, opponentChoice: string): string => {
    if (userChoice === opponentChoice) {
      return "It's a draw!";
    }
    if (
      (userChoice === "rock" && opponentChoice === "scissors") ||
      (userChoice === "paper" && opponentChoice === "rock") ||
      (userChoice === "scissors" && opponentChoice === "paper")
    ) {
      return "You win!";
    }
    return "You lose!";
  };

  return (
    <GameContainer>
      <div>
        <ChoiceButton onClick={() => playGame("rock")}>Rock</ChoiceButton>
        <ChoiceButton onClick={() => playGame("paper")}>Paper</ChoiceButton>
        <ChoiceButton onClick={() => playGame("scissors")}>Scissors</ChoiceButton>
      </div>
      {result && <Result>{result}</Result>}
    </GameContainer>
  );
};
