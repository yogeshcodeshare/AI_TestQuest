import { test, expect } from '@playwright/test'

test.describe('Authentication', () => {
  test('should display login page', async ({ page }) => {
    await page.goto('/login')
    
    await expect(page.getByRole('heading', { name: 'Welcome back' })).toBeVisible()
    await expect(page.getByPlaceholder('you@example.com')).toBeVisible()
    await expect(page.getByRole('button', { name: /send magic link/i })).toBeVisible()
  })

  test('should display register page', async ({ page }) => {
    await page.goto('/register')
    
    await expect(page.getByRole('heading', { name: 'Create your account' })).toBeVisible()
    await expect(page.getByPlaceholder('John Doe')).toBeVisible()
    await expect(page.getByPlaceholder('you@example.com')).toBeVisible()
  })

  test('should navigate from landing to login', async ({ page }) => {
    await page.goto('/')
    
    await page.getByRole('link', { name: /sign in/i }).click()
    
    await expect(page).toHaveURL('/login')
  })

  test('should show validation error for invalid email', async ({ page }) => {
    await page.goto('/login')
    
    await page.getByPlaceholder('you@example.com').fill('invalid-email')
    await page.getByRole('button', { name: /send magic link/i }).click()
    
    // HTML5 validation should prevent form submission
    await expect(page).toHaveURL('/login')
  })
})

test.describe('Landing Page', () => {
  test('should display landing page with key elements', async ({ page }) => {
    await page.goto('/')
    
    await expect(page.getByRole('heading', { name: /become an sdet/i })).toBeVisible()
    await expect(page.getByText(/free forever/i)).toBeVisible()
    await expect(page.getByRole('button', { name: /start learning free/i })).toBeVisible()
    
    // Check for learning tracks section
    await expect(page.getByRole('heading', { name: /learning tracks/i })).toBeVisible()
  })

  test('should navigate to register from CTA button', async ({ page }) => {
    await page.goto('/')
    
    await page.getByRole('button', { name: /start learning free/i }).first().click()
    
    await expect(page).toHaveURL('/register')
  })
})

test.describe('Protected Routes', () => {
  test('should redirect to login when accessing dashboard unauthenticated', async ({ page }) => {
    await page.goto('/dashboard')
    
    // Should redirect to login
    await expect(page).toHaveURL(/login/)
  })

  test('should redirect to login when accessing mission unauthenticated', async ({ page }) => {
    await page.goto('/mission')
    
    await expect(page).toHaveURL(/login/)
  })
})
