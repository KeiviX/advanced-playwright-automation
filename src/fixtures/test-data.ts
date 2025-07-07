import { User, Product } from '../types';

export class TestDataFactory {
  static createUser(overrides: Partial<User> = {}): User {
    return {
      id: `user_${Date.now()}`,
      email: `test.user.${Date.now()}@example.com`,
      firstName: 'Test',
      lastName: 'User',
      password: 'TestPassword123!',
      ...overrides
    };
  }

  static createProduct(overrides: Partial<Product> = {}): Product {
    return {
      id: `product_${Date.now()}`,
      name: 'Test Product',
      price: 29.99,
      description: 'A test product for automation testing',
      category: 'Electronics',
      imageUrl: 'https://via.placeholder.com/300x300',
      inStock: true,
      ...overrides
    };
  }

  static getValidUsers(): User[] {
    return [
      this.createUser({
        email: 'john.doe@example.com',
        firstName: 'John',
        lastName: 'Doe'
      }),
      this.createUser({
        email: 'jane.smith@example.com',
        firstName: 'Jane',
        lastName: 'Smith'
      })
    ];
  }

  static getInvalidUsers(): Partial<User>[] {
    return [
      { email: 'invalid-email', password: 'short' },
      { email: '', password: '' },
      { email: 'test@example.com', password: '' },
      { email: '', password: 'ValidPassword123!' }
    ];
  }

  static getTestProducts(): Product[] {
    return [
      this.createProduct({
        name: 'Laptop',
        price: 999.99,
        category: 'Electronics'
      }),
      this.createProduct({
        name: 'Coffee Mug',
        price: 15.99,
        category: 'Home & Kitchen'
      }),
      this.createProduct({
        name: 'Running Shoes',
        price: 89.99,
        category: 'Sports'
      })
    ];
  }

  static getSearchTerms(): string[] {
    return [
      'laptop',
      'coffee',
      'shoes',
      'electronics',
      'nonexistent-product-xyz'
    ];
  }
}