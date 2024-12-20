import { Avatar, Button, Skeleton } from "@nextui-org/react";
import Logo from "../Logo.jsx";
import { Menu } from "lucide-react";
import { Link } from "react-router-dom";
import Row from "./Row.jsx";
import { getAuthToken, getUserId } from "../../ultis/auth.js";
import { useQueries } from "@tanstack/react-query";
import { fetchUser } from "../../requests/user.js";

export default function Header() {
  const [
    { data: userData, isLoading: isUserLoading },
  ] = useQueries({
    queries: [
      {
        queryKey: ["user", getUserId()],
        queryFn: fetchUser,
      },
    ],
  });

  const user = userData?.data?.user;

  const isLoggedIn = !!getAuthToken();

  return (
    <>
      <div className="sticky top-0 z-50 flex items-center justify-between self-start bg-background p-4 shadow-sm dark:bg-gradient-to-br dark:from-slate-900 dark:to-black md:px-8">
        <Logo className="hidden md:inline-flex" />
        <div className="flex w-full justify-between gap-4 md:w-auto md:justify-start">
          
          <Button
            isIconOnly
            variant="light"
            radius="sm"
            className="inline-flex md:hidden"
            onPress={() => null}
          >
            <Menu size={24} />
          </Button>

          
          <Logo className="inline-flex md:hidden" />
          <div className="flex gap-4">
            {isLoggedIn && (
              <>
                <Link to="/profile">
                  <Button
                    variant="light"
                    className="h-full"
                    isDisabled={isUserLoading}
                  >
                    <Row className="items-center gap-4">
                      {isUserLoading ? (
                        <Skeleton className="w-32 h-4 rounded-full" />
                      ) : (
                        <h3 className="font-semibold text-lg">{user.shopName?? 'Chưa đặt tên'}</h3>
                      )}
                      <Avatar
                        src={user?.avatar}
                        name={user?.name}
                        className="w-12 h-12"
                      />
                    </Row>
                  </Button>
                </Link>
              </>
            )}

            {/* {user && <UserMenu user={user} />} */}
          </div>
          {!isLoggedIn && (
            <div className="hidden gap-4 md:flex">
              <Link to="/login">
                <Button color="primary" radius="md" className="flex-1">
                  Login
                </Button>
              </Link>
              <Link to="/register">
                <Button variant="flat" radius="md" className="flex-1">
                  Register
                </Button>
              </Link>
            </div>
          )}
        </div>
      </div>
    </>
  );
}
