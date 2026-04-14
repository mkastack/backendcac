import { useState, useEffect } from 'react';
import { supabase } from '../../lib/supabase';

export default function Prayer() {
  const [requestOpen, setRequestOpen] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [loading, setLoading] = useState(true);
  const [notice, setNotice] = useState('');
  const [form, setForm] = useState({
    title: '',
    submitter: '',
    content: '',
  });

  const [rows, setRows] = useState([]);
  const [searchQuery, setSearchQuery] = useState('');

  useEffect(() => {
    fetchRequests();
    
    // Subscribe to real-time changes
    const channel = supabase
      .channel('prayer_requests_changes')
      .on('postgres_changes', { event: '*', schema: 'public', table: 'prayer_requests' }, () => {
        fetchRequests();
      })
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, []);

  const fetchRequests = async () => {
    setLoading(true);
    const { data, error } = await supabase
      .from('prayer_requests')
      .select('*')
      .order('date', { ascending: false });
    
    if (error) {
      setNotice('Error fetching requests: ' + error.message);
    } else {
      setRows(data.map(r => ({
        ...r,
        title: r.name + "'s Request", // Map database fields to component
        submitter: r.name,
        content: r.request,
        avatar: r.name.split(' ').slice(0, 2).map((n) => n[0]?.toUpperCase() || '').join(''),
        date: new Date(r.date).toLocaleDateString('en-US', { month: 'short', day: '2-digit', year: 'numeric' })
      })));
    }
    setLoading(false);
  };

  const handleSave = async (e) => {
    e.preventDefault();
    if (!form.submitter || !form.content) return;

    const requestData = {
      name: form.submitter,
      request: form.content,
      status: 'Pending',
      date: new Date().toISOString().split('T')[0]
    };

    let error;
    if (editingId) {
      const { error: updateError } = await supabase
        .from('prayer_requests')
        .update(requestData)
        .eq('id', editingId);
      error = updateError;
    } else {
      const { error: insertError } = await supabase
        .from('prayer_requests')
        .insert([requestData]);
      error = insertError;
    }

    if (error) {
      setNotice('Error saving request: ' + error.message);
    } else {
      setNotice(editingId ? 'Request updated successfully.' : 'New request submitted.');
      fetchRequests();
      closeModal();
    }
  };

  const closeModal = () => {
    setForm({ title: '', submitter: '', content: '' });
    setEditingId(null);
    setRequestOpen(false);
  };

  const openEdit = (r) => {
    setEditingId(r.id);
    setForm({ title: r.title, submitter: r.submitter, content: r.content });
    setRequestOpen(true);
  };

  const toggleStatus = async (id, currentStatus) => {
    const newStatus = currentStatus === 'Pending' ? 'Prayed For' : 'Pending';
    const { error } = await supabase
      .from('prayer_requests')
      .update({ status: newStatus })
      .eq('id', id);
    
    if (error) {
      setNotice('Error updating status: ' + error.message);
    } else {
      fetchRequests();
    }
  };

  const stats = {
    total: rows.filter((r) => r.status !== 'Testimony').length,
    pending: rows.filter((r) => r.status === 'Pending').length,
    prayed: rows.filter((r) => r.status === 'Prayed For').length,
    testimonies: rows.filter((r) => r.status === 'Testimony').length,
  };

  const filteredRows = rows.filter(r => 
    r.submitter.toLowerCase().includes(searchQuery.toLowerCase()) || 
    r.title.toLowerCase().includes(searchQuery.toLowerCase()) || 
    r.content.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <>
      <main className="mx-auto max-w-7xl px-4 pb-20 pt-8 md:px-12">
        <header className="mb-12 flex flex-col justify-between gap-6 md:flex-row md:items-end">
          <div className="space-y-2">
            <nav className="mb-4 flex items-center text-sm font-medium text-[#59413d]">
              <span>Admin Console</span>
              <span className="material-symbols-outlined mx-2 text-sm">chevron_right</span>
              <span className="text-[#9e2016]">Prayer Ministry</span>
            </nav>
            <h1 className="text-5xl font-extrabold tracking-tight text-[#1c1b1b]">Prayer Requests</h1>
            <p className="max-w-xl text-lg text-[#59413d]">Managing the digital prayer wall. Interceding for our community with reverence and care.</p>
          </div>
          <button 
            onClick={() => setRequestOpen(true)}
            className="group flex items-center gap-3 rounded-full bg-gradient-to-r from-[#9e2016] to-[#c0392b] px-8 py-4 font-bold text-white shadow-[0_12px_40px_rgba(28,27,27,0.06)] transition-all duration-300 hover:opacity-95"
          >
            <span className="material-symbols-outlined transition-transform group-hover:rotate-90">add</span>
            New Request
          </button>
        </header>

        <div className="mb-12 grid grid-cols-1 gap-4 md:grid-cols-4">
          <div className="rounded-xl bg-white p-6 shadow-[0_12px_40px_rgba(28,27,27,0.06)]">
            <p className="mb-1 text-sm font-medium text-[#59413d]">Total Requests</p>
            <p className="text-3xl font-bold text-[#1c1b1b]">{stats.total}</p>
            <div className="mt-4 h-1.5 w-full overflow-hidden rounded-full bg-neutral-100">
              <div className="h-full bg-blue-500" style={{ width: `${(stats.total / 200) * 100}%` }} />
            </div>
          </div>
          <div className="rounded-xl bg-white p-6 shadow-[0_12px_40px_rgba(28,27,27,0.06)]">
            <p className="mb-1 text-sm font-medium text-[#59413d]">Pending</p>
            <p className="text-3xl font-bold text-[#9e2016]">{stats.pending}</p>
            <div className="mt-4 h-1.5 w-full overflow-hidden rounded-full bg-neutral-100">
              <div className="h-full bg-rose-500" style={{ width: `${(stats.pending / stats.total) * 100}%` }} />
            </div>
          </div>
          <div className="rounded-xl bg-white p-6 shadow-[0_12px_40px_rgba(28,27,27,0.06)]">
            <p className="mb-1 text-sm font-medium text-[#59413d]">Prayed For</p>
            <p className="text-3xl font-bold text-[#5e5e5e]">{stats.prayed}</p>
            <div className="mt-4 h-1.5 w-full overflow-hidden rounded-full bg-neutral-100">
              <div className="h-full bg-emerald-500" style={{ width: `${(stats.prayed / stats.total) * 100}%` }} />
            </div>
          </div>
          <div className="rounded-xl bg-[#fff8db] p-6 shadow-[0_12px_40px_rgba(28,27,27,0.06)]">
            <div className="flex items-center justify-between mb-1">
              <p className="text-sm font-medium text-[#7a6503]">Testimonies</p>
              <span className="material-symbols-outlined text-2xl text-[#d4af37]/60">campaign</span>
            </div>
            <p className="text-3xl font-bold text-[#b8860b]">{stats.testimonies}</p>
            <div className="mt-4 h-1.5 w-full overflow-hidden rounded-full bg-black/5">
              <div className="h-full bg-[#d4af37]" style={{ width: '100%' }} />
            </div>
          </div>
        </div>

        <div className="overflow-hidden rounded-3xl bg-[#f6f3f2] shadow-[0_12px_40px_rgba(28,27,27,0.06)]">
          <div className="flex flex-col justify-between gap-4 bg-[#f6f3f2] p-6 md:flex-row md:items-center">
            <div className="relative max-w-md flex-1">
              <span className="material-symbols-outlined absolute left-4 top-1/2 -translate-y-1/2 text-[#59413d]">search</span>
              <input
                className="w-full rounded-2xl bg-white py-3 pl-12 pr-4 text-sm transition-all outline-none focus:outline-none focus:ring-0 shadow-none focus:shadow-none"
                style={{boxShadow: 'none'}}
                placeholder="Search by name or keyword..."
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>
            <div className="flex items-center gap-2">
              <button className="flex items-center gap-2 rounded-full px-4 py-2 text-sm font-medium text-[#59413d] transition-colors hover:bg-[#eae7e7]">
                <span className="material-symbols-outlined text-lg">filter_list</span>
                Filter
              </button>
              <button className="flex items-center gap-2 rounded-full px-4 py-2 text-sm font-medium text-[#59413d] transition-colors hover:bg-[#eae7e7]">
                <span className="material-symbols-outlined text-lg">sort</span>
                Latest
              </button>
            </div>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full border-collapse text-left">
              <thead>
                <tr className="text-xs font-bold uppercase tracking-widest text-[#59413d]">
                  <th className="px-8 py-5">Request Details</th>
                  <th className="px-8 py-5">Submitter</th>
                  <th className="px-8 py-5">Date</th>
                  <th className="px-8 py-5">Status</th>
                  <th className="px-8 py-5 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#e1bfb9]/10">
                {filteredRows.map((row) => (
                  <tr key={row.id} className="group transition-all hover:bg-white">
                    <td className="px-8 py-6">
                      <div className="max-w-md">
                        <h3 className="text-lg font-bold leading-snug text-[#1c1b1b] transition-colors group-hover:text-[#9e2016]">{row.title}</h3>
                        <p className="line-clamp-2 text-sm text-[#59413d]">"{row.content}"</p>
                      </div>
                    </td>
                    <td className="px-8 py-6">
                      <div className="flex items-center gap-3">
                        <div className="flex h-8 w-8 items-center justify-center rounded-full bg-[#e1dfdf] text-xs font-bold text-[#9e2016]">
                          {row.avatar}
                        </div>
                        <span className="text-sm font-medium text-[#1c1b1b]">{row.submitter}</span>
                      </div>
                    </td>
                    <td className="px-8 py-6 text-sm font-medium text-[#59413d]">{row.date}</td>
                    <td className="px-8 py-6">
                      <span
                        className={`inline-flex items-center gap-1.5 rounded-full px-3 py-1 text-xs font-bold ${
                          row.status === 'Pending' ? 'bg-[#ffdad6] text-[#93000a]' : row.status === 'Testimony' ? 'bg-yellow-100 text-yellow-700' : 'bg-[#e1dfdf] text-[#636262]'
                        }`}
                      >
                        {row.status === 'Pending' && <span className="h-1.5 w-1.5 animate-pulse rounded-full bg-[#ba1a1a]" />}
                        {row.status === 'Prayed For' && <span className="material-symbols-outlined text-[14px]">check_circle</span>}
                        {row.status === 'Testimony' && <span className="material-symbols-outlined text-[14px]">campaign</span>}
                        {row.status}
                      </span>
                    </td>
                    <td className="px-8 py-6">
                      <div className="flex items-center justify-end gap-2">
                        <button
                          className="rounded-xl p-2 text-[#59413d] transition-all hover:bg-[#ffdad5] hover:text-[#9e2016]"
                          title={row.status === 'Pending' ? 'Mark as Prayed For' : row.status === 'Testimony' ? 'Testimony' : 'Undo Mark'}
                          onClick={() => { if(row.status !== 'Testimony') toggleStatus(row.id, row.status) }}
                          disabled={row.status === 'Testimony'}
                        >
                          <span className={`material-symbols-outlined ${row.status === 'Testimony' ? 'opacity-30' : ''}`}>{row.status === 'Pending' ? 'church' : row.status === 'Testimony' ? 'campaign' : 'undo'}</span>
                        </button>
                        <button 
                          className="rounded-xl p-2 text-[#59413d] transition-all hover:bg-[#e5e2e1] hover:text-[#1c1b1b]" 
                          title="Edit"
                          onClick={() => openEdit(row)}
                        >
                          <span className="material-symbols-outlined">edit</span>
                        </button>
                        <button
                          className="rounded-xl p-2 text-[#59413d] transition-all hover:bg-[#ffdad6] hover:text-[#ba1a1a]"
                          title="Delete"
                          onClick={async () => {
                            const { error } = await supabase.from('prayer_requests').delete().eq('id', row.id);
                            if (error) setNotice('Error deleting: ' + error.message);
                            else fetchRequests();
                          }}
                        >
                          <span className="material-symbols-outlined">delete</span>
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          <div className="flex items-center justify-between bg-[#f0eded] p-6">
            <span className="text-sm font-medium text-[#59413d]">Showing 1-10 of 142 requests</span>
            <div className="flex items-center gap-2">
              <button className="rounded-lg p-2 transition-colors hover:bg-[#eae7e7] disabled:opacity-30" disabled>
                <span className="material-symbols-outlined">chevron_left</span>
              </button>
              <button className="h-8 w-8 rounded-lg bg-[#9e2016] text-sm font-bold text-white">1</button>
              <button className="h-8 w-8 rounded-lg text-sm font-medium transition-colors hover:bg-[#eae7e7]">2</button>
              <button className="h-8 w-8 rounded-lg text-sm font-medium transition-colors hover:bg-[#eae7e7]">3</button>
              <span className="mx-1 text-[#59413d]">...</span>
              <button className="h-8 w-8 rounded-lg text-sm font-medium transition-colors hover:bg-[#eae7e7]">15</button>
              <button className="rounded-lg p-2 transition-colors hover:bg-[#eae7e7]">
                <span className="material-symbols-outlined">chevron_right</span>
              </button>
            </div>
          </div>
        </div>
      </main>

      {/* New Prayer Request Modal */}
      {requestOpen && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/60 p-4 backdrop-blur-sm">
          <div className="w-full max-w-3xl overflow-hidden rounded-3xl bg-white shadow-2xl transition-all">
            {/* Modal Header */}
            <div className="flex items-center justify-between border-b border-neutral-100 px-8 py-6">
              <h2 className="text-2xl font-extrabold tracking-tight text-[#1c1b1b]">
                {editingId ? 'Edit Prayer Request' : 'New Prayer Request'}
              </h2>
              <button className="rounded-full p-2 hover:bg-neutral-100" onClick={closeModal}>
                <span className="material-symbols-outlined text-[#8d706c]">close</span>
              </button>
            </div>
            {/* Modal Body / Form */}
            <div className="scrollbar-hide max-h-[60vh] overflow-y-auto px-8 py-8">
              <form className="space-y-6" id="prayer-form" onSubmit={handleSave}>
                <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
                  {/* Request Title */}
                  <div className="space-y-2 md:col-span-2">
                    <label className="ml-1 text-sm font-bold uppercase tracking-wider text-[#59413d]">Request Intent / Title</label>
                    <input
                      className="w-full rounded-xl border-none bg-[#f6f3f2] px-4 py-3.5 transition-all focus:bg-white focus:ring-2 focus:ring-[#9e2016]/20"
                      placeholder="e.g. Healing for a loved one"
                      required
                      type="text"
                      value={form.title}
                      onChange={(e) => setForm({ ...form, title: e.target.value })}
                    />
                  </div>
                  {/* Submitter Name */}
                  <div className="space-y-2 md:col-span-2">
                    <label className="ml-1 text-sm font-bold uppercase tracking-wider text-[#59413d]">Your Name</label>
                    <input
                      className="w-full rounded-xl border-none bg-[#f6f3f2] px-4 py-3.5 transition-all focus:bg-white focus:ring-2 focus:ring-[#9e2016]/20"
                      placeholder="e.g. Samuel Johnson"
                      required
                      type="text"
                      value={form.submitter}
                      onChange={(e) => setForm({ ...form, submitter: e.target.value })}
                    />
                  </div>
                </div>
                {/* Request Content */}
                <div className="space-y-2">
                  <label className="ml-1 text-sm font-bold uppercase tracking-wider text-[#59413d]">Detailed Request</label>
                  <textarea
                    className="w-full resize-none rounded-xl border-none bg-[#f6f3f2] px-4 py-3.5 transition-all focus:bg-white focus:ring-2 focus:ring-[#9e2016]/20"
                    placeholder="Tell us what we should be interceding for..."
                    rows={4}
                    value={form.content}
                    required
                    onChange={(e) => setForm({ ...form, content: e.target.value })}
                  />
                </div>
              </form>
            </div>
            {/* Modal Footer */}
            <div className="flex flex-col gap-3 bg-[#f6f3f2]/50 px-8 py-6 md:flex-row">
              <button
                className="flex-1 rounded-2xl bg-[#c0392b] py-4 text-lg font-extrabold text-white shadow-xl shadow-red-900/20 transition-all active:scale-95"
                form="prayer-form"
                type="submit"
              >
                {editingId ? 'Update Request' : 'Submit Request'}
              </button>
              <button className="px-8 py-4 font-bold text-[#59413d] transition-colors hover:text-[#1c1b1b]" onClick={closeModal} type="button">
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}

      <footer className="mt-20 bg-[#f6f3f2] px-8 py-12">
        <div className="mx-auto flex max-w-screen-2xl flex-col items-center justify-between gap-8 md:flex-row">
          <div className="flex flex-col font-bold leading-tight text-[#9e2016] opacity-60">
            <span className="text-lg">Christ Apostolic Church</span>
            <span className="text-[10px] uppercase tracking-widest">Administrative Portal</span>
          </div>
          <div className="flex gap-8 text-sm font-semibold text-[#59413d]">
            <a className="hover:text-[#9e2016]" href="#">Privacy Policy</a>
            <a className="hover:text-[#9e2016]" href="#">Admin Handbook</a>
            <a className="hover:text-[#9e2016]" href="#">Technical Support</a>
          </div>
          <p className="text-xs font-medium text-[#59413d] opacity-50">© 2023 Christ Apostolic Church. All rights reserved.</p>
        </div>
      </footer>
    </>
  );
}
