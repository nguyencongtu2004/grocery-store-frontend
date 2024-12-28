import { useState } from "react";
import { Modal, ModalContent, ModalHeader, ModalBody, ModalFooter, Button, Input } from "@nextui-org/react";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { createCustomer } from "../../requests/customer";
import PropTypes from "prop-types";

export default function AddCustomerModal({ isOpen, onOpenChange }) {
  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [address, setAddress] = useState("");

  const queryClient = useQueryClient();

  const { mutate, isLoading } = useMutation({
    mutationFn: createCustomer,
    onSuccess: () => {
      queryClient.invalidateQueries(["customer"]);
      onOpenChange(false);
    },
    onError: (error) => {
      console.error("Error creating customer:", error);
    }
  });

  const handleSubmit = () => {
    mutate({ name, phone, address });
  };

  return (
    <Modal isOpen={isOpen} onOpenChange={onOpenChange} placement="top-center">
      <ModalContent>
        {(onClose) => (
          <>
            <ModalHeader className="flex flex-col gap-1">Add New Customer</ModalHeader>
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
                Add Customer
              </Button>
            </ModalFooter>
          </>
        )}
      </ModalContent>
    </Modal>
  );
}

AddCustomerModal.propTypes = {
  isOpen: PropTypes.bool,
  onOpenChange: PropTypes.func,
};