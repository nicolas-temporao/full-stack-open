import Blog from './Blog'

const BlogList = ({
  blogs,
  handleLike,
  user,
  handleRemove
}) => {
  return (
    <div>
      <h2>blogs</h2>

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