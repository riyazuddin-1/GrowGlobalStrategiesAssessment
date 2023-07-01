const Login = ({funcAuthCred}) => {
    async function handleSubmit(e) {
        e.preventDefault();
        const form = e.currentTarget;
        const submitTo = form.action;
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
            const credentials = await response.json();
            funcAuthCred(credentials);
        } else {
            const message = await response.text();
            showMessage(message);
        }
    }

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
            <form action='http://localhost:3333/login' id="loginForm" onSubmit = {handleSubmit}>
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