import { ethers } from "ethers";
import { batchTransfer } from ".";

// rpcProvider = your Ethereum RPC
const provider = new ethers.providers.JsonRpcProvider(process.env?.rpcProvider);

// privateKey = your Ethereum Private key
const wallet = new ethers.Wallet(process.env?.privateKey as string, provider);

batchTransfer(wallet, "0x9db5a2e59de2ad5af10276ff9b9998495a0b54d7", [
  {
    to: "0x9dd18754F77d39B8640C436e8a9Ea4cAca411E96",
    amount: "10000",
  },
  {
    to: "0x9dd18754F77d39B8640C436e8a9Ea4cAca411E96",
    amount: "20000",
  },
]).then((hash) => {
  console.info(`Go to https://rinkeby.etherscan.io/tx/${hash} for more detail`);
  process.exit(0);
});
