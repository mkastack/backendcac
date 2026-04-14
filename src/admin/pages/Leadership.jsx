import { useState, useEffect } from 'react';
import { supabase } from '../../lib/supabase';
import { uploadChurchAsset } from '../../lib/storage';

const ROLES = [
  'General Overseer',
  'Head Pastor',
  'Associate Pastor',
  'Presiding Elder',
  'Church Administrator',
  'Youth Pastor',
  "Children's Ministry",
  'Music Director',
  'Deacon',
  'Deaconess',
  'Elder',
  'Other',
];

export default function Leadership() {
  const [leaders, setLeaders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [uploading, setUploading] = useState(false);
  const [notice, setNotice] = useState({ msg: '', type: 'info' });
  const [showModal, setShowModal] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [confirmDeleteId, setConfirmDeleteId] = useState(null);
  const [form, setForm] = useState({
    name: '',
    role: '',
    bio: '',
    image_url: '',
    display_order: 0,
  });

  useEffect(() => {
    fetchLeaders();

    const channel = supabase
      .channel('admin_leadership_sync')
      .on('postgres_changes', { event: '*', schema: 'public', table: 'leaders' }, () => {
        fetchLeaders();
      })
      .subscribe();

    return () => supabase.removeChannel(channel);
  }, []);

  const fetchLeaders = async () => {
    setLoading(true);
    const { data, error } = await supabase
      .from('leaders')
      .select('*')
      .order('display_order', { ascending: true });

    if (error) {
      showNotice('Failed to load leaders: ' + error.message, 'error');
    } else {
      setLeaders(data || []);
    }
    setLoading(false);
  };

  const showNotice = (msg, type = 'info') => {
    setNotice({ msg, type });
    setTimeout(() => setNotice({ msg: '', type: 'info' }), 4000);
  };

  const openAdd = () => {
    setEditingId(null);
    setForm({ name: '', role: '', bio: '', image_url: '', display_order: leaders.length });
    setShowModal(true);
  };

  const openEdit = (leader) => {
    setEditingId(leader.id);
    setForm({
      name: leader.name || '',
      role: leader.role || '',
      bio: leader.bio || '',
      image_url: leader.image_url || '',
      display_order: leader.display_order ?? 0,
    });
    setShowModal(true);
  };

  const closeModal = () => {
    setShowModal(false);
    setEditingId(null);
    setForm({ name: '', role: '', bio: '', image_url: '', display_order: 0 });
  };

  const handleImageUpload = async (e) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setUploading(true);
    const url = await uploadChurchAsset(file);
    if (url) {
      setForm((f) => ({ ...f, image_url: url }));
      showNotice('Image uploaded successfully.', 'success');
    } else {
      showNotice('Image upload failed. Check storage bucket permissions.', 'error');
    }
    setUploading(false);
  };

  const handleSave = async (e) => {
    e.preventDefault();
    if (!form.name || !form.role) {
      showNotice('Name and Role are required.', 'error');
      return;
    }

    const payload = {
      name: form.name.trim(),
      role: form.role.trim(),
      bio: form.bio.trim(),
      image_url: form.image_url.trim(),
      display_order: Number(form.display_order) || 0,
    };

    let error;
    if (editingId) {
      ({ error } = await supabase.from('leaders').update(payload).eq('id', editingId));
    } else {
      ({ error } = await supabase.from('leaders').insert([payload]));
    }

    if (error) {
      showNotice('Save failed: ' + error.message, 'error');
    } else {
      showNotice(editingId ? 'Leader updated successfully.' : 'Leader added successfully.', 'success');
      fetchLeaders();
      closeModal();
    }
  };

  const handleDelete = async (id) => {
    const { error } = await supabase.from('leaders').delete().eq('id', id);
    if (error) {
      showNotice('Delete failed: ' + error.message, 'error');
    } else {
      showNotice('Leader removed.', 'success');
      fetchLeaders();
    }
    setConfirmDeleteId(null);
  };

  const filteredLeaders = leaders.filter(
    (l) =>
      l.name?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      l.role?.toLowerCase().includes(searchQuery.toLowerCase()),
  );

  const initials = (name = '') =>
    name
      .split(' ')
      .slice(0, 2)
      .map((p) => p[0]?.toUpperCase() || '')
      .join('');

  return (
    <main className="mx-auto max-w-screen-2xl px-4 pb-20 pt-8 sm:px-6 lg:px-8">
      {/* Toast notice */}
      {notice.msg && (
        <div
          className={`mb-6 flex items-center gap-3 rounded-2xl px-5 py-4 text-sm font-semibold shadow-sm ${
            notice.type === 'error'
              ? 'bg-red-50 text-red-700 border border-red-100'
              : notice.type === 'success'
              ? 'bg-green-50 text-green-700 border border-green-100'
              : 'bg-blue-50 text-blue-700 border border-blue-100'
          }`}
        >
          <span className="material-symbols-outlined text-[20px]">
            {notice.type === 'error' ? 'error' : notice.type === 'success' ? 'check_circle' : 'info'}
          </span>
          {notice.msg}
        </div>
      )}

      {/* Page Header */}
      <header className="mb-10 flex flex-col gap-6 lg:flex-row lg:items-end lg:justify-between">
        <div>
          <div className="mb-3 flex items-center gap-2">
            <span className="text-xs font-bold uppercase tracking-[0.2em] text-[#9e2016] bg-[#9e2016]/5 px-3 py-1 rounded-full">
              Administration
            </span>
            <span className="material-symbols-outlined text-sm text-[#5e5e5e]">chevron_right</span>
            <span className="text-xs font-bold uppercase tracking-[0.2em] text-[#5e5e5e]">Leadership</span>
          </div>
          <h1 className="text-4xl font-extrabold tracking-tight text-[#1c1b1b] md:text-5xl">
            Church Leadership
          </h1>
          <p className="mt-2 max-w-xl text-[#59413d]">
            Manage the leadership profiles displayed on the public "About" page. Add, edit, reorder, or remove leaders.
          </p>
        </div>

        <div className="flex w-full flex-col gap-3 sm:flex-row sm:items-center lg:w-auto">
          <div className="relative sm:min-w-[16rem]">
            <span className="material-symbols-outlined pointer-events-none absolute left-4 top-1/2 -translate-y-1/2 text-[20px] text-[#8d706c]">
              search
            </span>
            <input
              className="w-full rounded-xl bg-[#f6f3f2] py-3 pl-12 pr-4 text-sm outline-none placeholder:text-[#8d706c] focus:bg-white transition-all"
              style={{ boxShadow: 'none' }}
              placeholder="Search leaders..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>
          <button
            onClick={openAdd}
            className="inline-flex items-center justify-center gap-2 rounded-full bg-gradient-to-r from-[#9e2016] to-[#c0392b] px-6 py-3 text-sm font-bold text-white shadow-lg transition-all hover:opacity-95 active:scale-95"
          >
            <span className="material-symbols-outlined text-[20px]">person_add</span>
            Add Leader
          </button>
        </div>
      </header>

      {/* Stats Row */}
      <section className="mb-10 grid grid-cols-1 gap-4 sm:grid-cols-3">
        <div className="flex h-36 flex-col justify-between rounded-2xl bg-white p-6 shadow-sm border border-neutral-100">
          <span className="text-sm font-semibold text-[#59413d]">Total Leaders</span>
          <div className="flex items-baseline gap-2">
            <span className="text-5xl font-extrabold text-[#9e2016]">{leaders.length}</span>
          </div>
          <div className="h-1 w-full overflow-hidden rounded-full bg-[#f6f3f2]">
            <div className="h-full bg-[#9e2016]" style={{ width: `${Math.min((leaders.length / 20) * 100, 100)}%` }} />
          </div>
        </div>

        <div className="flex h-36 flex-col justify-between rounded-2xl bg-white p-6 shadow-sm border border-neutral-100">
          <span className="text-sm font-semibold text-[#59413d]">With Photos</span>
          <span className="text-5xl font-extrabold text-blue-600">
            {leaders.filter((l) => l.image_url).length}
          </span>
          <div className="h-1 w-full overflow-hidden rounded-full bg-[#f6f3f2]">
            <div
              className="h-full bg-blue-500 transition-all duration-500"
              style={{
                width: `${leaders.length > 0 ? (leaders.filter((l) => l.image_url).length / leaders.length) * 100 : 0}%`,
              }}
            />
          </div>
        </div>

        <div className="relative flex h-36 flex-col justify-between overflow-hidden rounded-2xl bg-[#9e2016] p-6 text-white">
          <span className="text-sm font-semibold text-[#ffe5e1]">Live on Website</span>
          <h2 className="text-5xl font-extrabold">{leaders.length} Active</h2>
          <p className="text-xs text-[#ffe5e1]">Displayed on the public About page in real-time.</p>
          <span className="absolute -bottom-4 -right-4 text-8xl opacity-10">✝</span>
        </div>
      </section>

      {/* Leaders Grid */}
      <section className="rounded-3xl bg-white shadow-sm border border-neutral-100 overflow-hidden">
        <div className="flex items-center justify-between bg-[#fcf9f8] p-6 border-b border-neutral-100">
          <h3 className="text-2xl font-bold text-[#1c1b1b]">Leadership Directory</h3>
          <span className="text-sm text-[#5e5e5e]">{filteredLeaders.length} leader{filteredLeaders.length !== 1 ? 's' : ''}</span>
        </div>

        {loading ? (
          <div className="flex items-center justify-center py-20">
            <div className="flex flex-col items-center gap-4 text-[#8d706c]">
              <span className="material-symbols-outlined animate-spin text-4xl">sync</span>
              <p className="text-sm font-semibold">Loading leaders...</p>
            </div>
          </div>
        ) : filteredLeaders.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-20 text-center">
            <span className="material-symbols-outlined text-5xl text-[#d4cbc9] mb-4">manage_accounts</span>
            <p className="text-lg font-bold text-[#1c1b1b]">No leaders found</p>
            <p className="mt-1 text-sm text-[#8d706c]">
              {searchQuery ? 'Try a different search term.' : 'Click "Add Leader" to get started.'}
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-px bg-neutral-100">
            {filteredLeaders.map((leader) => (
              <div key={leader.id} className="group relative bg-white p-6 hover:bg-neutral-50 transition-colors">
                {/* Action Buttons */}
                <div className="absolute right-4 top-4 flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                  <button
                    onClick={() => openEdit(leader)}
                    className="rounded-lg p-2 text-[#59413d] hover:bg-[#f6f3f2] transition-colors"
                    title="Edit Leader"
                  >
                    <span className="material-symbols-outlined text-[18px]">edit</span>
                  </button>
                  <button
                    onClick={() => setConfirmDeleteId(leader.id)}
                    className="rounded-lg p-2 text-red-500 hover:bg-red-50 transition-colors"
                    title="Delete Leader"
                  >
                    <span className="material-symbols-outlined text-[18px]">delete</span>
                  </button>
                </div>

                {/* Photo / Avatar */}
                <div className="mb-4 mx-auto h-28 w-28 overflow-hidden rounded-2xl border-2 border-neutral-100">
                  {leader.image_url ? (
                    <img
                      src={leader.image_url}
                      alt={leader.name}
                      className="h-full w-full object-cover object-top group-hover:scale-105 transition-transform duration-500"
                    />
                  ) : (
                    <div className="flex h-full w-full items-center justify-center bg-[#ffdad5] text-2xl font-extrabold text-[#9e2016]">
                      {initials(leader.name)}
                    </div>
                  )}
                </div>

                {/* Info */}
                <div className="text-center">
                  <h4 className="font-bold text-[#1c1b1b] text-base leading-tight">{leader.name}</h4>
                  <p className="mt-1 text-xs font-semibold uppercase tracking-wide text-[#9e2016]">{leader.role}</p>
                  {leader.bio && (
                    <p className="mt-2 text-xs text-[#8d706c] line-clamp-2 leading-relaxed">{leader.bio}</p>
                  )}
                  <div className="mt-3 flex items-center justify-center gap-1 text-[10px] text-[#b0a09e]">
                    <span className="material-symbols-outlined text-[14px]">drag_indicator</span>
                    Order: {leader.display_order ?? '—'}
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </section>

      {/* Add / Edit Modal */}
      {showModal && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center overflow-y-auto bg-black/50 p-4 backdrop-blur-sm">
          <div className="my-4 flex max-h-[85vh] w-full max-w-2xl flex-col rounded-3xl bg-white shadow-2xl">
            {/* Modal Header */}
            <div className="flex items-center justify-between border-b border-neutral-100 px-6 py-5">
              <h3 className="text-xl font-extrabold tracking-tight text-[#1c1b1b]">
                {editingId ? 'Edit Leader Profile' : 'Add New Leader'}
              </h3>
              <button
                onClick={closeModal}
                className="rounded-full p-2 transition-colors hover:bg-[#f6f3f2]"
                type="button"
              >
                <span className="material-symbols-outlined text-[#8d706c]">close</span>
              </button>
            </div>

            {/* Modal Body */}
            <form className="overflow-y-auto p-6 space-y-5" onSubmit={handleSave} id="leader-form">
              {/* Image Upload */}
              <div className="flex flex-col items-center gap-4 sm:flex-row">
                <div className="h-24 w-24 flex-shrink-0 overflow-hidden rounded-2xl border-2 border-neutral-100">
                  {form.image_url ? (
                    <img src={form.image_url} alt="Preview" className="h-full w-full object-cover object-top" />
                  ) : (
                    <div className="flex h-full w-full items-center justify-center bg-[#f6f3f2] text-2xl font-extrabold text-[#9e2016]">
                      {initials(form.name) || '?'}
                    </div>
                  )}
                </div>
                <div className="flex-1 w-full">
                  <label className="mb-2 block text-xs font-bold uppercase tracking-widest text-[#59413d]">
                    Profile Photo
                  </label>
                  <input
                    type="file"
                    accept="image/*"
                    id="leader-img-upload"
                    className="hidden"
                    onChange={handleImageUpload}
                  />
                  <label
                    htmlFor="leader-img-upload"
                    className="flex w-full cursor-pointer items-center justify-center gap-2 rounded-xl border-2 border-dashed border-[#8d706c]/30 py-3 px-4 text-sm font-bold text-[#5e5e5e] hover:bg-neutral-50 transition-all"
                  >
                    <span className="material-symbols-outlined text-[20px]">
                      {uploading ? 'sync' : 'add_photo_alternate'}
                    </span>
                    {uploading ? 'Uploading...' : form.image_url ? 'Change Photo' : 'Upload Photo'}
                  </label>
                  {form.image_url && (
                    <button
                      type="button"
                      onClick={() => setForm((f) => ({ ...f, image_url: '' }))}
                      className="mt-1 text-[11px] font-bold text-red-500 hover:underline"
                    >
                      Remove photo
                    </button>
                  )}
                </div>
              </div>

              {/* Name */}
              <div>
                <label className="mb-2 block text-xs font-bold uppercase tracking-widest text-[#59413d]">
                  Full Name *
                </label>
                <input
                  required
                  className="w-full rounded-xl bg-[#f6f3f2] px-4 py-3 text-sm transition-all placeholder:text-[#8d706c]/60 focus:bg-white focus:ring-2 focus:ring-[#9e2016]/30 outline-none"
                  placeholder="e.g. Rev. Seth Frimpong"
                  value={form.name}
                  onChange={(e) => setForm((f) => ({ ...f, name: e.target.value }))}
                />
              </div>

              {/* Role */}
              <div>
                <label className="mb-2 block text-xs font-bold uppercase tracking-widest text-[#59413d]">
                  Role / Title *
                </label>
                <div className="flex gap-2">
                  <select
                    className="flex-1 rounded-xl bg-[#f6f3f2] px-4 py-3 text-sm transition-all focus:bg-white focus:ring-2 focus:ring-[#9e2016]/30 outline-none"
                    value={ROLES.includes(form.role) ? form.role : 'Other'}
                    onChange={(e) => {
                      if (e.target.value !== 'Other') setForm((f) => ({ ...f, role: e.target.value }));
                    }}
                  >
                    {ROLES.map((r) => (
                      <option key={r}>{r}</option>
                    ))}
                  </select>
                </div>
                <input
                  className="mt-2 w-full rounded-xl bg-[#f6f3f2] px-4 py-3 text-sm transition-all placeholder:text-[#8d706c]/60 focus:bg-white focus:ring-2 focus:ring-[#9e2016]/30 outline-none"
                  placeholder="Or type a custom role..."
                  value={form.role}
                  onChange={(e) => setForm((f) => ({ ...f, role: e.target.value }))}
                />
              </div>

              {/* Bio */}
              <div>
                <label className="mb-2 block text-xs font-bold uppercase tracking-widest text-[#59413d]">
                  Short Bio (optional)
                </label>
                <textarea
                  rows={3}
                  className="w-full resize-none rounded-xl bg-[#f6f3f2] px-4 py-3 text-sm transition-all placeholder:text-[#8d706c]/60 focus:bg-white focus:ring-2 focus:ring-[#9e2016]/30 outline-none"
                  placeholder="Brief description about this leader..."
                  value={form.bio}
                  onChange={(e) => setForm((f) => ({ ...f, bio: e.target.value }))}
                />
              </div>

              {/* Display Order */}
              <div>
                <label className="mb-2 block text-xs font-bold uppercase tracking-widest text-[#59413d]">
                  Display Order (lower = appears first)
                </label>
                <input
                  type="number"
                  min={0}
                  className="w-full rounded-xl bg-[#f6f3f2] px-4 py-3 text-sm transition-all focus:bg-white focus:ring-2 focus:ring-[#9e2016]/30 outline-none"
                  value={form.display_order}
                  onChange={(e) => setForm((f) => ({ ...f, display_order: e.target.value }))}
                />
              </div>
            </form>

            {/* Modal Footer */}
            <div className="flex gap-3 border-t border-neutral-100 bg-neutral-50 px-6 py-5">
              <button
                form="leader-form"
                type="submit"
                className="flex-1 rounded-2xl bg-gradient-to-r from-[#9e2016] to-[#c0392b] py-3 text-sm font-extrabold uppercase tracking-widest text-white shadow-lg transition-all hover:brightness-95 active:scale-95"
              >
                {editingId ? 'Update Leader' : 'Save Leader'}
              </button>
              <button
                type="button"
                onClick={closeModal}
                className="px-6 py-3 text-sm font-bold text-[#5e5e5e] hover:text-[#1c1b1b] transition-colors"
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Delete Confirmation Modal */}
      {confirmDeleteId && (
        <div className="fixed inset-0 z-[110] flex items-center justify-center bg-black/60 p-4 backdrop-blur-sm">
          <div className="w-full max-w-sm rounded-3xl bg-white p-8 shadow-2xl text-center">
            <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-red-100">
              <span className="material-symbols-outlined text-3xl text-red-600">delete_forever</span>
            </div>
            <h3 className="text-xl font-extrabold text-[#1c1b1b] mb-2">Delete Leader?</h3>
            <p className="text-sm text-[#8d706c] mb-6">
              This will permanently remove this leader from the website. This action cannot be undone.
            </p>
            <div className="flex gap-3">
              <button
                onClick={() => handleDelete(confirmDeleteId)}
                className="flex-1 rounded-xl bg-red-600 py-3 text-sm font-extrabold text-white hover:bg-red-700 transition-colors"
              >
                Yes, Delete
              </button>
              <button
                onClick={() => setConfirmDeleteId(null)}
                className="flex-1 rounded-xl bg-neutral-100 py-3 text-sm font-bold text-[#5e5e5e] hover:bg-neutral-200 transition-colors"
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}
    </main>
  );
}
