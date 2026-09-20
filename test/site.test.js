const { test, before, after } = require('node:test');
const assert = require('node:assert/strict');
const { once } = require('node:events');
const { nextMeeting, meetingCalendar } = require('../lib/meeting-calendar');
const { events } = require('../data/club');

// Smoke tests must never connect to or modify the club's database.
process.env.URI = '';
const { server } = require('../app');
let base;
before(async () => {
  server.listen(0, '127.0.0.1');
  await once(server, 'listening');
  base = `http://127.0.0.1:${server.address().port}`;
});
after(() => new Promise(resolve => server.close(resolve)));

test('public pages and archived events render without database access', async () => {
  for (const route of ['/', '/eventsPage', '/coaching', '/execs', ...events.map(event => event.href)]) {
    const response = await fetch(base + route);
    assert.equal(response.status, 200, route);
    const html = await response.text();
    assert.match(html, /<!doctype html>/i, route);
    assert.doesNotMatch(html, /ReferenceError|SyntaxError/, route);
    {
      assert.equal((html.match(/class="site-header"/g) || []).length, 1, route);
      assert.equal((html.match(/id="main-content"/g) || []).length, 1, route);
      assert.match(html, /Jeffrey Hall, room 115/, route);
      assert.match(html, /Thursdays/, route);
      assert.match(html, /6:00–9:00 PM/, route);
    }
  }
});

test('core pages serve every linked local page, image, script, and stylesheet', async () => {
  const urls = new Set();
  for (const route of ['/', '/eventsPage', '/coaching', '/execs']) {
    const html = await (await fetch(base + route)).text();
    for (const match of html.matchAll(/(?:href|src)="(\/[^"#]*)(?:#[^"]*)?"/g)) urls.add(match[1]);
  }
  for (const url of urls) {
    const response = await fetch(base + url);
    assert.equal(response.status, 200, url);
    await response.arrayBuffer();
  }
});

test('calendar is a downloadable, uncached three-hour club night', async () => {
  const response = await fetch(base + '/meetings/next.ics');
  assert.match(response.headers.get('content-type'), /text\/calendar/);
  assert.match(response.headers.get('content-disposition'), /attachment.*queens-chess-club-night\.ics/);
  assert.equal(response.headers.get('cache-control'), 'no-store');
  const calendar = await response.text();
  const unfolded = calendar.replace(/\r\n /g, '');
  assert.match(unfolded, /LOCATION:Jeffrey Hall\\, room 115/);
  assert.match(unfolded, /Check Discord for holiday breaks/);
  assert.ok(calendar.endsWith('END:VCALENDAR\r\n'));
  assert.ok(calendar.split('\r\n').every(line => Buffer.byteLength(line) <= 75));
});

test('next club night follows Toronto time and daylight-saving changes', () => {
  const cases = [
    ['2026-09-20T12:00:00Z', '2026-09-24T22:00:00.000Z'],
    ['2026-09-24T21:59:00Z', '2026-09-24T22:00:00.000Z'],
    ['2026-09-24T22:00:00Z', '2026-10-01T22:00:00.000Z'],
    ['2026-09-25T01:00:00Z', '2026-10-01T22:00:00.000Z'],
    ['2026-03-06T02:00:00Z', '2026-03-12T22:00:00.000Z'],
    ['2026-10-30T01:00:00Z', '2026-11-05T23:00:00.000Z'],
    ['2026-12-31T23:00:00Z', '2027-01-07T23:00:00.000Z'],
  ];
  for (const [now, expected] of cases) {
    const { start, end } = nextMeeting(new Date(now));
    assert.equal(start.toISOString(), expected, now);
    assert.equal(end - start, 3 * 60 * 60 * 1000);
    const local = new Intl.DateTimeFormat('en', { timeZone: 'America/Toronto', weekday: 'long', hour: 'numeric', hour12: false }).format(start);
    assert.match(local, /Thursday/);
    assert.match(local, /18/);
  }
  assert.match(meetingCalendar(new Date(cases[0][0])), /DTSTART:20260924T220000Z/);
});

test('legacy links redirect and unavailable registration fails promptly', async () => {
  for (const [route, destination] of [['/homePage', '/'], ['/base', '/'], ['/cucc', '/CUCC2024']]) {
    const response = await fetch(base + route, { redirect: 'manual' });
    assert.equal(response.status, 302);
    assert.equal(response.headers.get('location'), destination);
  }
  const response = await fetch(base + '/signup', { method: 'POST', body: '' });
  assert.equal(response.status, 503);
});
