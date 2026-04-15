# Compantinate Admin

Admin panel for CompassionateAlliance.

## Local development

1. Install:

```bash
npm install
```

2. Create `.env`:

```bash
copy .env.example .env
```

3. Run dev server:

```bash
npm run dev
```

## Deploy on Railway

- **Build command**: `npm run build`
- **Start command**: `npm start`
- **Environment variable**:
  - `REACT_APP_API_BASE_URL` = your API base URL (example: `https://api.compassionatealliance.live`)

## Custom domain

You can host this on `admin.compassionatealliance.live` by adding the domain in Railway for this service and creating the matching DNS record (usually a CNAME) in Namecheap.

