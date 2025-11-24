import React from 'react'
import { useParams, Link } from 'react-router-dom'
import { useQuery } from '@tanstack/react-query'
import { getArticleById, getArticles } from '../services/apiArticles'
import Header from '../ui/Header/Header'
import { toast } from 'react-hot-toast'

function renderContentWithBlocks(text) {
  const tokens = String(text || '').split(/(\*\*[^*]+\*\*)/g)
  const elements = []
  tokens.forEach((tok, i) => {
    if (/^\*\*[^*]+\*\*$/.test(tok)) {
      const inner = tok.slice(2, -2)
      elements.push(<div key={`spacer-${i}`} className="h-4" />)
      elements.push(<p key={`bold-${i}`} className="font-extrabold text-lg text-gray-900">{inner}</p>)
    } else {
      const trimmed = tok.trim()
      if (trimmed) elements.push(<p key={`text-${i}`} className="mb-4 whitespace-pre-line text-gray-800">{trimmed}</p>)
    }
  })
  return elements
}

function ArticleDetails() {
  const { id } = useParams()
  const { data: a, isLoading } = useQuery({
    queryKey: ['article', id],
    queryFn: () => getArticleById(id),
    enabled: !!id,
  })
  const { data: relatedData } = useQuery({
    queryKey: ['article_related'],
    queryFn: () => getArticles({ page: 1, pageSize: 4 }),
  })
  const related = (relatedData?.data || []).filter((x) => x.id !== id).slice(0, 3)

  const share = () => {
    const url = `${window.location.origin}/articles/${id}`
    if (navigator.share) {
      navigator.share({ title: a?.title_en || 'Article', url }).catch(() => {})
    } else {
      navigator.clipboard.writeText(url).then(() => toast.success('Link copied')).catch(() => toast.error('Copy failed'))
    }
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <Header />
      <div className="max-w-3xl mx-auto p-6">
        {isLoading ? (
          <div className="p-8 text-center text-gray-600">Loading...</div>
        ) : !a ? (
          <div className="p-8 text-center text-gray-600">Not found</div>
        ) : (
          <article>
            <div className="flex items-center justify-between mb-6">
              <Link to="/articles" className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full border hover:bg-gray-50 transition-colors">
                <i className="ri-arrow-left-line" />
                Back to Articles
              </Link>
              <button onClick={share} className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full border hover:bg-gray-50 transition-colors">
                <i className="ri-share-line" />
                Share
              </button>
            </div>
            <h1 className="text-3xl font-bold text-gray-900">{String(a.title_en || '').replace(/^["'\u201C\u201D]+|["'\u201C\u201D]+$/g, '')}</h1>
            <div className="mt-2 text-sm text-gray-500">{new Date(a.created_at).toLocaleDateString('en-US', { year:'numeric', month:'long', day:'numeric' })}</div>
            {a.image_url && (
              <img src={a.image_url} alt={a.title_en} className="w-full rounded-xl mt-6" loading="lazy" decoding="async" />
            )}
            <div className="prose max-w-none mt-6 leading-relaxed">
              {renderContentWithBlocks(a.content_en)}
            </div>
            <div className="mt-8 flex items-center justify-between">
              <Link to="/articles" className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary text-white hover:bg-primary/90 transition-colors">
                More Articles
                <i className="ri-arrow-right-line" />
              </Link>
              <button onClick={share} className="inline-flex items-center gap-2 px-4 py-2 rounded-full border hover:bg-gray-50 transition-colors">
                <i className="ri-share-line" />
                Share Article
              </button>
            </div>
            {related.length > 0 && (
              <div className="mt-10">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">Related Articles</h3>
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                  {related.map((r) => (
                    <Link to={`/articles/${r.id}`} key={r.id} className="group bg-white rounded-2xl shadow-sm hover:shadow-md transition-all duration-300 ring-1 ring-gray-100 overflow-hidden">
                      {r.image_url && (
                        <img src={r.image_url} alt={r.title_en} className="w-full h-32 object-cover" loading="lazy" decoding="async" />
                      )}
                      <div className="p-4">
                        <h4 className="text-sm font-semibold text-gray-900 line-clamp-2 group-hover:text-primary transition-colors">{String(r.title_en || '').replace(/^["'\u201C\u201D]+|["'\u201C\u201D]+$/g, '')}</h4>
                        <div className="mt-2 text-xs text-gray-500">{new Date(r.created_at).toLocaleDateString('en-US', { year:'numeric', month:'short', day:'numeric' })}</div>
                      </div>
                    </Link>
                  ))}
                </div>
              </div>
            )}
          </article>
        )}
      </div>
    </div>
  )
}

export default ArticleDetails
