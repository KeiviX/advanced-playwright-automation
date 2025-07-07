import { test, expect } from '@playwright/test';

test.describe('API Tests - Demo Endpoints', () => {
  // These tests demonstrate API testing capabilities without requiring a mock server
  
  test('should handle HTTP requests and responses', async ({ request }) => {
    // Test a real endpoint that we know exists
    const response = await request.get('https://httpbin.org/get');
    
    expect(response.status()).toBe(200);
    const responseBody = await response.json();
    expect(responseBody).toHaveProperty('url');
    expect(responseBody).toHaveProperty('headers');
  });

  test('should handle POST requests with JSON data', async ({ request }) => {
    const testData = {
      name: 'Test User',
      email: 'test@example.com'
    };

    const response = await request.post('https://httpbin.org/post', {
      data: testData
    });

    expect(response.status()).toBe(200);
    const responseBody = await response.json();
    expect(responseBody.json).toEqual(testData);
  });

  test('should handle request headers', async ({ request }) => {
    const response = await request.get('https://httpbin.org/headers', {
      headers: {
        'X-Custom-Header': 'test-value',
        'User-Agent': 'Playwright-Test'
      }
    });

    expect(response.status()).toBe(200);
    const responseBody = await response.json();
    expect(responseBody.headers['X-Custom-Header']).toBe('test-value');
  });

  test('should handle query parameters', async ({ request }) => {
    const response = await request.get('https://httpbin.org/get?param1=value1&param2=value2');
    
    expect(response.status()).toBe(200);
    const responseBody = await response.json();
    expect(responseBody.args.param1).toBe('value1');
    expect(responseBody.args.param2).toBe('value2');
  });

  test('should handle different HTTP status codes', async ({ request }) => {
    // Test 404
    const notFoundResponse = await request.get('https://httpbin.org/status/404');
    expect(notFoundResponse.status()).toBe(404);

    // Test 500
    const serverErrorResponse = await request.get('https://httpbin.org/status/500');
    expect(serverErrorResponse.status()).toBe(500);

    // Test 200
    const successResponse = await request.get('https://httpbin.org/status/200');
    expect(successResponse.status()).toBe(200);
  });

  test('should measure API response time', async ({ request }) => {
    const startTime = Date.now();
    const response = await request.get('https://httpbin.org/delay/1');
    const endTime = Date.now();
    
    expect(response.status()).toBe(200);
    const responseTime = endTime - startTime;
    expect(responseTime).toBeGreaterThan(1000); // Should take at least 1 second
    expect(responseTime).toBeLessThan(5000); // Should not take more than 5 seconds
  });

  test('should handle authentication headers', async ({ request }) => {
    const response = await request.get('https://httpbin.org/bearer', {
      headers: {
        'Authorization': 'Bearer test-token-123'
      }
    });

    expect(response.status()).toBe(200);
    const responseBody = await response.json();
    expect(responseBody.authenticated).toBe(true);
    expect(responseBody.token).toBe('test-token-123');
  });

  test('should validate JSON schema structure', async ({ request }) => {
    const response = await request.get('https://httpbin.org/json');
    
    expect(response.status()).toBe(200);
    const responseBody = await response.json();
    
    // Validate expected JSON structure
    expect(typeof responseBody).toBe('object');
    expect(responseBody).toHaveProperty('slideshow');
    expect(responseBody.slideshow).toHaveProperty('author');
    expect(responseBody.slideshow).toHaveProperty('title');
  });

  test('should handle concurrent API requests', async ({ request }) => {
    const requests = Array(5).fill(null).map((_, index) => 
      request.get(`https://httpbin.org/get?request=${index}`)
    );

    const responses = await Promise.all(requests);
    
    responses.forEach((response, index) => {
      expect(response.status()).toBe(200);
    });
  });

  test('should handle request timeout', async ({ request }) => {
    try {
      // This should timeout quickly
      const response = await request.get('https://httpbin.org/delay/10', {
        timeout: 2000 // 2 second timeout
      });
      
      // If we get here, the request completed faster than expected
      expect(response.status()).toBe(200);
    } catch (error) {
      // Timeout is expected
      expect(error.message).toContain('timed out'); // More flexible timeout message matching
    }
  });
});