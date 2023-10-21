import { useState } from 'react';

const cryptoJS = require('crypto-js');
const configs = require("./config.json");

const Blogedit = ({authCred, blogId, title, content}) => {
    const [disable, setDisable] = useState(blogId ? false: true);

    // Verifying user authentication
    if(!authCred) {
        window.location = '/';
    } else {
        const bytesString = cryptoJS.AES.decrypt(authCred, configs.EncryptionKey).toString(cryptoJS.enc.Utf8);
        const userInfo = JSON.parse(bytesString);
    }

    // Handling form submit
    async function handleSubmit(e) {
        e.preventDefault();
        const form = e.currentTarget;
        var submitTo;
        if(blogId) {
            submitTo = `${configs.backend_server}/updateBlog`;
        } else {
            submitTo = `${configs.backend_server}/postBlog`;
        }
        // catching form data
        const formData = new FormData(form);

        // appending author credentials
        if(blogId) { formData.append('id', blogId) };
        formData.append('author', userInfo['name']);
        formData.append('authorId', userInfo['email']);
        const plainFormData = Object.fromEntries(formData.entries());
        const jsonDataString = JSON.stringify(plainFormData);

        // Submitting data to backend
        const response = await fetch(submitTo, {
            method: 'POST',
            headers: {
                "Content-Type": "application/json",
            },
            body: jsonDataString
        })
        // Checking if the submission was successful
        if(response.ok) {
            if(!blogId) {
                const result = await response.json();
                window.location = '/blog/' + result.insertedId;
            } else {
                window.location.reload();
            }
        }
    }

    // Disabling form submit if content is empty
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