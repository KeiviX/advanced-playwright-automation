import { Page, Locator } from '@playwright/test';
import { BasePage } from '../utils/base-page';

export class LoginPage extends BasePage {
  private readonly emailInput: Locator;
  private readonly passwordInput: Locator;
  private readonly loginButton: Locator;
  private readonly forgotPasswordLink: Locator;
  private readonly signupLink: Locator;
  private readonly errorMessage: Locator;
  private readonly successMessage: Locator;
  private readonly rememberMeCheckbox: Locator;
  private readonly showPasswordButton: Locator;

  constructor(page: Page) {
    super(page, '/login');
    // Try multiple selectors to be more flexible with different demo sites
    this.emailInput = page.locator('[data-testid="email-input"], input[type="email"], input[name="email"], #email, .email-input').first();
    this.passwordInput = page.locator('[data-testid="password-input"], input[type="password"], input[name="password"], #password, .password-input').first();
    this.loginButton = page.locator('[data-testid="login-button"], button[type="submit"], input[type="submit"], button:has-text("Login"), button:has-text("Sign In")').first();
    this.forgotPasswordLink = page.locator('[data-testid="forgot-password-link"], a:has-text("Forgot"), a:has-text("Reset")').first();
    this.signupLink = page.locator('[data-testid="signup-link"], a:has-text("Sign Up"), a:has-text("Register")').first();
    this.errorMessage = page.locator('[data-testid="error-message"], .error, .alert-error, .error-message').first();
    this.successMessage = page.locator('[data-testid="success-message"], .success, .alert-success, .success-message').first();
    this.rememberMeCheckbox = page.locator('[data-testid="remember-me-checkbox"], input[type="checkbox"][name*="remember"], #remember').first();
    this.showPasswordButton = page.locator('[data-testid="show-password-button"], button:has-text("Show"), .show-password').first();
  }

  async login(email: string, password: string, rememberMe: boolean = false): Promise<void> {
    try {
      await this.fillInput(this.emailInput, email);
      await this.fillInput(this.passwordInput, password);
      
      if (rememberMe && await this.isVisible(this.rememberMeCheckbox)) {
        await this.clickElement(this.rememberMeCheckbox);
      }
      
      await this.clickElement(this.loginButton);
    } catch (error) {
      console.log('Login form elements not found on this page, this may be expected for demo sites');
      throw error;
    }
  }

  async navigateToForgotPassword(): Promise<void> {
    await this.clickElement(this.forgotPasswordLink);
  }

  async navigateToSignup(): Promise<void> {
    await this.clickElement(this.signupLink);
  }

  async getErrorMessage(): Promise<string> {
    if (await this.isVisible(this.errorMessage)) {
      return await this.getText(this.errorMessage);
    }
    return '';
  }

  async getSuccessMessage(): Promise<string> {
    if (await this.isVisible(this.successMessage)) {
      return await this.getText(this.successMessage);
    }
    return '';
  }

  async togglePasswordVisibility(): Promise<void> {
    await this.clickElement(this.showPasswordButton);
  }

  async isLoginButtonEnabled(): Promise<boolean> {
    return await this.loginButton.isEnabled();
  }

  async clearForm(): Promise<void> {
    await this.emailInput.clear();
    await this.passwordInput.clear();
  }

  async validateEmailFormat(email: string): Promise<boolean> {
    await this.fillInput(this.emailInput, email);
    await this.emailInput.blur();
    
    const validationMessage = await this.emailInput.getAttribute('validationMessage');
    return validationMessage === null || validationMessage === '';
  }
}