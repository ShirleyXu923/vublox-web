import './EventCard.scss';

// import classNames from 'classnames';
import React, { useEffect, useRef, useState } from 'react';
import { useDispatch } from 'react-redux';
import { Link, useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import {
  ButtonGroup,
  Card,
  DropdownItem,
  DropdownMenu,
  DropdownToggle,
  UncontrolledDropdown,
  Alert,
} from 'reactstrap';

import { useShareLinkModal } from '@app/providers/share-provider/ShareProvider';
import appConfig from '@config/app';
import { getNotificationsRequest } from '@reducers/auth/AuthAction';
import {
  acceptInvite, declineInvite, deleteEventRequest, getMyEventsRequest,
} from '@reducers/event/EventAction';
import { handleError } from '@services/ErrorHandler';
import { Button } from '@shared/buttons/Button';
import { BadgeType } from '@shared/components/AccordionTimeline/components/timeline/components/badge-type';
import { dateToCalendar, dateToTimeWithSeconds } from '@shared/helpers';
// import useAppTheme from '@shared/hooks/useAppTheme';
import useClickOutside from '@shared/hooks/useClickOutside';
import useThumbnail from '@shared/hooks/useThumbnail';
import useTranslation from '@shared/hooks/useTranslation';
import {
  CalendarIcon,
  CalendarPlusIcon,
  CalendarXIcon,
  CategoryIcon,
  ChevronDownIcon,
  CloseIcon,
  InfoIcon2,
  InviteOnlyIcon,
  LocationIcon,
  ManageCoCreators,
  MoreIconActive,
  TagIcon,
  UserIcon,
} from '@shared/icons';
import CheckIcon from '@shared/icons/CheckIcon';
import EditIcon from '@shared/icons/EditIcon';
import MoreIcon from '@shared/icons/MoreIcon';
import SocialShare from '@shared/icons/SocialShare';
import {
  CategoryType,
  ImageType,
  LocationType,
} from 'types';

import { AcceptModal } from '../accept-modal';
import { DeclineModal } from '../decline-modal';
import { DeleteModal } from '../delete-modal';
import { EndModal } from '../end-modal';
import { ManageCoCreator } from '../manage-cocreator';
import { ManageInvites } from '../manage-invites';
import { StartModal } from '../start-modal';

interface EventProps {
  event: {
    id: string;
    name?: string;
    ownerable_id?: string;
    description?: string;
    privacy_option?: string;
    started_at: Date;
    ended_at?: Date | null;
    type: string;
    banner?: ImageType;
    category?: CategoryType;
    location?: LocationType;
    tags?: string[];
    coCreators?: any;
    invite?: any;
    is_event_owner: boolean;
  };
  query?: any;
}

function EventCard({ event, query }: EventProps) {
  const i18n = useTranslation('contentManager');
  // const { logo } = useAppTheme();
  const dispatch = useDispatch<any>();
  const { ref, isOpen, toggle } = useClickOutside();
  const [ endModal, setEndModal ] = useState(false);
  const [ manageInviteModal, setManageInviteModal ] = useState(false);
  const [ manageCoCreatorModal, setManageCoCreatorModal ] = useState(false);
  const [ startModal, setStartModal ] = useState(false);
  const [ deleteModal, setDeleteModal ] = useState(false);
  const [ declineModal, setDeclineModal ] = useState(false);
  const [ acceptModal, setAcceptModal ] = useState(false);
  const toggleManageInvite = () => setManageInviteModal(!manageInviteModal);
  const toggleManageCoCreator = () => setManageCoCreatorModal(!manageCoCreatorModal);
  const toggleEndModal = () => setEndModal(!endModal);
  const toggleStartModal = () => setStartModal(!startModal);
  const toggleDeleteModal = () => setDeleteModal(!deleteModal);
  const [ isEndNow, setIsEndNow ] = useState(false);
  const navigate = useNavigate();
  const { toggle: toggleShare, setLink, setShareData } = useShareLinkModal();
  const { thumbnail } = useThumbnail(event);
  const [ userState, setUserState ] = useState({
    isUserPOV: false,
    isUserInvited: true,
    isUserDeclined: false,
    isUserAccepted: false,
  });
  const [ showStatusMessage, setShowStatusMessage ] = useState(true);

  const statusMessageTimerRef = useRef<NodeJS.Timeout | null>(null);

  const showStatusMessageWithTimer = () => {
    setShowStatusMessage(true);

    if (statusMessageTimerRef.current) {
      clearTimeout(statusMessageTimerRef.current);
    }

    statusMessageTimerRef.current = setTimeout(() => {
      setShowStatusMessage(false);
    }, 5000);
  };

  const handleEndModal = (endNow = false) => {
    setIsEndNow(endNow);
    setEndModal(true);
  };

  const toggleAcceptModal = () => {
    setAcceptModal(!acceptModal);
  };
  const toggleDeclineModal = () => {
    setDeclineModal(!declineModal);
  };

  const handleDeclineModal = async () => {
    await dispatch(declineInvite(event?.id, event?.invite?.id));
    await dispatch(getNotificationsRequest()).$promise;
    setUserState((prevState) => ({
      ...prevState,
      isUserDeclined: true,
      isUserInvited: false,
    }));
    showStatusMessageWithTimer();
    toggleDeclineModal();
  };
  const handleAcceptModal = async () => {
    await dispatch(acceptInvite(event?.id, event?.invite?.id));
    await dispatch(getNotificationsRequest()).$promise;

    setUserState((prevState) => ({
      ...prevState,
      isUserDeclined: false,
      isUserInvited: false,
      isUserAccepted: true,
    }));
    showStatusMessageWithTimer();
    toggleAcceptModal();
  };

  const handleDelete = async () => {
    try {
      await dispatch(deleteEventRequest(event?.id)).$promise;
      await dispatch(getMyEventsRequest(query)).$promise;
    } catch (error: any) {
      handleError(error);
    }
  };

  const handleShare = () => {
    setShareData({
      data_id: event?.id,
      data_type: 'Event',
      receiver_id: event?.ownerable_id,
    });

    setLink(`${appConfig.baseUrl}/events/${event?.id}`);
    toggleShare(true);
  };

  useEffect(() => {
    if (event?.invite) {
      setUserState({
        isUserPOV: true,
        isUserInvited: event.invite.status === 'pending',
        isUserDeclined: event.invite.status === 'declined',
        isUserAccepted: event.invite.status === 'accepted',
      });
    }
    setShowStatusMessage(false);
  }, [ event ]);

  useEffect(() => () => {
    if (statusMessageTimerRef.current) {
      clearTimeout(statusMessageTimerRef.current);
    }
  }, []);

  return (
    <Card className="my-events-card">
      <div className="d-flex head">
        <div className="d-flex chips-row">
          <CalendarIcon width={18} height={18} />
          <div className="b6 text-body mx-2">{dateToCalendar(event?.started_at)}, {dateToTimeWithSeconds(event?.started_at)}</div>
          {event?.ended_at && (
            <React.Fragment>
              <div className="b6 text-body mx-2">-</div>
              <div className="b6 text-body mx-2">{dateToCalendar(event?.ended_at)}, {dateToTimeWithSeconds(event?.ended_at)}</div>
            </React.Fragment>
          )}
        </div>
        <div className="more">
          <div ref={ref}>
            <UncontrolledDropdown className="more-dropdown">
              <DropdownToggle
                onClick={toggle}
                style={{
                  backgroundColor: 'transparent',
                  boxShadow: 'none',
                  borderRadius: '0',
                  outline: 'none',
                }}
              >
                {isOpen ? <MoreIconActive /> : <MoreIcon />}
              </DropdownToggle>
              <DropdownMenu>
                {event?.privacy_option === 'invite-only' && event?.is_event_owner && (
                  <DropdownItem onClick={() => toggleManageInvite()}>
                    <div className="b5 text-body">{i18n.events.manageInvites}</div>
                  </DropdownItem>
                )}
                <DropdownItem onClick={() => toast.info(i18n.info.upcoming)}>
                  <div className="b5 text-body">{i18n.events.boost}</div>
                </DropdownItem>
                {(event?.type === 'upcoming' || event?.type === 'indefinite') && (
                  <DropdownItem onClick={() => navigate(`/events/${event.id}/edit#step-1`)}>
                    <span className="b5 text-body">{i18n.events.edit}</span>
                  </DropdownItem>
                )}

                {event?.privacy_option === 'invite-only' && event?.is_event_owner && (
                  <DropdownItem onClick={toggleDeleteModal}>
                    <div className="b5 text-danger">{i18n.events.delete}</div>
                  </DropdownItem>
                )}
              </DropdownMenu>
            </UncontrolledDropdown>
          </div>
        </div>
      </div>
      {event.location && (
        <Link to={`/locations/${event?.location?.slug}`} className="d-flex chips-row mt-2">
          <LocationIcon width={18} height={18} />
          <div className="b5 mx-2">{event?.location?.name}</div>
        </Link>
      )}
      <Link to={`/events/${event?.id}`} className="media-link">
        <div className="media-image--default">
          {thumbnail}
        </div>
      </Link>

      <div className="d-flex align-items-center title">
        {event?.privacy_option === 'invite-only' && (
          <BadgeType label={i18n.events.inviteOnly} icon={<InviteOnlyIcon />} />
        )}
        <Link to={`/events/${event?.id}`} className="s3 text-body text-truncate ms-1">{event?.name}</Link>
      </div>
      {event?.description ? (
        <div className="b5 mt-2 text-truncate description">{event?.description}</div>
      ) : (
        <div className="mt-3" />
      )}
      <div className="chips mt-4">
        {/* <!-- Category Row --> */}
        <div className="d-flex chips-row my-2 flex-wrap">
          <CategoryIcon />
          <div className="chip caption1">{event?.category?.name}</div>
        </div>
        {/* <!-- Category Row --> */}

        {/* <!-- Tags Row --> */}
        <div className="d-flex chips-row my-2 flex-wrap">
          <TagIcon />
          {(event?.tags || [])?.length <= 0 && <span className="caption1">-</span>}
          {event?.tags?.map((tag: string) => (
            <div className="chip caption1" key={tag}>{tag}</div>
          ))}
        </div>
        {/* <!-- Tags Row --> */}

        {/* <!-- Co-Creators Row --> */}
        <div className="d-flex chips-row my-2 flex-wrap">
          <UserIcon />
          {(event?.coCreators || [])?.length <= 0 && <span className="caption1">-</span>}
          {event?.coCreators?.map((c: any) => (
            <Link to={c?.creator?.link} className="chip caption1" key={c?.creator?.id}>{c?.creator?.name}</Link>
          ))}
        </div>
        {/* <!-- Co-Creators Row --> */}
      </div>

      {((userState.isUserPOV && event?.privacy_option === 'invite-only' && showStatusMessage) && (
        <Alert color="highlight" className="d-inline-block mt-2">
          <div className="d-flex align-items-center caption1">
            <InfoIcon2
              fill="var(--bs-primary)"
              className="me-2"
            />
            {
              (() => {
                if (userState.isUserAccepted) {
                  return i18n.label.acceptedPerson;
                } if (userState.isUserDeclined) {
                  return i18n.label.declinedPerson;
                }
                return i18n.label.invitedPerson;
              })()
            }
          </div>
        </Alert>
      ))}

      {/* <!-- Action Buttons --> */}
      <div className="card-actions pt-4">
        {
          userState.isUserPOV
            && !userState.isUserDeclined
            && !userState.isUserAccepted
            && event?.privacy_option === 'invite-only' && (
            <>
              <div className="action-item">
                <Button
                  onClick={() => {
                    toggleAcceptModal();
                  }}
                  label={i18n.label.accept}
                  color="primary"
                  outline
                  icon={<CheckIcon />}
                />
              </div>
              <div className="action-item">
                <Button
                  onClick={() => {
                    toggleDeclineModal();
                  }}
                  label={i18n.label.decline}
                  className="decline-button r-button"
                  color="danger"
                  outline
                  icon={<CloseIcon />}
                />
              </div>
            </>
          )
        }
        {event?.privacy_option === 'invite-only' && !userState.isUserPOV && (
          <>
            <div className="action-item">
              <Button
                onClick={() => toggleManageInvite()}
                label={i18n.events.manageInvites}
                color="primary"
                outline
                icon={<InviteOnlyIcon />}
              />
            </div>
            <div className="action-item">
              <Button
                onClick={() => toggleManageCoCreator()}
                label={i18n.events.manageCoCreators}
                color="primary"
                outline
                icon={<ManageCoCreators />}
              />
            </div>
          </>
        )}
        {(event?.type === 'live' || event?.type === 'indefinite')
          && event?.privacy_option !== 'invite-only' && (
          <>
            <div className="action-item">
              <ButtonGroup>
                <Button
                  color="primary"
                  outline
                  label={i18n.events.endNow}
                  icon={<CalendarXIcon />}
                  onClick={() => handleEndModal(true)}
                />
                <UncontrolledDropdown>
                  <DropdownToggle className="r-button" color="primary" outline>
                    <ChevronDownIcon />
                  </DropdownToggle>
                  <DropdownMenu end dropup>
                    <DropdownItem onClick={() => handleEndModal()}>
                      <div className="d-flex align-items-center ">
                        <CalendarPlusIcon />
                        <span className="b5 mx-2 text-body">
                          {i18n.events.addEndDate}
                        </span>
                      </div>
                    </DropdownItem>
                    <DropdownItem onClick={() => handleEndModal(true)}>
                      <div className="d-flex align-items-center primary">
                        <CalendarXIcon />
                        <span className="b5 mx-2">{i18n.events.endNow}</span>
                      </div>
                    </DropdownItem>
                  </DropdownMenu>
                </UncontrolledDropdown>
              </ButtonGroup>
            </div>

            <div className="action-item">
              <Button
                onClick={handleShare}
                label="Share"
                color="primary"
                outline
                icon={<SocialShare />}
              />
            </div>
          </>
        )}

        {event?.type === 'upcoming' && (
          <div className="action-item">
            <Button
              onClick={() => navigate(`/events/${event?.id}/edit#step-1`)}
              label={i18n.events.editEvent}
              color="primary"
              outline
              icon={<EditIcon />}
            />
          </div>
        )}
      </div>
      {/* <!-- Action Buttons --> */}

      {/* <!-- Modals --> */}
      <EndModal
        query={query}
        modal={endModal}
        toggle={toggleEndModal}
        data={event}
        isEndNow={isEndNow}
      />
      <AcceptModal
        modal={acceptModal}
        toggle={toggleAcceptModal}
        eventTitle={event?.name}
        confirm={() => handleAcceptModal()}
      />
      <DeclineModal
        modal={declineModal}
        toggle={toggleDeclineModal}
        eventTitle={event?.name}
        confirm={() => handleDeclineModal()}
      />
      <ManageInvites
        modal={manageInviteModal}
        toggle={toggleManageInvite}
        eventId={event?.id}
      />
      <ManageCoCreator
        modal={manageCoCreatorModal}
        toggle={toggleManageCoCreator}
        eventId={event?.id}
      />
      <StartModal modal={startModal} toggle={toggleStartModal} data={event} />
      <DeleteModal
        modal={deleteModal}
        toggle={toggleDeleteModal}
        data={event}
        confirm={handleDelete}
      />
      {/* <!-- Modals --> */}
    </Card>
  );
}

export default EventCard;
