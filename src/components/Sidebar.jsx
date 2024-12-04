import { useContext, useState, useEffect } from "react";
import { TiHome } from "react-icons/ti";
import { RiLogoutBoxFill } from "react-icons/ri";
import { AiFillMessage } from "react-icons/ai";
import { GiHamburgerMenu } from "react-icons/gi";
import { FaChalkboardTeacher } from "react-icons/fa";
import { RiAdminFill } from "react-icons/ri";
import { IoPersonAddSharp } from "react-icons/io5";
import { IoBook } from "react-icons/io5";
import { BiSolidBookAdd } from "react-icons/bi";
import axios from "axios";
import { toast } from "react-toastify";
import { Context } from "../main";
import { useNavigate, useLocation } from "react-router-dom";
import { confirmAlert } from "react-confirm-alert";

const Sidebar = () => {
  const [show, setShow] = useState(false);
  const { isAuthenticated, setIsAuthenticated } = useContext(Context);
  const navigateTo = useNavigate();
  const location = useLocation(); 
  
  useEffect(() => {
    const path = location.pathname; 
    switch (path) {
      case "/":
        setActiveLink("home");
        break;
      case "/messages":
        setActiveLink("messages");
        break;
      case "/instructor/addnew":
        setActiveLink("addInstructor");
        break;
      case "/instructors":
        setActiveLink("instructors");
        break;
      case "/course/addnew":
        setActiveLink("addCourse");
        break;
      case "/allcourses":
        setActiveLink("courses");
        break;
      case "/admin/addnew":
        setActiveLink("addAdmin");
        break;
      default:
        setActiveLink("home");
    }
  }, [location]);

  // const handleLogout = async () => {
  //   await axios
  //     .get("https://plus-backendd.onrender.com/api/v1/user/admin/logout", {
  //       withCredentials: true,
  //     })
  //     .then((res) => {
  //       toast.success(res.data.message);
  //       setIsAuthenticated(false);
  //     })
  //     .catch((err) => {
  //       toast.error(err.response.data.message);
  //     });
  // };


  const handleLogout = () => {
    confirmAlert({
      title: "Confirm to log out",
      message: "Are you sure you want to log out?",
      buttons: [
        {
          label: "Yes",
          onClick: async () => {
            try {
              const response = await axios.get(
                "https://plus-backendd.onrender.com/api/v1/user/admin/logout",
                {
                  withCredentials: true,
                }
              );

              if (response.status === 200) {
                toast.success(response.data.message);
                setIsAuthenticated(false);
                navigateTo('/login')
              }
            } catch (err) {
              toast.error(err.response?.data?.message || "Logout failed");
            }
          },
          style: {
            backgroundColor: "#4CAF50",
            color: "white",
            padding: "8px 16px",
            fontSize: "14px",
            border: "none",
            borderRadius: "4px",
            cursor: "pointer",
            transition: "background-color 0.3s",
          },
        },
        {
          label: "No",
          onClick: () => console.log("Logout canceled"),
          style: {
            backgroundColor: "#f44336",
            color: "white",
            padding: "8px 16px",
            fontSize: "14px",
            border: "none",
            borderRadius: "4px",
            cursor: "pointer",
            transition: "background-color 0.3s",
          },
        },
      ],
    });
  };

  const [activeLink, setActiveLink] = useState("home");

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
