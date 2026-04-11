import { useMemo, useState, useEffect } from 'react';
import { supabase } from '../../lib/supabase';
import { uploadChurchAsset } from '../../lib/storage';

const sermonSeed = [
  {
    title: 'The Power of Unwavering Faith',
    subtitle: 'Hebrews 11:1-6 • Sunday Service',
    speaker: 'Pastor John Doe',
    avatar: 'JD',
    date: 'Oct 24, 2023',
    media: ['🎥', '🎧'],
    image:
      'https://lh3.googleusercontent.com/aida-public/AB6AXuCPW7JU0akWYdlQla6r1cgEEq4rllkHiuHTsr5fQhGL_zUucW14IM4O3IZvlePHdBX3WQSkM4K_t81yhXEqcfioJlsAUGOUvAsU1_k8QRbjQu8ZFr-WUACLl1oaET_9HqYdCaehBUORr4zi2yIyI5sFTOKd_l_aT1ICYxkvId31XYozutnOMuhQ52G3s8aZv9WcIJ9Ga99L2mvEhg7DTrsyPeBXDo7-6zjaLm8pZL2iCdGR3fc4TYgXSf0MVGHUgdHvA2pRN2i0LWlA',
  },
  {
    title: 'Walking in Divine Purpose',
    subtitle: 'Jeremiah 29:11 • Youth Ministry',
    speaker: 'Evang. Sarah Smith',
    avatar: 'SS',
    date: 'Oct 20, 2023',
    media: ['🎧', '📄'],
    image:
      'https://lh3.googleusercontent.com/aida-public/AB6AXuCPIkjtw9WjQTxaNVf3NBRFRu4hZ_HCIXSSgWbQzxaUFhUn5RiZptpYdbnFqJdwfdJC7_YJTs7LEAXDkEpDFql7DaMg0iV1WbVk77mEDUQg9YR1Sr2R-VQaxfUmzJNV-Z3jXLZBsysEnp6aqjvAG_38VCEfkbbDFSWJht--I7S_Ny-iAau0n-C3W8sw7kns_8EcfQk9v8-fXPK1OlW8hK8WDr6mqcQrRibf4_nXPuszjsQiRS-K4wjI0xNmzAQ485LAgHtUtAiIIWBS',
  },
  {
    title: 'Finding Peace in the Storm',
    subtitle: 'Mark 4:35-41 • Wednesday Midweek',
    speaker: 'Rev. Michael Brown',
    avatar: 'MB',
    date: 'Oct 17, 2023',
    media: ['🎥'],
    image:
      'https://lh3.googleusercontent.com/aida-public/AB6AXuDcV47oPlF6bVAqhQoZWE2CQBCSxeqrthYiYqZtOr-f0ZrjvK7Ir41Ln8E3TUNEHvfrG4vL5Io6LuO3O-Ol2HShiuIUj1cCb1OK44h3yirL1A8hSIt3t2mpxmw4aY5hWFkMkY-9MCGoW01UA8AfpCziCyIIotzykRclAdNEwQYSiaOXU7bgYm_RgEHnDnfCSGx6judFF_19B23RiC6OKR895ioEwmZGteW2UtESBtUAogERi2YawFrFXXD4f0lK6j5aePJUyOyB0Qo_',
  },
  {
    title: 'The Heart of Worship',
    subtitle: 'John 4:23-24 • Sunday Service',
    speaker: 'Pastor John Doe',
    avatar: 'JD',
    date: 'Oct 10, 2023',
    media: ['🎥', '🎧', '📄'],
    image:
      'https://lh3.googleusercontent.com/aida-public/AB6AXuB9iAyC99p8-15etsPZlwSnmODS7B6ea1dh-2WBBFI_9KQ837HKfq430YQGLZGzyjnomc_gQW8ulwhoLOeBadOd1fQ-WtbHtVfU6cw5tAiw7gII1C1CLMORJRt14IHMLBaAU9jSeCY1n0EpqPz4rwkJ4IyAqwDR72vD1IN5qbcQOoRektqaE7lIo1dREULdiqRph2eXcDzCCUMD4U6fy4-PFA33ETNL159ZgyjInFwX7qDAOlBOLMHye8XW6r8hwyTobVwubQ7uXYsv',
  },
];

export default function Sermons() {
  const [notice, setNotice] = useState('');
  const [query, setQuery] = useState('');
  const [speaker, setSpeaker] = useState('All Speakers');
  const [uploadOpen, setUploadOpen] = useState(false);
  const [form, setForm] = useState({
    title: '',
    speaker: '',
    series: '',
    date: '',
    scripture: '',
    type: 'Video',
    mediaUrl: '',
    description: '',
  });
  const [rows, setRows] = useState([]);
  const [loading, setLoading] = useState(true);
  const [uploading, setUploading] = useState(false);

  useEffect(() => {
    fetchSermons();

    const channel = supabase
      .channel('admin_sermons_sync')
      .on('postgres_changes', { event: '*', schema: 'public', table: 'sermons' }, () => {
        fetchSermons();
      })
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, []);

  const fetchSermons = async () => {
    setLoading(true);
    const { data, error } = await supabase
      .from('sermons')
      .select('*')
      .order('date', { ascending: false });
    
    if (error) {
      setNotice('Error fetching sermons: ' + error.message);
    } else {
      setRows(data.map(s => ({
        ...s,
        subtitle: s.description || 'No description',
        avatar: s.speaker.split(' ').slice(0, 2).map((n) => n[0]?.toUpperCase() || '').join(''),
        media: [s.video_url ? '🎥' : '', s.audio_url ? '🎧' : ''].filter(Boolean),
        image: s.thumbnail_url || 'https://lh3.googleusercontent.com/aida-public/AB6AXuCPW7JU0akWYdlQla6r1cgEEq4rllkHiuHTsr5fQhGL_zUucW14IM4O3IZvlePHdBX3WQSkM4K_t81yhXEqcfioJlsAUGOUvAsU1_k8QRbjQu8ZFr-WUACLl1oaET_9HqYdCaehBUORr4zi2yIyI5sFTOKd_l_aT1ICYxkvId31XYozutnOMuhQ52G3s8aZv9WcIJ9Ga99L2mvEhg7DTrsyPeBXDo7-6zjaLm8pZL2iCdGR3fc4TYgXSf0MVGHUgdHvA2pRN2i0LWlA'
      })));
    }
    setLoading(false);
  };

  const filteredRows = useMemo(
    () =>
      rows.filter((r) => {
        const searchOk = `${r.title} ${r.subtitle}`.toLowerCase().includes(query.toLowerCase());
        const speakerOk = speaker === 'All Speakers' || r.speaker === speaker;
        return searchOk && speakerOk;
      }),
    [rows, query, speaker],
  );

  const addSermon = async (e) => {
    e.preventDefault();
    if (!form.title || !form.speaker) {
      setNotice('Please add title and speaker.');
      return;
    }

    const sermonData = {
      title: form.title,
      speaker: form.speaker,
      description: form.scripture ? `${form.scripture}${form.scripture && ' • '}${form.series || 'New Upload'}` : form.series,
      date: form.date || new Date().toISOString().split('T')[0],
      type: form.type,
      [form.type === 'Video' ? 'video_url' : 'audio_url']: form.mediaUrl,
      thumbnail_url: form.thumbnail_url || null
    };

    const { error } = await supabase
      .from('sermons')
      .insert([sermonData]);

    if (error) {
      setNotice('Error saving sermon: ' + error.message);
    } else {
      setNotice('Sermon uploaded successfully.');
      fetchSermons();
      setForm({
        title: '',
        speaker: '',
        series: '',
        date: '',
        scripture: '',
        type: 'Video',
        mediaUrl: '',
        description: '',
      });
      setUploadOpen(false);
    }
  };

  return (
    <main className="mx-auto max-w-screen-2xl px-4 pb-20 pt-8 sm:px-6 lg:px-8">
      {notice && <div className="mb-4 rounded-xl bg-[#ffdad5] px-4 py-3 text-sm font-semibold text-[#8e130c]">{notice}</div>}
      <header className="mb-12 flex flex-col justify-between gap-6 md:flex-row md:items-end">
        <div>
          <h1 className="mb-2 text-5xl font-extrabold tracking-tight text-[#1c1b1b]">Sermons &amp; Media</h1>
          <p className="text-lg text-[#59413d]">Manage and curate the spiritual teachings for your global congregation.</p>
        </div>
        <button
          className="flex items-center gap-2 self-start rounded-full bg-[#9e2016] px-8 py-4 font-bold text-white shadow-xl shadow-[#9e2016]/20 transition-all hover:bg-[#c0392b] md:self-auto"
          onClick={() => setUploadOpen(true)}
        >
          <span className="material-symbols-outlined">upload_file</span>
          Upload New Sermon
        </button>
      </header>

      <section className="mb-8 grid grid-cols-1 gap-4 lg:grid-cols-12">
        <div className="relative lg:col-span-7">
          <span className="absolute left-4 top-1/2 -translate-y-1/2 text-[#8d706c]">⌕</span>
          <input
            className="w-full rounded-xl bg-[#f6f3f2] py-4 pl-12 pr-4 text-[#1c1b1b] placeholder:text-[#8d706c]"
            placeholder="Search by title, scripture, or topic..."
            value={query}
            onChange={(e) => setQuery(e.target.value)}
          />
        </div>
        <div className="lg:col-span-3">
          <div className="relative">
            <span className="absolute left-4 top-1/2 -translate-y-1/2 text-[#8d706c]">◉</span>
            <select className="w-full appearance-none rounded-xl bg-[#f6f3f2] py-4 pl-12 pr-4 text-[#59413d]" value={speaker} onChange={(e) => setSpeaker(e.target.value)}>
              <option>All Speakers</option>
              <option>Pastor John Doe</option>
              <option>Evang. Sarah Smith</option>
              <option>Rev. Michael Brown</option>
            </select>
          </div>
        </div>
        <div className="lg:col-span-2">
          <div className="relative">
            <span className="absolute left-4 top-1/2 -translate-y-1/2 text-[#8d706c]">◷</span>
            <input className="w-full rounded-xl bg-[#f6f3f2] py-4 pl-12 pr-4 text-[#59413d]" placeholder="Date Range" onChange={() => setNotice('Date range filter connected.')} />
          </div>
        </div>
      </section>

      <section className="mb-8 grid grid-cols-1 gap-6 md:grid-cols-3">
        <div className="group relative flex h-48 flex-col justify-between overflow-hidden rounded-3xl bg-[#ffdad5] p-8">
          <span className="text-xs font-bold uppercase tracking-widest text-[#9e2016]">Growth</span>
          <div>
            <div className="text-4xl font-extrabold text-[#410000]">{(rows.length * 85).toLocaleString()}</div>
            <div className="font-medium text-[#8e130c]">Monthly Media Plays</div>
          </div>
          <div className="mt-4 h-1.5 w-full overflow-hidden rounded-full bg-[#410000]/10">
            <div className="h-full bg-[#9e2016] transition-all duration-500" style={{ width: `${Math.min(((rows.length * 85) / 5000) * 100, 100)}%` }} />
          </div>
          <span className="absolute -bottom-4 -right-4 text-9xl text-[#9e2016]/10">↗</span>
        </div>
        <div className="group relative flex h-48 flex-col justify-between overflow-hidden rounded-3xl bg-[#e5e2e1] p-8">
          <span className="text-xs font-bold uppercase tracking-widest text-[#5e5e5e]">Reach</span>
          <div>
            <div className="text-4xl font-extrabold text-[#1c1b1b]">{Math.min(rows.length + 5, 195)}</div>
            <div className="font-medium text-[#59413d]">Countries Tuning In</div>
          </div>
          <div className="mt-4 h-1.5 w-full overflow-hidden rounded-full bg-black/5">
            <div className="h-full bg-blue-600 transition-all duration-500" style={{ width: `${Math.min(((rows.length + 5) / 80) * 100, 100)}%` }} />
          </div>
          <span className="absolute -bottom-4 -right-4 text-9xl text-[#5e5e5e]/10">◍</span>
        </div>
        <div className="group relative flex h-48 flex-col justify-between overflow-hidden rounded-3xl bg-[#ebe0de] p-8">
          <span className="text-xs font-bold uppercase tracking-widest text-[#57504f]">Archive</span>
          <div>
            <div className="text-4xl font-extrabold text-[#1f1a1a]">{rows.length.toLocaleString()}</div>
            <div className="font-medium text-[#4c4544]">Total Uploaded Items</div>
          </div>
          <div className="mt-4 h-1.5 w-full overflow-hidden rounded-full bg-black/5">
            <div className="h-full bg-emerald-600 transition-all duration-500" style={{ width: `${Math.min((rows.length / 100) * 100, 100)}%` }} />
          </div>
          <span className="absolute -bottom-4 -right-4 text-9xl text-[#57504f]/10">▣</span>
        </div>
      </section>

      <div className="rounded-[2rem] bg-[#f6f3f2] p-4 lg:p-8">
        <div className="overflow-x-auto">
          <table className="w-full border-separate border-spacing-y-3">
            <thead>
              <tr className="text-left text-sm uppercase tracking-widest text-[#59413d]">
                <th className="px-6 pb-4 font-semibold">Sermon Details</th>
                <th className="px-6 pb-4 font-semibold">Speaker</th>
                <th className="px-6 pb-4 text-center font-semibold">Date</th>
                <th className="px-6 pb-4 text-center font-semibold">Format</th>
                <th className="px-6 pb-4 text-right font-semibold">Actions</th>
              </tr>
            </thead>
            <tbody>
              {filteredRows.map((row) => (
                <tr key={row.title} className="group rounded-2xl bg-white shadow-sm transition-all hover:shadow-md">
                  <td className="rounded-l-2xl px-6 py-5">
                    <div className="flex items-center gap-4">
                      <div className="h-12 w-12 flex-shrink-0 overflow-hidden rounded-xl bg-[#eae7e7]">
                        <img className="h-full w-full object-cover" src={row.image} />
                      </div>
                      <div>
                        <div className="font-bold text-[#1c1b1b] transition-colors group-hover:text-[#9e2016]">{row.title}</div>
                        <div className="text-sm text-[#59413d]">{row.subtitle}</div>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-5">
                    <div className="flex items-center gap-3">
                      <div className="flex h-8 w-8 items-center justify-center rounded-full bg-[#ffdad5] text-xs font-bold text-[#9e2016]">{row.avatar}</div>
                      <span className="font-medium text-[#1c1b1b]">{row.speaker}</span>
                    </div>
                  </td>
                  <td className="px-6 py-5 text-center">
                    <span className="text-sm font-medium text-[#59413d]">{row.date}</span>
                  </td>
                  <td className="px-6 py-5">
                    <div className="flex justify-center gap-2">
                      {row.media.map((m) => (
                        <span key={m} className="rounded-lg bg-[#f6f3f2] p-1.5 text-lg">
                          {m}
                        </span>
                      ))}
                    </div>
                  </td>
                  <td className="rounded-r-2xl px-6 py-5 text-right">
                    <button className="rounded-full p-2 text-[#8d706c] transition-colors hover:bg-[#eae7e7]" onClick={() => setNotice(`Actions for "${row.title}" opened.`)}>⋮</button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        <div className="mt-8 flex flex-col items-center justify-between gap-4 bg-[#fcf9f8] px-2 pt-6 md:flex-row">
          <p className="text-sm text-[#59413d]">
            Showing <span className="font-bold text-[#1c1b1b]">{Math.min(filteredRows.length, 4)}</span> of {filteredRows.length} sermons
          </p>
          <div className="flex items-center gap-2">
            <button className="flex h-10 w-10 items-center justify-center rounded-full bg-[#e5e2e1] text-[#1c1b1b]" onClick={() => setNotice('Previous page')}>‹</button>
            <button className="flex h-10 w-10 items-center justify-center rounded-full bg-[#9e2016] font-bold text-white">1</button>
            <button className="flex h-10 w-10 items-center justify-center rounded-full text-[#59413d] hover:bg-[#e5e2e1]" onClick={() => setNotice('Page 2')}>2</button>
            <button className="flex h-10 w-10 items-center justify-center rounded-full text-[#59413d] hover:bg-[#e5e2e1]" onClick={() => setNotice('Page 3')}>3</button>
            <span className="px-2">...</span>
            <button className="flex h-10 w-10 items-center justify-center rounded-full text-[#59413d] hover:bg-[#e5e2e1]" onClick={() => setNotice('Page 32')}>32</button>
            <button className="flex h-10 w-10 items-center justify-center rounded-full bg-[#e5e2e1] text-[#1c1b1b]" onClick={() => setNotice('Next page')}>›</button>
          </div>
        </div>
      </div>

      {uploadOpen && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/60 p-4 backdrop-blur-sm">
          <div className="w-full max-w-3xl overflow-hidden rounded-3xl bg-white shadow-2xl transition-all">
            {/* Modal Header */}
            <div className="flex items-center justify-between border-b border-neutral-100 px-8 py-6">
              <h2 className="text-2xl font-extrabold tracking-tight text-[#1c1b1b]">Upload New Sermon</h2>
              <button className="rounded-full p-2 hover:bg-neutral-100" onClick={() => setUploadOpen(false)}>
                <span className="material-symbols-outlined text-[#8d706c]">close</span>
              </button>
            </div>
            {/* Modal Body / Form */}
            <div className="scrollbar-hide max-h-[60vh] overflow-y-auto px-8 py-8">
              <form className="space-y-6" id="sermon-form" onSubmit={addSermon}>
                <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
                  {/* Sermon Title */}
                  <div className="space-y-2 md:col-span-2">
                    <label className="ml-1 text-sm font-bold uppercase tracking-wider text-[#59413d]">Sermon Title</label>
                    <input
                      className="w-full rounded-xl border-none bg-[#f6f3f2] px-4 py-3.5 transition-all focus:bg-white focus:ring-2 focus:ring-[#9e2016]/20"
                      placeholder="Enter sermon title"
                      required
                      type="text"
                      value={form.title}
                      onChange={(e) => setForm({ ...form, title: e.target.value })}
                    />
                  </div>
                  {/* Speaker Name */}
                  <div className="space-y-2">
                    <label className="ml-1 text-sm font-bold uppercase tracking-wider text-[#59413d]">Speaker Name</label>
                    <input
                      className="w-full rounded-xl border-none bg-[#f6f3f2] px-4 py-3.5 transition-all focus:bg-white focus:ring-2 focus:ring-[#9e2016]/20"
                      placeholder="e.g. Pastor John Doe"
                      required
                      type="text"
                      value={form.speaker}
                      onChange={(e) => setForm({ ...form, speaker: e.target.value })}
                    />
                  </div>
                  {/* Sermon Series */}
                  <div className="space-y-2">
                    <label className="ml-1 text-sm font-bold uppercase tracking-wider text-[#59413d]">Sermon Series</label>
                    <input
                      className="w-full rounded-xl border-none bg-[#f6f3f2] px-4 py-3.5 transition-all focus:bg-white focus:ring-2 focus:ring-[#9e2016]/20"
                      placeholder="e.g. Walking in Faith"
                      type="text"
                      value={form.series}
                      onChange={(e) => setForm({ ...form, series: e.target.value })}
                    />
                  </div>
                  {/* Service Date */}
                  <div className="space-y-2">
                    <label className="ml-1 text-sm font-bold uppercase tracking-wider text-[#59413d]">Service Date</label>
                    <input
                      className="w-full rounded-xl border-none bg-[#f6f3f2] px-4 py-3.5 text-[#59413d] transition-all focus:bg-white focus:ring-2 focus:ring-[#9e2016]/20"
                      type="date"
                      value={form.date}
                      onChange={(e) => setForm({ ...form, date: e.target.value })}
                    />
                  </div>
                  {/* Scripture Reference */}
                  <div className="space-y-2">
                    <label className="ml-1 text-sm font-bold uppercase tracking-wider text-[#59413d]">Scripture Reference</label>
                    <input
                      className="w-full rounded-xl border-none bg-[#f6f3f2] px-4 py-3.5 transition-all focus:bg-white focus:ring-2 focus:ring-[#9e2016]/20"
                      placeholder="e.g. John 3:16"
                      type="text"
                      value={form.scripture}
                      onChange={(e) => setForm({ ...form, scripture: e.target.value })}
                    />
                  </div>
                </div>
                {/* Sermon Type (Chips) */}
                <div className="space-y-3">
                  <label className="ml-1 text-sm font-bold uppercase tracking-wider text-[#59413d]">Sermon Type</label>
                  <div className="flex flex-wrap gap-3">
                    {['Video', 'Audio', 'Text'].map((type) => (
                      <label
                        key={type}
                        className={`flex cursor-pointer items-center gap-2 rounded-full border border-transparent px-4 py-2 transition-colors hover:bg-[#eae7e7] ${
                          form.type === type ? 'border-[#9e2016] bg-[#ffdad5]' : 'bg-[#f6f3f2]'
                        }`}
                      >
                        <input className="hidden" name="type" type="radio" value={type} checked={form.type === type} onChange={(e) => setForm({ ...form, type: e.target.value })} />
                        <span className="material-symbols-outlined text-lg">
                          {type === 'Video' ? 'videocam' : type === 'Audio' ? 'headset' : 'description'}
                        </span>
                        <span className="font-medium">{type}</span>
                      </label>
                    ))}
                  </div>
                </div>

                <div className="space-y-2">
                  <label className="ml-1 text-sm font-bold uppercase tracking-wider text-[#59413d]">Thumbnail Image</label>
                  <div className="flex items-center gap-4">
                    {form.thumbnail_url && (
                      <img src={form.thumbnail_url} className="w-16 h-16 rounded-xl object-cover border border-neutral-200" />
                    )}
                    <div className="flex-1 relative">
                      <input
                        type="file"
                        accept="image/*"
                        className="hidden"
                        id="thumbnail-upload"
                        onChange={async (e) => {
                          const file = e.target.files?.[0];
                          if (file) {
                            setUploading(true);
                            const url = await uploadChurchAsset(file);
                            if (url) setForm({ ...form, thumbnail_url: url });
                            setUploading(false);
                          }
                        }}
                      />
                      <label 
                        htmlFor="thumbnail-upload"
                        className="flex items-center justify-center gap-2 w-full rounded-xl border-2 border-dashed border-[#8d706c]/30 py-4 px-4 text-sm font-bold text-[#59413d] cursor-pointer hover:bg-[#f6f3f2] transition-all"
                      >
                        <span className="material-symbols-outlined">{uploading ? 'sync' : 'image'}</span>
                        {uploading ? 'Uploading...' : form.thumbnail_url ? 'Change Image' : 'Click to Upload Thumbnail'}
                      </label>
                    </div>
                  </div>
                </div>

                {/* File Upload / URL */}
                <div className="space-y-2">
                  <label className="ml-1 text-sm font-bold uppercase tracking-wider text-[#59413d]">Media Content URL</label>
                  <div className="flex gap-2">
                    <input
                      className="flex-1 rounded-xl border-none bg-[#f6f3f2] px-4 py-3.5 transition-all focus:bg-white focus:ring-2 focus:ring-[#9e2016]/20"
                      placeholder="Enter YouTube or Audio URL"
                      type="text"
                      value={form.mediaUrl}
                      onChange={(e) => setForm({ ...form, mediaUrl: e.target.value })}
                    />
                  </div>
                </div>
                {/* Description */}
                <div className="space-y-2">
                  <label className="ml-1 text-sm font-bold uppercase tracking-wider text-[#59413d]">Description / Notes</label>
                  <textarea
                    className="w-full resize-none rounded-xl border-none bg-[#f6f3f2] px-4 py-3.5 transition-all focus:bg-white focus:ring-2 focus:ring-[#9e2016]/20"
                    placeholder="Add internal notes or public description..."
                    rows={3}
                    value={form.description}
                    onChange={(e) => setForm({ ...form, description: e.target.value })}
                  />
                </div>
              </form>
            </div>
            {/* Modal Footer */}
            <div className="flex flex-col gap-3 bg-[#f6f3f2]/50 px-8 py-6 md:flex-row">
              <button
                className="flex-1 rounded-2xl bg-[#c0392b] py-4 text-lg font-extrabold text-white shadow-xl shadow-red-900/20 transition-all active:scale-95"
                form="sermon-form"
                type="submit"
              >
                Save Sermon
              </button>
              <button className="px-8 py-4 font-bold text-[#59413d] transition-colors hover:text-[#1c1b1b]" onClick={() => setUploadOpen(false)} type="button">
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}
    </main>
  );
}
