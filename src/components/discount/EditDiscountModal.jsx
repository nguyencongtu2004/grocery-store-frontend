import { useState, useEffect } from "react";
import { Modal, ModalContent, ModalHeader, ModalBody, ModalFooter, Button, Input } from "@nextui-org/react";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { updateDiscount } from "../../requests/discount";
import { toast } from "react-hot-toast";
import PropTypes from "prop-types";

export default function EditDiscountModal({ isOpen, onOpenChange, discount }) {
  const [code, setCode] = useState("");
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [discountInPercent, setDiscountInPercent] = useState("");
  const [minOrderValue, setMinOrderValue] = useState("");
  const [maxDiscountValue, setMaxDiscountValue] = useState("");
  const [usageLimit, setUsageLimit] = useState("");
  const [expireDate, setExpireDate] = useState("");

  useEffect(() => {
    if (discount) {
      setCode(discount.code || "");
      setName(discount.name || "");
      setDescription(discount.description || "");
      setDiscountInPercent(discount.discountInPercent?.toString() || "");
      setMinOrderValue(discount.minOrderValue?.toString() || "");
      setMaxDiscountValue(discount.maxDiscountValue?.toString() || "");
      setUsageLimit(discount.usageLimit?.toString() || "");
      setExpireDate(discount.expireDate ? new Date(discount.expireDate).toISOString().split('T')[0] : "");
    }
  }, [discount]);

  const queryClient = useQueryClient();

  const { mutate: editDiscount, isLoading } = useMutation({
    mutationFn: updateDiscount,
    onSuccess: () => {
      queryClient.invalidateQueries(["discount"]);
      toast.success("Discount updated successfully");
      onOpenChange(false);
    },
    onError: (error) => {
      toast.error(error.message || "Failed to update discount");
    },
  });

  const handleSubmit = (e) => {
    e.preventDefault();
    editDiscount({ id: discount._id, code, name, description, discountInPercent: Number(discountInPercent), minOrderValue: Number(minOrderValue), maxDiscountValue: Number(maxDiscountValue), usageLimit: Number(usageLimit), expireDate });
  };

  return (
    <Modal isOpen={isOpen} onOpenChange={onOpenChange}>
      <ModalContent>
        {(onClose) => (
          <form onSubmit={handleSubmit}>
            <ModalHeader className="flex flex-col gap-1">Edit Discount</ModalHeader>
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
                Update Discount
              </Button>
            </ModalFooter>
          </form>
        )}
      </ModalContent>
    </Modal>
  );
}

EditDiscountModal.propTypes = {
  isOpen: PropTypes.bool,
  onOpenChange: PropTypes.func,
  discount: PropTypes.object,
};

