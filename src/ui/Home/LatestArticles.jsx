import React from 'react'
import { useQuery } from '@tanstack/react-query'
import { getArticles } from '../../services/apiArticles'
import { Link } from 'react-router-dom'

function cleanTitle(s) {
  return String(s || '')
    .replace(/^["'“”]+|["'“”]+$/g, '')
    .replace(/,?\s*$/g, '')
}

function highlight(text) {
  const parts = String(text || '').split(/(\*\*[^*]+\*\*)/g)
  return parts.map((part, i) => {
    if (/^\*\*[^*]+\*\*$/.test(part)) {
      const inner = part.slice(2, -2)
      return <span key={i} className="font-extrabold text-gray-900">{inner}</span>
    }
    return <span key={i}>{part}</span>
  })
}

function ArticleCard({ a }) {
  return (
    <Link to={`/articles/${a.id}`} className="group bg-white rounded-2xl shadow-sm hover:shadow-md transition-all duration-300 ring-1 ring-gray-100 overflow-hidden">
      <div className="relative">
        {a.image_url && (
          <img
            src={a.image_url}
            alt={a.title_en}
            className="w-full h-44 object-cover"
            loading="lazy"
            decoding="async"
          />
        )}
        <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
      </div>
      <div className="p-4">
        <h3 className="text-base font-semibold text-gray-900 line-clamp-2 group-hover:text-primary transition-colors">{cleanTitle(a.title_en)}</h3>
        <p className="mt-2 text-sm text-gray-600 line-clamp-2">{highlight(a.content_en)}</p>
        <div className="mt-3 text-xs text-gray-500">{new Date(a.created_at).toLocaleDateString('en-US', { year:'numeric', month:'short', day:'numeric' })}</div>
      </div>
    </Link>
  )
}

function LatestArticles() {
  const { data, isLoading } = useQuery({
    queryKey: ['home_latest_articles'],
    queryFn: () => getArticles({ page: 1, pageSize: 3, showOnHomepage: true }),
  })

  const articles = data?.data || []

  return (
    <section className="py-16" id="latest-articles">
      <div className="max-w-7xl mx-auto px-4">
        <div className="flex items-end justify-between mb-8">
          <div>
            <h2 className="text-2xl md:text-3xl font-bold text-gray-900">Latest Articles</h2>
            <p className="text-gray-600 mt-2">Insights and tips from our team</p>
          </div>
          <Link
            to="/articles"
            className="inline-flex items-center gap-2 px-5 py-2.5 rounded-full bg-primary text-white shadow-sm hover:shadow-md transition-all duration-300 hover:bg-primary/90"
          >
            More Articles
            <i className="ri-arrow-right-line"></i>
          </Link>
        </div>

        {isLoading ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {[...Array(3)].map((_, i) => (
              <div key={i} className="animate-pulse bg-white rounded-2xl ring-1 ring-gray-100 h-64" />
            ))}
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {articles.map((a) => (
              <ArticleCard key={a.id} a={a} />
            ))}
          </div>
        )}
      </div>
    </section>
  )
}

export default LatestArticles