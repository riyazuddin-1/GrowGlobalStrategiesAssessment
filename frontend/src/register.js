const configs = require("./config.json");

const Register = () => {
    // Handling Registration
    async function handleSubmit(e) {
        e.preventDefault();
        const form = e.currentTarget;
        const submitTo = `${configs.backend_server}/register`;
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
            window.location = '/login';
        } else {
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

    // Verifying if the 'password' and 'confirm password' match
    function pwdMatch() {
        const pwd = document.getElementById('pwd');
        const pwdConfirm = document.getElementById('pwdConfirm');
        const submit = document.getElementById('submit');
        const reminder = document.getElementById('reminder');
        if(pwd.value != pwdConfirm.value) {
            submit.enabled = false;
            reminder.innerHTML = '&#9755; Use same password';
            reminder.style.color = 'red';
        } else {
            submit.enabled = true;
            reminder.innerHTML = '&#9755; Good to go';
            reminder.style.color = 'green';
        }
    }
    
    return (
        <div className='component auth'>
            <p id='msgField'></p>
            <form id="registerForm" onSubmit={handleSubmit}>
            <label htmlFor="name">Name:</label>
            <input type="text" name="username" placeholder="Your Name" id='name' maxLength='20' required/>
            <label htmlFor="email">Email:</label>
            <input type="email" name="email" placeholder="Email ID" id='email' required/>
            <label htmlFor="pwd">Password:</label>
            <input type="password" name="password" placeholder="Password" id='pwd' minLength='8' required/>
            <label htmlFor="pwdConfirm">Password:</label>
            <input type="password" name="confirm-password" placeholder="Confirm Password" id='pwdConfirm' onInput={()=>pwdMatch()} required/>
            <span id='reminder'>&#9755;</span>
            <input type="submit" id='submit' value='submit'/>
            </form>
            already a user? <a href='/login'>Login</a>
        </div>
    );
}
 
export default Register;