import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import Blogedit from "./blogedit";
var cryptoJS = require("crypto-js");

const Blogview = ({authCred, editor}) => {
    const { blogId } = useParams();
    var [isLoading, setLoading] = useState(true);
    var [user, setUser] = useState(false);
    var [title, setTitle] = useState(false);
    var [author, setAuthor] = useState(false);
    var [authorId, setAuthorId] = useState(false);
    var [content, setContent] = useState(false);
    var [edit, setEdit] = useState(false);
    useEffect(() => {
        fetch('http://localhost:3333/getBlog', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({id: blogId})
        }).then( async (response)=> {
            if(response.ok) {
                const blogData = await response.json();
                setTitle(blogData.Title);
                setAuthor(blogData.Author);
                setAuthorId(blogData.AuthorId);
                setContent(blogData.Content);
                if(authCred) {
                    var bytesString = cryptoJS.AES.decrypt(authCred, 'GiveMeJob').toString(cryptoJS.enc.Utf8);
                    var userInfo = JSON.parse(bytesString);
                    setUser(userInfo.email);
                }
            }
            setLoading(false);
        })
        if(editor) {
            setEdit(true);
        }
    }, [])
    return (
        <>
        { !edit && <>
        { isLoading && <p>Loading...</p>}
        { !isLoading && !title && <p>The blog Id is invalid.</p> }
        { !isLoading && title && <div id='blogview'>
            <h1>{title}</h1>
            <p><span>written by:</span> {author}</p>
            <hr/>
            <p>{content}</p>
            { authorId && authorId===user && <button className='blogPen' onClick={()=> setEdit(true)}><img src='../pen.svg'/> Edit blog</button>}
        </div>}
        </>}
        { authorId && authorId===user && edit && <Blogedit authCred={authCred} blogId={blogId} title={title} content={content}/>}
        </>
    );
}
 
export default Blogview;