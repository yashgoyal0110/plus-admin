// import { useEffect, useContext } from "react";
// import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
// import "./App.css";
// import AddNewAdmin from "./components/AddNewAdmin";
// import AddNewInstructor from "./components/AddNewInstructor";
// import Dashboard from "./components/Dashboard";
// import  Login from "./components/Login";
// import Instructors from "./components/Instructors";
// import Messages from "./components/Messages";
// import Sidebar from "./components/Sidebar";
// import { ToastContainer } from "react-toastify";
// import "react-toastify/dist/ReactToastify.css";
// import { Context } from "./main";
// import axios from "axios";
// import Courses from "./components/Courses";
// import AddNewCourse from "./components/AddNewCourse";

// function App() {
//   const { isAuthenticated, setIsAuthenticated, setAdmin } = useContext(Context);
//   useEffect(() => {
//     const fetchUser = async () => {
//       try {
//         const response = await axios.get(
//           "http://localhost:3000/api/v1/user/admin/me",
//           { withCredentials: true }
//         );
//         setIsAuthenticated(true);
//         setAdmin(response.data.user);
//       } catch (error) {
//         setIsAuthenticated(false);
//         setAdmin({});
//         console.error("Error fetching user data:", error.response?.data || error.message);
//       }
//     };
//     fetchUser();
//   }, [isAuthenticated]);

//   return (
//     <>
//       <Router>
//         <Sidebar />
//         <Routes>
//           <Route path="/" element={<Dashboard />} />
//           <Route path="login" element={<Login />} />
//           <Route path="instructor/addnew" element={<AddNewInstructor />} />
//           <Route path="admin/addnew" element={<AddNewAdmin />} />
//           <Route path="messages" element={<Messages />} />
//           <Route path="instructors" element={<Instructors />} />
//           <Route path="allcourses" element={<Courses />} />
//           <Route path="course/addnew" element={<AddNewCourse />} />
          
//         </Routes>
//         <ToastContainer position="top-center" />
//       </Router>
//     </>
//   );
// }

// export default App;
import { useEffect, useContext } from "react";
import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";
import "./App.css";
import AddNewAdmin from "./components/AddNewAdmin";
import AddNewInstructor from "./components/AddNewInstructor";
import Dashboard from "./components/Dashboard";
import Login from "./components/Login";
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
          "http://localhost:3000/api/v1/user/admin/me",
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
  }, [setIsAuthenticated, setAdmin]);


  return (
    <>
      <Router>
        <Sidebar />
        <Routes>
          <Route path="/" element={isAuthenticated ? <Dashboard /> : <Navigate to="/login" />} />
          <Route path="login" element={isAuthenticated ? <Navigate to="/" /> : <Login />} />
          <Route path="instructor/addnew" element={isAuthenticated ? <AddNewInstructor /> : <Navigate to="/login" />} />
          <Route path="admin/addnew" element={isAuthenticated ? <AddNewAdmin /> : <Navigate to="/login" />} />
          <Route path="messages" element={isAuthenticated ? <Messages /> : <Navigate to="/login" />} />
          <Route path="instructors" element={isAuthenticated ? <Instructors /> : <Navigate to="/login" />} />
          <Route path="allcourses" element={isAuthenticated ? <Courses /> : <Navigate to="/login" />} />
          <Route path="course/addnew" element={isAuthenticated ? <AddNewCourse /> : <Navigate to="/login" />} />
        </Routes>
        <ToastContainer position="top-center" />
      </Router>
    </>
  );
}

export default App;
