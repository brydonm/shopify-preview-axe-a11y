# 🧪 BrowserStack Shopify Preview Action

---

Automatically run [BrowserStack](https://www.browserstack.com/) tests on preview URLs mentioned in your PR description --- and post the results as a comment!

## ✅ Features

- 🔍 Extracts Shopify preview URL from PR body (no special formatting needed)
- 🧪 Runs BrowserStack CLI tests
- 💬 Comments the test results directly on the PR

---

## 🚀 Usage

Add this to your workflow in any repo:

```yaml
name: BrowserStack Preview Test

on:
  pull_request:
    types: [opened, edited, synchronize]

jobs:
  browserstack-test:
    runs-on: ubuntu-latest

    steps:
      - uses: actions/checkout@v3

      - uses: brydom/browserstack-shopify-preview@v1
        with:
          preview_url_contains: "shopifypreview.com"
          browserstack_username: ${{ secrets.BROWSERSTACK_USERNAME }}
          browserstack_access_key: ${{ secrets.BROWSERSTACK_ACCESS_KEY }}
          github_token: ${{ secrets.GITHUB_TOKEN }}
```

---

## 🔧 Inputs

| Name                    | Required | Description                                                            |
| ----------------------- | -------- | ---------------------------------------------------------------------- |
| preview_url_contains    | ✅ Yes   | Substring to match a preview URL in PR body (e.g., shopifypreview.com) |
| browserstack_username   | ✅ Yes   | Your BrowserStack username (use a GitHub Secret)                       |
| browserstack_access_key | ✅ Yes   | Your BrowserStack access key (use a GitHub Secret)                     |
| github_token            | ✅ Yes   | GitHub token to post PR comment (use secrets.GITHUB_TOKEN)             |

---

## 📝 PR Description Format

Include a preview URL **anywhere** in the PR body like:

https://your-site.shopifypreview.com/preview-path

The action will automatically find and test the first matching URL that contains `shopifypreview.com` or whatever value you set via `preview_url_contains`.

---

## 🛡️ Security

- Use GitHub Secrets to store sensitive credentials like your BrowserStack credentials.
- This action uses the GitHub token to comment on PRs securely.
