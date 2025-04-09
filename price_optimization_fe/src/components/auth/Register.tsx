import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useRegisterMutation } from "../../services/authApi";
import Input from "../common/Input";
import Button from "../common/Button";

const Register: React.FC = () => {
  const [username, setUsername] = useState("");
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [userType, setUserType] = useState<
    "admin" | "buyer" | "supplier" | "analyst"
  >("buyer");
  const [company, setCompany] = useState("");
  const [phone, setPhone] = useState("");

  const [register, { isLoading, error }] = useRegisterMutation();
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    try {
      await register({
        username,
        first_name: firstName,
        last_name: lastName,
        email,
        password,
        confirm_password: confirmPassword,
        profile: { user_type: userType, company, phone },
      }).unwrap();
      navigate("/login");
    } catch (err) {
      console.error("Registration error", err);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full space-y-8">
        <div>
          <h2 className="mt-6 text-center text-3xl font-extrabold text-gray-900">
            Register
          </h2>
          <p className="mt-2 text-center text-sm text-gray-600">
            Create your account
          </p>
        </div>
        <form className="mt-8 space-y-6" onSubmit={handleSubmit}>
          <Input
            label="Username"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            required
          />
          <Input
            label="First Name"
            value={firstName}
            onChange={(e) => setFirstName(e.target.value)}
            required
          />
          <Input
            label="Last Name"
            value={lastName}
            onChange={(e) => setLastName(e.target.value)}
            required
          />
          <Input
            label="Email"
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />
          <Input
            label="Password"
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />
          <Input
            label="Confirm Password"
            type="password"
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
            required
          />

          <div className="mb-4">
            <label className="block text-gray-700 mb-1">User Type</label>
            <select
              value={userType}
              onChange={(e) =>
                setUserType(
                  e.target.value as "admin" | "buyer" | "supplier" | "analyst"
                )
              }
              className="w-full px-4 py-2 border rounded-md"
            >
              <option value="buyer">Buyer</option>
              <option value="admin">Admin</option>
              <option value="supplier">Supplier</option>
              <option value="analyst">Analyst</option>
            </select>
          </div>

          <Input
            label="Company"
            value={company}
            onChange={(e) => setCompany(e.target.value)}
          />
          <Input
            label="Phone"
            value={phone}
            onChange={(e) => setPhone(e.target.value)}
          />

          {error && (
            <div className="text-red-500 text-sm">
              Registration failed. Please check the details.
            </div>
          )}

          <Button type="submit" disabled={isLoading}>
            {isLoading ? "Registering..." : "Register"}
          </Button>
        </form>
      </div>
    </div>
  );
};

export default Register;
