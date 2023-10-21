import Navbar from "./navbar";
import Home from "./home";
import Login from "./login";
import Register from "./register";
import Blogview from "./blogview";
import Blogedit from "./blogedit";

import { BrowserRouter, Routes, Route } from 'react-router-dom';
const cryptoJS = require('crypto-js');
const configs = require("./config.json");

function App() {
  // Check user authentication
  const authCred = sessionStorage.getItem('Credentials');
  var isLoggedIn;
  if(authCred) {
    isLoggedIn = true;
  } else {
    isLoggedIn = false;
  }

  // Function to set user authentication
  const funcAuthCred = (data) => {
    sessionStorage.setItem('Credentials', cryptoJS.AES.encrypt(JSON.stringify(data), configs.EncryptionKey).toString());
    window.location = '/';
  }

  return (
    <BrowserRouter>
    <div className="App">
      <Navbar isLoggedIn={isLoggedIn}/>
      <Routes>
        <Route path="/" element={<Home authCred={authCred}/>}/>
        <Route path="/login" element={<Login funcAuthCred={funcAuthCred}/>}/>
        <Route path="/register" element={<Register/>}/>
        <Route path="/blog" element={<Blogview/>}/>
        <Route path="/blog/:blogId" element={<Blogview authCred={authCred}/>}/>
        <Route path="/edit" element={<Blogedit authCred={authCred}/>}/>
        <Route path="/edit/:blogId" element={<Blogview authCred={authCred} editor={true}/>}/>
      </Routes>
    </div>
    </BrowserRouter>
  );
}

export default App;