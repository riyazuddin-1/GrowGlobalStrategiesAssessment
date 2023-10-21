const configs = require("./config.json");

const Login = ({funcAuthCred}) => {
    // login form submit
    async function handleSubmit(e) {
        e.preventDefault();
        const form = e.currentTarget;
        const submitTo = `${configs.backend_server}/login`;
        const formData = new FormData(form);
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
            // Setting encrypted authentication data to local storage
            const credentials = await response.json();
            funcAuthCred(credentials);
        } else {
            // Authentication failed
            const message = await response.text();
            showMessage(message);
        }
    }

    // Alert for messages/errors
    function showMessage(message) {
        const msgField = document.getElementById('msgField');
        msgField.innerHTML = message;
        msgField.style.display = 'block';
        setTimeout(() => {
            msgField.style.display = 'none';
        }, 5000);
    }
    return (
        <div className='component auth'>
            <p id='msgField'></p>
            <form id="loginForm" onSubmit = {handleSubmit}>
            <label htmlFor="email">Email</label>
            <input type="email" name="email" placeholder="Email ID" id='email' required/>
            <label htmlFor="password">Password</label>
            <input type="password" name="password" placeholder="Password" id='password' required/>
            <input type="submit" value='submit'/>
            </form>
            new user? <a href='/register'>Register</a>
        </div>
    );
}
 
export default Login;