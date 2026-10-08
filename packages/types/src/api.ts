export interface PaginationMetadata {
  page: number;
  limit: number;
  total: number;
  totalPages: number;
}

export interface ApiMetadata {
  success: boolean;
  message?: string;
  timestamp: string;
  pagination?: PaginationMetadata;
}

export interface ApiResponse<T> {
  data: T;
  metadata: ApiMetadata;
}
