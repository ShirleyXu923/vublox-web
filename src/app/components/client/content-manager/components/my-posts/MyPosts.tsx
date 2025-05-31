import './MyPosts.scss';
import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { toast } from 'react-toastify';
import { Container } from 'reactstrap';

import { IRootState } from '@app/store';
import { deletePostsRequest, getMyPostsRequest } from '@reducers/post/PostAction';
import { handleError } from '@services/ErrorHandler';
import LocaleService from '@services/LocaleService';
import SortButton from '@shared/buttons/SortButton';
import { DeleteModal } from '@shared/components/Modal/delete-modal';
import { Pagination } from '@shared/components/pagination';
import useTranslation from '@shared/hooks/useTranslation';
import DeleteIcon from '@shared/icons/DeleteIcon';
import DownloadIcon from '@shared/icons/DownloadIcon';
import Checkbox from '@shared/utils/Forms/Checkbox/Checkbox';
import SearchBar from '@shared/utils/SearchBar/SearchBar';

import PostItem from './components/PostItem';
import { Empty } from './components/empty';

function MyPosts() {
  const i18n = useTranslation('contentManager');
  const dispatch = useDispatch<any>();
  const posts = useSelector((state: IRootState) => state.Post.posts);
  const account = useSelector((state: IRootState) => state.Auth.account);
  const [ currentPage, setCurrentPage ] = useState(1);
  const [ search, setSearch ] = useState('');
  const [ selectedSort, setSelectedSort ] = useState('latest-to-oldest');
  const [ selectedPosts, setSelectedPosts ] = useState<string[]>([]);
  const [ isSelectedAll, setIsSelectedAll ] = useState(false);
  const [ showDeleteModal, setShowDeleteModal ] = useState(false);
  const [ sortItems ] = useState([
    {
      label: i18n.posts.latestToOldest,
      value: 'latest-to-oldest',
    },
    {
      label: i18n.posts.oldestToLatest,
      value: 'oldest-to-latest',
    },
  ]);

  // eslint-disable-next-line no-confusing-arrow
  const getSelectedSort = () => selectedSort === 'latest-to-oldest' ? i18n.posts.latestToOldest : i18n.posts.oldestToLatest;

  const getQuery = () => {
    let ownerableType = account?.type;

    if (ownerableType === 'user') {
      ownerableType = 'Client';
    }

    if (ownerableType === 'organization') {
      ownerableType = 'Organization';
    }

    let query = {
      ownerable_id: account?.id,
      ownerable_type: ownerableType,
      limit: 3,
      page: currentPage,
      sort: 'DESC',
      search,
    };

    query = {
      ...query,
      sort: selectedSort === 'latest-to-oldest' ? 'DESC' : 'ASC',
    };

    return query;
  };

  const getMyPosts = async () => {
    try {
      const query = getQuery();
      await dispatch(getMyPostsRequest(query)).$promise;
    } catch (error: any) {
      handleError(error);
    }
  };

  const handlePageChange = (page: number | string = 1) => {
    setCurrentPage(page as number);
  };

  const handleSelectChange = (postId: string) => {
    if (selectedPosts.includes(postId)) {
      // Remove the post id from the selected array
      const removedCopy = selectedPosts.filter(e => e !== postId);
      setSelectedPosts(removedCopy);
    } else {
      // Add the post id to the selected array
      const selectedCopy = selectedPosts;
      setSelectedPosts([ ...selectedCopy, postId ]);
    }
  };

  const handleUnselectAll = () => {
    setSelectedPosts([]);
  };

  const handleSelectAll = () => {
    const postIds: string[] = [];

    posts?.items?.map((post: any) => {
      postIds.push(post?.id);
      return post;
    });

    setSelectedPosts(postIds);
  };

  const handleDeletePosts = async () => {
    try {
      await dispatch(deletePostsRequest({ posts: selectedPosts })).$promise;
      setSelectedPosts([]);
      setShowDeleteModal(false);
      setSearch('');
      setTimeout(() => {
        getMyPosts();
      }, 500);
    } catch (error: any) {
      handleError(error);
    }
  };

  useEffect(() => {
    setSelectedPosts([]);
  }, [ posts ]);

  useEffect(() => {
    // Check for the selected all state
    let selectedAll = true;
    posts?.items?.map((post: any) => {
      if (!selectedPosts.includes(post?.id)) {
        selectedAll = false;
      }
      return post;
    });

    setIsSelectedAll(selectedAll);
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [ selectedPosts ]);

  useEffect(() => {
    getMyPosts();
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [ currentPage, selectedSort, search, account ]);

  return (
    <Container fluid className="my-posts">
      <div className="header">
        <h2>{i18n.label.myPosts}</h2>
        <div className="filters">
          <SortButton
            onSelect={(item) => setSelectedSort(item.value)}
            items={sortItems}
            label={getSelectedSort()}
          />
          <SearchBar onSearch={(keyword: string) => setSearch(keyword)} />
        </div>
      </div>
      {posts?.meta?.itemCount > 0
        ? (
          <div className="content">
            <div className="items">
              {selectedPosts.length > 0 && (
                <div className="has-selected">
                  <div className="label">
                    <div className="b5">{selectedPosts.length} {i18n.posts.selected}</div>
                    <div>|</div>
                    <div className="b5 unselect" onClick={handleUnselectAll}>{i18n.posts.unselect}</div>
                  </div>
                  <div className="action">
                    <div className="button" style={{ marginRight: '32px' }} onClick={() => toast.info(i18n.info.upcoming)}>
                      <DownloadIcon />
                      <span className="b5">{i18n.posts.downloadMedia}</span>
                    </div>
                    <div className="button text-danger" onClick={() => setShowDeleteModal(true)}>
                      <DeleteIcon />
                      <span className="b5">{i18n.posts.deletePosts}</span>
                    </div>
                  </div>
                </div>
              )}
              <div className="item">
                <Checkbox checked={isSelectedAll} onChange={handleSelectAll} />
                <div className="select-all-label">{i18n.posts.selectAll}</div>
              </div>

              {posts?.items?.map((post: any) => (
                <div className="item" key={post?.id}>
                  <Checkbox
                    onChange={() => handleSelectChange(post?.id)}
                    checked={selectedPosts.includes(post?.id)}
                  />
                  <PostItem
                    isSelected={selectedPosts.includes(post?.id)}
                    post={post}
                  />
                </div>
              ))}
            </div>
            <Pagination meta={posts?.meta as any} onPageChange={handlePageChange} />
          </div>
        )
        : (
          <Empty />
        )}

      <DeleteModal
        title={i18n.posts.deletePosts}
        description={LocaleService.parseTranslation(i18n.posts.deletePostsDescription, <span className="b3 text-danger">{selectedPosts.length}</span>) as string}
        cancelButtonText={i18n.posts.cancel}
        confirmButtonText={i18n.posts.deletePosts}
        onConfirm={handleDeletePosts}
        isOpen={showDeleteModal}
        toggle={() => setShowDeleteModal(!showDeleteModal)}
      />
    </Container>
  );
}

export default MyPosts;
