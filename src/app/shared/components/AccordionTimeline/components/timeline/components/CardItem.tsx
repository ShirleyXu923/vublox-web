// NOTE: Dependency cycle are needed for the children components to work in the timeline component.
/* eslint-disable import/no-cycle */
import React from 'react';

import useCards from '../hooks/useCards';

interface CardItemProps {
  item: any;
  open: any;
  list: any[];
  currentIndex: number;
  onChangeVisibleItems?: ((isVisible: boolean, items: any[]) => void);
  onClick?: (e: any, item: any, type: string) => void;
  query?: any;
}

function CardItem({
  item,
  open,
  list,
  currentIndex,
  onChangeVisibleItems,
  onClick,
  query,
}: CardItemProps) {
  const card = useCards(item, open, list, currentIndex, onChangeVisibleItems, onClick, query);

  if (card) {
    return (
      <div data-item={item?.id}>{card}</div>
    );
  }
}

export default CardItem;
