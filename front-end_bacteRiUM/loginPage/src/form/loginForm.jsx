import React, { useState } from 'react'
import './loginForm.css'
import './mainDashboard.jsx'
import { FaUser } from "react-icons/fa";
import { RiLockPasswordFill } from "react-icons/ri";
import {Link} from 'react-router-dom';

function LoginForm(){
    const [openPopup, setOpenPopup] = useState(false)

    return(
        <div>
            <button className='pop_up_loginForm' onClick={() => setOpenPopup(true)}>Login</button>
            <button className='about'><Link to="/aboutPage">About</Link></button>
            <button className='contact'><Link to="/contactPage">Contact</Link></button>
            {
            openPopup &&
            <div className='form'>
                <form>
                    <h1>Login</h1>
                    <button className='close_Form' onClick={() => setOpenPopup(false)}>X</button>
                    <div className='email-box'>
                        <input type='email' placeholder='Email' required/>
                        <FaUser className='icon'/>
                    </div>
                    <div className='password-box'>
                        <input type='password' placeholder='Password' required/>
                        <RiLockPasswordFill className='icon'/>
                    </div>
                    <div className='remember-me-box'>
                        <label><input type='checkbox'/>Remember me</label>
                        <a href='#'>Forgot password?</a>
                    </div>
                    <button type='submit'>Login<a href='./mainDashboard.jsx'></a></button>
                    <div className='register'>
                        <p>Don't have an account? <a href='#'>Register</a></p>
                    </div>
                </form>
            </div>
            }
        </div>
    )
}
export default LoginForm