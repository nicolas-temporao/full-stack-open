import { useParams, useNavigate } from 'react-router-dom'

const BlogDetails = ({ blog, handleLike, user, handleRemove }) => {
  if (!blog) {
    return null
  }

  const removePerm = blog.user?.username === user?.username

  return (
    <div>
      <h2>{blog.title}</h2>

      <div>{blog.url}</div>

      <div>
        likes {blog.likes}

        {user && (
          <button onClick={() => handleLike(blog)}>
            like
          </button>
        )}
      </div>

      <div>added by {blog.user?.name}</div>

      {removePerm && (
        <button onClick={() => handleRemove(blog)}>
          remove
        </button>
      )}
    </div>
  )
}

const BlogView = ({ blogs, handleLike, user, handleRemove }) => {
  const { id } = useParams()
  const navigate = useNavigate()

  const blog = blogs.find(blog => blog.id === id)

  if (!blog) {
    return null
  }

  const removeBlog = async () => {
    const removed = await handleRemove(blog)

    if (removed) {
      navigate('/')
    }
  }

  return (
    <BlogDetails
      blog={blog}
      handleLike={handleLike}
      user={user}
      handleRemove={removeBlog}
    />
  )
}

export { BlogDetails }
export default BlogView