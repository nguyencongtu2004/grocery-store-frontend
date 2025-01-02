import { Modal, ModalContent, ModalHeader, ModalBody, ModalFooter, Button, Input } from "@nextui-org/react";
import { useQuery } from "@tanstack/react-query";
import { Image as ImageIcon } from "lucide-react";
import PropTypes from "prop-types";
import { getProductById } from "../../requests/product";

export default function ViewProductModal({ isOpen, onClose, product }) {
  const { data } = useQuery({
    queryKey: ["product", product?._id],
    queryFn: () => getProductById({ id: product?._id }),
    enabled: !!product?._id,
  });

  const productDetail = data?.data?.data || {};

  return (
    <Modal isOpen={isOpen} onClose={onClose} size="2xl" placement="center">
      <ModalContent>
        <ModalHeader className="flex flex-col gap-1">
          <h2 className="text-xl font-bold text-center">{productDetail?.name || 'View Product'}</h2>
        </ModalHeader>
        <ModalBody>
          <div className="grid grid-cols-4 gap-4 mb-6">
            {productDetail?.images?.map((image, index) => (
              <div
                key={`image-${index}`}
                className="border rounded-lg p-4 flex items-center justify-center h-24"
              >
                {image ? (
                  <img
                    src={image}
                    alt={`Product Image ${index + 1}`}
                    className="w-full h-full object-cover rounded"
                  />
                ) : (
                  <div className="text-blue-500 flex items-center">
                    <ImageIcon size={24} />
                    <span className="ml-2 text-blue-500">Image {index + 1}</span>
                  </div>
                )}
              </div>
            ))}
          </div>

          <div className="grid grid-cols-2 gap-4">
            <Input
              label="Product Name"
              value={productDetail?.name || "N/A"}
              readOnly
              variant="bordered"
            />
            <Input
              label="Category"
              value={productDetail?.category?.name || "Uncategorized"}
              readOnly
              variant="bordered"
            />
            <Input
              label="Stock Quantity"
              value={productDetail?.stockQuantity || "0"}
              readOnly
              variant="bordered"
            />
            <Input
              label="Selling Price"
              value={productDetail?.sellingPrice || "N/A"}
              readOnly
              variant="bordered"
            />
            <Input
              label="Import Date"
              value={productDetail?.importDate ? new Date(productDetail.importDate).toLocaleDateString() : "N/A"}
              readOnly
              variant="bordered"
            />
            <Input
              label="Expiration Date"
              value={productDetail?.expireDate ? new Date(productDetail.expireDate).toLocaleDateString() : "N/A"}
              readOnly
              variant="bordered"
            />
          </div>
        </ModalBody>
        <ModalFooter>
          <Button color="danger" variant="light" onClick={onClose}>
            Close
          </Button>
        </ModalFooter>
      </ModalContent>
    </Modal>
  );
}

ViewProductModal.propTypes = {
  isOpen: PropTypes.bool.isRequired,
  onClose: PropTypes.func.isRequired,
  product: PropTypes.object,
};
