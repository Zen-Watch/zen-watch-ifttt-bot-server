import * as LitJsSdkNodeJs from "@lit-protocol/lit-node-client-nodejs";
import { fromString as uint8arrayFromString } from "uint8arrays/from-string";
import { ethers } from "ethers";
import * as siwe from "siwe";
import dotenv from "dotenv";

dotenv.config();

/**
 * A function that signs & transmits a general ethereum transaction to the blockchain using Lit and Alchemy Provider API
 * @param body An object containing the following properties:
 */
export async function sign_and_send_general_ethereum_txn_logic(body: any) {

  // Programmatically generate an AuthSig
  const privKey = process.env.PRIVATE_KEY!;
  const privKeyBuffer = uint8arrayFromString(privKey, "base16");
  const wallet = new ethers.Wallet(privKeyBuffer);

  const domain = "localhost";
  const origin = "https://localhost/login";
  const statement =
    "This is a test statement.  You can put anything you want here.";

  const siweMessage = new siwe.SiweMessage({
    domain,
    address: wallet.address,
    statement,
    uri: origin,
    version: "1",
    chainId: 1,
  });

  const messageToSign = siweMessage.prepareMessage();

  const signature = await wallet.signMessage(messageToSign);

  const recoveredAddress = ethers.utils.verifyMessage(messageToSign, signature);

  const authSig = {
    sig: signature,
    derivedVia: "web3.eth.personal.sign",
    signedMessage: messageToSign,
    address: recoveredAddress,
  };

  // this code will be run on the node
const litActionCode = `
  ${body.litActionCode}
`;

console.log('litActionCode: ', litActionCode);

  const litNodeClient = new LitJsSdkNodeJs.LitNodeClientNodeJs({
    litNetwork: "serrano",
  });

  await litNodeClient.connect();

  // input variables
  const publickey_var = "0x0443ccdc0178d2be400f45d3c69c96e6bbd6fb4b52f74408c0801db3a2c420db3f17eaa5e4ec44c625874a3a63ba738c6b1434c9c81e902644b025721bfbf922a9";
  const chain_var = "polygon";
  const sigName_var = "sig1";
  const chainIdParam_var = 137;
  const toAddressParam_var = "0xeE52f6E8F8F075Bb6119958c1ACeB16C788e57d6";
  const valueParam_var = "0x000001";
  const dataParam_var = "0x";
  const gasPriceParam_var = "0x2e90edd000";
  const gasLimitParam_var = "0x" + (30000).toString(16);

  console.log('gasLimitParam_var: ', gasLimitParam_var);

  const signResult = await litNodeClient.executeJs({
    code: litActionCode,
    authSig,
    // all jsParams can be used anywhere in your litActionCode
    jsParams: {
      publicKey: publickey_var,
      chain: chain_var,
      sigName: sigName_var,
      chainIdParam: chainIdParam_var,
      toAddressParam: toAddressParam_var,
      valueParam: valueParam_var,
      dataParam: dataParam_var,
      gasPriceParam: gasPriceParam_var || "0x2e90edd000",
      gasLimitParam: gasLimitParam_var || "0x" + (30000).toString(16),
    }
  });

  const tx = signResult.response;
  const txn_signature = signResult.signatures["sig1"].signature;
  const serializedTx = ethers.utils.serializeTransaction(tx, txn_signature);
  console.log("serializedTx: ", serializedTx);

  const provider = new ethers.providers.AlchemyProvider('matic', process.env.ALCHEMY_API_KEY!);
  const sentTx = await provider.sendTransaction(serializedTx);
  console.log("sentTx: ", sentTx);

}
