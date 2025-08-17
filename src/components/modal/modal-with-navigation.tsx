import { useNavigate } from 'react-router-dom';
import React, { ReactNode } from 'react';
import { Modal } from '@components';

export function ModalWithNavigation(props: {
  title?: string;
  children?: ReactNode;
}) {
  let { title, children } = props;
  const navigate = useNavigate();
  return (
    <Modal title={title} onClose={() => navigate(-1)}>
      {children}
    </Modal>
  );
}
