import { useState, useEffect } from 'react';
import { supabase } from '../../lib/supabase';

export default function Dashboard() {
  const [stats, setStats] = useState({
    members: 0,
    donations: 0,
    events: 0,
    prayers: 0,
    sermons: 0,
    blog: 0
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchStats();

    // Set up Realtime subscriptions for all relevant tables
    const tables = ['members', 'donations', 'events', 'prayer_requests', 'sermons', 'blog_posts'];
    const channel = supabase.channel('dashboard_stats_sync');
    
    tables.forEach(table => {
      channel.on('postgres_changes', { event: '*', schema: 'public', table }, () => {
        fetchStats();
      });
    });

    channel.subscribe();

    return () => {
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
  return (
    <>
      <main className="mx-auto max-w-screen-2xl px-8 pb-12 pt-8">
        <header className="mb-10 flex flex-col items-end justify-between gap-6 md:flex-row">
          <div className="max-w-2xl">
            <h1 className="mb-2 text-4xl font-extrabold tracking-tight text-[#1c1b1b]">Welcome back, Admin</h1>
            <p className="text-[#5e5e5e]">Here is what's happening across the congregation this week. Your leadership and oversight guide our spiritual mission.</p>
          </div>
          <div className="flex gap-3">
            <div className="flex -space-x-3">
              <img className="h-10 w-10 rounded-full border-2 border-white" src="https://lh3.googleusercontent.com/aida-public/AB6AXuDJTZv_nXGQtr3ozI2hqNcBIlg9CoiFT6REG8fsmAhZxwEw7oDgan35ucLBhize0zt0o_iHYGp4QXGs5Feo37Z4OmpHGkmkidd4ggZrME7z9stTzYkgvDTTjgVIJIiIarLRlU3ndlQs7DnNNol9AOGhXbpa3FH0Ers1r0ReGXx0ePafCorAg_HJlTUL6EFHKTVJLLkWxqQWeP8NKWoke7fDQMd1S-lY9CAAO8P01ax9gkuYfcIn1q3K7p4OXdK18f2k2yUO3bRPDsSY" />
              <img className="h-10 w-10 rounded-full border-2 border-white" src="https://lh3.googleusercontent.com/aida-public/AB6AXuBTbd4RlYaQCFtbuOvHSVVsGi7qbbcbWVPRyDe1ZXnvwqVF4AcgQrsXi3Wafettd4TMHwvCOsqDByVMv4IKInHG5igNlM5B3j2xoFsPrnYr-jPc8aNQ1ApjuFxN-jhV6RSzD73oiiuXKucLVkqK-cZwaB2EZBGidtXU8pd9ectRrDD4KtHfH2lEAtmmnGw9ZG45RHMDJnHnNBPKp-q_AgyggHPgRuMBa4i3piJ8H6d3NGDttmDNeMU9hBDICCS59A4UOFsv0XoJrZvw" />
              <div className="flex h-10 w-10 items-center justify-center rounded-full border-2 border-white bg-[#e5e2e1] text-xs font-bold">+12</div>
            </div>
          </div>
        </header>

        <section className="mb-12 grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
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
                <span className="text-4xl font-extrabold tracking-tighter text-[#1c1b1b]">${stats.donations.toLocaleString()}</span>
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
        </section>

        <section className="grid grid-cols-1 gap-8 lg:grid-cols-3">
          <div className="overflow-hidden rounded-2xl bg-white shadow-[0_12px_40px_rgba(28,27,27,0.06)] lg:col-span-2">
            <div className="flex items-center justify-between bg-[#fcf9f8] p-8">
              <h2 className="text-xl font-bold tracking-tight">Recent Activity Feed</h2>
              <button className="text-sm font-bold text-[#9e2016] hover:underline">View All Activity →</button>
            </div>
            <div className="flex flex-col">
              <div className="flex items-start gap-6 p-6 transition-colors hover:bg-[#f6f3f2]">
                <div className="h-12 w-12 flex-shrink-0 overflow-hidden rounded-full">
                  <img className="h-full w-full object-cover" src="https://lh3.googleusercontent.com/aida-public/AB6AXuDWFAYgg5pEqcNS98HHrcMWsWqp84LLjfvcMJ4MYvrOthMKRW0y3xOCw2MFRfYa3XN0rmj9uPxmmlnXBWY0CR3668xgQySxLP5g0K6i_IUoWxTveEDIQwVl31IDMvptKt9uTpM2-RLYfgknt_kVBztIdmozRzk9Bi9XvO1G7ljqxAzavDhC2z7jDwK6JiFDse4vnjBfb406SdLfvpd7zTgJO7lFjtvJdSFJy7mc81WpYSq6M_1M9kX8F2fNcK_O3oEixHnD8AQxb6YZ" />
                </div>
                <div className="flex-grow">
                  <p className="mb-1 font-medium text-[#1c1b1b]"><span className="font-bold">Sister Grace Adeniyi</span> submitted a new prayer request.</p>
                  <p className="mb-3 text-sm text-[#5e5e5e]">"Praying for my family's healing and guidance during this transition phase..."</p>
                  <div className="flex items-center gap-4">
                    <span className="rounded bg-[#eae7e7] px-2 py-0.5 text-xs text-[#5e5e5e]">2 minutes ago</span>
                    <button className="text-xs font-bold text-[#9e2016]">Mark as Resolved</button>
                  </div>
                </div>
              </div>
              <div className="flex items-start gap-6 p-6 transition-colors hover:bg-[#f6f3f2]">
                <div className="flex h-12 w-12 flex-shrink-0 items-center justify-center rounded-full bg-emerald-100 text-emerald-700">
                  <span className="material-symbols-outlined">auto_stories</span>
                </div>
                <div className="flex-grow">
                  <p className="mb-1 font-medium text-[#1c1b1b]"><span className="font-bold">Admin Portal</span> automatically published a new sermon.</p>
                  <p className="mb-3 text-sm text-[#5e5e5e]">"The Power of Persistent Prayer" - Rev. Dr. Johnson</p>
                  <div className="flex items-center gap-4">
                    <span className="rounded bg-[#eae7e7] px-2 py-0.5 text-xs text-[#5e5e5e]">1 hour ago</span>
                    <button className="text-xs font-bold text-[#9e2016]">Edit Details</button>
                  </div>
                </div>
              </div>
              <div className="flex items-start gap-6 p-6 transition-colors hover:bg-[#f6f3f2]">
                <div className="flex h-12 w-12 flex-shrink-0 items-center justify-center rounded-full bg-orange-100 text-orange-700">
                  <span className="material-symbols-outlined">favorite</span>
                </div>
                <div className="flex-grow">
                  <p className="mb-1 font-medium text-[#1c1b1b]"><span className="font-bold">Bro. David Chen</span> made a generous donation.</p>
                  <p className="mb-3 text-sm text-[#5e5e5e]">Allocated to: Church Building Project Fund</p>
                  <div className="flex items-center gap-4">
                    <span className="rounded bg-[#eae7e7] px-2 py-0.5 text-xs text-[#5e5e5e]">4 hours ago</span>
                    <button className="text-xs font-bold text-[#9e2016]">Send Thank You</button>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div className="flex flex-col gap-6">
            <div className="relative overflow-hidden rounded-2xl bg-[#9e2016] p-8 text-white shadow-lg">
              <div className="relative z-10">
                <h3 className="mb-4 text-xl font-bold leading-tight">Quick Actions</h3>
                <div className="flex flex-col gap-3">
                  <button className="flex w-full items-center justify-between rounded-xl bg-white/10 px-4 py-3 text-sm font-bold transition-colors hover:bg-white/20">Create New Event <span>⊕</span></button>
                  <button className="flex w-full items-center justify-between rounded-xl bg-white/10 px-4 py-3 text-sm font-bold transition-colors hover:bg-white/20">Upload Sermon Media <span>☁</span></button>
                  <button className="flex w-full items-center justify-between rounded-xl bg-white px-4 py-3 text-sm font-extrabold text-[#9e2016] shadow-sm">Export Monthly Report <span>⇩</span></button>
                </div>
              </div>
              <span className="absolute -bottom-4 -right-4 text-9xl opacity-10">✝</span>
            </div>

            <div className="rounded-2xl bg-white p-6 shadow-[0_12px_40px_rgba(28,27,27,0.06)]">
              <h3 className="mb-4 font-bold text-[#1c1b1b]">Ministry Engagement</h3>
              <div className="space-y-4">
                {[
                  ['Youth Fellowship', '85%', 'bg-blue-500'],
                  ['Sunday School', '62%', 'bg-orange-500'],
                  ['Missions Outreach', '44%', 'bg-emerald-500 text-emerald-600'],
                ].map(([name, pct, colorClass]) => (
                  <div key={name}>
                    <div className="mb-1 flex justify-between text-xs font-bold">
                      <span className="text-[#5e5e5e]">{name}</span>
                      <span className={colorClass.includes('text-') ? colorClass.split(' ')[1] : 'text-[#9e2016]'}>{pct}</span>
                    </div>
                    <div className="h-1.5 w-full overflow-hidden rounded-full bg-[#eae7e7]">
                      <div className={`h-full ${colorClass.split(' ')[0]}`} style={{ width: pct }} />
                    </div>
                  </div>
                ))}
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
