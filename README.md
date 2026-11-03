# Web Development Final Project - Grounds for Discussion

Submitted by: **Teresa Nguyen**

This web app: **Grounds for Discussion is a HobbyHub forum for home coffee brewers. Users can share pour-over recipes, gear questions, latte-art wins and hot takes; browse a feed sorted by newest or most popular; search and filter by flag; and open any post to read the full content, image, and video, upvote it, comment on it, or repost it into a thread.**

Time spent: **8** hours spent in total

## Required Features

The following **required** functionality is completed:

- [x] **Web app includes a create form that allows the user to create posts**
  - Form requires users to add a post title
  - Forms should have the *option* for users to add:
    - additional textual content
    - an image added as an external image URL
- [x] **Web app includes a home feed displaying previously created posts**
  - Web app must include home feed displaying previously created posts
  - By default, each post on the posts feed should show only the post's:
    - creation time
    - title
    - upvotes count
  - Clicking on a post should direct the user to a new page for the selected post
- [x] **Users can view posts in different ways**
  - Users can sort posts by either:
    -  creation time
    -  upvotes count
  - Users can search for posts by title
- [x] **Users can interact with each post in different ways**
  - The app includes a separate post page for each created post when clicked, where any additional information is shown, including:
    - content
    - image
    - comments
  - Users can leave comments underneath a post on the post page
  - Each post includes an upvote button on the post page.
    - Each click increases the post's upvotes count by one
    - Users can upvote any post any number of times

- [x] **A post that a user previously created can be edited or deleted from its post pages**
  - After a user creates a new post, they can go back and edit the post
  - A previously created post can be deleted from its post page

The following **optional** features are implemented:

- [x] Web app implements pseudo-authentication
  - Users can only edit and delete posts or delete comments by entering the secret key, which is set by the user during post creation
  - **or** upon launching the web app, the user is assigned a random user ID.  It will be associated with all posts and comments that they make and displayed on them
  - For both options, only the original user author of a post can update or delete it
  - *Implemented with the random user ID option: each visitor gets an ID like `@brewer-a4b20d` that is shown on their posts and comments. Edit/Delete only appear for the author, and the edit page is locked for everyone else.*
- [x] Users can repost a previous post by referencing its post ID. On the post page of the new post
  - Users can repost a previous post by referencing its post ID
  - On the post page of the new post, the referenced post is displayed and linked, creating a thread
  - *The original post also lists every repost that references it, so the thread can be followed in both directions.*
- [x] Users can customize the interface
  - e.g., selecting the color scheme or showing the content and image of each post on the home feed
  - *Three color schemes (Espresso, Latte, Matcha) plus a toggle to show content and images on the home feed. Both are remembered between visits.*
- [x] Users can add more characterics to their posts
  - Users can share and view web videos
  - Users can set flags such as "Question" or "Opinion" while creating a post
  - Users can filter posts by flags on the home feed
  - Users can upload images directly from their local machine as an image file
  - *Videos: YouTube, Vimeo, or direct .mp4/.webm links are embedded. Flags: Question, Opinion, Recipe, Gear, Showcase. Uploads are resized in the browser and saved to Supabase Storage.*
- [x] Web app displays a loading animation whenever data is being fetched
  - *A custom "filling coffee cup" animation shows while the feed, posts, comments, and uploads load.*

The following **additional** features are implemented:

* [x] Live repost preview: typing a post ID in the form instantly shows which post you're threading onto (or warns that it doesn't exist)
* [x] Atomic upvotes through a Postgres function, so fast repeated clicks never overwrite each other
* [x] Comment authors can delete their own comments
* [x] Demo mode: with no Supabase keys the app still runs fully, saving data in the browser
* [x] Friendly empty, not-found and 404 states, plus a broken-image fallback
* [x] Responsive layout for phones, keyboard-accessible controls, and reduced-motion support

## Video Walkthrough

Here's a walkthrough of implemented user stories:

<img src='http://i.imgur.com/link/to/your/gif/file.gif' title='Video Walkthrough' width='' alt='Video Walkthrough' />

Browsing the feed: https://i.imgur.com/7UaXxsi.gif
Create, upvote, comment: https://i.imgur.com/yQGejJn.gif
Edit, thread, lock, delete: https://i.imgur.com/D76KXsh.gif

GIF created with [Kap](https://getkap.co/) for macOS

## Notes

Describe any challenges encountered while building the app.

- Keeping the home feed minimal (time, title, upvotes only) while still supporting a "detailed" view meant making the feed card render two layouts from the same data.
- Upvotes needed to be safe against rapid clicking, so they use an atomic `increment_upvotes` database function with an optimistic UI update.
- Supporting both external image URLs and local uploads led to compressing images in the browser before uploading them to Supabase Storage.

Setup instructions are in [SETUP.md](SETUP.md).

## License

    Copyright 2026 Teresa Nguyen

    Licensed under the Apache License, Version 2.0 (the "License");
    you may not use this file except in compliance with the License.
    You may obtain a copy of the License at

        http://www.apache.org/licenses/LICENSE-2.0

    Unless required by applicable law or agreed to in writing, software
    distributed under the License is distributed on an "AS IS" BASIS,
    WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
    See the License for the specific language governing permissions and
    limitations under the License.
