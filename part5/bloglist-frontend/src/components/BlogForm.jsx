const BlogForm = ({
    title,
    author,
    url,
    handleTitleChange,
    handleAuthorChange, 
    handleUrlChange, 
    handleNewBlog
}) => {
   return ( 
        <div>
            <h2>Create New Blog</h2>
            <form onSubmit={handleNewBlog}>
            <div>
                <label>
                    Title:
                    <input
                        type="text"
                        value={title}
                        onChange={handleTitleChange}
                    />
                </label>
            </div>
            <div>
                <label>
                    Author:
                    <input
                        type="text"
                        value={author}
                        onChange={handleAuthorChange}
                    />
                </label>
            </div>
            <div>
                <label>
                    Url:
                    <input
                        type="text"
                        value={url}
                        onChange={handleUrlChange}
                    />
                </label>
            </div>
            <button type="submit">Create</button>
            </form>
        </div>
    ) 
}     
      
export default BlogForm