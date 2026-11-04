import type { SmsProvider, SmsSendInput, SmsSendResult } from "./sms.provider";

export class MockSmsProvider implements SmsProvider {
  async send(input: SmsSendInput): Promise<SmsSendResult> {
    console.info("[MockSmsProvider] SMS generated", {
      to: input.to,
      message: input.message,
    });

    return {
      messageIds: [],
      providerMessage: "Mock SMS accepted",
    };
  }
}
