import { useState } from 'react'
import { useNavigate } from 'react-router-dom'

const BlogForm = ({ createBlog }) => {
  const [title, setTitle] = useState('')
  const [author, setAuthor] = useState('')
  const [url, setUrl] = useState('')

  const navigate = useNavigate()

  const handleSubmit = (event) => {
    event.preventDefault()

    createBlog({
      title,
      author,
      url
    })

    setTitle('')
    setAuthor('')
    setUrl('')
    navigate('/')
  }

  return (
    <div>
      <h2>Create New Blog</h2>

      <form onSubmit={handleSubmit}>
        <div>
          <label>
            Title:
            <input
              type="text"
              value={title}
              onChange={({ target }) => setTitle(target.value)}
            />
          </label>
        </div>

        <div>
          <label>
            Author:
            <input
              type="text"
              value={author}
              onChange={({ target }) => setAuthor(target.value)}
            />
          </label>
        </div>

        <div>
          <label>
            Url:
            <input
              type="text"
              value={url}
              onChange={({ target }) => setUrl(target.value)}
            />
          </label>
        </div>

        <button type="submit">Create</button>
      </form>
    </div>
  )
}

export default BlogForm