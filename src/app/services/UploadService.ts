import { AxiosRequestConfig } from 'axios';

import { postRequest } from '@services/RequestService';

export default function uploadToServer(
  url: string, name: string, file: File, config: AxiosRequestConfig,
) {
  // eslint-disable-next-line no-async-promise-executor
  return new Promise(async (resolve, reject) => {
    const formData = new FormData();
    formData.append(name, file);

    try {
      const response = await postRequest(url, formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
        ...config,
      }).$promise;
      resolve(response.data);
    } catch (error) {
      reject(error);
    }
  });
}
