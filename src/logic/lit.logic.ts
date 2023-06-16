import * as LitJsSdkNodeJs from "@lit-protocol/lit-node-client-nodejs";
import { fromString as uint8arrayFromString } from "uint8arrays/from-string";
import { ethers } from "ethers";
import * as siwe from "siwe";
import dotenv from "dotenv";
import { convert_lit_chain_to_alchemy_chain } from "../utils/util_methods";

dotenv.config();

/**
 * Sign a payload using Lit and Send Transactions using Alchemy Provider API
 * A function that signs & transmits a general ethereum transaction to the blockchain using Lit and Alchemy Provider API
 * @param body An object containing the necessary payload to trigger LIT Actions
 */
export async function sign_and_send_general_ethereum_txn_logic(body: any) {

  // Programmatically generate an AuthSig
  const privKey = process.env.PRIVATE_KEY!;
  const privKeyBuffer = uint8arrayFromString(privKey, "base16");
  const wallet = new ethers.Wallet(privKeyBuffer);

  const domain = body.domain;
  const origin = body.origin;
  const statement = body.statement;

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

  const litNodeClient = new LitJsSdkNodeJs.LitNodeClientNodeJs({
    litNetwork: "serrano",
  });

  await litNodeClient.connect();

  const signResult = await litNodeClient.executeJs({
    code: litActionCode,
    authSig,
    // all jsParams can be used anywhere in your litActionCode
    jsParams: {
      publicKey: body.publicKey,
      chain: body.chain,
      sigName: body.sigName,
      chainIdParam: body.chainIdParam,
      toAddressParam: body.toAddressParam,
      valueParam: body.valueParam,
      dataParam: body.dataParam,
      gasPriceParam: body.gasPriceParam,
      gasLimitParam: body.gasLimitParam,
    }
  });

  const tx = signResult.response;
  const txn_signature = signResult.signatures[body.sigName].signature;
  const serializedTx = ethers.utils.serializeTransaction(tx, txn_signature);

  // send the transaction to the blockchain
  const chain_name = convert_lit_chain_to_alchemy_chain(body.chain)

  const provider = new ethers.providers.AlchemyProvider(chain_name, process.env.ALCHEMY_API_KEY!);
  const sentTx = await provider.sendTransaction(serializedTx);
  // console.log("sentTx: ", sentTx);
  return sentTx;

}
