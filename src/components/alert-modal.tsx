"use client";
import { forwardRef, useImperativeHandle, useState } from "react";
import { Modal, ModalContent, ModalHeader, ModalBody, ModalFooter, Button } from "@heroui/react";

interface AlertConfig {
  title?: string;
  message: string;
  onConfirm?: () => void;
}

export const AlertModal = forwardRef((_, ref) => {
  const [isOpen, setIsOpen] = useState(false);
  const [config, setConfig] = useState<AlertConfig>({
    title: "",
    message: "",
    onConfirm: () => {},
  });

  useImperativeHandle(ref, () => ({
    showAlert: (props: AlertConfig) => {
      setConfig(props);
      setIsOpen(true);
    },
  }));

  const handleConfirm = () => {
    if (config.onConfirm) {
      config.onConfirm();
    }
    setIsOpen(false);
  };

  const handleClose = () => {
    setIsOpen(false);
  };

  return (
    <Modal isOpen={isOpen} onOpenChange={handleClose} placement="auto">
      <ModalContent>
        {(onClose) => (
          <>
            <ModalHeader className="flex flex-col gap-1">{config.title || "Alert"}</ModalHeader>
            <ModalBody>
              <p>{config.message}</p>
            </ModalBody>
            <ModalFooter>
              <Button color="danger" variant="light" onPress={onClose}>
                Cancel
              </Button>
              <Button color="primary" onPress={handleConfirm}>
                Confirm
              </Button>
            </ModalFooter>
          </>
        )}
      </ModalContent>
    </Modal>
  );
});

AlertModal.displayName = "AlertModal";
