# 🧪 Shopify Preview Axe A11y Report

---

Automatically run [Axe](https://www.deque.com/axe/) tests on preview URLs mentioned in your PR description --- and post the results as a comment!

## ✅ Features

- 🔍 Extracts Shopify preview URL from PR body (no special formatting needed)
- 🧪 Runs Axe CLI tests
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

permissions:
  contents: write
  pull-requests: write

jobs:
  axe-shopify-report:
    runs-on: ubuntu-latest

    steps:
      - uses: actions/checkout@v3

      - uses: brydonm/shopify-preview-axe-a11y@v1
        with:
          default_url: ""
```

## 🔧 Inputs

| Name | Required | Description |
| -------------------- | -------- | -------------------------------------------------------------------------------------------------------------------- | |
| default_url | ✅ Yes | Default URL to run the base tests on. This is required for the push action to generate a report based on the branch. |

## 📝 PR Description Format

Include a preview URL **anywhere** in the PR body like ():

- https://your-site.shopifypreview.com
- https://your-site.com/?preview_theme_id=123456789

The action will automatically find and test the first matching URL that contains `?preview_theme_id` or `shopifypreview.com`.

## 🛡️ Security

- Use GitHub Secrets to store sensitive credentials.
- This action uses the GitHub token to comment on PRs securely.
