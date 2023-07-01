const Navbar = ({isLoggedIn}) => {
    function logout() {
        sessionStorage.removeItem('Credentials');
        window.location.reload();
    }
    return (
        <div className="component">
            <a href='/'><span id='logo'>BloggerOP</span></a>
            { !isLoggedIn && <a href='/login' className="authbtn">Login</a>}
            { isLoggedIn && <a href="#" className="authbtn" style={{color: 'red'}} onClick={() => logout()}>Logout</a>}
        </div>
    );
}
 
export default Navbar;