import React, { useState } from "react";
import styled from "styled-components";
import { Button } from "./styled/styled";

const GameContainer = styled.div`
  text-align: center;
  margin-top: 20px;
`;

const ChoicesContainer = styled.div`
  display: flex;
  justify-content: center;
  margin-top: 10px;
`;

const ChoiceButton = styled(Button)`
  margin: 0 10px;
`;

const ResultContainer = styled.div`
  margin-top: 20px;
  font-size: 1.2em;
`;

const choices = ["rock", "paper", "scissors"] as const;
type Choice = typeof choices[number];

const getResult = (playerChoice: Choice, computerChoice: Choice) => {
  if (playerChoice === computerChoice) return "It's a draw!";
  if (
    (playerChoice === "rock" && computerChoice === "scissors") ||
    (playerChoice === "scissors" && computerChoice === "paper") ||
    (playerChoice === "paper" && computerChoice === "rock")
  ) {
    return "You win!";
  }
  return "You lose!";
};

export const RockPaperScissors: React.FC = () => {
  const [playerChoice, setPlayerChoice] = useState<Choice | "">("");
  const [computerChoice, setComputerChoice] = useState<Choice | "">("");
  const [result, setResult] = useState<string>("");

  const handleChoice = (choice: Choice) => {
    const randomChoice: Choice = choices[Math.floor(Math.random() * choices.length)];
    setPlayerChoice(choice);
    setComputerChoice(randomChoice);
    setResult(getResult(choice, randomChoice));
  };

  return (
    <GameContainer>
      <h2>Rock Paper Scissors</h2>
      <ChoicesContainer>
        {choices.map((choice) => (
          <ChoiceButton key={choice} onClick={() => handleChoice(choice)}>
            {choice.charAt(0).toUpperCase() + choice.slice(1)}
          </ChoiceButton>
        ))}
      </ChoicesContainer>
      {result && (
        <ResultContainer>
          <p>You chose: {playerChoice}</p>
          <p>Computer chose: {computerChoice}</p>
          <p>{result}</p>
        </ResultContainer>
      )}
    </GameContainer>
  );
};
