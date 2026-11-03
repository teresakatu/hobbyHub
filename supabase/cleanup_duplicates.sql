delete from public.posts a
using public.posts b
where a.title = b.title
  and a.author_id = b.author_id
  and a.author_id in ('brewer-7f3a21', 'brewer-c09b44', 'brewer-5e2d90', 'brewer-a81f07')
  and a.id > b.id;

delete from public.comments a
using public.comments b
where a.post_id = b.post_id
  and a.content = b.content
  and a.author_id is not distinct from b.author_id
  and a.id > b.id;
