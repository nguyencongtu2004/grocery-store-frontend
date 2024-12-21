import { Button, Input } from "@nextui-org/react";
import { useState } from "react";
import { Form, useNavigate } from "react-router-dom";
import Logo from "../../components/Logo";
import { validateEmail } from "../../ultis/validation";
import { EyeClosed, EyeIcon } from "lucide-react";
import { loginUser } from "../../requests/user";

export default function LoginPage() {
  const [isVisible, setIsVisible] = useState(false);
  const [isEmailValid, setIsEmailValid] = useState(true);
  const [errorMessage, setErrorMessage] = useState("");
  const navigate = useNavigate();
  const toggleVisibility = () => setIsVisible(!isVisible);

  async function handleSubmit(e) {
    e.preventDefault();
    const fd = new FormData(e.target);
    const data = Object.fromEntries(fd.entries());

    if (!validateEmail(data.email)) {
      setIsEmailValid(false);
      return;
    } else {
      setIsEmailValid(true);
    }

    // xử lý với server
    const response = await loginUser({
      data,
    });
    if (response.status === 200) {
      navigate("/");
    } else {
      setErrorMessage(response.data.message);
    }
  }

  return (
    <>
      <div className="flex min-h-screen w-full flex-col items-center justify-center px-5 py-6">
        <div className="w-full flex flex-col justify-center items-center border p-10 max-w-md min-w-[400px] mx-auto space-y-4">
          <Logo />
          <Form className="w-full" onSubmit={handleSubmit}>
            <Input
              defaultValue="manager@gmail.com"
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
              errorMessage={!isEmailValid ? "Email không hợp lệ" : ""}
            />
            <Input
              defaultValue="123"
              className="pb-4"
              fullWidth
              type={isVisible ? "text" : "password"}
              label="Password"
              placeholder="Enter your password"
              variant="bordered"
              name="password"
              labelPlacement="outside"
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
            {errorMessage && (
              <p className="mb-4 text-red-500 text-sm">{errorMessage}</p>
            )}
            <div className="flex justify-center">
              <Button color="primary" type="submit">
                Login
              </Button>
            </div>
          </Form>
          <div />
        </div>
      </div>
    </>
  );
}
