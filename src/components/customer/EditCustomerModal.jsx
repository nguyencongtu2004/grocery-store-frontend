import { useState, useEffect } from "react";
import { Modal, ModalContent, ModalHeader, ModalBody, ModalFooter, Button, Input } from "@nextui-org/react";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { updateCustomer } from "../../requests/customer";
import PropTypes from "prop-types";
import toast from "react-hot-toast";

export default function EditCustomerModal({ isOpen, onOpenChange, customer }) {
  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [address, setAddress] = useState("");

  useEffect(() => {
    if (customer) {
      setName(customer.name);
      setPhone(customer.phone);
      setAddress(customer.address);
    }
  }, [customer]);

  const queryClient = useQueryClient();

  const { mutate, isLoading } = useMutation({
    mutationFn: updateCustomer,
    onSuccess: () => {
      queryClient.invalidateQueries(["customer"]);
      onOpenChange(false);
    },
    onError: (error) => {
      toast.error("Error updating customer:", error);
    }
  });

  const handleSubmit = () => {
    mutate({ 
      id: customer._id, 
      name, 
      phone, 
      address 
    });
  };

  return (
    <Modal isOpen={isOpen} onOpenChange={onOpenChange} placement="top-center">
      <ModalContent>
        {(onClose) => (
          <>
            <ModalHeader className="flex flex-col gap-1">Edit Customer</ModalHeader>
            <ModalBody>
              <Input
                autoFocus
                label="Name"
                placeholder="Enter customer name"
                variant="bordered"
                value={name}
                onValueChange={setName}
              />
              <Input
                label="Phone"
                placeholder="Enter phone number"
                variant="bordered"
                value={phone}
                onValueChange={setPhone}
              />
              <Input
                label="Address"
                placeholder="Enter customer address"
                variant="bordered"
                value={address}
                onValueChange={setAddress}
              />
            </ModalBody>
            <ModalFooter>
              <Button color="danger" variant="flat" onPress={onClose}>
                Close
              </Button>
              <Button 
                color="primary" 
                onPress={handleSubmit}
                isLoading={isLoading}
              >
                Update Customer
              </Button>
            </ModalFooter>
          </>
        )}
      </ModalContent>
    </Modal>
  );
}

EditCustomerModal.propTypes = {
  isOpen: PropTypes.bool,
  onOpenChange: PropTypes.func,
  customer: PropTypes.object
};