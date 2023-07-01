import { useState } from 'react';

var cryptoJS = require('crypto-js');

const Blogedit = ({authCred, blogId, title, content}) => {
    var [disable, setDisable] = useState(blogId ? false: true);
    if(!authCred) {
        window.location = '/';
    } else {
        var bytesString = cryptoJS.AES.decrypt(authCred, 'GiveMeJob').toString(cryptoJS.enc.Utf8);
        var userInfo = JSON.parse(bytesString);
    }
    async function handleSubmit(e) {
        e.preventDefault();
        const form = e.currentTarget;
        var submitTo;
        if(blogId) {
            submitTo = 'http://localhost:3333/updateBlog';
        } else {
            submitTo = 'http://localhost:3333/postBlog'
        }
        const formData = new FormData(form);
        if(blogId) { formData.append('id', blogId) };
        formData.append('author', userInfo['name']);
        formData.append('authorId', userInfo['email']);
        const plainFormData = Object.fromEntries(formData.entries());
        const jsonDataString = JSON.stringify(plainFormData);
        const response = await fetch(submitTo, {
            method: 'POST',
            headers: {
                "Content-Type": "application/json",
            },
            body: jsonDataString
        })
        if(response.ok) {
            if(!blogId) {
                const result = await response.json();
                window.location = '/blog/' + result.insertedId;
            } else {
                window.location.reload();
            }
        }
    }
    function handleContent(e) {
        if(e.target.value) {
            setDisable(false);
        } else {
            setDisable(true);
        }
    }
    return (
        <div>
            <form id="blogForm" onSubmit = {handleSubmit}>
                <label>Title:</label>
                <input type="text" placeholder="Blog title" name="title" defaultValue={title} required/>
                <label>Content:</label>
                <textarea form="blogForm" placeholder="Blog Content" name="content" defaultValue={content} onChange={handleContent}></textarea>
                <input type="submit" value='submit' id="submitBtn" disabled={disable}/>
            </form>
        </div>
    );
}
 
export default Blogedit;