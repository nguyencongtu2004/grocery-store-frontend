import { Avatar, Button, Skeleton, Popover, PopoverTrigger, PopoverContent } from "@nextui-org/react";
import Logo from "../Logo.jsx";
import { Menu, LogOut } from 'lucide-react';
import { Link, useNavigate } from "react-router-dom";
import Row from "./Row.jsx";
import { getAuthToken, getUserId, removeAuth } from "../../ultis/auth.js";
import { useQuery } from "@tanstack/react-query";
import { fetchUser } from "../../requests/user.js";

export default function Header() {
  const navigate = useNavigate();

  const { data, isLoading } = useQuery({
    queryKey: ["user", getUserId()],
    queryFn: fetchUser,
  });

  const user = data?.data?.user;

  const isLoggedIn = !!getAuthToken();

  const handleLogout = () => {
    removeAuth();
    navigate('/login');
  };

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
                <Popover placement="bottom-end">
                  <PopoverTrigger>
                    <Button
                      variant="light"
                      className="h-full"
                      isDisabled={isLoading}
                    >
                      <Row className="items-center gap-4">
                        {isLoading ? (
                          <Skeleton className="w-32 h-4 rounded-full" />
                        ) : (
                          <h3 className="font-semibold text-lg">{user?.name ?? 'No Name'}</h3>
                        )}
                        <Avatar
                          src={user?.avatar}
                          name={user?.name}
                          className="w-12 h-12"
                        />
                      </Row>
                    </Button>
                  </PopoverTrigger>
                  <PopoverContent>
                    <div className="px-1 py-2">
                      <Link to="profile" className="block mb-2">
                        <Button fullWidth variant="light">
                          Profile
                        </Button>
                      </Link>
                      <Button
                        fullWidth
                        color="danger"
                        startContent={<LogOut size={18} />}
                        onPress={handleLogout}
                      >
                        Logout
                      </Button>
                    </div>
                  </PopoverContent>
                </Popover>
              </>
            )}
          </div>
          {!isLoggedIn && (
            <div className="hidden gap-4 md:flex">
              <Link to="/login">
                <Button color="primary" radius="md" className="flex-1">
                  Login
                </Button>
              </Link>
            </div>
          )}
        </div>
      </div>
    </>
  );
}

