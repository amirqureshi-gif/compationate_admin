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

## Website content (CMS)

After login, open **Website** in the sidebar. Pick a `section_key` (for example `hero`, `about_page`, `top_donors`) and edit the JSON. Saving calls `PUT /admin/site/:sectionKey` on the API; the main public site reads merged content from `GET /public/site`.

## Deploy on Railway

- **Build command**: `npm run build`
- **Start command**: `npm start`
- **Environment variable**:
  - `REACT_APP_API_BASE_URL` = your API base URL (example: `https://api.compassionatealliance.live`)

Set this variable **before** the Docker/Railway build step so webpack can embed it (this repo runs `npm run build` on install).

## Custom domain

You can host this on `admin.compassionatealliance.live` by adding the domain in Railway for this service and creating the matching DNS record (usually a CNAME) in Namecheap.

