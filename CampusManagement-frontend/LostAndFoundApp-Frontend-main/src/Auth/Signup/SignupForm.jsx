import React, { useState } from "react";
import { User, Lock, Mail, UserCheck, Shield, ArrowRight } from "lucide-react";
import { registerNewUser } from "../../Services/LoginService";
import { useNavigate } from "react-router-dom";

const SignupForm = () => {
  const [campusUser, setCampusUser] = useState({
    username: "",
    password: "",
    personName: "",
    email: "",
    role: "",
  });
  const [confirmPassword, setConfirmPassword] = useState("");
  let navigate = useNavigate();
  const [errors, setErrors] = useState({});
  const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  const [isSubmitting, setIsSubmitting] = useState(false);

  const saveUser = () => {
    return registerNewUser(campusUser).then(() => {
      alert("User is registered successfully...Go For Login");
      navigate("/");
    });
  };

  const onChangeHandler = (event) => {
    const name = event.target.name;
    const value = event.target.value;
    setCampusUser((values) => ({ ...values, [name]: value }));
    if (errors[name]) {
      setErrors((prev) => ({ ...prev, [name]: undefined }));
    }
  };

  const handleValidation = (event) => {
    event.preventDefault();
    let tempErrors = {};
    let isValid = true;

    if (!campusUser.username.trim()) {
      tempErrors.username = "User Name is required";
      isValid = false;
    }
    if (!campusUser.password.trim()) {
      tempErrors.password = "Password is required";
      isValid = false;
    } else if (
      campusUser.password.length < 5 ||
      campusUser.password.length > 10
    ) {
      tempErrors.password = "Password must be 5-10 characters long";
      isValid = false;
    }

    if (!confirmPassword.trim()) {
      tempErrors.confirmPassword = "Confirm Password is required";
      isValid = false;
    } else if (campusUser.password && campusUser.password !== confirmPassword) {
      tempErrors.confirmPassword = "Both the passwords are not matched";
      isValid = false;
    }

    if (!campusUser.personName.trim()) {
      tempErrors.personName = "Personal Name is required";
      isValid = false;
    }
    if (!campusUser.email.trim()) {
      tempErrors.email = "Email is required";
      isValid = false;
    } else if (!emailPattern.test(campusUser.email)) {
      tempErrors.email = "Invalid Email Format";
      isValid = false;
    }

    if (!campusUser.role.trim()) {
      tempErrors.role = "Role is required";
      isValid = false;
    }
    setErrors(tempErrors);
    if (!isValid) {
      setIsSubmitting(false);
      return;
    }

    setIsSubmitting(true);
    saveUser().finally(() => setIsSubmitting(false));
  };

  return (
    <>
      <div className="w-full max-w-4xl p-8 space-y-6 bg-black/50 backdrop-blur-2xl rounded-2xl shadow-2xl">
        {/* Header Section */}
        <div className="text-center">
          <h1
            style={{ fontFamily: "Gilroy-Heavy" }}
            className="text-4xl font-extrabold text-yellow-400 tracking-widest uppercase mb-2"
          >
            Join Us Today
          </h1>
          <p className="text-sm text-white/90 leading-relaxed">
            Create your account to access the Lost & Found portal
          </p>
        </div>

        {/* Main Form */}
        <form method="post" onSubmit={handleValidation} noValidate>
          {/* Two Column Grid Layout */}
          <div className="form-grid grid grid-cols-2 gap-6 mb-0 items-start">
            {/* Left Column */}
            <div className="form-column flex flex-col justify-between min-h-full">
              {/* Username Input */}
              <div>
                <div className="mt-2 relative">
                  <User className="input-icon absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400 z-10" />
                  <input
                    type="text"
                    name="username"
                    placeholder="Username"
                    value={campusUser.username}
                    onChange={onChangeHandler}
                    
                    style={{ border: "none", padding: "10px 30px" }}
                    className="w-full pl-10 pr-4 py-5 bg-black/50 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-yellow-400 focus:border-yellow-400 transition-all duration-200 text-center hover:border-gray-600"
                  />
                </div>
                {errors.username && (
                  <p className="text-red-500 font-bold text-sm mt-1 text-center">
                    {errors.username}
                  </p>
                )}
              </div>

              {/* Password Input */}
              <div>
                <div className="mt-6 relative">
                  <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400 z-10" />
                  <input
                    type="password"
                    name="password"
                    placeholder="Password"
                    value={campusUser.password}
                    onChange={onChangeHandler}
                    
                    style={{ border: "none", padding: "10px 30px" }}
                    className="w-full pl-10 pr-4 py-5 bg-black/50 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-yellow-400 focus:border-yellow-400 transition-all duration-200 text-center hover:border-gray-600"
                  />
                </div>
                {errors.password && (
                  <p className="text-red-500 font-bold text-sm mt-1 text-center">
                    {errors.password}
                  </p>
                )}
              </div>
            </div>

            {/* Right Column  */}
            <div className="form-column flex flex-col justify-between min-h-full">
              {/* Personal Name Input */}
              <div>
                <div className="mt-2 relative">
                  <UserCheck className="input-icon absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400 z-10" />
                  <input
                    type="text"
                    name="personName"
                    placeholder="Full Name"
                    value={campusUser.personName}
                    onChange={onChangeHandler}
                    
                    style={{ border: "none", padding: "10px 30px" }}
                    className="w-full pl-10 pr-4 py-5 bg-black/50 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-yellow-400 focus:border-yellow-400 transition-all duration-200 text-center hover:border-gray-600"
                  />
                </div>
                {errors.personName && (
                  <p className="text-red-500 font-bold text-sm mt-1 text-center">
                    {errors.personName}
                  </p>
                )}
              </div>

              {/* Confirm Password Input */}
              <div>
                <div className="mt-6 relative">
                  <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400 z-10" />
                  <input
                    type="password"
                    name="confirmPassword"
                    placeholder="Confirm Password"
                    value={confirmPassword}
                    onChange={(event) => {
                      if (errors.confirmPassword) {
                        setErrors((prev) => ({
                          ...prev,
                          confirmPassword: undefined,
                        }));
                      }
                      setConfirmPassword(event.target.value);
                    }}
                    
                    style={{ border: "none", padding: "10px 30px" }}
                    className="w-full pl-10 pr-4 py-5 bg-black/50 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-yellow-400 focus:border-yellow-400 transition-all duration-200 text-center hover:border-gray-600"
                  />
                </div>
                {errors.confirmPassword && (
                  <p className="text-red-500 font-bold text-sm mt-1 text-center">
                    {errors.confirmPassword}
                  </p>
                )}
              </div>
            </div>
          </div>

          {/* Email Input */}
          <div>
            <div className="mt-6 relative">
              <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400 z-10" />
              <input
                type="email"
                name="email"
                placeholder="Email Address"
                value={campusUser.email}
                onChange={onChangeHandler}
                
                style={{ border: "none", padding: "10px 30px" }}
                className="w-full pl-10 pr-4 py-3 bg-black/50 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-yellow-400 focus:border-yellow-400 transition-all duration-200 text-center hover:border-gray-600"
              />
            </div>
            {errors.email && (
              <p className="text-red-500 font-bold text-sm mt-1 text-center">
                {errors.email}
              </p>
            )}
          </div>

          {/* Role Selection and Submit Button Row */}
          <div className="flex gap-4 mt-6">
            {/* Role Selection */}
            <div className="flex-1">
              <div className="relative">
                <Shield className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400 z-10" />
                <select
                  name="role"
                  value={campusUser.role}
                  onChange={onChangeHandler}
                  
                  className="w-full pl-10 pr-4 py-3 bg-black/50 rounded-md text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-yellow-400 focus:border-yellow-400 transition-all duration-200 text-center hover:border-gray-600"
                >
                  <option value="" disabled>
                    Select Role
                  </option>
                  <option value="Student">Student</option>
                  <option value="Admin">Admin</option>
                </select>
              </div>
              {errors.role && (
                <p className="text-red-500 font-bold text-sm mt-1 text-center">
                  {errors.role}
                </p>
              )}
            </div>

            {/* Submit Button */}
            <div className="flex-1">
              <button
                type="submit"
                disabled={isSubmitting}
                style={{
                  border: "none",
                  cursor: isSubmitting ? "not-allowed" : "pointer",
                }}
                className="signup-button group bg-yellow-400 text-black w-full py-2.5 rounded-md cursor-pointer outline-none flex items-center justify-center font-bold hover:bg-yellow-500 transition-all disabled:opacity-50"
              >
                <span className="flex items-center justify-center">
                  {isSubmitting ? "CREATING ACCOUNT..." : "CREATE ACCOUNT"}
                  <ArrowRight className="h-5 w-5 ml-2 transition-transform duration-300 group-hover:translate-x-1" />
                </span>
              </button>
            </div>
          </div>
        </form>

        {/* Footer Section */}
        <div className="text-center text-white/90 text-sm pt-2">
          Already have an account?{" "}
          <a
            href="/"
            className="text-yellow-400 hover:underline hover:yellow-500"
          >
            Sign in here
          </a>
        </div>
      </div>
    </>
  );
};

export default SignupForm;
