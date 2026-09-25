import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { vi } from 'vitest'
import { BrowserRouter as Router } from 'react-router-dom'
import BlogForm from './BlogForm'

test('blogform calls handler with correct details', async () => {
  const createBlog = vi.fn()
  const user = userEvent.setup()

  render(
    <Router>
      <BlogForm createBlog = {createBlog}/>
    </Router>
  )

  const titleInput = screen.getByLabelText('Title:')
  const authorInput = screen.getByLabelText('Author:')
  const urlInput = screen.getByLabelText('Url:')
  const createButton = screen.getByText('Create')

  await user.type(titleInput, 'Test Blog')
  await user.type(authorInput, 'Tester')
  await user.type(urlInput, 'url.com')

  await user.click(createButton)

  expect(createBlog.mock.calls).toHaveLength(1)
  expect(createBlog.mock.calls[0][0]).toEqual({
    title: 'Test Blog',
    author: 'Tester',
    url: 'url.com'
  })

})