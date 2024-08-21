import React from 'react';

function Post({ title, summary, content, cover, author }) {
  console.log('Post data received:', { title, summary, content, cover, author });

  // Determine the file extension
  const fileExtension = cover ? cover.split('.').pop().toLowerCase() : null;
  const isImage = fileExtension && ['jpg', 'jpeg', 'png', 'gif'].includes(fileExtension);

  return (
    <div className="post-card">
      <div className="post-card-header">
        <h2>{title}</h2>
        <p className="author">By {author?.username || 'Unknown author'}</p>
      </div>

      {cover && isImage && <img src={`http://localhost:4000/${cover}`} alt={title} className="post-image" />}

      {cover && !isImage && (
        <a href={`http://localhost:4000/${cover}`} download className="file-link">
          Download {fileExtension.toUpperCase()} File
        </a>
      )}

      <div className="post-card-body">
        <p>{summary}</p>
        <div dangerouslySetInnerHTML={{ __html: content }} />
      </div>
    </div>
  );
}

export default Post;
