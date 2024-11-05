import axios, { AxiosRequestConfig, AxiosResponse } from "axios";
import FormData from "form-data";
import { APIOptions, APIResponse } from "./Types";

export class API {
  private URI: string;
  private apiKey?: string;

  constructor(baseURL: string, options?: APIOptions) {
    this.URI = baseURL;
    this.apiKey = options?.apikey;
  }

  async get(
    path: string = "/",
    query: Record<string, any> = {},
    options: AxiosRequestConfig = {},
  ): Promise<any | Buffer | APIResponse> {
    try {
      const params = {
        ...query,
        ...(this.apiKey ? { apikey: this.apiKey } : {}),
      };

      const res: AxiosResponse = await axios.get(`${this.URI}${path}`, {
        params,
        ...options,
        responseType: "arraybuffer",
      });

      if (res.headers["content-type"]?.includes("application/json")) {
        return JSON.parse(res.data.toString("utf-8"));
      }
      return Buffer.from(res.data);
    } catch (error) {
      console.error("GET request failed:", error);
      throw new Error("Failed to perform GET request");
    }
  }

  async post(
    path: string = "",
    data: Record<string, any> = {},
    options: AxiosRequestConfig = {},
  ): Promise<any | Buffer | APIResponse> {
    try {
      const form = new FormData();
      for (const key in data) {
        form.append(key, data[key]);
      }

      const params = {
        ...(this.apiKey ? { apikey: this.apiKey } : {}),
      };

      const res: AxiosResponse = await axios.post(
        `${this.URI}${path}`,
        form,
        { ...options, responseType: "arraybuffer", params }, // Send params directly
      );

      if (res.headers["content-type"]?.includes("application/json")) {
        return JSON.parse(res.data.toString("utf-8"));
      }
      return Buffer.from(res.data);
    } catch (error) {
      console.error("POST request failed:", error);
      throw new Error("Failed to perform POST request");
    }
  }
}
