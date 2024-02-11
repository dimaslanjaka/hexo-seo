- clone test site

```bash
git clone -b hexo-seo https://github.com/dimaslanjaka/site.git site
```

- add `workspaces` to `package.json`

```json
{
  "workspaces": [
    "site"
  ]
}
```