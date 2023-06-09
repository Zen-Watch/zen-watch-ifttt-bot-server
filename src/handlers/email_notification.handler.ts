import { send_email_notification_logic } from "../logic/email_notification.logic";
import { INTERNAL_SERVER_ERROR, STATUS_OK } from "../utils/constants";

export async function handle_email_notification(body: any) {
    try {
        const result = await send_email_notification_logic(body);
        return { status: STATUS_OK, message: result };
      } catch (e: any) {
        return { status: INTERNAL_SERVER_ERROR, message: e.message };
      }
}
