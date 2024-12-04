import { useContext, useEffect, useState } from "react";
import { Context } from "../main";
import { Navigate } from "react-router-dom";
import axios from "axios";
import { toast } from "react-toastify";
import { GoCheckCircleFill } from "react-icons/go";
import { AiFillCloseCircle } from "react-icons/ai";
import { MdDelete } from "react-icons/md";
import { confirmAlert } from "react-confirm-alert";
import "react-confirm-alert/src/react-confirm-alert.css";
import Loading from "./Loading";

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
              toast.error(
                error.response?.data?.message || "Failed to delete slot"
              );
            }
          },
          style: {
            backgroundColor: "#4caf50",
            color: "white",
            padding: "8px 16px",
            fontSize: "14px",
            border: "none",
            borderRadius: "4px",
            cursor: "pointer",
            transition: "background-color 0.3s",
            margin: "0 10px",
          },
        },
        {
          label: "No",
          onClick: () => toast.info("Deletion canceled"),
          style: {
            backgroundColor: "#f44336",
            color: "white",
            padding: "8px 16px",
            fontSize: "14px",
            border: "none",
            borderRadius: "4px",
            cursor: "pointer",
            transition: "background-color 0.3s",
            margin: "0 10px",
          },
        },
      ],
      overlayStyle: {
        position: "fixed",
        top: "0",
        left: "0",
        width: "100%",
        height: "100%",
        backgroundColor: "rgba(0, 0, 0, 0.5)",
        zIndex: 9998,
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
      },
      modalStyle: {
        fontFamily: "Arial, Helvetica, sans-serif",
        width: "400px",
        padding: "30px",
        textAlign: "left",
        background: "#0b0a0a",
        borderRadius: "10px",
        boxShadow: "0 20px 75px rgba(0, 0, 0, 0.13)",
        color: "#c4c4c4",
        zIndex: 9999,
      },
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
      } catch (err) {
        setSlots([]);
        return err.message;
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
        return (error.message);
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
          <div className="loading-container">
            <Loading loading={loading} />
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
