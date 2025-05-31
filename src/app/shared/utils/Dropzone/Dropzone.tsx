/* eslint-disable @typescript-eslint/no-namespace */
/* eslint-disable @typescript-eslint/no-explicit-any */
import classNames from 'classnames';
import _ from 'lodash';
import mime from 'mime';
import prettyBytes from 'pretty-bytes';
import React, { useEffect, useState } from 'react';
import {
  DropzoneOptions, FileRejection, FileWithPath, useDropzone,
} from 'react-dropzone';
import { toast } from 'react-toastify';
import { Button } from 'reactstrap';

import LocaleService from '@services/LocaleService';
// import { VideoIcon } from '@shared/icons';
import './Dropzone.scss';
import { CloseIcon } from '@shared/icons';

interface IDropZone extends DropzoneOptions {
  onDrop?: (acceptedFiles: File[], fileRejections: FileRejection[]) => void;
  single?: boolean;
  acceptedTypes?: any;
  onFileAdded?: (files: any[]) => void;
  accept?: any;
  className?: any;
  uploadText?: string;
  showChangeButton?: boolean;
  preview?: string;
  label?: string;
  required?: boolean;
  icon?: React.ReactElement;
  defaultPreview?: string | null;
}

function Dropzone({
  onDrop, onFileAdded, single, acceptedTypes, accept, className,
  uploadText, showChangeButton = true, preview, label, required, icon, defaultPreview, ...rest
}: IDropZone) {
  const i18n = LocaleService.getTranslations('general');
  const [ typeInvalid, setTypeInvalid ] = useState(false);
  const [ files, setFiles ] = useState<any[]>([]);
  const [ previewFile, setPreviewFile ] = useState(null) as any;
  const displayFile = files[0] || previewFile;

  const getMimeType = (_mime: string | undefined) => {
    if (_mime?.endsWith('.gltf')) {
      return 'model/gltf+json';
    } if (_mime?.endsWith('.glb')) {
      return 'model/gltf+binary';
    }
    return _mime;
  };

  const {
    acceptedFiles, getRootProps, getInputProps, open,
  } = useDropzone({
    onDrop: (ac, fileRejections) => {
      onDrop?.(acceptedFiles, fileRejections);
      let invalidType;
      if (ac && acceptedTypes) {
        invalidType = ac.some((a: FileWithPath) => !Object.keys(acceptedTypes).includes(a.type || getMimeType(a.path) || ''));
      }

      if (invalidType) {
        setTypeInvalid(true);
        return;
      }

      fileRejections.forEach((file) => {
        file.errors.forEach((err) => {
          if (err.code === 'file-too-large') {
            toast.error(LocaleService.parseTranslation(i18n.error.file_too_large, {
              fileSizeLimit: prettyBytes(rest.maxSize as number).replace(' ', ''),
            }));
          }
        });
      });

      const accepted = ac.map((file: FileWithPath) => {
        const type = file.type || getMimeType(file.path);
        return {
          file: new File([ file ], file.name, { type }),
          preview: URL.createObjectURL(file),
          type,
        };
      });
      setFiles(accepted);
      onFileAdded?.(accepted.map((f) => f.file));
    },
    multiple: !single,
    accept,
  });

  // const onChange = () => {
  //   open();
  // };

  const removeCurrent = () => {
    setPreviewFile(null);
    setFiles([]);
    onFileAdded?.([]);
  };

  useEffect(() => {
    if (preview) {
      setPreviewFile({
        preview,
        type: mime.getType(preview.split('.').pop() || ''),
      });
    }
  }, [ preview ]);

  useEffect(() => {
    if (!defaultPreview) {
      return;
    }

    setPreviewFile({
      preview: defaultPreview,
      type: 'image/png',
    });
  }, [ defaultPreview ]);

  useEffect(() => () => files.forEach((file) => URL.revokeObjectURL(file.preview)),
  // eslint-disable-next-line react-hooks/exhaustive-deps
    []);

  return (files.length === 0 && !displayFile) ? (
    <div className={classNames({
      'dropzone-container': true,
      [className]: true,
    })}
    >
      <div className="label">
        {label}
        {required && <span className="text-danger">*</span> }
      </div>
      <div {...getRootProps({ className: 'dropzone' })}>
        <input {...getInputProps()} />
        <div className="upload-icon">
          {icon}
        </div>
        <p className="mt-3 upload-text">{uploadText || i18n.upload.dropzone}</p>
        {typeInvalid && (
          <div className="text-danger">
            Invalid file type. Allowed files:
            {' '}
            {_.flattenDeep(Object.values(acceptedTypes)).join(', ')}
          </div>
        )}
      </div>
    </div>
  ) : (
    <div
      className={classNames({
        'dropzone-image-container w-100': true,
        [className]: true,
      })}
      onClick={() => !showChangeButton && open()}
    >
      <div className="label b5">{label}</div>
      <input {...getInputProps()} />
      {displayFile.type?.startsWith('image') && (
        <div className="relative preview-wrapper">
          <img
            alt="Preview"
            src={displayFile.preview}
            onLoad={() => { URL.revokeObjectURL(displayFile.preview); }}
          />
          <Button onClick={removeCurrent} color="icon">
            <CloseIcon />
          </Button>
        </div>
      )}
      {displayFile.type?.startsWith('audio') && (
        <audio
          controls
          src={displayFile.preview}
          onLoadedData={() => { URL.revokeObjectURL(displayFile.preview); }}
        />
      )}
      {displayFile.type?.startsWith('video') && (
        <video
          controls
          src={displayFile.preview}
          onLoadedData={() => { URL.revokeObjectURL(displayFile.preview); }}
        />
      )}

      {/* <div className="p-3 pt-2">
        <small className="text-secondary-emphasis">
          {i18n.upload.filename}
        </small>
        <br />
        <h6 className="fw-normal filename">
          {displayFile?.file.name}
        </h6>
        {showChangeButton && (
          <Button
            className="text-primary w-25 mt-2"
            color="tertiary"
            onClick={onChange}
            size="sm"
          >
            {i18n.upload.replace}
          </Button>
        )}
      </div> */}
    </div>
  );
}

export default Dropzone;
