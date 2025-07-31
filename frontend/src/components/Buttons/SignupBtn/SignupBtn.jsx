import React from "react";
import "./SignupBtn.css";
import { Link } from "react-router-dom";

const SignupBtn = () => {
  return (
    <Link to="/signup" className="singupBtnContainer">
      <p className="signupPara">Sign up</p>
    </Link>
  );
};

export default SignupBtn;
