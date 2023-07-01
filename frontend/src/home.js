import { useEffect, useState } from "react";
var cryptoJS = require("crypto-js");

const Home = ({authCred}) => {
    var [blogs, setBlogs] = useState(null);
    var [myBlogs, setMyBlogs] = useState(false);
    var [fullAccess, setFullAccess] = useState(false);
    useEffect(() => {
        var data = {user: ''};
        if(myBlogs) {
            var bytesString = cryptoJS.AES.decrypt(authCred, 'GiveMeJob').toString(cryptoJS.enc.Utf8);
            var userInfo = JSON.parse(bytesString);
            data['user'] = userInfo.email;
            setFullAccess(true);
        } else {
            setFullAccess(false);
        }
        fetch('http://localhost:3333/allBlogs', {
            method: 'POST',
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify(data)
        }).then( async (response) => {
            if(response.ok) {
                var received = await response.json();
                setBlogs(received);
            }
        })
    }, [myBlogs])
    function showMessage(message) {
        const msgField = document.getElementById('msgField');
        msgField.innerHTML = message;
        msgField.style.display = 'block';
        setTimeout(() => {
            msgField.style.display = 'none';
        }, 5000);
    }
    function handleBlogs() {
        var blogSelector = document.getElementById('blogSelect');
        if(blogSelector.value == 'my') {
            setMyBlogs(true);
        } else {
            setMyBlogs(false);
        }
    }
    function deleteHandler(id) {
        const newBlogs = blogs.filter(blog => blog._id != id);
        setBlogs(newBlogs);
        fetch('http://localhost:3333/deleteBlog', {
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
            {!authCred && <>
            <h1>Login to view content</h1>
            <a href='/login'>Login</a>
            </>}
            {authCred && <>
            <select name="blogs" id="blogSelect" onChange={()=>handleBlogs()}>
                <option value="all" defaultValue>All Blogs</option>
                <option value="my">My Blogs</option>
            </select>
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