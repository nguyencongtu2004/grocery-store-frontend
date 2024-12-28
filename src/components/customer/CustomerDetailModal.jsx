import { Modal, ModalContent, ModalHeader, ModalBody, ModalFooter, Button, Spinner } from "@nextui-org/react";
import { User, Phone, MapPin, ShoppingCart, DollarSign } from 'lucide-react';
import PropTypes from "prop-types";
import { useQuery } from "@tanstack/react-query";
import { getCustomerDetail } from "../../requests/customer";

export default function CustomerDetailModal({ isOpen, onOpenChange, customerId }) {
  const { data: customerDetail, isLoading, error } = useQuery({
    queryKey: ["customerDetail", customerId],
    queryFn: ({ signal }) => getCustomerDetail({ id: customerId, signal }),
    enabled: isOpen && !!customerId
  });

  const customer = customerDetail?.data;

  return (
    <Modal isOpen={isOpen} onOpenChange={onOpenChange} placement="top-center" size="md">
      <ModalContent>
        {(onClose) => (
          <>
            <ModalHeader className="flex flex-col gap-1">Customer Details</ModalHeader>
            <ModalBody>
              {isLoading ? (
                <div className="flex justify-center items-center h-full">
                  <Spinner />
                </div>
              ) : error ? (
                <div className="text-red-500">
                  Error loading customer details: {error.message}
                </div>
              ) : customer ? (
                <div className="space-y-4">
                  <div className="flex items-center space-x-3">
                    <User size={20} className="text-gray-500" />
                    <div>
                      <p className="font-semibold">Name</p>
                      <p>{customer.name}</p>
                    </div>
                  </div>
                  <div className="flex items-center space-x-3">
                    <Phone size={20} className="text-gray-500" />
                    <div>
                      <p className="font-semibold">Phone</p>
                      <p>{customer.phone || 'Not provided'}</p>
                    </div>
                  </div>
                  <div className="flex items-center space-x-3">
                    <MapPin size={20} className="text-gray-500" />
                    <div>
                      <p className="font-semibold">Address</p>
                      <p>{customer.address || 'Not provided'}</p>
                    </div>
                  </div>
                  <div className="flex items-center space-x-3">
                    <ShoppingCart size={20} className="text-gray-500" />
                    <div>
                      <p className="font-semibold">Total Purchases</p>
                      <p>{customer.purchaseCount || 0}</p>
                    </div>
                  </div>
                  <div className="flex items-center space-x-3">
                    <DollarSign size={20} className="text-gray-500" />
                    <div>
                      <p className="font-semibold">Total Spent</p>
                      <p>
                        {customer.totalSpent 
                          ? new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(customer.totalSpent) 
                          : '0 VND'
                        }
                      </p>
                    </div>
                  </div>
                </div>
              ) : null}
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

CustomerDetailModal.propTypes = {
  isOpen: PropTypes.bool.isRequired,
  onOpenChange: PropTypes.func.isRequired,
  customerId: PropTypes.string.isRequired
};