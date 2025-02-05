/*
 * Author : @arifzyn.site
 * Github : https://github.com/Arifzyn19
 */

import axios, { AxiosInstance, AxiosRequestConfig, AxiosResponse } from "axios";
import { ApiResponse, ArifzynConfig, Endpoint, HttpMethod } from "../Types";

export class ArifzynAPI {
  private client: AxiosInstance;
  private config: ArifzynConfig;

  constructor(config: ArifzynConfig = {}) {
    this.config = {
      baseURL: "https://api.arifzyn.site",
      timeout: 30000,
      ...config,
    }; 

    this.client = axios.create({
      baseURL: this.config.baseURL,
      timeout: this.config.timeout,
      headers: this.config.apiKey
        ? {
            "x-api-key": `${this.config.apiKey}`,
          }
        : undefined,
      responseType: 'arraybuffer',    
    });
  }

  /**
   * Detect response type from Axios response
   * @param response - Axios response object
   * @returns ResponseType - Returns type of response (buffer, json, text, etc)
   */
  private isBufferResponse(response: AxiosResponse): boolean {
    const contentType = response.headers['content-type'];
    return !contentType?.includes('application/json');
  }
  
  /**
   * Process response based on content type
   * @param response - Axios response object
   * @returns Processed response (Buffer or JSON)
   */
  private processResponse<T>(response: AxiosResponse): ApiResponse<T> | Buffer {
    if (this.isBufferResponse(response)) {
      return Buffer.from(response.data);
    }
    
    const textDecoder = new TextDecoder('utf-8');
    const jsonString = textDecoder.decode(response.data);
    return JSON.parse(jsonString);
  }
  
  /**
   * Universal method to call any endpoint with any HTTP method
   * @param endpoint - API endpoint path
   * @param method - HTTP method (GET, POST, etc)
   * @param data - Request data (body for POST/PUT, query params for GET)
   * @param config - Optional axios config
   */
  async call<T = any>(
    endpoint: string,
    method: HttpMethod = "GET",
    data?: Record<string, any>,
    config?: Partial<AxiosRequestConfig>,
  ): Promise<ApiResponse<T> | Buffer> {
    try {
      const path = endpoint.startsWith("/") ? endpoint.slice(1) : endpoint;

      const requestConfig: AxiosRequestConfig = {
        ...config,
        method,
        url: path,
        ...(method === "GET" ? { params: data } : { data }),
      };

      const response = await this.client.request(requestConfig);
      return this.processResponse<T>(response);
    } catch (error) {
      if (axios.isAxiosError(error)) {
        throw new Error(`API Error: ${error.message}`);
      }
      throw error;
    }
  }

  /**
   * Helper method for GET requests
   */
  async get<T = any>(
    endpoint: string,
    params?: Record<string, any>,
  ): Promise<ApiResponse<T> | Buffer> {
    return this.call(endpoint, "GET", params);
  }

  /**
   * Helper method for POST requests
   */
  async post<T = any>(
    endpoint: string,
    data?: Record<string, any>,
  ): Promise<ApiResponse<T> | Buffer> {
    return this.call(endpoint, "POST", data);
  }

  /**
   * Helper method for PUT requests
   */
  async put<T = any>(
    endpoint: string,
    data?: Record<string, any>,
  ): Promise<ApiResponse<T> | Buffer> {
    return this.call(endpoint, "PUT", data);
  }

  /**
   * Helper method for DELETE requests
   */
  async delete<T = any>(
    endpoint: string,
    params?: Record<string, any>,
  ): Promise<ApiResponse<T> | Buffer> {
    return this.call(endpoint, "DELETE", params);
  }

  /**
   * Get all endpoints
   */
  async getEndpoints(): Promise<Endpoint[]> {
    const response = await this.get<Endpoint[]>("endpoint");
    if (Buffer.isBuffer(response)) {
      throw new Error("Unexpected buffer response");
    }
    return response.result;
  }

  /**
   * Get endpoints filtered by category
   */
  async getEndpointsByCategory(category: string): Promise<Endpoint[]> {
    const endpoints = await this.getEndpoints();
    return endpoints.filter((endpoint) => endpoint.category === category);
  }

  /**
   * Get available categories
   */
  async getCategories(): Promise<string[]> {
    const endpoints = await this.getEndpoints();
    return [...new Set(endpoints.map((endpoint) => endpoint.category))];
  }
}
