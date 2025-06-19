import React, { useState } from "react";
import { Button } from "./ui/Button";
import { Input } from "./ui/Input";
import { useAuth } from "../contexts/AuthContext";
import { Modal } from "./ui/Modal";

interface AuthModalProps {
  onSuccess: () => void;
}

export const AuthModal: React.FC<AuthModalProps> = ({ onSuccess }) => {
  const [mode, setMode] = useState<"login" | "register" | "forgot">("login");
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    email: "",
    password: "",
    name: "",
    phone: "",
  });
  const [errors, setErrors] = useState<Record<string, string>>({});

  const { login, register, forgotPassword } = useAuth();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setErrors({});

    try {
      if (mode === "login") {
        await login(formData.email, formData.password);
        onSuccess();
      } else if (mode === "register") {
        await register(
          formData.email,
          formData.password,
          formData.name,
          formData.phone
        );
        onSuccess();
      } else if (mode === "forgot") {
        await forgotPassword(formData.email);
        setMode("login");
      }
    } catch (error: any) {
      setErrors({ general: error.message });
    } finally {
      setLoading(false);
    }
  };

  const handleInputChange = (field: string, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
    if (errors[field]) {
      setErrors((prev) => ({ ...prev, [field]: "" }));
    }
  };

  const renderForgotPassword = () => (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div className="text-center mb-4">
        <h2 className="text-xl font-semibold">Reset Password</h2>
        <p className="text-gray-600 dark:text-gray-400 text-sm mt-1">
          Enter your email and we'll send you a link to reset your password.
        </p>
      </div>

      <Input
        label="Email"
        type="email"
        value={formData.email}
        onChange={(e) => handleInputChange("email", e.target.value)}
        error={errors.email}
        required
      />

      {errors.general && (
        <p className="text-red-500 text-sm">{errors.general}</p>
      )}

      <Button type="submit" className="w-full" disabled={loading}>
        {loading ? "Sending..." : "Send Reset Link"}
      </Button>

      <div className="text-center">
        <button
          type="button"
          onClick={() => setMode("login")}
          className="text-pink-500 hover:text-pink-600 text-sm"
        >
          Back to Sign In
        </button>
      </div>
    </form>
  );

  if (mode === "forgot") {
    return renderForgotPassword();
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      {mode === "register" && (
        <>
          <Input
            label="Full Name"
            type="text"
            value={formData.name}
            onChange={(e) => handleInputChange("name", e.target.value)}
            error={errors.name}
            required
          />
          <Input
            label="Phone Number"
            type="tel"
            value={formData.phone}
            onChange={(e) => handleInputChange("phone", e.target.value)}
            error={errors.phone}
            required
          />
        </>
      )}

      <Input
        label="Email"
        type="email"
        value={formData.email}
        onChange={(e) => handleInputChange("email", e.target.value)}
        error={errors.email}
        required
      />

      <Input
        label="Password"
        type="password"
        value={formData.password}
        onChange={(e) => handleInputChange("password", e.target.value)}
        error={errors.password}
        required
      />

      {mode === "login" && (
        <div className="text-right -mt-2">
          <button
            type="button"
            onClick={() => setMode("forgot")}
            className="text-pink-500 hover:text-pink-600 text-sm inline-block"
          >
            Forgot your password?
          </button>
        </div>
      )}

      {errors.general && (
        <p className="text-red-500 text-sm">{errors.general}</p>
      )}

      <Button type="submit" className="w-full" disabled={loading}>
        {loading
          ? "Please wait..."
          : mode === "login"
          ? "Sign In"
          : "Create Account"}
      </Button>

      <div className="text-center">
        <button
          type="button"
          onClick={() => setMode(mode === "login" ? "register" : "login")}
          className="text-pink-500 hover:text-pink-600 text-sm block w-full"
        >
          {mode === "login"
            ? "Don't have an account? Sign up"
            : "Already have an account? Sign in"}
        </button>
      </div>
    </form>
  );
};
