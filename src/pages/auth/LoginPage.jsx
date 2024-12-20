import { Button, Divider, Input } from "@nextui-org/react";
import { useState } from "react";
import { Form, useNavigate } from "react-router-dom";
import facebookImg from "../../assets/images/facebook-logo.png";
import googleImg from "../../assets/images/google-logo.png";
import Logo from "../../components/Logo";
import { validateEmail, validatePassword } from "../../ultis/validation";
import { EyeClosed, EyeIcon } from "lucide-react";
import { loginUser } from "../../requests/user";

export default function LoginPage() {
  const [isVisible, setIsVisible] = useState(false);
  const [isEmailValid, setIsEmailValid] = useState(true);
  const [isPasswordValid, setIsPasswordValid] = useState(true);
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
    if (!validatePassword(data.password)) {
      setIsPasswordValid(false);
      return;
    } else {
      setIsPasswordValid(true);
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

  function handleRegister() {
    navigate("/register");
  }

  function handleForgotPassword() {
    // TODO: Implement forgot password
  }

  function handleLoginWithFacebook() {
    // TODO: Implement login with Facebook
  }

  function handleLoginWithGoogle() {
    // TODO: Implement login with Google
  }

  return (
    <>
      <div className="flex min-h-screen w-full flex-col items-center justify-center px-5 py-6">
        <div className="w-full flex flex-col justify-center items-center border p-10 max-w-md min-w-[400px] mx-auto space-y-4">
          <Logo />
          <Form className="w-full" onSubmit={handleSubmit}>
            <Input
              defaultValue="congtu2132044@gmail.com"
              className="pb-4"
              fullWidth
              isClearable
              type="email"
              label="Email"
              variant="bordered"
              labelPlacement="outside"
              placeholder="Nhập email"
              name="email"
              isInvalid={!isEmailValid}
              errorMessage={!isEmailValid ? "Email không hợp lệ" : ""}
            />
            <Input
              defaultValue="12345678"
              className="pb-4"
              fullWidth
              type={isVisible ? "text" : "password"}
              label="Mật khẩu"
              placeholder="Nhập mật khẩu"
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
              isInvalid={!isPasswordValid}
              errorMessage={
                !isPasswordValid ? "Mật khẩu phải có ít nhất 8 ký tự" : ""
              }
            />
            {errorMessage && (
              <p className="mb-4 text-red-500 text-sm">{errorMessage}</p>
            )}
            <div className="flex justify-center">
              <Button color="primary" type="submit">
                Đăng nhập
              </Button>
            </div>
          </Form>

          <div className="flex flex-row gap-2 items-center justify-center whitespace-nowrap">
            <Divider className="flex-grow border border-gray-300 max-w-[50%]" />
            <span className="text-gray-500">Hoặc đăng nhập bằng</span>
            <Divider className="flex-grow border border-gray-300 max-w-[50%]" />
          </div>

          <div className="flex flex-row gap-2">
            <Button color="">
              <img
                className="w-10 h-10"
                src={facebookImg}
                alt="facebook"
                onClick={handleLoginWithFacebook}
              />
            </Button>
            <Button color="">
              <img
                className="w-10 h-10"
                src={googleImg}
                alt="google"
                onClick={handleLoginWithGoogle}
              />
            </Button>
          </div>
          <div />
          <div className="flex flex-col gap-2">
            <button
              className="text-primary underline transition-opacity hover:opacity-50"
              onClick={handleForgotPassword}
            >
              Quên mật khẩu
            </button>
            <p className="flex flex-row gap-2">
              <span>Chưa có tài khoản?</span>
              <button
                onClick={handleRegister}
                className="text-primary underline transition-opacity hover:opacity-50"
              >
                Đăng ký
              </button>
            </p>
          </div>
        </div>
      </div>
    </>
  );
}
