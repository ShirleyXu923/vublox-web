import React, { useState } from 'react';
import ContentLoader from 'react-content-loader';
import { useSelector, useDispatch } from 'react-redux';
import { useMediaQuery } from 'react-responsive';
import { useNavigate } from 'react-router-dom';
import {
  DropdownItem, DropdownMenu, DropdownToggle, Input, UncontrolledDropdown,
} from 'reactstrap';

import { IRootState } from '@app/store';
import { changeAccountRequest, clearUserTokenRequest } from '@reducers/auth/AuthAction';
import { SwitchButton } from '@shared/buttons/SwitchButton';
import useAppTheme from '@shared/hooks/useAppTheme';
import useTranslation from '@shared/hooks/useTranslation';
import {
  BackIcon,
  ChevronRightIcon, SettingsIcon, SignOutIcon, UserGroupIcon, UserIcon,
  AnalyticsIcon,
  LanguageIcon,
  ThemeIcon,
  InfoIcon,
  RadioSelectedIcon,
  RadioIcon,
} from '@shared/icons';
import ContactIcon from '@shared/icons/ContactIcon';
import ContentManager from '@shared/icons/ContentManager';
import HowToUseIcon from '@shared/icons/HowToUseIcon';
import PrivacyOptionsIcon from '@shared/icons/PrivacyOptionsIcon';
import TermsAndConditionsIcon from '@shared/icons/TermsAndConditionsIcon';
import Avatar from '@shared/utils/Avatar/Avatar';

import LanguagePicker from '../language-picker/LanguagePicker';

interface AccountDropdownProps {
  isLoading?: boolean;
}

function AccountDropdown({ isLoading }: AccountDropdownProps) {
  const i18n = useTranslation('navbar.account');
  const user = useSelector((state: IRootState) => state.Auth.user) as any;
  const account = useSelector((state: IRootState) => state.Auth.account);
  const { theme, setTheme } = useAppTheme();
  const [ showAccounts, setShowAccounts ] = useState(false);
  const [ showLanguages, setShowLanguages ] = useState(false);
  // const [ organizations, setOrganizations ] = useState([]);
  const organizations = useSelector((state: IRootState) => state.Organization.own_organizations);

  const dispatch = useDispatch<any>();
  const isSmScreen = useMediaQuery({ query: '(max-width: 767px)' });
  const navigate = useNavigate();

  const logout = async () => {
    await dispatch(clearUserTokenRequest()).$promise;

    const bc = new BroadcastChannel('vublox_channel');
    bc.postMessage('logout');
  };

  const handleChangeAccount = async (data: any, type = 'user') => {
    const accountData = {
      ...data,
      type,
    };

    await dispatch(changeAccountRequest(accountData)).$promise;

    const url = window.location.href;

    if ((url.includes('/organizations') || url.includes('/profile')) && !url.includes('/profile/') && !url.includes('create') && !url.includes('edit') && !url.includes('timelines')) {
      navigate(accountData.type === 'organization' ? `/organizations/${accountData?.id}` : '/profile');
    }
  };

  const renderDropdownItemPlaceholder = () => (
    <DropdownItem>
      <Input type="radio" disabled className="mt-0 me-2" />
      <div className="sm">
        <ContentLoader
          width="30"
          height="30"
          viewBox="0 0 30 30"
          preserveAspectRatio="none"
          className="content-loader"
        >
          <rect width="30" height="30" rx={15} ry={15} />
        </ContentLoader>
      </div>
      <ContentLoader
        width="140"
        height="18"
        viewBox="0 0 140 18"
        preserveAspectRatio="none"
        className="content-loader ms-2"
        style={{ maxWidth: '100%' }}
      >
        <rect width="140" height="18" />
      </ContentLoader>
    </DropdownItem>
  );

  return (
    <UncontrolledDropdown
      nav
      inNavbar
      onToggle={(e, isOpen) => {
        if (isOpen) return;
        setShowAccounts(false);
        setShowLanguages(false);
      }}
      className="account-dropdown"
    >
      <DropdownToggle
        nav
        className="ms-0"
      >
        <Avatar user={account} size={isSmScreen ? 'sm' : 'lg'} />
      </DropdownToggle>
      <DropdownMenu end className="p-0">
        {showAccounts && (
          <>
            <DropdownItem onClick={() => setShowAccounts(false)} toggle={false}>
              <BackIcon className="ms-n1" fill="var(--bs-body-color)" /> {i18n.label.switchAccount}
            </DropdownItem>
            <DropdownItem divider />
            <DropdownItem onClick={() => handleChangeAccount(user, 'user')}>
              <div className="me-1">
                {account?.id === user?.id
                  ? <RadioSelectedIcon /> : <RadioIcon />}
              </div>
              <Avatar user={user} size="sm" />
              <span className="ms-1">
                {user?.display_name ?? ''}
              </span>
            </DropdownItem>
            {isLoading && renderDropdownItemPlaceholder()}
            {!isLoading && organizations?.map((organization: any) => (
              <DropdownItem
                onClick={() => handleChangeAccount(organization, 'organization')}
                key={organization?.id}
              >
                <div className="me-1">
                  {account?.id === organization?.id
                    ? <RadioSelectedIcon /> : <RadioIcon />}
                </div>
                <Avatar user={organization} size="sm" />
                <span className="ms-1 text-truncate">
                  {organization?.name}
                </span>
              </DropdownItem>
            ))}
            <DropdownItem divider />
            <DropdownItem onClick={() => navigate('/organizations/create')}>
              <UserGroupIcon className="me-1" />
              {i18n.label.createOrganizationPage}
            </DropdownItem>
          </>
        )}
        {showLanguages && (
          <LanguagePicker toggle={() => setShowLanguages(false)} />
        )}
        {(!showAccounts && !showLanguages) && (
          <>
            <DropdownItem onClick={() => navigate(`${account?.type === 'user' ? '/profile' : `/organizations/${account?.id}`}`)}>
              <Avatar user={account} />
              <div className="ms-2">
                {account?.name || account?.display_name}<br />
                <span className="btn btn-link btn-sm p-0">
                  {i18n.label.viewProfile}
                </span>
              </div>
            </DropdownItem>
            <DropdownItem onClick={() => setShowAccounts(true)} toggle={false}>
              <UserIcon fill="var(--bs-body-color)" className="me-2" /> {i18n.label.switchAccount}
              <div className="flex-fill" />
              <ChevronRightIcon width="15" height="15" stroke="var(--bs-body-color)" />
            </DropdownItem>
            <DropdownItem divider />
            <DropdownItem toggle={false}>
              <ThemeIcon className="me-2" /> {i18n.label.darkMode}
              <div className="flex-fill" />
              <SwitchButton
                offLabel={i18n.label.off}
                activeLabel={i18n.label.on}
                isActive={theme === 'light'}
                onChange={({ target: { value } }) => setTheme(value ? 'light' : 'dark')}
              />
            </DropdownItem>
            <DropdownItem onClick={() => setShowLanguages(true)} toggle={false}>
              <LanguageIcon className="me-2" /> {i18n.label.language}
              <div className="flex-fill" />
              <ChevronRightIcon width="15" height="15" stroke="var(--bs-body-color)" />
            </DropdownItem>
            <DropdownItem onClick={() => navigate('/analytics')}>
              <AnalyticsIcon className="me-2" /> {i18n.label.analytics}
            </DropdownItem>
            <DropdownItem onClick={() => navigate('/contents')}>
              <ContentManager className="me-2" /> {i18n.label.contentManager}
            </DropdownItem>
            <DropdownItem divider />
            <DropdownItem onClick={() => navigate('/instructions/all')}>
              <HowToUseIcon fill="var(--bs-body-color)" className="me-2" /> {i18n.label.howToUse}
            </DropdownItem>
            <DropdownItem onClick={() => navigate('/about-us')}>
              <InfoIcon fill="var(--bs-body-color)" className="me-2" /> {i18n.label.aboutUs}
            </DropdownItem>
            <DropdownItem onClick={() => navigate('/contact-us')}>
              <ContactIcon className="me-2" /> {i18n.label.contactUs}
            </DropdownItem>
            <DropdownItem onClick={() => navigate('/settings')}>
              <SettingsIcon className="me-2" /> {i18n.label.settings}
            </DropdownItem>
            <DropdownItem divider />
            <DropdownItem onClick={() => navigate('/terms-and-conditions')}>
              <TermsAndConditionsIcon fill="var(--bs-body-color)" className="me-2" /> {i18n.label.termsAndConditions}
            </DropdownItem>
            <DropdownItem onClick={() => navigate('/privacy-policy')}>
              <PrivacyOptionsIcon fill="var(--bs-body-color)" className="me-2" /> {i18n.label.privacyPolicy}
            </DropdownItem>
            <DropdownItem divider />
            <DropdownItem onClick={logout}>
              <SignOutIcon className="me-2" /> {i18n.label.signOut}
            </DropdownItem>
          </>
        )}
      </DropdownMenu>
    </UncontrolledDropdown>
  );
}

export default AccountDropdown;
