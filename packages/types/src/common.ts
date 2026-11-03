export type ID = string;

/** ISO 8601 datetime returned by the API. */
export type DateTimeString = string;

/** Date-only value: YYYY-MM-DD */
export type DateString = string;

/** Prisma Decimal serialized as a JSON string. */
export type DecimalString = string;

/** JSON-compatible value. */
export type JsonValue = string | number | boolean | null | JsonValue[] | { [key: string]: JsonValue };

export interface Timestamped {
  createdAt: DateTimeString;
  updatedAt: DateTimeString;
}

export interface SelectOption<T extends string = string> {
  label: string;
  value: T;
}

export interface FileAssetSummary {
  id: ID;
  originalName: string;
  mimeType: string;
  sizeBytes: string;
  isPrivate: boolean;
  createdAt: DateTimeString;
}
