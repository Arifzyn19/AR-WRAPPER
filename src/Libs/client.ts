/*
 * Author : @arifzyn.site
 * Github : https://github.com/Arifzyn19
 */

import axios, { AxiosInstance, AxiosRequestConfig, ResponseType } from "axios";
import { ApiResponse, ArifzynConfig, Endpoint, HttpMethod } from "../Types";
import { Readable } from "stream";

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
    });
  }

  /**
   * Detects if the endpoint is likely to return media content
   */
  private isMediaEndpoint(endpoint: string): boolean {
    const mediaExtensions = [
      '.jpg', '.jpeg', '.png', '.gif', '.mp4', 
      '.mp3', '.pdf', '.doc', '.docx', '.xls', 
      '.xlsx', '.zip', '.rar'
    ];
    return mediaExtensions.some(ext => 
      endpoint.toLowerCase().includes(ext) || 
      endpoint.toLowerCase().includes('download') ||
      endpoint.toLowerCase().includes('media')
    );
  }

  /**
   * Gets appropriate response type based on content type
   */
  private getResponseType(contentType?: string): ResponseType {
    if (!contentType) return 'json';
    
    if (contentType.includes('application/json')) return 'json';
    if (contentType.includes('text')) return 'text';
    if (contentType.includes('stream')) return 'stream';
    return 'arraybuffer';
  }

  /**
   * Universal method to call any endpoint with any HTTP method
   */
  async call<T = any>(
    endpoint: string,
    method: HttpMethod = "GET",
    data?: Record<string, any>,
    config?: Partial<AxiosRequestConfig>,
    returnBuffer: boolean = false
  ): Promise<ApiResponse<T> | Buffer> {
    try {
      const path = endpoint.startsWith("/") ? endpoint.slice(1) : endpoint;
      
      const isMedia = this.isMediaEndpoint(endpoint) || returnBuffer;
      
      const requestConfig: AxiosRequestConfig = {
        ...config,
        method,
        url: path,
        ...(method === "GET" ? { params: data } : { data }),
        responseType: isMedia ? 'arraybuffer' : 'json',
      };

      const response = await this.client.request(requestConfig);
      
      if (isMedia) {
        const contentType = response.headers['content-type'];
        
        if (contentType?.includes('application/json')) {
          const textDecoder = new TextDecoder('utf-8');
          return JSON.parse(textDecoder.decode(response.data));
        }
        
        return Buffer.from(response.data);
      }

      return response.data;
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
    returnBuffer: boolean = false
  ): Promise<ApiResponse<T> | Buffer> {
    return this.call(endpoint, "GET", params, undefined, returnBuffer);
  }

  /**
   * Helper method for POST requests with media upload support
   */
  async post<T = any>(
    endpoint: string,
    data?: Record<string, any> | FormData,
    returnBuffer: boolean = false
  ): Promise<ApiResponse<T> | Buffer> {
    const config: Partial<AxiosRequestConfig> = {};
    
    if (data instanceof FormData) {
      config.headers = {
        'Content-Type': 'multipart/form-data'
      };
    }
    
    return this.call(endpoint, "POST", data, config, returnBuffer);
  }

  /**
   * Helper method for PUT requests
   */
  async put<T = any>(
    endpoint: string,
    data?: Record<string, any>,
    returnBuffer: boolean = false
  ): Promise<ApiResponse<T> | Buffer> {
    return this.call(endpoint, "PUT", data, undefined, returnBuffer);
  }

  /**
   * Helper method for DELETE requests
   */
  async delete<T = any>(
    endpoint: string,
    params?: Record<string, any>,
    returnBuffer: boolean = false
  ): Promise<ApiResponse<T> | Buffer> {
    return this.call(endpoint, "DELETE", params, undefined, returnBuffer);
  }

  /**
   * Upload file using FormData
   */
  async uploadFile(
    endpoint: string,
    file: Buffer | string,
    filename: string,
    additionalData?: Record<string, any>
  ): Promise<ApiResponse<any>> {
    const formData = new FormData();
    
    // Add file to FormData
    if (file instanceof Buffer) {
      // Convert Buffer to Uint8Array for Blob creation
      const blob = new Blob([new Uint8Array(file)]);
      formData.append('file', blob, filename);
    } else {
      formData.append('file', file, filename);
    }
    
    // Add additional data if provided
    if (additionalData) {
      Object.entries(additionalData).forEach(([key, value]) => {
        formData.append(key, String(value));
      });
    }
    
    const response = await this.post(endpoint, formData);
    if ('result' in response) {
      return response as ApiResponse<any>;
    }
    throw new Error('Unexpected response format');
  }

  /**
   * Download file and return as Buffer
   */
  async downloadFile(endpoint: string): Promise<Buffer> {
    const response = await this.get(endpoint, undefined, true);
    if (response instanceof Buffer) {
      return response;
    }
    throw new Error('Failed to download file');
  }

  /**
   * Get all endpoints
   */
  async getEndpoints(): Promise<Endpoint[]> {
    const response = await this.get<Endpoint[]>("endpoint");
    if ('result' in response) {
      return response.result;
    }
    throw new Error('Unexpected response format');
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