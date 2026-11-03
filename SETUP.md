# Setup

## 1. Install and run

```bash
npm install
npm run dev
```

Open the URL Vite prints (usually http://localhost:5173). With no Supabase keys the
app runs in **demo mode** and saves posts in your browser, so you can try everything
right away.

## 2. Connect Supabase

1. Create a project at [supabase.com](https://supabase.com/).
2. Open **SQL Editor → New query**, paste all of [`supabase/schema.sql`](supabase/schema.sql), and click **Run**.
   This creates the `posts` and `comments` tables (with RLS disabled, as the course
   instructs), the `increment_upvotes` function, and the `post-images` storage bucket.
3. (Optional) Run [`supabase/seed.sql`](supabase/seed.sql) the same way to add sample posts.
4. Copy `.env.example` to `.env` and fill in the values from
   **Project Settings → API** (Project URL and anon/publishable key):

   ```
   VITE_SUPABASE_URL=https://your-project-ref.supabase.co
   VITE_SUPABASE_ANON_KEY=your-anon-or-publishable-key
   ```

5. Restart `npm run dev`. The demo-mode banner disappears once you're connected.

## Project structure

```
src/
  lib/api.js          all database calls (Supabase, or localStorage in demo mode)
  lib/AppContext.jsx  user ID, theme, feed-detail toggle, search
  pages/              Home, CreatePost, PostPage, EditPost
  components/         Navbar, PostCard, PostForm, Comments, Loader, ...
supabase/             schema.sql and seed.sql
```

## Database

| posts        |                                    |
|--------------|------------------------------------|
| id           | bigint, identity, primary key      |
| created_at   | timestamptz, default now()         |
| title        | text, required                     |
| content      | text                               |
| image_url    | text (external URL or uploaded)    |
| video_url    | text                               |
| flag         | Question / Opinion / Recipe / Gear / Showcase |
| upvotes      | integer, default 0                 |
| author_id    | text (random brewer ID)            |
| repost_of    | bigint → posts.id                  |

| comments     |                                    |
|--------------|------------------------------------|
| id           | bigint, identity, primary key      |
| created_at   | timestamptz, default now()         |
| post_id      | bigint → posts.id (cascade delete) |
| content      | text                               |
| author_id    | text                               |
