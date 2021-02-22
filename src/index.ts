import { BigNumber, BigNumberish, ethers, Wallet } from "ethers";
import {
  TransactionReceipt,
  TransactionResponse,
} from "@ethersproject/abstract-provider";

import batchTransferAbi from "./contract/batchTransfer.json";
import IERC20ABI from "./contract/IERC20.json";

type Command = {
  to: string;
  amount: BigNumberish;
};

export async function batchTransfer(
  wallet: Wallet,
  token: string,
  commands: Command[]
) {
  const Token = new ethers.Contract(token, IERC20ABI, wallet);
  const BatchTransferContract = new ethers.Contract(
    "0x9bb3ea53aeb79fd4cfdd8da347672d47ae06edcf",
    batchTransferAbi,
    wallet
  );
  let totalAmount = BigNumber.from(0);
  for (let i = 0; i < commands.length; i++) {
    const command = commands[i];
    console.info("amount: ", command.amount);
    totalAmount = totalAmount.add(command.amount);
  }
  console.info("totalAmount");
  const approveRequest: TransactionResponse = await Token.approve(
    BatchTransferContract.address,
    totalAmount
  );
  await approveRequest.wait(1);
  const transferRequest: TransactionResponse = await BatchTransferContract.batchTransfer(
    token,
    commands
  );
  const transferReceipt = await transferRequest.wait(1);
  return transferReceipt.transactionHash;
}

// Go to `run-local.ts` if you want to this script
