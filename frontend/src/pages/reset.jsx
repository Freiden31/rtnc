import React, { useState } from 'react';

const ResetPasswordForm = () => {
  const [email, setEmail] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
  };

  const handleChange = (e) => {
    setEmail(e.target.value);
  };

  return (
    <div className="w-full h-full flex items-center justify-center bg-[#0a0f1c] font-mono text-white">
      <div className="w-[25rem] px-6 py-8 bg-[#0f1115] border border-white/20 shadow-[0_0_80px_#14b8a640] rounded-sm text-sm">
        <h2 className="text-center text-white tracking-widest text-sm mb-6">
          RESET PASSWORD
        </h2>

        <form className="flex flex-col space-y-4 items-center">
          <input
            id='email'
            value={email}
            onChange={handleChange}
            type="email"
            placeholder="Enter your email"
            className="w-[20rem] mx-auto bg-transparent border border-white/30 px-3 py-2 text-white text-xs focus:outline-none focus:border-teal-400 placeholder-white/40"
          />

          <button
            type="submit"
            className="w-[20rem] mx-auto mt-2 bg-teal-500 hover:bg-teal-400 text-black text-xs py-2 tracking-wide transition-all"
          >
            RESET PASSWORD
          </button>
        </form>
      </div>
    </div>
  );
};

export default ResetPasswordForm;
