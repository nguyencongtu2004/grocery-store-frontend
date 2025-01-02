import { useQuery } from "@tanstack/react-query";
import { Modal, ModalContent, ModalHeader, ModalBody, ModalFooter, Button, Spinner } from "@nextui-org/react";
import { fetchProviderById } from "../../requests/provider";
import PropTypes from "prop-types";

export default function ProviderDetailModal({ isOpen, onOpenChange, providerId }) {
  const { data, isLoading } = useQuery({
    queryKey: ["provider", providerId],
    queryFn: () => fetchProviderById({ id: providerId }),
    enabled: !!providerId,
  });
  
  const provider = data?.data;

  return (
    <Modal isOpen={isOpen} onOpenChange={onOpenChange}>
      <ModalContent>
        {(onClose) => (
          <>
            <ModalHeader className="flex flex-col gap-1">Provider Details</ModalHeader>
            <ModalBody>
              {isLoading ? (
                <div className="flex justify-center">
                  <Spinner size="lg" />
                </div>
              ) : provider ? (
                <div className="space-y-4">
                  <div>
                    <h3 className="text-lg font-semibold">Name</h3>
                    <p>{provider.name}</p>
                  </div>
                  <div>
                    <h3 className="text-lg font-semibold">Phone Number</h3>
                    <p>{provider.phoneNumber || "Not provided"}</p>
                  </div>
                  <div>
                    <h3 className="text-lg font-semibold">Email</h3>
                    <p>{provider.email || "Not provided"}</p>
                  </div>
                  <div>
                    <h3 className="text-lg font-semibold">Address</h3>
                    <p>{provider.address || "Not provided"}</p>
                  </div>
                </div>
              ) : (
                <p>No provider data available</p>
              )}
            </ModalBody>
            <ModalFooter>
              <Button color="primary" onPress={onClose}>
                Close
              </Button>
            </ModalFooter>
          </>
        )}
      </ModalContent>
    </Modal>
  );
}

ProviderDetailModal.propTypes = {
  isOpen: PropTypes.bool,
  onOpenChange: PropTypes.func,
  providerId: PropTypes.string,
};