import { Modal, Button, Text, Group } from "@mantine/core";
import "./ConfirmModal.css";

/**
 * Themed confirmation modal component
 * Replaces window.confirm() with a styled, non-blocking modal
 * @param {boolean} opened - Whether the modal is open
 * @param {Function} onClose - Callback when modal is closed/cancelled
 * @param {Function} onConfirm - Callback when user confirms
 * @param {string} title - Modal title
 * @param {string} message - Confirmation message
 * @param {string} confirmText - Text for confirm button (default: "Confirm")
 * @param {string} cancelText - Text for cancel button (default: "Cancel")
 * @param {string} confirmColor - Color variant for confirm button (default: "red" for destructive actions)
 */
export default function ConfirmModal({
  opened,
  onClose,
  onConfirm,
  title = "Confirm Action",
  message,
  confirmText = "Confirm",
  cancelText = "Cancel",
  confirmColor = "red",
}) {
  const handleConfirm = () => {
    onConfirm();
    onClose();
  };

  return (
    <Modal
      opened={opened}
      onClose={onClose}
      title={title}
      centered
      lockScroll={false}
      classNames={{
        content: "confirm-modal-content",
        header: "confirm-modal-header",
        title: "confirm-modal-title",
        body: "confirm-modal-body",
      }}
      overlayProps={{
        opacity: 0.55,
        blur: 3,
      }}
    >
      <Text className="confirm-modal-message">{message}</Text>

      <Group justify="flex-end" mt="xl" gap="sm">
        <Button
          variant="subtle"
          onClick={onClose}
          className="confirm-modal-cancel"
        >
          {cancelText}
        </Button>
        <Button
          onClick={handleConfirm}
          className="confirm-modal-confirm"
          data-color={confirmColor}
        >
          {confirmText}
        </Button>
      </Group>
    </Modal>
  );
}
