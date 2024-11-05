# @arifzyn/api

[![NPM version](https://img.shields.io/npm/v/@arifzyn/api.svg)](https://www.npmjs.com/package/@arifzyn/api)
[![License: MIT](https://img.shields.io/badge/License-MIT-blue.svg)](https://opensource.org/licenses/MIT)

Simple API Wrapper for [Arifzyn API](https://api.arifzyn.tech). This package provides an easy-to-use interface to interact with the API.

## Features

- Supports both **CommonJS** and **ES Modules**.
- Handles **GET** and **POST** requests.
- Supports custom query parameters and headers.
- **TypeScript** support with type definitions.

## Installation

Install via npm:

```bash
npm install @arifzyn/api
```

Or using yarn:

```bash
yarn add @arifzyn/api
```

## Usage

### Importing the Package

You can import the package in both CommonJS and ES module formats.

## CommonJS

```javascript
const API = require("@arifzyn/api");
```

## ES Modules

```javascript
import API from "@arifzyn/api";
```

## Example Usage

1. Initialize the API Wrapper

```javascript
const api = new API("https://api.arifzyn.tech", {
  apikey: "YOUR_API_KEY", // Optional, if your API requires an API key
});
```

2. GET Request Example

```javascript
api
  .get("/endpoint", { param1: "value1", param2: "value2" })
  .then((response) => {
    console.log("Response:", response);
  })
  .catch((error) => {
    console.error("Error:", error);
  });
```

3. POST Request Example

```javascript
api
  .post("/endpoint", { key1: "value1", key2: "value2" })
  .then((response) => {
    console.log("Response:", response);
  })
  .catch((error) => {
    console.error("Error:", error);
  });
```

4. GET Feature By Category

```javascript
api
  .list("ai")
  .then((response) => {
    console.log("Response:", response);
  })
  .catch((error) => {
    console.error("Error:", error);
  });
```

# API Documentation

## Constructor

### `new API(baseURL: string, options?: APIOptions)`

- **`baseURL`**: Base URL for the API (e.g., `https://api.arifzyn.tech`).
- **`options`**: Optional configuration, including API key and custom headers.

## Methods

### `get(path: string, query?: Record<string, any>, options?: AxiosRequestConfig): Promise<any | Buffer | APIResponse>`

- **`path`**: Endpoint path (e.g., `/ai/animediff`).
- **`query`**: Query parameters as an object.
- **`options`**: Additional Axios configuration options.
- **Returns**: API response or buffer (in case of binary data).

### `post(path: string, data?: Record<string, any>, options?: AxiosRequestConfig): Promise<any | Buffer | APIResponse>`

- **`path`**: Endpoint path.
- **`data`**: Data payload for the request.
- **`options`**: Additional Axios configuration options.
- **Returns**: API response or buffer.

## Configuration

To use the package with TypeScript, make sure you have the necessary type definitions. The package includes a `@types` folder with `index.d.ts`.

## Contributing

If you'd like to contribute, please fork the repository and use a feature branch. Pull requests are warmly welcome.

## License

This project is licensed under the MIT License - see the LICENSE file for details.

## Issues

For any issues, please open a GitHub issue.

---

**Note**: This wrapper is developed and maintained by Arifzyn19. For API-related issues or usage, please refer to the official documentation or contact support.

---

### Additional Information:

- **Badge** in the README header adds a professional touch, showing license and version info.
- **Usage** section provides examples for importing and using the package.
- **API Documentation** gives a brief explanation of parameters in each method.
- **Contributing** and **License** sections make it easy for others to contribute or understand usage permissions.

Feel free to customize this README as needed or add more details if required.

### Thanks To

A huge thank you to [neoxr on GitHub](https://github.com/neoxr). Your work has been a true source of inspiration and guidance. The quality and creativity of your contributions have pushed me to think bigger and aim higher in my own projects. Thank you for sharing your talent and insights with the AR-API impact is greatly appreciated.
