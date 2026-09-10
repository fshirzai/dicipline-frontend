import React from 'react';
import toast from 'react-hot-toast';
import styled from 'styled-components';

const ToastContainer = styled.div`
  display: flex;
  align-items: center;
  gap: 12px;
  padding: 4px 0;

  .icon {
    font-size: 1.5rem;
  }

  .content {
    flex: 1;

    .title {
      font-weight: 600;
      font-size: 0.95rem;
    }

    .message {
      font-size: 0.85rem;
      opacity: 0.8;
    }
  }
`;

export const showToast = {
  success: (title, message = '') => {
    toast.success(
      <ToastContainer>
        <div className="icon">✅</div>
        <div className="content">
          <div className="title">{title}</div>
          {message && <div className="message">{message}</div>}
        </div>
      </ToastContainer>
    );
  },
  error: (title, message = '') => {
    toast.error(
      <ToastContainer>
        <div className="icon">❌</div>
        <div className="content">
          <div className="title">{title}</div>
          {message && <div className="message">{message}</div>}
        </div>
      </ToastContainer>
    );
  },
  warning: (title, message = '') => {
    toast.custom(
      <ToastContainer>
        <div className="icon">⚠️</div>
        <div className="content">
          <div className="title">{title}</div>
          {message && <div className="message">{message}</div>}
        </div>
      </ToastContainer>
    );
  },
  info: (title, message = '') => {
    toast.custom(
      <ToastContainer>
        <div className="icon">ℹ️</div>
        <div className="content">
          <div className="title">{title}</div>
          {message && <div className="message">{message}</div>}
        </div>
      </ToastContainer>
    );
  },
};

export default showToast;