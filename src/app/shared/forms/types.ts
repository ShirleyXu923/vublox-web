import { AxiosResponse } from 'axios';

import { AppDispatch } from '@app/store';

type SelectOptionType = {
  label: string;
  value: string;
};

export type FieldType = {
  id: string;
  label?: string;
  max?: number;
  min?: number;
  required?: boolean;
  feedback?: string;
  options?: SelectOptionType[]
  default?: any;
};

export type RequestType = (...params: any) => (dispatch: AppDispatch) => {
  $promise: Promise<AxiosResponse<any, any>>;
  cancel: () => void;
};

export type SubmitType = {
  label?: string;
  request: RequestType;
  params: any;
  after: (data: any) => void;
};
