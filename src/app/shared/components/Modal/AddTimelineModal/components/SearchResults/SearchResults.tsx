import React from 'react';

import useTranslation from '@shared/hooks/useTranslation';

import ResultCard from '../ResultCard';

interface SearchResultsProps {
  items: any;
  handleSelect: (id: string, type: string) => void;
  selectedCard?: string;
}

function SearchResults({ items, handleSelect, selectedCard }: SearchResultsProps) {
  const i18n = useTranslation('createTimeline');

  return (
    <div className="results">
      {items && items?.length
        ? items?.map((item: any) => (
          <ResultCard
            selected={selectedCard === item?.id}
            title={item?.name}
            description={item?.description}
            date={item?.started_at}
            label={item?.type}
            onClick={() => handleSelect(item?.id, item?.type)}
            key={item.id}
          />
        ))
        : (
          <div className="mt-4 mx-auto">{i18n.label.noResultsFound}</div>
        )}
    </div>
  );
}

export default SearchResults;
