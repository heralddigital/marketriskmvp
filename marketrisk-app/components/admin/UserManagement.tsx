'use client'

// User management component for admins
// View, search, edit user subscriptions and roles

import { useState, useEffect } from 'react'
import { Search, Edit, Trash2, Shield, Mail, Calendar, Crown } from 'lucide-react'

interface User {
  id: string
  email: string
  name: string
  role: string
  subscription_plan: string
  subscription_status: string
  created_at: string
  last_sign_in_at: string | null
}

interface UserManagementProps {
  locale?: 'ro' | 'en'
}

export function UserManagement({ locale = 'ro' }: UserManagementProps) {
  const [users, setUsers] = useState<User[]>([])
  const [filteredUsers, setFilteredUsers] = useState<User[]>([])
  const [searchQuery, setSearchQuery] = useState('')
  const [loading, setLoading] = useState(true)
  const [selectedUser, setSelectedUser] = useState<User | null>(null)
  const [showEditModal, setShowEditModal] = useState(false)

  const text = {
    ro: {
      title: 'Gestionare Utilizatori',
      search: 'Caută utilizatori...',
      email: 'Email',
      name: 'Nume',
      plan: 'Plan',
      role: 'Rol',
      status: 'Status',
      created: 'Creat',
      lastSignIn: 'Ultima autentificare',
      actions: 'Acțiuni',
      edit: 'Editează',
      delete: 'Șterge',
      noUsers: 'Nu există utilizatori',
      loading: 'Se încarcă...',
      free: 'Gratuit',
      professional: 'Profesional',
      business: 'Business',
      enterprise: 'Enterprise',
      user: 'Utilizator',
      admin: 'Administrator',
      super_admin: 'Super Admin',
      active: 'Activ',
      canceled: 'Anulat',
      past_due: 'Întârziat',
      trialing: 'Trial',
      never: 'Niciodată',
      editUser: 'Editează Utilizator',
      updatePlan: 'Actualizează Plan',
      updateRole: 'Actualizează Rol',
      save: 'Salvează',
      cancel: 'Anulează',
      confirmDelete: 'Sigur dorești să ștergi acest utilizator?',
    },
    en: {
      title: 'User Management',
      search: 'Search users...',
      email: 'Email',
      name: 'Name',
      plan: 'Plan',
      role: 'Role',
      status: 'Status',
      created: 'Created',
      lastSignIn: 'Last sign in',
      actions: 'Actions',
      edit: 'Edit',
      delete: 'Delete',
      noUsers: 'No users found',
      loading: 'Loading...',
      free: 'Free',
      professional: 'Professional',
      business: 'Business',
      enterprise: 'Enterprise',
      user: 'User',
      admin: 'Admin',
      super_admin: 'Super Admin',
      active: 'Active',
      canceled: 'Canceled',
      past_due: 'Past Due',
      trialing: 'Trialing',
      never: 'Never',
      editUser: 'Edit User',
      updatePlan: 'Update Plan',
      updateRole: 'Update Role',
      save: 'Save',
      cancel: 'Cancel',
      confirmDelete: 'Are you sure you want to delete this user?',
    },
  }

  const t = text[locale]

  useEffect(() => {
    fetchUsers()
  }, [])

  useEffect(() => {
    if (searchQuery.trim() === '') {
      setFilteredUsers(users)
    } else {
      const query = searchQuery.toLowerCase()
      const filtered = users.filter(
        (user) =>
          user.email.toLowerCase().includes(query) ||
          user.name?.toLowerCase().includes(query)
      )
      setFilteredUsers(filtered)
    }
  }, [searchQuery, users])

  async function fetchUsers() {
    try {
      setLoading(true)
      const response = await fetch('/api/admin/users')
      if (response.ok) {
        const data = await response.json()
        setUsers(data.users || [])
      }
    } catch (err) {
      console.error('Error fetching users:', err)
    } finally {
      setLoading(false)
    }
  }

  async function handleUpdateUser(userId: string, updates: any) {
    try {
      const response = await fetch(`/api/admin/users/${userId}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(updates),
      })

      if (response.ok) {
        await fetchUsers()
        setShowEditModal(false)
        setSelectedUser(null)
      }
    } catch (err) {
      console.error('Error updating user:', err)
    }
  }

  async function handleDeleteUser(userId: string) {
    if (!confirm(t.confirmDelete)) return

    try {
      const response = await fetch(`/api/admin/users/${userId}`, {
        method: 'DELETE',
      })

      if (response.ok) {
        await fetchUsers()
      }
    } catch (err) {
      console.error('Error deleting user:', err)
    }
  }

  function formatDate(dateString: string | null) {
    if (!dateString) return t.never
    return new Date(dateString).toLocaleDateString(locale === 'ro' ? 'ro-RO' : 'en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
    })
  }

  const planNames: Record<string, string> = {
    free: t.free,
    professional: t.professional,
    business: t.business,
    enterprise: t.enterprise,
  }

  const roleNames: Record<string, string> = {
    user: t.user,
    admin: t.admin,
    super_admin: t.super_admin,
  }

  const statusColors: Record<string, string> = {
    active: 'bg-green-100 text-green-800',
    canceled: 'bg-gray-100 text-gray-800',
    past_due: 'bg-red-100 text-red-800',
    trialing: 'bg-blue-100 text-blue-800',
  }

  if (loading) {
    return (
      <div className="p-6">
        <h1 className="text-2xl font-bold text-gray-900 mb-6">{t.title}</h1>
        <p className="text-gray-600">{t.loading}</p>
      </div>
    )
  }

  return (
    <div className="p-6">
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-bold text-gray-900">{t.title}</h1>
        <div className="relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
          <input
            type="text"
            placeholder={t.search}
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-10 pr-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-[#2F5232] w-64"
          />
        </div>
      </div>

      {filteredUsers.length === 0 ? (
        <div className="bg-white border rounded-xl p-12 text-center">
          <p className="text-gray-600">{t.noUsers}</p>
        </div>
      ) : (
        <div className="bg-white border rounded-xl overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-50 border-b">
                <tr>
                  <th className="text-left py-3 px-4 text-sm font-medium text-gray-700">
                    {t.email}
                  </th>
                  <th className="text-left py-3 px-4 text-sm font-medium text-gray-700">
                    {t.name}
                  </th>
                  <th className="text-left py-3 px-4 text-sm font-medium text-gray-700">
                    {t.plan}
                  </th>
                  <th className="text-left py-3 px-4 text-sm font-medium text-gray-700">
                    {t.role}
                  </th>
                  <th className="text-left py-3 px-4 text-sm font-medium text-gray-700">
                    {t.status}
                  </th>
                  <th className="text-left py-3 px-4 text-sm font-medium text-gray-700">
                    {t.created}
                  </th>
                  <th className="text-right py-3 px-4 text-sm font-medium text-gray-700">
                    {t.actions}
                  </th>
                </tr>
              </thead>
              <tbody>
                {filteredUsers.map((user) => (
                  <tr key={user.id} className="border-b last:border-b-0 hover:bg-gray-50">
                    <td className="py-3 px-4">
                      <div className="flex items-center gap-2">
                        <Mail className="w-4 h-4 text-gray-400" />
                        <span className="text-sm text-gray-900">{user.email}</span>
                      </div>
                    </td>
                    <td className="py-3 px-4 text-sm text-gray-900">{user.name}</td>
                    <td className="py-3 px-4">
                      <span className="text-sm font-medium text-gray-900">
                        {planNames[user.subscription_plan] || user.subscription_plan}
                      </span>
                    </td>
                    <td className="py-3 px-4">
                      <div className="flex items-center gap-1">
                        {user.role !== 'user' && (
                          <Shield className="w-4 h-4 text-purple-600" />
                        )}
                        <span className="text-sm text-gray-900">
                          {roleNames[user.role] || user.role}
                        </span>
                      </div>
                    </td>
                    <td className="py-3 px-4">
                      <span
                        className={`inline-block px-2 py-1 text-xs font-medium rounded ${
                          statusColors[user.subscription_status] ||
                          'bg-gray-100 text-gray-800'
                        }`}
                      >
                        {user.subscription_status}
                      </span>
                    </td>
                    <td className="py-3 px-4 text-sm text-gray-600">
                      {formatDate(user.created_at)}
                    </td>
                    <td className="py-3 px-4 text-right">
                      <div className="flex items-center justify-end gap-2">
                        <button
                          onClick={() => {
                            setSelectedUser(user)
                            setShowEditModal(true)
                          }}
                          className="text-blue-600 hover:text-blue-800"
                          title={t.edit}
                        >
                          <Edit className="w-4 h-4" />
                        </button>
                        <button
                          onClick={() => handleDeleteUser(user.id)}
                          className="text-red-600 hover:text-red-800"
                          title={t.delete}
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Edit Modal */}
      {showEditModal && selectedUser && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-xl p-6 max-w-md w-full mx-4">
            <h2 className="text-xl font-bold text-gray-900 mb-4">{t.editUser}</h2>

            <div className="mb-4">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                {t.email}
              </label>
              <input
                type="text"
                value={selectedUser.email}
                disabled
                className="w-full px-3 py-2 border rounded-lg bg-gray-50 text-gray-600"
              />
            </div>

            <div className="mb-4">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                {t.updatePlan}
              </label>
              <select
                defaultValue={selectedUser.subscription_plan}
                onChange={(e) =>
                  handleUpdateUser(selectedUser.id, { plan: e.target.value })
                }
                className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-[#2F5232]"
              >
                <option value="free">{t.free}</option>
                <option value="professional">{t.professional}</option>
                <option value="business">{t.business}</option>
                <option value="enterprise">{t.enterprise}</option>
              </select>
            </div>

            <div className="mb-6">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                {t.updateRole}
              </label>
              <select
                defaultValue={selectedUser.role}
                onChange={(e) =>
                  handleUpdateUser(selectedUser.id, { role: e.target.value })
                }
                className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-[#2F5232]"
              >
                <option value="user">{t.user}</option>
                <option value="admin">{t.admin}</option>
                <option value="super_admin">{t.super_admin}</option>
              </select>
            </div>

            <div className="flex gap-2">
              <button
                onClick={() => {
                  setShowEditModal(false)
                  setSelectedUser(null)
                }}
                className="flex-1 bg-gray-200 text-gray-700 px-4 py-2 rounded-lg hover:bg-gray-300"
              >
                {t.cancel}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
