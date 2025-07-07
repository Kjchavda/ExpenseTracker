import React, { useState } from 'react'
import { useNavigate } from 'react-router-dom';
import { Link } from 'react-router-dom';

import AuthLayout from '../../components/layouts/AuthLayout'
import Input from '../../components/Inputs/Input';
import { validateEmail } from '../../utils/helper';
import axios from '../../api/axios';
import { useAuth } from '../../context/AuthContext';

function Login() {
  const [email, setEmail] = useState("");
  
  const [password, setPassword] = useState("");
  const [error, setError] = useState(null);
  const navigate = useNavigate();
  const { login } = useAuth();

  const handleLogin = async (e) => {
    e.preventDefault();

    if(!validateEmail(email)){
      setError("Please enter a valid email address");
      return;
    }

    if(!password){
      setError("Please enter the password!");
      return;
    }

    setError("");

    //API call for LOGIN.
    try {
      const response = await axios.post("/auth/login", new URLSearchParams({
        username: email,
        password: password
      }));

      const token = response.data.access_token;
      login(token); // ✅ store token in context and localStorage
      navigate("/dashboard");
    } catch (err) {
      if (err.response && err.response.data) {
        setError(err.response.data.detail || "Login failed");
      } else {
        setError("Something went wrong. Please try again.");
      }
    } 
    
  }

  return (
    <AuthLayout>
      <div className='lg:w-[70%] h-3/4 md:h-full flex flex-col justify-center'>
        <h3 className='text-xl font-semibold text-black'>Welcome Back</h3>
        <p className='text-xs text-slate-700 mt-[5px] mb-6'>Enter your details to login</p>

        <form onSubmit={handleLogin}>
          <Input
            value={email}
            onChange={({target}) => setEmail(target.value)}
            label="Email Address"
            placeholder='john@example.com'
            type='text'
          />

          <Input
            value={password}
            onChange={({target}) => setPassword(target.value)}
            label="Password"
            placeholder='Minimum 8 characters'
            type='password'
          />

          {
            error && <p className='text-red-500 text-xs pb-2.5'>{error}</p>
          }

          <button type='submit' className='btn-primary'>
            Login
          </button>

          <p className='text-[13px] text-slate-800 mt-3'> 
            Don't have an account? {""}
            <Link className="font-medium text-primary underline" to={"/signup"}>
              SignUp
            </Link>
          </p>

        </form>
      </div>
    </AuthLayout>
  )
}

export default Login