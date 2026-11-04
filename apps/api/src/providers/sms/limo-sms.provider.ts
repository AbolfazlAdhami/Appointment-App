import type { SmsProvider, SmsSendInput, SmsSendResult } from "./sms.provider";

interface LimoSmsResponse {
  Success?: boolean;
  Message?: string;
  MessageId?: string[];
}

export interface LimoSmsConfig {
  apiKey: string;
  senderNumber: string;
}

export class LimoSmsProvider implements SmsProvider {
  private readonly endpoint = "https://api.limosms.com/api/sendsms";

  constructor(private readonly config: LimoSmsConfig) {}

  async send(input: SmsSendInput): Promise<SmsSendResult> {
    const response = await fetch(this.endpoint, {
      method: "POST",

      headers: {
        "Content-Type": "application/json",
        ApiKey: this.config.apiKey,
      },

      body: JSON.stringify({
        Message: input.message,
        SenderNumber: this.config.senderNumber,
        MobileNumber: [input.to],
      }),

      signal: AbortSignal.timeout(10_000),
    });

    let result: LimoSmsResponse;

    try {
      result = (await response.json()) as LimoSmsResponse;
    } catch {
      throw new Error("LimoSMS returned an invalid response");
    }

    if (!response.ok) {
      throw new Error(`LimoSMS HTTP error: ${response.status}`);
    }

    if (result.Success !== true) {
      throw new Error(result.Message || "LimoSMS failed to send SMS");
    }

    return {
      messageIds: Array.isArray(result.MessageId) ? result.MessageId.filter((id): id is string => typeof id === "string") : [],

      providerMessage: result.Message,
    };
  }
}
