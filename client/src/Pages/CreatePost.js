import React from 'react'

function CreatePost() {
  return (
   <form id='form'>
    <input type='title' placeholder={'Tittle'}/>
    <input type ="summary" placeholder={'summary'}/>
    <input type='file'/>
    <textarea />
   </form>
  )
}

export default CreatePost