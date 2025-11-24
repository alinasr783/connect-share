import { useEffect, useMemo, useState } from "react"
import { toast } from "react-hot-toast"
import supabase from "../services/supabase"
import Button from "../ui/Button"
import Spinner from "../ui/Spinner"
import { sendPushToUsers } from "../services/notifications"

function AdminNotifications() {
  const [query, setQuery] = useState("")
  const [results, setResults] = useState([])
  const [selectedIds, setSelectedIds] = useState([])
  const [manualIds, setManualIds] = useState("")
  const [title, setTitle] = useState("")
  const [body, setBody] = useState("")
  const [sending, setSending] = useState(false)
  const [lastError, setLastError] = useState("")
  const [addId, setAddId] = useState("")
  const [recipients, setRecipients] = useState([])

  const allTargetIds = useMemo(() => {
    const manualList = manualIds
      .split(",")
      .map((s) => s.trim())
      .filter(Boolean)
    const unique = Array.from(new Set([...selectedIds, ...manualList]))
    return unique
  }, [selectedIds, manualIds])

  async function handleSearch() {
    if (!query || query.trim().length < 2) {
      setResults([])
      return
    }
    const { data, error } = await supabase
      .from("users")
      .select("userId, fullName, email, fcmToken")
      .or(`fullName.ilike.%${query}%,userId.ilike.%${query}%,email.ilike.%${query}%`)
      .order("fullName", { ascending: true })
      .limit(20)
    if (error) {
      setLastError("Failed to search users")
      setResults([
        {
          userId: query.trim(),
          fullName: "Manual",
          email: "",
        },
      ])
      return
    }
    setResults(data || [])
  }

  function addManualId() {
    const id = addId.trim()
    if (!id) return
    setSelectedIds((prev) => (prev.includes(id) ? prev : [...prev, id]))
    setAddId("")
  }

  function toggleSelect(id) {
    setSelectedIds((prev) => (prev.includes(id) ? prev.filter((x) => x !== id) : [...prev, id]))
  }

  async function handleSend() {
    if (!title.trim() || !body.trim()) {
      toast.error("Title and body are required")
      return
    }
    if (allTargetIds.length === 0) {
      toast.error("Select at least one user or add IDs")
      return
    }
    const activeRecipients = recipients.filter((r) => !!r.fcmToken)
    if (activeRecipients.length === 0) {
      toast.error("No recipients with valid push tokens")
      return
    }
    const payload = { title: title.trim(), body: body.trim() }
    if (import.meta.env.DEV) {
      activeRecipients.forEach((r) => {
        toast.success(`Simulated notification to ${r.fullName || r.userId}`)
      })
      setSelectedIds([])
      setManualIds("")
      setTitle("")
      setBody("")
      return
    }
    try {
      setSending(true)
      const res = await sendPushToUsers(activeRecipients.map((r) => r.userId), payload)
      console.log("send-push result", res)
      toast.success("Notifications queued")
      setLastError("")
      setSelectedIds([])
      setManualIds("")
      setTitle("")
      setBody("")
    } catch (e) {
      console.error("send-push error", e)
      setLastError(e.message || "Failed to send a request to the Edge Function")
      toast.error(e.message || "Failed to send notifications")
    } finally {
      setSending(false)
    }
  }

  useEffect(() => {
    setResults([])
    const t = setTimeout(() => {
      handleSearch()
    }, 400)
    return () => clearTimeout(t)
  }, [query])

  useEffect(() => {
    if (allTargetIds.length === 0) {
      setRecipients([])
      return
    }
    const fetchRecipients = async () => {
      const { data, error } = await supabase
        .from("users")
        .select("userId, fullName, email, fcmToken")
        .in("userId", allTargetIds)
      if (error) return
      setRecipients(data || [])
    }
    fetchRecipients()
  }, [allTargetIds])

  return (
    <div className="space-y-6">
      <div className="rounded-lg border border-gray-200 bg-white shadow-sm">
        <div className="p-6 border-b border-gray-200">
          <div className="flex items-center gap-3">
            <div className="h-10 w-10 rounded-full bg-purple-100 flex items-center justify-center">
              <i className="ri-notification-line text-purple-600 text-lg"></i>
            </div>
            <div>
              <h3 className="text-xl font-semibold text-gray-900">Send Custom Notifications</h3>
              <p className="text-gray-600">Search users, select targets, and send a message</p>
            </div>
          </div>
        </div>
        <div className="p-6 space-y-6">
          {lastError && (
            <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-md text-sm">
              <div className="flex items-center gap-2">
                <i className="ri-error-warning-line"></i>
                <span>{lastError}</span>
              </div>
            </div>
          )}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
            <div className="lg:col-span-7 space-y-4">
              <div className="flex gap-2">
                <input
                  type="text"
                  value={query}
                  onChange={(e) => setQuery(e.target.value)}
                  placeholder="Search by name, email, or userId"
                  className="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                />
                <Button variation="secondary" onClick={handleSearch} disabled={!query || sending}>
                  Search
                </Button>
              </div>

              <div className="flex gap-2">
                <input
                  type="text"
                  value={addId}
                  onChange={(e) => setAddId(e.target.value)}
                  placeholder="Add userId manually"
                  className="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                />
                <Button variation="secondary" onClick={addManualId} disabled={!addId || sending}>
                  Add
                </Button>
              </div>

              <div className="rounded-lg border border-gray-200">
                <div className="p-3 bg-gray-50 border-b border-gray-200 text-sm text-gray-600">
                  Results
                </div>
                <div className="max-h-80 overflow-y-auto p-3 space-y-2">
                  {results.length === 0 ? (
                    <div className="text-gray-500 text-sm">No results</div>
                  ) : (
                    results.map((u) => (
                      <label key={u.userId} className="flex items-center justify-between p-2 rounded-md hover:bg-gray-50">
                        <div className="flex items-center gap-3">
                          <input
                            type="checkbox"
                            checked={selectedIds.includes(u.userId)}
                            onChange={() => toggleSelect(u.userId)}
                          />
                          <div>
                            <div className="text-gray-900 font-medium text-sm">{u.fullName || "User"}</div>
                            <div className="text-gray-600 text-xs">
                              {u.email}
                              {u.fcmToken ? (
                                <span className="ml-2 inline-flex items-center text-green-600">
                                  <i className="ri-check-line mr-1"></i>
                                  push enabled
                                </span>
                              ) : (
                                <span className="ml-2 inline-flex items-center text-gray-500">
                                  <i className="ri-notification-off-line mr-1"></i>
                                  no token
                                </span>
                              )}
                            </div>
                          </div>
                        </div>
                        <div className="text-xs text-gray-400">{u.userId}</div>
                      </label>
                    ))
                  )}
                </div>
              </div>

              <div className="space-y-2">
                <label className="text-sm text-gray-700">Manual user IDs (comma separated)</label>
                <textarea
                  value={manualIds}
                  onChange={(e) => setManualIds(e.target.value)}
                  placeholder="e.g. 123, 456, 789"
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 h-20"
                />
                {allTargetIds.length > 0 && (
                  <div className="text-xs text-gray-600">Targets: {allTargetIds.length}</div>
                )}
                {allTargetIds.length > 0 && (
                  <div className="flex flex-wrap gap-2 mt-2">
                    {allTargetIds.map((id) => (
                      <button
                        key={id}
                        onClick={() => setSelectedIds((prev) => prev.filter((x) => x !== id))}
                        className="px-2 py-1 bg-gray-100 border border-gray-200 rounded-md text-xs hover:bg-gray-200"
                        title="Remove"
                      >
                        {id}
                      </button>
                    ))}
                  </div>
                )}
                {recipients.length > 0 && (
                  <div className="mt-3 text-xs text-gray-700">
                    <div className="flex items-center gap-2">
                      <i className="ri-user-received-line"></i>
                      <span>Recipients with push tokens: {recipients.filter((r) => !!r.fcmToken).length}</span>
                    </div>
                  </div>
                )}
              </div>
            </div>

            <div className="lg:col-span-5 space-y-4">
              <div className="space-y-2">
                <label className="text-sm text-gray-700">Title</label>
                <input
                  type="text"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                />
              </div>
              <div className="space-y-2">
                <label className="text-sm text-gray-700">Body</label>
                <textarea
                  value={body}
                  onChange={(e) => setBody(e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 h-32"
                />
              </div>
              <Button variation="primary" className="w-full" onClick={handleSend} disabled={sending}>
                {sending ? (
                  <>
                    <Spinner size="small" className="mr-2" />
                    Sending...
                  </>
                ) : (
                  <>
                    <i className="ri-send-plane-2-line mr-2"></i>
                    Send Notifications
                  </>
                )}
              </Button>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default AdminNotifications