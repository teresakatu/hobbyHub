insert into public.posts (created_at, title, content, image_url, flag, upvotes, author_id) values
  (now() - interval '2 hours', 'What''s your go-to pour-over ratio?',
   'I''ve been brewing a V60 every morning with 1:16 (20g coffee to 320g water), but my friend swears by 1:15 for a sweeter cup. What ratio do you use, and does it change with the roast level?',
   '', 'Question', 24, 'brewer-7f3a21'),
  (now() - interval '27 hours', 'Finally nailed latte art: my first tulip!',
   'Three months of wasted milk and I finally poured a tulip with four stacked layers. The trick for me was stopping the wiggle earlier and lifting the pitcher higher for the pull-through.',
   'https://images.unsplash.com/photo-1509042239860-f550ce710b93?auto=format&fit=crop&w=1200&q=80', 'Showcase', 41, 'brewer-c09b44'),
  (now() - interval '3 days', 'Unpopular opinion: light roasts are overrated for espresso',
   'Hot take: unless you have a high-end grinder and a machine with pressure profiling, a medium roast will pull a far more forgiving shot. Light roast espresso is fun, but it''s not the only ''correct'' way to enjoy coffee.',
   '', 'Opinion', 17, 'brewer-5e2d90'),
  (now() - interval '5 days', 'Cold brew concentrate recipe (1:4, 18 hours)',
   E'1. Coarsely grind 200g of a chocolatey medium roast.\n2. Stir into 800g of cold filtered water.\n3. Steep 18 hours in the fridge.\n4. Filter twice: once through a mesh sieve, then a paper filter.\n5. Dilute 1:1 with water or milk over ice.\n\nKeeps for about 10 days.',
   'https://images.unsplash.com/photo-1461023058943-07fcbe16d735?auto=format&fit=crop&w=1200&q=80', 'Recipe', 33, 'brewer-7f3a21'),
  (now() - interval '6 days', 'Hand grinder recommendations under $150?',
   'Mostly brewing pour-over and the occasional AeroPress. Looking for something with consistent grind size that can survive travel. Any favorites?',
   '', 'Gear', 12, 'brewer-a81f07'),
  (now() - interval '8 days', 'Why does my AeroPress coffee taste sour?',
   'Using 15g coffee, 230g water just off the boil, 1:30 steep. It always tastes sour and thin. I''ve read that sour usually means under-extracted, so should I grind finer or steep longer?',
   '', 'Question', 8, 'brewer-5e2d90'),
  (now() - interval '10 days', 'Weekend trip to a local roastery',
   'Got a behind-the-scenes look at a small-batch roaster this weekend. Watching them pull samples to check color every 30 seconds gave me a whole new respect for consistency.',
   'https://images.unsplash.com/photo-1447933601403-0c6688de566e?auto=format&fit=crop&w=1200&q=80', 'Showcase', 19, 'brewer-c09b44');

insert into public.posts (created_at, title, content, flag, upvotes, author_id, repost_of)
select now() - interval '1 hour', 'Tested 1:15 vs 1:17 side by side',
       'Following up on the ratio thread: I brewed the same Ethiopian beans both ways. 1:15 was syrupy and fruit-forward; 1:17 was cleaner and more tea-like. Honestly both were great, so pick based on mood!',
       'Opinion', 9, 'brewer-a81f07', id
from public.posts where title = 'What''s your go-to pour-over ratio?';

insert into public.comments (post_id, created_at, content, author_id)
select p.id, now() - c.age, c.content, c.author_id
from (values
  ('What''s your go-to pour-over ratio?', interval '90 minutes', '1:16 for light roasts, 1:15 for anything darker. Darker roasts extract faster so I go a bit stronger.', 'brewer-c09b44'),
  ('What''s your go-to pour-over ratio?', interval '70 minutes', 'I just follow the bag recommendation and adjust grind size instead of ratio.', 'brewer-5e2d90'),
  ('Finally nailed latte art: my first tulip!', interval '20 hours', 'That''s beautiful! What milk are you using?', 'brewer-7f3a21'),
  ('Unpopular opinion: light roasts are overrated for espresso', interval '2 days', 'Respectfully disagree, a good light roast shot tastes like fruit juice.', 'brewer-a81f07'),
  ('Why does my AeroPress coffee taste sour?', interval '7 days', 'Grind finer first! A longer steep with a coarse grind usually just tastes flat.', 'brewer-7f3a21')
) as c(title, age, content, author_id)
join public.posts p on p.title = c.title;
