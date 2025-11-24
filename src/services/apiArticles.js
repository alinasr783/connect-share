import supabase from './supabase'

export async function getArticles({ page = 1, pageSize = 10, search, showOnHomepage } = {}) {
  const from = (page - 1) * pageSize
  const to = from + pageSize - 1
  let q = supabase.from('articles').select('*', { count: 'exact' }).order('created_at', { ascending: false })
  if (search) q = q.ilike('title_en', `%${search}%`)
  if (showOnHomepage !== undefined) q = q.eq('show_on_homepage', !!showOnHomepage)
  const { data, error, count } = await q.range(from, to)
  if (error) throw error
  return { data: data || [], count: count || 0 }
}

export async function getArticleById(id) {
  const { data, error } = await supabase.from('articles').select('*').eq('id', id).single()
  if (error) throw error
  return data
}

export async function createArticle({ title_en, content_en, image_url, show_on_homepage = true }) {
  const payload = {
    title_en,
    title_ar: title_en,
    content_en,
    content_ar: content_en,
    image_url: image_url || null,
    show_on_homepage,
  }
  const { data, error } = await supabase.from('articles').insert([payload]).select().single()
  if (error) throw error
  return data
}

export async function updateArticle(id, { title_en, content_en, image_url, show_on_homepage }) {
  const patch = {}
  if (title_en !== undefined) { patch.title_en = title_en; patch.title_ar = title_en }
  if (content_en !== undefined) { patch.content_en = content_en; patch.content_ar = content_en }
  if (image_url !== undefined) patch.image_url = image_url
  if (show_on_homepage !== undefined) patch.show_on_homepage = !!show_on_homepage
  patch.updated_at = new Date().toISOString()
  const { data, error } = await supabase.from('articles').update(patch).eq('id', id).select().single()
  if (error) throw error
  return data
}

export async function deleteArticle(id) {
  const { error } = await supabase.from('articles').delete().eq('id', id)
  if (error) throw error
}

export async function uploadArticleImage(file) {
  const ext = file.name.split('.').pop()
  const path = `${Date.now()}-${Math.random().toString(36).slice(2)}.${ext}`
  const { error } = await supabase.storage.from('article-images').upload(path, file)
  if (error) throw error
  const { data } = supabase.storage.from('article-images').getPublicUrl(path)
  return data.publicUrl
}