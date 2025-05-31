import _ from 'lodash';
import prettyBytes from 'pretty-bytes';
import React, { useImperativeHandle } from 'react';
import {
  DropzoneOptions, FileRejection, FileWithPath, useDropzone,
} from 'react-dropzone';
import { toast } from 'react-toastify';

import LocaleService from '@services/LocaleService';

interface IDropZone extends DropzoneOptions {
  ref: React.Ref<any>;
  onDrop?: (acceptedFiles: File[], fileRejections: FileRejection[]) => void;
  onTypeError?: (errorMessage: string) => void;
  accept?: any;
  acceptedTypes?: any;
}

export type FileUploaderRef = {
  open: () => void;
};

function FileUploader({
  onDrop, onTypeError, accept, acceptedTypes, ...rest
}: IDropZone, ref: React.ForwardedRef<any>) {
  const i18n = LocaleService.getTranslations('general');

  const { getInputProps, open } = useDropzone({
    ...rest,
    onDrop: (acceptedFiles, fileRejections) => {
      let invalidType;
      if (acceptedFiles && acceptedTypes) {
        invalidType = acceptedFiles.some((a: FileWithPath) => !Object.keys(acceptedTypes).includes(a.type || ''));
      }

      if (invalidType) {
        const errorMessage = `Invalid file type. Allowed files: ${_.flattenDeep(Object.values(acceptedTypes)).join(', ')}`;
        onTypeError?.(errorMessage);
        return;
      }

      fileRejections.forEach((file) => {
        file.errors.forEach((err) => {
          if (err.code === 'file-too-large') {
            toast.error(LocaleService.parseTranslation(i18n.error.file_too_large, {
              fileSizeLimit: prettyBytes(rest.maxSize as number).replace(' ', ''),
            }));
          }

          if (err.code === 'file-invalid-type') {
            toast.error(i18n.error.file_type_invalid);
          }
        });
      });
      if (acceptedFiles.length === 0) return;
      onDrop?.(acceptedFiles, fileRejections);
    },
    multiple: false,
    accept,
  });

  const handleOpen = () => {
    open();
  };

  useImperativeHandle(ref, () => ({
    open: handleOpen,
  }));

  return (
    <input {...getInputProps()} />
  );
}

export default React.forwardRef<FileUploaderRef, IDropZone>(FileUploader);
