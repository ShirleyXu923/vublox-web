import Swal from 'sweetalert2';

import theme from '@config/theme';
import LocaleService from '@services/LocaleService';

type AlertOptions = {
  title: string;
  message: string;
};

type ConfirmAlertOptions = AlertOptions & {
  cancelButtonText?: string;
  confirmButtonText?: string;
  onConfirm?: () => void;
  onCancel?: () => void;
};

type PromptAlertOptions = ConfirmAlertOptions & {
  placeholder?: string;
  onConfirm?: (result: any) => void;
};

const confirmButton = LocaleService.getTranslations('general.button.confirm.name');
const cancelButton = LocaleService.getTranslations('general.button.cancel.name');

const swalWithBootstrapButtons = Swal.mixin({
  customClass: {
    confirmButton: 'btn btn-primary mr-2 pr-5 pl-5',
    cancelButton: 'btn btn-outline-secondary pr-5 pl-5',
  },
  buttonsStyling: false,
});

const confirm = (options: ConfirmAlertOptions) => swalWithBootstrapButtons.fire({
  title: options.title,
  text: options.message,
  showCancelButton: true,
  confirmButtonColor: theme.color.info,
  cancelButtonColor: theme.color.danger,
  cancelButtonText: options.cancelButtonText || cancelButton,
  confirmButtonText: options.confirmButtonText || confirmButton,
}).then((result) => {
  if (result.value) {
    if (options.onConfirm) {
      return options.onConfirm();
    }
  } else if (options.onCancel) {
    return options.onCancel();
  }

  return false;
});

const prompt = (options: PromptAlertOptions) => swalWithBootstrapButtons.fire({
  title: options.title,
  text: options.message,
  input: 'text',
  inputPlaceholder: options.placeholder || '',
  showCancelButton: true,
  confirmButtonColor: theme.color.info,
  cancelButtonColor: theme.color.danger,
  cancelButtonText: options.cancelButtonText || cancelButton,
  confirmButtonText: options.confirmButtonText || confirmButton,
}).then((result) => {
  if (!result.dismiss) {
    if (options.onConfirm) {
      return options.onConfirm(result.value);
    }
  } else if (options.onCancel) {
    return options.onCancel();
  }

  return false;
});

const alert = (options: AlertOptions) => swalWithBootstrapButtons.fire({
  title: options.title,
  text: options.message,
});

export default {
  alert,
  confirm,
  prompt,
};
