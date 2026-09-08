# Point the GoDaddy domain at MIX

Public site: **https://mixxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx.club**

Localhost stays: **http://127.0.0.1:8910/**

GitHub Pages serves the `gh-pages` branch (built `dist/`). After DNS is set, GitHub issues a certificate.

Venture: [GoDaddy venture](https://dashboard.godaddy.com/venture?ventureId=8a0f8c80-0ed2-413e-bb08-d1b4d09f947a)

## GoDaddy DNS (this domain)

In [the domain settings](https://dcc.godaddy.com/control/portfolio/mixxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx.club/settings) open **DNS** → **Manage DNS**.

Delete conflicting A / CNAME records for `@` and `www` if GoDaddy parked the domain.

Add:

| Type | Name | Value | TTL |
| --- | --- | --- | --- |
| A | `@` | `185.199.108.153` | 600 |
| A | `@` | `185.199.109.153` | 600 |
| A | `@` | `185.199.110.153` | 600 |
| A | `@` | `185.199.111.153` | 600 |
| AAAA | `@` | `2606:50c0:8000::153` | 600 |
| AAAA | `@` | `2606:50c0:8001::153` | 600 |
| AAAA | `@` | `2606:50c0:8002::153` | 600 |
| AAAA | `@` | `2606:50c0:8003::153` | 600 |
| CNAME | `www` | `stp-kas.github.io` | 600 |

Save. Wait 5–30 minutes (sometimes a few hours).

Then in the GitHub repo **Settings → Pages**, confirm:

- Source: `gh-pages` / `/`
- Custom domain: `mixxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx.club`
- Check **Enforce HTTPS** once the certificate appears.

Do not put `.local/` seeds on this domain.

## Apply DNS from this machine

```powershell
cd C:\Users\Remco\mix-club
node scripts/apply-godaddy-dns.mjs
```

Sign in to GoDaddy in the Chrome window if asked. The script writes GitHub Pages A / AAAA / www CNAME records and drops parking forwards.
