const { test, expect, beforeEach, describe } = require('@playwright/test')

describe('Blog app', () => {
  beforeEach(async ({ page, request }) => {
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
    await page.getByRole('link', { name: 'login' }).click()
    await expect(page.getByText('Log in to application')).toBeVisible()
    await expect(page.getByLabel('username')).toBeVisible()
    await expect(page.getByLabel('password')).toBeVisible()
    await expect(page.getByRole('button', { name: 'login' })).toBeVisible()
  })

  describe('Login', () => {
    test('succeeds with correct credentials', async ({ page }) => {
      await page.getByRole('link', { name: 'login' }).click()
      await page.getByLabel('username').fill('nick')
      await page.getByLabel('password').fill('password')
      await page.getByRole('button', { name: 'login' }).click()

      await expect(page.getByText('Login Successful')).toBeVisible()
    })

    test('fails with wrong credentials', async ({ page }) => {
      await page.getByRole('link', { name: 'login' }).click()
      await page.getByLabel('username').fill('nick')
      await page.getByLabel('password').fill('wrongpassword')
      await page.getByRole('button', { name: 'login' }).click()

      const errorDiv = page.locator('.error')

      await expect(errorDiv).toContainText('Wrong username or password')
      await expect(errorDiv).toHaveCSS('border-style', 'solid')
      await expect(errorDiv).toHaveCSS('color', 'rgb(255, 0, 0)')

      await expect(
        page.getByText('Login Successful')
      ).not.toBeVisible()
    })
  })


  describe('When logged in', () => {
    beforeEach(async ({ page }) => {
      await page.getByRole('link', { name: 'login' }).click()
      await page.getByLabel('username').fill('nick')
      await page.getByLabel('password').fill('password')
      await page.getByRole('button', { name: 'login' }).click()
    })

    test('a new blog can be created', async ({ page }) => {
      await page.getByRole('link', { name: 'create new' }).click()
      await page.getByLabel('Title:').fill('Test Blog')
      await page.getByLabel('Author:').fill('Tester')
      await page.getByLabel('Url:').fill('https://example.com')

      await page.getByRole('button', { name: 'Create' }).click()

      const successDiv = page.locator('.success')
      await expect(successDiv).toContainText('A new blog Test Blog by Tester added')
      await expect(successDiv).toHaveCSS('border-style', 'solid')
      await expect(successDiv).toHaveCSS('color', 'rgb(0, 128, 0)')

      await expect(page.getByText('Test Blog Tester')).toBeVisible()
    })

    describe('+ a blog exists', () => {
      beforeEach(async({page}) => {
        await page.getByRole('link', { name: 'create new' }).click()
        await page.getByLabel('Title:').fill('Test Blog')
        await page.getByLabel('Author:').fill('Tester')
        await page.getByLabel('Url:').fill('https://example.com')
        await page.getByRole('button', { name: 'Create' }).click()
      }) 

      test('blogs can be liked', async ({page}) => {
        await page.getByRole('link', { name: /Test Blog/ }).click()
        await expect(page.getByText('likes 0')).toBeVisible()

        await page.getByRole('button', {name: 'like'}).click()
        await expect(page.getByText('likes 1')).toBeVisible()
      })

      test('user who created blog can delete it', async ({page}) => {
        page.on('dialog', async (dialog) => {
          await dialog.accept()
        })

        await page.getByRole('link', { name: /Test Blog/ }).click()
        await page.getByRole('button', {name: 'remove'}).click()

        const successDiv = page.locator('.success')
        await expect(successDiv).toContainText('Deleted blog successfully')  
        await expect(page.getByText('Test Blog Tester')).not.toBeVisible()
      })
    })
  })
})