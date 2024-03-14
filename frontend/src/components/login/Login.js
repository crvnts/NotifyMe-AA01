import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Form, Input, Button, Alert, Layout } from "antd";
import { UserOutlined, LockOutlined } from "@ant-design/icons";
const { Content } = Layout;

const Login = () => {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [loginStatus, setLoginStatus] = useState("");
  const navigate = useNavigate();

  const handleLogin = async () => {
    const loginDetails = {
      username: username,
      password: password,
    };

    try {
      const response = await fetch("http://127.0.0.1:5000/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(loginDetails),
      });

      if (response.ok) {
        const data = await response.json();
        setLoginStatus("Success");
        console.log("login success", data);
        navigate("/dashboard"); // Redirect to dashboard or another route on success
      } else {
        setLoginStatus("Login failed. Please check your credentials.");
      }
    } catch (error) {
      console.error("Login error:", error);
      setLoginStatus("Login failed. Please try again later.");
    }
  };

  return (
    <Layout
      style={{
        minHeight: "100vh",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
      }}
    >
      <Content style={{ maxWidth: "300px", width: "100%", padding: "20px" }}>
        <Form
          name="normal_login"
          className="login-form"
          initialValues={{ remember: true }}
          onFinish={handleLogin}
        >
          <Form.Item
            name="username"
            rules={[{ required: true, message: "Please input your Username!" }]}
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
            rules={[{ required: true, message: "Please input your Password!" }]}
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
          </Form.Item>
          {loginStatus && (
            <Alert
              message={loginStatus}
              type={loginStatus === "Success" ? "success" : "error"}
              showIcon
            />
          )}
        </Form>
      </Content>
    </Layout>
  );
};

export default Login;
