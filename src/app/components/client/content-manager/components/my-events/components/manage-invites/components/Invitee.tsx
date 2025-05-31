import { useDispatch } from 'react-redux';
import { toast } from 'react-toastify';
import {
  NavLink,
  Row,
  Col,
  DropdownItem,
  DropdownMenu,
  DropdownToggle,
  UncontrolledDropdown,
} from 'reactstrap';

import { deleteInvitee } from '@reducers/event/EventAction';
import { handleError } from '@services/ErrorHandler';
import { BadgeType } from '@shared/components/AccordionTimeline/components/timeline/components/badge-type';
import { getProfileLink } from '@shared/helpers';
import useClickOutside from '@shared/hooks/useClickOutside';
import useTranslation from '@shared/hooks/useTranslation';
import {
  CheckIcon,
  DeclineIcon,
  MoreIconActive,
  PendingIcon,
} from '@shared/icons';
import MoreIcon from '@shared/icons/MoreIcon';
import Avatar from '@shared/utils/Avatar/Avatar';
import Checkbox from '@shared/utils/Forms/Checkbox/Checkbox';

export interface InviteeProps {
  data: {
    id: string;
    name: string;
    type: string;
    status?: string;
    displayName: string;
  };
  isInviteMore?: boolean;
  isSelected?: boolean;
  onSelect?: (id: string, type: string) => void;
  eventId?: string
  onDelete?: (id: string) => void;
}

function Invitee({
  data, isInviteMore, isSelected, onSelect, eventId, onDelete,
}: InviteeProps) {
  const i18n = useTranslation('contentManager');
  const dispatch = useDispatch<any>();
  const { ref, isOpen, toggle } = useClickOutside();

  const getBadgeProps = () => {
    if (!data.status) {
      return null;
    }
    const statusNormalized = data.status.toLowerCase();
    switch (statusNormalized) {
      case 'accepted':
      case 'Accepted':
        return {
          label: i18n.label.accepted || 'Accepted',
          icon: <CheckIcon />,
          fill: 'success' as const,
        };
      case 'declined':
      case 'Declined':
        return {
          label: i18n.label.declined || 'Declined',
          icon: <DeclineIcon />,
          fill: 'danger' as const,
        };
      case 'pending':
      case 'Pending':
      default:
        return {
          label: i18n.label.pending || 'Pending',
          icon: <PendingIcon />,
          fill: 'primary' as const,
        };
    }
  };

  const handleDelete = async (id: string) => {
    try {
      await dispatch(deleteInvitee(eventId, id));
      toast.success(i18n.events.inviteDelete);
      onDelete?.(id);
    } catch (error) {
      handleError(error);
    }
  };

  const badgeProps = getBadgeProps();

  return (
    <Row className="align-items-center w-100 invitee">
      <Col>
        <div className="d-flex align-items-center">
          {isInviteMore && (
            <Checkbox
              checked={isSelected}
              onChange={() => onSelect?.(data?.id, data?.type)}
            />
          )}
          <NavLink
            to={getProfileLink({ name: data.name })}
            target="_blank"
            className="link"
          >
            <Avatar user={{ name: data.name }} size="sm" />
          </NavLink>
          <div className="info ms-2">
            <NavLink
              to={getProfileLink({ name: data.name })}
              target="_blank"
              className="link"
            >
              <div className="owner-name">{data.name}</div>
            </NavLink>
            <div className="display-name">@{data.displayName ?? data.type}</div>
          </div>
        </div>
      </Col>
      {!isInviteMore && (
        <Col xs="auto">
          <div className="d-flex justify-content-end align-items-center w-100">
            {/* Only show a badge if the item is invited (status exists) */}
            {badgeProps && (
              <BadgeType
                icon={badgeProps.icon}
                label={badgeProps.label}
                fill={badgeProps.fill}
              />
            )}
            <div ref={ref}>
              <UncontrolledDropdown className="more-dropdown">
                <DropdownToggle
                  onClick={toggle}
                  style={{
                    backgroundColor: 'transparent',
                    borderColor: 'transparent',
                    boxShadow: 'none',
                    borderRadius: '0',
                    outline: 'none',
                  }}
                >
                  {isOpen ? <MoreIconActive /> : <MoreIcon />}
                </DropdownToggle>
                <DropdownMenu>
                  <DropdownItem onClick={() => { handleDelete(data.id); }}>
                    <div className="b5 text-danger">{i18n.events.delete}</div>
                  </DropdownItem>
                </DropdownMenu>
              </UncontrolledDropdown>
            </div>
          </div>
        </Col>
      )}
    </Row>
  );
}

export default Invitee;
