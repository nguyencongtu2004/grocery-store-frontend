import { useQuery } from "@tanstack/react-query";
import PageTitle from "../components/PageTitle";
import { fetchUser } from "../requests/user";
import { getUserId } from "../ultis/auth";
import {
  Mail,
  Phone,
  MapPin,
  Calendar,
  ShieldCheck
} from "lucide-react";
import { Avatar, Card, CardBody, Divider } from "@nextui-org/react";
import PropTypes from "prop-types";

export default function ProfilePage() {
  const { data, isLoading } = useQuery({
    queryKey: ["user", getUserId()],
    queryFn: fetchUser,
  });

  const user = data?.data?.user;

  if (isLoading) {
    return <PageTitle title="Profile" description="Loading profile..." isLoading={true} />;
  }

  if (!user) {
    return <PageTitle title="Profile" description="User not found" />;
  }

  return (
    <div className="container mx-auto px-4 py-6">
      <Card className="max-w-4xl mx-auto mt-6 shadow-lg">
        <CardBody>
          <div className="flex items-center space-x-6 mb-6">
            <Avatar
              src={user?.avatar}
              name={user?.name}
              className="w-24 h-24"
            />
            <div>
              <h2 className="text-2xl font-bold text-gray-800">{user.name}</h2>
              <p className="text-gray-500">{user.role}</p>
            </div>
          </div>

          <Divider className="my-4" />

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <ProfileInfoItem
              icon={<Mail size={20} />}
              label="Email"
              value={user.email}
            />
            <ProfileInfoItem
              icon={<Phone size={20} />}
              label="Phone"
              value={user.phone}
            />
            <ProfileInfoItem
              icon={<Calendar size={20} />}
              label="Birthday"
              value={new Date(user.birthday).toLocaleDateString()}
            />
            <ProfileInfoItem
              icon={<MapPin size={20} />}
              label="Address"
              value={user.address}
            />
            <ProfileInfoItem
              icon={<ShieldCheck size={20} />}
              label="Role"
              value={user.role}
            />
          </div>
        </CardBody>
      </Card>
    </div>
  );
}

function ProfileInfoItem({ icon, label, value }) {
  return (
    <div className="flex items-center space-x-3 bg-gray-50 p-3 rounded-lg">
      <div className="text-primary">{icon}</div>
      <div>
        <p className="text-sm text-gray-500">{label}</p>
        <p className="font-medium text-gray-800">{value}</p>
      </div>
    </div>
  );
}

ProfileInfoItem.propTypes = {
  icon: PropTypes.node,
  label: PropTypes.string,
  value: PropTypes.string
};