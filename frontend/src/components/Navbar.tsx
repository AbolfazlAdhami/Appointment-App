import React from "react";
import { assets } from "../assets/assets";
import { NavLink } from "react-router-dom";
function Navbar() {
  return (
    <header>
      <img src={assets.logo} alt="" className="size-10" />
      <Navbar>
        <NavLink to={""}></NavLink>
      </Navbar>
    </header>
  );
}

export default Navbar;
