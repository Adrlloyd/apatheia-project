import { render, screen, fireEvent } from '@testing-library/react';
import Modal from 'src/components/Modal';

describe('Modal', () => {
  let confirmMock;
  let cancelMock;

  beforeEach(() => {
    confirmMock = jest.fn();
    cancelMock = jest.fn();
  });

  it('renders the modal with message and confirm button', () => {
    render(
      <Modal
        message="Are you sure?"
        confirmText="Yes"
        onConfirm={confirmMock}
      />
    );

    expect(screen.getByText('Are you sure?')).toBeInTheDocument();
    expect(screen.getByRole('button', { name: 'Yes' })).toBeInTheDocument();
  });

  it('calls onConfirm when confirm button is clicked', () => {
    render(
      <Modal
        message="Confirm it?"
        confirmText="Confirm"
        onConfirm={confirmMock}
      />
    );

    fireEvent.click(screen.getByRole('button', { name: 'Confirm' }));
    expect(confirmMock).toHaveBeenCalled();
  });

  it('renders cancel button if cancelText and onCancel are provided', () => {
    render(
      <Modal
        message="Delete this?"
        confirmText="Delete"
        onConfirm={confirmMock}
        cancelText="Cancel"
        onCancel={cancelMock}
      />
    );

    expect(screen.getByRole('button', { name: 'Cancel' })).toBeInTheDocument();
  });

  it('calls onCancel when cancel button is clicked', () => {
    render(
      <Modal
        message="Exit?"
        confirmText="OK"
        onConfirm={confirmMock}
        cancelText="Nope"
        onCancel={cancelMock}
      />
    );

    fireEvent.click(screen.getByRole('button', { name: 'Nope' }));
    expect(cancelMock).toHaveBeenCalled();
  });

  it('does not render cancel button if cancelText or onCancel missing', () => {
    render(
      <Modal
        message="Something"
        confirmText="Continue"
        onConfirm={confirmMock}
      />
    );

    expect(screen.queryByRole('button', { name: /cancel/i })).not.toBeInTheDocument();
  });
});