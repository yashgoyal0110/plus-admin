import axios from "axios";
import { useContext, useEffect, useState } from "react";
import { toast } from "react-toastify";
import { Context } from "../main";
import { Navigate } from "react-router-dom";
import { MdDelete } from "react-icons/md";
import { confirmAlert } from "react-confirm-alert";
import "react-confirm-alert/src/react-confirm-alert.css";
import Loading from "./Loading";

const Courses = () => {
  const [courses, setCourses] = useState([]);
  const [loading, setLoading] = useState(true); 
  const { isAuthenticated } = useContext(Context);

  const deleteCourse = (id) => {
    confirmAlert({
      title: "Confirm to delete",
      message: "Are you sure you want to delete this Course?",
      buttons: [
        {
          label: "Yes",
          onClick: async () => {
            try {
              const response = await axios.delete(
                `http://localhost:3000/api/v1/course/deletecourse/${id}`,
                {
                  withCredentials: true,
                }
              );
              setCourses(courses.filter((course) => course._id !== id));
              toast.success(
                response.data.message || "Course deleted successfully!"
              );
            } catch (error) {
              console.log(error);
              toast.error(
                error.response?.data?.message || "Failed to delete Course"
              );
            }
          },
        },
        {
          label: "No",
          onClick: () => toast.info("Deletion canceled"),
        },
      ],
    });
  };

  useEffect(() => {
    const fetchCourses = async () => {
      try {
        const { data } = await axios.get(
          "http://localhost:3000/api/v1/course/allcourses",
          { withCredentials: true }
        );
        setCourses(data.courses);
      } catch (error) {
        toast.error(error.response.data.message);
      } finally {
        setLoading(false);
      }
    };
    fetchCourses();
  }, []);

 

  if (!isAuthenticated) {
    return <Navigate to={"/login"} />;
  }

  return (
    <section className="page courses">
      <h1>Courses</h1>
      {loading ? (
         <div className="Div loadingDiv">
       <Loading loading={loading}/>
       </div>
      ) : (
        <div className="banner">
          {courses && courses.length > 0 ? (
            courses.map((element, idx) => (
              <div className="card" key={idx} id="card">
                <img src={element.imageUrl} alt="course image" />
                <h4>{element.title}</h4>
                <div className="coursedetails">
                  <p>
                    Price: <span>{`${element.price} \u20B9`}</span>
                  </p>
                  <p>
                    Code: <span>{element.code}</span>
                  </p>
                  <p>
                    Instructor: <span>{element.instructor}</span>
                  </p>
                  <p>
                    Validity: <span>{element.validity}</span>
                  </p>
                  <p>
                    Mode: <span>{element.mode}</span>
                  </p>
                  <p>
                    Duration: <span>{`${element.duration} months`}</span>
                  </p>
                </div>
                <div style={{ position: "relative", left: "90%", cursor: "pointer" }}>
                  <MdDelete
                    onClick={() => deleteCourse(element._id)}
                    style={{ color: "white", fontSize: "25px" }}
                  />
                </div>
              </div>
            ))
          ) : (
            <h1>No Courses Found!</h1>
          )}
        </div>
      )}
    </section>
  );
};

export default Courses;
