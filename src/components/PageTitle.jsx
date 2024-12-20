import { Button, Divider } from "@nextui-org/react";
import { Plus } from "lucide-react";
import PropTypes from "prop-types";
import { cn } from "./../ultis/ultis";
import Row from "./layout/Row";
import Column from "./layout/Column";

export default function PageTitle({
  title,
  description,
  buttonTitle,
  onButonClick,
  className,
  isLoading,
}) {
  return (
    <Column>
      <Row
        className={cn("w-full justify-between items-center mb-6", className)}
      >
        <div>
          <h1 className="text-2xl font-bold">{title}</h1>
          <p className="text-sm text-gray-500 mt-1">{description}</p>
        </div>
        {buttonTitle && <Button
          color="primary"
          onClick={onButonClick}
          startContent={<Plus size={20} />}
          isDisabled={isLoading}
        >
          {buttonTitle}
        </Button>}
      </Row>
      <Divider className="mb-6" />
    </Column>
  );
}

PageTitle.propTypes = {
  title: PropTypes.string.isRequired,
  description: PropTypes.string.isRequired,
  buttonTitle: PropTypes.string,
  onButonClick: PropTypes.func,
  className: PropTypes.string,
  isLoading: PropTypes.bool,
};
