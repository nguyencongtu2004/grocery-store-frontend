import { Modal, ModalContent, ModalHeader, ModalBody, ModalFooter, Button, Input } from "@nextui-org/react";
import { Mail, Lock, User, Briefcase, Phone, MapPin } from 'lucide-react';
import PropTypes from 'prop-types';

export default function AddProductModal({ isOpen, onClose }) {
  function handleSubmit(e) {
    e.preventDefault();
    const formData = new FormData(e.target);
    const productData = {
      provider: formData.get('provider'),
      orderDate: formData.get('orderDate'),
      product: formData.get('product'),
      images: formData.get('images'),
      productName: formData.get('productName'),
      category: formData.get('category'),
      importPrice: formData.get('importPrice'),
      stockQuantity: formData.get('stockQuantity'),
      sellingPrice: formData.get('sellingPrice'),
      expireDate: formData.get('expireDate')
    };
    console.log('New Purchase Order Data:', productData);
    onClose();
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      size="2xl"
      placement="center"
    >
      <ModalContent>
        <form onSubmit={handleSubmit}>
          <ModalHeader className="flex flex-col gap-1">
            <h2 className="text-xl font-bold">Add Product</h2>
          </ModalHeader>
          <ModalBody>
            <div className="grid gap-4">
              <Input
                autoFocus
                name="email"
                label="Email"
                placeholder="nguyencongtu@gmail.com"
                variant="bordered"
                startContent={<Mail size={18} />}
                required
              />
              <Input
                name="password"
                label="Password"
                placeholder="123456"
                type="password"
                variant="bordered"
                startContent={<Lock size={18} />}
                required
              />
              <div className="grid grid-cols-2 gap-4">
                <Input
                  name="name"
                  label="Name"
                  placeholder="Công Tú"
                  variant="bordered"
                  startContent={<User size={18} />}
                  required
                />
                <Input
                  name="role"
                  label="Role"
                  placeholder="Nhân viên kho"
                  variant="bordered"
                  startContent={<Briefcase size={18} />}
                  required
                />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <Input
                  name="phone"
                  label="Phone"
                  placeholder="0123456789"
                  variant="bordered"
                  startContent={<Phone size={18} />}
                  required
                />
                <Input
                  name="address"
                  label="Address"
                  placeholder="123, đường 456"
                  variant="bordered"
                  startContent={<MapPin size={18} />}
                  required
                />
              </div>
            </div>
          </ModalBody>
          <ModalFooter>
            <Button color="danger" variant="light" onPress={onClose}>
              Cancel
            </Button>
            <Button color="primary" type="submit">
              Add Product
            </Button>
          </ModalFooter>
        </form>
      </ModalContent>
    </Modal>
  );
}

AddProductModal.propTypes = {
  isOpen: PropTypes.bool.isRequired,
  onClose: PropTypes.func.isRequired
};