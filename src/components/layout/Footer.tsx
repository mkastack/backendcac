import { useState } from "react";
import { Link } from "react-router-dom";
import { supabase } from '../../lib/supabase';
import { Facebook, Youtube, Instagram, Phone, Mail, MapPin, Send, MessageCircle, ArrowUp } from "lucide-react";
import churchLogo from "/church-logo.png"; // Replace with actual logo path

const quickLinks = [
  { name: "About Us", path: "/about" },
  { name: "Sermons", path: "/sermons" },
  { name: "Events", path: "/events" },
  { name: "Ministries", path: "/ministries" },
  { name: "Prayer Request", path: "/prayer" },
  { name: "Our Blog", path: "/blog" },
  { name: "Admin Dashboard", path: "/admin" },
];

const ministries = [
  { name: "Men's Ministry", path: "/ministries#men" },
  { name: "Women's Ministry", path: "/ministries#women" },
  { name: "Youth Ministry", path: "/ministries#youth" },
  { name: "Children's Church", path: "/ministries#children" },
  { name: "Evangelism", path: "/ministries#evangelism" },
];

const socialLinks = [
  { icon: Facebook, url: "https://web.facebook.com/profile.php?id=61566892619889", label: "Facebook" },
  { icon: Youtube, url: "https://youtube.com/@cacint_bubiashiecentral?si=pdtWhcEe55Rt3HjI", label: "YouTube" },
  { icon: Instagram, url: "https://www.instagram.com/cacint_bubiashiecentral?igsh=YnNnOW9tajl5dWg3", label: "Instagram" },
];

export function Footer() {
  const [footerEmail, setFooterEmail] = useState('');
  const [footerStatus, setFooterStatus] = useState<'idle' | 'loading' | 'success' | 'error'>('idle');

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const handleFooterSubscribe = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!footerEmail) return;

    setFooterStatus('loading');

    const { data: existing } = await supabase.from('members').select('id').eq('email', footerEmail).single();

    if (existing) {
      setFooterStatus('success');
      setFooterEmail('');
      setTimeout(() => setFooterStatus('idle'), 3000);
      return;
    }

    const { error } = await supabase.from('members').insert([{
      full_name: 'Newsletter Subscriber',
      email: footerEmail,
      category: 'Visitor',
      status: 'Active'
    }]);

    if (error) {
      setFooterStatus('error');
    } else {
      setFooterStatus('success');
      setFooterEmail('');
    }
    setTimeout(() => setFooterStatus('idle'), 3000);
  };

  return (
    <footer className="bg-gradient-holy text-white/80 pt-16 mt-0 relative border-t border-white/10">
      {/* Floating Contact Bar - Glass Effect at Top */}
      <div className="absolute left-0 right-0 top-0 -translate-y-1/2 z-10 px-6">
        <div className="container mx-auto max-w-6xl">
          <div className="bg-white/10 backdrop-blur-xl rounded-2xl p-4 lg:px-8 lg:py-5 flex flex-col lg:flex-row items-center justify-between gap-5 shadow-[0_5px_15px_rgba(0,0,0,0.2)] border border-white/20">
            <h3 className="font-heading font-bold text-xl lg:text-2xl text-white">Need Help?</h3>
            <div className="flex flex-wrap items-center justify-center gap-3 lg:gap-4">
              <a href="tel:+233000000000" className="flex items-center gap-2.5 px-5 py-2.5 bg-white rounded-full shadow-[0_4px_15px_rgba(0,0,0,0.1)] hover:bg-white/90 hover:!-translate-y-1 transition-all duration-300 text-slate-800 font-medium text-[13px] lg:text-sm">
                <Phone className="w-4 h-4 text-sky-600" />
                +233 XX XXX XXXX
              </a>
              <a href="https://wa.me/233000000000" className="flex items-center gap-2.5 px-5 py-2.5 bg-white rounded-full shadow-[0_4px_15px_rgba(0,0,0,0.1)] hover:bg-white/90 hover:!-translate-y-1 transition-all duration-300 text-slate-800 font-medium text-[13px] lg:text-sm">
                <MessageCircle className="w-4 h-4 text-green-600" />
                WhatsApp Us
              </a>
              <a href="mailto:christapostolicchurchbubiashie@gmail.com" className="flex items-center gap-2.5 px-5 py-2.5 bg-white rounded-full shadow-[0_4px_15px_rgba(0,0,0,0.1)] hover:bg-white/90 hover:!-translate-y-1 transition-all duration-300 text-slate-800 font-medium text-[13px] lg:text-sm">
                <Mail className="w-4 h-4 text-sky-600" />
                Email Us
              </a>
            </div>
          </div>
        </div>
      </div>

      {/* Main Footer Section */}
      <div className="container mx-auto px-6 pt-8 pb-8">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12 lg:gap-16">
          {/* About Column */}
          <div className="lg:col-span-1">
            <div className="flex items-center gap-2 mb-4 h-8">
              <img
                src={churchLogo}
                alt="CACI Logo"
                className="h-8 w-8 object-contain bg-white rounded-full p-0.5 shadow-sm"
              />
              <div className="flex flex-col justify-center">
                <h3 className="font-serif font-bold text-xs text-white leading-tight uppercase tracking-wider mb-0.5">Christ Apostolic Church</h3>
                <span className="text-[9px] text-white/50 font-medium leading-none">International Bubiashie Central</span>
              </div>
            </div>
            <p className="text-white/70 text-sm leading-relaxed mb-6 font-body text-justify">
              A place of worship, transformation, and hope. Join us as we spread the love of Christ to all nations.
            </p>
            <div className="flex items-start gap-3 mt-6">
              <MapPin className="h-5 w-5 text-church-gold shrink-0" />
              <span className="text-white/70 text-sm font-medium">
                Bubiashie Central<br />Accra, Ghana
              </span>
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <div className="h-8 flex items-center mb-4">
              <h4 className="font-serif font-bold text-xs text-white uppercase tracking-wider">Quick Links</h4>
            </div>
            <ul className="space-y-2">
              {quickLinks.map((link) => (
                <li key={link.name}>
                  <Link
                    to={link.path}
                    onClick={() => window.scrollTo({ top: 0, behavior: 'instant' })}
                    className="text-white/60 hover:text-church-gold hover:-translate-x-1 inline-block transition-all text-sm font-medium"
                  >
                    {link.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Ministries */}
          <div>
            <div className="h-8 flex items-center mb-4">
              <h4 className="font-serif font-bold text-xs text-white uppercase tracking-wider">Ministries</h4>
            </div>
            <ul className="space-y-2">
              {ministries.map((ministry) => (
                <li key={ministry.name}>
                  <Link
                    to={ministry.path}
                    onClick={() => window.scrollTo({ top: 0, behavior: 'instant' })}
                    className="text-white/60 hover:text-church-gold hover:-translate-x-1 inline-block transition-all text-sm font-medium"
                  >
                    {ministry.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Newsletter & Socials */}
          <div className="flex flex-col h-full justify-between">
            <div>
              <div className="flex items-center gap-4 mb-4 h-8">
                <h4 className="font-serif font-bold text-xs text-white uppercase tracking-wider whitespace-nowrap">Stay Connected</h4>
                <div className="flex gap-2">
                  {socialLinks.map((social) => (
                    <a
                      key={social.label}
                      href={social.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="w-7 h-7 rounded-full bg-white/10 flex items-center justify-center hover:bg-church-gold hover:text-white transition-colors text-white"
                      aria-label={social.label}
                    >
                      <social.icon className="h-3.5 w-3.5" />
                    </a>
                  ))}
                </div>
              </div>

              <p className="text-white/60 text-sm mb-4 font-body">Subscribe for updates.</p>
              <form onSubmit={handleFooterSubscribe} className="relative flex items-center mb-2">
                <input
                  type="email"
                  value={footerEmail}
                  onChange={(e) => setFooterEmail(e.target.value)}
                  disabled={footerStatus === 'loading'}
                  required
                  placeholder="Email Address"
                  className="w-full bg-white/10 rounded-full py-3 px-5 pr-12 text-sm border border-white/20 text-white placeholder:text-white/40 focus:outline-none focus:ring-2 focus:ring-church-gold disabled:opacity-60"
                />
                <button 
                  type="submit"
                  disabled={footerStatus === 'loading'}
                  aria-label="Subscribe" 
                  className="absolute right-1.5 w-9 h-9 bg-church-gold rounded-full flex items-center justify-center text-white hover:bg-church-gold-light transition-colors shadow-sm disabled:opacity-60"
                >
                  <Send className="w-4 h-4 ml-0.5" />
                </button>
              </form>
              {footerStatus === 'success' && (
                <p className="text-green-400 text-xs font-semibold mb-4">Subscribed successfully!</p>
              )}
              {footerStatus === 'error' && (
                <p className="text-red-400 text-xs font-semibold mb-4">Failed. Please try again.</p>
              )}
              {footerStatus === 'idle' && <div className="mb-6" />}
            </div>

            {/* Service Times */}
            <div className="pt-6 border-t border-white/10 mt-auto">
              <h5 className="font-serif font-bold text-white mb-3 text-sm uppercase tracking-wider">SERVICE TIMES</h5>
              <div className="space-y-2">
                <p className="text-white/60 text-sm flex justify-between"><span>Sunday</span> <span className="font-semibold text-white/80">8:00 AM & 10:30 AM</span></p>
                <p className="text-white/60 text-sm flex justify-between"><span>Wednesday</span> <span className="font-semibold text-white/80">6:00 PM</span></p>
                <p className="text-white/60 text-sm flex justify-between"><span>Friday</span> <span className="font-semibold text-white/80">6:00 PM</span></p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Bottom Bar */}
      <div className="border-t border-white/5 bg-black/20 pt-3 pb-3">
        <div className="container mx-auto px-6 py-3">
          <div className="flex flex-col md:flex-row items-center justify-between gap-4">
            <p className="text-white/40 text-[10px] font-bold text-center md:text-left tracking-widest uppercase">
              © {new Date().getFullYear()}. ALL RIGHTS RESERVED. DESIGNED FOR CACI BUBIASHIE CENTRAL.
            </p>
            <div className="flex items-center gap-6">
              <Link to="/privacy" onClick={() => window.scrollTo({ top: 0, behavior: 'instant' })} className="text-white/40 hover:text-white text-[10px] font-bold transition-colors uppercase tracking-widest">
                Privacy
              </Link>
              <Link to="/terms" onClick={() => window.scrollTo({ top: 0, behavior: 'instant' })} className="text-white/40 hover:text-white text-[10px] font-bold transition-colors uppercase tracking-widest">
                Terms
              </Link>
              <Link to="/admin" onClick={() => window.scrollTo({ top: 0, behavior: 'instant' })} className="text-white/40 hover:text-white text-[10px] font-bold transition-colors uppercase tracking-widest">
                Admin
              </Link>
              <button
                onClick={scrollToTop}
                className="w-8 h-8 bg-church-gold rounded-md flex items-center justify-center text-white hover:bg-church-gold-light transition-colors ml-4 shadow-[0_4px_10px_rgba(0,0,0,0.2)] hover:!-translate-y-1"
                aria-label="Scroll to top"
              >
                <ArrowUp className="w-4 h-4" />
              </button>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}
