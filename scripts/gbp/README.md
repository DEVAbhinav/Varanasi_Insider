# GBP Scripts

Command-line tooling for the Google Business Profile listings.

**Full documentation: [`docs/GOOGLE-BUSINESS-PROFILE.md`](../../docs/GOOGLE-BUSINESS-PROFILE.md)**

## Prerequisites

Credentials and dependencies live in the sibling `seo_tools/content-pipeline`
project. Nothing secret is stored in this repo.

```bash
cd ../../../seo_tools/content-pipeline
docker compose up -d      # MongoDB holds the encrypted refresh token
```

If content-pipeline is somewhere else, set `CONTENT_PIPELINE_DIR`.

## Usage

```bash
cd scripts/gbp

node audit.mjs                       # health check - start here
node vom.mjs boat                    # verification state + available methods
node vlist.mjs boat                  # verification history / pending requests
node verify.mjs boat SMS             # request a code
node complete.mjs boat 123456        # redeem the code
node attrset.mjs boat                # set WhatsApp / booking / social links
```

Listing keys: `taxi`, `bike`, `boat`, `tempo`, `taxiOld`. A full
`locations/<id>` also works anywhere a key does.

## Rules

- **One SMS verification at a time.** All codes go to the same phone number and
  are indistinguishable once received.
- **A 503 can still register the request.** Check `vlist.mjs` before retrying.
- **Empty verification options means suspended**, not unverified. That needs the
  Appeals tool, not another verification attempt.
