import React from "react";
import CheckCircleIcon from "@mui/icons-material/CheckCircle";
import EmailIcon from "@mui/icons-material/Email";
import Button from "@mui/material/Button";

export default function ActivateAccount() {
  return (
    <div className="flex flex-col items-center justify-center h-full w-full p-4 font-mono">
      
      <div className="bg-[#0f1115] border border-white/20 shadow-[0_0_80px_#14b8a640] text-sm text-white/50 p-8 rounded-xl w-[25rem] h-[25rem]">
      {/* Logo */}
        <div className="flex items-center justify-center text-base tracking-wide text-teal-500 font-mono mb-2">
          <span className="text-5xl font-bold leading-none">A</span>
          <span className="self-center ml-1">nomaly</span>
          <span className="ml-4 text-5xl font-bold leading-none">D</span>
          <span className="self-center ml-1">etection</span>
        </div>

        <h1 className="text-md font-bold text-center mb-4">Activate your Account</h1>

        {/* Progress bar */}
        <div className="flex items-center justify-around my-6">
          <div className="flex flex-col items-center">
            <CheckCircleIcon className="text-teal-500" />
            <span className="text-xs mt-2">Create Account</span>
          </div>
          <div className="w-8 h-px bg-teal-500 mx-2 mb-8" />
          <div className="flex flex-col items-center">
            <EmailIcon className="text-teal-500" />
            <span className="text-xs mt-2">Verify Email</span>
          </div>
          <div className="w-8 h-px bg-teal-500 mx-2 mb-8" />
          <div className="flex flex-col items-center">
            <div className="w-5 h-5 border-2 border-teal-500 rounded-full" />
            <span className="text-xs mt-2">Enjoy Service</span>
          </div>
        </div>

        {/* Message */}
        <p className="text-center text-sm text-white-40 mb-6">
          Thank you for registering with us. In order to activate your account please
          click the button below.
        </p>

        {/* Activate Button */}
        <div className="flex justify-center font-mono">
          <Button
            variant="contained"
            color="primary"
            size="medium"
            sx={{ px: 4, py: 1.5, textTransform: "uppercase", backgroundColor: "#14b8a5c9", fontSize:"10px", color: "rgba(255, 255, 255, 0.69)", borderRadius: "2px", '&:hover': {
      backgroundColor: "#21bbaeff",           // teal-600
    },}}
          >
            Activate Account
          </Button>
        </div>
      </div>
    </div>
  );
}
