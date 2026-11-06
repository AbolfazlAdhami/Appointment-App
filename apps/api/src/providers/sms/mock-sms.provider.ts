import type { SmsProvider, SmsSendInput, SmsSendResult } from "./sms.provider";

export class MockSmsProvider implements SmsProvider {
  async send(input: SmsSendInput): Promise<SmsSendResult> {
    if (!input.to || !input.message) {
      throw new Error("Mock SMS requires a destination and message");
    }

    return {
      messageIds: [],
      providerMessage: "Mock SMS accepted",
    };
  }
}
