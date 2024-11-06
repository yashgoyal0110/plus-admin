import { useContext, useEffect, useState } from "react";
import { Context } from "../main";
import { Navigate } from "react-router-dom";
import axios from "axios";
import { toast } from "react-toastify";
import { GoCheckCircleFill } from "react-icons/go";
import { AiFillCloseCircle } from "react-icons/ai";
import { MdDelete } from "react-icons/md";
import { confirmAlert } from "react-confirm-alert"; // Import confirm alert
import "react-confirm-alert/src/react-confirm-alert.css";
import { ClipLoader } from "react-spinners";

const Dashboard = () => {
  const [slots, setSlots] = useState([]);
  const [totalSlots, setTotalSlots] = useState();
  const [totalInstructors, setTotalInstructors] = useState();
  const [loading, setLoading] = useState(true); 

  // Delete Slot
  const deleteSlot = (id) => {
    confirmAlert({
      title: "Confirm to delete",
      message: "Are you sure you want to delete this slot?",
      buttons: [
        {
          label: "Yes",
          onClick: async () => {
            try {
              const response = await axios.delete(
                `https://plus-backend.onrender.com/api/v1/slot/delete/${id}`,
                {
                  withCredentials: true,
                }
              );
              setSlots(slots.filter((slot) => slot._id !== id));
              toast.success(
                response.data.message || "Slot deleted successfully!"
              );
            } catch (error) {
              console.log(error);
              toast.error(
                error.response?.data?.message || "Failed to delete slot"
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
    const fetchSlots = async () => {
      try {
        const { data } = await axios.get(
          "https://plus-backend.onrender.com/api/v1/slot/getall",
          { withCredentials: true }
        );
        setSlots(data.slots);
        setTotalSlots(data.slots.length);
      } catch (error) {
        console.log(error);
        setSlots([]);
      }
    };
    const fetchInstructors = async () => {
      try {
        const { data } = await axios.get(
          "https://plus-backend.onrender.com/api/v1/user/instructors",
          { withCredentials: true }
        );
        setTotalInstructors(data.instructors.length);
      } catch (error) {
        console.log(error);
      }
    };

    fetchSlots();
    fetchInstructors();

    const timeoutId = setTimeout(() => setLoading(false), 1500);

    return () => clearTimeout(timeoutId);
  }, []);

  const handleUpdateStatus = async (slotId, status) => {
    try {
      const { data } = await axios.put(
        `https://plus-backend.onrender.com/api/v1/slot/update/${slotId}`,
        { status },
        { withCredentials: true }
      );
      setSlots((prevSlots) =>
        prevSlots.map((slot) =>
          slot._id === slotId ? { ...slot, status } : slot
        )
      );
      toast.success(data.message);
    } catch (error) {
      console.log(error);
      toast.error(error.response.data.message);
    }
  };

  const { isAuthenticated, admin } = useContext(Context);
  if (!isAuthenticated) {
    return <Navigate to={"/login"} />;
  }

  return (
    <>
      <section className="dashboard page">
        {loading ? (
          <div
            className="loading-container"
            style={{
              display: "flex",
              justifyContent: "center",
              marginTop: "50px",
            }}
          >
            <ClipLoader
              size={100}
              color={"#e35108f2"}
              loading={loading}
              cssOverride={{
                display: "block",
                marginTop: "200px",
                borderWidth: "6px",
              }}
            />
          </div>
        ) : (
          <>
            <div className="banner">
              <div className="firstBox">
                <img
                  src="https://icons.veryicon.com/png/o/miscellaneous/user-avatar/user-avatar-male-5.png"
                  alt="instImg"
                />
                <div className="content">
                  <div>
                    <p>Hello ,</p>
                    <h5>{admin && `${admin.firstName}`} </h5>
                  </div>
                  <p>
                    Welcome to Admin Dashboard, it provides a centralized view
                    of essential data and tools, allowing administrators to
                    manage students, view data, and monitor activities
                    seamlessly.
                  </p>
                </div>
              </div>
              <div className="secondBox">
                <p>Total Slots</p>
                <h3>{totalSlots}</h3>
              </div>
              <div className="thirdBox" id="thirdBox">
                <p>Registered Instructors</p>
                <h3>{totalInstructors}</h3>
              </div>
            </div>
            <div className="banner">
              <h5>Slots</h5>
              <table>
                <thead>
                  <tr>
                    <th>Student</th>
                    <th>Date</th>
                    <th>Instructor</th>
                    <th>Course</th>
                    <th>Status</th>
                    <th>Whatsapp Updates</th>
                    <th></th>
                  </tr>
                </thead>
                <tbody>
                  {slots && slots.length > 0
                    ? slots.map((slot) => (
                        <tr key={slot._id}>
                          <td>{`${slot.firstName} ${slot.lastName}`}</td>
                          <td>{slot.slot_date.substring(0, 16)}</td>
                          <td>{`${slot.instructor.firstName} ${slot.instructor.lastName}`}</td>
                          <td>{slot.course}</td>
                          <td>
                            <select
                              className={
                                slot.status === "Pending"
                                  ? "value-pending"
                                  : slot.status === "Accepted"
                                  ? "value-accepted"
                                  : "value-rejected"
                              }
                              value={slot.status}
                              onChange={(e) =>
                                handleUpdateStatus(slot._id, e.target.value)
                              }
                            >
                              <option value="Pending" className="value-pending">
                                Pending
                              </option>
                              <option
                                value="Accepted"
                                className="value-accepted"
                              >
                                Accepted
                              </option>
                              <option
                                value="Rejected"
                                className="value-rejected"
                              >
                                Rejected
                              </option>
                            </select>
                          </td>
                          <td>
                            {slot.whatsapp === true ? (
                              <GoCheckCircleFill className="green" />
                            ) : (
                              <AiFillCloseCircle className="red" />
                            )}
                          </td>
                          <td
                            className="deleteBtn"
                            style={{ cursor: "pointer", fontSize: "25px" }}
                          >
                            <MdDelete onClick={() => deleteSlot(slot._id)} />
                          </td>
                        </tr>
                      ))
                    : "No Slots Found!"}
                </tbody>
              </table>
            </div>
          </>
        )}
      </section>
    </>
  );
};

export default Dashboard;
