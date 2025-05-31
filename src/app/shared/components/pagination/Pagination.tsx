/* eslint-disable no-unsafe-optional-chaining */
import React from 'react';
import { PaginationItem, PaginationLink, Pagination as RPagination } from 'reactstrap';

import './Pagination.scss';
import { ChevronLeftIcon, ChevronRightIcon } from '@shared/icons';

interface LinkType {
  page: number;
  name: number;
  isCurrent?: boolean;
}

interface PaginationProps {
  meta: {
    currentPage: number;
    totalPages: number;
    links: LinkType[];
  }
  onPageChange: (page: number | string) => void;
}

function Pagination({ meta, onPageChange }: PaginationProps) {
  const nextPage = meta?.totalPages > meta?.currentPage
    ? meta?.currentPage + 1 : meta?.currentPage;
  const prevPage = meta?.currentPage !== 1 ? meta?.currentPage - 1 : meta?.currentPage;

  const getLinks = () => {
    const currentPage = meta?.currentPage;
    const totalPage = meta?.totalPages;

    const offSetLimit = 3;
    const prevLimit = currentPage - offSetLimit;
    const nextLimit = currentPage + offSetLimit;
    const links = [];

    // Get all the prevoius list of pages from the current page
    for (let i = currentPage; i > 1 && i !== prevLimit; i--) {
      links.push({
        page: i - 1,
        name: i - 1,
        isCurrent: false,
      });
    }

    // Add the current page as the center of the links
    links.push({
      page: currentPage,
      name: currentPage,
      isCurrent: true,
    });

    // Get all next list of pages from the current page
    for (let i = currentPage; i < totalPage && i !== nextLimit; i++) {
      links.push({
        page: i + 1,
        name: i + 1,
        isCurrent: false,
      });
    }

    // Sort the links base on page number
    links.sort((a: any, b: any) => a.page - b.page);

    return links;
  };

  const handlePageChange = (page = 1) => {
    onPageChange(page);
  };

  const handleNextPage = () => {
    handlePageChange(nextPage);
  };

  const handlePrevPage = () => {
    handlePageChange(prevPage);
  };

  return (
    <RPagination>
      <PaginationItem onClick={handlePrevPage}>
        <PaginationLink href="#">
          <ChevronLeftIcon />
        </PaginationLink>
      </PaginationItem>
      {getLinks().map((link: LinkType) => (
        <PaginationItem
          key={link?.page}
          active={link?.isCurrent}
          onClick={() => handlePageChange(link?.page)}
        >
          <PaginationLink href="#" className={`${link?.isCurrent ? 'b6' : 'b5'}`}>{link?.name}</PaginationLink>
        </PaginationItem>
      ))}
      <PaginationItem onClick={handleNextPage}>
        <PaginationLink href="#">
          <ChevronRightIcon />
        </PaginationLink>
      </PaginationItem>
    </RPagination>
  );
}

export default Pagination;
