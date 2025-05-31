/* eslint-disable react-hooks/exhaustive-deps */
import './ManageCoCreator.scss';
import { debounce } from 'lodash';
import {
  useCallback, useEffect, useMemo, useState,
} from 'react';
import InfiniteScroll from 'react-infinite-scroll-component';
import { useDispatch } from 'react-redux';
import { toast } from 'react-toastify';
import {
  Modal,
  ModalBody,
  ModalFooter,
  ModalHeader,
  Nav,
  NavItem,
  NavLink,
} from 'reactstrap';

import { addInvite, getInvited, getNonInvited } from '@reducers/event/EventAction';
import { handleError } from '@services/ErrorHandler';
import LocaleService from '@services/LocaleService';
import { Button } from '@shared/buttons/Button';
import useTranslation from '@shared/hooks/useTranslation';
import SearchBar from '@shared/utils/SearchBar/SearchBar';

import CoCreator from './components/CoCreator';

interface ModalProps {
  modal?: boolean;
  toggle: () => void;
  eventId: string;
}

interface InviteCounts {
  total: number;
  pending: number;
  accepted: number;
  declined: number;
  nonInvited: number;
}

type InviteStatus = 'pending' | 'accepted' | 'declined';

function ManageCoCreator({
  modal,
  toggle,
  eventId,
}: ModalProps) {
  const i18n = useTranslation('contentManager');
  const dispatch = useDispatch<any>();

  const [ keyword, setKeyword ] = useState('');
  const [ activeTab, setActiveTab ] = useState('allInvited');
  const [ invited, setInvited ] = useState<any[]>([]);
  const [ nonInvited, setNonInvited ] = useState<any[]>([]);

  const [ searching, setSearching ] = useState(false);
  const [ invitedMeta, setInvitedMeta ] = useState({ total: 0, page: 1, limit: 6 });
  const [ nonInvitedMeta, setNonInvitedMeta ] = useState({ total: 0, page: 1, limit: 6 });

  const [ selectedItems, setSelectedItems ] = useState<{ id: string; type: string }[]>([]);

  const [ counts, setCounts ] = useState<InviteCounts>({
    total: 0,
    pending: 0,
    accepted: 0,
    declined: 0,
    nonInvited: 0,
  });

  const fetchInitialCounts = async () => {
    try {
      const response = await dispatch(
        getInvited({ page: 1, limit: 1, status: 'all' }, eventId),
      ).$promise;

      if (response.data?.counts) {
        setCounts(response.data.counts);
      }
    } catch (error) {
      handleError(error);
    }
  };

  const handleSelect = (id: string, type: string) => {
    setSelectedItems(prev => {
      if (prev.some(item => item.id === id)) {
        return prev.filter(item => item.id !== id);
      }
      return [ ...prev, { id, type } ];
    });
  };

  const loadInvitees = async (inputValue: string, page = 1) => {
    try {
      const queryParams: any = {
        keyword: inputValue,
        page,
        limit: 6,
      };

      if (activeTab !== 'inviteMore') {
        queryParams.status = activeTab === 'allInvited' ? 'all' : activeTab;
      }

      const response = await dispatch(
        getInvited(queryParams, eventId),
      ).$promise;

      const { data } = response;

      if (data) {
        if (page === 1) {
          setInvited(data.items || []);
        } else {
          setInvited(prev => [ ...prev, ...(data.items || []) ]);
        }
        setInvitedMeta({
          total: Number(data.total),
          page: Number(data.page),
          limit: Number(data.limit),
        });
      }
    } catch (error) {
      handleError(error);
    }
  };

  const loadNonInvitees = async (inputValue: string, page = 1) => {
    try {
      const response = await dispatch(
        getNonInvited({
          keyword: inputValue,
          page,
          limit: 6,
        }, eventId),
      ).$promise;

      const { data } = response;

      if (data) {
        if (page === 1) {
          setNonInvited(data.items || []);
        } else {
          setNonInvited(prev => [ ...prev, ...(data.items || []) ]);
        }
        setNonInvitedMeta({
          total: Number(data.total),
          page: Number(data.page),
          limit: Number(data.limit),
        });
      }
    } catch (error) {
      handleError(error);
    }
  };

  const handleInviteeDeleted = useCallback((deletedId: string) => {
    const deletedInvitee = invited.find(item => item.id === deletedId);
    const status = deletedInvitee?.status?.toLowerCase();

    const isValidStatus = (s: string): s is InviteStatus => [ 'pending', 'accepted', 'declined' ].includes(s);

    if (status && isValidStatus(status)) {
      setCounts(prev => ({
        ...prev,
        total: prev.total - 1,
        [status]: prev[status] - 1,
        nonInvited: prev.nonInvited + 1,
      }));
    }

    setInvited(prev => prev.filter(item => item.id !== deletedId));

    setTimeout(() => {
      loadInvitees(keyword);
      fetchInitialCounts();
    }, 500);
  }, [ keyword, invited ]);

  const sendInvitesLabel = (): string => {
    const label = LocaleService.parseTranslation(
      i18n.events.sendInvite, {
        invites: selectedItems.length,
      },
    );
    return label as string;
  };

  const handleSendInvites = async () => {
    try {
      const invitees = Object.values(selectedItems).map(item => ({
        invited_id: item.id,
        invited_type: item.type,
        status: 'pending',
      }));

      setNonInvited(
        prev => prev.filter(item => !selectedItems.some(selected => selected.id === item.id)),
      );

      const newInvitedItems = selectedItems.map(item => ({
        id: item.id,
        name: nonInvited.find(ni => ni.id === item.id)?.name || '',
        type: item.type,
        status: 'Pending',
      }));

      setCounts(prev => ({
        ...prev,
        total: prev.total + selectedItems.length,
        pending: prev.pending + selectedItems.length,
        nonInvited: prev.nonInvited - selectedItems.length,
      }));

      setInvited(prev => [ ...prev, ...newInvitedItems ]);

      await dispatch(addInvite(eventId, invitees));
      toast.success(i18n.events.inviteSuccess);

      setTimeout(() => {
        loadInvitees(keyword);
        loadNonInvitees(keyword);
        fetchInitialCounts();
      }, 500);

      setSelectedItems([]);
    } catch (error) {
      loadInvitees(keyword);
      loadNonInvitees(keyword);
      handleError(error);
    }
  };

  const handleSearch = useCallback(
    debounce(async (query: string) => {
      try {
        if (activeTab === 'inviteMore') {
          await loadNonInvitees(query);
        } else {
          await loadInvitees(query);
        }
      } catch (error) {
        handleError(error);
      } finally {
        setSearching(false);
      }
    }, 300),
    [ activeTab, loadInvitees, loadNonInvitees ],
  );

  const onSearch = (query: string) => {
    setKeyword(query);
    setSearching(true);
    handleSearch(query);
  };

  const filteredItems = useMemo(() => {
    if (activeTab === 'allInvited') {
      return invited;
    }
    if (
      activeTab === 'pending'
      || activeTab === 'accepted'
      || activeTab === 'declined'
    ) {
      return invited.filter((item) => item.status.toLowerCase() === activeTab,
      );
    }
    // For inviteMore, we show non_invited items
    if (activeTab === 'inviteMore') {
      return nonInvited;
    }
    return [];
  }, [ activeTab, invited, nonInvited ]);

  useEffect(() => {
    if (!modal) return;

    setSelectedItems([]);
    setInvited([]);
    setNonInvited([]);
    setKeyword('');
    setActiveTab('allInvited');
    setInvitedMeta({ total: 0, page: 1, limit: 6 });
    setNonInvitedMeta({ total: 0, page: 1, limit: 6 });
    setCounts({
      total: 0, pending: 0, accepted: 0, declined: 0, nonInvited: 0,
    });
  }, [ modal ]);

  useEffect(() => {
    if (!modal || !eventId) return;

    fetchInitialCounts();

    if (activeTab === 'inviteMore') {
      loadNonInvitees(keyword);
    } else {
      loadInvitees(keyword);
    }
  }, [ eventId, modal ]);

  useEffect(() => {
    if (!modal || !eventId) return;

    if (activeTab === 'inviteMore') {
      loadNonInvitees(keyword);
    } else {
      loadInvitees(keyword);
    }
  }, [ activeTab, keyword ]);

  return (
    <Modal
      className="manage-invites-custom"
      isOpen={modal}
      toggle={toggle}
    >
      <ModalHeader toggle={toggle}>
        <div className="s1">{i18n.events.manageCoCreators}</div>
      </ModalHeader>
      <ModalBody>
        <SearchBar
          inputProps={{
            value: keyword,
            onChange: (e) => onSearch(e.target.value),
          }}
          placeholder="Search"
          onSearch={onSearch}
          loading={searching}
          clearable
        />

        <Nav pills className="nav-scrollable">
          <NavItem onClick={() => setActiveTab('allInvited')}>
            <NavLink href="#" active={activeTab === 'allInvited'}>
              <span className={activeTab === 'allInvited' ? 'b4' : 'b3'}>{i18n.label.allInvited}</span>
              <span className="caption1">{counts.total}</span>
            </NavLink>
          </NavItem>
          <NavItem onClick={() => setActiveTab('pending')}>
            <NavLink href="#" active={activeTab === 'pending'}>
              <span className={activeTab === 'pending' ? 'b4' : 'b3'}>{i18n.label.pending}</span>
              <span className="caption1">{counts.pending}</span>
            </NavLink>
          </NavItem>
          <NavItem onClick={() => setActiveTab('accepted')}>
            <NavLink href="#" active={activeTab === 'accepted'}>
              <span className={activeTab === 'accepted' ? 'b4' : 'b3'}>{i18n.label.accepted}</span>
              <span className="caption1">{counts.accepted}</span>
            </NavLink>
          </NavItem>
          <NavItem onClick={() => setActiveTab('declined')}>
            <NavLink href="#" active={activeTab === 'declined'}>
              <span className={activeTab === 'declined' ? 'b4' : 'b3'}>{i18n.label.declined}</span>
              <span className="caption1">{counts.declined}</span>
            </NavLink>
          </NavItem>
          <NavItem onClick={() => setActiveTab('inviteMore')}>
            <NavLink href="#" active={activeTab === 'inviteMore'}>
              <span className={activeTab === 'inviteMore' ? 'b4' : 'b3'}>{i18n.label.inviteMore}</span>
              <span className="caption1">{counts.nonInvited}</span>
            </NavLink>
          </NavItem>
        </Nav>

        <div className="mt-2 invites-list" id="invites-scrollable-div">
          <div className="invites-list__content">
            <InfiniteScroll
              dataLength={filteredItems.length}
              next={() => {
                const currentPage = activeTab === 'inviteMore'
                  ? nonInvitedMeta.page
                  : invitedMeta.page;

                if (activeTab === 'inviteMore') {
                  loadNonInvitees(keyword, currentPage + 1);
                } else {
                  loadInvitees(keyword, currentPage + 1);
                }
              }}
              hasMore={activeTab === 'inviteMore'
                ? filteredItems.length < nonInvitedMeta.total
                : filteredItems.length < invitedMeta.total}
              loader={<div>Loading...</div>}
              scrollableTarget="invites-scrollable-div"
            >
              {filteredItems.map((item) => (
                <CoCreator
                  key={item.id}
                  data={{
                    id: item.id,
                    name: item.name,
                    type: item.type,
                    status: item.status
                      ? item.status.charAt(0).toLowerCase() + item.status.slice(1)
                      : undefined,
                    displayName: item.displayName ?? item.type,
                  }}
                  eventId={eventId}
                  isInviteMore={activeTab === 'inviteMore'}
                  isSelected={selectedItems.some(selectedItem => selectedItem.id === item.id)}
                  onSelect={handleSelect}
                  onDelete={(id) => handleInviteeDeleted(id)}
                />
              ))}
            </InfiniteScroll>
          </div>
        </div>
      </ModalBody>
      {activeTab === 'inviteMore' && (
        <ModalFooter>
          <div className="d-flex w-100 gap-2 align-items-center justify-content-between">
            <Button
              outline
              className="w-100"
              color="primary"
              label={i18n.events.cancel}
              isForm
              onClick={toggle}
            />
            <Button
              color="primary"
              className="w-100"
              label={sendInvitesLabel()}
              isForm
              disabled={selectedItems.length === 0}
              onClick={handleSendInvites}
            />
          </div>
        </ModalFooter>
      )}
    </Modal>
  );
}
export default ManageCoCreator;
