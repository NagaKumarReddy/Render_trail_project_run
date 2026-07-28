# Launchpad — a tiny demo app for learning Render

A small full-stack task tracker (Node.js + Express backend, plain HTML/CSS/JS
frontend). It's intentionally simple — no database to set up, no build step,
no framework — so you can focus on learning the *deploy* part.

```
demo-app/
├── server.js         # Express server + JSON API
├── package.json
├── render.yaml        # optional: lets Render auto-configure the service
├── public/             # frontend (served as static files)
│   ├── index.html
│   ├── style.css
│   └── script.js
└── data/               # created automatically, stores tasks.json
```

## 1. Run it locally first

```bash
npm install
npm start
```

Then open **http://localhost:3000**. Add a few tasks, check them off, delete
one. This confirms everything works before you touch deployment.

## 2. Put it on GitHub

Render deploys from a Git repo, so the app needs to live on GitHub (or GitLab/
Bitbucket) first.

```bash
cd demo-app
git init
git add .
git commit -m "Initial commit: Launchpad demo app"
```

Create a new empty repo on [github.com/new](https://github.com/new), then:

```bash
git remote add origin https://github.com/YOUR-USERNAME/launchpad-demo.git
git branch -M main
git push -u origin main
```

## 3. Deploy on Render

1. Go to [render.com](https://render.com) and sign up / log in (you can sign in with GitHub).
2. Click **New +** → **Web Service**.
3. Connect your GitHub account if prompted, then select the `launchpad-demo` repo.
4. Render should auto-detect it's a Node app. Fill in (or confirm) these settings:
   - **Name**: `launchpad-demo` (or anything you like)
   - **Runtime**: Node
   - **Build Command**: `npm install`
   - **Start Command**: `npm start`
   - **Instance Type**: Free
5. Click **Create Web Service**.

Render will pull your repo, run the build command, and start the app. The
first deploy takes a minute or two — you can watch it happen live in the
**Logs** tab. Once it says "Live", your app is public at a URL like:

```
https://launchpad-demo.onrender.com
```

> The included `render.yaml` file means you could alternatively use Render's
> **Blueprints** feature (New + → Blueprint) to have Render read that file and
> configure the service automatically, instead of filling in the form by hand.

## 4. Try the full loop

This is the useful part to practice:

1. Change something small — e.g. edit the placeholder text in `index.html`,
   or the accent color in `style.css`.
2. `git add . && git commit -m "tweak" && git push`
3. Watch Render pick up the push automatically and redeploy (this is called
   **Continuous Deploy**, and it's on by default).
4. Refresh your live URL and see the change.

That push-and-watch-it-redeploy loop is the core skill this demo exists to
teach — once it feels boring and automatic, you've learned it.

## Notes / things worth knowing

- **Free-tier sleep**: Render's free web services spin down after a period of
  inactivity and take ~30–60 seconds to wake back up on the next request.
  That's normal, not a bug.
- **Data storage**: tasks are stored in a `data/tasks.json` file on disk.
  On Render's free tier the filesystem is *ephemeral* — it resets on every
  new deploy (and can reset on restarts). That's fine for learning, but if
  you want tasks to persist permanently, the next natural step is swapping
  the JSON file for a real database (Render offers free PostgreSQL instances
  too — a good "part 2" project).
- **Health check**: `GET /api/health` returns a small JSON status — useful
  for confirming the server is actually up, and it's the kind of endpoint
  Render itself can be configured to ping.
