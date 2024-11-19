import axios from "axios";
import { useContext, useEffect, useState } from "react";
import { toast } from "react-toastify";
import { Context } from "../main";
import { Navigate } from "react-router-dom";
import { MdDelete } from "react-icons/md";
import { confirmAlert } from "react-confirm-alert";
import "react-confirm-alert/src/react-confirm-alert.css";
import Loading from "./Loading";

const Messages = () => {
  const [messages, setMessages] = useState([]);
  const [loading, setLoading] = useState(true); 
  const { isAuthenticated } = useContext(Context);

  const deleteMessage = (id) => {
    confirmAlert({
      title: "Confirm to delete",
      message: "Are you sure you want to delete this Message?",
      buttons: [
        {
          label: "Yes",
          onClick: async () => {
            try {
              const response = await axios.delete(
                `http://localhost:3000/api/v1/message/deletemessage/${id}`,
                {
                  withCredentials: true,
                }
              );
              setMessages(messages.filter((message) => message._id !== id));
              toast.success(
                response.data.message || "Message deleted successfully!"
              );
            } catch (error) {
              console.log(error);
              toast.error(
                error.response?.data?.message || "Failed to delete Message"
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
    const fetchMessages = async () => {
      setLoading(true);
      try {
        const { data } = await axios.get(
          "http://localhost:3000/api/v1/message/getall",
          { withCredentials: true }
        );
        setMessages(data.messages);
      } catch (error) {
        console.log(error.response.data.message);
      } finally {
        setLoading(false);
      }
    };
    fetchMessages();
  }, []);

  if (!isAuthenticated) {
    return <Navigate to={"/login"} />;
  }

  return (
    <section className="page messages">
      <h1>MESSAGES</h1>
      <div className="banner">
        {loading ? (
          <div className="loadingDiv">
            <Loading loading={loading}/>
          </div>
        ) : messages && messages.length > 0 ? (
          messages.map((element) => {
            return (
              <div className="card" key={element._id} id="card">
                <div className="details">
                  <div
                    className="deleteBtnContainer"
                    style={{ position: "relative", left: "97%" }}
                  >
                    <MdDelete
                      onClick={() => deleteMessage(element._id)}
                      style={{
                        color: "white",
                        fontSize: "25px",
                        cursor: "pointer",
                      }}
                    />
                  </div>
                  <p>
                    First Name: <span>{element.firstName}</span>
                  </p>
                  <p>
                    Last Name: <span>{element.lastName}</span>
                  </p>
                  <p>
                    Email: <span>{element.email}</span>
                  </p>
                  <p>
                    Phone: <span>{element.phone}</span>
                  </p>
                  <p>
                    Message: <span>{element.message}</span>
                  </p>
                </div>
              </div>
            );
          })
        ) : (
          <h1>No Messages!</h1>
        )}
      </div>
    </section>
  );
};

export default Messages;
