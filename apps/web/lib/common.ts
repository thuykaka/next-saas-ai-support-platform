import * as ct from 'countries-and-timezones';

export const getContryFromTimezone = (timezone: string | undefined) => {
  if (!timezone) return null;

  const timezoneInfo = ct.getTimezone(timezone);

  if (!timezoneInfo?.countries) return null;

  const countryCode = timezoneInfo.countries[0];

  if (!countryCode) return null;

  const country = ct.getCountry(countryCode);

  return {
    countryCode,
    countryName: country?.name ?? 'Unknown'
  };
};
