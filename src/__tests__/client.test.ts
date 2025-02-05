import axios from "axios";
import { ArifzynAPI } from "../Libs/client";
import { ApiResponse, Endpoint } from "../Types";

// Mock axios
jest.mock("axios");
const mockedAxios = axios as jest.Mocked<typeof axios>;

describe("ArifzynAPI", () => {
  let api: ArifzynAPI;

  beforeEach(() => {
    // Reset mocks before each test
    jest.clearAllMocks();

    // Create new instance with default config
    api = new ArifzynAPI({
      apiKey: "test-api-key",
    });
  });

  describe("constructor", () => {
    it("should create instance with default config", () => {
      const api = new ArifzynAPI();
      expect(mockedAxios.create).toHaveBeenCalledWith({
        baseURL: "https://api.arifzyn.site",
        timeout: 30000,
        headers: undefined,
      });
    });

    it("should create instance with custom config", () => {
      const api = new ArifzynAPI({
        baseURL: "https://api.arifzyn.site",
        timeout: 5000,
        apiKey: "secret-key",
      });

      expect(mockedAxios.create).toHaveBeenCalledWith({
        baseURL: "https://api.arifzyn.site",
        timeout: 5000,
        headers: {
          Authorization: "Bearer secret-key",
        },
      });
    });
  });

  describe("HTTP Methods", () => {
    const mockResponse: ApiResponse = {
      creator: "Arifzyn",
      status: 200,
      result: { data: "test" },
    };

    beforeEach(() => {
      mockedAxios.create.mockReturnValue({
        request: jest.fn().mockResolvedValue({ data: mockResponse }),
      } as any);
    });

    describe("GET requests", () => {
      it("should make GET request with params", async () => {
        const params = { key: "value" };
        const response = await api.get("/test", params);

        expect(response).toEqual(mockResponse);
        const axiosInstance = mockedAxios.create.mock.results[0].value;
        expect(axiosInstance.request).toHaveBeenCalledWith({
          method: "GET",
          url: "test",
          params,
        });
      });
    });

    describe("POST requests", () => {
      it("should make POST request with data", async () => {
        const data = { key: "value" };
        const response = await api.post("/test", data);

        expect(response).toEqual(mockResponse);
        const axiosInstance = mockedAxios.create.mock.results[0].value;
        expect(axiosInstance.request).toHaveBeenCalledWith({
          method: "POST",
          url: "test",
          data,
        });
      });
    });

    describe("PUT requests", () => {
      it("should make PUT request with data", async () => {
        const data = { key: "value" };
        const response = await api.put("/test", data);

        expect(response).toEqual(mockResponse);
        const axiosInstance = mockedAxios.create.mock.results[0].value;
        expect(axiosInstance.request).toHaveBeenCalledWith({
          method: "PUT",
          url: "test",
          data,
        });
      });
    });

    describe("DELETE requests", () => {
      it("should make DELETE request with params", async () => {
        const params = { id: "123" };
        const response = await api.delete("/test", params);

        expect(response).toEqual(mockResponse);
        const axiosInstance = mockedAxios.create.mock.results[0].value;
        expect(axiosInstance.request).toHaveBeenCalledWith({
          method: "DELETE",
          url: "test",
          params,
        });
      });
    });
  });

  describe("Endpoint methods", () => {
    const mockEndpoints: Endpoint[] = [
      {
        category: "test",
        base_code: "test",
        name: "Test Endpoint",
        path: "/test",
        example: { key: "value" },
        parameters: ["param1"],
        method: "GET",
        uri: "/test",
        files: false,
        error: false,
      },
    ];

    const mockResponse: ApiResponse<Endpoint[]> = {
      creator: "Arifzyn",
      status: 200,
      result: mockEndpoints,
    };

    beforeEach(() => {
      mockedAxios.create.mockReturnValue({
        request: jest.fn().mockResolvedValue({ data: mockResponse }),
      } as any);
    });

    describe("getEndpoints", () => {
      it("should fetch all endpoints", async () => {
        const endpoints = await api.getEndpoints();
        expect(endpoints).toEqual(mockEndpoints);
      });
    });

    describe("getEndpointsByCategory", () => {
      it("should filter endpoints by category", async () => {
        const endpoints = await api.getEndpointsByCategory("test");
        expect(endpoints).toEqual(mockEndpoints);
      });

      it("should return empty array for non-existing category", async () => {
        const endpoints = await api.getEndpointsByCategory("non-existing");
        expect(endpoints).toEqual([]);
      });
    });

    describe("getCategories", () => {
      it("should return unique categories", async () => {
        const categories = await api.getCategories();
        expect(categories).toEqual(["test"]);
      });
    });
  });

  describe("Error handling", () => {
    it("should handle axios errors", async () => {
      const errorMessage = "Network Error";
      mockedAxios.create.mockReturnValue({
        request: jest.fn().mockRejectedValue({
          isAxiosError: true,
          message: errorMessage,
        }),
      } as any);

      await expect(api.get("/test")).rejects.toThrow(
        `API Error: ${errorMessage}`,
      );
    });

    it("should handle non-axios errors", async () => {
      const error = new Error("Unknown error");
      mockedAxios.create.mockReturnValue({
        request: jest.fn().mockRejectedValue(error),
      } as any);

      await expect(api.get("/test")).rejects.toThrow(error);
    });
  });
});
