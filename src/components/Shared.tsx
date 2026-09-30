import { AnimatePresence, motion } from 'framer-motion'
import { ArrowRight, Check, ChevronDown, Heart, MapPin, Menu, Moon, Phone, ShieldCheck, Sparkles, Sun, X } from 'lucide-react'
import { useState, type FormEvent, type ReactNode } from 'react'
import { Link, NavLink } from 'react-router-dom'
import type { Vehicle } from '../data/dealershipData'
import { useMarketplace } from '../context/MarketplaceContext'
import { useTheme } from '../context/ThemeContext'
import { money } from '../lib/format'

export function Navbar() {
  const { saved } = useMarketplace()
  const { theme, toggleTheme } = useTheme()
  const [open, setOpen] = useState(false)
  const links = [
    { to: '/inventory', label: 'Inventory' },
    { to: '/finance', label: 'Financing' },
    { to: '/sell', label: 'Sell or trade' },
    { to: '/contact', label: 'Visit us' },
  ]

  return (
    <header className="header">
      <div className="shell header-inner">
        <Link className="brand" to="/" onClick={() => setOpen(false)} aria-label="Northline Motor Co. home">
          <span className="brand-mark">N</span><span>NORTHLINE <span style={{ fontWeight: 500 }}>MOTOR CO.</span></span>
        </Link>
        <nav className="nav-links" aria-label="Main navigation">
          {links.map((link) => <NavLink key={link.to} to={link.to} className={({ isActive }) => isActive ? 'active' : ''}>{link.label}</NavLink>)}
        </nav>
        <div className="header-actions">
          <button className="icon-button" type="button" aria-label={`Switch to ${theme === 'light' ? 'dark' : 'light'} mode`} title={`Switch to ${theme === 'light' ? 'dark' : 'light'} mode`} aria-pressed={theme === 'dark'} onClick={toggleTheme}>{theme === 'light' ? <Moon size={17} /> : <Sun size={17} />}</button>
          <Link className="icon-button" to="/inventory?saved=1" aria-label={`Saved vehicles, ${saved.length} saved`} title="Saved vehicles"><Heart size={17} fill={saved.length ? 'currentColor' : 'none'} />{saved.length > 0 && <span style={{ position: 'absolute', margin: '-27px 0 0 26px', display: 'grid', placeItems: 'center', width: 16, height: 16, borderRadius: '50%', background: '#2457e6', color: '#fff', fontSize: 9 }}>{saved.length}</span>}</Link>
          <Link className="button button-primary" to="/sell">Get an offer <ArrowRight size={15} /></Link>
          <button className="icon-button mobile-menu" type="button" aria-label={open ? 'Close navigation' : 'Open navigation'} onClick={() => setOpen(!open)}>{open ? <X size={19} /> : <Menu size={19} />}</button>
        </div>
        <AnimatePresence>
          {open && <motion.nav className="mobile-drawer" aria-label="Mobile navigation" initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: 'auto' }} exit={{ opacity: 0, height: 0 }}>
            {links.map((link) => <Link key={link.to} to={link.to} onClick={() => setOpen(false)}>{link.label}<ArrowRight size={14} /></Link>)}
            <Link to="/inventory?saved=1" onClick={() => setOpen(false)}>Saved vehicles ({saved.length})<Heart size={14} /></Link>
          </motion.nav>}
        </AnimatePresence>
      </div>
    </header>
  )
}

export function Footer() {
  return (
    <footer className="footer">
      <div className="shell">
        <div className="footer-grid">
          <div>
            <Link className="brand" to="/" style={{ color: '#fff' }}><span className="brand-mark" style={{ background: '#d6e1cb', color: '#202724' }}>N</span>NORTHLINE MOTOR CO.</Link>
            <p style={{ maxWidth: 250, marginTop: 17 }}>A better kind of car buying. Thoughtfully selected, honestly priced, and always on your side.</p>
          </div>
          <div><h4>Explore</h4><div className="footer-links"><Link to="/inventory">All vehicles</Link><Link to="/sell">Sell your car</Link><Link to="/finance">Get pre-approved</Link></div></div>
          <div><h4>Northline</h4><div className="footer-links"><Link to="/contact">Our locations</Link><Link to="/contact">Contact our team</Link><Link to="/contact">Visit the showroom</Link></div></div>
          <div><h4>Come say hello</h4><p><MapPin size={13} style={{ display: 'inline', verticalAlign: 'middle' }} /> 4100 W Lake Street<br />Chicago, IL 60624</p><p><Phone size={13} style={{ display: 'inline', verticalAlign: 'middle' }} /> (312) 555-0148</p></div>
        </div>
        <div className="footer-bottom"><span>© 2026 Northline Motor Co.</span><span>Clear prices. Good people. Better drives.</span></div>
      </div>
    </footer>
  )
}

export function VehicleCard({ vehicle, index = 0 }: { vehicle: Vehicle; index?: number }) {
  const { saved, toggleSaved } = useMarketplace()
  const isSaved = saved.includes(vehicle.id)
  return (
    <motion.article className="vehicle-card" initial={{ opacity: 0, y: 22 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true, amount: 0.15 }} transition={{ duration: 0.5, delay: (index % 3) * 0.08, ease: 'easeOut' }}>
      <Link className="vehicle-card-photo" to={`/inventory/${vehicle.id}`} aria-label={`View ${vehicle.year} ${vehicle.make} ${vehicle.model}`}>
        <img className="card-image" src={vehicle.image} alt={`${vehicle.year} ${vehicle.make} ${vehicle.model}`} loading="lazy" />
        <span className={`badge ${vehicle.condition === 'New' ? 'badge-blue' : ''}`}>{vehicle.condition === 'Certified' ? 'Northline certified' : vehicle.condition}</span>
      </Link>
      <button className="icon-button save-button" type="button" aria-label={isSaved ? 'Remove from saved vehicles' : 'Save vehicle'} title={isSaved ? 'Remove from saved' : 'Save vehicle'} onClick={() => toggleSaved(vehicle.id)}><Heart size={16} fill={isSaved ? 'currentColor' : 'none'} color={isSaved ? '#2457e6' : 'currentColor'} /></button>
      <div className="vehicle-card-content">
        <div className="eyebrow">{vehicle.badge}</div>
        <Link to={`/inventory/${vehicle.id}`}><h3 className="vehicle-card-title">{vehicle.year} {vehicle.make} {vehicle.model}</h3></Link>
        <div className="vehicle-meta"><span>{vehicle.mileage.toLocaleString()} mi</span><span>{vehicle.fuelType}</span><span>{vehicle.body}</span></div>
        <div className="vehicle-card-foot"><div><div className="price">{money(vehicle.price)}</div><div className="payment-note">Est. {money(Math.round(vehicle.price * .016))}/mo</div></div><Link className="icon-button" to={`/inventory/${vehicle.id}`} aria-label={`View ${vehicle.make} ${vehicle.model}`}><ArrowRight size={16} /></Link></div>
      </div>
    </motion.article>
  )
}

function monthlyPayment(principal: number, apr: number, months: number) {
  const rate = apr / 1200
  return rate === 0 ? principal / months : principal * rate / (1 - (1 + rate) ** -months)
}

export function FinanceCalculator({ price, initialTrade = 0 }: { price: number; initialTrade?: number }) {
  const [down, setDown] = useState(Math.round(price * .1))
  const [trade, setTrade] = useState(initialTrade)
  const [months, setMonths] = useState(60)
  const [apr, setApr] = useState(6.9)
  const payment = monthlyPayment(Math.max(0, price - down - trade), apr, months)
  return (
    <section className="finance-box">
      <span className="eyebrow">Your estimate</span>
      <h2>Make it yours.</h2>
      <div className="big-payment">{money(Math.round(payment))}<small> / month</small></div>
      <div className="slider-field"><div className="slider-heading"><span>Down payment</span><strong>{money(down)}</strong></div><input className="calculator-range" type="range" min="0" max={Math.round(price * .5)} step="500" value={down} onChange={(event) => setDown(Number(event.target.value))} /></div>
      <div className="slider-field"><div className="slider-heading"><span>Trade-in credit</span><strong>{money(trade)}</strong></div><input className="calculator-range" type="range" min="0" max="30000" step="500" value={trade} onChange={(event) => setTrade(Number(event.target.value))} /></div>
      <label className="field-label">Loan term<select className="field" value={months} onChange={(event) => setMonths(Number(event.target.value))}><option value="36">36 months</option><option value="48">48 months</option><option value="60">60 months</option><option value="72">72 months</option><option value="84">84 months</option></select></label>
      <label className="field-label" style={{ marginTop: 13 }}>Estimated APR <span style={{ color: '#202321' }}>{apr.toFixed(1)}%</span><input className="calculator-range" type="range" min="3" max="14" step="0.1" value={apr} onChange={(event) => setApr(Number(event.target.value))} /></label>
      <p className="finance-disclaimer" style={{ marginTop: 16 }}>Illustrative estimate only. Taxes, title, fees, and lender approval are not included.</p>
      <Link className="button button-primary" to="/finance" style={{ width: '100%', marginTop: 16 }}>Explore financing <ArrowRight size={15} /></Link>
    </section>
  )
}

type ModalProps = { open: boolean; onClose: () => void; title: string; children?: ReactNode }

function ModalShell({ open, onClose, title, children }: ModalProps) {
  return <AnimatePresence>{open && <motion.div className="modal-backdrop" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} onMouseDown={(event) => { if (event.target === event.currentTarget) onClose() }}>
    <motion.section className="modal" role="dialog" aria-modal="true" aria-label={title} initial={{ opacity: 0, y: 18, scale: .98 }} animate={{ opacity: 1, y: 0, scale: 1 }} exit={{ opacity: 0, y: 12, scale: .98 }} transition={{ duration: .2 }}>
      <button className="icon-button modal-close" type="button" aria-label="Close dialog" onClick={onClose}><X size={17} /></button>{children}
    </motion.section>
  </motion.div>}</AnimatePresence>
}

export function TestDriveModal({ open, onClose, vehicleName }: { open: boolean; onClose: () => void; vehicleName: string }) {
  const [submitted, setSubmitted] = useState(false)
  const submit = (event: FormEvent<HTMLFormElement>) => { event.preventDefault(); setSubmitted(true) }
  return <ModalShell open={open} onClose={onClose} title="Schedule a test drive">
    {submitted ? <div className="modal-success"><Check size={34} /><span className="eyebrow">You're on the calendar</span><h2>We'll be in touch.</h2><p>A Northline specialist will confirm your visit shortly.</p><button className="button button-dark" type="button" onClick={onClose}>Done</button></div> : <><span className="eyebrow">Come take the long way</span><h2>Schedule a test drive</h2><p>Choose a time that works. We’ll have the {vehicleName} ready when you arrive.</p><form className="modal-form" onSubmit={submit}><label className="field-label">Your name<input className="field" required placeholder="Full name" /></label><label className="field-label">Email address<input className="field" type="email" required placeholder="you@example.com" /></label><label className="field-label">Preferred time<input className="field" type="datetime-local" required /></label><button className="button button-primary" type="submit">Request a time <ArrowRight size={15} /></button></form></>}
  </ModalShell>
}

export function OfferModal({ open, onClose }: { open: boolean; onClose: () => void }) {
  const [submitted, setSubmitted] = useState(false)
  const submit = (event: FormEvent<HTMLFormElement>) => { event.preventDefault(); setSubmitted(true) }
  return <ModalShell open={open} onClose={onClose} title="Schedule an offer inspection">
    {submitted ? <div className="modal-success"><Check size={34} /><span className="eyebrow">Request received</span><h2>We'll take it from here.</h2><p>Our buying team will reach out to confirm your inspection.</p><button className="button button-dark" type="button" onClick={onClose}>Done</button></div> : <><span className="eyebrow">A real offer, in person</span><h2>Schedule your inspection</h2><p>Bring your car by for a quick, no-pressure condition check. Your estimate is valid for seven days.</p><form className="modal-form" onSubmit={submit}><label className="field-label">Your name<input className="field" required placeholder="Full name" /></label><label className="field-label">Email address<input className="field" type="email" required placeholder="you@example.com" /></label><label className="field-label">Preferred day<input className="field" type="date" required /></label><button className="button button-primary" type="submit">Request inspection <ArrowRight size={15} /></button></form></>}
  </ModalShell>
}

export function TrustNote({ children }: { children: ReactNode }) {
  return <div className="trust-item"><ShieldCheck size={18} /><span>{children}</span></div>
}

export function SmallChevron() {
  return <ChevronDown size={13} />
}

export function MarketConfidence() {
  return <div className="badge badge-blue"><Sparkles size={12} /> Thoughtfully selected</div>
}
