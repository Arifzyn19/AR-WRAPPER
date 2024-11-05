import { AxiosInstance } from "axios";

export interface APIOptions {
  apikey: string;
  headers?: Record<string, string>;
  [key: string]: any;
}

export interface APIResponse {
  status: number;
  [key: string]: any;
}

export interface Feature {
  name: string;
  path: string;
  parameters: string[];
  method: string;
  category: string;
}
