import { useQuery } from "@tanstack/react-query";
import { Modal, ModalContent, ModalHeader, ModalBody, ModalFooter, Button, Spinner } from "@nextui-org/react";
import { fetchDiscountById } from "../../requests/discount";
import PropTypes from "prop-types";
import { Percent, Calendar, DollarSign, Tag, Hash, FileText, ShoppingBag, RefreshCw } from 'lucide-react';
import { formatDateTime, formatPrice } from "../../ultis/ultis";

export default function DiscountDetailModal({ isOpen, onOpenChange, discountId }) {
  const { data, isLoading } = useQuery({
    queryKey: ["discount", discountId],
    queryFn: () => fetchDiscountById({ id: discountId }),
    enabled: !!discountId,
  });
  
  const discount = data?.data;

  return (
    <Modal isOpen={isOpen} onOpenChange={onOpenChange}>
      <ModalContent>
        {(onClose) => (
          <>
            <ModalHeader className="flex flex-col gap-1">Discount Details</ModalHeader>
            <ModalBody>
              {isLoading ? (
                <div className="flex justify-center">
                  <Spinner size="lg" />
                </div>
              ) : discount ? (
                <div className="space-y-4">
                  <div className="flex items-center">
                    <Tag className="mr-2" size={16} />
                    <h3 className="text-lg font-semibold">Code:</h3>
                    <p className="ml-2">{discount.code}</p>
                  </div>
                  <div className="flex items-center">
                    <Hash className="mr-2" size={16} />
                    <h3 className="text-lg font-semibold">Name:</h3>
                    <p className="ml-2">{discount.name}</p>
                  </div>
                  <div className="flex items-center">
                    <FileText className="mr-2" size={16} />
                    <h3 className="text-lg font-semibold">Description:</h3>
                    <p className="ml-2">{discount.description}</p>
                  </div>
                  <div className="flex items-center">
                    <Percent className="mr-2" size={16} />
                    <h3 className="text-lg font-semibold">Discount Percentage:</h3>
                    <p className="ml-2">{discount.discountInPercent}%</p>
                  </div>
                  <div className="flex items-center">
                    <ShoppingBag className="mr-2" size={16} />
                    <h3 className="text-lg font-semibold">Minimum Order Value:</h3>
                      <p className="ml-2">{formatPrice(discount.minOrderValue)}</p>
                  </div>
                  <div className="flex items-center">
                    <DollarSign className="mr-2" size={16} />
                    <h3 className="text-lg font-semibold">Maximum Discount Value:</h3>
                    <p className="ml-2">{formatPrice(discount.maxDiscountValue)}</p>
                  </div>
                  <div className="flex items-center">
                    <RefreshCw className="mr-2" size={16} />
                    <h3 className="text-lg font-semibold">Usage Limit:</h3>
                    <p className="ml-2">{discount.usageLimit}</p>
                  </div>
                  <div className="flex items-center">
                    <Calendar className="mr-2" size={16} />
                    <h3 className="text-lg font-semibold">Expire Date:</h3>
                      <p className="ml-2">{formatDateTime(new Date(discount.expireDate))}</p>
                  </div>
                </div>
              ) : (
                <p>No discount data available</p>
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

DiscountDetailModal.propTypes = {
  isOpen: PropTypes.bool,
  onOpenChange: PropTypes.func,
  discountId: PropTypes.string,
};

