//import ReactQuill from "react-quill";
import 'react-quill/dist/quill.snow.css';
import { useState } from "react";
import { Navigate } from "react-router-dom";
import Editor from "../Components/Editor";

export default function CreatePost() {
  const [title, setTitle] = useState('');
  const [summary, setSummary] = useState('');
  const [content, setContent] = useState('');
  const [files, setFiles] = useState(null);  // Set to null initially
  const [redirect, setRedirect] = useState(false);

  async function createNewPost(ev) {
    ev.preventDefault();
    const data = new FormData();
    data.set('title', title);
    data.set('summary', summary);
    data.set('content', content);

    if (files && files.length > 0) {  // Ensure file is available
      data.set('file', files[0]);
    } else {
      console.error('No file selected');
    }

    try {
      const response = await fetch('http://localhost:4000/post', {
        method: 'POST',
        body: data,
        credentials: 'include',
      });

      if (response.ok) {
        setRedirect(true);
      } else {
        console.error('Failed to create post:', response.statusText);
      }
    } catch (error) {
      console.error('An error occurred:', error);
    }
  }

  if (redirect) {
    return <Navigate to={'/'} />;
  }

  return (
    <form onSubmit={createNewPost}>
      <input 
        type="text" 
        placeholder="Title" 
        value={title} 
        onChange={ev => setTitle(ev.target.value)} 
      />
      <input 
        type="text" 
        placeholder="Summary" 
        value={summary} 
        onChange={ev => setSummary(ev.target.value)} 
      />
      <input 
        type="file" 
        onChange={ev => setFiles(ev.target.files)} 
      />
      <Editor value={content} onChange={setContent} />
      <button style={{ marginTop: '5px' }}>Create post</button>
    </form>
  );
}
