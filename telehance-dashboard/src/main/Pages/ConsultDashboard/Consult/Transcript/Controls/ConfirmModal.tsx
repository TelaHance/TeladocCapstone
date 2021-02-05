import React from 'react';
import Modal from 'react-bootstrap/Modal';
import Button from 'react-bootstrap/Button';

export default function ConfirmModal({
  show,
  onConfirm,
  onCancel,
}: ConfirmModalProps) {
  return (
    <Modal
      show={show}
      onHide={onCancel}
      aria-labelledby='confirm-transcript-delete-modal'
      centered
    >
      <Modal.Header>
        <Modal.Title id='confirm-transcript-delete-modal'>
          Are you sure?
        </Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <p>
          Deleting will <strong>permanently</strong> delete any edits you made to the transcript.
        </p>
        <i>The original version cannot be deleted.</i>
      </Modal.Body>
      <Modal.Footer>
        <Button variant='secondary' onClick={onCancel}>
          Cancel
        </Button>
        <Button variant='danger' onClick={onConfirm}>
          Delete
        </Button>
      </Modal.Footer>
    </Modal>
  );
}

export type ConfirmModalProps = {
  show: boolean;
  onConfirm: () => void;
  onCancel: () => void;
};
