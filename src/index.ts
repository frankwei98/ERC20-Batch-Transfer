import { BigNumber, BigNumberish, ethers, utils } from "ethers";
import {
  TransactionReceipt,
  TransactionResponse,
} from "@ethersproject/abstract-provider";

import batchTransferAbi from "./contract/batchTransfer.json";
import IERC20ABI from "./contract/IERC20.json";

const provider = new ethers.providers.JsonRpcProvider(process.env?.rpcProvider);

const wallet = new ethers.Wallet(process.env?.privateKey as string, provider);

const BatchTransferContract = new ethers.Contract(
  "0x9bb3ea53aeb79fd4cfdd8da347672d47ae06edcf",
  batchTransferAbi,
  wallet
);

type Command = {
  to: string;
  amount: BigNumberish;
};

async function batchTransfer(token: string, commands: Command[]) {
  const Token = new ethers.Contract(token, IERC20ABI, wallet);
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

// batchTransfer("0x9db5a2e59de2ad5af10276ff9b9998495a0b54d7", [
//   {
//     to: "0x9dd18754F77d39B8640C436e8a9Ea4cAca411E96",
//     amount: "10000",
//   },
//   {
//     to: "0x9dd18754F77d39B8640C436e8a9Ea4cAca411E96",
//     amount: "20000",
//   },
// ]).then((hash) => {
//   console.info(`Go to https://rinkeby.etherscan.io/tx/${hash} for more detail`);
//   process.exit(0);
// });
