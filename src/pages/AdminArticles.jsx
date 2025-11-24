import React, { useMemo, useState } from 'react'
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { getArticles, createArticle, updateArticle, deleteArticle, uploadArticleImage } from '../services/apiArticles'
import Button from '../ui/Button'
import { toast } from 'react-hot-toast'

function AdminArticles() {
  const queryClient = useQueryClient()
  const [page, setPage] = useState(1)
  const [search, setSearch] = useState('')
  const [openForm, setOpenForm] = useState(false)
  const [editing, setEditing] = useState(null)
  const pageSize = 10

  const { data, isLoading } = useQuery({
    queryKey: ['articles', { page, search }],
    queryFn: () => getArticles({ page, pageSize, search }),
  })

  const { mutateAsync: createMutate } = useMutation({
    mutationFn: (payload) => createArticle(payload),
    onSuccess: () => { queryClient.invalidateQueries({ queryKey: ['articles'] }); toast.success('Article created') },
    onError: (e) => toast.error(e.message || 'Failed to create')
  })
  const { mutateAsync: updateMutate } = useMutation({
    mutationFn: ({ id, payload }) => updateArticle(id, payload),
    onSuccess: () => { queryClient.invalidateQueries({ queryKey: ['articles'] }); toast.success('Article updated') },
    onError: (e) => toast.error(e.message || 'Failed to update')
  })
  const { mutate: removeMutate } = useMutation({
    mutationFn: (id) => deleteArticle(id),
    onSuccess: () => { queryClient.invalidateQueries({ queryKey: ['articles'] }); toast.success('Article deleted') },
    onError: (e) => toast.error(e.message || 'Failed to delete')
  })

  const articles = useMemo(() => data?.data || [], [data])
  const count = data?.count || 0

  const openCreate = () => { setEditing(null); setOpenForm(true) }
  const openEdit = (a) => { setEditing(a); setOpenForm(true) }

  const toggleHomepage = async (a) => {
    await updateMutate({ id: a.id, payload: { show_on_homepage: !a.show_on_homepage } })
  }

  const remove = (id) => { if (confirm('Delete this article?')) removeMutate(id) }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-semibold">Articles</h1>
        <div className="flex gap-2">
          <input value={search} onChange={(e) => setSearch(e.target.value)} placeholder="Search" className="border border-gray-300 rounded-full px-4 py-2 text-sm" />
          <Button variation="primary" onClick={openCreate}>New Article</Button>
        </div>
      </div>

      {isLoading ? (
        <div className="p-8 text-center text-gray-600">Loading...</div>
      ) : (
        <div className="bg-white rounded-xl border border-gray-200 shadow-sm">
          <table className="w-full text-left">
            <thead>
              <tr className="border-b">
                <th className="px-4 py-3">Title</th>
                <th className="px-4 py-3">Image</th>
                <th className="px-4 py-3">Homepage</th>
                <th className="px-4 py-3">Updated</th>
                <th className="px-4 py-3">Actions</th>
              </tr>
            </thead>
            <tbody>
              {articles.map((a) => (
                <tr key={a.id} className="border-b">
                  <td className="px-4 py-3">
                    <div className="flex flex-col">
                      <span className="font-medium">{String(a.title_en || '').replace(/^["'“”]+|["'“”]+$/g, '').replace(/,?\s*$/g, '')}</span>
                      <span className="text-xs text-gray-500 line-clamp-1">{a.content_en?.slice(0, 120)}</span>
                    </div>
                  </td>
                  <td className="px-4 py-3">
                    {a.image_url ? <img src={a.image_url} alt={a.title_en} className="w-16 h-16 object-cover rounded" /> : <span className="text-xs text-gray-500">No image</span>}
                  </td>
                  <td className="px-4 py-3">{a.show_on_homepage ? 'Yes' : 'No'}</td>
                  <td className="px-4 py-3">{new Date(a.updated_at || a.created_at).toLocaleString('en-US')}</td>
                  <td className="px-4 py-3">
                    <div className="flex gap-2">
                      <Button variation="secondary" onClick={() => openEdit(a)}>Edit</Button>
                      <Button variation="secondary" onClick={() => toggleHomepage(a)}>{a.show_on_homepage ? 'Hide' : 'Show'}</Button>
                      <Button variation="secondary" onClick={() => remove(a.id)}>Delete</Button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
          <div className="flex items-center justify-between p-4">
            <span className="text-sm text-gray-600">{count} total</span>
            <div className="flex gap-2">
              <Button variation="secondary" onClick={() => setPage(Math.max(1, page - 1))}>Prev</Button>
              <Button variation="secondary" onClick={() => setPage(page + 1)}>Next</Button>
            </div>
          </div>
        </div>
      )}

      {openForm && (
        <ArticleForm
          initial={editing}
          onClose={() => setOpenForm(false)}
          onSave={async (values) => {
            const payload = {
              title_en: values.title_en,
              content_en: values.content_en,
              image_url: values.image_url,
              show_on_homepage: values.show_on_homepage,
            }
            if (editing) {
              await updateMutate({ id: editing.id, payload })
            } else {
              await createMutate(payload)
            }
            setOpenForm(false)
          }}
        />
      )}
    </div>
  )
}

function ArticleForm({ initial, onClose, onSave }) {
  const [title_en, setTitle] = useState(initial?.title_en || '')
  const [content_en, setContent] = useState(initial?.content_en || '')
  const [image_url, setImageUrl] = useState(initial?.image_url || '')
  const [show_on_homepage, setHomepage] = useState(initial?.show_on_homepage ?? true)
  const [isUploading, setUploading] = useState(false)
  const isValid = title_en.trim().length > 0 && content_en.trim().length > 0

  const upload = async (file) => {
    setUploading(true)
    try {
      const url = await uploadArticleImage(file)
      setImageUrl(url)
    } finally {
      setUploading(false)
    }
  }

  const save = () => {
    if (!isValid) { toast.error('Please fill title and content'); return }
    const cleanTitle = String(title_en || '').replace(/^["'“”]+|["'“”]+$/g, '').replace(/,?\s*$/g, '')
    onSave({ title_en: cleanTitle, content_en, image_url, show_on_homepage })
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      <div className="fixed inset-0 bg-black/40" onClick={onClose} />
      <div className="relative bg-white rounded-xl border border-gray-200 w-full max-w-3xl p-6 shadow-xl">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-xl font-semibold">{initial ? 'Edit Article' : 'New Article'}</h2>
          <button className="w-8 h-8 rounded-full border flex items-center justify-center" onClick={onClose}>×</button>
        </div>
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium mb-1">Title (EN)</label>
            <input className="w-full border rounded-md px-3 py-2" value={title_en} onChange={(e) => setTitle(e.target.value)} placeholder="Enter title" />
          </div>
          <div>
            <label className="block text-sm font-medium mb-1">Content (EN)</label>
            <textarea className="w-full border rounded-md px-3 py-2" rows={8} value={content_en} onChange={(e) => setContent(e.target.value)} placeholder="Write content" />
            <div className="flex justify-end text-xs text-gray-500 mt-1">{content_en.length} chars</div>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 items-center">
            <div>
              <label className="block text-sm font-medium mb-1">Image URL</label>
              <input className="w-full border rounded-md px-3 py-2" value={image_url} onChange={(e) => setImageUrl(e.target.value)} />
            </div>
            <div>
              <label className="block text-sm font-medium mb-1">Upload Image</label>
              <input type="file" accept="image/*" onChange={(e) => e.target.files?.[0] && upload(e.target.files[0])} />
              {isUploading && <p className="text-xs text-gray-500 mt-1">Uploading...</p>}
            </div>
          </div>
          <div className="flex items-center gap-2">
            <input id="show_home" type="checkbox" checked={show_on_homepage} onChange={(e) => setHomepage(e.target.checked)} />
            <label htmlFor="show_home" className="text-sm">Show on homepage</label>
          </div>
          <div className="flex items-center justify-end gap-2 mt-6">
            <Button variation="secondary" onClick={onClose}>Cancel</Button>
            <Button variation="primary" onClick={save} disabled={!isValid}>Save</Button>
          </div>
        </div>
      </div>
    </div>
  )
}

export default AdminArticles