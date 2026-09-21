const { club } = require('../data/club');

const toronto = new Intl.DateTimeFormat('en-CA', {
  timeZone: club.meeting.timeZone, year: 'numeric', month: '2-digit', day: '2-digit',
  hour: '2-digit', hourCycle: 'h23',
});

function nextMeeting(now = new Date()) {
  const local = Object.fromEntries(toronto.formatToParts(now).map(part => [part.type, part.value]));
  const day = new Date(Date.UTC(Number(local.year), Number(local.month) - 1, Number(local.day), club.meeting.startHour));
  let daysAhead = (club.meeting.weekday - day.getUTCDay() + 7) % 7;
  if (daysAhead === 0 && Number(local.hour) >= club.meeting.startHour) daysAhead = 7;
  day.setUTCDate(day.getUTCDate() + daysAhead);

  // Use the destination date's Toronto offset, including across DST changes.
  const offset = new Intl.DateTimeFormat('en', {
    timeZone: club.meeting.timeZone, timeZoneName: 'longOffset',
  }).formatToParts(day).find(part => part.type === 'timeZoneName').value;
  const [, sign, hours, minutes] = offset.match(/GMT([+-])(\d{2}):(\d{2})/);
  const offsetMinutes = (Number(hours) * 60 + Number(minutes)) * (sign === '+' ? 1 : -1);
  const start = new Date(day.getTime() - offsetMinutes * 60_000);
  return { start, end: new Date(start.getTime() + (club.meeting.endHour - club.meeting.startHour) * 60 * 60_000) };
}

const stamp = date => date.toISOString().replace(/[-:]/g, '').replace(/\.\d{3}Z$/, 'Z');
const escape = text => text.replace(/\\/g, '\\\\').replace(/\n/g, '\\n').replace(/[,;]/g, '\\$&');

// RFC 5545 uses CRLF and folds content lines at 75 octets.
function fold(line) {
  const lines = [];
  let current = '';
  for (const character of line) {
    if (Buffer.byteLength(current + character) > 75) {
      lines.push(current);
      current = ' ';
    }
    current += character;
  }
  return [...lines, current].join('\r\n');
}

function meetingCalendar(now = new Date()) {
  const { start, end } = nextMeeting(now);
  return [
    'BEGIN:VCALENDAR', 'VERSION:2.0', 'PRODID:-//Queens Chess Club//Club Night//EN',
    'CALSCALE:GREGORIAN', 'METHOD:PUBLISH', 'BEGIN:VEVENT',
    `UID:club-night-${stamp(start)}@queenschess`, `DTSTAMP:${stamp(now)}`,
    `DTSTART:${stamp(start)}`, `DTEND:${stamp(end)}`,
    "SUMMARY:Queen's Chess Club - Thursday club night",
    `LOCATION:${escape(club.meeting.location + ", Queen's University, Kingston, ON")}`,
    `DESCRIPTION:${escape('All levels welcome. Check Discord for holiday breaks and schedule changes before heading over: ' + club.discord)}`,
    `URL:${club.discord}`, 'END:VEVENT', 'END:VCALENDAR', '',
  ].map(fold).join('\r\n');
}

module.exports = { nextMeeting, meetingCalendar };
