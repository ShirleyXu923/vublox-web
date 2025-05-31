import { debounce, startCase } from 'lodash';
import React, {
  useCallback, useEffect, useState,
} from 'react';
import InfiniteScroll from 'react-infinite-scroll-component';
import { useDispatch, useSelector } from 'react-redux';
import { NavLink } from 'react-router-dom';
import {
  Badge, Modal, ModalBody, ModalHeader,
} from 'reactstrap';

import { IRootState } from '@app/store';
import { getFollowingRequest } from '@reducers/follow/FollowAction';
import FollowModalButton from '@shared/buttons/follow-button/FollowModalButton';
import { getProfileLink } from '@shared/helpers';
import useTranslation from '@shared/hooks/useTranslation';
import Verified from '@shared/icons/Verified';
import Avatar from '@shared/utils/Avatar/Avatar';
import SearchBar from '@shared/utils/SearchBar/SearchBar';

import FollowingPlaceholder from './components/following-placeholder/FollowingPlaceholder';

import './FollowingModal.scss';

function FollowingModal({ show, toggle, id }: {
  show: boolean;
  toggle: () => void;
  id: string | undefined;
}) {
  const i18n = useTranslation('profilePage');
  const dispatch = useDispatch<any>();
  const [ loading, setLoading ] = useState(false);
  const [ refreshing, setRefreshing ] = useState(true);
  const [ items, setItems ] = useState([]);
  const [ meta, setMeta ] = useState({ currentPage: 1, totalPages: 1 });
  const [ searching, setSearching ] = useState(false);
  const [ keyword, setKeyword ] = useState('');
  const account = useSelector((state: IRootState) => state.Auth.account);

  const loadData = async (refresh = false, query = '') => {
    if (loading) return;
    setLoading(true);

    const params = {
      id,
      page: refresh ? 1 : meta.currentPage + 1,
      keyword: query,
    };

    try {
      const { data } = await dispatch(getFollowingRequest(params)).$promise;
      setItems((s: any) => (refresh ? data.items : [ ...s, ...data.items ]));
      setMeta(data.meta);
    } finally {
      setLoading(false);
      setSearching(false);
      setRefreshing(false);
    }
  };

  // eslint-disable-next-line react-hooks/exhaustive-deps
  const handleSearch = useCallback(debounce((query) => {
    loadData(true, query);
  }, 2000), []);

  const onSearch = (value: string) => {
    setSearching(true);
    setKeyword(value);
    handleSearch(value);
  };

  useEffect(() => {
    if (!id) return;
    setItems([]);
    loadData(true);
    setKeyword('');
    setRefreshing(true);
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [ id ]);

  return (
    <Modal
      isOpen={show}
      toggle={toggle}
      id={id}
      className="following-modal"
      scrollable
      unmountOnClose={false}
    >
      <ModalHeader toggle={toggle}>
        <h1 className="s1 mb-0">
          {startCase(i18n.label.following)}
        </h1>
      </ModalHeader>
      <ModalBody id="following-scrollable">
        <SearchBar
          onSearch={onSearch}
          loading={searching}
          placeholder={i18n.placeholder.searchFollowing}
        />

        {refreshing && (
          <FollowingPlaceholder />
        )}

        <InfiniteScroll
          dataLength={items.length}
          next={() => loadData(false, keyword)}
          hasMore={meta.currentPage < meta.totalPages}
          loader={null}// renderPlaceholder()}
          scrollableTarget="following-scrollable"
        >
          {items.map((item: any) => (
            <div key={item.id} className="item">
              <div className="item">
                <NavLink to={getProfileLink(item)} target="_blank">
                  <Avatar
                    user={item}
                  />
                </NavLink>
                <NavLink to={getProfileLink(item)} className="link" target="_blank">
                  <span className="b1">
                    {item.name || item.display_name}&nbsp;
                    {item.verified_at && (
                      <Verified />
                    )}
                    {item.id === account?.id && (
                      <Badge className="badge ms-1">You</Badge>
                    )}
                  </span>
                </NavLink>
              </div>

              {item.id !== account?.id && (
                <FollowModalButton
                  followId={item.id}
                  followType="Client"
                  isFollowing={item.is_following}
                  followBack={!item.is_following && item.is_follower}
                />
              )}
            </div>
          ))}
        </InfiniteScroll>
        {(loading && items.length > 0) && (
          <FollowingPlaceholder />
        )}
      </ModalBody>
    </Modal>
  );
}

export default FollowingModal;
