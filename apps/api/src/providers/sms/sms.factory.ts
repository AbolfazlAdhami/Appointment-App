import { env } from "../../config/env";

import { LimoSmsProvider } from "./limo-sms.provider";
import { MockSmsProvider } from "./mock-sms.provider";
import type { SmsProvider } from "./sms.provider";

export function createSmsProvider(): SmsProvider {
  if (env.smsProvider === "mock") {
    if (env.isProduction) {
      throw new Error("Mock SMS provider cannot be used in production");
    }

    return new MockSmsProvider();
  }

  if (env.smsProvider === "limo") {
    if (!env.limoSmsApiKey || !env.limoSmsSenderNumber) {
      throw new Error("LimoSMS API key and sender number are required");
    }

    return new LimoSmsProvider({
      apiKey: env.limoSmsApiKey,
      senderNumber: env.limoSmsSenderNumber,
    });
  }

  throw new Error("Unsupported SMS provider");
}
