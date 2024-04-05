import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Form, Input, Button, Alert, Layout, Typography, Spin } from "antd";
import { UserOutlined, LockOutlined } from "@ant-design/icons";
import Cookies from "js-cookie";

const { Title } = Typography;

const Login = () => {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [loginStatus, setLoginStatus] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();

  const handleLogin = async () => {
    setIsLoading(true);
    const loginDetails = {
      username: username,
      password: password,
    };

    try {
      const response = await fetch(
        "https://notifyme-aa01-r4ro.onrender.com/api/login",
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(loginDetails),
        }
      );

      if (response.ok) {
        const { data } = await response.json();
        Cookies.set("authToken", data, { expires: 1 });
        setLoginStatus("Successfully fetched auth token");
        console.log("login success");
        navigate("/dashboard"); // Redirect to dashboard or another route on success
      } else {
        setLoginStatus("Login failed. Please check your credentials.");
      }
    } catch (error) {
      console.error("Login error:", error);
      setLoginStatus("Login failed. Please try again later.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Layout
      style={{
        minHeight: "100vh",
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
      }}
    >
      <div
        style={{
          width: "100%",
          maxWidth: "300px",
          display: "flex",
          flexDirection: "column",
        }}
      >
        <Title
          level={1}
          style={{
            textAlign: "center",
            marginBottom: "20px",
            fontFamily: "Zen Maru Gothic",
            fontWeight: "bold",
          }}
        >
          NotifyMe System
        </Title>
        <div
          style={{
            padding: "24px", // Add some padding around the
            borderRadius: "25px", // Rounded edges
            boxShadow: "11px 11px 22px #e0e0e0,-11px -11px 22px #ffffff", // Optional: add a subtle shadow
            background: "#ffffff", // White background
            maxWidth: "300px", // Maintain the form size
            width: "100%", // Responsive to container width
            margin: "auto", // Center the box if the outer div is flex
          }}
        >
          <Title
            level={2}
            style={{
              textAlign: "center",
              marginBottom: "20px",
              fontFamily: "Zen Maru Gothic",
            }}
          >
            Login
          </Title>
          <Spin spinning={isLoading}>
            <Form
              name="normal_login"
              className="login-form"
              initialValues={{ remember: true }}
              onFinish={handleLogin}
            >
              <Form.Item
                name="username"
                rules={[
                  { required: true, message: "Please input your Username!" },
                ]}
              >
                <Input
                  prefix={<UserOutlined className="site-form-item-icon" />}
                  placeholder="Username"
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                />
              </Form.Item>
              <Form.Item
                name="password"
                rules={[
                  { required: true, message: "Please input your Password!" },
                ]}
              >
                <Input
                  prefix={<LockOutlined className="site-form-item-icon" />}
                  type="password"
                  placeholder="Password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                />
              </Form.Item>
              <Form.Item>
                <Button
                  type="primary"
                  htmlType="submit"
                  className="login-form-button"
                  style={{ width: "100%" }}
                >
                  Log in
                </Button>
                <Button
                  type="link"
                  onClick={() => navigate("/register")} // Use navigate to redirect to the Register page
                  style={{ width: "100%" }}
                >
                  Create New Account
                </Button>
              </Form.Item>
              {loginStatus && (
                <Alert
                  message={loginStatus}
                  type={loginStatus === "Success" ? "success" : "error"}
                  showIcon
                />
              )}
            </Form>
          </Spin>
        </div>
      </div>
    </Layout>
  );
};

export default Login;
