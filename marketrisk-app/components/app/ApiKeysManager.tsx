'use client'

// API Keys management component
// For Business tier users to manage their API keys

import { useState, useEffect } from 'react'
import { Key, Plus, Trash2, Copy, Check, Eye, EyeOff, AlertCircle } from 'lucide-react'

interface ApiKey {
  id: string
  name: string
  key_preview: string
  scopes: string[]
  rate_limit: number
  requests_count: number
  last_used_at: string | null
  is_active: boolean
  created_at: string
}

interface ApiKeysManagerProps {
  locale?: 'ro' | 'en'
}

export function ApiKeysManager({ locale = 'ro' }: ApiKeysManagerProps) {
  const [keys, setKeys] = useState<ApiKey[]>([])
  const [loading, setLoading] = useState(true)
  const [creating, setCreating] = useState(false)
  const [newKeyName, setNewKeyName] = useState('')
  const [newKey, setNewKey] = useState<string | null>(null)
  const [copiedKey, setCopiedKey] = useState(false)
  const [showNewKey, setShowNewKey] = useState(true)
  const [error, setError] = useState<string | null>(null)

  const text = {
    ro: {
      title: 'Chei API',
      description:
        'Gestionează cheile API pentru accesul programatic la MarketRisk. Disponibil pentru planul Business.',
      createButton: 'Creează Cheie API',
      nameLabel: 'Nume cheie',
      namePlaceholder: 'Cheie producție',
      cancel: 'Anulează',
      create: 'Creează',
      newKeyTitle: 'Cheie API Creată',
      newKeyWarning:
        'Salvează această cheie în siguranță. Nu o vei mai putea vedea din nou!',
      copyKey: 'Copiază cheie',
      keyCopied: 'Cheie copiată!',
      hideKey: 'Ascunde cheie',
      showKey: 'Arată cheie',
      noKeys: 'Nu există chei API',
      noKeysDescription: 'Creează o cheie API pentru a accesa MarketRisk programatic.',
      keyName: 'Nume',
      preview: 'Previzualizare',
      requests: 'Cereri',
      lastUsed: 'Ultima folosire',
      status: 'Status',
      actions: 'Acțiuni',
      active: 'Activ',
      inactive: 'Inactiv',
      never: 'Niciodată',
      delete: 'Șterge',
      confirmDelete: 'Sigur dorești să ștergi această cheie?',
      rateLimit: 'Limită',
      requestsPerHour: 'cereri/oră',
      created: 'Creat',
      scopes: 'Permisiuni',
      loading: 'Se încarcă...',
      error: 'Eroare',
    },
    en: {
      title: 'API Keys',
      description:
        'Manage API keys for programmatic access to MarketRisk. Available for Business plan.',
      createButton: 'Create API Key',
      nameLabel: 'Key name',
      namePlaceholder: 'Production key',
      cancel: 'Cancel',
      create: 'Create',
      newKeyTitle: 'API Key Created',
      newKeyWarning: 'Save this key securely. You won\'t be able to see it again!',
      copyKey: 'Copy key',
      keyCopied: 'Key copied!',
      hideKey: 'Hide key',
      showKey: 'Show key',
      noKeys: 'No API keys',
      noKeysDescription: 'Create an API key to access MarketRisk programmatically.',
      keyName: 'Name',
      preview: 'Preview',
      requests: 'Requests',
      lastUsed: 'Last used',
      status: 'Status',
      actions: 'Actions',
      active: 'Active',
      inactive: 'Inactive',
      never: 'Never',
      delete: 'Delete',
      confirmDelete: 'Are you sure you want to delete this key?',
      rateLimit: 'Limit',
      requestsPerHour: 'req/hour',
      created: 'Created',
      scopes: 'Scopes',
      loading: 'Loading...',
      error: 'Error',
    },
  }

  const t = text[locale]

  // Fetch API keys
  useEffect(() => {
    fetchKeys()
  }, [])

  async function fetchKeys() {
    try {
      setLoading(true)
      const response = await fetch('/api/api-keys')
      if (response.ok) {
        const data = await response.json()
        setKeys(data.keys || [])
      }
    } catch (err) {
      console.error('Error fetching API keys:', err)
      setError(t.error)
    } finally {
      setLoading(false)
    }
  }

  async function createKey() {
    if (!newKeyName.trim()) return

    try {
      setCreating(true)
      setError(null)

      const response = await fetch('/api/api-keys', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name: newKeyName }),
      })

      if (response.ok) {
        const data = await response.json()
        setNewKey(data.key)
        setNewKeyName('')
        await fetchKeys()
      } else {
        const data = await response.json()
        setError(data.error || t.error)
      }
    } catch (err) {
      console.error('Error creating API key:', err)
      setError(t.error)
    } finally {
      setCreating(false)
    }
  }

  async function deleteKey(keyId: string) {
    if (!confirm(t.confirmDelete)) return

    try {
      const response = await fetch(`/api/api-keys?id=${keyId}`, {
        method: 'DELETE',
      })

      if (response.ok) {
        await fetchKeys()
      }
    } catch (err) {
      console.error('Error deleting API key:', err)
    }
  }

  function copyKeyToClipboard() {
    if (newKey) {
      navigator.clipboard.writeText(newKey)
      setCopiedKey(true)
      setTimeout(() => setCopiedKey(false), 2000)
    }
  }

  function formatDate(dateString: string) {
    return new Date(dateString).toLocaleDateString(locale === 'ro' ? 'ro-RO' : 'en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
    })
  }

  if (loading) {
    return (
      <div className="bg-white border rounded-xl p-6">
        <div className="flex items-center gap-3 mb-2">
          <Key className="w-6 h-6 text-[#2F5232]" />
          <h2 className="text-xl font-bold text-gray-900">{t.title}</h2>
        </div>
        <p className="text-gray-600 text-sm">{t.loading}</p>
      </div>
    )
  }

  return (
    <div className="bg-white border rounded-xl p-6">
      <div className="flex items-center justify-between mb-6">
        <div>
          <div className="flex items-center gap-3 mb-2">
            <Key className="w-6 h-6 text-[#2F5232]" />
            <h2 className="text-xl font-bold text-gray-900">{t.title}</h2>
          </div>
          <p className="text-gray-600 text-sm">{t.description}</p>
        </div>
        <button
          onClick={() => setCreating(!creating)}
          className="flex items-center gap-2 bg-[#2F5232] text-white px-4 py-2 rounded-lg hover:bg-[#254428] transition-colors"
        >
          <Plus className="w-4 h-4" />
          {t.createButton}
        </button>
      </div>

      {/* New key creation form */}
      {creating && !newKey && (
        <div className="bg-gray-50 border rounded-lg p-4 mb-6">
          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-700 mb-2">
              {t.nameLabel}
            </label>
            <input
              type="text"
              value={newKeyName}
              onChange={(e) => setNewKeyName(e.target.value)}
              placeholder={t.namePlaceholder}
              className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-[#2F5232]"
              autoFocus
            />
          </div>
          <div className="flex gap-2">
            <button
              onClick={createKey}
              disabled={!newKeyName.trim()}
              className="bg-[#2F5232] text-white px-4 py-2 rounded-lg hover:bg-[#254428] disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {t.create}
            </button>
            <button
              onClick={() => {
                setCreating(false)
                setNewKeyName('')
              }}
              className="bg-gray-200 text-gray-700 px-4 py-2 rounded-lg hover:bg-gray-300"
            >
              {t.cancel}
            </button>
          </div>
        </div>
      )}

      {/* Display newly created key */}
      {newKey && (
        <div className="bg-yellow-50 border-2 border-yellow-400 rounded-lg p-4 mb-6">
          <div className="flex items-start gap-3 mb-3">
            <AlertCircle className="w-5 h-5 text-yellow-600 flex-shrink-0 mt-0.5" />
            <div>
              <h3 className="font-bold text-yellow-900">{t.newKeyTitle}</h3>
              <p className="text-sm text-yellow-800">{t.newKeyWarning}</p>
            </div>
          </div>
          <div className="bg-white border rounded-lg p-3 mb-3 font-mono text-sm break-all">
            {showNewKey ? newKey : '••••••••••••••••••••••••••••••••'}
          </div>
          <div className="flex gap-2">
            <button
              onClick={copyKeyToClipboard}
              className="flex items-center gap-2 bg-[#2F5232] text-white px-4 py-2 rounded-lg hover:bg-[#254428]"
            >
              {copiedKey ? (
                <>
                  <Check className="w-4 h-4" />
                  {t.keyCopied}
                </>
              ) : (
                <>
                  <Copy className="w-4 h-4" />
                  {t.copyKey}
                </>
              )}
            </button>
            <button
              onClick={() => setShowNewKey(!showNewKey)}
              className="flex items-center gap-2 bg-gray-200 text-gray-700 px-4 py-2 rounded-lg hover:bg-gray-300"
            >
              {showNewKey ? (
                <>
                  <EyeOff className="w-4 h-4" />
                  {t.hideKey}
                </>
              ) : (
                <>
                  <Eye className="w-4 h-4" />
                  {t.showKey}
                </>
              )}
            </button>
            <button
              onClick={() => setNewKey(null)}
              className="ml-auto bg-gray-200 text-gray-700 px-4 py-2 rounded-lg hover:bg-gray-300"
            >
              {t.cancel}
            </button>
          </div>
        </div>
      )}

      {error && (
        <div className="bg-red-50 border border-red-200 rounded-lg p-4 mb-6 text-red-800">
          {error}
        </div>
      )}

      {/* API keys list */}
      {keys.length === 0 ? (
        <div className="text-center py-12">
          <Key className="w-12 h-12 text-gray-400 mx-auto mb-3" />
          <h3 className="text-lg font-medium text-gray-900 mb-1">{t.noKeys}</h3>
          <p className="text-gray-600 text-sm">{t.noKeysDescription}</p>
        </div>
      ) : (
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b">
                <th className="text-left py-3 px-4 text-sm font-medium text-gray-700">
                  {t.keyName}
                </th>
                <th className="text-left py-3 px-4 text-sm font-medium text-gray-700">
                  {t.preview}
                </th>
                <th className="text-left py-3 px-4 text-sm font-medium text-gray-700">
                  {t.requests}
                </th>
                <th className="text-left py-3 px-4 text-sm font-medium text-gray-700">
                  {t.lastUsed}
                </th>
                <th className="text-left py-3 px-4 text-sm font-medium text-gray-700">
                  {t.status}
                </th>
                <th className="text-right py-3 px-4 text-sm font-medium text-gray-700">
                  {t.actions}
                </th>
              </tr>
            </thead>
            <tbody>
              {keys.map((key) => (
                <tr key={key.id} className="border-b last:border-b-0 hover:bg-gray-50">
                  <td className="py-3 px-4">
                    <div className="font-medium text-gray-900">{key.name}</div>
                    <div className="text-xs text-gray-500">
                      {formatDate(key.created_at)}
                    </div>
                  </td>
                  <td className="py-3 px-4">
                    <code className="text-sm text-gray-600 bg-gray-100 px-2 py-1 rounded">
                      {key.key_preview}
                    </code>
                  </td>
                  <td className="py-3 px-4">
                    <div className="text-sm text-gray-900">
                      {key.requests_count.toLocaleString()}
                    </div>
                    <div className="text-xs text-gray-500">
                      {key.rate_limit} {t.requestsPerHour}
                    </div>
                  </td>
                  <td className="py-3 px-4 text-sm text-gray-600">
                    {key.last_used_at ? formatDate(key.last_used_at) : t.never}
                  </td>
                  <td className="py-3 px-4">
                    <span
                      className={`inline-block px-2 py-1 text-xs font-medium rounded ${
                        key.is_active
                          ? 'bg-green-100 text-green-800'
                          : 'bg-gray-100 text-gray-800'
                      }`}
                    >
                      {key.is_active ? t.active : t.inactive}
                    </span>
                  </td>
                  <td className="py-3 px-4 text-right">
                    <button
                      onClick={() => deleteKey(key.id)}
                      className="text-red-600 hover:text-red-800"
                      title={t.delete}
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  )
}
