export interface SmsSendInput {
  to: string;
  message: string;
}

export interface SmsSendResult {
  messageIds: string[];
  providerMessage?: string;
}

export interface SmsProvider {
  send(input: SmsSendInput): Promise<SmsSendResult>;
}
