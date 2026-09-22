import Blog from './Blog'
import BlogForm from './BlogForm'
import Togglable from './Togglable'

const BlogList = ({
  blogs,
  handleLike,
  user,
  handleRemove,
  handleNewBlog
}) => {
  return (
    <div>
      <h2>blogs</h2>

      {user && (
        <Togglable buttonLabel="create new blog">
          <BlogForm createBlog={handleNewBlog} />
        </Togglable>
      )}

      {blogs.map(blog =>
        <Blog
          key={blog.id}
          blog={blog}
          handleLike={handleLike}
          user={user}
          handleRemove={handleRemove}
        />
      )}
    </div>
  )
}

export default BlogList