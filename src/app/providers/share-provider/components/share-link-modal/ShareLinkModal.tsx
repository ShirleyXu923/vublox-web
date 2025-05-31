import html2canvas from 'html2canvas';
import { debounce } from 'lodash';
import React, { useEffect, useState } from 'react';
import QRCode from 'react-qr-code';
import { useSelector, useDispatch } from 'react-redux';
import { useMediaQuery } from 'react-responsive';
import { FacebookShareButton, TwitterShareButton } from 'react-share';
import { toast } from 'react-toastify';
import {
  Button, Modal, ModalBody, ModalHeader,
} from 'reactstrap';

import { IRootState } from '@app/store';
import { addNotificationRequest } from '@reducers/auth/AuthAction';
import { handleError } from '@services/ErrorHandler';
import useTranslation from '@shared/hooks/useTranslation';
import { LinkIcon, SocialFacebookIcon, SocialTwitterIcon } from '@shared/icons';
import './ShareLinkModal.scss';
import CopyIcon from '@shared/icons/CopyIcon';
import QRCodeIcon from '@shared/icons/QRCodeIcon';
import QRCodeMini from '@shared/icons/QRCodeMini';

export const ShareLinkModal = {
  // eslint-disable-next-line no-unused-vars, @typescript-eslint/no-unused-vars
  toggle: (value: boolean) => {},
  // eslint-disable-next-line no-unused-vars, @typescript-eslint/no-unused-vars
  setLink: (url: string) => {},
  // eslint-disable-next-line no-unused-vars, @typescript-eslint/no-unused-vars
  setShareData: (data: any) => {},
};

interface ShareDataType {
  data_id: string | null;
  data_type: string | null;
  sender_id: string | null;
  receiver_id: string | null;
  action: string | null;
}

interface ShareDataFormType {
  data_id: string | null;
  data_type: string | null;
  receiver_id: string | null;
}

function ShareLinkModalRoot() {
  const i18n = useTranslation('home');
  const dispatch = useDispatch<any>();
  const [ showModal, setShowModal ] = useState(false);
  const [ link, setLink ] = useState<string>('');
  const [ activeButton, setActiveButton ] = useState('');
  const [ linkCopied, setLinkCopied ] = useState(false);
  const [ data, setData ] = useState<ShareDataType>({
    data_id: null,
    data_type: null,
    sender_id: null,
    receiver_id: null,
    action: null,
  });
  const isSmScreen = useMediaQuery({ query: '(max-width: 576px)' });

  const { isLoggedIn, account } = useSelector(({ Auth }: IRootState) => ({
    isLoggedIn: !!Auth.accessToken,
    account: Auth.account,
  }));

  const setShareData = (form: ShareDataFormType) => {
    setData({
      ...form,
      sender_id: account.id,
      action: 'Share',
    });
  };

  const handleToggle = () => {
    setShowModal(!showModal);
    setLinkCopied(false);
    setData({
      data_id: null,
      data_type: null,
      sender_id: null,
      receiver_id: null,
      action: null,
    });
  };

  const handleShare = debounce(async () => {
    if (data.data_id && isLoggedIn && data.sender_id && data.receiver_id && data.data_type) {
      try {
        await dispatch(addNotificationRequest(data)).$promise;
      } catch (error) {
        handleError(error);
      }
    }
  }, 2000);

  const copyLink = () => {
    handleShare();
    navigator.clipboard.writeText(link);
    setLinkCopied(true);
  };

  const copyImage = async () => {
    const qrCode: any = document.getElementById('qr-code-wrapper');

    const canvas = await html2canvas(qrCode, {
      windowWidth: qrCode.clientWidth,
      windowHeight: qrCode.clientHeight,
    });

    canvas.toBlob(async (blob: Blob | null) => {
      const res = [ new ClipboardItem({ 'image/png': blob as Blob }) ];
      await navigator.clipboard.write(res);
      handleShare();
      toast.success(i18n.label.QRCodeCopied);
    });
  };

  const downloadQR = async () => {
    const qrCode: any = document.getElementById('qr-code-wrapper');

    const canvas = await html2canvas(qrCode, {
      windowWidth: qrCode.clientWidth,
      windowHeight: qrCode.clientHeight,
    });
    const dataUrl = canvas.toDataURL('img/png');

    const a = document.createElement('a');
    a.download = 'my-image.png';
    a.href = dataUrl;
    a.click();
    handleShare();
  };

  useEffect(() => {
    ShareLinkModal.toggle = setShowModal;
    ShareLinkModal.setLink = setLink;
    ShareLinkModal.setShareData = setShareData;
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // useEffect(() => {
  //   setLinkCopied(false);
  // }, [ link ]);

  return (
    <Modal isOpen={showModal} toggle={handleToggle} centered className="modal-share">
      <ModalHeader toggle={handleToggle} className="px-3">
        <span className="title">{i18n.label.shareVia}</span>
      </ModalHeader>
      <ModalBody className="px-3 pb-3">
        <div className="w-100 d-flex justify-content-between mt-4" style={{ gap: '20px' }}>
          <FacebookShareButton
            url={link}
            className={`btn-share ${isSmScreen ? 'd-flex flex-column align-items-center justify-content-center' : ''}`}
            onClick={handleShare}
          >
            <SocialFacebookIcon width="30" height="30" style={isSmScreen ? { margin: '0' } : {}} />
            {!isSmScreen && <span className="b5">{i18n.label.facebook}</span>}
          </FacebookShareButton>
          <TwitterShareButton
            url={link}
            className={`btn-share ${isSmScreen ? 'd-flex flex-column align-items-center justify-content-center' : ''}`}
            onClick={handleShare}
          >
            <SocialTwitterIcon width="30" height="30" style={isSmScreen ? { margin: '0' } : {}} />
            {!isSmScreen && <span className="b5">{i18n.label.x}</span>}
          </TwitterShareButton>
          <Button
            outline
            color="transparent"
            className={`shadow-none btn-share fw-normal ${isSmScreen ? 'd-flex flex-column align-items-center justify-content-center' : ''} ${activeButton === 'link' ? 'active-btn' : ''}`}
            onClick={() => setActiveButton('link')}
          >
            <LinkIcon stroke="var(--bs-secondary-text)" fill="var(--bs-secondary-text)" style={isSmScreen ? { margin: '0' } : {}} />
            {!isSmScreen && <span className="b5">{i18n.label.link}</span>}
          </Button>
          <Button
            outline
            color="transparent"
            className={`shadow-none btn-share fw-normal ${isSmScreen ? 'd-flex flex-column align-items-center justify-content-center' : ''} ${activeButton === 'qr' ? 'active-btn' : ''}`}
            onClick={() => setActiveButton('qr')}
          >
            <QRCodeIcon className="qr-code" stroke="var(--bs-secondary-text)" style={isSmScreen ? { margin: '0' } : {}} />
            {!isSmScreen && <span className="b5">{i18n.label.qr}</span>}
          </Button>
        </div>

        {activeButton === 'link' && (
          <div className="w-100 d-flex justify-content-between align-items-center mt-4 link-container">
            <span className="b5">{link}</span>
            <Button onClick={copyLink} className="flat-btn" disabled={linkCopied}>{linkCopied ? i18n.label.linkCopied : i18n.label.copLink}</Button>
          </div>
        )}

        {activeButton === 'qr' && (
          <div className="w-100 d-flex justify-content-center align-items-center mt-4 qr-container">
            <div className="qr-wrapper">
              <div className="qr-code" id="qr-code-wrapper">
                <QRCode
                  id="qr-code-dom"
                  className="qr-code-element"
                  size={256}
                  style={{ height: 'auto', maxWidth: '100%', width: '100%' }}
                  value={link}
                  viewBox="0 0 256 256"
                />
              </div>
              <div className="d-flex justify-content-between align-items-center mt-3 actions">
                <Button className="flat-btn" onClick={copyImage}>
                  <CopyIcon />
                  <span className="b5">{i18n.label.copyImage}</span>
                </Button>
                <Button className="flat-btn" onClick={downloadQR}>
                  <QRCodeMini />
                  <span className="b5">{i18n.label.downloadQR}</span>
                </Button>
              </div>
            </div>
          </div>
        )}
      </ModalBody>
    </Modal>
  );
}

export const useShareLinkModal = () => ShareLinkModal;

export default ShareLinkModalRoot;
