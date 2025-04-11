# 🧪 Shopify Preview Axe A11y Report

---

Automatically run [Axe](https://www.deque.com/axe/) tests on preview URLs mentioned in your PR description --- and post the results as a comment!

## ✅ Features

- 🔍 Extracts Shopify preview URL from PR body (no special formatting needed)
- 🧪 Runs BrowserStack CLI tests
- 💬 Comments the test results directly on the PR
- 📊 Provides a detailed report of accessibility issues including analysis of net new issues

## 🚀 Usage

Add this to your workflow in any repo:

```yaml
name: Shopify Axe A11y Report

on:
  pull_request:
    types: [opened, edited, synchronize]
  push:
    branches: [main]

jobs:
  axe-shopify-report:
    runs-on: ubuntu-latest

    steps:
      - uses: actions/checkout@v3

      - uses: brydonm/shopify-preview-axe-a11y@v1
        with:
          preview_url_contains: "shopifypreview.com"
          default_url: ""
          github_token: ${{ secrets.SHOPIFY_AXE_A11Y_GITHUB_TOKEN }}
```

## 🔧 Inputs

| Name                 | Required | Description                                                                                                          |
| -------------------- | -------- | -------------------------------------------------------------------------------------------------------------------- |
| preview_url_contains | ✅ Yes   | Substring to match a preview URL in PR body (e.g., shopifypreview.com)                                               |
| default_url          | ✅ Yes   | Default URL to run the base tests on. This is required for the push action to generate a report based on the branch. |
| github_token         | ✅ Yes   | GitHub token to post PR comment (use `secrets.GITHUB_TOKEN`)                                                         |

## 📝 PR Description Format

Include a preview URL **anywhere** in the PR body like ():

- https://your-site.shopifypreview.com
- https://your-site.com/?preview_theme_id=123456789

The action will automatically find and test the first matching URL that contains `?preview_theme_id` or whatever value you set via `preview_url_contains`.

## 🛡️ Security

- Use GitHub Secrets to store sensitive credentials.
- This action uses the GitHub token to comment on PRs securely.
