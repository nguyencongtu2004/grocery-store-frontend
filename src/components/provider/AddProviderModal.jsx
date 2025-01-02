import { useState } from "react";
import { Modal, ModalContent, ModalHeader, ModalBody, ModalFooter, Button, Input } from "@nextui-org/react";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { createProvider } from "../../requests/provider";
import { toast } from "react-hot-toast";
import PropTypes from "prop-types";

export default function AddProviderModal({ isOpen, onOpenChange }) {
  const [name, setName] = useState("");
  const [phoneNumber, setPhoneNumber] = useState("");
  const [email, setEmail] = useState("");
  const [address, setAddress] = useState("");

  const queryClient = useQueryClient();

  const { mutate: addProvider, isLoading } = useMutation({
    mutationFn: createProvider,
    onSuccess: () => {
      queryClient.invalidateQueries(["provider"]);
      toast.success("Provider added successfully");
      onOpenChange(false);
      resetForm();
    },
    onError: (error) => {
      toast.error(error.message || "Failed to add provider");
    },
  });

  const handleSubmit = (e) => {
    e.preventDefault();
    addProvider({ name, phoneNumber, email, address });
  };

  const resetForm = () => {
    setName("");
    setPhoneNumber("");
    setEmail("");
    setAddress("");
  };

  return (
    <Modal isOpen={isOpen} onOpenChange={onOpenChange}>
      <ModalContent>
        {(onClose) => (
          <form onSubmit={handleSubmit}>
            <ModalHeader className="flex flex-col gap-1">Add New Provider</ModalHeader>
            <ModalBody>
              <Input
                label="Name"
                placeholder="Enter provider name"
                value={name}
                onChange={(e) => setName(e.target.value)}
                required
              />
              <Input
                label="Phone Number"
                placeholder="Enter phone number"
                value={phoneNumber}
                onChange={(e) => setPhoneNumber(e.target.value)}
                required
              />
              <Input
                label="Email"
                placeholder="Enter email address"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
              <Input
                label="Address"
                placeholder="Enter address"
                value={address}
                onChange={(e) => setAddress(e.target.value)}
                required
              />
            </ModalBody>
            <ModalFooter>
              <Button color="danger" variant="light" onPress={onClose}>
                Cancel
              </Button>
              <Button color="primary" type="submit" isLoading={isLoading}>
                Add Provider
              </Button>
            </ModalFooter>
          </form>
        )}
      </ModalContent>
    </Modal>
  );
}

AddProviderModal.propTypes = {
  isOpen: PropTypes.bool,
  onOpenChange: PropTypes.func,
};