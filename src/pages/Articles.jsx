import React, { useState } from 'react'
import { useQuery } from '@tanstack/react-query'
import { getArticles } from '../services/apiArticles'
import { Link } from 'react-router-dom'
import Header from '../ui/Header/Header'

function Articles() {
  const [page, setPage] = useState(1)
  const [search, setSearch] = useState('')
  const { data, isLoading } = useQuery({
    queryKey: ['articles_public', { page, search }],
    queryFn: () => getArticles({ page, pageSize: 9, search }),
  })
  const articles = data?.data || []
  const count = data?.count || 0

  const cleanTitle = (s) => String(s || '').replace(/^["'“”]+|["'“”]+$/g, '').replace(/,?\s*$/g, '')
  const highlight = (text) => {
    const parts = String(text || '').split(/(\*\*[^*]+\*\*)/g)
    return parts.map((part, i) => {
      if (/^\*\*[^*]+\*\*$/.test(part)) {
        const inner = part.slice(2, -2)
        return <span key={i} className="font-extrabold text-gray-900">{inner}</span>
      }
      return <span key={i}>{part}</span>
    })
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <Header />
      <div className="max-w-7xl mx-auto p-6">
        <div className="flex items-center justify-between mb-8">
          <h1 className="text-3xl font-bold">Articles</h1>
          <input value={search} onChange={(e) => setSearch(e.target.value)} placeholder="Search" className="border rounded-full px-4 py-2 text-sm" />
        </div>
        {isLoading ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {[...Array(9)].map((_, i) => (
              <div key={i} className="animate-pulse bg-white rounded-2xl ring-1 ring-gray-100 h-64" />
            ))}
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {articles.map((a) => (
              <Link to={`/articles/${a.id}`} key={a.id} className="group bg-white rounded-2xl shadow-sm hover:shadow-md transition-all duration-300 ring-1 ring-gray-100 overflow-hidden">
                {a.image_url && (
                  <img src={a.image_url} alt={a.title_en} className="w-full h-40 object-cover" loading="lazy" decoding="async" />
                )}
                <div className="p-4">
                  <h3 className="text-base font-semibold text-gray-900 line-clamp-2 group-hover:text-primary transition-colors">{cleanTitle(a.title_en)}</h3>
                  <p className="mt-2 text-sm text-gray-600 line-clamp-2">{highlight(a.content_en)}</p>
                  <div className="mt-3 text-xs text-gray-500">{new Date(a.created_at).toLocaleDateString('en-US', { year:'numeric', month:'short', day:'numeric' })}</div>
                </div>
              </Link>
            ))}
          </div>
        )}
        <div className="flex items-center justify-between mt-8">
          <span className="text-sm text-gray-600">{count} articles</span>
          <div className="flex gap-2">
            <button onClick={() => setPage(Math.max(1, page - 1))} className="px-3 py-2 rounded-full border">Prev</button>
            <button onClick={() => setPage(page + 1)} className="px-3 py-2 rounded-full border">Next</button>
          </div>
        </div>
      </div>
    </div>
  )
}

export default Articles