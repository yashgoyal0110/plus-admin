import axios from "axios";
import { useContext, useEffect, useState } from "react";
import { toast } from "react-toastify";
import { Context } from "../main";
import { Navigate } from "react-router-dom";
import { MdDelete } from "react-icons/md";
import { confirmAlert } from "react-confirm-alert";
import "react-confirm-alert/src/react-confirm-alert.css";
import Loading from "./Loading";

const Instructors = () => {
  const [instructors, setInstructors] = useState([]);
  const [loading, setLoading] = useState(true);
  const { isAuthenticated } = useContext(Context);

  //
  const deleteInstructor = (id) => {
    confirmAlert({
      title: "Confirm to delete",
      message: "Are you sure you want to delete this Instructor?",
      buttons: [
        {
          label: "Yes",
          onClick: async () => {
            try {
              const response = await axios.delete(
                `https://plus-backendd.onrender.com/api/v1/user/deleteinstructor/${id}`,
                {
                  withCredentials: true,
                }
              );
              setInstructors(
                instructors.filter((instructor) => instructor._id !== id)
              );
              toast.success(
                response.data.message || "Instructor deleted successfully!"
              );
            } catch (error) {
              toast.error(
                error.response?.data?.message || "Failed to delete Instructor"
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
  //

  useEffect(() => {
    const fetchInstructors = async () => {
      try {
        const { data } = await axios.get(
          "https://plus-backendd.onrender.com/api/v1/user/instructors",
          { withCredentials: true }
        );
        setInstructors(data.instructors);
      } catch (error) {
        toast.error(error.response.data.message);
      } finally {
        setLoading(false);
      }
    };
    fetchInstructors();
  }, []);

  if (!isAuthenticated) {
    return <Navigate to={"/login"} />;
  }
  return (
    <>
      <section className="page instructors">
        <h1>INSTRUCTORS</h1>
        <div className="banner">
          {loading ? (
            <div className="loadingDiv">
              <Loading loading = {loading} />
            </div>
          ) : instructors && instructors.length > 0 ? (
            instructors.map((element, idx) => {
              return (
                <div className="card" key={idx} id="card">
                  <img
                    src={element.instAvatar && element.instAvatar.url}
                    alt="instructor avatar"
                  />
                  <h4>{`${element.firstName} ${element.lastName}`}</h4>
                  <div className="instdetails">
                    <p>
                      Email: <span>{element.email}</span>
                    </p>
                    <p>
                      Phone: <span>{element.phone}</span>
                    </p>
                    <p>
                      DOB: <span>{element.dob.substring(0, 10)}</span>
                    </p>
                    <p>
                      Course: <span>{element.instructorCourse}</span>
                    </p>
                    <p>
                      REFERAL CODE: <span>{element.referalCode}</span>
                    </p>
                    <p>
                      Gender: <span>{element.gender}</span>
                    </p>
                  </div>
                  <div
                    style={{
                      position: "relative",
                      left: "90%",
                      cursor: "pointer",
                    }}
                  >
                    <MdDelete
                      onClick={() => deleteInstructor(element._id)}
                      style={{ color: "white", fontSize: "25px" }}
                    />
                  </div>
                </div>
              );
            })
          ) : (
            <h1>No Registered Instructors Found!</h1>
          )}
        </div>
      </section>
    </>
  );
};

export default Instructors;
