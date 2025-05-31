/* eslint-disable max-len */
/* eslint-disable react/jsx-no-useless-fragment */
import React, { useEffect, useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { useMediaQuery } from 'react-responsive';
import { useNavigate, useParams } from 'react-router-dom';
import { toast } from 'react-toastify';
import {
  Col,
  DropdownItem,
  DropdownMenu,
  DropdownToggle,
  Row,
  UncontrolledDropdown,
} from 'reactstrap';

import { useShareLinkModal } from '@app/providers/share-provider/ShareProvider';
import { IRootState } from '@app/store';
import appConfig from '@config/app';
import { changeAccountRequest } from '@reducers/auth/AuthAction';
import { createOrganizationTimeblockRequest } from '@reducers/organization/OrganizationAction';
import { handleError } from '@services/ErrorHandler';
import LocaleService from '@services/LocaleService';
import './OrganizationHeader.scss';
import { Button } from '@shared/buttons/Button';
import { FollowButton } from '@shared/buttons/follow-button';
import AddCoverPhotoTimeBlockModal from '@shared/components/Modal/AddCoverPhotoTImeBlockModal';
import AddLogoTimeBlockModal from '@shared/components/Modal/AddLogoTimeBlockModal';
import ClaimModal from '@shared/components/Modal/ClaimModal/ClaimModal';
import FollowersModal from '@shared/components/Modal/FollowersModal/FollowersModal';
import { ProfileLogoComponent } from '@shared/components/ProfileLogoComponent';
import { getFormData, shortNumberFormat } from '@shared/helpers';
import { ChevronRightIcon, StarIcon } from '@shared/icons';
import Ellipse from '@shared/icons/Ellipse';
import SocialShare from '@shared/icons/SocialShare';

import BioModal from './BioModal';

function OrganizationHeader({ reload }: { reload: () => void }) {
  const i18n = LocaleService.getTranslations('organizationPage');
  const params = useParams();
  const dispatch = useDispatch<any>();
  const navigate = useNavigate();
  const organization = useSelector((state: IRootState) => state.Organization.organization as any);
  const [ showBio, setShowBio ] = useState(false);
  const [ showLogoOptions, setShowLogoOptions ] = useState(false);
  const [ errors, setErrors ] = useState<any>({});
  const [ showAddCoverPhotoModal, setShowAddCoverPhotoModal ] = useState(false);
  const [ showAddLogoModal, setShowAddLogoModal ] = useState(false);
  const { toggle: toggleShare, setLink, setShareData } = useShareLinkModal();
  const user = useSelector((state: IRootState) => state.Auth.user);
  const account = useSelector((state: IRootState) => state.Auth.account);
  const canEdit = organization.created_by === user.id;
  const isMobileScreen = useMediaQuery({ query: '(max-width: 576px)' });
  const [ submitLogoLoading, setSubmitLogoLoading ] = useState(false);
  const closeModal = () => {
    setShowAddCoverPhotoModal(false);
    setShowAddLogoModal(false);
  };
  const [ showClaimModal, setShowClaimModal ] = useState(false);
  const [ showFollowersModal, setShowFollowersModal ] = useState(false);

  const handleModalSubmit = async (form: any) => {
    try {
      setSubmitLogoLoading(true);
      setErrors({});
      const formData = getFormData(form);
      if (form?.started_at instanceof Date) {
        formData.set('started_at', form.started_at.toISOString());
      }

      if (!form?.ended_at) {
        formData.delete('ended_at');
      }
      await dispatch(createOrganizationTimeblockRequest(formData)).$promise;
      toast.success(i18n.success.imageUpdated);
      reload();
      closeModal();
      setShowLogoOptions(false);
      setSubmitLogoLoading(false);
    } catch (error: any) {
      const { response } = error;
      setSubmitLogoLoading(false);
      const { errors: errs } = response?.data || {};
      if (response?.status === 422) {
        setErrors(errs);
        handleError(error);
        setShowLogoOptions(false);
        return;
      }
      handleError(error);
    }
  };

  const handleShare = () => {
    setShareData({
      data_id: organization?.id,
      data_type: 'Organization',
      receiver_id: organization?.created_by,
    });
    setLink(`${appConfig.baseUrl}/organizations/${organization?.id}`);
    toggleShare(true);
  };

  const updateLogo = async () => {
    if (canEdit) {
      await dispatch(changeAccountRequest({
        ...organization,
        image: organization?.logo,
        type: 'organization',
      }));
    }
  };

  useEffect(() => {
    updateLogo();
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [ organization ]);

  return (
    <Row className="justify-content-center organization-header">
      {/* Title Section */}
      <Col md={12} className={` ${isMobileScreen ? 'mt-2' : ''}`}>
        <div className="title">
          <div className="logo-wrapper">
            {/* Logo Section */}
            <UncontrolledDropdown
              isOpen={showLogoOptions}
              onToggle={() => setShowLogoOptions(!showLogoOptions)}
            >
              <DropdownToggle>
                <div>
                  <ProfileLogoComponent name={organization?.name} image={organization?.image?.lg} />
                </div>
              </DropdownToggle>
              <DropdownMenu>
                <DropdownItem>
                  <div className="b5 text-body">{i18n.label.viewPhoto}</div>
                </DropdownItem>
                <DropdownItem onClick={() => setShowAddLogoModal(!showAddLogoModal)}>
                  <div className="b5 text-body">{i18n.label.changePhoto}</div>
                </DropdownItem>
              </DropdownMenu>
            </UncontrolledDropdown>
          </div>

          <div className="informative">
            {/* Organization Information */}
            {isMobileScreen ? (
              <div className="mt-1">
                <h2 className="mb-0">{organization?.name}</h2>
                <div className="bio">
                  {organization?.bio && (
                    <div
                      style={{
                        color: 'var(--bs-secondary-text)',
                      }}
                      className="caption1 bio-mobile-screen text-truncate b5"
                    >
                      {organization?.bio}
                    </div>
                  )}
                </div>
              </div>
            ) : (
              <>
                <h2>{organization?.name}</h2>
                <div className="bio-container">
                  <p className="b3 text-truncate">{organization?.bio}</p>
                </div>
              </>
            )}

            {/* Additional Info (Desktop View) */}
            { !isMobileScreen && (
              <>
                <div className="info">
                  <div className="star caption1">
                    <StarIcon />
                    <div><span className="rate">0</span>{i18n.label.outOfFive}</div>
                  </div>
                  <Ellipse />
                  <Button
                    color="link"
                    className="p-0 caption1"
                    onClick={() => setShowFollowersModal(true)}
                  >
                    {shortNumberFormat(organization?.followers_count)} {LocaleService.getPluralizedTranslation(i18n.label.followers, organization?.followers_count, false)}
                  </Button>
                  <Ellipse />
                  <span className="caption1">{shortNumberFormat(organization?.posts_count)} {LocaleService.getPluralizedTranslation(i18n.label.posts, organization?.posts_count, false)}</span>
                  {organization?.location && (
                    <>
                      <Ellipse />
                      <span className="caption1">{organization?.location?.name}</span>
                    </>
                  )}
                  <Ellipse />
                  <span className="caption1">
                    {`${shortNumberFormat(organization?.views_count)} `}{LocaleService.getPluralizedTranslation(i18n.label.views, organization?.views_count, false)}
                  </span>
                  <Ellipse />
                  <div className="bio-wrapper px-0 mx-0 ">
                    <div className="icon-btn" onClick={() => setShowBio(true)}>
                      <span style={{ fontSize: '12px', color: 'var(--bs-primary)' }}>View bio</span>
                      <ChevronRightIcon className="chevron-icon" />
                    </div>
                  </div>
                </div>
                <div className="links">
                  {account.id !== params.id ? (
                    <React.Fragment>
                      { /** TODO: Add claim button functionality */}
                      <Button
                        color="primary"
                        label={i18n.label.claim}
                        onClick={() => {
                          setShowClaimModal(true);
                        }}
                      />
                      <FollowButton
                        followId={params.id || ''}
                        followType="Organization"
                        isFollowing={organization?.is_following}
                      />
                    </React.Fragment>
                  ) : (
                    <>
                      <Button onClick={() => navigate(`/organizations/${params.id}/edit`)} color="primary" label={i18n.label.edit} />
                      <Button color="primary" label={i18n.label.managePosts} onClick={() => navigate('/contents')} />
                    </>
                  )}
                  <Button color="primary" outline label={i18n.label.share} icon={<SocialShare />} onClick={handleShare} />
                </div>
              </>
            )}
          </div>
        </div>
      </Col>

      {/* Render the modal outside of the informative div */}
      {showBio && (
        <div className="bio">

          <div className="bio-container">

            <BioModal
              onClose={() => setShowBio(false)}
              description={organization?.bio}
              contact={organization?.contact}
              url={organization?.url}
              tags={organization?.tags}
            />
          </div>
        </div>

      )}

      {isMobileScreen && (
        <>
          <Row className="mx-5 mb-0 mt-4">
            <div className="info mb-1">
              {/* Star Rating */}
              <div className="star caption1">
                <StarIcon />
                <div
                  style={{
                    gap: '4px',

                  }}
                >
                  <span
                    className="rate"
                  >0
                  </span>{i18n.label.outOfFive}
                </div>
              </div>
              <Ellipse />
              {/* Followers */}
              <Button
                color="link"
                className="p-0 caption1"
                onClick={() => setShowFollowersModal(true)}
              >
                <span className="caption1">
                  {shortNumberFormat(organization?.followers_count)} {LocaleService.getPluralizedTranslation(i18n.label.followers, organization?.followers_count, false)}
                </span>
              </Button>
              <Ellipse />
              {/* Posts */}
              <span className="caption1">{shortNumberFormat(organization?.posts_count)} {LocaleService.getPluralizedTranslation(i18n.label.posts, organization?.posts_count ?? 0, false)}</span>

              <Ellipse />
              <span className="caption1">{shortNumberFormat(organization?.views_count)} {LocaleService.getPluralizedTranslation(i18n.label.views, organization?.views_count ?? 0, false)}</span>

              <Ellipse />
              <div className="bio-wrapper px-0 mx-0 ">
                <div className="icon-btn" onClick={() => setShowBio(true)}>
                  <span style={{ fontSize: '12px', color: 'var(--bs-primary)' }}>View bio</span>
                  <ChevronRightIcon className="chevron-icon" />
                </div>
              </div>
            </div>
            <div className="container mt-2 mx-0 small-col-profile">
              <div className="row g-3 d-flex justify-content-around">
                {account.id === params.id ? (
                // Display "Edit Org", "Edit Profile", "Share" for own profile
                  <>
                    <div className="col-4 d-flex justify-content-center align-items-center home-page-create-button-mobile">
                      <Button
                        color="primary"
                        label={i18n.label.editOrg}
                        onClick={() => navigate(`/organizations/${params.id}/edit`)}
                      />
                    </div>
                    <div className="col-4 d-flex justify-content-center align-items-center home-page-create-button-mobile">
                      <Button
                        color="primary"
                        label={i18n.label.managePosts}
                        onClick={() => navigate('/contents')}
                      />
                    </div>
                    <div className="col-4 d-flex justify-content-center align-items-center p home-page-create-button-mobile">
                      <Button
                        color="primary"
                        outline
                        label={i18n.label.share}
                        icon={<SocialShare />}
                        onClick={handleShare}
                      />
                    </div>
                  </>
                ) : (
                // Display "Claim", "Follow or Unfollow", "Share" for other profiles
                  <>
                    <div className="col-4 d-flex justify-content-center align-items-center home-page-create-button-mobile">
                      <Button
                        color="primary"
                        label={i18n.label.claim}
                        onClick={() => {
                          setShowClaimModal(true);
                        }}
                      />
                    </div>
                    <div className="col-4 d-flex justify-content-center align-items-center home-page-create-button-mobile">
                      <FollowButton
                        followId={params.id || ''}
                        followType="Organization"
                        isFollowing={organization?.is_following}
                      />
                    </div>
                    <div className="col-4 d-flex justify-content-center align-items-center p home-page-create-button-mobile">
                      <Button
                        color="primary"
                        outline
                        label={i18n.label.share}
                        icon={<SocialShare />}
                        onClick={handleShare}
                      />
                    </div>
                  </>
                )}
              </div>
            </div>

          </Row>

        </>
      )}
      {/* <!-- Add Cover Photo Modal --> */}
      <AddCoverPhotoTimeBlockModal
        errors={errors}
        organizationId={params.id}
        onSubmit={handleModalSubmit}
        isOpen={showAddCoverPhotoModal}
        toggle={() => setShowAddCoverPhotoModal(!showAddCoverPhotoModal)}
      />
      {/* <!-- Add Cover Photo Modal --> */}

      {/* <!-- Add Logo Modal --> */}
      <AddLogoTimeBlockModal
        errors={errors}
        organizationId={params.id}
        onSubmit={handleModalSubmit}
        isOpen={showAddLogoModal}
        toggle={() => setShowAddLogoModal(!showAddLogoModal)}
        loading={submitLogoLoading}
      />
      {/* <!-- Add Logo Modal --> */}

      {/* Claim Modal */}
      <ClaimModal show={showClaimModal} toggle={() => setShowClaimModal(s => !s)} />

      <FollowersModal
        show={showFollowersModal}
        id={params.id}
        toggle={() => setShowFollowersModal(s => !s)}
      />
    </Row>
  );
}

export default OrganizationHeader;
