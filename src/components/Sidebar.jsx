import { useContext, useState } from "react";
import { TiHome } from "react-icons/ti";
import { RiLogoutBoxFill } from "react-icons/ri";
import { AiFillMessage } from "react-icons/ai";
import { GiHamburgerMenu } from "react-icons/gi";
import { FaChalkboardTeacher } from "react-icons/fa";
import { RiAdminFill } from "react-icons/ri";
import { IoPersonAddSharp } from "react-icons/io5";
import { IoBook } from "react-icons/io5";
import axios from "axios";
import { toast } from "react-toastify";
import { Context } from "../main";
import { useNavigate } from "react-router-dom";
import { BiSolidBookAdd } from "react-icons/bi";

const Sidebar = () => {
  const [show, setShow] = useState(false);
  const [activeLink, setActiveLink] = useState("home");

  const { isAuthenticated, setIsAuthenticated } = useContext(Context);
  const navigateTo = useNavigate();

  const handleLogout = async () => {
    await axios
      .get("https://plus-backend.onrender.com/api/v1/user/admin/logout", {
        withCredentials: true,
      })
      .then((res) => {
        toast.success(res.data.message);
        setIsAuthenticated(false);
      })
      .catch((err) => {
        toast.error(err.response.data.message);
      });
  };

  const handleNavigation = (link, path) => {
    setActiveLink(link);
    navigateTo(path);
    setShow(false);
  };

  return (
    <>
      <nav
        style={!isAuthenticated ? { display: "none" } : { display: "flex" }}
        className={show ? "show sidebar" : "sidebar"}
      >
        <div className="links">
          <TiHome
            onClick={() => handleNavigation("home", "/")}
            className={activeLink === "home" ? "active" : ""}
          />
          <AiFillMessage
            onClick={() => handleNavigation("messages", "/messages")}
            className={activeLink === "messages" ? "active" : ""}
          />
          <IoPersonAddSharp
            onClick={() =>
              handleNavigation("addInstructor", "/instructor/addnew")
            }
            className={activeLink === "addInstructor" ? "active" : ""}
          />
          <FaChalkboardTeacher
            onClick={() => handleNavigation("instructors", "/instructors")}
            className={activeLink === "instructors" ? "active" : ""}
          />
          <BiSolidBookAdd 
          onClick={() => handleNavigation("addCourse", "/course/addnew")}
          className={activeLink === "addCourse" ? "active" : ""}
          />
          <IoBook
            onClick={() => handleNavigation("courses", "/allcourses")}
            className={activeLink === "courses" ? "active" : ""}
          />

          <RiAdminFill
            onClick={() => handleNavigation("addAdmin", "/admin/addnew")}
            className={activeLink === "addAdmin" ? "active" : ""}
          />

          <RiLogoutBoxFill onClick={handleLogout} />
        </div>
      </nav>
      <div
        className="wrapper"
        style={!isAuthenticated ? { display: "none" } : { display: "flex" }}
      >
        <GiHamburgerMenu
          className={"hamburger"}
          onClick={() => setShow(!show)}
        />
      </div>
    </>
  );
};

export default Sidebar;
