/* eslint-disable react-hooks/exhaustive-deps */
import classNames from 'classnames';
import React, {
  useCallback, useEffect, useRef, useState,
} from 'react';
import { CircularProgressbar, buildStyles } from 'react-circular-progressbar';
import { isMobile } from 'react-device-detect';
import Webcam from 'react-webcam';
import {
  Button, ButtonGroup, Modal, ModalBody, ModalFooter, ModalHeader,
} from 'reactstrap';

import CameraPermission from '@shared/components/CameraPermission/CameraPermission';
import useTranslation from '@shared/hooks/useTranslation';
import {
  CameraCaptureIcon, PersonIcon, RefreshIcon,
  RetryIcon, VideoCaptureIcon, VideoModeIcon,
} from '@shared/icons';

import './WebcamCapture.scss';

const MAX_DURATION = 30;

function WebcamCapture({ onSuccess, show, toggle }: {
  onSuccess: (files: File[]) => void;
  show: boolean;
  toggle: () => void;
}) {
  const i18n = useTranslation('general');
  const webcamRef = React.useRef<Webcam>(null);
  const mediaRecorderRef = React.useRef<MediaRecorder>();
  const counterRef = useRef<NodeJS.Timer | undefined>();
  const [ mode, setMode ] = useState('photo');
  const [ photo, setPhoto ] = useState('');
  const [ video, setVideo ] = useState('');
  const [ videoBlob, setVideoBlob ] = useState<Blob>();
  const [ capturing, setCapturing ] = useState(false);
  const [ counter, setCounter ] = useState(0);
  const [ facingMode, setFacingMode ] = useState('user');

  const handleDataAvailable = useCallback(
    ({ data }: BlobEvent) => {
      if (data.size > 0) {
        const url = URL.createObjectURL(data);
        setVideo(url);
        setVideoBlob(data);
      }
    },
    [],
  );

  const handleStopCaptureClick = () => {
    if (counterRef.current) {
      clearInterval(counterRef.current as any);
      counterRef.current = undefined;
    }
    mediaRecorderRef.current?.stop();
    setCapturing(false);
  };

  const handleStartCaptureClick = () => {
    if (capturing) {
      setCapturing(false);
      handleStopCaptureClick();
      return;
    }

    setCapturing(true);
    if (webcamRef.current?.stream) {
      mediaRecorderRef.current = new MediaRecorder(webcamRef.current?.stream, {
        mimeType: 'video/mp4',
      });
      mediaRecorderRef.current.addEventListener(
        'dataavailable',
        handleDataAvailable,
      );
      mediaRecorderRef.current.start();
      counterRef.current = setInterval(() => {
        setCounter((s) => s + 0.1);
      }, 100);
    }
  };

  const capturePhoto = () => {
    const p: any = webcamRef.current?.getScreenshot();
    setPhoto(p);
  };

  const resetCapture = (resetPhotoVideo = true) => {
    if (resetPhotoVideo) {
      setPhoto('');
      setVideo('');
    }
    setCounter(0);
    setCapturing(false);

    if (counterRef.current) {
      clearInterval(counterRef.current as any);
      counterRef.current = undefined;
    }
  };

  const handleUpload = async () => {
    if (video) {
      onSuccess([ new File([ videoBlob as any ], 'video.mp4', { type: 'video/mp4' }) ]);
    } else {
      const blob = await fetch(photo).then((res) => res.blob());
      onSuccess([ new File([ blob as any ], 'photo', { type: 'image/png' }) ]);
    }
    toggle();
  };

  useEffect(() => {
    resetCapture();
  }, [ mode ]);

  useEffect(() => {
    if (counter >= MAX_DURATION && capturing) {
      handleStopCaptureClick();
    }
  }, [ counter, capturing ]);

  useEffect(() => {
    resetCapture(false);
  }, [ show ]);

  return (
    <Modal
      isOpen={show}
      toggle={toggle}
      centered
      size="lg"
      className="webcam-capture-modal"
    >
      <ModalHeader toggle={toggle} />
      <ModalBody className="p-0 d-flex align-items-center justify-content-center">
        <div className="w-75 position-absolute">
          <CameraPermission />
        </div>
        {(show && !photo && !video) && (
          <Webcam
            ref={webcamRef}
            className="webcam"
            imageSmoothing
            videoConstraints={{
              noiseSuppression: true,
              frameRate: {
                ideal: 60,
                max: 144,
              },
              echoCancellation: true,
              width: 800,
              height: 500,
              facingMode: facingMode ?? { exact: 'environment' },
            }}
            style={{
              borderTopLeftRadius: 12,
              borderTopRightRadius: 12,
            }}
          />
        )}
        {photo && (
          <img
            src={photo}
            style={{
              borderTopLeftRadius: 12,
              borderTopRightRadius: 12,
            }}
            alt="Preview"
          />
        )}
        {video && (
          <video
            src={video}
            controls
            width={800}
            height={500}
            style={{
              borderTopLeftRadius: 12,
              borderTopRightRadius: 12,
              marginBottom: -10,
            }}
          />
        )}
      </ModalBody>
      <ModalFooter className="justify-content-between">
        <div className="flex-fill">
          <ButtonGroup>
            <Button
              color="link"
              onClick={() => setMode('photo')}
              active={mode === 'photo'}
              className="p-0 px-2"
            >
              <PersonIcon width="20" />
            </Button>
            <Button
              color="link"
              onClick={() => setMode('video')}
              active={mode === 'video'}
              className="p-0 px-2"
            >
              <VideoModeIcon width="20" />
            </Button>
          </ButtonGroup>

          {isMobile && (
            <Button
              color="link"
              onClick={() => setFacingMode(s => (s ? '' : 'user'))}
              className="p-0 px-2"
            >
              <RefreshIcon width="20" height="20" fill="var(--text-placeholder)" />
            </Button>
          )}
        </div>

        <div className="flex-fill text-center">
          {(photo || video) ? (
            <Button
              color="danger"
              className="btn-capture btn-retry"
              onClick={() => resetCapture()}
            >
              <RetryIcon width="30" height="30" />
            </Button>
          ) : (
          // eslint-disable-next-line react/jsx-no-useless-fragment
            <>
              {mode === 'photo' ? (
                <Button
                  color="primary"
                  className="btn-capture"
                  onClick={capturePhoto}
                >
                  <CameraCaptureIcon width="30" height="30" />
                </Button>
              ) : (
                <div className="position-relative">
                  <Button
                    color="primary"
                    className="btn-capture"
                    onClick={handleStartCaptureClick}
                  >
                    {capturing ? (
                      <div className="stop" />
                    ) : (
                      <VideoCaptureIcon width="30" height="30" fill="var(--bs-body-color)" />
                    )}
                  </Button>
                  <div style={{
                    height: 65,
                    width: 65,
                    position: 'absolute',
                    left: 'calc(50% - 32.5px)',
                    right: 'calc(50% - 32.5px)',
                    bottom: -2,
                    zIndex: 0,
                    pointerEvents: 'none',
                  }}
                  >
                    <CircularProgressbar
                      value={counter}
                      maxValue={MAX_DURATION}
                      styles={buildStyles({
                        pathColor: 'var(--bs-danger)',
                      })}
                    />
                  </div>
                </div>
              )}
            </>
          )}
        </div>

        <div className="flex-fill text-end">
          <Button
            color="primary"
            size="sm"
            className={classNames({
              'btn-upload': true,
              invisible: !photo && !video,
            })}
            onClick={handleUpload}
          >
            {i18n.upload.upload}
          </Button>
        </div>
      </ModalFooter>
    </Modal>
  );
}

export default WebcamCapture;
