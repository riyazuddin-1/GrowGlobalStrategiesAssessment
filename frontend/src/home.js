import { useEffect, useState } from "react";
const cryptoJS = require("crypto-js");
const configs = require("./config.json");

const Home = ({authCred}) => {
    const [blogs, setBlogs] = useState(null);
    const [myBlogs, setMyBlogs] = useState(false);
    const [fullAccess, setFullAccess] = useState(false);

    // Getting the blogs
    useEffect(() => {
        var data = {user: ''};
        if(myBlogs) {
            const bytesString = cryptoJS.AES.decrypt(authCred, configs.EncryptionKey).toString(cryptoJS.enc.Utf8);
            const userInfo = JSON.parse(bytesString);
            data['user'] = userInfo.email;
            setFullAccess(true);
        } else {
            setFullAccess(false);
        }
        fetch(`${configs.backend_server}/allBlogs`, {
            method: 'POST',
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify(data)
        }).then( async (response) => {
            if(response.ok) {
                const received = await response.json();
                setBlogs(received);
            }
        })
    }, [myBlogs])

    // Alert for messages/errors
    function showMessage(message) {
        const msgField = document.getElementById('msgField');
        msgField.innerHTML = message;
        msgField.style.display = 'block';
        setTimeout(() => {
            msgField.style.display = 'none';
        }, 5000);
    }

    // Blog filter toggle
    function handleBlogs() {
        const blogSelector = document.getElementById('blogSelect');
        if(blogSelector.value == 'my') {
            setMyBlogs(true);
        } else {
            setMyBlogs(false);
        }
    }

    // Deleting the blogs
    function deleteHandler(id) {
        const newBlogs = blogs.filter(blog => blog._id != id);
        setBlogs(newBlogs);
        fetch(`${configs.backend_server}/deleteBlog`, {
            method: 'POST',
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify({ id: id })
        }).then(()=>{
            showMessage('Blog deleted');
        })
    }

    return (
        <div className="home">
            <p id='msgField'></p>

            {/* If not authorized */}
            {!authCred && <>
            <h1>Login to view content</h1>
            <a href='/login'>Login</a>
            </>}

            {/* If authorized */}
            {authCred && <>
            <select name="blogs" id="blogSelect" onChange={()=>handleBlogs()}>
                <option value="all" defaultValue>All Blogs</option>
                <option value="my">My Blogs</option>
            </select>

            {/* Rendering the blogs */}
            { blogs && <div>
                {blogs.map((blog) => (
                    <div className="component blogPreview" key={blog._id}>
                        <p><b>{blog.Title}</b></p>
                        <p>{blog.Content}</p>
                        <button id="visit" onClick={()=> window.location = '/blog/'+blog._id}>➡️</button>
                        { fullAccess && <div className="blogOperations">
                            <button style={{color: 'black'}} onClick={()=>window.location = '/edit/'+blog._id}>edit</button>
                            <button style={{color: 'red'}} onClick={()=> deleteHandler(blog._id)}>delete</button>
                        </div>}
                    </div>
                ))}
            </div>}
            <button className='blogPen' onClick={() => window.location = '/edit'}><img src='../pen.svg'/> Write a blog</button>
            </>}
        </div>
    );
}
 
export default Home;