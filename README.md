# QA Automation Assignment — SauceDemo E2E Tests

End-to-end UI automation for the [SauceDemo](https://www.saucedemo.com) web
application, built with **WebdriverIO** and **JavaScript**. The suite automates
two real user journeys — logging in, and adding a product to the cart and
placing an order — using the Page Object Model, and runs both locally and in
CI (GitHub Actions).

---

## Tech stack

| Area | Choice |
| --- | --- |
| Automation tool | [WebdriverIO](https://webdriver.io) v9 |
| Language | JavaScript (ES Modules, Node.js 22) |
| Test framework | Jasmine (`@wdio/jasmine-framework`) |
| Design pattern | Page Object Model (POM) |
| Assertions | `expect` from `@wdio/globals` (expect-webdriverio) |
| Reporting | Spec reporter (console) + Mochawesome (HTML/JSON) |
| Config / secrets | `dotenv` (`.env`) |
| CI | GitHub Actions (headless Chrome) |

### Why this stack

The assignment notes a preference for **WebdriverIO with Cucumber** but invites
a justified alternative. I chose **WebdriverIO with Jasmine** because:

- **Jasmine over Cucumber**: for a focused two-scenario suite, Jasmine's
  `describe`/`it` structure keeps the tests direct and readable without the extra
  Gherkin + step-definition indirection that Cucumber adds. Cucumber shines when
  non-technical stakeholders author scenarios or when steps are heavily reused
  across many features; for this scope, plain Jasmine specs backed by reusable
  Page Objects give the same clarity with less boilerplate. The Page Object layer
  means the suite can be migrated to Cucumber later without rewriting the
  underlying interaction logic.

---

## Application under test

[SauceDemo](https://www.saucedemo.com) — Sauce Labs' public demo e-commerce site,
a standard practice target for UI automation.

---

## Automated scenarios

Two scenarios are automated (`./test/specs`):

### 1. Valid login — `login.js`
Logs in with valid credentials and verifies the inventory page loads (the
"Swag Labs" header is displayed).

**Why:** login is the gateway to every other flow; if it breaks, everything
downstream fails. It's the highest-value smoke check in the app.

### 2. Add to cart and place an order — `placeAnOrder.js`
The core purchase journey, end to end:
1. Log in.
2. Add the first product to the cart and capture its name.
3. Open the cart and assert the added product is present.
4. Proceed through checkout and fill in customer information.
5. **Validate the order summary** on the overview page — product name, payment
   info, shipping info, and that the grand total equals item total + tax.
6. Finish the order and assert the "Thank you for your order" confirmation.

**Why:** this is the primary business flow of an e-commerce site (revenue path).
It exercises multiple pages and includes a data-integrity check on the price
totals, not just element presence.

---

## Project structure

```
testAssignment/
├── .github/workflows/ci.yml   # GitHub Actions CI pipeline
├── pageobjects/               # Page Object Model — one class per page
│   ├── page.js                #   base page (shared open() / base URL)
│   ├── loginPage.js
│   ├── productPage.js
│   ├── cartPage.js
│   └── checkoutPage.js
├── test/specs/                # Test scenarios
│   ├── login.js
│   └── placeAnOrder.js
├── helper/
│   └── stepLogger.js          # prints readable steps to the console
├── wdio.conf.js               # WebdriverIO configuration
├── .env.example               # sample credentials (copy to .env)
└── package.json
```

**Page Object Model:** each page has a class exposing element getters and action
methods (e.g. `loginPage.login()`, `checkoutPage.getOrderSummary()`). Specs read
as high-level user steps and contain no raw selectors, so UI changes are fixed in
one place.

---

## Prerequisites

- **Node.js 22+** and npm
- **Google Chrome** installed (WebdriverIO manages the matching driver
  automatically)

---

## Setup

```bash
# 1. Clone and enter the project
git clone https://github.com/ayushadlerqa/testAssignment.git
cd testAssignment

# 2. Install dependencies
npm install

# 3. Create your .env from the template (public SauceDemo creds)
cp .env.example .env
```

---

## Running the tests

Run the full suite:

```bash
npm run wdio
```

Run a single spec:

```bash
npx wdio run ./wdio.conf.js --spec placeAnOrder.js
```

### Watching execution in slow motion

By default, each browser action pauses **1 second** locally so you can follow
every step visually; the console also prints readable `▶ STEP` lines. Adjust the
pace with the `SLOW_MO` environment variable (milliseconds):

```bash
SLOW_MO=2000 npm run wdio   # slower (2s per action)
SLOW_MO=0 npm run wdio      # full speed
```

Slow motion is disabled automatically in CI.

---

## Test reports

After a run, an HTML report is generated at:

```
mochawesome-report/test-report.html
```

Open it in a browser for a per-step, per-assertion breakdown. In CI, this report
is uploaded as a downloadable build artifact.

---

## Continuous Integration

`.github/workflows/ci.yml` runs the suite on every **push** and **pull request**
to `main`/`master`:

- Installs Node 22 and dependencies (`npm ci`)
- Runs Chrome **headless** (`--headless=new --no-sandbox`)
- Executes the tests and uploads the Mochawesome report as an artifact

Credentials are provided to CI via the job environment (SauceDemo's public demo
creds); for private credentials, swap them for GitHub repository secrets — see the
comment in `ci.yml`.

---

## Notes & assumptions

- Tests target SauceDemo's `standard_user`, which has no UI quirks.
- The order-summary check validates the **total = item total + tax** relationship
  rather than hard-coding a price, so it stays valid regardless of the product chosen.
- `.env` is git-ignored; never commit real credentials.
