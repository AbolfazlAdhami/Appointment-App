import { assets } from "../assets/assets";
import { NavLink } from "react-router-dom";

function Navbar() {
  return (
    <header className="flex justify-between items-center text-sm py-4 mb-5 border-b border-gray-200">
      <img className="w-40 cursor-pointer " src={assets.logo} alt="" />
      <nav className="hidden md:flex items-start gap-5 font-medium">
        <NavLink to={"/"}>
          <p>HOME</p>
          <hr />
        </NavLink>
        <NavLink to={"/docters"}>
          <p>All Doctors</p>
          <hr />
        </NavLink>
        <NavLink to={"/about"}>
          <p>ABOUT</p>
          <hr />
        </NavLink>
        <NavLink to={"/contact"}>
          <p>CONTACT</p>
          <hr />
        </NavLink>
      </nav>
      <button>Create account</button>
    </header>
  );
}

export default Navbar;
