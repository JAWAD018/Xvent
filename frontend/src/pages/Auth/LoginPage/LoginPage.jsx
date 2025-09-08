import React from "react";
import "./LoginPage.css";
import XSmallLogo from "../../../assets/AuthAssets/XSmallLogo.png";
import { Link, useNavigate } from "react-router-dom";
import RoundedBtnActive from "../../../components/Buttons/RoundedBtnActive/RoundedBtnActive";
import GoogleLogo from "../../../assets/AuthAssets/GoogleLogo.svg";
import AppleLogo from "../../../assets/AuthAssets/AppleLogo.svg";
import axios from "axios";
import { toast } from "sonner";
import { Loader2 } from "lucide-react";
import { useDispatch } from "react-redux";
import { setAuthUser } from "../../../redux/authSlice";
import { useState } from "react";

const LoginPage = () => {

  const navigate = useNavigate();
  const dispatch = useDispatch();
  const [input, setInput] = useState({ email: "", password: "" });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleChange = (e) => {
    setInput({ ...input, [e.target.name]: e.target.value });
    setError(""); // Clear previous error
  };

  const loginHandler = async (e) => {
    e.preventDefault();
    setError("");

    try {
      setLoading(true);

      const res = await axios.post(
        "http://localhost:8000/api/v1/user/login",
        input,
        { headers: { "Content-Type": "application/json" }, withCredentials: true }
      );

      if (res.data.success) {
        dispatch(setAuthUser(res.data.user));
        toast.success(res.data.message);
        setInput({ email: "", password: "" });
        navigate("/dashboard");
      }
    } catch (err) {
      console.error(err?.response?.data);
      setError(err?.response?.data?.message || "Something went wrong");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="LoginMainContainer">
      <div className="LoginPageContainer">
        <div className="LoginPageUpperSection">
          <img src={XSmallLogo} alt="Xvent Logo" />
          <h2>Login your account</h2>
          <p>
            Don't have an account?{" "}
            <span>
              <Link className="signupPageLink" to="/signup">
                Sign up
              </Link>
            </span>
          </p>
        </div>
          {/* Error */}
        {error && (
          <div className="text-red-500 p-2 rounded text-lg mb-4">
            {error}
          </div>
        )}
        <form onSubmit={loginHandler} className="loginForm">
          <div className="formGroup">
            <label htmlFor="email">Email</label>
            <input
              type="email"
              id="email"
              name="email"
              placeholder="you@example.com"
              required
              onChange={handleChange}
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
              onChange={handleChange}
            />
          </div>

          <div className="formForgetPassword">
            <Link to="">
              <p>Forget your password</p>
            </Link>
          </div>

          {/* <div className="formOptions">
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
          </div> */}
          {loading ? (
            <RoundedBtnActive
              label={
                <>
                  <Loader2 className="animate-spin inline-block mr-2" /> Please
                  Wait
                </>
              }
              type="submit"
              className="roundedPrimaryBtn"
            />
          ) : (
            <RoundedBtnActive
              label="Log in"
              type="submit"
              className="roundedPrimaryBtn"
            />
          )}
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

export default LoginPage;
