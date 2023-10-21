const Navbar = ({isLoggedIn}) => {
    // Logout handling
    function logout() {
        sessionStorage.removeItem('Credentials');//removing auth data from local storage
        window.location.reload();
    }
    return (
        <div className="component">
            <a href='/'><span id='logo'>BloggerOP</span></a>
            {/* Verifying if authorized */}
            { !isLoggedIn && <a href='/login' className="authbtn">Login</a>}
            { isLoggedIn && <a href="#" className="authbtn" style={{color: 'red'}} onClick={() => logout()}>Logout</a>}
        </div>
    );
}
 
export default Navbar;