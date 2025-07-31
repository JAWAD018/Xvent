import React from "react";
import "./SignupPage.css";
import XSmallLogo from "../../../assets/AuthAssets/XSmallLogo.png";
import { IoCheckbox } from "react-icons/io5";
import { Link } from "react-router-dom";
import RoundedBtnActive from "../../../components/Buttons/RoundedBtnActive/RoundedBtnActive";
import GoogleLogo from "../../../assets/AuthAssets/GoogleLogo.svg"
import AppleLogo from "../../../assets/AuthAssets/AppleLogo.svg"

const SignupPage = () => {
  const handleSubmit = (e) => {
    e.preventDefault();
  };

  return (
    <div className="LoginMainContainer">
      <div className="LoginPageContainer SignupPageContainer">
        <div className="LoginPageUpperSection">
          <img src={XSmallLogo} alt="Xvent Logo" />
          <h2>Login your account</h2>
          <p>
            Already have an account?{" "}
            <span>
              <Link className="signupPageLink" to="/signin">
                Log in
              </Link>
            </span>
          </p>
        </div>
        <form onSubmit={handleSubmit} className="loginForm signupForm">
          <div className="formGroup">
            <label htmlFor="email">Full Name</label>
            <input
              type="text"
              id="name"
              name="name"
              placeholder="Full Name"
              required
            />
          </div>

          <div className="formGroup">
            <label htmlFor="email">Email</label>
            <input
              type="email"
              id="email"
              name="email"
              placeholder="you@example.com"
              required
            />
          </div>

          <div className="formGroup">
            <label htmlFor="password">Password</label>
            <input
              type="password"
              id="password"
              name="password"
              placeholder="••••••••"
              required
            />
          </div>

          {/* <div className="formForgetPassword">
            <Link to="">
              <p>Forget your password</p>
            </Link>
          </div> */}

          <div className="formOptions">
            <label className="custom-checkbox">
              <input type="checkbox" required />
              <p className="checkmark"></p>
              <p className="checkmarkPara">
                By creating an account, I agree to our{" "}
                <span>
                  <Link className="signupPageLink" to="/terms-of-service">
                    Terms of use
                  </Link>
                </span>{" "}
                and{" "}
                <span>
                  <Link className="signupPageLink" to="/privacy-policy">
                    Privacy Policy
                  </Link>
                </span>
              </p>
            </label>
          </div>

          <RoundedBtnActive
            label={"Sign up"}
            type={"submit"}
            className={"roundedPrimaryBtn"}
          />
        </form>
        <div className="divider">
          <hr />
          <p>OR</p>
          <hr />
        </div>
        <div className="oauthButtons">
          <RoundedBtnActive
            label={"Continue with Google"}
            type={"submit"}
            className={"roundedSecondaryBtn"}
            img={true}
            imgSrc={GoogleLogo}
            imgAlt="Google Logo"
          />
          <RoundedBtnActive
            label={"Continue with Apple"}
            type={"submit"}
            className={"roundedSecondaryBtn"}
            img={true}
            imgSrc={AppleLogo}
            imgAlt="Apple Logo"
          />
        </div>
      </div>
    </div>
  );
};

export default SignupPage;
