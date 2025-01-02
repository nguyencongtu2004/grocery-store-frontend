import { useState, useEffect } from "react";
import { Modal, ModalContent, ModalHeader, ModalBody, ModalFooter, Button, Input } from "@nextui-org/react";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { updateProvider } from "../../requests/provider";
import { toast } from "react-hot-toast";
import PropTypes from "prop-types";

export default function EditProviderModal({ isOpen, onOpenChange, provider }) {
  const [name, setName] = useState("");
  const [phoneNumber, setPhoneNumber] = useState("");
  const [email, setEmail] = useState("");
  const [address, setAddress] = useState("");

  useEffect(() => {
    if (provider) {
      setName(provider.name || "");
      setPhoneNumber(provider.phoneNumber || "");
      setEmail(provider.email || "");
      setAddress(provider.address || "");
    }
  }, [provider]);

  const queryClient = useQueryClient();

  const { mutate: editProvider, isLoading } = useMutation({
    mutationFn: updateProvider,
    onSuccess: () => {
      queryClient.invalidateQueries(["provider"]);
      toast.success("Provider updated successfully");
      onOpenChange(false);
    },
    onError: (error) => {
      toast.error(error.message || "Failed to update provider");
    },
  });

  const handleSubmit = (e) => {
    e.preventDefault();
    editProvider({ id: provider._id, name, phoneNumber, email, address });
  };

  return (
    <Modal isOpen={isOpen} onOpenChange={onOpenChange}>
      <ModalContent>
        {(onClose) => (
          <form onSubmit={handleSubmit}>
            <ModalHeader className="flex flex-col gap-1">Edit Provider</ModalHeader>
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
                Update Provider
              </Button>
            </ModalFooter>
          </form>
        )}
      </ModalContent>
    </Modal>
  );
}

EditProviderModal.propTypes = {
  isOpen: PropTypes.bool,
  onOpenChange: PropTypes.func,
  provider: PropTypes.object,
};