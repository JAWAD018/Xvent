import React from "react";
import "./NavbarGuest.css";
import XventLogo from "../../assets/HomePageUtils/XventLogo.png";
import LoginBtn from "../Buttons/LoginBtn/LoginBtn";
import SignupBtn from "../Buttons/SignupBtn/SignupBtn";
import { IoMdAddCircleOutline } from "react-icons/io";

const NavbarGuest = () => {
  const Navlinks = [
    {
      NavTitle: "Home",
      link: "/",
    },
    {
      NavTitle: "About",
      link: "/about",
    },
  ];

  return (
    <nav id="navbarContainer">
      <div id="mainLogo">
        <img src={XventLogo} alt="Xvent Logo" />
      </div>

      <div className="NavbarNavLinks">
        <ul>
          {Navlinks.map((links, index) => (
            <li key={index}>{links.NavTitle}</li>
          ))}
          <IoMdAddCircleOutline fontSize={"30px"} cursor={"pointer"}/>
        </ul>
      </div>
      <div className="NavbarBtns">
        <LoginBtn />
        <SignupBtn />
      </div>
    </nav>
  );
};

export default NavbarGuest;
