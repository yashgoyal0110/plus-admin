import { useContext, useState, useEffect } from "react";
import { Context } from "../main";
import { Navigate, useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import axios from "axios";

const AddNewInstructor = () => {
  const { isAuthenticated } = useContext(Context);

  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [referalCode, setReferalCode] = useState("");
  const [dob, setDob] = useState("");
  const [gender, setGender] = useState("");
  const [password, setPassword] = useState("");
  const [instructorCourse, setInstructorCourse] = useState();
  const [instAvatar, setInstAvatar] = useState();
  const [instAvatarPreview, setInstAvatarPreview] = useState();
  const [courseArray, setCourseArray] = useState([]);

  useEffect(() => {
    const fetchCourses = async () => {
      try {
        const { data } = await axios.get(
          "https://plus-backendd.onrender.com/api/v1/course/allcourses",
          { withCredentials: true }
        );
        setCourseArray(data.courses);
      } catch (error) {
        return error.message;
      }
    };
    fetchCourses();
  }, []);

  const navigateTo = useNavigate();

  const handleAvatar = async (e) => {
    const file = e.target.files[0];
    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = () => {
      setInstAvatarPreview(reader.result);
      setInstAvatar(file);
    };
  };

  const handleAddNewInstructor = async (e) => {
    e.preventDefault();
    try {
      const formData = new FormData();
      formData.append("firstName", firstName);
      formData.append("lastName", lastName);
      formData.append("email", email);
      formData.append("phone", phone);
      formData.append("password", password);
      formData.append("referalCode", referalCode);
      formData.append("dob", dob);
      formData.append("gender", gender);
      formData.append("instructorCourse", instructorCourse);
      formData.append("instAvatar", instAvatar);

      await axios
        .post("https://plus-backendd.onrender.com/api/v1/user/instructor/addnew", formData, {
          withCredentials: true,
          headers: { "Content-Type": "multipart/form-data" }, // multipart/form-data
        })
        .then((res) => {
          toast.success(res.data.message);
          navigateTo("/");
          setFirstName("");
          setLastName("");
          setEmail("");
          setPhone("");
          setReferalCode("");
          setDob("");
          setGender("");
          setPassword("");
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
      <section className="container form-component add-instructor-form">
        <img
          src="https://upload.wikimedia.org/wikipedia/commons/9/9a/Plus_logo.svg"
          alt="logo"
          className="logo logo2"
        />
        <h1 className="form-title">REGISTER NEW INSTRUCTOR</h1>
        <form onSubmit={handleAddNewInstructor}>
          <div className="first-wrapper">
            <div>
              <img
                src={
                  instAvatarPreview
                    ? `${instAvatarPreview}`
                    : "https://png.pngtree.com/png-clipart/20190924/original/pngtree-female-user-avatars-flat-style-women-profession-vector-png-image_4822944.jpg"
                }
                alt="Instructor Avatar"
              ></img>
              <input
                type="file"
                onChange={handleAvatar}
                style={{ cursor: "pointer" }}
                id="fileInput"
              ></input>
            </div>
            <div>
              <input
                type="text"
                placeholder="First Name"
                value={firstName}
                onChange={(e) => setFirstName(e.target.value)}
              />
              <input
                type="text"
                placeholder="Last Name"
                value={lastName}
                onChange={(e) => setLastName(e.target.value)}
              />
              <input
                type="text"
                placeholder="Email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
              <input
                type="number"
                placeholder="Mobile Number"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
              />
              <input
                type="text"
                placeholder="Referal Code(optional)"
                value={referalCode}
                onChange={(e) => setReferalCode(e.target.value)}
              />
              <input
                type={"date"}
                placeholder="Date of Birth"
                value={dob}
                onChange={(e) => setDob(e.target.value)}
              />
              <select
                value={gender}
                onChange={(e) => setGender(e.target.value)}
              >
                <option value="">Select Gender</option>
                <option value="Male">Male</option>
                <option value="Female">Female</option>
                <option value="Custom">Custom</option>
              </select>
              <input
                type="password"
                placeholder="Password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />
              <select
                value={instructorCourse}
                onChange={(e) => {
                  setInstructorCourse(e.target.value);
                }}
              >
                <option value="">Select Course</option>
                {courseArray.map((course) => {
                  return (
                    <option value={course.title} key={course._id}>
                      {course.title}
                    </option>
                  );
                })}
              </select>
              <button type="submit">ADD</button>
            </div>
          </div>
        </form>
      </section>
    </section>
  );
};

export default AddNewInstructor;
