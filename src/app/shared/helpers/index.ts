/* eslint-disable no-lonely-if */
import moment from 'moment';
import numeral from 'numeral';

// eslint-disable-next-line
import packageJson from '@root/package.json';
const packageName = packageJson.name;

const currencyFormat = (value: any, format = '0,0.00', currency = '₱', pad = true) => `${currency}${pad ? ' ' : ''}${numeral(value).format(format)}`;

const shortDateFormat = (date: moment.MomentInput) => moment(date).format('L');

const serverDateFormat = (date: moment.MomentInput) => moment(date).format('YYYY-MM-DD');

const timezoneDateFormat = (date: Date, timezone: string) => {
  const tz = moment().tz(timezone).format('Z');
  const tzDate = `${moment(date).format('YYYY-MM-DDTHH:mm:ss')}${tz}`;
  const newDate = moment(tzDate).utc();
  return newDate.isValid() ? newDate.format() : date.toISOString();
};

const serverDateTimeFormat = (date: Date, time: Date, timezone: string) => {
  const d = date;
  d.setHours(0);
  d.setMinutes(0);
  if (time) {
    d.setHours(time.getHours());
    d.setMinutes(time.getMinutes());
  }
  return timezoneDateFormat(d, timezone);
};

const utcToTimezoneDate = (date: any, timezone: string) => {
  if (!date) return new Date();

  return new Date(moment.tz(date, 'UTC').tz(timezone).format('YYYY-MM-DDTHH:mm:ss'));
};

// eslint-disable-next-line no-restricted-globals
const isValidDate = (d: any) => d instanceof Date && !isNaN(d as any);

const shortedFromNow = (date: Date) => {
  const time = moment(date).fromNow(true);
  if (time.includes('a few')) {
    return 'Just now';
  }
  const strDate = time.split(' ');
  let format = '';
  if (strDate[0] === 'an' || strDate[0] === 'a') {
    strDate[0] = '1';
    format = strDate[0] + strDate[1][0];
    return format;
  }

  format = strDate[0] + strDate[1][0];
  return format;
};

// Replace underscore with spaces and capitalize words
const humanize = (str: string) => {
  const removedUnderscore = str.split('_');
  const capitalizedWords = removedUnderscore.map(
    (word) => word.slice(0, 1).toUpperCase() + word.slice(1),
  );
  const joinedWords = capitalizedWords.join(' ');
  // Capitalize words that has slash symbol
  const removeSlashed = joinedWords.split('/');
  const mappedSlashed = removeSlashed.map((word) => word.slice(0, 1).toUpperCase() + word.slice(1));
  // Capitalize words that has dash symbol
  const joinedMappedWords = mappedSlashed.join('/');
  const removeDashed = joinedMappedWords.split('-');
  const mappedDashed = removeDashed.map((word) => word.slice(0, 1).toUpperCase() + word.slice(1));
  return mappedDashed.join('-');
};

const time24HourFormat = (date: moment.MomentInput) => moment(date).format('HH:mm');

const time12HourFormat = (
  date: moment.MomentInput,
  showDate = false,
  showYear = false,
) => {
  if (showDate) return moment(date).format('h:mm A');

  if (showYear) return moment(date).format('MMM. D, YYYY h:mm A');

  return moment(date).format('MMM. D h:mm A');
};

const dateFormat = (date: moment.MomentInput) => moment(date).format('YYYY-MM-DD');

const timestampToMonthDay = (date: moment.MomentInput) => moment(date).format('MMM. DD');

const timestampToDate = (date: moment.MomentInput, showYear = false) => {
  const parsedDate = moment(date);
  if (showYear) return parsedDate.format('MMM. D, YYYY');

  const now = moment();
  return now.isSame(date, 'year') ? parsedDate.format('MMM. D') : parsedDate.format('MMM. D, YYYY');
};

const dateToCalendar = (
  date: moment.MomentInput | null,
): string => {
  if (!date) {
    return '';
  }

  let momentDate: moment.Moment;

  if (typeof date === 'string' && date.startsWith('-')) {
    // BC date: use extended-year format.
    momentDate = moment(date, 'YYYYYY-MM-DD[T]HH:mm:ss.SSS[Z]');
  } else if (typeof date === 'string') {
    // AD date string: use custom format without strict mode.
    momentDate = moment(date, 'YYYY-MM-DD[T]HH:mm:ssZ');
  } else {
    momentDate = moment(date);
  }

  if (!momentDate.isValid()) {
    return 'Invalid Date';
  }

  const year = momentDate.year();
  return year < 1
    ? `${momentDate.format('DD MMM')} ${Math.abs(year)} BC`
    : momentDate.format('DD MMM YYYY');
};

const dateToTime = (date: Date | undefined | null) => moment(date).format('hh:mm A');

const dateToTimeWithSeconds = (date: Date | undefined | null) => moment(date).format('hh:mm:ss a');

const withTimeZone = (date: Date | null) => {
  // moment(date).format('DD MMM YYYY, h:mm a (zZ)')
  const fullDate = moment(date).format('DD MMM YYYY, h:mm a ([GMT]Z)');
  const timezone = moment.tz(moment.tz.guess()).zoneAbbr();
  return fullDate;
  return `${fullDate} (${timezone})`;
};

const timestampToDayOfWeek = (date: moment.MomentInput) => moment(date).format('dddd');

const timestampToDateTime = (date: moment.MomentInput) => moment(date).format('MMMM D, YYYY h:mm a');

const normalizeMobile = (mobile: string) => {
  let normalizedMobile = mobile;
  if (mobile.startsWith('0')) {
    normalizedMobile = normalizedMobile.replace('0', '');
  } else if (mobile.startsWith('63')) {
    normalizedMobile = normalizedMobile.replace('63', '');
  } else if (mobile.startsWith('+63')) {
    normalizedMobile = normalizedMobile.replace('+63', '');
  }
  return normalizedMobile;
};

const getCurrentVersion = () => localStorage.getItem(`${packageName}-version`);

const isLatestVersion = (currentVersion: string) => currentVersion === getCurrentVersion();

const setLatestVersion = (version: string) => localStorage.setItem(`${packageName}-version`, version);

// eg. ex***@gmail.com
const formatEmail = (email: string) => email?.replace(/(\w{3})[\w\\+.-]+@([\w.]+\w)/, '$1***@$2');

const getFormData = (data: any = {}, excludeList: string[] = []) => {
  const formData = new FormData();
  Object.keys(data).filter((k) => !excludeList.includes(k)).forEach((key) => {
    const value = data[key];
    if (Array.isArray(data[key])) {
      value.forEach((d: any, i: number) => {
        if (d && typeof d === 'object' && !(d instanceof File)) {
          Object.keys(d).forEach((k) => {
            formData.append(`${key}[${i}][${k}]`, d[k] || '');
          });
        } else {
          formData.append(`${key}[]`, d || '');
        }
      });
    } else if (value && typeof value === 'object' && !(value instanceof File)) {
      if (data[key] instanceof Date) {
        const v = data[key];
        formData.append(key, v.toISOString());
      } else {
        Object.keys(data[key]).forEach((d) => {
          formData.append(`${key}[${d}]`, data[key][d]);
        });
      }
    } else {
      if (value !== undefined && value !== null) {
        formData.append(key, value instanceof Date ? value?.toISOString() : value);
      }
    }
  });

  return formData;
};

declare global {
  interface Window {
    opera: any;
  }
}

// detect if the device was mobile/tablet
const mobileAndTabletCheck = () => {
  let check = false;
  // eslint-disable-next-line func-names, no-useless-escape
  (function (a) { if (/(android|bb\d+|meego).+mobile|avantgo|bada\/|blackberry|blazer|compal|elaine|fennec|hiptop|iemobile|ip(hone|od)|iris|kindle|lge |maemo|midp|mmp|mobile.+firefox|netfront|opera m(ob|in)i|palm( os)?|phone|p(ixi|re)\/|plucker|pocket|psp|series(4|6)0|symbian|treo|up\.(browser|link)|vodafone|wap|windows ce|xda|xiino|android|ipad|playbook|silk/i.test(a) || /1207|6310|6590|3gso|4thp|50[1-6]i|770s|802s|a wa|abac|ac(er|oo|s\-)|ai(ko|rn)|al(av|ca|co)|amoi|an(ex|ny|yw)|aptu|ar(ch|go)|as(te|us)|attw|au(di|\-m|r |s )|avan|be(ck|ll|nq)|bi(lb|rd)|bl(ac|az)|br(e|v)w|bumb|bw\-(n|u)|c55\/|capi|ccwa|cdm\-|cell|chtm|cldc|cmd\-|co(mp|nd)|craw|da(it|ll|ng)|dbte|dc\-s|devi|dica|dmob|do(c|p)o|ds(12|\-d)|el(49|ai)|em(l2|ul)|er(ic|k0)|esl8|ez([4-7]0|os|wa|ze)|fetc|fly(\-|_)|g1 u|g560|gene|gf\-5|g\-mo|go(\.w|od)|gr(ad|un)|haie|hcit|hd\-(m|p|t)|hei\-|hi(pt|ta)|hp( i|ip)|hs\-c|ht(c(\-| |_|a|g|p|s|t)|tp)|hu(aw|tc)|i\-(20|go|ma)|i230|iac( |\-|\/)|ibro|idea|ig01|ikom|im1k|inno|ipaq|iris|ja(t|v)a|jbro|jemu|jigs|kddi|keji|kgt( |\/)|klon|kpt |kwc\-|kyo(c|k)|le(no|xi)|lg( g|\/(k|l|u)|50|54|\-[a-w])|libw|lynx|m1\-w|m3ga|m50\/|ma(te|ui|xo)|mc(01|21|ca)|m\-cr|me(rc|ri)|mi(o8|oa|ts)|mmef|mo(01|02|bi|de|do|t(\-| |o|v)|zz)|mt(50|p1|v )|mwbp|mywa|n10[0-2]|n20[2-3]|n30(0|2)|n50(0|2|5)|n7(0(0|1)|10)|ne((c|m)\-|on|tf|wf|wg|wt)|nok(6|i)|nzph|o2im|op(ti|wv)|oran|owg1|p800|pan(a|d|t)|pdxg|pg(13|\-([1-8]|c))|phil|pire|pl(ay|uc)|pn\-2|po(ck|rt|se)|prox|psio|pt\-g|qa\-a|qc(07|12|21|32|60|\-[2-7]|i\-)|qtek|r380|r600|raks|rim9|ro(ve|zo)|s55\/|sa(ge|ma|mm|ms|ny|va)|sc(01|h\-|oo|p\-)|sdk\/|se(c(\-|0|1)|47|mc|nd|ri)|sgh\-|shar|sie(\-|m)|sk\-0|sl(45|id)|sm(al|ar|b3|it|t5)|so(ft|ny)|sp(01|h\-|v\-|v )|sy(01|mb)|t2(18|50)|t6(00|10|18)|ta(gt|lk)|tcl\-|tdg\-|tel(i|m)|tim\-|t\-mo|to(pl|sh)|ts(70|m\-|m3|m5)|tx\-9|up(\.b|g1|si)|utst|v400|v750|veri|vi(rg|te)|vk(40|5[0-3]|\-v)|vm40|voda|vulc|vx(52|53|60|61|70|80|81|83|85|98)|w3c(\-| )|webc|whit|wi(g |nc|nw)|wmlb|wonu|x700|yas\-|your|zeto|zte\-/i.test(a.substr(0, 4))) check = true; }(navigator.userAgent || navigator.vendor || window.opera));
  return check;
};

const formatShortNumber = (number: any) => numeral(number).format('0.[0]a');

const hex = (c: string) => {
  const v = `0${c.charCodeAt(0).toString(16)}`;
  return `\\x${v.substr(v.length - 2)}`;
};

const stringEscape = (s: string) => (s ? s
  .replace(/\\/g, '\\\\')
  .replace(/\n/g, '\\n')
  .replace(/\t/g, '\\t')
  .replace(/\v/g, '\\v')
  .replace(/'/g, "\\'")
  .replace(/"/g, '\\"')
  // eslint-disable-next-line
  .replace(/[\x00-\x1F\x80-\x9F]/g, hex) : s);

const shortNumberFormat = (n: number) => numeral(n).format('0.[00]a');

const isUserAdult = (user: any): boolean => {
  if (!user.profile.birth_date) {
    return false;
  }

  const birthDate = new Date(user.profile.birth_date);
  const today = new Date();

  const age = today.getFullYear() - birthDate.getFullYear();
  const hasHadBirthdayThisYear = today.getMonth() > birthDate.getMonth()
    || (today.getMonth() === birthDate.getMonth()
      && today.getDate() >= birthDate.getDate());

  const actualAge = hasHadBirthdayThisYear ? age : age - 1;

  return actualAge >= 18;
};

const getProfileLink = (user: any = {}) => {
  if (user.first_name && user.last_name) {
    return `/profile/${user.id}`; // replace when profile is implemented
  }
  return `/organizations/${user.id}`;
};

const timestampDifference = (
  fromTimestamp: moment.MomentInput,
  toTimestamp: moment.MomentInput,
) => {
  // Define two time instances
  const startTime = moment(fromTimestamp);
  const endTime = moment(toTimestamp);

  // Calculate the difference in minutes
  const differenceInMinutes = Math.abs(endTime.diff(startTime, 'minutes'));

  // Calculate days, hours, and minutes
  const days = Math.floor(differenceInMinutes / (60 * 24));
  const remainingHours = Math.floor((differenceInMinutes % (60 * 24)) / 60);
  const remainingMinutes = differenceInMinutes % 60;

  // Format the result as HH:mm
  let formattedDifference = `${String(remainingHours).padStart(2, '0')}:${String(remainingMinutes).padStart(2, '0')}`;
  if (days > 0) {
    // Format the result as DD:HH:mm
    formattedDifference = `${String(days).padStart(2, '0')}:${String(remainingHours).padStart(2, '0')}:${String(remainingMinutes).padStart(2, '0')}`;
  }
  return formattedDifference;
};

const minutesToHHMM = (minutes: number) => {
  const duration = moment.duration(minutes, 'minutes');
  const days = Math.floor(duration.asDays());
  const hours = duration.hours();
  const mins = duration.minutes();

  // Format the result as HH:mm
  let formattedDifference = `${hours.toString().padStart(2, '0')}:${mins.toString().padStart(2, '0')}`;
  if (days > 0) {
    // Format the result as DD:HH:mm
    formattedDifference = `${days.toString().padStart(2, '0')}:${hours.toString().padStart(2, '0')}:${mins.toString().padStart(2, '0')}`;
  }
  return formattedDifference;
};

export {
  currencyFormat,
  shortDateFormat,
  timezoneDateFormat,
  humanize,
  dateFormat,
  isValidDate,
  time24HourFormat,
  time12HourFormat,
  timestampToMonthDay,
  timestampToDate,
  timestampToDayOfWeek,
  timestampToDateTime,
  normalizeMobile,
  serverDateFormat,
  getCurrentVersion,
  isLatestVersion,
  setLatestVersion,
  formatEmail,
  getFormData,
  mobileAndTabletCheck,
  formatShortNumber,
  stringEscape,
  dateToCalendar,
  dateToTime,
  dateToTimeWithSeconds,
  withTimeZone,
  shortNumberFormat,
  getProfileLink,
  timestampDifference,
  minutesToHHMM,
  shortedFromNow,
  serverDateTimeFormat,
  utcToTimezoneDate,
  isUserAdult,
};
