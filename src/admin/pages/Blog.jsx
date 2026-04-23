import { useState, useEffect } from 'react';
import { supabase } from '../../lib/supabase';
import { uploadChurchAsset } from '../../lib/storage';
import { Skeleton } from "@/components/ui/skeleton";

export default function Blog() {
  const [postOpen, setPostOpen] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [uploading, setUploading] = useState(false);
  const [rows, setRows] = useState([]);
  const [form, setForm] = useState({
    title: '',
    author: '',
    content: '',
    image: '',
    category: 'Inspiration',
  });

  useEffect(() => {
    fetchPosts();

    const channel = supabase
      .channel('admin_blog_sync')
      .on('postgres_changes', { event: '*', schema: 'public', table: 'blog_posts' }, () => {
        fetchPosts();
      })
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, []);

  const fetchPosts = async () => {
    setLoading(true);
    const { data, error } = await supabase
      .from('blog_posts')
      .select('*')
      .order('published_at', { ascending: false });
    
    if (!error && data) {
      setRows(data.map(p => ({
        ...p,
        excerpt: (p.content || '').substring(0, 100) + '...',
        initials: (p.author || 'Admin').split(' ').slice(0, 2).map(n => n[0]).join(''),
        date: p.published_at ? new Date(p.published_at).toLocaleDateString('en-US', { month: 'short', day: '2-digit', year: 'numeric' }) : 'Draft',
        image: p.image_url || 'https://lh3.googleusercontent.com/aida-public/AB6AXuCRekhJOV60boGR62RSEEl5u1opK6DPxroifkEtnyPefe395jZqzk4KqPCgMv-_uvrAL2iBckL4y2qAPPNuiZl6qcC0PJTqibmtg1KkMq8bgntYJ7u-z2pD5BmoqwnRD0gTdn-Fv8Eh_Zhen4uI9kW9rhle4_B5LTXi1Zd22ZSMDnBTAWktUxlvYuXCWLpdsqNSFuT-lwqDO0pQUEpOzN0DDFLeQ2d-KXLUFPnPyyAATfwwF72eZ2LgqwQrkt9xZhFB40toVHhexmDG'
      })));
    } else if (error) {
      console.error('Error fetching blog posts:', error);
    }
    setLoading(false);
  };

  const handleCreatePost = async (e) => {
    e.preventDefault();
    if (!form.title || !form.author) return;

    const postData = {
      title: form.title,
      author: form.author,
      content: form.content,
      image_url: form.image,
      category: form.category,
      published_at: new Date().toISOString(),
      status: 'Published'
    };

    let error;
    if (editingId) {
      const { error: updateError } = await supabase.from('blog_posts').update(postData).eq('id', editingId);
      error = updateError;
    } else {
      const { error: insertError } = await supabase.from('blog_posts').insert([postData]);
      error = insertError;
    }
    
    if (!error) {
      fetchPosts();
      setForm({
          title: '',
          author: '',
          content: '',
          image: '',
          category: 'Inspiration',
      });
      setPostOpen(false);
      setEditingId(null);
    } else {
      console.error('Error saving blog post:', error);
      alert('Failed to save post: ' + error.message);
    }
  };

  const openEdit = (post) => {
    setEditingId(post.id);
    setForm({
      title: post.title,
      author: post.author,
      content: post.content || '',
      image: post.image_url || '',
      category: post.category || 'Inspiration',
    });
    setPostOpen(true);
  };

  const posts = rows.filter(p => 
    (p.title || '').toLowerCase().includes(searchQuery.toLowerCase()) || 
    (p.author || '').toLowerCase().includes(searchQuery.toLowerCase()) || 
    (p.excerpt || '').toLowerCase().includes(searchQuery.toLowerCase())
  );
  return (
    <>
      <main className="mx-auto max-w-7xl px-4 pb-20 pt-8 md:px-12">
        <header className="mb-12 flex flex-col justify-between gap-6 md:flex-row md:items-end">
          <div className="space-y-2">
            <nav className="mb-4 flex items-center text-sm font-medium text-[#5e5e5e]">
              <span>Admin Console</span>
              <span className="material-symbols-outlined mx-2 text-sm">chevron_right</span>
              <span className="text-[#9e2016]">Content Management</span>
            </nav>
            <h1 className="text-5xl font-extrabold tracking-tight text-[#1c1b1b]">Blog & Announcements</h1>
            <p className="max-w-xl text-lg text-[#5e5e5e]">
              Manage the spiritual voice of the church. Draft newsletters, share ministry updates, and announce holy events.
            </p>
          </div>
          <button 
            onClick={() => {
              setEditingId(null);
              setForm({title: '', author: '', content: '', image: ''});
              setPostOpen(true);
            }}
            className="group flex items-center gap-3 rounded-full bg-gradient-to-r from-[#9e2016] to-[#c0392b] px-8 py-4 font-bold text-white shadow-[0_12px_40px_rgba(28,27,27,0.06)] transition-all duration-300 hover:opacity-95"
          >
            <span className="material-symbols-outlined transition-transform group-hover:rotate-90">add</span>
            Create New Post
          </button>
        </header>

        <div className="mb-12 grid grid-cols-1 gap-4 md:grid-cols-4">
          <div className="rounded-xl bg-white p-6 shadow-[0_12px_40px_rgba(28,27,27,0.06)]">
            <p className="mb-1 text-sm font-medium text-[#5e5e5e]">Total Posts</p>
            <p className="text-3xl font-bold text-[#1c1b1b]">{rows.length}</p>
          </div>
          <div className="rounded-xl bg-white p-6 shadow-[0_12px_40px_rgba(28,27,27,0.06)]">
            <p className="mb-1 text-sm font-medium text-[#5e5e5e]">Published</p>
            <p className="text-3xl font-bold text-[#9e2016]">{rows.filter(r => r.status === 'Published').length}</p>
          </div>
          <div className="rounded-xl bg-white p-6 shadow-[0_12px_40px_rgba(28,27,27,0.06)]">
            <p className="mb-1 text-sm font-medium text-[#5e5e5e]">Drafts</p>
            <p className="text-3xl font-bold text-[#5e5e5e]">{rows.filter(r => r.status === 'Draft').length}</p>
          </div>
          <div className="flex items-center justify-between rounded-xl bg-[#ffdad5] p-6 shadow-[0_12px_40px_rgba(28,27,27,0.06)]">
            <div>
              <p className="mb-1 text-sm font-medium text-[#8e130c]">Recent Growth</p>
              <p className="text-3xl font-bold text-[#9e2016]">Dynamic</p>
            </div>
            <span className="material-symbols-outlined text-4xl text-[#9e2016]/40">trending_up</span>
          </div>
        </div>

        <div className="overflow-hidden rounded-3xl bg-[#f6f3f2] shadow-[0_12px_40px_rgba(28,27,27,0.06)]">
          <div className="flex flex-col justify-between gap-4 bg-[#f6f3f2] p-6 md:flex-row md:items-center">
            <div className="relative max-w-md flex-1">
              <span className="material-symbols-outlined absolute left-4 top-1/2 -translate-y-1/2 text-[#5e5e5e]">search</span>
              <input
                className="w-full rounded-2xl border-none bg-white py-3 pl-12 pr-4 text-sm transition-all outline-none focus:outline-none focus:ring-0 shadow-none focus:shadow-none"
                style={{boxShadow: 'none'}}
                placeholder="Search announcements..."
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>
            <div className="flex items-center gap-2">
              <button className="flex items-center gap-2 rounded-full px-4 py-2 text-sm font-medium text-[#5e5e5e] transition-colors hover:bg-[#eae7e7]">
                <span className="material-symbols-outlined text-lg">filter_list</span>
                Filter
              </button>
              <button className="flex items-center gap-2 rounded-full px-4 py-2 text-sm font-medium text-[#5e5e5e] transition-colors hover:bg-[#eae7e7]">
                <span className="material-symbols-outlined text-lg">sort</span>
                Latest
              </button>
            </div>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full border-collapse text-left">
              <thead>
                <tr className="text-xs font-bold uppercase tracking-widest text-[#5e5e5e]">
                  <th className="px-8 py-5">Post Details</th>
                  <th className="px-8 py-5">Author</th>
                  <th className="px-8 py-5">Date</th>
                  <th className="px-8 py-5">Status</th>
                  <th className="px-8 py-5 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#e1bfb9]/10">
                {loading ? (
                  Array.from({ length: 5 }).map((_, i) => (
                    <tr key={i}>
                      <td className="px-8 py-6">
                        <div className="flex items-center gap-4">
                          <Skeleton className="h-16 w-16 rounded-xl shrink-0" />
                          <div className="flex-1 space-y-2">
                            <Skeleton className="h-5 w-3/4" />
                            <Skeleton className="h-4 w-1/2" />
                          </div>
                        </div>
                      </td>
                      <td className="px-8 py-6">
                        <div className="flex items-center gap-3">
                          <Skeleton className="h-8 w-8 rounded-full" />
                          <Skeleton className="h-4 w-24" />
                        </div>
                      </td>
                      <td className="px-8 py-6">
                        <Skeleton className="h-4 w-20" />
                      </td>
                      <td className="px-8 py-6">
                        <Skeleton className="h-6 w-24 rounded-full" />
                      </td>
                      <td className="px-8 py-6">
                        <div className="flex justify-end gap-2">
                          <Skeleton className="h-8 w-8 rounded-lg" />
                          <Skeleton className="h-8 w-8 rounded-lg" />
                        </div>
                      </td>
                    </tr>
                  ))
                ) : posts.map((post) => (
                  <tr className="group transition-all hover:bg-white" key={post.title}>
                    <td className="px-8 py-6">
                      <div className="flex items-center gap-4">
                        <div className="h-16 w-16 flex-shrink-0 overflow-hidden rounded-xl bg-[#e5e2e1]">
                          <img className="h-full w-full object-cover" src={post.image} alt={post.title} />
                        </div>
                        <div>
                          <h3 className="text-lg font-bold leading-snug text-[#1c1b1b] transition-colors group-hover:text-[#9e2016]">{post.title}</h3>
                          <p className="line-clamp-1 text-sm text-[#5e5e5e]">{post.excerpt}</p>
                        </div>
                      </div>
                    </td>
                    <td className="px-8 py-6">
                      <div className="flex items-center gap-3">
                        <div
                          className={`flex h-8 w-8 items-center justify-center rounded-full text-xs font-bold ${
                            post.status === 'Draft' ? 'bg-[#e1dfdf] text-[#5e5e5e]' : 'bg-[#ffdad5] text-[#9e2016]'
                          }`}
                        >
                          {post.initials}
                        </div>
                        <span className="text-sm font-medium text-[#1c1b1b]">{post.author}</span>
                      </div>
                    </td>
                    <td className="px-8 py-6 text-sm font-medium text-[#5e5e5e]">{post.date}</td>
                    <td className="px-8 py-6">
                      {post.status === 'Published' ? (
                        <span className="inline-flex items-center gap-1.5 rounded-full bg-green-100 px-3 py-1 text-xs font-bold text-green-700">
                          <span className="h-1.5 w-1.5 rounded-full bg-green-500" />
                          Published
                        </span>
                      ) : (
                        <span className="inline-flex items-center gap-1.5 rounded-full bg-[#e5e2e1] px-3 py-1 text-xs font-bold text-[#5e5e5e]">
                          <span className="h-1.5 w-1.5 rounded-full bg-[#8d706c]" />
                          Draft
                        </span>
                      )}
                    </td>
                    <td className="px-8 py-6">
                      <div className="flex items-center justify-end gap-2">
                        <button 
                          className="rounded-xl p-2 text-[#5e5e5e] transition-all hover:bg-[#ffdad5] hover:text-[#9e2016]" 
                          title={post.status === 'Draft' ? 'Publish' : 'Unpublish'}
                          onClick={async () => {
                            const newStatus = post.status === 'Draft' ? 'Published' : 'Draft';
                            await supabase.from('blog_posts').update({ status: newStatus }).eq('id', post.id);
                            fetchPosts();
                          }}
                        >
                          <span className="material-symbols-outlined">{post.status === 'Draft' ? 'publish' : 'visibility_off'}</span>
                        </button>
                        <button 
                          className="rounded-xl p-2 text-[#5e5e5e] transition-all hover:bg-[#e5e2e1] hover:text-[#1c1b1b]" 
                          title="Edit"
                          onClick={() => openEdit(post)}
                        >
                          <span className="material-symbols-outlined">edit</span>
                        </button>
                        <button 
                          className="rounded-xl p-2 text-[#5e5e5e] transition-all hover:bg-[#ffdad6] hover:text-[#ba1a1a]" 
                          title="Delete"
                          onClick={async () => {
                            await supabase.from('blog_posts').delete().eq('id', post.id);
                            fetchPosts();
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
            <span className="text-sm font-medium text-[#5e5e5e]">Showing 1-10 of 124 posts</span>
            <div className="flex items-center gap-2">
              <button className="rounded-lg p-2 transition-colors hover:bg-[#eae7e7] disabled:opacity-30" disabled>
                <span className="material-symbols-outlined">chevron_left</span>
              </button>
              <button className="h-8 w-8 rounded-lg bg-[#9e2016] text-sm font-bold text-white">1</button>
              <button className="h-8 w-8 rounded-lg text-sm font-medium transition-colors hover:bg-[#eae7e7]">2</button>
              <button className="h-8 w-8 rounded-lg text-sm font-medium transition-colors hover:bg-[#eae7e7]">3</button>
              <span className="mx-1 text-[#5e5e5e]">...</span>
              <button className="h-8 w-8 rounded-lg text-sm font-medium transition-colors hover:bg-[#eae7e7]">12</button>
              <button className="rounded-lg p-2 transition-colors hover:bg-[#eae7e7]">
                <span className="material-symbols-outlined">chevron_right</span>
              </button>
            </div>
          </div>
        </div>
      </main>

      <button 
        onClick={() => {
          setEditingId(null);
          setForm({title: '', author: '', content: '', image: ''});
          setPostOpen(true);
        }}
        className="fixed bottom-8 right-8 z-50 flex h-16 w-16 items-center justify-center rounded-full bg-[#9e2016] text-white shadow-2xl transition-transform active:scale-95 md:hidden"
      >
        <span className="material-symbols-outlined text-3xl">add</span>
      </button>

      {/* Create New Post Modal */}
      {postOpen && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/60 p-4 backdrop-blur-sm">
          <div className="w-full max-w-3xl overflow-hidden rounded-3xl bg-white shadow-2xl transition-all">
            {/* Modal Header */}
            <div className="flex items-center justify-between border-b border-neutral-100 px-8 py-6">
              <h2 className="text-2xl font-extrabold tracking-tight text-[#1c1b1b]">{editingId ? 'Edit Post' : 'Create New Post'}</h2>
              <button className="rounded-full p-2 hover:bg-neutral-100" onClick={() => { setPostOpen(false); setEditingId(null); }}>
                <span className="material-symbols-outlined text-[#8d706c]">close</span>
              </button>
            </div>
            {/* Modal Body / Form */}
            <div className="scrollbar-hide max-h-[60vh] overflow-y-auto px-8 py-8">
              <form className="space-y-6" id="post-form" onSubmit={handleCreatePost}>
                <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
                  {/* Post Title */}
                  <div className="space-y-2 md:col-span-2">
                    <label className="ml-1 text-sm font-bold uppercase tracking-wider text-[#5e5e5e]">Post Title</label>
                    <input
                      className="w-full rounded-xl border-none bg-[#f6f3f2] px-4 py-3.5 transition-all focus:bg-white focus:ring-2 focus:ring-[#9e2016]/20"
                      placeholder="e.g. Reflections on the Youth Vigil"
                      required
                      type="text"
                      value={form.title}
                      onChange={(e) => setForm({ ...form, title: e.target.value })}
                    />
                  </div>
                  {/* Author Name */}
                  <div className="space-y-2">
                    <label className="ml-1 text-sm font-bold uppercase tracking-wider text-[#5e5e5e]">Author</label>
                    <input
                      className="w-full rounded-xl border-none bg-[#f6f3f2] px-4 py-3.5 transition-all focus:bg-white focus:ring-2 focus:ring-[#9e2016]/20"
                      placeholder="e.g. Pastor John Oladele"
                      required
                      type="text"
                      value={form.author}
                      onChange={(e) => setForm({ ...form, author: e.target.value })}
                    />
                  </div>
                  {/* Category */}
                  <div className="space-y-2">
                    <label className="ml-1 text-sm font-bold uppercase tracking-wider text-[#5e5e5e]">Category</label>
                    <select
                      className="w-full rounded-xl border-none bg-[#f6f3f2] px-4 py-3.5 transition-all focus:bg-white focus:ring-2 focus:ring-[#9e2016]/20"
                      value={form.category}
                      onChange={(e) => setForm({ ...form, category: e.target.value })}
                    >
                      <option value="Inspiration">Inspiration</option>
                      <option value="Youth Ministry">Youth Ministry</option>
                      <option value="Church News">Church News</option>
                      <option value="Family Life">Family Life</option>
                      <option value="Testimony">Testimony</option>
                    </select>
                  </div>
                  <div className="space-y-2">
                    <label className="ml-1 text-sm font-bold uppercase tracking-wider text-[#5e5e5e]">Header Image</label>
                    <div className="flex items-center gap-4">
                      {form.image && <img src={form.image} className="w-16 h-16 rounded-xl object-cover" />}
                      <div className="flex-1 relative">
                        <input
                          type="file"
                          accept="image/*"
                          className="hidden"
                          id="blog-image-upload"
                          onChange={async (e) => {
                            const file = e.target.files?.[0];
                            if (file) {
                              setUploading(true);
                              const url = await uploadChurchAsset(file);
                              if (url) setForm({ ...form, image: url });
                              setUploading(false);
                            }
                          }}
                        />
                        <label 
                          htmlFor="blog-image-upload"
                          className="flex items-center justify-center gap-2 w-full rounded-xl border-2 border-dashed border-[#8d706c]/30 py-3.5 text-sm font-bold text-[#5e5e5e] cursor-pointer hover:bg-[#f6f3f2] transition-all"
                        >
                          <span className="material-symbols-outlined">{uploading ? 'sync' : 'add_photo_alternate'}</span>
                          {uploading ? 'Uploading...' : form.image ? 'Change Image' : 'Click to Upload'}
                        </label>
                      </div>
                    </div>
                  </div>
                </div>
                {/* Content */}
                <div className="space-y-2">
                  <label className="ml-1 text-sm font-bold uppercase tracking-wider text-[#5e5e5e]">Post Content</label>
                  <textarea
                    className="w-full resize-none rounded-xl border-none bg-[#f6f3f2] px-4 py-3.5 transition-all focus:bg-white focus:ring-2 focus:ring-[#9e2016]/20"
                    placeholder="Write the full content of your announcement here..."
                    rows={6}
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
                form="post-form"
                type="submit"
              >
                {editingId ? 'Update Post' : 'Save Post'}
              </button>
              <button className="px-8 py-4 font-bold text-[#5e5e5e] transition-colors hover:text-[#1c1b1b]" onClick={() => { setPostOpen(false); setEditingId(null); setForm({title: '', author: '', content: '', image: '', category: 'Inspiration'}); }} type="button">
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
