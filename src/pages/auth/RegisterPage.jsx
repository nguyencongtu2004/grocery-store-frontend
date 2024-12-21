import { Button, Input, Select, SelectItem } from "@nextui-org/react";
import { useState } from "react";
import { Form, useNavigate } from "react-router-dom";
import { validateEmail, validatePassword } from "../../ultis/validation";
import Logo from "../../components/Logo";
import { EyeIcon as EyeClosed, EyeIcon } from 'lucide-react';
import { loginUser, registerUser } from "../../requests/user";

export default function RegisterPage() {
  const [isVisible, setIsVisible] = useState(false);
  const [isEmailValid, setIsEmailValid] = useState(true);
  const [isPasswordValid, setIsPasswordValid] = useState(true);
  const [isConfirmPasswordValid, setIsConfirmPasswordValid] = useState(true);
  const [errorMessage, setErrorMessage] = useState("");
  const navigate = useNavigate();
  const toggleVisibility = () => setIsVisible(!isVisible);

  async function handleSubmit(e) {
    e.preventDefault();
    const fd = new FormData(e.target);
    const data = Object.fromEntries(fd.entries());

    let isValid = true;

    if (!validateEmail(data.email)) {
      setIsEmailValid(false);
      isValid = false;
    } else {
      setIsEmailValid(true);
    }
    if (!validatePassword(data.password)) {
      setIsPasswordValid(false);
      isValid = false;
    } else {
      setIsPasswordValid(true);
    }
    if (data.password !== data.confirmPassword) {
      setIsConfirmPasswordValid(false);
      isValid = false;
    } else {
      setIsConfirmPasswordValid(true);
    }

    if (!isValid) return;

    console.log(data);

    // xử lý với server
    const response = await registerUser({
      data,
    });
    if (response.status === 201) {
      const response = await loginUser({
        data,
      });
      if (response.status === 200) {
        navigate("/");
      } else {
        setErrorMessage(response.data.message);
      }
    } else {
      setErrorMessage(response.data.message);
    }
  }

  function handleLogin() {
    navigate("/login");
  }

  return (
    <div className="flex min-h-screen w-full flex-col items-center justify-center px-5 py-6">
      <div className="w-full flex flex-col justify-center items-center border p-10 max-w-md mx-auto space-y-4">
        <Logo />
        <Form className="w-full" onSubmit={handleSubmit}>
          <Input
            className="pb-4"
            fullWidth
            isClearable
            type="email"
            label="Email"
            variant="bordered"
            labelPlacement="outside"
            placeholder="Enter your email"
            name="email"
            isInvalid={!isEmailValid}
            errorMessage={isEmailValid ? "" : "Email invalid"}
          />
          <Input
            className="pb-4"
            fullWidth
            type={isVisible ? "text" : "password"}
            label="Password"
            placeholder="Enter your password"
            variant="bordered"
            name="password"
            labelPlacement="outside"
            isInvalid={!isPasswordValid}
            errorMessage={
              isPasswordValid ? "" : "Password must be at least 8 characters"
            }
            endContent={
              <button
                className="ring-0 focus:outline-none"
                type="button"
                onClick={toggleVisibility}
                aria-label="toggle password visibility"
              >
                {isVisible ? (
                  <EyeClosed className="text-2xl text-default-400 pointer-events-none" />
                ) : (
                  <EyeIcon className="text-2xl text-default-400 pointer-events-none" />
                )}
              </button>
            }
          />
          <Input
            className="pb-4"
            fullWidth
            type={isVisible ? "text" : "password"}
            label="Re-enter password"
            placeholder="Re-enter your password"
            variant="bordered"
            name="confirmPassword"
            labelPlacement="outside"
            isInvalid={!isConfirmPasswordValid}
            errorMessage={
              isConfirmPasswordValid ? "" : "Password does not match"
            }
            endContent={
              <button
                className="ring-0 focus:outline-none"
                type="button"
                onClick={toggleVisibility}
                aria-label="toggle password visibility"
              >
                {isVisible ? (
                  <EyeClosed className="text-2xl text-default-400 pointer-events-none" />
                ) : (
                  <EyeIcon className="text-2xl text-default-400 pointer-events-none" />
                )}
              </button>
            }
          />
          <Select
            label="Vai trò"
            placeholder="Choose your role"
            className="pb-4"
            name="role"
          >
            <SelectItem key="manager" value="manager">Manager</SelectItem>
            <SelectItem key="sale" value="sale">Sell Agent</SelectItem>
            <SelectItem key="warehouse" value="warehouse">Warehouse</SelectItem>
            <SelectItem key="provider" value="provider">Provider</SelectItem>
            <SelectItem key="customer" value="customer">Customer</SelectItem>
          </Select>
          {errorMessage && (
            <p className="mb-4 text-red-500 text-sm">{errorMessage}</p>
          )}
          <div className="flex justify-center">
            <Button color="primary" type="submit">
              Register
            </Button>
          </div>
        </Form>        
        <div />

        <div className="flex flex-col gap-2">
          {/* <button
            className="text-primary underline transition-opacity hover:opacity-50"
            onClick={handleForgotPassword}
          >
            Quên mật khẩu
          </button> */}
          <p className="flex flex-row gap-2">
            <span>Already have an account?</span>
            <button
              onClick={handleLogin}
              className="text-primary underline transition-opacity hover:opacity-50"
            >
              Login
            </button>
          </p>
        </div>
      </div>
    </div>
  );
}

