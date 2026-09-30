import { AnimatePresence, motion } from 'framer-motion'
import { ArrowDownRight, ArrowLeft, ArrowRight, ArrowUpRight, BadgeCheck, CarFront, Check, ChevronRight, CircleHelp, Clock3, CreditCard, Grid2X2, HandCoins, Heart, List, Mail, MapPin, Phone, ShieldCheck, Sparkles, Upload, Wallet, Wrench } from 'lucide-react'
import { useMemo, useState, type FormEvent } from 'react'
import { Link, useLocation, useNavigate, useParams, useSearchParams } from 'react-router-dom'
import { vehicles, type Vehicle } from '../data/dealershipData'
import { FinanceCalculator, MarketConfidence, OfferModal, TestDriveModal, TrustNote, VehicleCard } from '../components/Shared'
import { Reveal } from '../components/Reveal'
import { useMarketplace } from '../context/MarketplaceContext'
import { money } from '../lib/format'

const services = [
  { title: 'Financing that fits', text: 'Clear options from a network of trusted lenders, with no pressure and no surprises.', icon: CreditCard, to: '/finance' },
  { title: 'Certified, considered', text: 'Every certified car earns its place with a 160-point inspection and thoughtful coverage.', icon: BadgeCheck, to: '/inventory' },
  { title: 'At your doorstep', text: 'Choose a relaxed showroom visit or have your next car delivered to your driveway.', icon: CarFront, to: '/contact' },
  { title: 'Sell on your terms', text: 'A fair, transparent offer for your car. Keep the cash or put it toward something new.', icon: HandCoins, to: '/sell' },
]

export function Home() {
  const navigate = useNavigate()
  const [mode, setMode] = useState<'buy' | 'sell'>('buy')
  const [search, setSearch] = useState('')
  const [vin, setVin] = useState('')
  const submitSearch = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    if (mode === 'sell') navigate('/sell', { state: { vin: search } })
    else navigate(`/inventory?q=${encodeURIComponent(search)}`)
  }
  const submitValuation = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    navigate('/sell', { state: { vin } })
  }
  return <>
    <section className="hero">
      <div className="hero-content fade-up">
        <div className="hero-kicker">A different kind of dealership</div>
        <h1>Find your next<br />favorite road.</h1>
        <p className="hero-copy">Good cars. Good people. A better way to get where you’re going.</p>
        <div className="hero-actions"><Link className="button button-primary" to="/inventory">Browse showroom <ArrowRight size={15} /></Link><Link className="button button-outline" to="/sell">Sell your car <ArrowUpRight size={15} /></Link></div>
      </div>
      <div className="search-panel">
        <div className="search-tabs"><button className={mode === 'buy' ? 'selected' : ''} type="button" onClick={() => setMode('buy')}>Buy a car</button><button className={mode === 'sell' ? 'selected' : ''} type="button" onClick={() => setMode('sell')}>Sell or trade</button></div>
        <form className="hero-search" onSubmit={submitSearch}><input aria-label={mode === 'buy' ? 'Search make or model' : 'Enter VIN or license plate'} placeholder={mode === 'buy' ? 'Search by make, model, or body style' : 'Enter VIN or license plate to start'} value={search} onChange={(event) => setSearch(event.target.value)} /><button className="button button-primary" type="submit">{mode === 'buy' ? 'Find a car' : 'Get my offer'} <ArrowRight size={14} /></button></form>
      </div>
    </section>

    <Reveal><section className="shell section-pad">
      <div className="section-head"><div><span className="eyebrow">The Northline collection</span><h2>Good things, in good company.</h2><p>A considered collection of new, certified, and pre-loved cars. Every one ready for what’s next.</p></div><Link className="text-link" to="/inventory">Explore all vehicles <ArrowRight size={16} /></Link></div>
      <div className="vehicle-grid">{vehicles.slice(0, 3).map((vehicle, index) => <VehicleCard key={vehicle.id} vehicle={vehicle} index={index} />)}</div>
    </section></Reveal>

    <Reveal><section className="service-band section-pad"><div className="shell"><div className="section-head"><div><span className="eyebrow">The details matter</span><h2>More than the keys.</h2></div><p>From the first question to the first road trip, we're here to make the whole thing feel a little easier.</p></div><div className="service-grid">{services.map(({ title, text, icon: Icon, to }) => <Link className="service-item" to={to} key={title}><div className="service-icon"><Icon size={19} /></div><h3>{title}</h3><p>{text}</p></Link>)}</div></div></section></Reveal>

    <Reveal><section className="shell section-pad" style={{ paddingBottom: 0 }}><div className="valuation"><div className="valuation-copy"><span className="eyebrow">Your car has a next chapter</span><h2>What’s your car worth to you?</h2><p>Get a real, no-obligation estimate in minutes. Keep the cash, or put it toward a Northline favorite.</p></div><form className="valuation-form" onSubmit={submitValuation}><label className="field-label" style={{ color: '#e2e8df' }}>VIN or license plate<input className="field" required placeholder="Enter VIN or plate number" value={vin} onChange={(event) => setVin(event.target.value)} /></label><button className="button button-primary" style={{ width: '100%' }} type="submit">See my estimate <ArrowRight size={15} /></button><small>No commitment. No awkward conversations. Just a good place to start.</small></form></div></section></Reveal>

    <Reveal><section className="shell section-pad"><div className="section-head"><div><span className="eyebrow">Good words travel</span><h2>People leave happy here.</h2></div><div className="badge"><Sparkles size={12} /> 4.9 / 5 from 1,200+ neighbors</div></div><div className="review-grid"><article className="review review-featured"><div className="stars">★★★★★</div><blockquote>“It felt less like buying a car and more like finding the right one with a friend.”</blockquote><cite>— Maya R. · 2024 Volvo XC90</cite></article><article className="review"><div className="stars">★★★★★</div><blockquote>“A genuinely fair offer. The whole sale took less than an hour.”</blockquote><cite>— Jordan P. · Seller</cite></article><article className="review"><div className="stars">★★★★★</div><blockquote>“Transparent numbers, thoughtful people, and a beautiful car.”</blockquote><cite>— Devon L. · 2023 Porsche 911</cite></article></div></section></Reveal>
  </>
}

const filterConditions: Vehicle['condition'][] = ['New', 'Certified', 'Used']
const fuelTypes = ['Gas', 'Hybrid', 'EV']

export function Inventory() {
  const [params, setParams] = useSearchParams()
  const { saved } = useMarketplace()
  const [selectedConditions, setSelectedConditions] = useState<Vehicle['condition'][]>([])
  const [selectedFuel, setSelectedFuel] = useState<string[]>([])
  const [make, setMake] = useState('Any make')
  const [model, setModel] = useState('Any model')
  const [year, setYear] = useState(0)
  const [maxPrice, setMaxPrice] = useState(160000)
  const [maxMileage, setMaxMileage] = useState(50000)
  const [sort, setSort] = useState('recommended')
  const [view, setView] = useState<'grid' | 'list'>('grid')
  const [query, setQuery] = useState(params.get('q') ?? '')
  const savedOnly = params.get('saved') === '1'
  const makes = Array.from(new Set(vehicles.map((vehicle) => vehicle.make))).sort()
  const models = Array.from(new Set(vehicles.map((vehicle) => vehicle.model))).sort()
  const years = Array.from(new Set(vehicles.map((vehicle) => vehicle.year))).sort((a, b) => b - a)
  const visible = useMemo(() => {
    const filtered = vehicles.filter((vehicle) => {
      const text = `${vehicle.year} ${vehicle.make} ${vehicle.model} ${vehicle.trim} ${vehicle.body}`.toLowerCase()
      return (!savedOnly || saved.includes(vehicle.id)) && (!query || text.includes(query.toLowerCase())) && (!selectedConditions.length || selectedConditions.includes(vehicle.condition)) && (!selectedFuel.length || selectedFuel.includes(vehicle.fuelType)) && (make === 'Any make' || vehicle.make === make) && (model === 'Any model' || vehicle.model === model) && (!year || vehicle.year === year) && vehicle.price <= maxPrice && vehicle.mileage <= maxMileage
    })
    if (sort === 'price-low') filtered.sort((a, b) => a.price - b.price)
    if (sort === 'price-high') filtered.sort((a, b) => b.price - a.price)
    if (sort === 'year') filtered.sort((a, b) => b.year - a.year)
    if (sort === 'mileage') filtered.sort((a, b) => a.mileage - b.mileage)
    return filtered
  }, [make, maxMileage, maxPrice, model, query, saved, savedOnly, selectedConditions, selectedFuel, sort, year])
  const toggle = <T,>(items: T[], item: T, update: (next: T[]) => void) => update(items.includes(item) ? items.filter((value) => value !== item) : [...items, item])
  const clear = () => { setSelectedConditions([]); setSelectedFuel([]); setMake('Any make'); setModel('Any model'); setYear(0); setMaxPrice(160000); setMaxMileage(50000); setQuery(''); setParams({}) }

  return <div className="shell"><div className="page-intro"><span className="eyebrow">Northline inventory</span><h1>{savedOnly ? 'Your saved collection.' : 'A better kind of showroom.'}</h1><p>Every car has a story. Find the one that feels like the start of yours.</p></div>
    <div className="inventory-layout"><aside className="filter-panel"><div className="filter-title">Refine your search <button className="text-link" type="button" onClick={clear} style={{ fontSize: 10 }}>Reset</button></div>
      <div className="filter-group"><h3>Condition</h3>{filterConditions.map((item) => <label className="filter-check" key={item}><input type="checkbox" checked={selectedConditions.includes(item)} onChange={() => toggle(selectedConditions, item, setSelectedConditions)} />{item === 'Certified' ? 'Northline certified' : item}</label>)}</div>
      <div className="filter-group"><h3>Make</h3><select className="field" value={make} onChange={(event) => setMake(event.target.value)}><option>Any make</option>{makes.map((item) => <option key={item}>{item}</option>)}</select></div>
      <div className="filter-group"><h3>Model</h3><select className="field" value={model} onChange={(event) => setModel(event.target.value)}><option>Any model</option>{models.map((item) => <option key={item}>{item}</option>)}</select></div>
      <div className="filter-group"><h3>Year</h3><select className="field" value={year} onChange={(event) => setYear(Number(event.target.value))}><option value="0">Any year</option>{years.map((item) => <option key={item} value={item}>{item}</option>)}</select></div>
      <div className="filter-group"><h3>Price range</h3><div className="range-row"><span>Up to</span><strong>{money(maxPrice)}</strong></div><input className="range-input" type="range" min="30000" max="160000" step="1000" value={maxPrice} onChange={(event) => setMaxPrice(Number(event.target.value))} /></div>
      <div className="filter-group"><h3>Maximum mileage</h3><div className="range-row"><span>Any</span><strong>{maxMileage.toLocaleString()} mi</strong></div><input className="range-input" type="range" min="5000" max="50000" step="1000" value={maxMileage} onChange={(event) => setMaxMileage(Number(event.target.value))} /></div>
      <div className="filter-group"><h3>Fuel type</h3>{fuelTypes.map((item) => <label className="filter-check" key={item}><input type="checkbox" checked={selectedFuel.includes(item)} onChange={() => toggle(selectedFuel, item, setSelectedFuel)} />{item}</label>)}</div>
      <div className="filter-group"><h3>Transmission</h3><label className="filter-check"><input type="checkbox" checked readOnly />Automatic</label><label className="filter-check"><input type="checkbox" disabled />Manual</label></div>
    </aside>
    <section><div className="inventory-toolbar"><p><strong>{visible.length}</strong> thoughtfully selected vehicles{savedOnly ? ` · ${saved.length} saved` : ''}</p><div className="toolbar-controls"><label className="sr-only" htmlFor="inventory-search">Search inventory</label><input id="inventory-search" className="field" style={{ width: 190, height: 38, fontSize: 11 }} placeholder="Search make or model" value={query} onChange={(event) => setQuery(event.target.value)} /><select aria-label="Sort vehicles" value={sort} onChange={(event) => setSort(event.target.value)}><option value="recommended">Recommended</option><option value="price-low">Price: low to high</option><option value="price-high">Price: high to low</option><option value="year">Newest year</option><option value="mileage">Lowest mileage</option></select><div className="view-toggle"><button type="button" className={view === 'grid' ? 'active' : ''} aria-label="Grid view" onClick={() => setView('grid')}><Grid2X2 size={15} /></button><button type="button" className={view === 'list' ? 'active' : ''} aria-label="List view" onClick={() => setView('list')}><List size={16} /></button></div></div></div>
      {visible.length ? <div className={`vehicle-grid ${view === 'list' ? 'list-view' : ''}`}>{visible.map((vehicle, index) => <VehicleCard key={vehicle.id} vehicle={vehicle} index={index} />)}</div> : <div className="empty-state"><CarFront size={24} style={{ margin: '0 auto 14px' }} /><h2>Nothing in this lane just yet.</h2><p style={{ color: '#737872', fontSize: 12 }}>Try adjusting your filters or reset your search.</p><button className="button button-outline" type="button" onClick={clear} style={{ marginTop: 12 }}>Clear filters</button></div>}
    </section></div></div>
}

export function VehicleDetail() {
  const { id } = useParams()
  const navigate = useNavigate()
  const vehicle = vehicles.find((item) => item.id === id)
  const [selectedImage, setSelectedImage] = useState(0)
  const [driveMode, setDriveMode] = useState(false)
  const [testDriveOpen, setTestDriveOpen] = useState(false)
  const { saved, toggleSaved } = useMarketplace()
  if (!vehicle) return <div className="shell page-intro"><h1>That car has moved on.</h1><Link className="button button-primary" to="/inventory">Back to inventory</Link></div>
  const applyTrade = () => navigate('/sell', { state: { vehicleId: vehicle.id } })
  return <>
    <div className="shell"><div className="detail-top"><Link to="/inventory">Inventory</Link><ChevronRight size={12} style={{ verticalAlign: 'middle', margin: '0 5px' }} />{vehicle.year} {vehicle.make} {vehicle.model}</div>
      <div className="detail-title-row"><div><span className="eyebrow">{vehicle.condition === 'Certified' ? 'Northline certified' : vehicle.condition} · Stock {vehicle.stock}</span><h1>{vehicle.year} {vehicle.make} {vehicle.model}</h1><div style={{ color: '#727971', fontSize: 12 }}>{vehicle.trim} · {vehicle.mileage.toLocaleString()} miles · {vehicle.location}</div></div><div style={{ display: 'flex', alignItems: 'center', gap: 12 }}><span className="price">{money(vehicle.price)}</span><button className="icon-button" type="button" title={saved.includes(vehicle.id) ? 'Remove saved vehicle' : 'Save vehicle'} aria-label="Save vehicle" onClick={() => toggleSaved(vehicle.id)}><Heart size={17} fill={saved.includes(vehicle.id) ? '#2457e6' : 'none'} color={saved.includes(vehicle.id) ? '#2457e6' : 'currentColor'} /></button></div></div>
      <div className="gallery"><div className="gallery-main"><img src={driveMode ? vehicle.images[1] : vehicle.images[selectedImage]} alt={`${vehicle.year} ${vehicle.make} ${vehicle.model} view ${selectedImage + 1}`} /><button className="gallery-caption" type="button" onClick={() => setDriveMode(!driveMode)}>{driveMode ? 'Exterior view' : 'Explore cabin view'} <ArrowUpRight size={13} style={{ verticalAlign: 'middle' }} /></button></div><div className="gallery-aside">{vehicle.images.slice(1, 3).map((image, index) => <button key={image} type="button" onClick={() => { setSelectedImage(index + 1); setDriveMode(false) }} style={{ padding: 0, border: 0, cursor: 'pointer' }} aria-label={`View photo ${index + 2}`}><img src={image} alt={`${vehicle.make} ${vehicle.model} alternate view`} /></button>)}</div></div>
      <div style={{ display: 'flex', gap: 7, marginTop: 9 }}>{vehicle.images.map((_, index) => <button key={index} type="button" onClick={() => { setSelectedImage(index); setDriveMode(false) }} aria-label={`Show gallery image ${index + 1}`} style={{ width: 27, height: 3, border: 0, background: index === selectedImage ? '#2457e6' : '#cfd3ca' }} />)}</div>
      <div className="detail-layout"><div><section className="detail-section"><h2>A few good details</h2><div className="spec-grid">{[['Engine', vehicle.engine], ['Power', `${vehicle.horsepower} hp`], ['Torque', vehicle.torque], ['Efficiency', vehicle.mpg], ['Drivetrain', vehicle.drivetrain], ['Transmission', vehicle.transmission], ['VIN', vehicle.vin], ['Stock number', vehicle.stock], ['Fuel', vehicle.fuelType]].map(([label, value]) => <div key={label}><span className="spec-label">{label}</span><span className="spec-value">{value}</span></div>)}</div></section><section className="detail-section"><h2>Thoughtful touches</h2><div className="features-list">{vehicle.features.map((feature) => <span className="feature-chip" key={feature}>{feature}</span>)}</div></section><section className="detail-section"><h2>Northline certified</h2><p style={{ color: '#737872', fontSize: 12, lineHeight: 1.8 }}>Every Northline certified vehicle passes a 160-point inspection, arrives with a clean history report, and includes 90 days of complimentary coverage. This one is ready to meet you.</p><TrustNote>160-point inspection, completed and documented</TrustNote><TrustNote>Vehicle history report included</TrustNote></section><div style={{ display: 'flex', flexWrap: 'wrap', gap: 10, paddingTop: 23 }}><button className="button button-primary" type="button" onClick={() => setTestDriveOpen(true)}>Schedule test drive <ArrowRight size={15} /></button><button className="button button-outline" type="button" onClick={applyTrade}>Apply trade-in credit <ArrowDownRight size={15} /></button></div></div><FinanceCalculator price={vehicle.price} /></div>
    </div><TestDriveModal open={testDriveOpen} onClose={() => setTestDriveOpen(false)} vehicleName={`${vehicle.year} ${vehicle.make} ${vehicle.model}`} />
  </>
}

const stepTitles = ['Your vehicle', 'Condition', 'A few photos', 'Choose your offer', 'Your estimate']
const conditionMultipliers = { Fair: .78, Good: .94, Excellent: 1.04 }
type SellWizardState = { vin: string; year: string; make: string; model: string; mileage: string; condition: keyof typeof conditionMultipliers; title: string; offerType: 'cash' | 'trade'; flags: string[] }

export function SellCar() {
  const location = useLocation()
  const [step, setStep] = useState(1)
  const [state, setState] = useState<SellWizardState>({ vin: location.state?.vin ?? '', year: '2021', make: '', model: '', mileage: '', condition: 'Good', title: 'Yes, in hand', offerType: 'cash', flags: [] })
  const [offerOpen, setOfferOpen] = useState(false)
  const selectedVehicle = vehicles.find((vehicle) => vehicle.id === location.state?.vehicleId)
  const update = <K extends keyof SellWizardState,>(key: K, value: SellWizardState[K]) => setState((current) => ({ ...current, [key]: value }))
  const estimate = useMemo(() => {
    const year = Number(state.year) || 2021
    const miles = Number(state.mileage) || 45000
    const base = Math.max(6500, 38000 - Math.max(0, 2026 - year) * 2150 - miles * .085)
    return Math.round(base * conditionMultipliers[state.condition] * (state.offerType === 'trade' ? 1.06 : 1) / 100) * 100
  }, [state.condition, state.mileage, state.offerType, state.year])
  const next = () => setStep((current) => Math.min(5, current + 1))
  const previous = () => setStep((current) => Math.max(1, current - 1))
  const toggleFlag = (item: string) => update('flags', state.flags.includes(item) ? state.flags.filter((flag) => flag !== item) : [...state.flags, item])
  return <div className="shell"><div className="page-intro"><span className="eyebrow">A good next step</span><h1>Sell your car, your way.</h1><p>Tell us a little about your car. We’ll give you a clear estimate, with no obligation and no awkward back-and-forth.</p></div>
    <div className="wizard-layout"><section className="wizard"><div className="wizard-top"><span>YOUR NORTHLINE OFFER</span><span>STEP {step} OF 5</span></div><div className="progress-track">{stepTitles.map((title, index) => <span className={index < step ? 'complete' : ''} key={title} />)}</div>
      <AnimatePresence mode="wait"><motion.div key={step} initial={{ opacity: 0, x: 12 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -12 }} transition={{ duration: .2 }}>
        {step === 1 && <><h2>First, the basics.</h2><p className="wizard-copy">Start with a VIN or tell us about your car manually. A plate works too when we speak.</p><div className="wizard-fields"><label className="field-label full">VIN (optional)<input className="field" placeholder="17-character VIN" value={state.vin} onChange={(event) => update('vin', event.target.value)} /></label><label className="field-label">Year<select className="field" value={state.year} onChange={(event) => update('year', event.target.value)}>{Array.from({ length: 18 }, (_, index) => 2026 - index).map((year) => <option key={year}>{year}</option>)}</select></label><label className="field-label">Mileage<input className="field" inputMode="numeric" placeholder="e.g. 38,500" value={state.mileage} onChange={(event) => update('mileage', event.target.value.replace(/\D/g, ''))} /></label><label className="field-label">Make<input className="field" placeholder="e.g. Subaru" value={state.make} onChange={(event) => update('make', event.target.value)} /></label><label className="field-label">Model<input className="field" placeholder="e.g. Outback" value={state.model} onChange={(event) => update('model', event.target.value)} /></label></div></>}
        {step === 2 && <><h2>How has it been treating you?</h2><p className="wizard-copy">Choose the description that feels closest. We’ll confirm the details together later.</p><div className="condition-options">{(['Fair', 'Good', 'Excellent'] as const).map((condition) => <button className={state.condition === condition ? 'selected' : ''} type="button" onClick={() => update('condition', condition)} key={condition}>{condition}</button>)}</div><p className="eyebrow" style={{ marginTop: 25 }}>Anything we should know?</p><div className="check-grid">{['No known issues', 'Previous accident', 'Aftermarket additions', 'Warning light on', 'Cosmetic wear', 'Recent service'].map((item) => <label className="filter-check" key={item}><input type="checkbox" checked={state.flags.includes(item)} onChange={() => toggleFlag(item)} />{item}</label>)}</div></>}
        {step === 3 && <><h2>Show us what you love.</h2><p className="wizard-copy">Photos help us give you a more thoughtful estimate. You can always add them later.</p><label className="upload-box"><Upload size={22} /><strong>Choose a few photos</strong><span>Exterior, interior, and anything worth noting</span><input type="file" accept="image/*" multiple /></label><div style={{ marginTop: 20 }}><label className="field-label">Do you have the title?<select className="field" value={state.title} onChange={(event) => update('title', event.target.value)}><option>Yes, in hand</option><option>Yes, held by lender</option><option>Not yet</option></select></label></div></>}
        {step === 4 && <><h2>Cash in hand, or a head start?</h2><p className="wizard-copy">Either way, we’ll make the next step clear. You can change your mind later.</p><div className="offer-toggle"><button type="button" className={state.offerType === 'cash' ? 'selected' : ''} onClick={() => update('offerType', 'cash')}><Wallet size={17} style={{ verticalAlign: 'middle', marginRight: 6 }} />Cash offer</button><button type="button" className={state.offerType === 'trade' ? 'selected' : ''} onClick={() => update('offerType', 'trade')}><ArrowDownRight size={17} style={{ verticalAlign: 'middle', marginRight: 6 }} />Trade-in credit</button></div>{selectedVehicle && <div className="badge badge-blue">Applying toward the {selectedVehicle.year} {selectedVehicle.make} {selectedVehicle.model}</div>}<div style={{ display: 'flex', gap: 10, alignItems: 'center', marginTop: 22, color: '#667067', fontSize: 11 }}><ShieldCheck size={18} />Your estimate is private and never a commitment.</div></>}
        {step === 5 && <><span className="eyebrow">A place to start</span><h2>Your Northline estimate.</h2><p className="wizard-copy">Based on what you’ve shared so far. A quick in-person look helps us make it official.</p><div className="offer-card"><span className="eyebrow" style={{ color: '#c6d9a8' }}>{state.offerType === 'cash' ? 'ESTIMATED CASH OFFER' : 'ESTIMATED TRADE-IN CREDIT'}</span><strong>{money(estimate)}</strong><p>{state.year} {state.make || 'Your car'} {state.model} · {Number(state.mileage || 45000).toLocaleString()} miles<br />Good for 7 days after inspection. No pressure, ever.</p></div><div style={{ display: 'grid', gap: 9, marginTop: 16 }}><button className="button button-primary" type="button" onClick={() => setOfferOpen(true)}>Schedule offer inspection <ArrowRight size={15} /></button><Link className="button button-outline" to="/inventory">Browse vehicles to trade for <ArrowRight size={15} /></Link></div></>}
      </motion.div></AnimatePresence>
      <div className="wizard-actions">{step > 1 ? <button className="button button-outline" type="button" onClick={previous}><ArrowLeft size={15} /> Back</button> : <span />}{step < 5 && <button className="button button-primary" type="button" onClick={next}>Continue <ArrowRight size={15} /></button>}</div>
    </section>
    <aside className="wizard-aside"><MarketConfidence /><h3>Easy from here.</h3><p>No listing fees. No tire-kickers. No need to buy from us. Just a real person, a fair number, and a plan that works for you.</p><div className="trust-list"><TrustNote>Free, no-obligation estimate</TrustNote><TrustNote>Offer good for 7 days</TrustNote><TrustNote>We handle the paperwork</TrustNote></div><div className="wizard-help"><CircleHelp size={17} />Questions? <a href="tel:+13125550148" style={{ color: '#2457e6', fontWeight: 700 }}>(312) 555-0148</a></div></aside>
    </div><OfferModal open={offerOpen} onClose={() => setOfferOpen(false)} />
  </div>
}

function calculatePayment(amount: number, rate: number, months: number) {
  const monthly = rate / 1200
  return monthly === 0 ? amount / months : amount * monthly / (1 - (1 + monthly) ** -months)
}

export function Finance() {
  const [price, setPrice] = useState(42000)
  const [down, setDown] = useState(5000)
  const [term, setTerm] = useState(60)
  const [apr, setApr] = useState(6.9)
  const [submitted, setSubmitted] = useState(false)
  const payment = calculatePayment(Math.max(0, price - down), apr, term)
  const submit = (event: FormEvent<HTMLFormElement>) => { event.preventDefault(); setSubmitted(true) }
  return <div className="shell"><section className="finance-hero"><div><span className="eyebrow">A clearer road to yes</span><h1>Good financing starts with good information.</h1><p>Explore your numbers, get a head start on pre-approval, and find a payment that feels right for real life.</p><div style={{ display: 'flex', gap: 10, marginTop: 24 }}><a className="button button-primary" href="#application">Start pre-approval <ArrowRight size={15} /></a><Link className="button button-outline" to="/inventory">Find your car</Link></div></div><div className="finance-panel"><span className="eyebrow">Payment estimator</span><h2>Make the math yours.</h2><div className="big-payment">{money(Math.round(payment))}<small> / month</small></div><div className="slider-field"><div className="slider-heading"><span>Vehicle price</span><strong>{money(price)}</strong></div><input className="calculator-range" type="range" min="20000" max="150000" step="1000" value={price} onChange={(event) => setPrice(Number(event.target.value))} /></div><div className="slider-field"><div className="slider-heading"><span>Down payment</span><strong>{money(down)}</strong></div><input className="calculator-range" type="range" min="0" max={Math.min(50000, price)} step="500" value={down} onChange={(event) => setDown(Number(event.target.value))} /></div><div className="wizard-fields"><label className="field-label">Term<select className="field" value={term} onChange={(event) => setTerm(Number(event.target.value))}><option value="36">36 months</option><option value="48">48 months</option><option value="60">60 months</option><option value="72">72 months</option><option value="84">84 months</option></select></label><label className="field-label">APR estimate<input className="field" type="number" min="0" max="30" step=".1" value={apr} onChange={(event) => setApr(Number(event.target.value))} /></label></div><p className="finance-disclaimer" style={{ marginTop: 15 }}>Estimates only. Your actual rate and terms are determined by your lender.</p></div></section>
    <section className="section-pad" style={{ paddingTop: 5 }}><div className="section-head"><div><span className="eyebrow">A little more clarity</span><h2>Find your comfortable number.</h2></div><p>Rates are illustrative examples, not a credit decision. Your Northline finance specialist can walk you through the details.</p></div><div className="finance-matrix"><div><strong>36 mo</strong><span>Shorter term · less interest over time</span></div><div><strong>60 mo</strong><span>A balanced monthly payment</span></div><div><strong>72 mo</strong><span>More room in your monthly budget</span></div></div></section>
    <section id="application" className="wizard-layout" style={{ paddingTop: 0 }}><div className="wizard"><span className="eyebrow">A few details to begin</span><h2 style={{ marginTop: 9 }}>Get pre-approved.</h2><p className="wizard-copy">This first step takes about two minutes. A Northline finance specialist will follow up to help with next steps.</p>{submitted ? <div className="offer-card"><Check size={20} /><strong style={{ fontSize: 25 }}>You're on your way.</strong><p>Thanks. Our finance team will reach out soon to talk through your options.</p></div> : <form onSubmit={submit}><div className="wizard-fields"><label className="field-label">First name<input className="field" required autoComplete="given-name" /></label><label className="field-label">Last name<input className="field" required autoComplete="family-name" /></label><label className="field-label">Email address<input className="field" required type="email" autoComplete="email" /></label><label className="field-label">Phone number<input className="field" required type="tel" autoComplete="tel" /></label><label className="field-label full">Preferred vehicle (optional)<select className="field"><option>Still deciding</option>{vehicles.map((vehicle) => <option key={vehicle.id}>{vehicle.year} {vehicle.make} {vehicle.model}</option>)}</select></label><label className="filter-check full"><input type="checkbox" required />I agree to be contacted about my application.</label></div><button className="button button-primary" type="submit" style={{ marginTop: 19 }}>Continue application <ArrowRight size={15} /></button></form>}</div><aside className="wizard-aside"><div className="badge"><ShieldCheck size={13} /> Your details stay with us</div><h3>Real help, not a hard sell.</h3><p>We’ll listen first, then walk through loan terms, trade-in value, and lender options together.</p><div className="trust-list"><TrustNote>One simple application</TrustNote><TrustNote>Flexible lender options</TrustNote><TrustNote>No obligation to buy</TrustNote></div></aside></section>
  </div>
}

export function Contact() {
  return <div className="shell"><div className="page-intro"><span className="eyebrow">Your local Northline</span><h1>Come by. We’ll put the coffee on.</h1><p>Questions, a test drive, or just a look around? There’s a real person ready to help.</p></div><div className="contact-layout"><div className="contact-info"><section className="contact-row"><h3>Northline Motor Co. · Downtown</h3><p><MapPin size={14} style={{ verticalAlign: 'middle', marginRight: 4 }} />4100 W Lake Street, Chicago, IL 60624</p><a href="https://maps.google.com/?q=4100+W+Lake+Street+Chicago+IL" target="_blank" rel="noreferrer" className="text-link" style={{ marginTop: 10 }}>Get directions <ArrowUpRight size={13} /></a></section><section className="contact-row"><h3>Talk to our team</h3><p><Phone size={14} style={{ verticalAlign: 'middle', marginRight: 4 }} />Sales: <a href="tel:+13125550148">(312) 555-0148</a></p><p><HandCoins size={14} style={{ verticalAlign: 'middle', marginRight: 4 }} />Buying center: <a href="tel:+13125550182">(312) 555-0182</a></p><p><Wrench size={14} style={{ verticalAlign: 'middle', marginRight: 4 }} />Service: <a href="tel:+13125550196">(312) 555-0196</a></p><p><Mail size={14} style={{ verticalAlign: 'middle', marginRight: 4 }} /><a href="mailto:hello@northlinemotor.co">hello@northlinemotor.co</a></p></section><section className="contact-row"><h3><Clock3 size={15} style={{ verticalAlign: 'middle', marginRight: 6 }} />Showroom hours</h3><table className="hours-table"><tbody><tr><td>Monday–Friday</td><td>9:00 am – 7:00 pm</td></tr><tr><td>Saturday</td><td>9:00 am – 6:00 pm</td></tr><tr><td>Sunday</td><td>11:00 am – 4:00 pm</td></tr></tbody></table></section></div><div className="map-mock" role="img" aria-label="Map showing the Northline Motor Co. showroom in Chicago"><div className="map-road" /><div className="map-marker"><MapPin size={20} /></div><div className="map-label">Northline Motor Co.</div><div style={{ position: 'absolute', left: 18, bottom: 18, padding: '12px 15px', background: '#fff', boxShadow: '0 3px 12px #1e29251a' }}><span className="eyebrow">Chicago, Illinois</span><p style={{ marginTop: 4, fontSize: 11 }}>4100 W Lake Street · 60624</p></div></div></div></div>
}
