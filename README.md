# Queen’s Chess Club website

Express and EJS website for Queen’s University Chess Club.

## Run locally

```sh
npm ci
npm start
```

Open <http://localhost:3000>. Set `PORT` to use a different port. The public website works without a database. An optional `.env` file with `URI` enables the existing MongoDB-backed team archive, registration, and chat features. Never commit that file.

## Update club information

- **Meetings and social links:** `data/club.js` is the shared source for the homepage, events, coaching, footer, and calendar. Update the display labels and numeric calendar fields together if the schedule changes, then update the calendar tests.
- **Past events:** edit the newest-first `events` list in `data/club.js`. These cards are explicitly an archive; publish future tournament announcements separately rather than marking an archived event as upcoming.
- **Team:** `views/exec.ejs` contains the published 2025–2026 roster. Update the year together with the bios when a new roster is available.
- **Coaching:** `views/coaching.ejs` describes past coaching topics and directs visitors to Discord for future dates.
- **Design:** `public/css/site.css`, the shared EJS partials, and `public/js/site.js`. Archived tournaments retain their original content and styles inside shared navigation and an archive notice.
- **Photos:** `public/images/optimized/` contains smaller WebP copies for the redesigned pages. Original photos remain available. Preserve orientation and use appropriately sized images when adding photos.

The calendar download creates **one next Thursday club night**, skipping a Thursday that has already started and respecting Toronto daylight-saving time. It does not create an indefinite recurring event. Check Discord for holiday breaks and cancellations.

## Validate

```sh
npm test
git diff --check
```

Tests run without a database and cover public routes, local links/assets, legacy redirects, unavailable registration, and calendar formatting/timezone boundaries. Use a current Node.js LTS release for development and tests.

For browser review, check Home, Events, Learn chess, Our team, and archived tournaments at 1440px, 768px, 390px, and 320px widths. Check the mobile menu (including Escape and keyboard focus), FAQ disclosures, event year filters, calendar download, and navigation with JavaScript disabled.
