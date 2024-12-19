import "./login.scss";
import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import apiRequest from "../../lib/apiRequest";

function Login() {
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    setError("");

    const formData = new FormData(e.target);

    try {
      const res = await apiRequest.post("/auth/login", {
        username: formData.get("username"),
        password: formData.get("password"),
      });

      localStorage.setItem("user", JSON.stringify(res.data.user));
      navigate("/");
    } catch (err) {
      setError(
        err.response?.data?.error ||
          "Network error. Please check your connection."
      );
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="login">
      <div className="formContainer">
        <form onSubmit={handleSubmit}>
          <h1>Welcome back</h1>
          <input name="username" type="text" placeholder="Username" required />
          <input
            name="password"
            type="password"
            placeholder="Password"
            required
          />
          {error && <span className="error">{error}</span>}
          <button disabled={isLoading}>
            {isLoading ? "Logging in..." : "Login"}
          </button>
          <Link to="/register">{"Don't"} you have an account?</Link>
        </form>
      </div>
      <div className="imgContainer">
        <img src="/bg.png" alt="Background graphic" />
      </div>
    </div>
  );
}

export default Login;
