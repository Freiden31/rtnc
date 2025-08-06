import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { loginUser } from '../api/api';

const SignInForm = () => {
  const [formData, setFormData] = useState({
    username: '',
    password: ''
  });

  const defaultForm = {
    username: '',
    password: ''
  };

  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState('');
  const [ isError, setIsError] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setMessage('');
    setLoading(true);

    try {
      const response = await loginUser(formData);

      if (response.success) {
        setMessage(response.message);
        setIsError(false);
        setFormData(defaultForm);
      } else {
        setMessage(response.message);
        setIsError(true);
        setLoading(true);
      }
    } catch (error) {
        setMessage(response.message || "Something went wrong!");
        setIsError(true);
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (e) => {
    setFormData({...formData, [e.target.id]: e.target.value})
  };

  return (
    <div className="w-full h-full flex items-center justify-center bg-[#0a0f1c] font-mono text-white">
      <div className="w-[25rem] px-6 py-8 bg-[#0f1115] border border-white/20 shadow-[0_0_80px_#14b8a640] rounded-sm text-sm">
        <h2 className="text-center text-white tracking-widest text-sm mb-6">
          SIGN IN
        </h2>

        { message && (
          <p className={`mt-2 text-xs ${ isError ? 'text-rose-500' : 'text-teal-500'}`}>
            {message}
          </p>
        )}

        <form onSubmit={handleSubmit} className="flex flex-col space-y-4 items-center">
          <input
            id='username'
            value={formData.username}
            onChange={handleChange}
            type="text"
            placeholder="Username"
            className="w-[20rem] mx-auto bg-transparent border border-white/30 px-3 py-2 text-white text-xs focus:outline-none focus:border-teal-400 placeholder-white/40"
          />

          <input
            id='password'
            value={formData.password}
            onChange={handleChange}
            type="password"
            placeholder="Password"
            className="w-[20rem] mx-auto bg-transparent border border-white/30 px-3 py-2 text-white text-xs focus:outline-none focus:border-teal-400 placeholder-white/40"
          />

          <div className="w-[20rem] flex justify-end text-white/50 text-xs">
            <span className="cursor-pointer hover:text-white underline">
              Forgot password?
            </span>
          </div>

          <button
            type="submit"
            className="w-[20rem] mx-auto mt-2 bg-teal-500 hover:bg-teal-400 text-black text-xs py-2 tracking-wide transition-all"
          >
            { loading ? "SIGNING IN..." : "SIGN IN"}
          </button>
        </form>

        <p className="mt-6 text-center text-white/60 text-xs">
          Don't have an account yet?{' '}
          <Link to="/">
            <span className="underline cursor-pointer hover:text-white">
              Sign up
            </span>
          </Link>
        </p>
      </div>
    </div>
  );
};

export default SignInForm;
