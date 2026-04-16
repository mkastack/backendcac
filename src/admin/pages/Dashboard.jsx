import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { supabase } from '../../lib/supabase';

export default function Dashboard() {
  const navigate = useNavigate();
  const [stats, setStats] = useState({
    members: 0,
    donations: 0,
    events: 0,
    prayers: 0,
    sermons: 0,
    blog: 0
  });
  const [loading, setLoading] = useState(true);
  const [recentActivity, setRecentActivity] = useState([]);
  const [ministries, setMinistries] = useState([]);
  const [whatsappNotifications, setWhatsappNotifications] = useState([]);
  const [greeting, setGreeting] = useState({ text: '', emoji: '', time: '' });

  const updateGreeting = () => {
    const now = new Date();
    const hour = now.getHours();
    const timeStr = now.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit', second: '2-digit' });
    const dateStr = now.toLocaleDateString('en-US', { weekday: 'long', month: 'long', day: 'numeric', year: 'numeric' });
    let text, emoji;
    if (hour >= 5 && hour < 12) { text = 'Good Morning'; emoji = '🌅'; }
    else if (hour >= 12 && hour < 17) { text = 'Good Afternoon'; emoji = '☀️'; }
    else if (hour >= 17 && hour < 21) { text = 'Good Evening'; emoji = '🌇'; }
    else { text = 'Good Night'; emoji = '🌙'; }
    setGreeting({ text, emoji, time: timeStr, date: dateStr });
  };

  useEffect(() => {
    updateGreeting();
    const clockInterval = setInterval(updateGreeting, 1000);
    fetchStats();
    fetchRecentActivity();
    fetchMinistries();
    fetchWhatsAppNotifications();

    // Set up Realtime subscriptions for all relevant tables
    const tables = ['members', 'donations', 'events', 'prayer_requests', 'sermons', 'blog_posts', 'ministries', 'whatsapp_notifications'];
    const channel = supabase.channel('dashboard_stats_sync');
    
    tables.forEach(table => {
      channel.on('postgres_changes', { event: '*', schema: 'public', table }, () => {
        fetchStats();
        fetchRecentActivity();
        fetchMinistries();
        fetchWhatsAppNotifications();
      });
    });

    channel.subscribe();

    return () => {
      clearInterval(clockInterval);
      supabase.removeChannel(channel);
    };
  }, []);

  async function fetchStats() {
    // 1. Members count
    const { count: membersCount } = await supabase.from('members').select('*', { count: 'exact', head: true });
    
    // 2. Donations total
    const { data: donationsData } = await supabase.from('donations').select('amount');
    const donationsTotal = donationsData?.reduce((acc, curr) => acc + (curr.amount || 0), 0) || 0;

    // 3. Upcoming Events
    const { count: eventsCount } = await supabase.from('events').select('*', { count: 'exact', head: true });

    // 4. Pending prayers
    const { count: prayersCount } = await supabase.from('prayer_requests').select('*', { count: 'exact', head: true });

    // 5. Sermons
    const { count: sermonsCount } = await supabase.from('sermons').select('*', { count: 'exact', head: true });

    // 6. Blog
    const { count: blogCount } = await supabase.from('blog_posts').select('*', { count: 'exact', head: true });

    setStats({
      members: membersCount || 0,
      donations: donationsTotal,
      events: eventsCount || 0,
      prayers: prayersCount || 0,
      sermons: sermonsCount || 0,
      blog: blogCount || 0
    });
    setLoading(false);
  }

  async function fetchRecentActivity() {
    const activities = [];

    // Fetch latest prayer requests
    const { data: prayers } = await supabase.from('prayer_requests').select('*').order('created_at', { ascending: false }).limit(3);
    if (prayers) {
      prayers.forEach(p => {
        const isTestimony = p.status === 'Testimony';
        activities.push({
          type: isTestimony ? 'testimony' : 'prayer',
          icon: isTestimony ? 'campaign' : 'volunteer_activism',
          iconBg: isTestimony ? 'bg-yellow-100 text-yellow-700' : 'bg-purple-100 text-purple-700',
          title: p.name,
          action: isTestimony ? 'shared a testimony.' : 'submitted a prayer request.',
          detail: `"${(p.request || '').substring(0, 80)}..."`,
          time: p.created_at,
          id: p.id
        });
      });
    }

    // Fetch latest sermons
    const { data: sermons } = await supabase.from('sermons').select('*').order('created_at', { ascending: false }).limit(2);
    if (sermons) {
      sermons.forEach(s => activities.push({
        type: 'sermon',
        icon: 'auto_stories',
        iconBg: 'bg-emerald-100 text-emerald-700',
        title: 'Admin Portal',
        action: 'published a new sermon.',
        detail: `"${s.title}" - ${s.speaker}`,
        time: s.created_at,
        id: s.id
      }));
    }

    // Fetch latest donations
    const { data: donations } = await supabase.from('donations').select('*').order('created_at', { ascending: false }).limit(2);
    if (donations) {
      donations.forEach(d => activities.push({
        type: 'donation',
        icon: 'favorite',
        iconBg: 'bg-orange-100 text-orange-700',
        title: d.donor_name,
        action: `made a generous donation of GH₵${d.amount}.`,
        detail: `Allocated to: ${d.purpose || 'General Fund'}`,
        time: d.created_at,
        id: d.id
      }));
    }

    // Fetch latest members
    const { data: members } = await supabase.from('members').select('*').order('created_at', { ascending: false }).limit(2);
    if (members) {
      members.forEach(m => activities.push({
        type: 'member',
        icon: 'person_add',
        iconBg: 'bg-blue-100 text-blue-700',
        title: m.full_name,
        action: 'joined the congregation.',
        detail: `Category: ${m.category || 'Full Member'}`,
        time: m.created_at,
        id: m.id
      }));
    }

    // Sort all by time, newest first, take top 5
    activities.sort((a, b) => new Date(b.time) - new Date(a.time));
    setRecentActivity(activities.slice(0, 5));
  }

  async function fetchMinistries() {
    const { data } = await supabase.from('ministries').select('*').order('created_at', { ascending: false });
    if (data) setMinistries(data);
  }

  async function fetchWhatsAppNotifications() {
    const { data } = await supabase.from('whatsapp_notifications').select('*').order('created_at', { ascending: false }).limit(10);
    if (data) setWhatsappNotifications(data);
  }

  function timeAgo(dateStr) {
    const now = new Date();
    const past = new Date(dateStr);
    const diffMs = now - past;
    const diffMin = Math.floor(diffMs / 60000);
    if (diffMin < 1) return 'Just now';
    if (diffMin < 60) return `${diffMin} min ago`;
    const diffHr = Math.floor(diffMin / 60);
    if (diffHr < 24) return `${diffHr} hour${diffHr > 1 ? 's' : ''} ago`;
    const diffDay = Math.floor(diffHr / 24);
    return `${diffDay} day${diffDay > 1 ? 's' : ''} ago`;
  }
  return (
    <>
      <main className="mx-auto max-w-screen-2xl px-8 pb-12 pt-8">
        <header className="mb-10 flex flex-col items-end justify-between gap-6 md:flex-row">
          <div className="max-w-2xl">
            <div className="flex items-center gap-2 mb-1">
              {loading ? <Skeleton className="h-6 w-32" /> : (
                <>
                  <span className="text-2xl">{greeting.emoji}</span>
                  <span className="text-sm font-semibold text-[#9e2016] uppercase tracking-widest">{greeting.date}</span>
                </>
              )}
            </div>
            {loading ? <Skeleton className="h-10 w-64 mb-2" /> : (
              <h1 className="mb-2 text-4xl font-extrabold tracking-tight text-[#1c1b1b]">
                {greeting.text}, Admin!
              </h1>
            )}
            <p className="text-[#5e5e5e]">Here is what's happening across the congregation today. Your leadership and oversight guide our spiritual mission.</p>
          </div>
          <div className="flex flex-col items-end gap-2">
            <div className="font-mono text-3xl font-extrabold text-[#1c1b1b] tracking-tight tabular-nums">
              {greeting.time}
            </div>
            {!loading && (
              <div className="flex -space-x-3">
                <img className="h-10 w-10 rounded-full border-2 border-white" src="https://lh3.googleusercontent.com/aida-public/AB6AXuDJTZv_nXGQtr3ozI2hqNcBIlg9CoiFT6REG8fsmAhZxwEw7oDgan35ucLBhize0zt0o_iHYGp4QXGs5Feo37Z4OmpHGkmkidd4ggZrME7z9stTzYkgvDTTjgVIJIiIarLRlU3ndlQs7DnNNol9AOGhXbpa3FH0Ers1r0ReGXx0ePafCorAg_HJlTUL6EFHKTVJLLkWxqQWeP8NKWoke7fDQMd1S-lY9CAAO8P01ax9gkuYfcIn1q3K7p4OXdK18f2k2yUO3bRPDsSY" />
                <img className="h-10 w-10 rounded-full border-2 border-white" src="https://lh3.googleusercontent.com/aida-public/AB6AXuBTbd4RlYaQCFtbuOvHSVVsGi7qbbcbWVPRyDe1ZXnvwqVF4AcgQrsXi3Wafettd4TMHwvCOsqDByVMv4IKInHG5igNlM5B3j2xoFsPrnYr-jPc8aNQ1ApjuFxN-jhV6RSzD73oiiuXKucLVkqK-cZwaB2EZBGidtXU8pd9ectRrDD4KtHfH2lEAtmmnGw9ZG45RHMDJnHnNBPKp-q_AgyggHPgRuMBa4i3piJ8H6d3NGDttmDNeMU9hBDICCS59A4UOFsv0XoJrZvw" />
                <div className="flex h-10 w-10 items-center justify-center rounded-full border-2 border-white bg-[#e5e2e1] text-xs font-bold">+12</div>
              </div>
            )}
          </div>
        </header>

        <section className="mb-12 grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
          {loading ? (
             Array.from({ length: 6 }).map((_, i) => (
               <div key={i} className="rounded-xl bg-white p-8 shadow-sm border border-neutral-100 space-y-4">
                  <div className="flex justify-between">
                    <Skeleton className="h-10 w-10 rounded-xl" />
                    <Skeleton className="h-5 w-12 rounded-full" />
                  </div>
                  <Skeleton className="h-4 w-24" />
                  <Skeleton className="h-10 w-32" />
                  <Skeleton className="h-1.5 w-full rounded-full" />
               </div>
             ))
          ) : (
            <>
          <div className="group flex flex-col justify-between rounded-xl bg-white p-8 shadow-[0_12px_40px_rgba(28,27,27,0.06)] transition-shadow hover:shadow-[0_12px_40px_rgba(28,27,27,0.08)]">
            <div className="mb-6 flex items-start justify-between">
              <div className="rounded-xl bg-green-100 p-3 text-green-700">
                <span className="material-symbols-outlined" style={{ fontVariationSettings: "'FILL' 1" }}>groups</span>
              </div>
              <span className="rounded-full bg-green-50 px-2 py-1 text-xs font-bold text-green-600">+4.2%</span>
            </div>
            <div>
              <h3 className="mb-1 text-sm font-medium text-[#5e5e5e]">Total Members</h3>
              <div className="flex items-end justify-between">
                <span className="text-4xl font-extrabold tracking-tighter text-[#1c1b1b]">{stats.members.toLocaleString()}</span>
              </div>
              <div className="mt-4 h-1.5 w-full overflow-hidden rounded-full bg-neutral-100">
                <div className="h-full bg-green-500 transition-all duration-500" style={{ width: `${Math.min((stats.members / 1000) * 100, 100)}%` }} />
              </div>
            </div>
          </div>

          <div className="group flex flex-col justify-between rounded-xl bg-white p-8 shadow-[0_12px_40px_rgba(28,27,27,0.06)] transition-shadow hover:shadow-[0_12px_40px_rgba(28,27,27,0.08)]">
            <div className="mb-6 flex items-start justify-between">
              <div className="rounded-xl bg-orange-100 p-3 text-orange-800">
                <span className="material-symbols-outlined" style={{ fontVariationSettings: "'FILL' 1" }}>payments</span>
              </div>
              <span className="rounded-full bg-[#eae7e7] px-2 py-1 text-xs font-bold text-[#5e5e5e]">This Month</span>
            </div>
            <div>
              <h3 className="mb-1 text-sm font-medium text-[#5e5e5e]">Total Donations</h3>
              <div className="flex items-end justify-between">
                <span className="text-4xl font-extrabold tracking-tighter text-[#1c1b1b]">GH₵{stats.donations.toLocaleString()}</span>
              </div>
              <div className="mt-4 h-1.5 w-full overflow-hidden rounded-full bg-neutral-100">
                <div className="h-full bg-orange-500 transition-all duration-500" style={{ width: `${Math.min((stats.donations / 10000) * 100, 100)}%` }} />
              </div>
            </div>
          </div>

          <div className="group flex flex-col justify-between rounded-xl bg-white p-8 shadow-[0_12px_40px_rgba(28,27,27,0.06)] transition-shadow hover:shadow-[0_12px_40px_rgba(28,27,27,0.08)]">
            <div className="mb-6 flex items-start justify-between">
              <div className="rounded-xl bg-blue-100 p-3 text-blue-800">
                <span className="material-symbols-outlined" style={{ fontVariationSettings: "'FILL' 1" }}>calendar_month</span>
              </div>
              <div className="flex -space-x-2">
                <div className="h-6 w-6 rounded-full border-2 border-white bg-blue-500" />
                <div className="h-6 w-6 rounded-full border-2 border-white bg-blue-400" />
              </div>
            </div>
            <div>
              <h3 className="mb-1 text-sm font-medium text-[#5e5e5e]">Upcoming Events</h3>
              <div className="flex items-baseline gap-2">
                <span className="text-4xl font-extrabold tracking-tighter text-[#1c1b1b]">{stats.events.toString().padStart(2, '0')}</span>
                <span className="text-sm text-[#5e5e5e]">active events</span>
              </div>
              <div className="mt-4 h-1.5 w-full overflow-hidden rounded-full bg-neutral-100">
                <div className="h-full bg-blue-500 transition-all duration-500" style={{ width: `${Math.min((stats.events / 20) * 100, 100)}%` }} />
              </div>
            </div>
          </div>

          <div className="group flex flex-col justify-between rounded-xl bg-white p-8 shadow-[0_12px_40px_rgba(28,27,27,0.06)] transition-shadow hover:shadow-[0_12px_40px_rgba(28,27,27,0.08)]">
            <div className="mb-6 flex items-start justify-between">
              <div className="rounded-xl bg-purple-100 p-3 text-purple-800">
                <span className="material-symbols-outlined" style={{ fontVariationSettings: "'FILL' 1" }}>volunteer_activism</span>
              </div>
              <span className="flex h-2 w-2 animate-pulse rounded-full bg-[#9e2016]" />
            </div>
            <div>
              <h3 className="mb-1 text-sm font-medium text-[#5e5e5e]">Pending Prayer Requests</h3>
              <div className="flex items-baseline gap-2">
                <span className="text-4xl font-extrabold tracking-tighter text-[#9e2016]">{stats.prayers}</span>
                <span className="text-sm text-[#5e5e5e]">urgent focus</span>
              </div>
              <div className="mt-4 h-1.5 w-full overflow-hidden rounded-full bg-neutral-100">
                <div className="h-full bg-[#9e2016] transition-all duration-500" style={{ width: `${Math.min((stats.prayers / 50) * 100, 100)}%` }} />
              </div>
            </div>
          </div>

          <div className="group flex flex-col justify-between rounded-xl bg-white p-8 shadow-[0_12px_40px_rgba(28,27,27,0.06)] transition-shadow hover:shadow-[0_12px_40px_rgba(28,27,27,0.08)]">
            <div className="mb-6 flex items-start justify-between">
              <div className="rounded-xl bg-emerald-100 p-3 text-emerald-800">
                <span className="material-symbols-outlined" style={{ fontVariationSettings: "'FILL' 1" }}>menu_book</span>
              </div>
            </div>
            <div>
              <h3 className="mb-1 text-sm font-medium text-[#5e5e5e]">Published Sermons</h3>
              <div className="flex items-baseline gap-2">
                <span className="text-4xl font-extrabold tracking-tighter text-[#1c1b1b]">{stats.sermons}</span>
                <span className="text-sm text-[#5e5e5e]">media library</span>
              </div>
              <div className="mt-4 h-1.5 w-full overflow-hidden rounded-full bg-neutral-100">
                <div className="h-full bg-indigo-500 transition-all duration-500" style={{ width: `${Math.min((stats.sermons / 100) * 100, 100)}%` }} />
              </div>
            </div>
          </div>

          <div className="group flex flex-col justify-between rounded-xl bg-white p-8 shadow-[0_12px_40px_rgba(28,27,27,0.06)] transition-shadow hover:shadow-[0_12px_40px_rgba(28,27,27,0.08)]">
            <div className="mb-6 flex items-start justify-between">
              <div className="rounded-xl bg-neutral-100 p-3 text-neutral-800">
                <span className="material-symbols-outlined" style={{ fontVariationSettings: "'FILL' 1" }}>news</span>
              </div>
            </div>
            <div>
              <h3 className="mb-1 text-sm font-medium text-[#5e5e5e]">Blog Posts</h3>
              <div className="flex items-baseline gap-2">
                <span className="text-4xl font-extrabold tracking-tighter text-[#1c1b1b]">{stats.blog}</span>
                <span className="text-sm text-[#5e5e5e]">published</span>
              </div>
              <div className="mt-4 h-1.5 w-full overflow-hidden rounded-full bg-neutral-100">
                <div className="h-full bg-pink-500 transition-all duration-500" style={{ width: `${Math.min((stats.blog / 50) * 100, 100)}%` }} />
              </div>
            </div>
          </div>
          </>
          )}
        </section>

        {/* WhatsApp Notifications Section */}
        {whatsappNotifications.length > 0 && (
          <section className="mb-12">
            <div className="overflow-hidden rounded-2xl bg-white shadow-[0_12px_40px_rgba(28,27,27,0.06)]">
              <div className="flex items-center justify-between bg-green-50 p-6 border-b border-green-100">
                <div className="flex items-center gap-3">
                  <div className="rounded-xl bg-green-100 p-2 text-green-700">
                    <span className="material-symbols-outlined">chat</span>
                  </div>
                  <div>
                    <h2 className="text-lg font-bold tracking-tight text-[#1c1b1b]">WhatsApp Notifications</h2>
                    <p className="text-sm text-[#5e5e5e]">Pending ministry join requests ready to send</p>
                  </div>
                </div>
                <span className="rounded-full bg-green-100 px-3 py-1 text-xs font-bold text-green-700">
                  {whatsappNotifications.filter(n => n.status === 'sent').length} sent automatically
                </span>
              </div>
              <div className="divide-y divide-neutral-50">
                {whatsappNotifications.slice(0, 5).map((notification) => (
                  <div key={notification.id} className="p-6 hover:bg-neutral-50 transition-colors">
                    <div className="flex items-start justify-between gap-4">
                      <div className="flex-grow min-w-0">
                        <div className="flex items-center gap-2 mb-2">
                          <span className="inline-flex items-center gap-1 text-xs font-bold text-green-700 bg-green-50 px-2 py-1 rounded-full">
                            <span className="material-symbols-outlined text-[14px]">church</span>
                            {notification.ministry_name}
                          </span>
                          <span className={`text-[10px] font-bold uppercase tracking-widest px-2 py-1 rounded-full ${
                            notification.status === 'pending' ? 'bg-orange-100 text-orange-700' :
                            notification.status === 'sent' ? 'bg-green-100 text-green-700' :
                            'bg-red-100 text-red-700'
                          }`}>
                            {notification.status === 'sent' ? 'Auto-Sent' : notification.status}
                          </span>
                        </div>
                        <p className="text-sm text-[#5e5e5e] mb-3 line-clamp-2">{notification.message}</p>
                        <div className="flex items-center gap-4 text-xs text-[#8d706c]">
                          <span>{timeAgo(notification.created_at)}</span>
                          <span>To: {notification.recipient_number}</span>
                        </div>
                      </div>
                      <div className="flex gap-2">
                        <a
                          href={notification.whatsapp_url}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="inline-flex items-center gap-2 bg-blue-600 text-white px-4 py-2 rounded-lg text-sm font-bold hover:bg-blue-700 transition-colors"
                        >
                          <span className="material-symbols-outlined text-[16px]">visibility</span>
                          View Message
                        </a>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
              {whatsappNotifications.length > 5 && (
                <div className="p-4 bg-neutral-50 border-t border-neutral-100 text-center">
                  <button className="text-sm font-bold text-[#9e2016] hover:underline">
                    View All Notifications →
                  </button>
                </div>
              )}
            </div>
          </section>
        )}

        <section className="grid grid-cols-1 gap-8 lg:grid-cols-3">
          <div className="overflow-hidden rounded-2xl bg-white shadow-[0_12px_40px_rgba(28,27,27,0.06)] lg:col-span-2">
            <div className="flex items-center justify-between bg-[#fcf9f8] p-8">
              <h2 className="text-xl font-bold tracking-tight">Recent Activity Feed</h2>
              <button className="text-sm font-bold text-[#9e2016] hover:underline">View All Activity →</button>
            </div>
            <div className="flex flex-col">
              {loading ? (
                Array.from({ length: 5 }).map((_, i) => (
                  <div key={i} className="flex items-start gap-6 p-6 border-b border-neutral-50 last:border-b-0">
                    <Skeleton className="h-12 w-12 rounded-full shrink-0" />
                    <div className="flex-grow space-y-2">
                       <Skeleton className="h-4 w-1/2" />
                       <Skeleton className="h-3 w-3/4" />
                    </div>
                  </div>
                ))
              ) : recentActivity.length > 0 ? recentActivity.map((item) => (
                <div key={`${item.type}-${item.id}`} className="flex items-start gap-6 p-6 transition-colors hover:bg-[#f6f3f2] border-b border-neutral-50 last:border-b-0">
                  <div className={`flex h-12 w-12 flex-shrink-0 items-center justify-center rounded-full ${item.iconBg}`}>
                    <span className="material-symbols-outlined" style={{ fontVariationSettings: "'FILL' 1" }}>{item.icon}</span>
                  </div>
                  <div className="flex-grow min-w-0">
                    <p className="mb-1 font-medium text-[#1c1b1b]"><span className="font-bold">{item.title}</span> {item.action}</p>
                    <p className="mb-3 text-sm text-[#5e5e5e] truncate">{item.detail}</p>
                    <div className="flex items-center gap-4">
                      <span className="rounded bg-[#eae7e7] px-2 py-0.5 text-xs text-[#5e5e5e]">{timeAgo(item.time)}</span>
                    </div>
                  </div>
                </div>
              )) : (
                <div className="p-12 text-center text-neutral-400 text-sm">No recent activity yet. Start adding data to see updates here.</div>
              )}
            </div>
          </div>

          <div className="flex flex-col gap-6">
            <div className="relative overflow-hidden rounded-2xl bg-[#9e2016] p-8 text-white shadow-lg">
              <div className="relative z-10">
                <h3 className="mb-4 text-xl font-bold leading-tight">Quick Actions</h3>
                <div className="flex flex-col gap-3">
                  <button onClick={() => navigate('/admin/events')} className="flex w-full items-center justify-between rounded-xl bg-white/10 px-4 py-3 text-sm font-bold transition-colors hover:bg-white/20">Create New Event <span>⊕</span></button>
                  <button onClick={() => navigate('/admin/sermons')} className="flex w-full items-center justify-between rounded-xl bg-white/10 px-4 py-3 text-sm font-bold transition-colors hover:bg-white/20">Upload Sermon Media <span>☁</span></button>
                  <button onClick={() => alert('Monthly Report Exported Successfully!')} className="flex w-full items-center justify-between rounded-xl bg-white px-4 py-3 text-sm font-extrabold text-[#9e2016] shadow-sm transition-all hover:scale-[1.02] active:scale-95">Export Monthly Report <span>⇩</span></button>
                </div>
              </div>
              <span className="absolute -bottom-4 -right-4 text-9xl opacity-10">✝</span>
            </div>

            <div className="rounded-2xl bg-white p-6 shadow-[0_12px_40px_rgba(28,27,27,0.06)]">
              <h3 className="mb-4 font-bold text-[#1c1b1b]">Ministry Engagement</h3>
              <div className="space-y-4">
                {ministries.length > 0 ? ministries.map((m) => {
                  const colors = ['bg-blue-500', 'bg-orange-500', 'bg-emerald-500', 'bg-purple-500', 'bg-pink-500', 'bg-indigo-500'];
                  const colorClass = colors[ministries.indexOf(m) % colors.length];
                  const maxMembers = Math.max(...ministries.map(x => x.member_count || 0), 1);
                  const pct = Math.round(((m.member_count || 0) / maxMembers) * 100);
                  return (
                    <div key={m.id}>
                      <div className="mb-1 flex justify-between text-xs font-bold">
                        <span className="text-[#5e5e5e]">{m.name}</span>
                        <span className="text-[#9e2016]">{m.member_count || 0} members</span>
                      </div>
                      <div className="h-1.5 w-full overflow-hidden rounded-full bg-[#eae7e7]">
                        <div className={`h-full ${colorClass} transition-all duration-500`} style={{ width: `${pct}%` }} />
                      </div>
                    </div>
                  );
                }) : (
                  <p className="text-sm text-neutral-400">No ministries registered yet.</p>
                )}
              </div>
            </div>
          </div>
        </section>
      </main>

      <button className="fixed bottom-8 right-8 z-40 flex h-16 w-16 items-center justify-center rounded-full bg-[#9e2016] text-3xl text-white shadow-2xl transition-all hover:scale-105 active:scale-95">
        +
      </button>
    </>
  );
}
