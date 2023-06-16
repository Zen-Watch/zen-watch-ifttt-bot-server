import { sign_and_send_general_ethereum_txn_logic } from "../logic/lit.logic";
import { INTERNAL_SERVER_ERROR, STATUS_OK } from "../utils/constants";

export async function handle_sign_and_send_general_ethereum_txn_payload(body: any) {
    try {
        const result = await sign_and_send_general_ethereum_txn_logic(body);
        return { status: STATUS_OK, message: result };
      } catch (e: any) {
        return { status: INTERNAL_SERVER_ERROR, message: e.message };
      }
}
