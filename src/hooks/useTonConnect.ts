import { CHAIN } from "@tonconnect/protocol";
import { Sender, SenderArguments } from "ton-core";
import { useTonConnectUI, useTonWallet } from "@tonconnect/ui-react";
import { useEffect, useState } from "react";

const OWNER_ADDRESS = "YOUR_OWNER_WALLET_ADDRESS"; // Replace with the actual owner's wallet address

export function useTonConnect(): {
  sender: Sender;
  connected: boolean;
  wallet: string | null;
  network: CHAIN | null;
  balance: number | null;
  playerAddress: string | null;
  peerAddress: string | null;
  setPeerAddress: (address: string) => void;
  stakeAndPlay: (amount: number) => Promise<void>;
  distributeRewards: (winnerAddress: string, totalAmount: number) => Promise<void>;
} {
  const [tonConnectUI] = useTonConnectUI({ network: CHAIN.TESTNET }); // Ensure testnet is specified here
  const wallet = useTonWallet();
  const [balance, setBalance] = useState<number | null>(null);
  const [playerAddress, setPlayerAddress] = useState<string | null>(null);
  const [peerAddress, setPeerAddress] = useState<string | null>(null);

  useEffect(() => {
    const fetchBalance = async () => {
      if (wallet) {
        const response = await tonConnectUI.getBalance(wallet.account.address);
        setBalance(Number(response.balance) / 1e9); // Convert from nanoTON to TON
        setPlayerAddress(wallet.account.address);
      }
    };
    fetchBalance();
  }, [wallet, tonConnectUI]);

  const sendTransaction = async (to: string, amount: number) => {
    if (!wallet) throw new Error("Wallet is not connected");
    const args: SenderArguments = {
      to: { toString: () => to },
      value: BigInt(amount * 1e9), // Convert TON to nanoTON
      body: { toBoc: () => ({ toString: () => '' }) },
    };
    await tonConnectUI.sendTransaction({
      messages: [
        {
          address: args.to.toString(),
          amount: args.value.toString(),
          payload: args.body?.toBoc().toString("base64"),
        },
      ],
      validUntil: Date.now() + 5 * 60 * 1000, // 5 minutes for user to approve
    });
  };

  const stakeAndPlay = async (amount: number) => {
    if (!wallet) throw new Error("Wallet is not connected");
    if (!peerAddress) throw new Error("Peer is not connected");

    await sendTransaction(OWNER_ADDRESS, amount * 0.2); // Send 20% to owner
    await sendTransaction(peerAddress, amount * 0.8); // Send 80% to escrow (peer)
  };

  const distributeRewards = async (winnerAddress: string, totalAmount: number) => {
    const ownerShare = totalAmount * 0.2;
    const winnerShare = totalAmount * 0.8;
    
    await sendTransaction(OWNER_ADDRESS, ownerShare); // Send 20% to owner
    await sendTransaction(winnerAddress, winnerShare); // Send 80% to winner
  };

  return {
    sender: {
      send: async (args: SenderArguments) => {
        tonConnectUI.sendTransaction({
          messages: [
            {
              address: args.to.toString(),
              amount: args.value.toString(),
              payload: args.body?.toBoc().toString("base64"),
            },
          ],
          validUntil: Date.now() + 5 * 60 * 1000, // 5 minutes for user to approve
        });
      },
    },
    connected: !!wallet?.account.address,
    wallet: wallet?.account.address ?? null,
    network: wallet?.account.chain ?? null,
    balance,
    playerAddress,
    peerAddress,
    setPeerAddress,
    stakeAndPlay,
    distributeRewards,
  };
}
