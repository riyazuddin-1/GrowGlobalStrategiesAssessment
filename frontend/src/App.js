import Navbar from "./navbar";
import Home from "./home";
import Login from "./login";
import Register from "./register";
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Blogview from "./blogview";
import Blogedit from "./blogedit";
var cryptoJS = require('crypto-js')

function App() {
  var authCred = sessionStorage.getItem('Credentials');
  var isLoggedIn;
  if(authCred) {
    isLoggedIn = true;
  } else {
    isLoggedIn = false;
  }
  var funcAuthCred = (data) => {
    sessionStorage.setItem('Credentials', cryptoJS.AES.encrypt(JSON.stringify(data), 'GiveMeJob').toString());
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