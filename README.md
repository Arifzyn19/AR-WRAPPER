# Arifzyn API Client

A TypeScript/JavaScript client for the Arifzyn API, providing a simple and intuitive way to interact with all Arifzyn API endpoints.

## Installation

```bash
npm install @arifzyn/api
```

## Quick Start

```typescript
import { ArifzynAPI } from '@arifzyn/api';

// Initialize the client
const api = new ArifzynAPI({
  baseURL: 'https://api.arifzyn.site', // optional
  apiKey: 'YOUR_API_KEY', // optional
  timeout: 30000 // optional
});

// Make API calls
async function example() {
  const response = await api.get('ai/alicia', {
    text: 'Hello!'
  });
  console.log(response.result);
}
```

## Features

- Full TypeScript support
- Support for all HTTP methods (GET, POST, PUT, DELETE)
- Built-in endpoint filtering by category
- Automatic error handling
- Configurable base URL and API key
- File upload support

## Configuration

```typescript
interface ArifzynConfig {
  baseURL?: string;    // API base URL (default: 'https://api.arifzyn.site')
  apiKey?: string;     // Your API key if required
  timeout?: number;    // Request timeout in milliseconds (default: 30000)
}
```

## API Methods

### Making Requests

```typescript
// Using helper methods
await api.get(endpoint, params);
await api.post(endpoint, data);
await api.put(endpoint, data);
await api.delete(endpoint);

// Using generic call method
await api.call(endpoint, method, data);
```

### Endpoint Management

```typescript
// Get all available endpoints
const endpoints = await api.getEndpoints();

// Get endpoints by category
const aiEndpoints = await api.getEndpointsByCategory('ai');

// Get list of available categories
const categories = await api.getCategories();
```

## Examples

### Basic Usage

```typescript
// GET request
const aliciaResponse = await api.get('ai/alicia', {
  text: 'Hello!'
});

// POST request
const postResponse = await api.post('some/endpoint', {
  data: 'value'
});
```

### File Upload

```typescript
const formData = new FormData();
formData.append('file', fileObject);

const uploadResponse = await api.post('upload/endpoint', formData);
```

### Error Handling

```typescript
try {
  const response = await api.get('some/endpoint');
} catch (error) {
  console.error('API Error:', error.message);
}
```

## Response Type

```typescript
interface ApiResponse<T = any> {
  creator: string;
  status: number;
  result: T;
}
```

## Endpoint Type

```typescript
interface Endpoint {
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
```

## Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

## License

MIT License

## Credits

Created by @arifzyn.site

## Support

For support, please open an issue on the GitHub repository or contact the maintainers.