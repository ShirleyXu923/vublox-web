import _ from 'lodash';
import React, { useCallback, useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import {
  Button,
  Modal,
  ModalBody,
  ModalHeader,
  Nav,
  NavItem,
  NavLink,
  Spinner,
  TabContent,
  TabPane,
} from 'reactstrap';

import { IRootState } from '@app/store';
import { searchTimelineRequest } from '@reducers/timeline/TimelineActions';
import { handleError } from '@services/ErrorHandler';
import LocaleService from '@services/LocaleService';
import { SearchIcon } from '@shared/icons';
import '../modal.scss';
import './AddTimelineModal.scss';
import Input from '@shared/utils/Forms/Input/Input';

import { SearchResults } from './components/SearchResults';

interface ModalProps {
  onSubmit: (selectedCard: string, selectedType: string) => void;
  isOpen?: boolean;
  toggle: () => void;
  loading?: boolean;
}

function AddTimelineModal({
  onSubmit,
  isOpen,
  toggle,
  loading,
}: ModalProps) {
  const i18n = LocaleService.getTranslations('createTimeline');
  const dispatch = useDispatch<any>();
  const [ activeTab, setActiveTab ] = useState('all');
  const searchResults = useSelector((state: IRootState) => state.Timeline.searchResults) as any;
  const [ isSearching, setIsSearching ] = useState(false);
  const [ selectedCard, setSelectedCard ] = useState('');
  const [ selectedType, setSelectedType ] = useState('');
  const [ page, setPage ] = useState(1);
  const [ searchKey, setSearchKey ] = useState('');

  const handleSearch = _.debounce(async (evt: any) => {
    try {
      setIsSearching(true);

      setSearchKey(evt.target.value);
      if (evt.target.value === '') {
        setIsSearching(false);
        return;
      }

      await dispatch(searchTimelineRequest(evt.target.value, page)).$promise;
    } catch (error: any) {
      handleError(error);
    } finally {
      setIsSearching(false);
    }
  }, 500);

  const handleSubmission = (e: any) => {
    e.preventDefault();
    onSubmit(selectedCard, selectedType);
  };

  const handleResultCardClick = (id: string, type: string) => {
    setSelectedCard(id);
    setSelectedType(type);
  };

  const fetchData = useCallback(async () => {
    setPage(page + 1);
    // eslint-disable-next-line no-console
    const searchInput = document.getElementById('search-input') as any;
    handleSearch({
      target: {
        value: searchInput?.value,
      },
    });
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [ page ]);

  // Handle Infinite Scrolls
  useEffect(() => {
    const handleScroll = () => {
      const { scrollTop, clientHeight, scrollHeight } = document.getElementById('results') as any;
      if (scrollTop + clientHeight >= scrollHeight) {
        fetchData();
      }
    };

    const resultContainer = document.getElementById('results');

    resultContainer?.addEventListener('scroll', handleScroll);
    return () => {
      resultContainer?.removeEventListener('scroll', handleScroll);
    };
  }, [ fetchData, isOpen ]);

  return (
    <Modal isOpen={isOpen} toggle={toggle} className="custom-modal add_timeblock__modal">
      <ModalHeader toggle={toggle}>
        <h2>{i18n.label.addTimeblock}</h2>
      </ModalHeader>
      <ModalBody>
        <form onSubmit={handleSubmission}>
          <div className="body">
            <Input
              id="search-input"
              label={i18n.label.search}
              placeholder={i18n.label.search}
              name="search"
              leftIcon={(<SearchIcon />)}
              rightIcon={isSearching && <Spinner size="sm" />}
              leftIconProps={{ className: 'pe-0' }}
              onChange={handleSearch}
            />
            {searchKey !== '' && (
              <div className="search-result">
                <Nav pills>
                  <NavItem onClick={() => setActiveTab('all')}>
                    <NavLink className="caption1" active={activeTab === 'all'}>{i18n.label.all}</NavLink>
                  </NavItem>
                  <NavItem onClick={() => setActiveTab('events')}>
                    <NavLink className="caption1" active={activeTab === 'events'}>{i18n.label.events}</NavLink>
                  </NavItem>
                  <NavItem onClick={() => setActiveTab('organizations')}>
                    <NavLink className="caption1" active={activeTab === 'organizations'}>{i18n.label.organizations}</NavLink>
                  </NavItem>
                  <NavItem onClick={() => setActiveTab('timelines')}>
                    <NavLink className="caption1" active={activeTab === 'timelines'}>{i18n.label.timelines}</NavLink>
                  </NavItem>
                </Nav>

                <TabContent activeTab={activeTab}>
                  <TabPane tabId="all">
                    <SearchResults
                      items={searchResults?.all || []}
                      handleSelect={handleResultCardClick}
                      selectedCard={selectedCard}
                    />
                  </TabPane>
                  <TabPane tabId="events">
                    <SearchResults
                      items={searchResults?.events || []}
                      handleSelect={handleResultCardClick}
                      selectedCard={selectedCard}
                    />
                  </TabPane>
                  <TabPane tabId="organizations">
                    <SearchResults
                      items={searchResults?.organizations || []}
                      handleSelect={handleResultCardClick}
                      selectedCard={selectedCard}
                    />
                  </TabPane>
                  <TabPane tabId="timelines">
                    <SearchResults
                      items={searchResults?.timelines || []}
                      handleSelect={handleResultCardClick}
                      selectedCard={selectedCard}
                    />
                  </TabPane>
                </TabContent>
              </div>
            )}
            <div className="add-timeline-button">
              <Button
                color="primary"
                type="submit"
                block
                disabled={searchKey === '' || selectedCard === '' || loading}
              >
                {loading && <Spinner size="sm" />}
                {i18n.button.addToTimeline}
              </Button>
            </div>
          </div>
        </form>
      </ModalBody>
    </Modal>
  );
}

export default AddTimelineModal;
