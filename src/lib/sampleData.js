// Starter content used in demo mode (no Supabase keys). The same posts live in
// supabase/seed.sql so your real database can start with something to show.
const HOUR = 3600 * 1000
const DAY = 24 * HOUR

const ago = (ms) => new Date(Date.now() - ms).toISOString()

export function buildSampleData() {
  const posts = [
    {
      id: 1,
      created_at: ago(2 * HOUR),
      title: "What's your go-to pour-over ratio?",
      content:
        "I've been brewing a V60 every morning with 1:16 (20g coffee to 320g water), but my friend swears by 1:15 for a sweeter cup. What ratio do you use, and does it change with the roast level?",
      image_url: '',
      video_url: '',
      flag: 'Question',
      upvotes: 24,
      author_id: 'brewer-7f3a21',
      repost_of: null,
    },
    {
      id: 2,
      created_at: ago(1 * DAY + 3 * HOUR),
      title: 'Finally nailed latte art: my first tulip!',
      content:
        'Three months of wasted milk and I finally poured a tulip with four stacked layers. The trick for me was stopping the wiggle earlier and lifting the pitcher higher for the pull-through.',
      image_url:
        'https://images.unsplash.com/photo-1509042239860-f550ce710b93?auto=format&fit=crop&w=1200&q=80',
      video_url: '',
      flag: 'Showcase',
      upvotes: 41,
      author_id: 'brewer-c09b44',
      repost_of: null,
    },
    {
      id: 3,
      created_at: ago(3 * DAY),
      title: 'Unpopular opinion: light roasts are overrated for espresso',
      content:
        "Hot take: unless you have a high-end grinder and a machine with pressure profiling, a medium roast will pull a far more forgiving shot. Light roast espresso is fun, but it's not the only 'correct' way to enjoy coffee.",
      image_url: '',
      video_url: '',
      flag: 'Opinion',
      upvotes: 17,
      author_id: 'brewer-5e2d90',
      repost_of: null,
    },
    {
      id: 4,
      created_at: ago(5 * DAY),
      title: 'Cold brew concentrate recipe (1:4, 18 hours)',
      content:
        '1. Coarsely grind 200g of a chocolatey medium roast.\n2. Stir into 800g of cold filtered water.\n3. Steep 18 hours in the fridge.\n4. Filter twice: once through a mesh sieve, then a paper filter.\n5. Dilute 1:1 with water or milk over ice.\n\nKeeps for about 10 days.',
      image_url:
        'https://images.unsplash.com/photo-1461023058943-07fcbe16d735?auto=format&fit=crop&w=1200&q=80',
      video_url: '',
      flag: 'Recipe',
      upvotes: 33,
      author_id: 'brewer-7f3a21',
      repost_of: null,
    },
    {
      id: 5,
      created_at: ago(6 * DAY),
      title: 'Hand grinder recommendations under $150?',
      content:
        'Mostly brewing pour-over and the occasional AeroPress. Looking for something with consistent grind size that can survive travel. Any favorites?',
      image_url: '',
      video_url: '',
      flag: 'Gear',
      upvotes: 12,
      author_id: 'brewer-a81f07',
      repost_of: null,
    },
    {
      id: 6,
      created_at: ago(8 * DAY),
      title: 'Why does my AeroPress coffee taste sour?',
      content:
        "Using 15g coffee, 230g water just off the boil, 1:30 steep. It always tastes sour and thin. I've read that sour usually means under-extracted, so should I grind finer or steep longer?",
      image_url: '',
      video_url: '',
      flag: 'Question',
      upvotes: 8,
      author_id: 'brewer-5e2d90',
      repost_of: null,
    },
    {
      id: 7,
      created_at: ago(10 * DAY),
      title: 'Weekend trip to a local roastery',
      content:
        'Got a behind-the-scenes look at a small-batch roaster this weekend. Watching them pull samples to check color every 30 seconds gave me a whole new respect for consistency.',
      image_url:
        'https://images.unsplash.com/photo-1447933601403-0c6688de566e?auto=format&fit=crop&w=1200&q=80',
      video_url: '',
      flag: 'Showcase',
      upvotes: 19,
      author_id: 'brewer-c09b44',
      repost_of: null,
    },
    {
      id: 8,
      created_at: ago(1 * HOUR),
      title: 'Tested 1:15 vs 1:17 side by side',
      content:
        'Following up on the ratio thread: I brewed the same Ethiopian beans both ways. 1:15 was syrupy and fruit-forward; 1:17 was cleaner and more tea-like. Honestly both were great, so pick based on mood!',
      image_url: '',
      video_url: '',
      flag: 'Opinion',
      upvotes: 9,
      author_id: 'brewer-a81f07',
      repost_of: 1,
    },
  ]

  const comments = [
    { id: 1, post_id: 1, created_at: ago(90 * 60 * 1000), content: '1:16 for light roasts, 1:15 for anything darker. Darker roasts extract faster so I go a bit stronger.', author_id: 'brewer-c09b44' },
    { id: 2, post_id: 1, created_at: ago(70 * 60 * 1000), content: 'I just follow the bag recommendation and adjust grind size instead of ratio.', author_id: 'brewer-5e2d90' },
    { id: 3, post_id: 2, created_at: ago(20 * HOUR), content: "That's beautiful! What milk are you using?", author_id: 'brewer-7f3a21' },
    { id: 4, post_id: 3, created_at: ago(2 * DAY), content: 'Respectfully disagree, a good light roast shot tastes like fruit juice.', author_id: 'brewer-a81f07' },
    { id: 5, post_id: 6, created_at: ago(7 * DAY), content: 'Grind finer first! A longer steep with a coarse grind usually just tastes flat.', author_id: 'brewer-7f3a21' },
  ]

  return { posts, comments, nextPostId: 9, nextCommentId: 6 }
}
