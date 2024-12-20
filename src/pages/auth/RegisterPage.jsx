import { Button, Divider, Input } from "@nextui-org/react";
import { useState } from "react";
import { Form, useNavigate } from "react-router-dom";
import facebookImg from "../../assets/images/facebook-logo.png";
import googleImg from "../../assets/images/google-logo.png";
import { validateEmail, validatePassword } from "../../ultis/validation";
import Logo from "../../components/Logo";
import { EyeClosed, EyeIcon } from "lucide-react";
import { loginUser, registerUser } from "../../requests/user";
import Row from "../../components/layout/Row";
import Column from "../../components/layout/Column";

export default function RegisterPage() {
  const [isVisible, setIsVisible] = useState(false);
  const [isEmailValid, setIsEmailValid] = useState(true);
  const [isPasswordValid, setIsPasswordValid] = useState(true);
  const [isConfirmPasswordValid, setIsConfirmPasswordValid] = useState(true);
  const [isShopNameValid, setIsShopNameValid] = useState(true);
  const [isShopDescriptionValid, setIsShopDescriptionValid] = useState(true);
  const [isAddressValid, setIsAddressValid] = useState(true);
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
    if (!data.shopName.trim()) {
      setIsShopNameValid(false);
      isValid = false;
    } else {
      setIsShopNameValid(true);
    }
    if (!data.shopDescription.trim()) {
      setIsShopDescriptionValid(false);
      isValid = false;
    } else {
      setIsShopDescriptionValid(true);
    }
    if (!data.shopAddress.trim()) {
      setIsAddressValid(false);
      isValid = false;
    } else {
      setIsAddressValid(true);
    }

    if (!isValid) return;

    data.role = "seller";
    data.address = {
      nameOfLocation: data.shopName,
      location: data.shopAddress,
      phone: "",
    };
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

  function handleRegister() {
    navigate("/login");
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
    <div className="flex min-h-screen w-full flex-col items-center justify-center px-5 py-6">
      <div className="w-full flex flex-col justify-center items-center border p-10 max-w-md min-w-[800px] mx-auto space-y-4">
        <Logo />
        <Form className="w-full" onSubmit={handleSubmit}>
          <Row className="space-x-6">
            <Column className="flex-1">
              <Input
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
                errorMessage={isEmailValid ? "" : "Email không hợp lệ"}
              />
              <Input
                className="pb-4"
                fullWidth
                type={isVisible ? "text" : "password"}
                label="Mật khẩu"
                placeholder="Nhập mật khẩu"
                variant="bordered"
                name="password"
                labelPlacement="outside"
                isInvalid={!isPasswordValid}
                errorMessage={
                  isPasswordValid ? "" : "Mật khẩu phải có ít nhất 8 ký tự"
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
                label="Nhập lại mật khẩu"
                placeholder="Nhập lại mật khẩu"
                variant="bordered"
                name="confirmPassword"
                labelPlacement="outside"
                isInvalid={!isConfirmPasswordValid}
                errorMessage={
                  isConfirmPasswordValid ? "" : "Mật khẩu không khớp"
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
            </Column>
            <Column className="flex-1">
              <Input
                className="pb-4"
                fullWidth
                type="text"
                label="Tên cửa hàng"
                placeholder="Nhập tên của hàng của bạn"
                variant="bordered"
                name="shopName"
                labelPlacement="outside"
                isInvalid={!isShopNameValid}
                errorMessage={
                  isShopNameValid ? "" : "Vui lòng nhập tên cửa hàng"
                }
              />
              <Input
                className="pb-4"
                fullWidth
                type="text"
                label="Mô tả cửa hàng"
                placeholder="Mô tả ngắn về của hàng"
                variant="bordered"
                name="shopDescription"
                labelPlacement="outside"
                isInvalid={!isShopDescriptionValid}
                errorMessage={
                  isShopDescriptionValid ? "" : "Vui lòng nhập mô tả cửa hàng"
                }
              />
              <Input
                className="pb-4"
                fullWidth
                type="text"
                label="Địa chỉ cửa hàng"
                placeholder="Địa chỉ của hàng của bạn"
                variant="bordered"
                name="shopAddress"
                labelPlacement="outside"
                isInvalid={!isAddressValid}
                errorMessage={
                  isAddressValid ? "" : "Vui lòng nhập địa chỉ cửa hàng"
                }
              />
            </Column>
          </Row>
          {errorMessage && (
            <p className="mb-4 text-red-500 text-sm">{errorMessage}</p>
          )}
          <div className="flex justify-center">
            <Button color="primary" type="submit">
              Đăng ký
            </Button>
          </div>
        </Form>

        <div className="flex flex-row gap-2 items-center justify-center whitespace-nowrap">
          <Divider className="flex-grow border border-gray-300 max-w-[50%]" />
          <span className="text-gray-500">Hoặc đăng ký bằng</span>
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
            <span>Đã có tài khoản?</span>
            <button
              onClick={handleRegister}
              className="text-primary underline transition-opacity hover:opacity-50"
            >
              Đăng nhập
            </button>
          </p>
        </div>
      </div>
    </div>
  );
}
