import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import churchLogo from '../images/church-logo.png';
import { supabase } from '../../lib/supabase';

export default function Login() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const onSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    // Developer Fallback for requested credentials
    if (email === 'christapostolicchurch@gmail.com' && password === 'cacbubiashie@30') {
      navigate('/admin/dashboard');
      setLoading(false);
      return;
    }

    const { data, error: authError } = await supabase.auth.signInWithPassword({
      email,
      password,
    });

    if (authError) {
      setError(authError.message);
    } else {
      navigate('/admin/dashboard');
    }
    setLoading(false);
  };

  return (
    <main className="flex min-h-screen w-full bg-[#faf4ff] text-[#302950] font-body overflow-hidden">
      {/* Left Panel (Brand Pane) */}
      <section
        className="hidden md:flex md:w-[40%] relative flex-col justify-between p-16 overflow-hidden"
        style={{ background: 'linear-gradient(135deg, #4345da 0%, #474acb 100%)' }}
      >
        {/* Decorative Arc Overlay */}
        <div className="absolute inset-0 opacity-10 pointer-events-none">
          <svg className="w-full h-full scale-150" fill="none" viewBox="0 0 800 800" xmlns="http://www.w3.org/2000/svg">
            <circle className="opacity-40" cx="0" cy="0" r="400" stroke="white" strokeWidth="2"></circle>
            <circle className="opacity-30" cx="0" cy="0" r="500" stroke="white" strokeWidth="2"></circle>
            <circle className="opacity-20" cx="0" cy="0" r="600" stroke="white" strokeWidth="2"></circle>
          </svg>
        </div>

        {/* Top Left Logo/Icon */}
        <div className="relative z-10">
          <span
            className="material-symbols-outlined text-[#faf4ff] text-6xl font-light"
            style={{ fontVariationSettings: "'wght' 200" }}
          >
            asterisk
          </span>
        </div>

        {/* Brand Content */}
        <div className="relative z-10 flex flex-col items-center justify-center">
          <div className="mx-auto flex h-[288px] w-[288px] items-center justify-center rounded-full border-4 border-dotted border-white/40 p-8 shadow-2xl">
            <img src={churchLogo} alt="Christ Apostolic Church Logo" className="w-full max-w-[200px] h-auto object-contain" />
          </div>
        </div>

        {/* Bottom Legal */}
        <div className="relative z-10">
          <p className="text-[#f4f1ff]/60 font-label text-xs uppercase tracking-widest">
            © 2024 Christ Apostolic Church International Bubiashie Central
          </p>
        </div>

        {/* Subtle background texture */}
        <div
          className="absolute inset-0 mix-blend-overlay opacity-20"
          style={{ backgroundImage: "url('https://lh3.googleusercontent.com/aida-public/AB6AXuCri8TGv_pDbuloXpt2UrKMSHTn3d-Pdfd32tMSLFIjehqztd2qxTvKA9CEz872uEbIZzUIBGMgM9c3OdlLIFfmk_Ow4ewyec7gQ2zK-uMFHo8yVNQWmVFzV3REp-CZaqdyXNJ4ylQq9GlbXo-CzLc5ZQskDocFmeoQ0RJGTZ3ZVBCH19nOt83YRiKqn-G0vCCbkpiBaaSj5xPM8puITmLudZKUdgZwHWeO6p3x_18pxbEJ1J_vsOSXg9DnIgUPJuOwhvltL7-WIvD8')" }}
        ></div>
      </section>

      {/* Right Panel (Action Pane) */}
      <section className="w-full md:w-[60%] bg-[#faf4ff] flex flex-col p-8 md:p-16 relative">
        <header className="flex justify-between items-center mb-12 md:mb-0">
          <div className="font-headline text-xl font-bold text-[#302950] tracking-tight">
          </div>
          <div className="md:hidden">
            <span className="material-symbols-outlined text-[#4345da]">help</span>
          </div>
        </header>

        {/* Centered Form Container */}
        <div className="flex-grow flex items-center justify-center">
          <div className="w-full max-w-md">
            <div className="mb-10">
              <h2 className="font-headline text-4xl font-bold text-[#302950] mb-3">
                Welcome Back!
              </h2>
              <p className="text-[#5e5680]">
                New to the portal?{' '}
                <a className="text-[#4345da] font-semibold hover:underline decoration-2 underline-offset-4 transition-all" href="#">
                  Create a new account now
                </a>
              </p>
            </div>

            <form onSubmit={onSubmit} className="space-y-8">
              {/* Underline Input: Email */}
              <div className="relative group">
                <label
                  className="absolute -top-6 left-0 font-label text-xs uppercase tracking-wider text-[#79719d] transition-all group-focus-within:text-[#4345da]"
                  htmlFor="email"
                >
                  Email Address
                </label>
                <input
                  className="w-full bg-transparent border-0 border-b-2 border-[#79719d]/30 py-3 px-0 focus:ring-0 focus:border-[#4345da] text-[#302950] placeholder:text-[#5e5680]/50 transition-all font-medium outline-none focus:outline-none shadow-none focus:shadow-none"
                  style={{boxShadow: 'none'}}
                  id="email"
                  name="email"
                  placeholder="name@church.org"
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                />
              </div>

              {/* Underline Input: Password */}
              <div className="relative group">
                <label
                  className="absolute -top-6 left-0 font-label text-xs uppercase tracking-wider text-[#79719d] transition-all group-focus-within:text-[#4345da]"
                  htmlFor="password"
                >
                  Password
                </label>
                <input
                  className="w-full bg-transparent border-0 border-b-2 border-[#79719d]/30 py-3 px-0 focus:ring-0 focus:border-[#4345da] text-[#302950] placeholder:text-[#5e5680]/50 transition-all font-medium outline-none focus:outline-none shadow-none focus:shadow-none"
                  style={{boxShadow: 'none'}}
                  id="password"
                  name="password"
                  placeholder="••••••••"
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                />
              </div>

              {error && <p className="text-sm font-bold text-red-600">{error}</p>}

              {/* Action Buttons */}
              <div className="pt-6 space-y-4">
                <button
                  disabled={loading}
                  className="w-full py-4 bg-[#302950] text-white font-bold rounded-full hover:bg-black transition-all transform active:scale-[0.98] shadow-lg shadow-[#302950]/10 disabled:opacity-50"
                  type="submit"
                >
                  {loading ? 'Authenticating...' : 'Login Now'}
                </button>
                <button
                  className="flex items-center justify-center w-full py-4 bg-transparent border border-[#79719d]/20 text-[#302950] font-bold rounded-full hover:bg-[#f4eeff] transition-all transform active:scale-[0.98]"
                  type="button"
                >
                  <svg className="w-5 h-5 mr-3" viewBox="0 0 24 24">
                    <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4"></path>
                    <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853"></path>
                    <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l3.66-2.84z" fill="#FBBC05"></path>
                    <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335"></path>
                  </svg>
                  Login with Google
                </button>
              </div>
            </form>
          </div>
        </div>

        {/* Right Panel Footer */}
        <footer className="mt-auto pt-8 flex justify-center">
          <p className="text-[#5e5680] font-medium">
            Forget password?{' '}
            <a className="text-[#302950] font-extrabold hover:underline underline-offset-4 ml-1" href="#">
              Click here
            </a>
          </p>
        </footer>
      </section>
    </main>
  );
}
