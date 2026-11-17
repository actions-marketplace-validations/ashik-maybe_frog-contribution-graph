/**
 * Borsha season detection.
 *
 * Classical Bengali year has six seasons; borsha is the rain season,
 * Asharh and Srabon. Bangladesh's official calendar is solar and
 * approximate; ICU does not ship ca-bengali, so this uses the conventional
 * fixed window instead: June 15 through August 16, in Bangladesh local
 * time. Asia/Dhaka is the IANA zone for the whole country — one country,
 * one time — and the code must say so (constant COMMENT, not a wrong
 * statement about Dhaka). Do not name any single city in user-facing docs;
 * the constant name may be BANGLADESH_TIME_ZONE.
 */

// Asia/Dhaka is the IANA zone for the whole country: one country, one time.
// The name is a zone identifier, not a claim about any single city.
export const BANGLADESH_TIME_ZONE = 'Asia/Dhaka';

/** Fixed conventional window (approximate): Asharh 1 .. Srabon end. */
export const BORSHA_START = { month: 6, day: 15 };
export const BORSHA_END = { month: 8, day: 16 };

function monthDayIn(date) {
  const parts = new Intl.DateTimeFormat('en-US', {
    timeZone: BANGLADESH_TIME_ZONE,
    month: 'numeric',
    day: 'numeric',
  }).formatToParts(date);
  const get = (type) => Number(parts.find((p) => p.type === type).value);
  return { month: get('month'), day: get('day') };
}

/** True while it is Asharh or Srabon in Bangladesh. */
export function isBorsha(now = new Date()) {
  const { month, day } = monthDayIn(now);
  if (month === BORSHA_START.month) return day >= BORSHA_START.day;
  if (month === 7) return true;
  if (month === BORSHA_END.month) return day <= BORSHA_END.day;
  return false;
}

/** True when the action input allows rain and today is inside borsha. */
export function wantsRain(inputValue, now = new Date()) {
  return inputValue !== 'false' && isBorsha(now);
}
