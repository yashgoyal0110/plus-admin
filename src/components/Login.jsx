import  { useContext, useState, useEffect } from "react";
import { Navigate, useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import { Context } from "../main";
import axios from "axios";

const Login = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loader, setLoader] = useState(false);
  const [isButtonDisabled, setIsButtonDisabled] = useState(true);

  const { isAuthenticated, setIsAuthenticated } = useContext(Context);

  const navigateTo = useNavigate();
  useEffect(() => {
    setIsButtonDisabled(!email || !password);
  }, [email, password]);

  const handleLogin = async (e) => {
    e.preventDefault();
    setLoader(true);
    try {
      await axios
        .post(
          "https://plus-backend.onrender.com/api/v1/user/login",
          { email, password, role: "Admin" },
          {
            withCredentials: true,
            headers: { "Content-Type": "application/json" },
          }
        )
        .then((res) => {
          toast.success(res.data.message);
          setIsAuthenticated(true);
          navigateTo("/");
          setEmail("");
          setPassword("");
        });
    } catch (error) {
      toast.error(error.response.data.message);
    }
    finally {
      setLoader(false);
    }
  };

  if (isAuthenticated) {
    return <Navigate to={"/"} />;
  }

  return (
    <>
      <section className="container form-component">
        <img src="https://upload.wikimedia.org/wikipedia/commons/9/9a/Plus_logo.svg" alt="logo" className="logo" />
        <h1 className="form-title">WELCOME TO PLUS LEARNING</h1>
        <p>Only Admins Are Allowed To Access These Resources!</p>
        <form onSubmit={handleLogin}>
          <input
            type="text"
            placeholder="Email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
          <input
            type="password"
            placeholder="Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
          <div style={{ justifyContent: "center", alignItems: "center" }}>
          <button
            type="submit"
            disabled={loader || isButtonDisabled}
            style={{
              cursor: loader || isButtonDisabled ? "not-allowed" : "pointer",
              opacity: loader || isButtonDisabled ? 0.6 : 1,
            }}
          >
            {loader ? "Loading..." : "Login"}
          </button>
          </div>
        </form>
      </section>
    </>
  );
};

export default Login;