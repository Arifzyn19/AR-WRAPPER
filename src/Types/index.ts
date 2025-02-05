export interface ApiResponse<T = any> {
  creator: string;
  status: number;
  result: T;
}

export interface Endpoint {
  category: string;
  base_code: string;
  name: string;
  path: string;
  example: Record<string, string>;
  parameters: string[];
  method: string;
  uri: string;
  files: boolean;
  error: boolean;
}

export interface ArifzynConfig {
  baseURL?: string;
  apiKey?: string;
  timeout?: number;
}

// HTTP Method type
export type HttpMethod = "GET" | "POST" | "PUT" | "DELETE" | "PATCH";
