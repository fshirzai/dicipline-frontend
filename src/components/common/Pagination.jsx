import React from 'react';
import styled from 'styled-components';
import { FiChevronLeft, FiChevronRight } from 'react-icons/fi';

const Container = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 8px;
  margin-top: 20px;
  padding: 16px 0;
`;

const PageButton = styled.button`
  padding: 6px 12px;
  border: 1px solid ${props => props.active ? props.theme.primary : props.theme.border};
  background: ${props => props.active ? props.theme.primary : 'transparent'};
  color: ${props => props.active ? 'white' : props.theme.text};
  border-radius: 6px;
  cursor: pointer;
  transition: all 0.2s;
  font-size: 0.9rem;

  &:hover {
    border-color: ${props => props.theme.primary};
    background: ${props => props.active ? props.theme.primary : props.theme.primary}22;
  }

  &:disabled {
    opacity: 0.5;
    cursor: not-allowed;
  }
`;

const Pagination = ({ 
  currentPage, 
  totalPages, 
  onPageChange,
  showItems = 5 
}) => {
  const getPageNumbers = () => {
    const pages = [];
    const half = Math.floor(showItems / 2);
    
    let start = Math.max(1, currentPage - half);
    let end = Math.min(totalPages, start + showItems - 1);
    
    if (end - start < showItems - 1) {
      start = Math.max(1, end - showItems + 1);
    }
    
    for (let i = start; i <= end; i++) {
      pages.push(i);
    }
    
    return pages;
  };

  if (totalPages <= 1) return null;

  return (
    <Container>
      <PageButton
        onClick={() => onPageChange(currentPage - 1)}
        disabled={currentPage === 1}
      >
        <FiChevronLeft />
      </PageButton>

      {getPageNumbers().map(page => (
        <PageButton
          key={page}
          active={page === currentPage}
          onClick={() => onPageChange(page)}
        >
          {page}
        </PageButton>
      ))}

      <PageButton
        onClick={() => onPageChange(currentPage + 1)}
        disabled={currentPage === totalPages}
      >
        <FiChevronRight />
      </PageButton>
    </Container>
  );
};

export default Pagination;