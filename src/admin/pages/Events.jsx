import { useState, useEffect } from 'react';
import { supabase } from '../../lib/supabase';
import { uploadChurchAsset } from '../../lib/storage';

export default function Events() {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [notice, setNotice] = useState('');
  const [uploading, setUploading] = useState(false);
  const [form, setForm] = useState({
    title: '',
    date: '',
    time: '',
    location: '',
    description: '',
    category: 'General',
    image_url: ''
  });

  useEffect(() => {
    fetchEvents();
    fetchMemberStats();

    // Subscribe to events
    const eventChannel = supabase
      .channel('admin_events_sync')
      .on('postgres_changes', { event: '*', schema: 'public', table: 'events' }, () => {
        fetchEvents();
      })
      .subscribe();

    // Subscribe to members for registration counts
    const memberChannel = supabase
      .channel('admin_event_member_sync')
      .on('postgres_changes', { event: '*', schema: 'public', table: 'members' }, () => {
        fetchMemberStats();
      })
      .subscribe();

    return () => {
      supabase.removeChannel(eventChannel);
      supabase.removeChannel(memberChannel);
    };
  }, []);

  const [memberStats, setMemberStats] = useState({
    total: 0,
    visitors: 0
  });

  const fetchMemberStats = async () => {
    const { data: mData } = await supabase.from('members').select('category');
    if (mData) {
      setMemberStats({
        total: mData.length,
        visitors: mData.filter(m => m.category === 'Visitor').length
      });
    }
  };

  const fetchEvents = async () => {
    setLoading(true);
    const { data, error } = await supabase
      .from('events')
      .select('*')
      .order('date', { ascending: true });
    
    if (error) {
      setNotice('Error fetching events: ' + error.message);
    } else {
      setEvents(data);
    }
    setLoading(false);
  };

  const handleSaveEvent = async (e) => {
    e.preventDefault();
    const { error } = await supabase
      .from('events')
      .insert([form]);

    if (error) {
      setNotice('Error saving event: ' + error.message);
    } else {
      setNotice('Event saved successfully.');
      fetchEvents();
      setIsModalOpen(false);
      setForm({ title: '', date: '', time: '', location: '', description: '', category: 'General', image_url: '' });
    }
  };

  return (
    <main className="pb-12 px-4 sm:px-8 max-w-screen-2xl mx-auto">
      {/* Hero Section */}
      <header className="mb-10 flex flex-col md:flex-row justify-between items-end gap-6 pt-8">
        <div className="max-w-2xl">
          <h1 className="text-4xl font-extrabold tracking-tight text-[#1c1b1b] mb-2 font-headline">Events Management</h1>
          <p className="text-[#5e5e5e] body-md font-body">Manage your congregational gatherings, track attendance, and schedule future spiritual sessions in one central sanctuary.</p>
        </div>
        <div className="flex gap-3">
          <div className="flex -space-x-3">
            <div className="w-10 h-10 rounded-full border-2 border-white bg-[#e5e1e1] flex items-center justify-center text-xs font-bold">+12</div>
          </div>
        </div>
      </header>

      {/* Stat Cards Section */}
      <section className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
        {/* Total Events */}
        <div className="bg-white p-8 rounded-xl shadow-sm border border-neutral-100 flex flex-col justify-between group hover:shadow-md transition-shadow">
          <div className="flex justify-between items-start mb-6">
            <div className="p-3 rounded-xl bg-[#ffdad5] text-[#9e2016]">
              <span className="material-symbols-outlined" style={{ fontVariationSettings: "'FILL' 1" }}>list_alt</span>
            </div>
            <span className="text-xs font-bold text-green-600 bg-green-50 px-2 py-1 rounded-full">+2 this mo.</span>
          </div>
          <div>
            <h3 className="text-[#5e5e5e] text-sm mb-1 font-medium font-body">Total Events</h3>
            <div className="flex items-baseline gap-2">
              <span className="text-4xl font-extrabold text-[#1c1b1b] tracking-tighter font-headline">{events.length}</span>
            </div>
            <div className="mt-4 h-1.5 w-full overflow-hidden rounded-full bg-neutral-100">
              <div className="h-full bg-blue-500 transition-all duration-500" style={{ width: `${Math.min((events.length / 50) * 100, 100)}%` }} />
            </div>
          </div>
        </div>

        {/* Upcoming This Month */}
        <div className="bg-white p-8 rounded-xl shadow-sm border border-neutral-100 flex flex-col justify-between group hover:shadow-md transition-shadow">
          <div className="flex justify-between items-start mb-6">
            <div className="p-3 rounded-xl bg-blue-100 text-blue-800">
              <span className="material-symbols-outlined" style={{ fontVariationSettings: "'FILL' 1" }}>calendar_month</span>
            </div>
            <span className="text-xs font-bold text-[#5e5e5e] bg-neutral-100 px-2 py-1 rounded-full">Active</span>
          </div>
          <div>
            <h3 className="text-[#5e5e5e] text-sm mb-1 font-medium font-body">Upcoming This Month</h3>
            <div className="flex items-baseline gap-2">
              <span className="text-4xl font-extrabold text-[#1c1b1b] tracking-tighter font-headline">
                {events.filter(e => new Date(e.date) > new Date()).length.toString().padStart(2, '0')}
              </span>
              <span className="text-sm text-[#5e5e5e]">active</span>
            </div>
            <div className="mt-4 h-1.5 w-full overflow-hidden rounded-full bg-neutral-100">
              <div className="h-full bg-indigo-500 transition-all duration-500" style={{ width: `${Math.min((events.filter(e => new Date(e.date) > new Date()).length / 10) * 100, 100)}%` }} />
            </div>
          </div>
        </div>

        {/* Attendance Rate */}
        <div className="bg-white p-8 rounded-xl shadow-sm border border-neutral-100 flex flex-col justify-between group hover:shadow-md transition-shadow">
          <div className="flex justify-between items-start mb-6">
            <div className="p-3 rounded-xl bg-orange-100 text-orange-800">
              <span className="material-symbols-outlined" style={{ fontVariationSettings: "'FILL' 1" }}>trending_up</span>
            </div>
          </div>
          <div>
            <h3 className="text-[#5e5e5e] text-sm mb-1 font-medium font-body">Attendance Rate</h3>
            <div className="flex items-baseline gap-2">
              <span className="text-4xl font-extrabold text-[#1c1b1b] tracking-tighter font-headline">{memberStats.total > 0 ? '82%' : '0%'}</span>
              <span className="text-sm text-[#5e5e5e]">avg. weekly</span>
            </div>
            <div className="mt-4 h-1.5 w-full overflow-hidden rounded-full bg-neutral-100">
              <div className="h-full bg-orange-500 transition-all duration-500" style={{ width: memberStats.total > 0 ? '82%' : '0%' }} />
            </div>
          </div>
        </div>

        {/* Pending Registrations */}
        <div className="bg-white p-8 rounded-xl shadow-sm border border-neutral-100 flex flex-col justify-between group hover:shadow-md transition-shadow">
          <div className="flex justify-between items-start mb-6">
            <div className="p-3 rounded-xl bg-purple-100 text-purple-800">
              <span className="material-symbols-outlined" style={{ fontVariationSettings: "'FILL' 1" }}>person_add</span>
            </div>
            {memberStats.visitors > 0 && <span className="animate-pulse flex h-2 w-2 rounded-full bg-[#9e2016]"></span>}
          </div>
          <div>
            <h3 className="text-[#5e5e5e] text-sm mb-1 font-medium font-body">Visitor Registrations</h3>
            <div className="flex items-baseline gap-2">
              <span className="text-4xl font-extrabold text-[#9e2016] tracking-tighter font-headline">{memberStats.visitors}</span>
              <span className="text-sm text-[#5e5e5e]">new entries</span>
            </div>
            <div className="mt-4 h-1.5 w-full overflow-hidden rounded-full bg-neutral-100">
              <div className="h-full bg-rose-500 transition-all duration-500" style={{ width: `${Math.min((memberStats.visitors / 10) * 100, 100)}%` }} />
            </div>
          </div>
        </div>
      </section>

      {/* Main Content Area: Two Columns */}
      <section className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Left Column: Recent Events Feed */}
        <div className="lg:col-span-2 bg-white rounded-2xl shadow-sm border border-neutral-100 overflow-hidden">
          <div className="p-8 border-b border-neutral-100 flex justify-between items-center bg-white">
            <h2 className="text-xl font-bold tracking-tight font-headline">Recent Events Feed</h2>
            <button className="text-[#9e2016] text-sm font-bold flex items-center gap-1 hover:underline">
              View All Activity <span className="material-symbols-outlined text-sm">arrow_forward</span>
            </button>
          </div>
          <div className="flex flex-col">
            {loading ? (
              <div className="p-12 text-center text-neutral-400">Loading events...</div>
            ) : events.length > 0 ? (
              events.map((event) => (
                <div key={event.id} className="p-6 flex items-start gap-6 hover:bg-neutral-50 transition-colors border-b border-neutral-100/50">
                  <div className={`w-12 h-12 rounded-xl flex items-center justify-center flex-shrink-0 overflow-hidden ${event.is_featured ? 'bg-[#ffdad5] text-[#9e2016]' : 'bg-blue-100 text-blue-700'}`}>
                    {event.image_url ? (
                      <img src={event.image_url} className="w-full h-full object-cover" />
                    ) : (
                      <span className="material-symbols-outlined" style={{ fontVariationSettings: "'FILL' 1" }}>
                        {event.is_featured ? 'celebration' : 'event'}
                      </span>
                    )}
                  </div>
                  <div className="flex-grow">
                    <div className="flex justify-between items-start mb-1">
                      <p className="text-[#1c1b1b] font-medium font-body"><span className="font-bold">{event.title}</span> on {new Date(event.date).toLocaleDateString()}</p>
                      <span className={`text-[10px] font-bold px-2 py-1 rounded-full uppercase tracking-widest ${new Date(event.date) > new Date() ? 'text-green-600 bg-green-50' : 'text-[#5e5e5e] bg-neutral-100'}`}>
                        {new Date(event.date) > new Date() ? 'Upcoming' : 'Past'}
                      </span>
                    </div>
                    <p className="text-[#5e5e5e] text-sm mb-3">{event.location} • {event.time}. {event.description}</p>
                    <div className="flex items-center gap-4">
                      <span className="text-xs text-[#5e5e5e] bg-neutral-100 px-2 py-0.5 rounded">Category: {event.category}</span>
                      <button 
                        onClick={async () => {
                          await supabase.from('events').delete().eq('id', event.id);
                          fetchEvents();
                        }}
                        className="text-xs font-bold text-[#ba1a1a] flex items-center gap-1"
                      >
                        Delete Event
                      </button>
                    </div>
                  </div>
                </div>
              ))
            ) : (
              <div className="p-12 text-center text-neutral-400">No events found.</div>
            )}
          </div>
        </div>

        {/* Right Column */}
        <div className="flex flex-col gap-6">
          {/* Quick Actions Card */}
          <div className="bg-[#9e2016] text-white p-8 rounded-2xl shadow-lg relative overflow-hidden">
            <div className="relative z-10">
              <h3 className="text-xl font-bold mb-4 leading-tight font-headline">Quick Actions</h3>
              <div className="flex flex-col gap-3">
                <button 
                  onClick={() => setIsModalOpen(true)}
                  className="w-full bg-white/10 hover:bg-white/20 transition-colors py-3 px-4 rounded-xl flex items-center justify-between text-sm font-bold"
                >
                  Create New Event
                  <span className="material-symbols-outlined">add_circle</span>
                </button>
                <button className="w-full bg-white/10 hover:bg-white/20 transition-colors py-3 px-4 rounded-xl flex items-center justify-between text-sm font-bold">
                  Upload Event Media
                  <span className="material-symbols-outlined">cloud_upload</span>
                </button>
                <button className="w-full bg-white text-[#9e2016] py-3 px-4 rounded-xl flex items-center justify-between text-sm font-extrabold shadow-sm">
                  Export Attendance
                  <span className="material-symbols-outlined">download_2</span>
                </button>
              </div>
            </div>
            <span className="material-symbols-outlined absolute -bottom-4 -right-4 text-9xl opacity-10 rotate-12" style={{ fontVariationSettings: "'FILL' 1" }}>event</span>
          </div>

          {/* Ministry Resources */}
          <div className="bg-white p-6 rounded-2xl shadow-sm border border-neutral-100">
            <h3 className="text-[#1c1b1b] font-bold mb-3 font-headline">Ministry Resources</h3>
            <p className="text-[#5e5e5e] text-sm mb-6 font-body">Learn how to manage recurrences and attendee registration for specialized church events.</p>
            <button className="w-full border-2 border-[#9e2016] text-[#9e2016] font-bold py-2.5 rounded-xl hover:bg-[#9e2016]/5 transition-colors">
              View Tutorial
            </button>
          </div>
        </div>
      </section>

      {/* Add Event Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-[100] bg-black/40 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl w-full max-w-3xl shadow-2xl relative overflow-hidden">
            <div className="p-8">
              <div className="flex justify-between items-center mb-8">
                <h2 className="text-2xl font-bold text-[#1c1b1b] font-headline">Add Event</h2>
                <button 
                  onClick={() => setIsModalOpen(false)}
                  className="text-[#59413d] hover:text-[#1c1b1b] transition-colors"
                >
                  <span className="material-symbols-outlined">close</span>
                </button>
              </div>
              <form className="space-y-6" onSubmit={handleSaveEvent}>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {/* Left Column */}
                  <div className="space-y-4">
                    <div className="bg-neutral-50 rounded-2xl px-5 py-4 flex flex-col border border-transparent transition-all">
                      <label className="text-[10px] font-bold text-[#59413d] uppercase tracking-widest mb-1 font-body">Event Title</label>
                      <input 
                        className="bg-transparent border-none p-0 focus:ring-0 focus:outline-none text-[#1c1b1b] font-medium placeholder:text-[#59413d]/40" 
                        placeholder="Worship Night, Picnic, etc." 
                        required 
                        type="text" 
                        value={form.title}
                        onChange={(e) => setForm({...form, title: e.target.value})}
                      />
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                      <div className="bg-neutral-50 rounded-2xl px-5 py-4 flex flex-col border border-transparent transition-all">
                        <label className="text-[10px] font-bold text-[#59413d] uppercase tracking-widest mb-1 font-body">Date</label>
                        <input 
                          className="bg-transparent border-none p-0 focus:ring-0 focus:outline-none text-[#1c1b1b] font-medium" 
                          required 
                          type="date" 
                          value={form.date}
                          onChange={(e) => setForm({...form, date: e.target.value})}
                        />
                      </div>
                      <div className="bg-neutral-50 rounded-2xl px-5 py-4 flex flex-col border border-transparent transition-all">
                        <label className="text-[10px] font-bold text-[#59413d] uppercase tracking-widest mb-1 font-body">Time</label>
                        <input 
                          className="bg-transparent border-none p-0 focus:ring-0 focus:outline-none text-[#1c1b1b] font-medium" 
                          required 
                          type="time" 
                          value={form.time}
                          onChange={(e) => setForm({...form, time: e.target.value})}
                        />
                      </div>
                    </div>
                    <div className="bg-neutral-50 rounded-2xl px-5 py-4 flex flex-col border border-transparent transition-all">
                      <label className="text-[10px] font-bold text-[#59413d] uppercase tracking-widest mb-1 font-body">Location</label>
                      <input 
                        className="bg-transparent border-none p-0 focus:ring-0 focus:outline-none text-[#1c1b1b] font-medium placeholder:text-[#59413d]/40" 
                        placeholder="e.g. Main Sanctuary" 
                        required 
                        type="text" 
                        value={form.location}
                        onChange={(e) => setForm({...form, location: e.target.value})}
                      />
                    </div>
                  </div>

                  {/* Right Column */}
                  <div className="space-y-4">
                    <div className="bg-neutral-50 rounded-2xl px-5 py-4 flex flex-col border border-transparent transition-all">
                      <label className="text-[10px] font-bold text-[#59413d] uppercase tracking-widest mb-1 font-body">Event Poster / Image</label>
                      <div className="flex items-center gap-4 mt-1">
                        {form.image_url && <img src={form.image_url} className="w-12 h-12 rounded-lg object-cover" />}
                        <input 
                          type="file" 
                          accept="image/*" 
                          className="hidden" 
                          id="event-image" 
                          onChange={async (e) => {
                            const file = e.target.files?.[0];
                            if (file) {
                              setUploading(true);
                              const url = await uploadChurchAsset(file);
                              if (url) setForm({...form, image_url: url});
                              setUploading(false);
                            }
                          }}
                        />
                        <label htmlFor="event-image" className="cursor-pointer text-xs font-bold text-[#9e2016] border border-[#9e2016] px-4 py-2 rounded-xl hover:bg-[#9e2016] hover:text-white transition-all">
                          {uploading ? 'Uploading...' : form.image_url ? 'Change Image' : 'Upload Image'}
                        </label>
                      </div>
                    </div>
                    <div className="bg-neutral-50 rounded-2xl px-5 py-4 flex flex-col border border-transparent transition-all">
                      <label className="text-[10px] font-bold text-[#59413d] uppercase tracking-widest mb-1 font-body">Description</label>
                      <textarea 
                        className="bg-transparent border-none p-0 focus:ring-0 focus:outline-none text-[#1c1b1b] font-medium placeholder:text-[#59413d]/40 resize-none h-[84px]" 
                        placeholder="Tell us more about the event..." 
                        value={form.description}
                        onChange={(e) => setForm({...form, description: e.target.value})}
                      ></textarea>
                    </div>
                  </div>
                </div>
                <button 
                  type="submit"
                  className="w-full bg-[#9e2016] text-white py-4 rounded-2xl font-bold text-lg shadow-lg hover:opacity-90 transition-opacity mt-4 font-headline"
                >
                  Save Event
                </button>
              </form>
            </div>
          </div>
        </div>
      )}

      {/* Floating Action Button */}
      <button 
        onClick={() => setIsModalOpen(true)}
        className="fixed bottom-8 right-8 w-16 h-16 bg-[#9e2016] text-white rounded-full shadow-2xl flex items-center justify-center hover:scale-105 active:scale-95 transition-all z-40"
      >
        <span className="material-symbols-outlined text-3xl">add</span>
      </button>
    </main>
  );
}
