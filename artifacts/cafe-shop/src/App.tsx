import { useEffect, useState, type FormEvent } from 'react';
import {
  ArrowDownRight,
  ArrowUpRight,
  Instagram,
  Menu as MenuIcon,
  Minus,
  Plus,
  X,
} from 'lucide-react';
import { type ReactNode } from 'react';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { ErrorBoundary } from '@/components/error-boundary';
import { Toaster } from '@/components/ui/toaster';
import { TooltipProvider } from '@/components/ui/tooltip';
import NotFound from '@/pages/not-found';
import { Route, Switch, useLocation, Router as WouterRouter } from 'wouter';

const queryClient = new QueryClient();

type MenuItem = {
  name: string;
  description: string;
  price: string;
  category: 'coffee' | 'bakery' | 'brunch';
  note?: string;
};

const menuItems: MenuItem[] = [
  { name: 'Morrow House Latte', description: 'Brown sugar, toasted sesame, whole milk', price: '$6.25', category: 'coffee', note: 'Our signature' },
  { name: 'Cardamom Cloud', description: 'Espresso, cardamom cream, orange zest', price: '$6.75', category: 'coffee', note: 'A little extra' },
  { name: 'Oat Cortado', description: 'Double espresso, velvety oat milk', price: '$5.50', category: 'coffee' },
  { name: 'Black Sesame Mocha', description: 'Cacao, sesame, espresso, steamed milk', price: '$6.50', category: 'coffee' },
  { name: 'Morning Bun', description: 'Laminated pastry, cinnamon, lemon sugar', price: '$5.25', category: 'bakery', note: 'Baked at 7am' },
  { name: 'Miso Tahini Cookie', description: 'Brown butter, sesame, flaky salt', price: '$4.25', category: 'bakery' },
  { name: 'Seasonal Fruit Danish', description: 'Cultured cream, market fruit, all-butter pastry', price: '$5.75', category: 'bakery' },
  { name: 'Ricotta Toast', description: 'Whipped ricotta, honey, pistachio, sourdough', price: '$12.50', category: 'brunch', note: 'Until 2pm' },
  { name: 'Soft Egg Plate', description: 'Jammy eggs, greens, toast, chili crisp', price: '$14.00', category: 'brunch' },
];

const navItems = [
  { label: 'Menu', href: '#menu' },
  { label: 'Our story', href: '#story' },
  { label: 'Visit', href: '#visit' },
];

function Home() {
  const [mobileOpen, setMobileOpen] = useState(false);
  const [activeCategory, setActiveCategory] = useState<'all' | MenuItem['category']>('all');
  const [newsletterEmail, setNewsletterEmail] = useState('');
  const [subscribed, setSubscribed] = useState(false);
  const [bookingOpen, setBookingOpen] = useState(false);
  const [expandedMenu, setExpandedMenu] = useState(false);

  useEffect(() => {
    const onKey = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        setMobileOpen(false);
        setBookingOpen(false);
      }
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, []);

  const filteredItems = menuItems.filter((item) => activeCategory === 'all' || item.category === activeCategory);
  const visibleItems = expandedMenu ? filteredItems : filteredItems.slice(0, 6);

  const handleSubscribe = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (newsletterEmail.trim()) setSubscribed(true);
  };

  const closeMobile = () => setMobileOpen(false);

  return (
    <main className="grain overflow-hidden">
      <header className="absolute left-0 right-0 top-0 z-40 px-5 py-5 text-[#f8f2e9] sm:px-8 lg:px-12">
        <nav className="mx-auto flex max-w-[1440px] items-center justify-between">
          <a href="#top" aria-label="Morrow and Mug home" data-testid="link-home" className="group flex items-center gap-3">
            <span className="flex h-10 w-10 items-center justify-center rounded-full border border-[#f8f2e9]/50 font-display text-xl transition-transform duration-300 group-hover:rotate-12">M</span>
            <span className="font-mono-cafe text-[11px] uppercase tracking-[0.23em]">Morrow &amp; Mug</span>
          </a>
          <div className="hidden items-center gap-10 md:flex">
            {navItems.map((item) => (
              <a key={item.href} href={item.href} data-testid={`link-nav-${item.label.toLowerCase().replace(' ', '-')}`} className="font-mono-cafe text-[10px] uppercase tracking-[0.2em] text-[#f8f2e9]/75 transition-colors hover:text-[#f8f2e9]">{item.label}</a>
            ))}
            <button onClick={() => setBookingOpen(true)} data-testid="button-book-table" className="rounded-full border border-[#f8f2e9]/60 px-5 py-2.5 font-mono-cafe text-[10px] uppercase tracking-[0.18em] transition-all hover:bg-[#f8f2e9] hover:text-[#33251e]">Book a table</button>
          </div>
          <button onClick={() => setMobileOpen(true)} data-testid="button-open-menu" className="flex h-10 w-10 items-center justify-center rounded-full border border-[#f8f2e9]/50 md:hidden" aria-label="Open navigation"><MenuIcon size={18} /></button>
        </nav>
        {mobileOpen && (
          <div className="fixed inset-0 z-50 flex flex-col bg-[#33251e] p-6 md:hidden">
            <div className="flex items-center justify-between">
              <span className="font-mono-cafe text-[11px] uppercase tracking-[0.23em]">Morrow &amp; Mug</span>
              <button onClick={closeMobile} data-testid="button-close-menu" className="flex h-10 w-10 items-center justify-center rounded-full border border-[#f8f2e9]/40" aria-label="Close navigation"><X size={18} /></button>
            </div>
            <div className="mt-20 flex flex-col gap-7">
              {navItems.map((item) => <a key={item.href} href={item.href} onClick={closeMobile} data-testid={`link-mobile-${item.label.toLowerCase().replace(' ', '-')}`} className="font-display text-5xl">{item.label}</a>)}
              <button onClick={() => { closeMobile(); setBookingOpen(true); }} data-testid="button-mobile-book" className="mt-5 w-fit rounded-full bg-[#d56845] px-6 py-3 font-mono-cafe text-[10px] uppercase tracking-[0.18em]">Book a table</button>
            </div>
            <p className="mt-auto font-mono-cafe text-[10px] uppercase tracking-[0.16em] text-[#f8f2e9]/55">88 Willow Street · Portland, OR</p>
          </div>
        )}
      </header>

      <section id="top" className="relative min-h-[740px] bg-[#33251e] text-[#f8f2e9] sm:min-h-[800px]">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_73%_25%,rgba(176,116,72,.34),transparent_31%),linear-gradient(115deg,#33251e_15%,rgba(51,37,30,.72)_47%,rgba(51,37,30,.15)_100%)]" />
        <div className="absolute right-[-10%] top-0 h-full w-[64%] bg-cover bg-center opacity-80 mix-blend-screen sm:w-[54%]" style={{ backgroundImage: "url('/morrow-hero.jpg')" }} />
        <div className="relative mx-auto flex min-h-[740px] max-w-[1440px] items-end px-5 pb-20 pt-32 sm:min-h-[800px] sm:px-8 sm:pb-28 lg:px-12">
          <div className="max-w-3xl">
            <p className="reveal font-mono-cafe text-[10px] uppercase tracking-[0.28em] text-[#e7a780]">Coffee · Pastry · A little time</p>
            <h1 className="reveal reveal-delay-1 mt-6 max-w-3xl font-display text-[clamp(4.3rem,11vw,10.8rem)] leading-[.8] tracking-[-0.065em] text-[#f8f2e9]">Take your<br /><em className="font-normal text-[#e7a780]">sweet</em> time.</h1>
            <div className="reveal reveal-delay-2 mt-9 flex max-w-xl flex-col justify-between gap-7 sm:flex-row sm:items-end">
              <p className="max-w-[290px] text-base leading-7 text-[#f8f2e9]/70">Thoughtful coffee, fresh pastries, and a sunny corner to call yours for a while.</p>
              <a href="#menu" data-testid="link-hero-menu" className="group flex items-center gap-3 font-mono-cafe text-[10px] uppercase tracking-[0.18em] text-[#f8f2e9]">
                See what&apos;s brewing <span className="flex h-9 w-9 items-center justify-center rounded-full bg-[#e7a780] text-[#33251e] transition-transform duration-300 group-hover:translate-x-1 group-hover:-translate-y-1"><ArrowDownRight size={17} /></span>
              </a>
            </div>
          </div>
          <div className="absolute bottom-7 right-6 hidden items-center gap-4 font-mono-cafe text-[9px] uppercase tracking-[0.2em] text-[#f8f2e9]/55 sm:flex lg:right-12">
            <span className="h-px w-14 bg-[#f8f2e9]/30" /> Scroll to linger
          </div>
        </div>
      </section>

      <div className="overflow-hidden border-b border-[#d2c3ae] bg-[#e7a780] py-4 text-[#33251e]">
        <div className="marquee flex w-max items-center gap-10 font-mono-cafe text-[10px] uppercase tracking-[0.25em]">
          {Array.from({ length: 2 }).flatMap((_, index) => ['Open every day', 'Poured with care', 'Made for slow mornings', '88 Willow Street'].map((text) => <span key={`${index}-${text}`} className="flex items-center gap-10">{text}<span className="text-lg leading-none">·</span></span>))}
        </div>
      </div>

      <section id="menu" className="bg-[#f3eee6] px-5 py-24 sm:px-8 sm:py-32 lg:px-12">
        <div className="mx-auto max-w-[1260px]">
          <div className="flex flex-col justify-between gap-8 border-b border-[#d2c3ae] pb-10 lg:flex-row lg:items-end">
            <div>
              <p className="font-mono-cafe text-[10px] uppercase tracking-[0.24em] text-[#b45a3c]">The good stuff</p>
              <h2 className="mt-4 max-w-xl font-display text-6xl leading-[.92] tracking-[-0.045em] text-[#33251e] sm:text-8xl">Made for the <em className="font-normal text-[#b45a3c]">moment.</em></h2>
            </div>
            <p className="max-w-xs text-sm leading-6 text-[#6e6055]">A short, considered menu that changes with the market and the mood. Everything is best enjoyed right here.</p>
          </div>
          <div className="mt-8 flex flex-wrap gap-2">
            {(['all', 'coffee', 'bakery', 'brunch'] as const).map((category) => (
              <button key={category} onClick={() => { setActiveCategory(category); setExpandedMenu(false); }} data-testid={`button-filter-${category}`} className={`rounded-full border px-5 py-2.5 font-mono-cafe text-[10px] uppercase tracking-[0.16em] transition-colors ${activeCategory === category ? 'border-[#33251e] bg-[#33251e] text-[#f3eee6]' : 'border-[#cdbfac] text-[#6e6055] hover:border-[#33251e] hover:text-[#33251e]'}`}>{category}</button>
            ))}
          </div>
          <div className="mt-10 grid gap-x-12 md:grid-cols-2">
            {visibleItems.map((item, index) => (
              <article key={item.name} data-testid={`card-menu-${index}`} className="group flex items-start justify-between gap-5 border-b border-[#d2c3ae] py-6 first:pt-0 md:nth-[2]:pt-0">
                <div>
                  <div className="flex flex-wrap items-center gap-3">
                    <h3 className="font-display text-2xl tracking-[-0.02em] text-[#33251e] transition-colors group-hover:text-[#b45a3c]">{item.name}</h3>
                    {item.note && <span className="rounded-full bg-[#e7a780]/45 px-2.5 py-1 font-mono-cafe text-[8px] uppercase tracking-[0.14em] text-[#8e432d]">{item.note}</span>}
                  </div>
                  <p className="mt-1.5 text-sm leading-6 text-[#786b60]">{item.description}</p>
                </div>
                <span className="shrink-0 pt-1 font-mono-cafe text-xs text-[#b45a3c]">{item.price}</span>
              </article>
            ))}
          </div>
          {filteredItems.length > 6 && <button onClick={() => setExpandedMenu((current) => !current)} data-testid="button-expand-menu" className="mt-10 flex items-center gap-3 font-mono-cafe text-[10px] uppercase tracking-[0.18em] text-[#33251e]">{expandedMenu ? 'Show less' : 'View full menu'} <span className="flex h-8 w-8 items-center justify-center rounded-full border border-[#b45a3c] text-[#b45a3c]">{expandedMenu ? <Minus size={14} /> : <Plus size={14} />}</span></button>}
        </div>
      </section>

      <section id="story" className="bg-[#d9dfc8] px-5 py-24 sm:px-8 sm:py-32 lg:px-12">
        <div className="mx-auto grid max-w-[1260px] gap-14 lg:grid-cols-[.78fr_1.22fr] lg:items-center lg:gap-24">
          <div className="relative mx-auto w-full max-w-[430px]">
            <div className="absolute -left-4 -top-4 h-full w-full border border-[#758064]/45 sm:-left-6 sm:-top-6" />
            <div className="relative aspect-[4/5] overflow-hidden bg-[#b6bea1]">
              <img src="/morrow-interior.jpg" alt="Sunlit table inside Morrow and Mug" data-testid="img-cafe-interior" className="h-full w-full object-cover grayscale-[.18] mix-blend-multiply transition-transform duration-700 hover:scale-105" />
              <div className="absolute bottom-5 left-5 right-5 flex justify-between font-mono-cafe text-[9px] uppercase tracking-[0.18em] text-[#f3eee6]"><span>Est. 2018</span><span>Portland, OR</span></div>
            </div>
          </div>
          <div>
            <p className="font-mono-cafe text-[10px] uppercase tracking-[0.24em] text-[#536044]">A place to pause</p>
            <h2 className="mt-5 max-w-2xl font-display text-6xl leading-[.9] tracking-[-0.05em] text-[#33251e] sm:text-8xl">Not in a hurry.<br /><em className="font-normal text-[#536044]">Never were.</em></h2>
            <div className="mt-9 grid gap-7 sm:grid-cols-2">
              <p className="text-sm leading-7 text-[#536044]">Morrow &amp; Mug started with a simple idea: that a neighborhood cafe can be both a daily ritual and a small change of scenery. No laptops after noon. No rush on the refills.</p>
              <p className="text-sm leading-7 text-[#536044]">We work with patient growers, nearby bakers, and the kind of people who know your order before you say it. Come as you are. Stay as long as you like.</p>
            </div>
            <a href="#visit" data-testid="link-story-visit" className="mt-10 inline-flex items-center gap-3 border-b border-[#536044] pb-2 font-mono-cafe text-[10px] uppercase tracking-[0.18em] text-[#33251e] transition-colors hover:text-[#b45a3c]">Come say hello <ArrowUpRight size={15} /></a>
          </div>
        </div>
      </section>

      <section className="bg-[#b45a3c] px-5 py-6 text-[#f8f2e9] sm:px-8 lg:px-12">
        <div className="mx-auto flex max-w-[1260px] flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
          <p className="font-display text-2xl italic">The morning special</p>
          <p className="font-mono-cafe text-[10px] uppercase tracking-[0.18em] text-[#f8f2e9]/75">House latte + morning bun · $10.50 · until 11am</p>
          <a href="#visit" data-testid="link-special-visit" className="flex items-center gap-2 font-mono-cafe text-[10px] uppercase tracking-[0.16em]">Catch it early <ArrowUpRight size={14} /></a>
        </div>
      </section>

      <section className="bg-[#f3eee6] px-5 py-24 sm:px-8 sm:py-32 lg:px-12">
        <div className="mx-auto max-w-[1260px]">
          <div className="flex items-end justify-between gap-5">
            <div>
              <p className="font-mono-cafe text-[10px] uppercase tracking-[0.24em] text-[#b45a3c]">The room</p>
              <h2 className="mt-4 font-display text-6xl leading-[.9] tracking-[-0.05em] text-[#33251e] sm:text-8xl">Come for the<br /><em className="font-normal text-[#b45a3c]">light.</em></h2>
            </div>
            <p className="hidden max-w-[210px] pb-1 text-right text-sm leading-6 text-[#786b60] sm:block">A few favorite corners, captured between the first pour and the last crumb.</p>
          </div>
          <div className="mt-14 grid gap-4 sm:grid-cols-[1.15fr_.85fr] sm:grid-rows-2">
            <div className="relative min-h-[390px] overflow-hidden bg-[#c7b39c] sm:row-span-2"><img src="/morrow-interior.jpg" alt="Window seat in the cafe" className="h-full w-full object-cover transition-transform duration-700 hover:scale-105" /><span className="absolute bottom-5 left-5 font-mono-cafe text-[10px] uppercase tracking-[.18em] text-[#f8f2e9]">01 / The window seat</span></div>
            <div className="flex min-h-[190px] flex-col justify-between bg-[#d9dfc8] p-7 text-[#536044]"><span className="font-mono-cafe text-[10px] uppercase tracking-[.18em]">02 / A good table</span><p className="max-w-[250px] font-display text-3xl leading-tight">“The kind of place where one chapter becomes three.”</p></div>
            <div className="relative min-h-[190px] overflow-hidden bg-[#e7a780] p-7 text-[#33251e]"><div className="absolute -right-7 -top-10 h-44 w-44 rounded-full border-[18px] border-[#b45a3c]/20" /><div className="relative flex h-full flex-col justify-between"><span className="font-mono-cafe text-[10px] uppercase tracking-[.18em]">03 / Take it outside</span><p className="max-w-[230px] font-display text-3xl leading-tight">A little sun never hurt.</p></div></div>
          </div>
        </div>
      </section>

      <section id="visit" className="bg-[#33251e] px-5 py-24 text-[#f8f2e9] sm:px-8 sm:py-32 lg:px-12">
        <div className="mx-auto grid max-w-[1260px] gap-14 lg:grid-cols-[1fr_1fr] lg:gap-24">
          <div>
            <p className="font-mono-cafe text-[10px] uppercase tracking-[0.24em] text-[#e7a780]">You know where to find us</p>
            <h2 className="mt-5 max-w-lg font-display text-6xl leading-[.88] tracking-[-0.05em] sm:text-8xl">Your new<br /><em className="font-normal text-[#e7a780]">favorite corner.</em></h2>
            <div className="mt-10 flex flex-col gap-5 border-t border-[#f8f2e9]/20 pt-7 text-sm text-[#f8f2e9]/75 sm:flex-row sm:gap-12">
              <div><p className="font-mono-cafe text-[10px] uppercase tracking-[.18em] text-[#e7a780]">Find us</p><p className="mt-3 leading-6">88 Willow Street<br />Portland, Oregon 97205</p></div>
              <div><p className="font-mono-cafe text-[10px] uppercase tracking-[.18em] text-[#e7a780]">Hours</p><p className="mt-3 leading-6">Mon–Fri · 7am–4pm<br />Sat–Sun · 8am–4pm</p></div>
            </div>
          </div>
          <div className="relative min-h-[330px] overflow-hidden border border-[#f8f2e9]/20 bg-[#4b372d]">
            <div className="absolute inset-0 opacity-35" style={{ backgroundImage: 'linear-gradient(90deg, transparent 49%, rgba(248,242,233,.18) 50%, transparent 51%), linear-gradient(0deg, transparent 49%, rgba(248,242,233,.18) 50%, transparent 51%)', backgroundSize: '62px 62px' }} />
            <div className="absolute left-[52%] top-[47%] flex -translate-x-1/2 -translate-y-1/2 flex-col items-center"><span className="flex h-14 w-14 items-center justify-center rounded-full bg-[#e7a780] font-display text-2xl text-[#33251e]">M</span><span className="mt-3 whitespace-nowrap rounded-full bg-[#33251e] px-3 py-1 font-mono-cafe text-[9px] uppercase tracking-[.15em]">88 Willow Street</span></div>
            <a href="https://maps.google.com/?q=88+Willow+Street+Portland+OR" target="_blank" rel="noreferrer" data-testid="link-open-map" className="absolute bottom-5 right-5 flex items-center gap-2 font-mono-cafe text-[10px] uppercase tracking-[.16em] text-[#f8f2e9]">Open in maps <ArrowUpRight size={14} /></a>
          </div>
        </div>
      </section>

      <section className="bg-[#e7a780] px-5 py-20 text-[#33251e] sm:px-8 sm:py-24 lg:px-12">
        <div className="mx-auto flex max-w-[1260px] flex-col justify-between gap-9 lg:flex-row lg:items-end">
          <div><p className="font-mono-cafe text-[10px] uppercase tracking-[.24em] text-[#8e432d]">A note from the counter</p><h2 className="mt-4 max-w-2xl font-display text-5xl leading-[.9] tracking-[-.045em] sm:text-7xl">Get the good word,<br /><em className="font-normal">occasionally.</em></h2></div>
          {subscribed ? <p data-testid="status-subscribed" className="max-w-sm border-b border-[#8e432d]/40 pb-3 font-display text-2xl italic">You&apos;re on the list. See you in the morning.</p> : <form onSubmit={handleSubscribe} className="flex w-full max-w-md border-b border-[#8e432d]/60 pb-3"><input value={newsletterEmail} onChange={(event) => setNewsletterEmail(event.target.value)} required type="email" placeholder="Your email address" aria-label="Email address" data-testid="input-newsletter-email" className="min-w-0 flex-1 bg-transparent font-mono-cafe text-xs outline-none placeholder:text-[#8e432d]/65" /><button type="submit" data-testid="button-subscribe" className="flex items-center gap-2 font-mono-cafe text-[10px] uppercase tracking-[.15em]">Sign me up <ArrowUpRight size={14} /></button></form>}
        </div>
      </section>

      <footer className="bg-[#f3eee6] px-5 py-10 sm:px-8 lg:px-12">
        <div className="mx-auto grid max-w-[1260px] gap-10 border-b border-[#d2c3ae] pb-10 sm:grid-cols-3">
          <div><a href="#top" data-testid="link-footer-home" className="font-display text-3xl tracking-[-.04em]">Morrow <span className="text-[#b45a3c]">&amp;</span> Mug</a><p className="mt-3 max-w-[220px] text-sm leading-6 text-[#786b60]">A neighborhood cafe for good coffee and unhurried mornings.</p></div>
          <div><p className="font-mono-cafe text-[10px] uppercase tracking-[.18em] text-[#b45a3c]">Explore</p><div className="mt-4 flex flex-col gap-2 text-sm text-[#786b60]"><a href="#menu" data-testid="link-footer-menu" className="hover:text-[#b45a3c]">Menu</a><a href="#story" data-testid="link-footer-story" className="hover:text-[#b45a3c]">Our story</a><a href="#visit" data-testid="link-footer-visit" className="hover:text-[#b45a3c]">Visit us</a></div></div>
          <div className="sm:text-right"><p className="font-mono-cafe text-[10px] uppercase tracking-[.18em] text-[#b45a3c]">Keep in touch</p><a href="https://www.instagram.com" target="_blank" rel="noreferrer" data-testid="link-instagram" className="mt-4 inline-flex items-center gap-2 text-sm text-[#786b60] hover:text-[#b45a3c]"><Instagram size={16} /> @morrowandmug</a></div>
        </div>
        <div className="mx-auto flex max-w-[1260px] flex-col justify-between gap-3 pt-5 font-mono-cafe text-[9px] uppercase tracking-[.15em] text-[#968879] sm:flex-row"><span>© 2024 Morrow &amp; Mug</span><span>Made slowly in Portland</span></div>
      </footer>

      {bookingOpen && (
        <div className="fixed inset-0 z-[60] flex items-center justify-center bg-[#33251e]/75 p-5 backdrop-blur-sm" role="dialog" aria-modal="true" aria-labelledby="booking-title">
          <div className="relative w-full max-w-md bg-[#f3eee6] p-7 text-[#33251e] shadow-2xl sm:p-10">
            <button onClick={() => setBookingOpen(false)} data-testid="button-close-booking" className="absolute right-5 top-5 text-[#786b60] hover:text-[#33251e]" aria-label="Close booking dialog"><X size={19} /></button>
            <p className="font-mono-cafe text-[10px] uppercase tracking-[.2em] text-[#b45a3c]">A little planning</p>
            <h2 id="booking-title" className="mt-3 font-display text-5xl leading-[.9]">Save a seat.</h2>
            <p className="mt-4 text-sm leading-6 text-[#786b60]">We hold a few tables each day for people who like to plan ahead. Tell us when you&apos;re coming and we&apos;ll take it from there.</p>
            <form onSubmit={(event) => { event.preventDefault(); setBookingOpen(false); }} className="mt-7 grid gap-4">
              <input required placeholder="Your name" data-testid="input-booking-name" className="border-b border-[#cdbfac] bg-transparent px-0 py-3 text-sm outline-none placeholder:text-[#968879] focus:border-[#b45a3c]" />
              <div className="grid grid-cols-2 gap-4"><input required type="date" data-testid="input-booking-date" className="border-b border-[#cdbfac] bg-transparent px-0 py-3 text-sm outline-none focus:border-[#b45a3c]" /><select data-testid="select-booking-time" className="border-b border-[#cdbfac] bg-transparent px-0 py-3 text-sm outline-none focus:border-[#b45a3c]"><option>9:00 am</option><option>10:30 am</option><option>12:00 pm</option><option>1:30 pm</option></select></div>
              <button type="submit" data-testid="button-submit-booking" className="mt-3 flex items-center justify-center gap-2 bg-[#b45a3c] px-5 py-3.5 font-mono-cafe text-[10px] uppercase tracking-[.18em] text-[#f3eee6] transition-colors hover:bg-[#8e432d]">Request a table <ArrowUpRight size={15} /></button>
            </form>
          </div>
        </div>
      )}
    </main>
  );
}

function Router() {
  return (
    <RoutedErrorBoundary>
      <Switch>
        <Route path="/" component={Home} />
        <Route component={NotFound} />
      </Switch>
    </RoutedErrorBoundary>
  );
}

function RoutedErrorBoundary({ children }: { children: ReactNode }) {
  const [location] = useLocation();
  return <ErrorBoundary resetKey={location}>{children}</ErrorBoundary>;
}

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <WouterRouter base={import.meta.env.BASE_URL.replace(/\/$/, '')}><Router /></WouterRouter>
        <Toaster />
      </TooltipProvider>
    </QueryClientProvider>
  );
}

export default App;