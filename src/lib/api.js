import { supabase } from './client'
import { buildSampleData } from './sampleData'
import { compressImage } from './image'

const POSTS = 'posts'
const COMMENTS = 'comments'
const BUCKET = 'post-images'

function unwrap({ data, error }) {
  if (error) throw new Error(error.message)
  return data
}

const STORE_KEY = 'gfd-demo-db-v1'
const delay = (ms = 350) => new Promise((r) => setTimeout(r, ms))

function loadDb() {
  try {
    const raw = localStorage.getItem(STORE_KEY)
    if (raw) return JSON.parse(raw)
  } catch {
  }
  const db = buildSampleData()
  saveDb(db)
  return db
}

function saveDb(db) {
  try {
    localStorage.setItem(STORE_KEY, JSON.stringify(db))
  } catch {
    throw new Error('Browser storage is full. Try a smaller image.')
  }
}

export function resetDemoData() {
  localStorage.removeItem(STORE_KEY)
}

export async function getPosts({ orderBy = 'created_at', search = '', flag = '' } = {}) {
  const term = search.trim()
  if (supabase) {
    let query = supabase.from(POSTS).select('*').order(orderBy, { ascending: false })
    if (term) query = query.ilike('title', `%${term}%`)
    if (flag) query = query.eq('flag', flag)
    return unwrap(await query)
  }
  await delay()
  const { posts } = loadDb()
  return posts
    .filter((p) => !term || p.title.toLowerCase().includes(term.toLowerCase()))
    .filter((p) => !flag || p.flag === flag)
    .sort((a, b) =>
      orderBy === 'upvotes'
        ? b.upvotes - a.upvotes || new Date(b.created_at) - new Date(a.created_at)
        : new Date(b.created_at) - new Date(a.created_at),
    )
}

export async function getPost(id) {
  if (supabase) {
    return unwrap(await supabase.from(POSTS).select('*').eq('id', id).maybeSingle())
  }
  await delay()
  return loadDb().posts.find((p) => p.id === Number(id)) ?? null
}

export async function getReposts(id) {
  if (supabase) {
    return unwrap(
      await supabase
        .from(POSTS)
        .select('id, title, created_at, upvotes')
        .eq('repost_of', id)
        .order('created_at', { ascending: true }),
    )
  }
  return loadDb()
    .posts.filter((p) => p.repost_of === Number(id))
    .sort((a, b) => new Date(a.created_at) - new Date(b.created_at))
}

function cleanPost(fields) {
  return {
    title: fields.title.trim(),
    content: fields.content?.trim() || '',
    image_url: fields.image_url?.trim() || '',
    video_url: fields.video_url?.trim() || '',
    flag: fields.flag || null,
    repost_of: fields.repost_of ? Number(fields.repost_of) : null,
  }
}

export async function createPost(fields, authorId) {
  const row = { ...cleanPost(fields), author_id: authorId }
  if (supabase) {
    return unwrap(await supabase.from(POSTS).insert(row).select().single())
  }
  await delay()
  const db = loadDb()
  const post = { id: db.nextPostId++, created_at: new Date().toISOString(), upvotes: 0, ...row }
  db.posts.push(post)
  saveDb(db)
  return post
}

export async function updatePost(id, fields) {
  const row = cleanPost(fields)
  if (supabase) {
    return unwrap(await supabase.from(POSTS).update(row).eq('id', id).select().single())
  }
  await delay()
  const db = loadDb()
  const post = db.posts.find((p) => p.id === Number(id))
  if (!post) throw new Error('Post not found')
  Object.assign(post, row)
  saveDb(db)
  return post
}

export async function deletePost(id) {
  if (supabase) {
    unwrap(await supabase.from(POSTS).delete().eq('id', id))
    return
  }
  await delay()
  const db = loadDb()
  db.posts = db.posts.filter((p) => p.id !== Number(id))
  db.comments = db.comments.filter((c) => c.post_id !== Number(id))
  db.posts.forEach((p) => {
    if (p.repost_of === Number(id)) p.repost_of = null
  })
  saveDb(db)
}

export async function upvotePost(id, currentCount) {
  if (supabase) {
    const { data, error } = await supabase.rpc('increment_upvotes', { row_id: Number(id) })
    if (!error) return data
    const row = unwrap(
      await supabase
        .from(POSTS)
        .update({ upvotes: currentCount + 1 })
        .eq('id', id)
        .select('upvotes')
        .single(),
    )
    return row.upvotes
  }
  const db = loadDb()
  const post = db.posts.find((p) => p.id === Number(id))
  post.upvotes += 1
  saveDb(db)
  return post.upvotes
}

export async function getComments(postId) {
  if (supabase) {
    return unwrap(
      await supabase
        .from(COMMENTS)
        .select('*')
        .eq('post_id', postId)
        .order('created_at', { ascending: true }),
    )
  }
  await delay(200)
  return loadDb()
    .comments.filter((c) => c.post_id === Number(postId))
    .sort((a, b) => new Date(a.created_at) - new Date(b.created_at))
}

export async function addComment(postId, content, authorId) {
  const row = { post_id: Number(postId), content: content.trim(), author_id: authorId }
  if (supabase) {
    return unwrap(await supabase.from(COMMENTS).insert(row).select().single())
  }
  const db = loadDb()
  const comment = { id: db.nextCommentId++, created_at: new Date().toISOString(), ...row }
  db.comments.push(comment)
  saveDb(db)
  return comment
}

export async function deleteComment(id) {
  if (supabase) {
    unwrap(await supabase.from(COMMENTS).delete().eq('id', id))
    return
  }
  const db = loadDb()
  db.comments = db.comments.filter((c) => c.id !== id)
  saveDb(db)
}

export async function uploadImage(file) {
  if (!file.type.startsWith('image/')) throw new Error('Please choose an image file.')
  const { blob, dataUrl } = await compressImage(file)
  if (supabase) {
    const path = `${Date.now()}-${Math.random().toString(36).slice(2, 8)}.jpg`
    const { error } = await supabase.storage
      .from(BUCKET)
      .upload(path, blob, { contentType: 'image/jpeg' })
    if (!error) return supabase.storage.from(BUCKET).getPublicUrl(path).data.publicUrl
    console.warn('Storage upload failed, storing image inline instead:', error.message)
  }
  return dataUrl
}
