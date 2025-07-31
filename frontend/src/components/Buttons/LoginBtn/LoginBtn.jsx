import React from "react";
import "./LoginBtn.css";
import { Link } from "react-router-dom";

const LoginBtn = () => {



  return (
    <Link to="/signin" className="LoginBtnContainer">
      <p className="LoginPara">Login</p>
    </Link>
  );
};

export default LoginBtn;
