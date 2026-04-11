import { useState, useEffect } from 'react';
import { supabase } from '../../lib/supabase';
import { uploadChurchAsset } from '../../lib/storage';

export default function Ministries() {
  const [activeTab, setActiveTab] = useState('all');
  const [registerOpen, setRegisterOpen] = useState(false);
  const [menuOpenId, setMenuOpenId] = useState(null);
  const [editingId, setEditingId] = useState(null);
  const [rows, setRows] = useState([]);
  const [loading, setLoading] = useState(true);
  const [uploading, setUploading] = useState(false);
  const [form, setForm] = useState({
    name: '',
    leader: '',
    description: '',
    icon: 'groups',
    image_url: ''
  });

  useEffect(() => {
    fetchMinistries();

    const channel = supabase
      .channel('admin_ministries_sync')
      .on('postgres_changes', { event: '*', schema: 'public', table: 'ministries' }, () => {
        fetchMinistries();
      })
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, []);

  const fetchMinistries = async () => {
    setLoading(true);
    const { data, error } = await supabase
      .from('ministries')
      .select('*')
      .order('name', { ascending: true });
    
    if (!error && data) {
      setRows(data.map(m => ({
        ...m,
        members: m.member_count || 0,
        status: 'Active', // Default for now
        color: 'bg-blue-100 text-blue-700', // Default for now
      })));
    } else if (error) {
      console.error('Error fetching ministries:', error);
    }
    setLoading(false);
  };

  const handleSave = async (e) => {
    e.preventDefault();
    if (!form.name || !form.leader) return;

    const ministryData = {
      name: form.name,
      leader: form.leader,
      description: form.description,
      icon: form.icon,
      image_url: form.image_url,
      member_count: editingId ? (rows.find(r => r.id === editingId)?.members || 0) : 0
    };

    let error;
    if (editingId) {
      const { error: updateError } = await supabase
        .from('ministries')
        .update(ministryData)
        .eq('id', editingId);
      error = updateError;
    } else {
      const { error: insertError } = await supabase
        .from('ministries')
        .insert([ministryData]);
      error = insertError;
    }

    if (!error) {
      fetchMinistries();
      closeModal();
    } else {
      console.error('Error saving ministry:', error);
      alert('Failed to save ministry: ' + error.message);
    }
  };

  const closeModal = () => {
    setRegisterOpen(false);
    setEditingId(null);
    setForm({
      name: '',
      leader: '',
      description: '',
      icon: 'groups',
      image_url: '',
    });
  };

  const openEdit = (m) => {
    setEditingId(m.id);
    setForm({
      name: m.name,
      leader: m.leader,
      description: m.description,
      icon: m.icon,
      image_url: m.image_url || '',
    });
    setRegisterOpen(true);
    setMenuOpenId(null);
  };

  const handleDelete = async (id) => {
    const { error } = await supabase.from('ministries').delete().eq('id', id);
    if (!error) fetchMinistries();
    setMenuOpenId(null);
  };

  const ministries = rows;

  return (
    <main className="pb-12 px-4 sm:px-8 max-w-screen-2xl mx-auto">
      {/* Hero Section */}
      <header className="mb-10 flex flex-col md:flex-row justify-between items-end gap-6 pt-8">
        <div className="max-w-2xl">
          <div className="flex items-center gap-2 mb-4">
            <span className="text-xs font-bold text-[#9e2016] uppercase tracking-[0.2em] bg-[#9e2016]/5 px-3 py-1 rounded-full">Administration</span>
            <span className="material-symbols-outlined text-sm text-[#5e5e5e]">chevron_right</span>
            <span className="text-xs font-bold text-[#5e5e5e] uppercase tracking-[0.2em]">Ministries</span>
          </div>
          <h1 className="text-4xl font-extrabold tracking-tight text-[#1c1b1b] mb-2 font-headline">Ministry Governance</h1>
          <p className="text-[#5e5e5e] body-md font-body max-w-xl">Oversee the various departments of our sanctuary, track engagement, and support ministry leaders in their spiritual mission.</p>
        </div>
        <button 
          onClick={() => {
            setEditingId(null);
            setRegisterOpen(true);
          }}
          className="flex items-center gap-2 bg-[#9e2016] text-white px-6 py-3 rounded-xl font-bold shadow-lg hover:opacity-90 transition-opacity"
        >
          <span className="material-symbols-outlined">add_circle</span>
          Register Ministry
        </button>
      </header>

      {/* Stats Section */}
      <section className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
        <div className="bg-white p-6 rounded-2xl shadow-sm border border-neutral-100">
          <p className="text-[#5e5e5e] text-sm font-medium mb-1">Total Ministries</p>
          <div className="flex items-baseline gap-2">
            <span className="text-3xl font-bold text-[#1c1b1b]">{rows.length}</span>
          </div>
          <div className="mt-4 h-1.5 w-full bg-neutral-100 rounded-full overflow-hidden">
            <div className="h-full bg-blue-500 transition-all duration-500" style={{ width: `${Math.min((rows.length / 20) * 100, 100)}%` }}></div>
          </div>
        </div>
        <div className="bg-white p-6 rounded-2xl shadow-sm border border-neutral-100">
          <p className="text-[#5e5e5e] text-sm font-medium mb-1">Active Members</p>
          <div className="flex items-baseline gap-2">
            <span className="text-3xl font-bold text-[#1c1b1b]">{rows.reduce((acc, curr) => acc + (curr.members || 0), 0)}</span>
          </div>
          <div className="mt-4 h-1.5 w-full bg-neutral-100 rounded-full overflow-hidden">
            <div className="h-full bg-emerald-500 transition-all duration-500" style={{ width: `${Math.min((rows.reduce((acc, curr) => acc + (curr.members || 0), 0) / 1000) * 100, 100)}%` }}></div>
          </div>
        </div>
        <div className="bg-white p-6 rounded-2xl shadow-sm border border-neutral-100">
          <p className="text-[#5e5e5e] text-sm font-medium mb-1">Engagement Rate</p>
          <div className="flex items-baseline gap-2">
            <span className="text-3xl font-bold text-[#1c1b1b]">72%</span>
            <span className="text-xs font-bold text-green-600 bg-green-50 px-2 py-0.5 rounded">↑ 5%</span>
          </div>
          <div className="mt-4 h-1.5 w-full bg-neutral-100 rounded-full overflow-hidden">
            <div className="h-full bg-orange-500" style={{ width: '72%' }}></div>
          </div>
        </div>
        <div className="bg-[#9e2016]/5 p-6 rounded-2xl border border-[#9e2016]/10">
          <p className="text-[#9e2016] text-sm font-bold opacity-60 mb-1 uppercase tracking-widest text-[10px]">Ministry Focus</p>
          <p className="text-2xl font-bold text-[#9e2016]">Outreach</p>
          <div className="mt-4 flex -space-x-2">
            {[1, 2, 3, 4].map(i => (
              <div key={i} className="w-8 h-8 rounded-full border-2 border-white bg-neutral-200"></div>
            ))}
            <div className="w-8 h-8 rounded-full border-2 border-white bg-[#9e2016] text-white text-[10px] flex items-center justify-center font-bold">+5</div>
          </div>
        </div>
      </section>

      {/* Main Content */}
      <section className="bg-white rounded-3xl shadow-sm border border-neutral-100 overflow-hidden">
        <div className="p-6 border-b border-neutral-100 flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div className="flex items-center gap-4 bg-neutral-50 px-4 py-2 rounded-xl">
            <button 
              onClick={() => setActiveTab('all')}
              className={`px-4 py-1.5 rounded-lg text-sm font-bold transition-all ${activeTab === 'all' ? 'bg-white shadow-sm text-[#9e2016]' : 'text-[#5e5e5e]'}`}
            >
              All Ministries
            </button>
            <button 
              onClick={() => setActiveTab('active')}
              className={`px-4 py-1.5 rounded-lg text-sm font-bold transition-all ${activeTab === 'active' ? 'bg-white shadow-sm text-[#9e2016]' : 'text-[#5e5e5e]'}`}
            >
              Active Only
            </button>
          </div>
          <div className="flex items-center gap-3">
            <div className="bg-neutral-50 rounded-xl px-4 py-2 flex items-center gap-2 border border-transparent focus-within:border-[#9e2016]/20 transition-all">
              <span className="material-symbols-outlined text-[#5e5e5e] text-lg">search</span>
              <input type="text" placeholder="Search ministries..." className="bg-transparent border-none p-0 text-sm focus:ring-0 w-48" />
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-px bg-neutral-100">
          {ministries.map((m) => (
            <div key={m.id} className="bg-white p-8 hover:bg-neutral-50 transition-colors group">
              <div className="flex justify-between items-start mb-6">
                <div className={`p-4 rounded-2xl overflow-hidden relative ${m.color.split(' ')[0]} ${m.color.split(' ')[1]}`}>
                  {m.image_url ? (
                    <img src={m.image_url} className="absolute inset-0 w-full h-full object-cover opacity-60" />
                  ) : null}
                  <span className="relative z-10 material-symbols-outlined text-3xl" style={{ fontVariationSettings: "'FILL' 1" }}>{m.icon}</span>
                </div>
                <div className="relative">
                  <button 
                    onClick={() => setMenuOpenId(menuOpenId === m.id ? null : m.id)}
                    className={`text-[#5e5e5e] hover:text-[#9e2016] transition-all ${menuOpenId === m.id ? 'opacity-100' : 'opacity-0 group-hover:opacity-100'}`}
                  >
                    <span className="material-symbols-outlined">more_vert</span>
                  </button>
                  
                  {menuOpenId === m.id && (
                    <>
                      <div className="fixed inset-0 z-10" onClick={() => setMenuOpenId(null)}></div>
                      <div className="absolute right-0 top-full z-20 mt-2 w-40 overflow-hidden rounded-xl bg-white shadow-xl ring-1 ring-black/5 animate-in fade-in zoom-in duration-200">
                        <button 
                          onClick={() => openEdit(m)}
                          className="flex w-full items-center gap-3 px-4 py-3 text-left text-sm font-bold text-[#5e5e5e] hover:bg-neutral-50 hover:text-[#1c1b1b]"
                        >
                          <span className="material-symbols-outlined text-lg">edit</span>
                          Edit Details
                        </button>
                        <button 
                          onClick={() => handleDelete(m.id)}
                          className="flex w-full items-center gap-3 px-4 py-3 text-left text-sm font-bold text-red-600 hover:bg-red-50"
                        >
                          <span className="material-symbols-outlined text-lg">delete</span>
                          Delete
                        </button>
                      </div>
                    </>
                  )}
                </div>
              </div>
              <h3 className="text-xl font-bold text-[#1c1b1b] mb-1 font-headline">{m.name}</h3>
              <p className="text-[#5e5e5e] text-sm mb-6 line-clamp-2 font-body leading-relaxed">{m.description}</p>
              
              <div className="space-y-4 pt-4 border-t border-neutral-100">
                <div className="flex justify-between items-center text-sm">
                  <span className="text-[#5e5e5e] font-medium">Leader</span>
                  <span className="text-[#1c1b1b] font-bold">{m.leader}</span>
                </div>
                <div className="flex justify-between items-center text-sm">
                  <span className="text-[#5e5e5e] font-medium">Members</span>
                  <span className="text-[#1c1b1b] font-bold">{m.members}</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className={`text-[10px] font-bold uppercase tracking-widest px-2 py-0.5 rounded ${m.status === 'Active' ? 'bg-green-50 text-green-600' : 'bg-blue-50 text-blue-600'}`}>
                    {m.status}
                  </span>
                  <button className="text-[#9e2016] text-xs font-bold flex items-center gap-1 hover:underline">
                    View Registry <span className="material-symbols-outlined text-xs">arrow_forward</span>
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>
      {/* Registration Modal */}
      {registerOpen && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/60 p-4 backdrop-blur-sm">
          <div className="w-full max-w-3xl overflow-hidden rounded-3xl bg-white shadow-2xl transition-all">
            {/* Modal Header */}
            <div className="flex items-center justify-between border-b border-neutral-100 px-8 py-6">
              <h2 className="text-2xl font-extrabold tracking-tight text-[#1c1b1b]">
                {editingId ? 'Edit Ministry Details' : 'Register New Ministry'}
              </h2>
              <button className="rounded-full p-2 hover:bg-neutral-100" onClick={closeModal}>
                <span className="material-symbols-outlined text-[#5e5e5e]">close</span>
              </button>
            </div>
            {/* Modal Body / Form */}
            <div className="scrollbar-hide max-h-[60vh] overflow-y-auto px-8 py-8">
              <form className="space-y-6" id="ministry-form" onSubmit={handleSave}>
                <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
                  {/* Ministry Name */}
                  <div className="space-y-2 md:col-span-2">
                    <label className="ml-1 text-sm font-bold uppercase tracking-wider text-[#5e5e5e]">Ministry Name</label>
                    <input
                      className="w-full rounded-xl border-none bg-neutral-50 px-4 py-3.5 transition-all focus:bg-white focus:ring-2 focus:ring-[#9e2016]/20"
                      placeholder="e.g. Outreach Ministry"
                      required
                      type="text"
                      value={form.name}
                      onChange={(e) => setForm({ ...form, name: e.target.value })}
                    />
                  </div>
                  {/* Leader Name */}
                  <div className="space-y-2">
                    <label className="ml-1 text-sm font-bold uppercase tracking-wider text-[#5e5e5e]">Ministry Leader</label>
                    <input
                      className="w-full rounded-xl border-none bg-neutral-50 px-4 py-3.5 transition-all focus:bg-white focus:ring-2 focus:ring-[#9e2016]/20"
                      placeholder="e.g. Bro. David Smith"
                      required
                      type="text"
                      value={form.leader}
                      onChange={(e) => setForm({ ...form, leader: e.target.value })}
                    />
                  </div>
                  {/* Category / Icon Selection */}
                  <div className="space-y-2">
                    <label className="ml-1 text-sm font-bold uppercase tracking-wider text-[#5e5e5e]">Ministry Icon</label>
                    <div className="flex flex-wrap gap-2">
                      {['groups', 'school', 'public', 'female', 'male', 'music_note', 'volunteer_activism', 'church'].map((icon) => (
                        <button
                          key={icon}
                          type="button"
                          onClick={() => setForm({ ...form, icon })}
                          className={`w-10 h-10 rounded-lg flex items-center justify-center transition-all ${
                            form.icon === icon ? 'bg-[#9e2016] text-white' : 'bg-neutral-50 text-[#5e5e5e] hover:bg-neutral-100'
                          }`}
                        >
                          <span className="material-symbols-outlined text-lg">{icon}</span>
                        </button>
                      ))}
                    </div>
                  </div>
                </div>

                {/* Image Upload */}
                <div className="space-y-2 md:col-span-2">
                  <label className="ml-1 text-sm font-bold uppercase tracking-wider text-[#5e5e5e]">Ministry Banner / Image</label>
                  <div className="flex items-center gap-4">
                    {form.image_url && <img src={form.image_url} className="w-16 h-16 rounded-xl object-cover" />}
                    <div className="flex-1 relative">
                      <input
                        type="file"
                        accept="image/*"
                        className="hidden"
                        id="ministry-image-upload"
                        onChange={async (e) => {
                          const file = e.target.files?.[0];
                          if (file) {
                            setUploading(true);
                            const url = await uploadChurchAsset(file);
                            if (url) setForm({ ...form, image_url: url });
                            setUploading(false);
                          }
                        }}
                      />
                      <label 
                        htmlFor="ministry-image-upload"
                        className="flex items-center justify-center gap-2 w-full rounded-xl border-2 border-dashed border-[#8d706c]/30 py-4 px-4 text-sm font-bold text-[#5e5e5e] cursor-pointer hover:bg-neutral-50 transition-all"
                      >
                        <span className="material-symbols-outlined">{uploading ? 'sync' : 'add_photo_alternate'}</span>
                        {uploading ? 'Uploading...' : form.image_url ? 'Change Image' : 'Upload Ministry Image'}
                      </label>
                    </div>
                  </div>
                </div>
                {/* Description */}
                <div className="space-y-2">
                  <label className="ml-1 text-sm font-bold uppercase tracking-wider text-[#5e5e5e]">Purpose & Mission</label>
                  <textarea
                    className="w-full resize-none rounded-xl border-none bg-neutral-50 px-4 py-3.5 transition-all focus:bg-white focus:ring-2 focus:ring-[#9e2016]/20"
                    placeholder="Describe the goals and activities of this ministry..."
                    rows={4}
                    value={form.description}
                    onChange={(e) => setForm({ ...form, description: e.target.value })}
                  />
                </div>
              </form>
            </div>
            {/* Modal Footer */}
            <div className="flex flex-col gap-3 bg-neutral-50 px-8 py-6 md:flex-row">
              <button
                className="flex-1 rounded-2xl bg-[#9e2016] py-4 text-lg font-extrabold text-white shadow-xl shadow-[#9e2016]/20 transition-all active:scale-95"
                form="ministry-form"
                type="submit"
              >
                {editingId ? 'Update Ministry' : 'Launch Ministry'}
              </button>
              <button className="px-8 py-4 font-bold text-[#5e5e5e] transition-colors hover:text-[#1c1b1b]" onClick={closeModal} type="button">
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}
    </main>
  );
}
