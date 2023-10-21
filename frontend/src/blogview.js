import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import Blogedit from "./blogedit";
const cryptoJS = require("crypto-js");
const configs = require("./config.json");

const Blogview = ({authCred, editor}) => {
    const { blogId } = useParams();
    const [isLoading, setLoading] = useState(true);
    const [user, setUser] = useState(false);
    const [title, setTitle] = useState(false);
    const [author, setAuthor] = useState(false);
    const [authorId, setAuthorId] = useState(false);
    const [content, setContent] = useState(false);
    const [edit, setEdit] = useState(false);

    // Getting the blog data
    useEffect(() => {
        fetch(`${configs.backend_server}/getBlog`, {
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
                    const bytesString = cryptoJS.AES.decrypt(authCred, configs.EncryptionKey).toString(cryptoJS.enc.Utf8);
                    const userInfo = JSON.parse(bytesString);
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
            </>
        }
        { authorId && authorId===user && edit && <Blogedit authCred={authCred} blogId={blogId} title={title} content={content}/>}
        </>
    );
}
 
export default Blogview;