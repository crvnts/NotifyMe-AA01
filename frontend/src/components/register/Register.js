import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Form, Input, Button, Alert, Layout, Typography } from "antd";
import {
  UserOutlined,
  LockOutlined,
  MailOutlined,
  HomeOutlined,
  EnvironmentOutlined,
  InboxOutlined,
} from "@ant-design/icons";
const { Title } = Typography;

const Register = () => {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    username: "",
    password: "",
    street: "",
    city: "",
    province: "",
    postal: "",
  });
  const [registerStatus, setRegisterStatus] = useState("");
  const navigate = useNavigate();

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value,
    });
  };

  const handleRegister = async () => {
    try {
      const response = await fetch("https://notifyme-aa01-r4ro.onrender.com/api/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });

      if (response.ok) {
        setRegisterStatus("Success");
        console.log("Registration success");
        navigate("/login"); // Redirect to login page or another route on success
      } else {
        setRegisterStatus("Registration failed. Please check your details.");
      }
    } catch (error) {
      console.error("Registration error:", error);
      setRegisterStatus("Registration failed. Please try again later.");
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
      <div
        style={{
          width: "100%",
          maxWidth: "400px",
          display: "flex",
          flexDirection: "column",
        }}
      >
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
              fontWeight: "Bold",
            }}
          >
            Register
          </Title>
          <Form
            name="register_form"
            className="register-form"
            onFinish={handleRegister}
          >
            <Form.Item
              name="name"
              rules={[{ required: true, message: "Please input your name!" }]}
            >
              <Input
                prefix={<UserOutlined className="site-form-item-icon" />}
                placeholder="Name"
                name="name"
                value={formData.name}
                onChange={handleInputChange}
              />
            </Form.Item>
            <Form.Item
              name="email"
              rules={[{ required: true, message: "Please input your Email!" }]}
            >
              <Input
                prefix={<MailOutlined className="site-form-item-icon" />}
                type="email"
                placeholder="Email"
                name="email"
                value={formData.email}
                onChange={handleInputChange}
              />
            </Form.Item>
            <Form.Item
              name="username"
              rules={[
                { required: true, message: "Please input your Username!" },
              ]}
            >
              <Input
                prefix={<UserOutlined className="site-form-item-icon" />}
                placeholder="Username"
                name="username"
                value={formData.username}
                onChange={handleInputChange}
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
                name="password"
                value={formData.password}
                onChange={handleInputChange}
              />
            </Form.Item>

            <Form.Item
              name="street"
              rules={[
                {
                  required: true,
                  message: "Please input your Street Address!",
                },
              ]}
            >
              <Input
                prefix={<HomeOutlined className="site-form-item-icon" />}
                placeholder="Street Address"
                name="street"
                value={formData.street}
                onChange={handleInputChange}
              />
            </Form.Item>
            <Form.Item
              name="city"
              rules={[{ required: true, message: "Please input your City!" }]}
            >
              <Input
                prefix={<EnvironmentOutlined className="site-form-item-icon" />}
                placeholder="City"
                name="city"
                value={formData.city}
                onChange={handleInputChange}
              />
            </Form.Item>
            <Form.Item
              name="province"
              rules={[
                { required: true, message: "Please input your Province!" },
              ]}
            >
              <Input
                prefix={<EnvironmentOutlined className="site-form-item-icon" />}
                placeholder="Province"
                name="province"
                value={formData.province}
                onChange={handleInputChange}
              />
            </Form.Item>
            <Form.Item
              name="postal"
              rules={[
                { required: true, message: "Please input your Postal Code!" },
              ]}
            >
              <Input
                prefix={<InboxOutlined className="site-form-item-icon" />}
                placeholder="Postal Code"
                name="postal"
                value={formData.postal}
                onChange={handleInputChange}
              />
            </Form.Item>
            <Form.Item>
              <Button
                type="primary"
                htmlType="submit"
                className="register-form-button"
                style={{ width: "100%" }}
              >
                Register
              </Button>
            </Form.Item>
            {registerStatus && (
              <Alert
                message={registerStatus}
                type={registerStatus === "Success" ? "success" : "error"}
                showIcon
              />
            )}
          </Form>
        </div>
      </div>
    </Layout>
  );
};

export default Register;
