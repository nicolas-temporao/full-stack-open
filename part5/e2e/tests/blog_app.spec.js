const { test, expect, beforeEach, describe } = require('@playwright/test')

describe('Blog app', () => {
  beforeEach(async ({ page }) => {
    await request.post('http://localhost:3003/api/testing/reset')

    await request.post('http://localhost:3003/api/users', {
        data: {
            name: 'Nick',
            username: 'nick',
            password: 'password'
        }
    })

    await page.goto('http://localhost:5173')
  })

  test('Login form is shown', async ({ page }) => {

    await expect(page.getByText('Log in to application')).toBeVisible()
    await expect(page.getByLabel('username')).toBeVisible()
    await expect(page.getByLabel('password')).toBeVisible()
    await expect(page.getByRole('button', { name: 'login' })).toBeVisible()
  })

  test('user can log in', async({page}) => {
    await page.getByLabel('username').fill('nick')
    await page.getByLabel('password').fill('password')
    await page.getByRole('button', { name: 'login' }).click()
    await expect(page.getByText('Nick logged in.')).toBeVisible()
  })

})