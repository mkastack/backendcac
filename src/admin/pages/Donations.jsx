import { useState, useEffect, useMemo } from 'react';
import { supabase } from '../../lib/supabase';

export default function Donations() {
  const [purposeFilter, setPurposeFilter] = useState('All Purposes');
  const [dateFilter, setDateFilter] = useState('October 2023');
  const [donations, setDonations] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchDonations();
  }, []);

  const fetchDonations = async () => {
    setLoading(true);
    const { data, error } = await supabase
      .from('donations')
      .select('*')
      .order('date', { ascending: false });
    
    if (!error && data) {
      setDonations(data.map(d => ({
        ...d,
        name: d.donor_name,
        amount: `GH₵${d.amount.toLocaleString()}`,
        date: new Date(d.date).toLocaleDateString('en-US', { month: 'short', day: '2-digit', year: 'numeric' }),
        dateFilter: new Date(d.date).toLocaleDateString('en-US', { month: 'long', year: 'numeric' }),
        methodIcon: 'payments',
        methodText: 'General Payment',
        status: 'Completed',
        statusBg: 'bg-green-500',
        statusTextColor: 'text-green-600',
        initials: d.donor_name.split(' ').slice(0, 2).map(n => n[0]).join(''),
        initialsBg: 'bg-[#fee2e1]',
        initialsText: 'text-[#9e2016]'
      })));
    }
    setLoading(false);
  };

  const totals = useMemo(() => {
    const res = { tithe: 0, mission: 0, building: 0, total: 0 };
    donations.forEach(d => {
      const val = parseFloat(d.amount.replace(/[GH₵,]/g, ''));
      res.total += val;
      if (d.purpose === 'Tithe') res.tithe += val;
      if (d.purpose === 'Mission Fund') res.mission += val;
      if (d.purpose === 'Building Fund') res.building += val;
    });
    return res;
  }, [donations]);

  const filteredDonations = donations.filter((d) => {
    const pMatch = purposeFilter === 'All Purposes' || d.purpose === purposeFilter;
    const dMatch = dateFilter === 'All Dates' || d.dateFilter === dateFilter || true; // Placeholder for date logic
    return pMatch && dMatch;
  });

  const exportToCSV = () => {
    const headers = ['Donor Name', 'Amount', 'Date', 'Method', 'Purpose', 'Status'];
    const rows = filteredDonations.map(d => [
      d.name,
      d.amount.replace(/[GH₵,]/g, ''), // Remove currency symbol and comma for CSV numeric safety if needed
      d.date,
      d.methodText,
      d.purpose,
      d.status
    ]);
    
    const csvContent = [
      headers.join(','),
      ...rows.map(row => row.map(cell => `"${cell.replace(/"/g, '""')}"`).join(','))
    ].join('\n');
    
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement('a');
    const url = URL.createObjectURL(blob);
    link.setAttribute('href', url);
    link.setAttribute('download', `donations_report_${new Date().toISOString().split('T')[0]}.csv`);
    link.style.visibility = 'hidden';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <main className="py-8 px-4 sm:px-8 w-full max-w-screen-2xl mx-auto min-h-screen">
      <header className="mb-12">
        <h1 className="text-4xl font-extrabold tracking-tight text-[#1c1b1b] font-headline mb-2">Donations & Giving</h1>
        <p className="text-[#5e5e5e] font-body">Manage and monitor the church's financial stewardship and mission support.</p>
      </header>
      
      <section className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-12">
        <div className="bg-white p-8 rounded-2xl flex flex-col justify-between min-h-[160px] relative overflow-hidden shadow-sm border border-neutral-100">
          <div className="relative z-10">
            <p className="text-[11px] font-bold text-neutral-500 uppercase tracking-[0.1em] mb-4">Total Received</p>
            <h2 className="text-4xl font-extrabold text-[#9e2016] font-headline">${totals.total.toLocaleString()}</h2>
          </div>
          <div className="absolute -right-4 -bottom-4 opacity-[0.03]">
            <span className="material-symbols-outlined text-9xl text-neutral-900" style={{ fontVariationSettings: "'FILL' 1" }}>payments</span>
          </div>
        </div>
        
        <div className="bg-neutral-50/50 p-8 rounded-2xl flex flex-col justify-between shadow-sm border border-neutral-100">
          <div>
            <p className="text-[11px] font-bold text-neutral-500 uppercase tracking-[0.1em] mb-4">Tithe</p>
            <h2 className="text-3xl font-bold text-[#1c1b1b] font-headline">${totals.tithe.toLocaleString()}</h2>
          </div>
          <div className="w-full bg-neutral-200 h-1.5 rounded-full mt-6">
            <div className="bg-[#9e2016] h-1.5 rounded-full" style={{ width: `${(totals.tithe / totals.total || 0) * 100}%` }}></div>
          </div>
        </div>
        
        <div className="bg-neutral-50/50 p-8 rounded-2xl flex flex-col justify-between shadow-sm border border-neutral-100">
          <div>
            <p className="text-[11px] font-bold text-neutral-500 uppercase tracking-[0.1em] mb-4">Mission Fund</p>
            <h2 className="text-3xl font-bold text-[#1c1b1b] font-headline">${totals.mission.toLocaleString()}</h2>
          </div>
          <div className="w-full bg-neutral-200 h-1.5 rounded-full mt-6">
            <div className="bg-[#9e2016] h-1.5 rounded-full" style={{ width: `${(totals.mission / totals.total || 0) * 100}%` }}></div>
          </div>
        </div>
        
        <div className="bg-neutral-50/50 p-8 rounded-2xl flex flex-col justify-between shadow-sm border border-neutral-100">
          <div>
            <p className="text-[11px] font-bold text-neutral-500 uppercase tracking-[0.1em] mb-4">Building Fund</p>
            <h2 className="text-3xl font-bold text-[#1c1b1b] font-headline">${totals.building.toLocaleString()}</h2>
          </div>
          <div className="w-full bg-neutral-200 h-1.5 rounded-full mt-6">
            <div className="bg-[#9e2016] h-1.5 rounded-full" style={{ width: `${(totals.building / totals.total || 0) * 100}%` }}></div>
          </div>
        </div>
      </section>

      <section className="bg-white rounded-xl overflow-hidden shadow-sm border border-neutral-100">
        <div className="p-6 md:p-8 flex flex-col md:flex-row md:items-center justify-between gap-6 border-b border-neutral-100">
          <div className="flex flex-wrap items-center gap-4">
            <div className="relative min-w-[180px]">
              <span className="absolute left-4 top-1/2 -translate-y-1/2 material-symbols-outlined text-neutral-400 text-lg">calendar_month</span>
              <select 
                value={dateFilter}
                onChange={(e) => setDateFilter(e.target.value)}
                className="w-full pl-12 pr-10 py-2.5 bg-neutral-50 border-none rounded-xl text-sm focus:ring-2 focus:ring-[#9e2016]/20 transition-all font-semibold text-neutral-700 appearance-none"
              >
                <option>October 2023</option>
                <option>September 2023</option>
                <option>August 2023</option>
              </select>
              <span className="absolute right-4 top-1/2 -translate-y-1/2 material-symbols-outlined text-neutral-400 text-lg pointer-events-none">expand_more</span>
            </div>
            
            <div className="relative min-w-[180px]">
              <span className="absolute left-4 top-1/2 -translate-y-1/2 material-symbols-outlined text-neutral-400 text-lg">filter_list</span>
              <select 
                value={purposeFilter}
                onChange={(e) => setPurposeFilter(e.target.value)}
                className="w-full pl-12 pr-10 py-2.5 bg-neutral-50 border-none rounded-xl text-sm focus:ring-2 focus:ring-[#9e2016]/20 transition-all font-semibold text-neutral-700 appearance-none"
              >
                <option>All Purposes</option>
                <option>Tithe</option>
                <option>Offering</option>
                <option>Building Fund</option>
                <option>Mission Fund</option>
              </select>
              <span className="absolute right-4 top-1/2 -translate-y-1/2 material-symbols-outlined text-neutral-400 text-lg pointer-events-none">expand_more</span>
            </div>
          </div>
          
          <button 
            onClick={exportToCSV}
            className="flex items-center justify-center gap-2 px-6 py-2.5 bg-[#171717] text-white rounded-xl font-bold transition-all hover:bg-black active:scale-95 shadow-sm"
          >
            <span className="material-symbols-outlined text-lg">download</span>
            <span>Export to CSV</span>
          </button>
        </div>
        
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-neutral-50/30 border-b border-neutral-100">
                <th className="px-8 py-4 font-headline text-[10px] font-bold text-neutral-400 uppercase tracking-[0.2em]">Donor Name</th>
                <th className="px-8 py-4 font-headline text-[10px] font-bold text-neutral-400 uppercase tracking-[0.2em]">Amount</th>
                <th className="px-8 py-4 font-headline text-[10px] font-bold text-neutral-400 uppercase tracking-[0.2em]">Date</th>
                <th className="px-8 py-4 font-headline text-[10px] font-bold text-neutral-400 uppercase tracking-[0.2em]">Method</th>
                <th className="px-8 py-4 font-headline text-[10px] font-bold text-neutral-400 uppercase tracking-[0.2em]">Purpose</th>
                <th className="px-8 py-4 font-headline text-[10px] font-bold text-neutral-400 uppercase tracking-[0.2em]">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-neutral-100">
              {filteredDonations.map((d, index) => (
                <tr key={index} className="hover:bg-neutral-50/50 transition-colors group">
                  <td className="px-8 py-5">
                    <div className="flex items-center gap-3">
                      {d.avatar ? (
                        <img className="w-8 h-8 rounded-full object-cover" src={d.avatar} alt={d.name} />
                      ) : (
                        <div className={`w-8 h-8 rounded-full ${d.initialsBg} flex items-center justify-center ${d.initialsText} font-bold text-[10px]`}>
                          {d.initials}
                        </div>
                      )}
                      <span className="font-bold text-neutral-800 text-[13px]">{d.name}</span>
                    </div>
                  </td>
                  <td className="px-8 py-5 font-bold text-neutral-800 text-[13px]">{d.amount}</td>
                  <td className="px-8 py-5 text-neutral-500 text-[13px] font-medium">{d.date}</td>
                  <td className="px-8 py-5">
                    <div className="flex items-center gap-3 text-[13px] text-neutral-600 font-medium">
                      <span className="material-symbols-outlined text-[18px]">{d.methodIcon}</span>
                      <span>{d.methodText}</span>
                    </div>
                  </td>
                  <td className="px-8 py-5">
                    <span className="px-3 py-1 rounded-full bg-neutral-100 text-neutral-500 text-[9px] font-bold uppercase tracking-wider">
                      {d.purpose}
                    </span>
                  </td>
                  <td className="px-8 py-5">
                    <span className={`flex items-center gap-2 text-[13px] font-bold ${d.statusTextColor}`}>
                      <span className={`w-1.5 h-1.5 rounded-full ${d.statusBg}`}></span>
                      {d.status}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        
        <div className="p-8 flex items-center justify-between border-t border-neutral-100 bg-white">
          <p className="text-[13px] text-neutral-500 font-medium">
            Showing <span className="font-bold text-neutral-800">{filteredDonations.length}</span> of <span className="font-bold text-neutral-800">124</span> transactions
          </p>
          <div className="flex gap-1">
            <button className="w-10 h-10 flex items-center justify-center rounded-full hover:bg-neutral-50 transition-colors disabled:opacity-30" disabled>
              <span className="material-symbols-outlined text-neutral-400">chevron_left</span>
            </button>
            <button className="w-10 h-10 rounded-full bg-[#9e2016] text-white font-bold text-[13px] shadow-sm">1</button>
            <button className="w-10 h-10 rounded-full hover:bg-neutral-50 text-neutral-500 font-bold text-[13px] transition-colors">2</button>
            <button className="w-10 h-10 rounded-full hover:bg-neutral-50 text-neutral-500 font-bold text-[13px] transition-colors">3</button>
            <button className="w-10 h-10 flex items-center justify-center rounded-full hover:bg-neutral-50 transition-colors">
              <span className="material-symbols-outlined text-neutral-400">chevron_right</span>
            </button>
          </div>
        </div>
      </section>
    </main>
  );
}
