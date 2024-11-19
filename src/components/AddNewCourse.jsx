import { useContext, useState,useEffect } from "react";
import { Context } from "../main";
import { Navigate, useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import axios from "axios";

const AddNewCourse = () => {
  const { isAuthenticated } = useContext(Context);

  const [title, setTitle] = useState("");
  const [code, setCode] = useState("");
  const [instructor, setInstructor] = useState("");
  const [price, setPrice] = useState("");
  const [duration, setDuration] = useState("");
  const [mode, setMode] = useState("");
  const [validity, setValidity] = useState("");
  const [imageUrl, setImageUrl] = useState("");
  const [embedLink1, setEmbedLink1] = useState("");
  const [embedLink2, setEmbedLink2] = useState("");

  const handleAddNewCourse = async (e) => {
    e.preventDefault();
    try {
      await axios
        .post(
          "https://plus-backend.onrender.com/course/addnew",
          {
            title,
            code,
            instructor,
            price,
            duration,
            mode,
            validity,
            imageUrl,
            embedLink1,
            embedLink2,
          },
          {
            withCredentials: true,
            headers: { "Content-Type": "application/json" },
          }
        )
        .then((res) => {
          toast.success(res.data.message);
          // navigateTo("/");
          setTitle("");
          setValidity("");
          setDuration("");
          setImageUrl("");
          setCode("");
          setEmbedLink1("");
          setEmbedLink2("");
          setMode("");
          setPrice("");
          setInstructor("");
        });
    } catch (error) {
      toast.error(error.response.data.message);
    }
  };

  if (!isAuthenticated) {
    return <Navigate to={"/login"} />;
  }

  return (
    <section className="page">
      <section className="container form-component add-admin-form">
        <h1 className="form-title">ADD NEW COURSE</h1>
        <form onSubmit={handleAddNewCourse}>
          <div>
            <input
              type="text"
              placeholder="Title"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
            />
            <input
              type="number"
              placeholder="Duration(in months)"
              value={duration}
              onChange={(e) => setDuration(e.target.value)}
            />
          </div>
          <div>
            <input
              type="text"
              placeholder="Instructor"
              value={instructor}
              onChange={(e) => setInstructor(e.target.value)}
            />
            <input
              type="text"
              placeholder="Code"
              value={code}
              onChange={(e) => setCode(e.target.value)}
            />
          </div>
          <div>
            <input
              type="number"
              placeholder="Price(INR)"
              value={price}
              onChange={(e) => setPrice(e.target.value)}
            />
            <input
              type={"date"}
              placeholder="Validity"
              value={validity}
              onChange={(e) => setValidity(e.target.value)}
            />
          </div>
          <div>
            <select value={mode} onChange={(e) => setMode(e.target.value)}>
              <option value="">Select Mode</option>
              <option value="Online">Online</option>
              <option value="Offline">Offline</option>
              <option value="Hybrid">Hybrid</option>
            </select>
            <input
              type="text"
              placeholder="imageUrl"
              value={imageUrl}
              onChange={(e) => setImageUrl(e.target.value)}
            />
          </div>
          <div>
            <input
              type="text"
              placeholder="EmbedLink1"
              value={embedLink1}
              onChange={(e) => setEmbedLink1(e.target.value)}
            />
            <input
              type="text"
              placeholder="EmbedLink2"
              value={embedLink2}
              onChange={(e) => setEmbedLink2(e.target.value)}
            />
          </div>
          <div style={{ justifyContent: "center", alignItems: "center" }}>
            <button type="submit">ADD</button>
          </div>
        </form>
      </section>
    </section>
  );
};

export default AddNewCourse;
