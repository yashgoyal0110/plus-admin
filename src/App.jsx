import { useEffect, useContext } from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import "./App.css";
import AddNewAdmin from "./components/AddNewAdmin";
import AddNewInstructor from "./components/AddNewInstructor";
import Dashboard from "./components/Dashboard";
import  Login from "./components/Login";
import Instructors from "./components/Instructors";
import Messages from "./components/Messages";
import Sidebar from "./components/Sidebar";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { Context } from "./main";
import axios from "axios";
import Courses from "./components/Courses";
import AddNewCourse from "./components/AddNewCourse";

function App() {
  const { isAuthenticated, setIsAuthenticated, setAdmin } = useContext(Context);
  useEffect(() => {
    const fetchUser = async () => {
      try {
        const response = await axios.get(
          "https://plus-backend.onrender.com/api/v1/user/admin/me",
          { withCredentials: true }
        );
        setIsAuthenticated(true);
        setAdmin(response.data.user);
      } catch (error) {
        setIsAuthenticated(false);
        setAdmin({});
        console.error("Error fetching user data:", error.response?.data || error.message);
      }
    };
    fetchUser();
  }, [isAuthenticated]);

  return (
    <>
      <Router>
        <Sidebar />
        <Routes>
          <Route path="/" element={<Dashboard />} />
          <Route path="login" element={<Login />} />
          <Route path="instructor/addnew" element={<AddNewInstructor />} />
          <Route path="admin/addnew" element={<AddNewAdmin />} />
          <Route path="messages" element={<Messages />} />
          <Route path="instructors" element={<Instructors />} />
          <Route path="allcourses" element={<Courses />} />
          <Route path="course/addnew" element={<AddNewCourse />} />
          
        </Routes>
        <ToastContainer position="top-center" />
      </Router>
    </>
  );
}

export default App;