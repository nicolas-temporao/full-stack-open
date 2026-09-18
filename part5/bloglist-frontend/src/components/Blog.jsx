import { useState } from 'react'

const Blog = ({ blog, handleLike, user, handleRemove }) => {
  const [visible, setVisible] = useState(false)

  const removePerm = blog.user?.username === user?.username

  const blogStyle = {
    paddingTop: 10,
    paddingLeft: 2,
    border: 'solid',
    borderWidth: 1,
    marginBottom: 5
  }

  return (
    <div className="blog" style={blogStyle}>
      <div>
        {blog.title} {blog.author}
        <button onClick={() => setVisible(!visible)}>
          {visible ? 'hide' : 'view'}
        </button>
      </div>

      {visible && (
        <div>
          <div>{blog.url}</div>
          <div>
            likes {blog.likes}
            <button onClick={() => handleLike(blog)}>
              like
            </button>
          </div>
          <div>added by {blog.user?.name}</div>
          {removePerm && (
            <button onClick={() => handleRemove(blog)}>
              remove
            </button>
          )}
        </div>
      )}
    </div>
  )
}

export default Blog