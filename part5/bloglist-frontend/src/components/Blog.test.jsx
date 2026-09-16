import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import Blog from './Blog'

test('renders preview content only (title/author)', () => {
  const blog = {
    title: 'Learning Full Stack Development',
    author: 'Nick',
    url: 'https://example.com',
    likes: 7,
    user: {
      name: 'Nick',
      username: 'nick'
    }
  }
  render(<Blog blog={blog} />)

  const blogPreview = screen.getByText(/Learning Full Stack Development/)
  expect(blogPreview).toHaveTextContent('Learning Full Stack Development')
  expect(blogPreview).toHaveTextContent('Nick')

  expect(screen.queryByText('https://example.com')).toBeNull()
  expect(screen.queryByText(/likes 7/)).toBeNull()
})

test('clicking "view" renders URL and likes', async () => {
  const blog = {
    title: 'Learning Full Stack Development',
    author: 'Nick',
    url: 'https://example.com',
    likes: 7,
    user: {
      name: 'Nick',
      username: 'nick'
    }
  }

  render(<Blog blog={blog} />)

  const user = userEvent.setup()
  const button = screen.getByText('view')

  await user.click(button)

  expect(screen.getByText('https://example.com')).toBeDefined()
  expect(screen.getByText(/likes 7/)).toBeDefined()
})

test('clicking "like" twice calls handler twice', async () => {
  const blog = {
    title: 'Learning Full Stack Development',
    author: 'Nick',
    url: 'https://example.com',
    likes: 7,
    user: {
      name: 'Nick',
      username: 'nick'
    }
  }

  const mockHandler = vi.fn()

  render(<Blog blog={blog} handleLike={mockHandler} />)

  const user = userEvent.setup()
  const viewButton = screen.getByText('view')

  await user.click(viewButton)


  const likeButton = screen.getByText('like')
  await user.click(likeButton)
  await user.click(likeButton)

  expect(mockHandler.mock.calls).toHaveLength(2)
})