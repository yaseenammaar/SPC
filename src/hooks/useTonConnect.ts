import { CHAIN } from "@tonconnect/protocol";
import { Sender, SenderArguments } from "ton-core";
import { useTonConnectUI, useTonWallet } from "@tonconnect/ui-react";

export function useTonConnect(): {
  sender: Sender;
  connected: boolean;
  wallet: string | null;
  network: CHAIN | null;
  sendTransaction: (to: string, amount: number) => Promise<void>;
} {
  const [tonConnectUI] = useTonConnectUI();
  const wallet = useTonWallet();

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
    sendTransaction,
  };
}
