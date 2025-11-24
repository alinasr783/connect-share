import supabase from './supabase'

export async function getPosts({ page = 1, pageSize = 10, status, tag, search }) {
  const from = (page - 1) * pageSize
  const to = from + pageSize - 1

  let query = supabase
    .from('blog_posts')
    .select('*', { count: 'exact' })
    .order(status === 'published' ? 'published_at' : 'created_at', { ascending: false })

  if (status) query = query.eq('status', status)
  if (tag) query = query.contains('tags', [tag])
  if (search) query = query.ilike('title', `%${search}%`)

  const { data, error, count } = await query.range(from, to)
  if (error) throw error
  return { data: data || [], count: count || 0 }
}

export async function getPublishedPosts(params) {
  return getPosts({ ...params, status: 'published' })
}

export async function getPostBySlug(slug) {
  const { data, error } = await supabase
    .from('blog_posts')
    .select('*')
    .eq('slug', slug)
    .limit(1)
    .single()
  if (error) throw error
  return data
}

export async function createPost(payload) {
  const slug = payload.slug
  if (slug) {
    const { data: existing } = await supabase
      .from('blog_posts')
      .select('id')
      .eq('slug', slug)
      .limit(1)
    if (existing && existing.length) {
      payload.slug = `${slug}-${Math.random().toString(36).slice(2, 6)}`
    }
  }
  const { data, error } = await supabase
    .from('blog_posts')
    .insert([{ ...payload }])
    .select()
    .single()
  if (error) throw error
  return data
}

export async function updatePost(id, payload) {
  const { data, error } = await supabase
    .from('blog_posts')
    .update({ ...payload, updated_at: new Date().toISOString() })
    .eq('id', id)
    .select()
    .single()
  if (error) throw error
  return data
}

export async function deletePost(id) {
  const { error } = await supabase
    .from('blog_posts')
    .delete()
    .eq('id', id)
  if (error) throw error
}

export async function publishPost(id) {
  const { data, error } = await supabase
    .from('blog_posts')
    .update({ status: 'published', published_at: new Date().toISOString() })
    .eq('id', id)
    .select()
    .single()
  if (error) throw error
  return data
}

export async function uploadImage(file) {
  const ext = file.name.split('.').pop()
  const path = `${Date.now()}-${Math.random().toString(36).slice(2)}.${ext}`
  const { error } = await supabase.storage
    .from('blog-media')
    .upload(path, file)
  if (error) throw error
  const { data } = supabase.storage
    .from('blog-media')
    .getPublicUrl(path)
  return data.publicUrl
}