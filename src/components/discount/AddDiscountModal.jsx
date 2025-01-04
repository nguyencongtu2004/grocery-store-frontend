import { useState } from "react";
import { Modal, ModalContent, ModalHeader, ModalBody, ModalFooter, Button, Input } from "@nextui-org/react";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { createDiscount } from "../../requests/discount";
import { toast } from "react-hot-toast";
import PropTypes from "prop-types";

export default function AddDiscountModal({ isOpen, onOpenChange }) {
  const [code, setCode] = useState("");
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [discountInPercent, setDiscountInPercent] = useState("");
  const [minOrderValue, setMinOrderValue] = useState("");
  const [maxDiscountValue, setMaxDiscountValue] = useState("");
  const [usageLimit, setUsageLimit] = useState("");
  const [expireDate, setExpireDate] = useState("");

  const queryClient = useQueryClient();

  const { mutate: addDiscount, isLoading } = useMutation({
    mutationFn: createDiscount,
    onSuccess: () => {
      queryClient.invalidateQueries(["discount"]);
      toast.success("Discount added successfully");
      onOpenChange(false);
      resetForm();
    },
    onError: (error) => {
      toast.error(error.message || "Failed to add discount");
    },
  });

  const handleSubmit = (e) => {
    e.preventDefault();
    addDiscount({ code, name, description, discountInPercent: Number(discountInPercent), minOrderValue: Number(minOrderValue), maxDiscountValue: Number(maxDiscountValue), usageLimit: Number(usageLimit), expireDate });
  };

  const resetForm = () => {
    setCode("");
    setName("");
    setDescription("");
    setDiscountInPercent("");
    setMinOrderValue("");
    setMaxDiscountValue("");
    setUsageLimit("");
    setExpireDate("");
  };

  return (
    <Modal isOpen={isOpen} onOpenChange={onOpenChange}>
      <ModalContent>
        {(onClose) => (
          <form onSubmit={handleSubmit}>
            <ModalHeader className="flex flex-col gap-1">Add New Discount</ModalHeader>
            <ModalBody>
              <Input
                label="Code"
                placeholder="Enter discount code"
                value={code}
                onChange={(e) => setCode(e.target.value)}
                required
              />
              <Input
                label="Name"
                placeholder="Enter discount name"
                value={name}
                onChange={(e) => setName(e.target.value)}
                required
              />
              <Input
                label="Description"
                placeholder="Enter description"
                value={description}
                onChange={(e) => setDescription(e.target.value)}
              />
              <Input
                label="Discount Percentage"
                placeholder="Enter discount percentage"
                type="number"
                value={discountInPercent}
                onChange={(e) => setDiscountInPercent(e.target.value)}
                required
              />
              <Input
                label="Minimum Order Value"
                placeholder="Enter minimum order value"
                type="number"
                value={minOrderValue}
                onChange={(e) => setMinOrderValue(e.target.value)}
                required
              />
              <Input
                label="Maximum Discount Value"
                placeholder="Enter maximum discount value"
                type="number"
                value={maxDiscountValue}
                onChange={(e) => setMaxDiscountValue(e.target.value)}
                required
              />
              <Input
                label="Usage Limit"
                placeholder="Enter usage limit"
                type="number"
                value={usageLimit}
                onChange={(e) => setUsageLimit(e.target.value)}
                required
              />
              <Input
                label="Expire Date"
                placeholder="Enter expire date"
                type="date"
                value={expireDate}
                onChange={(e) => setExpireDate(e.target.value)}
                required
              />
            </ModalBody>
            <ModalFooter>
              <Button color="danger" variant="light" onPress={onClose}>
                Cancel
              </Button>
              <Button color="primary" type="submit" isLoading={isLoading}>
                Add Discount
              </Button>
            </ModalFooter>
          </form>
        )}
      </ModalContent>
    </Modal>
  );
}

AddDiscountModal.propTypes = {
  isOpen: PropTypes.bool,
  onOpenChange: PropTypes.func,
};

