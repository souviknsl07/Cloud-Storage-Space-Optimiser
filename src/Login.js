import React from "react";
import { auth, provider } from "./firebase";
import { signInWithPopup } from "firebase/auth";

const Login = () => {
  const signIn = () => {
    signInWithPopup(auth, provider).catch(alert);
  };

  return (
    <div>
      <h1>Sign in</h1>
      <div>
        <button onClick={signIn}>Sign In</button>
      </div>
    </div>
  );
};

export default Login;
