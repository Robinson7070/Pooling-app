// #File: app/create-poll/page.tsx
// #Docs: This test verifies the end-to-end flow of creating a new poll

import { test, expect } from '@playwright/test';

test.describe('Create Poll Flow', () => {
  test.beforeEach(async ({ page }) => {
    // Mock authentication
    await page.route('**/supabase/auth/**', async (route) => {
      await route.fulfill({
        status: 200,
        body: JSON.stringify({
          user: {
            id: 'test-user-id',
            email: 'test@example.com'
          },
          session: {
            access_token: 'fake-token'
          }
        })
      });
    });

    // Navigate to the create poll page
    await page.goto('/create-poll');
  });

  test('should create a new poll successfully', async ({ page }) => {
    // Fill in the poll title
    await page.fill('input[name="title"]', 'My E2E Test Poll');
    
    // Fill in the description
    await page.fill('textarea[name="description"]', 'This is a test poll created during E2E testing');
    
    // Fill in the first option
    await page.fill('input[name="option-0"]', 'Option One');
    
    // Add another option
    await page.click('button:has-text("Add Option")');
    
    // Fill in the second option
    await page.fill('input[name="option-1"]', 'Option Two');
    
    // Mock the API response for creating a poll
    await page.route('**/supabase/rest/v1/polls**', async (route) => {
      await route.fulfill({
        status: 201,
        body: JSON.stringify({
          id: 'new-poll-id',
          title: 'My E2E Test Poll',
          description: 'This is a test poll created during E2E testing',
          user_id: 'test-user-id',
          created_at: new Date().toISOString()
        })
      });
    });
    
    // Mock the API response for creating poll options
    await page.route('**/supabase/rest/v1/poll_options**', async (route) => {
      await route.fulfill({
        status: 201,
        body: JSON.stringify([
          { id: 'option-1-id', text: 'Option One', poll_id: 'new-poll-id', votes: 0 },
          { id: 'option-2-id', text: 'Option Two', poll_id: 'new-poll-id', votes: 0 }
        ])
      });
    });
    
    // Submit the form
    await page.click('button:has-text("Create Poll")');
    
    // Verify redirect to the polls page
    await expect(page).toHaveURL(/\/polls/);
    
    // Verify success message
    await expect(page.locator('text=Poll created successfully')).toBeVisible();
  });

  test('should show validation errors for invalid inputs', async ({ page }) => {
    // Submit without filling any fields
    await page.click('button:has-text("Create Poll")');
    
    // Verify validation errors
    await expect(page.locator('text=Title is required')).toBeVisible();
    await expect(page.locator('text=Description is required')).toBeVisible();
    await expect(page.locator('text=At least one option is required')).toBeVisible();
    
    // Fill in title with too few characters
    await page.fill('input[name="title"]', 'Short');
    
    // Verify minimum length validation
    await expect(page.locator('text=Title must be at least')).toBeVisible();
  });
});