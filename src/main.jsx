import React, { StrictMode, useEffect, useMemo, useState } from 'react'
import { createRoot } from 'react-dom/client'
import { AnimatePresence, motion } from 'motion/react'
import {
  ArrowDownRight, ArrowLeft, ArrowUpRight, BarChart3, Bell, BookOpen, Bot, BriefcaseBusiness, CalendarDays,
  Calculator, Check, ChevronDown, ChevronRight, CircleHelp, Coins, CreditCard, Download, FileCheck2,
  FileText, Gauge, Goal, Landmark, LayoutDashboard, LineChart, Menu, MessageSquare, Percent, PiggyBank,
  Plus, Receipt, RefreshCw, Search, Send, Settings, ShieldCheck, Sparkles, Target, Trash2, TrendingUp,
  Wallet, X, Zap, Building2, HandCoins, Scale, Store, Globe2, Users
} from 'lucide-react'
import './styles.css'

const pageItems = [
  ['Overview', LayoutDashboard], ['Income', TrendingUp], ['Expenses', ArrowDownRight],
  ['Loans', FileText], ['SIPs', Target], ['Investments', LineChart],
  ['Assets', BriefcaseBusiness], ['Liabilities', Wallet], ['Goals', Goal],
]
const toolPages = [
  ['budget', 'Budget planner', Calculator], ['cashflow', 'Cash-flow forecast', BarChart3],
  ['emergency', 'Emergency fund', ShieldCheck], ['debt', 'Debt payoff', Landmark],
  ['emi', 'Loan EMI calculator', CreditCard], ['sip', 'SIP calculator', TrendingUp],
  ['inflation', 'Inflation calculator', Percent], ['compound', 'Compound interest', Coins],
  ['retirement', 'Retirement planner', Goal], ['tax', 'Tax readiness', FileCheck2],
  ['networth', 'Net-worth tracker', Wallet], ['allocation', 'Asset allocation', Percent],
  ['goals', 'Goal simulator', Goal], ['subscriptions', 'Subscription audit', RefreshCw],
  ['billcalendar', 'Bill calendar', CalendarDays], ['receipts', 'Receipt vault', Receipt],
  ['dividend', 'Dividend tracker', Coins], ['insurance', 'Insurance checklist', ShieldCheck],
  ['credit', 'Credit health', Gauge], ['scenarios', 'What-if scenarios', Zap],
  ['reports', 'Monthly report', FileText], ['import', 'Data import', Download],
  ['habits', 'Money habits', PiggyBank], ['breakeven', 'Business break-even', Scale],
  ['pricing', 'Pricing calculator', Store], ['roi', 'Business ROI', TrendingUp],
  ['payroll', 'Payroll calculator', Users], ['vat', 'VAT / GST calculator', FileCheck2],
  ['margin', 'Margin calculator', Percent], ['workingcapital', 'Working capital', Building2],
  ['exchange', 'Currency exchange', Globe2],
]
const initialData = {
  Income: [{ id: 1, date: '2025-09-01', source: 'Salary', category: 'Salary', amount: 125000 }, { id: 2, date: '2025-09-05', source: 'Freelance', category: 'Other income', amount: 18000 }],
  Expenses: [{ id: 3, date: '2025-09-02', source: 'Rent', category: 'Home', amount: 28000 }, { id: 4, date: '2025-09-08', source: 'Groceries', category: 'Living', amount: 8500 }],
  Loans: [{ id: 5, date: '2024-04-01', source: 'Home loan', category: 'HDFC Â· 8.4%', amount: 4200000 }, { id: 6, date: '2023-07-01', source: 'Car loan', category: 'Axis Â· 9.1%', amount: 680000 }],
  SIPs: [{ id: 7, date: '2025-09-05', source: 'Nifty index fund', category: 'Monthly SIP', amount: 15000 }, { id: 8, date: '2025-09-05', source: 'Balanced advantage', category: 'Monthly SIP', amount: 10000 }],
  Investments: [{ id: 9, date: '2025-08-31', source: 'Mutual funds', category: 'Equity', amount: 186240 }],
  Assets: [{ id: 10, date: '2025-09-01', source: 'Savings account', category: 'Cash', amount: 62180 }, { id: 11, date: '2025-09-01', source: 'Apartment', category: 'Property', amount: 8500000 }],
  Liabilities: [{ id: 12, date: '2025-09-01', source: 'Home loan outstanding', category: 'Loan', amount: 4200000 }, { id: 13, date: '2025-09-01', source: 'Credit card', category: 'Card', amount: 38000 }],
  Goals: [{ id: 14, date: '2027-12-01', source: 'Home down payment', category: '64% complete', amount: 1000000 }, { id: 15, date: '2035-06-01', source: 'Financial freedom', category: '31% complete', amount: 6000000 }],
}
const currencies = {
  INR: { label: 'Indian rupee', locale: 'en-IN', rate: 1 },
  USD: { label: 'US dollar', locale: 'en-US', rate: 0.012 },
  EUR: { label: 'Euro', locale: 'de-DE', rate: 0.011 },
  GBP: { label: 'British pound', locale: 'en-GB', rate: 0.0095 },
  AED: { label: 'UAE dirham', locale: 'en-AE', rate: 0.044 },
  SGD: { label: 'Singapore dollar', locale: 'en-SG', rate: 0.016 },
}
const getCurrency = () => localStorage.getItem('finalca-currency') || 'INR'
const money = value => {
  const code = getCurrency()
  const currency = currencies[code] || currencies.INR
  return new Intl.NumberFormat(currency.locale, { style: 'currency', currency: code, maximumFractionDigits: 0 }).format((Number(value) || 0) * currency.rate)
}
const safeAmount = value => Number.isFinite(Number(value)) ? Math.max(0, Number(value)) : 0
const initials = value => String(value || 'User').trim().split(/\s+/).filter(Boolean).map(part => part[0]).join('').slice(0, 2).toUpperCase() || 'U'
const financePrompts = ['Summarize my net worth and explain what is driving it.', 'Review my income and expenses and suggest a practical monthly budget.', 'Review my loans and suggest a sensible repayment priority.', 'Am I on track for my financial goals based on the data I entered?']
const alerts = [
  { title: 'Review your home loan', detail: 'Your largest liability is due for a monthly review.', tone: 'lime', page: 'Loans' },
  { title: 'SIP contribution due soon', detail: 'Your next â‚¹25,000 contribution is scheduled this week.', tone: 'purple', page: 'SIPs' },
  { title: 'Spending pattern detected', detail: 'Your living expenses are 8% higher than last month.', tone: 'orange', page: 'Expenses' },
]

function Modal({ title, eyebrow, children, onClose }) {
  return <motion.div className="modal-backdrop" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} onMouseDown={event => event.target === event.currentTarget && onClose()}><motion.section className="modal" initial={{ opacity: 0, y: 24, scale: .96 }} animate={{ opacity: 1, y: 0, scale: 1 }} exit={{ opacity: 0, y: 14, scale: .98 }} transition={{ type: 'spring', stiffness: 260, damping: 24 }}><div className="modal-header"><div><p className="eyebrow">{eyebrow}</p><h2>{title}</h2></div><button className="icon-button" onClick={onClose} aria-label="Close dialog"><X size={18} /></button></div>{children}</motion.section></motion.div>
}

function LogoMark() {
  return <span className="brand-mark" aria-label="Finalca logo"><svg viewBox="0 0 48 48" aria-hidden="true"><defs><linearGradient id="logoGradient" x1="8" y1="8" x2="40" y2="40"><stop stopColor="#79f2ff" /><stop offset="1" stopColor="#a88bff" /></linearGradient></defs><circle cx="24" cy="24" r="18" className="logo-orbit logo-orbit-one" /><ellipse cx="24" cy="24" rx="21" ry="9" className="logo-orbit logo-orbit-two" /><path d="M24 8 38 16v16L24 40 10 32V16L24 8Z" fill="url(#logoGradient)" fillOpacity=".16" /><path d="M16 29 21 23l4 3 8-10" /><circle cx="33" cy="16" r="2.5" className="logo-node" /></svg></span>
}

function BrandLockup({ login = false }) {
  return <div className={`brand ${login ? 'login-brand' : ''}`}><LogoMark /><span className="brand-wordmark">finalca</span><span className="brand-signal">wealth OS</span></div>
}

function ToolLogo({ Icon, toolKey }) {
  return <div className={`tool-hero-icon tool-logo-${toolKey}`}><svg className="tool-logo-orbit" viewBox="0 0 64 64" aria-hidden="true"><circle cx="32" cy="32" r="24" /><ellipse cx="32" cy="32" rx="28" ry="12" /><circle cx="54" cy="28" r="3" /></svg><span className="tool-logo-core"><Icon size={24} /></span></div>
}

function Login({ onLogin }) {
  const [username, setUsername] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const submit = event => {
    event.preventDefault()
    if (username === 'admin' && password === 'finalca123') { localStorage.setItem('finalca-auth', 'true'); onLogin('Agam Mehar') }
    else setError('Incorrect username or password.')
  }
  return <main className="login-shell"><div className="login-orbit orbit-one" /><div className="login-orbit orbit-two" /><motion.section className="login-card" initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: .7, ease: 'easeOut' }}><BrandLockup login /><div className="login-icon"><ShieldCheck size={24} /></div><p className="eyebrow">Private finance workspace</p><h1>Welcome back</h1><p className="login-copy">Sign in to access your personal CFO dashboard.</p><form onSubmit={submit} className="login-form"><label>Username<input value={username} onChange={event => setUsername(event.target.value)} autoComplete="username" required /></label><label>Password<input type="password" value={password} onChange={event => setPassword(event.target.value)} autoComplete="current-password" required /></label>{error && <p className="form-error">{error}</p>}<motion.button className="primary-button login-submit" type="submit" whileHover={{ scale: 1.02 }} whileTap={{ scale: .98 }}>Unlock workspace <ArrowUpRight size={16} /></motion.button></form><small className="login-security"><ShieldCheck size={13} /> Your data stays in this browser</small></motion.section></main>
}

function MetricCard({ label, value, change, icon: Icon }) {
  const ChangeIcon = change.startsWith('-') ? ArrowDownRight : ArrowUpRight
  return <motion.article className="metric-card" initial={{ opacity: 0, y: 18 }} animate={{ opacity: 1, y: 0 }} whileHover={{ y: -6, scale: 1.015 }} transition={{ type: 'spring', stiffness: 240, damping: 20 }}><div className="metric-top"><span>{label}</span><Icon size={16} /></div><strong>{value}</strong><div className="metric-detail"><span className={change.startsWith('-') ? 'negative' : 'positive'}><ChangeIcon size={14} />{change}</span><small>updated just now</small></div><span className="metric-spark" /></motion.article>
}

function CfoCharacter({ onOpen }) {
  return <motion.button type="button" className="cfo-character" onClick={onOpen} aria-label="Open AI CFO chat" initial={{ opacity: 0, x: 24 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: .35, duration: .6 }} whileHover={{ y: -6, rotate: 1 }} whileTap={{ scale: .98 }}>
    <div className="character-orb"><div className="character-body"><div className="character-head"><span className="character-eye left" /><span className="character-eye right" /><span className="character-smile" /></div><div className="character-chest"><span>F</span></div><div className="character-arm arm-left" /><div className="character-arm arm-right" /></div></div>
    <div className="character-copy"><p className="eyebrow">Your AI CFO</p><b>Letâ€™s make your money move.</b><small>Ask me for a clear next step.</small></div>
  </motion.button>
}

function EditableTable({ page, rows, setRows }) {
  const [query, setQuery] = useState('')
  const [sort, setSort] = useState('date')
  const fields = ['date', 'source', 'category', 'amount']
  const filtered = useMemo(() => [...rows].filter(row => `${row.source} ${row.category} ${row.date}`.toLowerCase().includes(query.toLowerCase())).sort((a, b) => sort === 'amount' ? Number(b.amount || 0) - Number(a.amount || 0) : String(b[sort] || '').localeCompare(String(a[sort] || ''))), [rows, query, sort])
  const update = (id, field, value) => setRows(rows.map(row => row.id === id ? { ...row, [field]: field === 'amount' ? (value === '' ? 0 : Math.max(0, Number(value) || 0)) : value } : row))
  const addRow = () => setRows([...rows, { id: Date.now(), date: new Date().toISOString().slice(0, 10), source: 'New entry', category: 'Edit me', amount: 0 }])
  const remove = id => setRows(rows.filter(row => row.id !== id))
  const duplicate = row => setRows([...rows, { ...row, id: Date.now(), source: `${row.source} copy` }])
  const download = () => {
    const csv = [fields.join(','), ...rows.map(row => fields.map(field => JSON.stringify(row[field] ?? '')).join(','))].join('\n')
    const link = document.createElement('a'); link.href = URL.createObjectURL(new Blob([csv], { type: 'text/csv' })); link.download = `finalca-${page.toLowerCase()}.csv`; link.click(); URL.revokeObjectURL(link.href)
  }
  return <article className="panel spreadsheet-panel"><div className="panel-header"><div><p className="eyebrow">Editable ledger</p><h2>{page} data</h2></div><div className="table-actions"><button className="outline-button compact" onClick={download}><Download size={14} />Download CSV</button><button className="primary-button compact" onClick={addRow}><Plus size={14} />Add row</button></div></div><div className="table-toolbar"><label className="search-field"><Search size={14} /><input value={query} onChange={event => setQuery(event.target.value)} placeholder="Search entries..." /></label><label className="sort-field">Sort by <select value={sort} onChange={event => setSort(event.target.value)}><option value="date">Date</option><option value="source">Name</option><option value="amount">Amount</option></select></label><span>{filtered.length} of {rows.length} records</span></div><p className="table-hint">Click any cell to edit. Changes are live in your dashboard. Use duplicate to quickly create a similar entry.</p><div className="table-scroll"><table><thead><tr><th>Date / due date</th><th>Name / source</th><th>Type</th><th>Amount (INR)</th><th>Actions</th></tr></thead><tbody>{filtered.map(row => <tr key={row.id}>{fields.map(field => <td key={field}><input value={row[field]} type={field === 'amount' ? 'number' : field === 'date' ? 'date' : 'text'} onChange={event => update(row.id, field, event.target.value)} /></td>)}<td className="row-actions"><button className="delete-button" onClick={() => duplicate(row)} aria-label={`Duplicate ${row.source}`}><Plus size={15} /></button><button className="delete-button" onClick={() => remove(row.id)} aria-label={`Delete ${row.source}`}><Trash2 size={15} /></button></td></tr>)}</tbody></table></div>{!filtered.length && <div className="empty-state">No matching entries. Add your first row to start building your financial picture.</div>}</article>
}

function Overview({ data, setActive, setChatOpen, setModal }) {
  const assets = data.Assets.reduce((sum, row) => sum + safeAmount(row.amount), 0) + data.Investments.reduce((sum, row) => sum + safeAmount(row.amount), 0)
  const liabilities = data.Liabilities.reduce((sum, row) => sum + safeAmount(row.amount), 0)
  const income = data.Income.reduce((sum, row) => sum + safeAmount(row.amount), 0)
  const expenses = data.Expenses.reduce((sum, row) => sum + safeAmount(row.amount), 0)
  return <><section className="metrics-grid"><MetricCard label="Net worth" value={money(assets - liabilities)} change="+12.8%" icon={Wallet} /><MetricCard label="Monthly income" value={money(income)} change="+6.4%" icon={TrendingUp} /><MetricCard label="Monthly spending" value={money(expenses)} change="-2.1%" icon={ArrowDownRight} /><MetricCard label="Investments" value={money(data.Investments.reduce((s, r) => s + safeAmount(r.amount), 0))} change="+8.4%" icon={LineChart} /></section><section className="dashboard-grid"><article className="panel"><div className="panel-header"><div><p className="eyebrow">Wealth snapshot</p><h2>Everything in one view</h2></div><Sparkles size={18} className="positive" /></div><div className="overview-bars"><div><span>Assets</span><b>{money(assets)}</b><i style={{ width: assets ? '82%' : '0%' }} /></div><div><span>Liabilities</span><b>{money(liabilities)}</b><i className="bar-purple" style={{ width: `${assets ? Math.min(100, liabilities / assets * 100) : 0}%` }} /></div><div><span>Free cash after spending</span><b>{money(income - expenses)}</b><i style={{ width: `${income ? Math.min(100, Math.max(0, (income - expenses) / income * 100)) : 0}%` }} /></div></div>{assets === 0 && <p className="zero-state">Add an asset or investment to activate your wealth graph.</p>}<button className="outline-button" onClick={() => setActive('Assets')}>Manage all data <ChevronRight size={15} /></button></article><article className="panel"><div className="panel-header"><div><p className="eyebrow">Growth planner</p><h2>Your goals</h2></div><button className="text-button" onClick={() => setActive('Goals')}><Plus size={15} />Add goal</button></div>{data.Goals.map(row => <div className="goal" key={row.id}><div className="goal-icon"><Goal size={18} /></div><div className="goal-main"><div className="goal-title"><b>{row.source}</b><span>{row.category}</span></div><div className="progress-track"><div style={{ width: `${Math.min(100, Math.max(0, Number(row.category.match(/\d+/)?.[0] || 0)))}%` }} /></div><small>Target {money(row.amount)} <span>by {row.date}</span></small></div></div>)}</article></section>  <CfoCharacter onOpen={() => setChatOpen(true)} /><FinanceToolkit setActive={setActive} setChatOpen={setChatOpen} setModal={setModal} /></>
}

function PageSummary({ page, rows }) {
  const total = rows.reduce((sum, row) => sum + safeAmount(row.amount), 0)
  const average = rows.length ? total / rows.length : 0
  const hasValue = rows.length > 0 && total > 0
  return <section className="page-summary"><div className="summary-card"><span>Total records</span><b>{rows.length}</b><small>editable entries</small></div><div className="summary-card"><span>Total value</span><b>{money(total)}</b><small>across {page.toLowerCase()}</small></div><div className="summary-card"><span>Average entry</span><b>{money(average)}</b><small>per record</small></div><article className="summary-chart panel"><div className="panel-header"><div><p className="eyebrow">{page} trend</p><h2>Value movement</h2></div><LineChart size={17} className="positive" /></div>{hasValue ? <svg viewBox="0 0 700 130" role="img" aria-label={`${page} value graph`}><line x1="10" y1="119" x2="690" y2="119" className="grid-line" /><polyline points={rows.map((row, index) => `${index * (680 / Math.max(rows.length - 1, 1)) + 10},${118 - Math.min(100, (Number(row.amount) / total) * 100)}`).join(' ')} fill="none" stroke="var(--lime)" strokeWidth="3" strokeLinecap="round" /></svg> : <div className="chart-empty"><LineChart size={22} /><span>No value to chart yet</span><small>Add a positive amount to see movement.</small></div>}</article></section>
}

const financeTools = [
  ['budget', 'Smart budget planner', 'Build a practical 50/30/20 budget from your income.', Calculator],
  ['cashflow', 'Cash-flow forecast', 'See your expected surplus for the next 90 days.', BarChart3],
  ['emergency', 'Emergency fund check', 'Measure how many months your cash reserve can cover.', ShieldCheck],
  ['debt', 'Debt payoff planner', 'Prioritize loans by interest rate and outstanding balance.', Landmark],
  ['emi', 'EMI calculator', 'Estimate monthly payment and total interest for a loan.', CreditCard],
  ['sip', 'SIP calculator', 'Project the future value of monthly investments.', TrendingUp],
  ['inflation', 'Inflation calculator', 'See what todayâ€™s money may cost in the future.', Percent],
  ['compound', 'Compound interest', 'Visualize how returns can compound over time.', Coins],
  ['retirement', 'Retirement planner', 'Estimate the nest egg your contribution can build.', Goal],
  ['tax', 'Tax readiness', 'Create a checklist of documents for tax season.', FileCheck2],
  ['networth', 'Net-worth tracker', 'Compare assets and liabilities over time.', Wallet],
  ['allocation', 'Asset allocation', 'Review your equity, debt, cash, and property mix.', Percent],
  ['goals', 'Goal simulator', 'Test how a larger monthly contribution changes a goal date.', Goal],
  ['subscriptions', 'Subscription audit', 'Find recurring spending worth reviewing.', RefreshCw],
  ['billcalendar', 'Bill calendar', 'Keep due dates and recurring payments visible.', CalendarDays],
  ['receipts', 'Receipt vault', 'Use the expenses ledger as a searchable receipt register.', Receipt],
  ['dividend', 'Dividend tracker', 'Track passive income sources and payout dates.', Coins],
  ['insurance', 'Insurance checklist', 'Review health, life, vehicle, and property cover.', ShieldCheck],
  ['credit', 'Credit health', 'Monitor liabilities and keep card balances visible.', Gauge],
  ['scenarios', 'What-if scenarios', 'Compare saving more, spending less, or paying debt faster.', Zap],
  ['breakeven', 'Business break-even', 'Find the sales volume needed to cover fixed costs.', Scale],
  ['pricing', 'Pricing calculator', 'Set a price that protects your costs and target margin.', Store],
  ['roi', 'Business ROI', 'Compare business investment return and payback.', TrendingUp],
  ['payroll', 'Payroll calculator', 'Estimate gross payroll cost with taxes and benefits.', Users],
  ['vat', 'VAT / GST calculator', 'Add or remove indirect tax from an invoice amount.', FileCheck2],
  ['margin', 'Margin calculator', 'Calculate gross margin, markup, and contribution.', Percent],
  ['workingcapital', 'Working capital', 'Estimate cash tied up in inventory and receivables.', Building2],
  ['exchange', 'Currency exchange', 'Convert money between supported global currencies.', Globe2],
]

function NumberField({ label, value, onChange, suffix = 'â‚¹' }) {
  return <label className="calculator-field"><span>{label}</span><div><input type="number" min="0" value={value} onChange={event => onChange(Math.max(0, Number(event.target.value) || 0))} /><small>{suffix}</small></div></label>
}

function CurrencyField({ label, value, onChange }) {
  return <label className="calculator-field"><span>{label}</span><div><select value={value} onChange={event => onChange(event.target.value)}><option value="INR">INR Â· â‚¹</option><option value="USD">USD Â· $</option><option value="EUR">EUR Â· â‚¬</option><option value="GBP">GBP Â· Â£</option><option value="AED">AED</option><option value="SGD">SGD Â· S$</option></select></div></label>
}

function TrendChart({ values, labels = ['Now', 'Year 1', 'Year 2', 'Year 3', 'Year 4', 'Year 5'] }) {
  const max = Math.max(...values, 1)
  const points = values.map((value, index) => `${index * (680 / Math.max(values.length - 1, 1)) + 10},${118 - (value / max) * 92}`).join(' ')
  return <div className="calculator-chart"><svg viewBox="0 0 700 145" role="img" aria-label="Calculator projection graph"><defs><linearGradient id="chartFill" x1="0" x2="0" y1="0" y2="1"><stop offset="0%" stopColor="var(--lime)" stopOpacity=".42" /><stop offset="100%" stopColor="var(--lime)" stopOpacity="0" /></linearGradient></defs><line x1="10" y1="118" x2="690" y2="118" className="grid-line" /><polyline points={`10,118 ${points} 690,118`} fill="url(#chartFill)" stroke="none" /><polyline points={points} fill="none" stroke="var(--lime)" strokeWidth="4" strokeLinecap="round" strokeLinejoin="round" />{values.map((value, index) => <circle key={index} cx={index * (680 / Math.max(values.length - 1, 1)) + 10} cy={118 - (value / max) * 92} r="4" fill="var(--lime)" />)}</svg><div className="chart-labels">{labels.slice(0, values.length).map(label => <span key={label}>{label}</span>)}</div></div>
}

function ToolPage({ toolKey, onBack }) {
  const [values, setValues] = useState({ amount: 100000, rate: 12, years: 10, monthly: 15000, target: 1000000, inflation: 6, loan: 2500000, tenure: 20, fixedCosts: 300000, variableCost: 450, units: 1000, price: 1000, investment: 500000, returnValue: 650000, employees: 5, salary: 60000, benefits: 12, taxRate: 18, revenue: 1000000, cost: 650000, inventory: 250000, receivables: 180000, payables: 120000, fromAmount: 1000, fromCurrency: 'USD', toCurrency: 'INR' })
  const set = (key, value) => setValues(previous => ({ ...previous, [key]: value }))
  const months = values.years * 12
  const monthlyRate = values.rate / 1200
  const sipFuture = values.monthly * (((Math.pow(1 + monthlyRate, months) - 1) / (monthlyRate || 1)) * (1 + monthlyRate))
  const loanRate = values.rate / 1200
  const emi = loanRate ? values.loan * loanRate * Math.pow(1 + loanRate, values.tenure * 12) / (Math.pow(1 + loanRate, values.tenure * 12) - 1) : values.loan / (values.tenure * 12)
  const compound = values.amount * Math.pow(1 + values.rate / 100, values.years)
  const inflated = values.amount * Math.pow(1 + values.inflation / 100, values.years)
  const isLoan = toolKey === 'emi' || toolKey === 'debt'
  const isSip = toolKey === 'sip' || toolKey === 'compound'
  const isInflation = toolKey === 'inflation'
  const isExchange = toolKey === 'exchange'
  const businessType = ['breakeven', 'pricing', 'roi', 'payroll', 'vat', 'margin', 'workingcapital'].includes(toolKey)
  const breakEvenUnits = Math.ceil(values.fixedCosts / Math.max(1, values.price - values.variableCost))
  const pricing = values.variableCost / Math.max(.01, 1 - values.rate / 100)
  const roi = ((values.returnValue - values.investment) / Math.max(1, values.investment)) * 100
  const payroll = values.employees * values.salary * (1 + values.benefits / 100)
  const vat = values.amount * (1 + values.taxRate / 100)
  const margin = (values.revenue - values.cost) / Math.max(1, values.revenue) * 100
  const workingCapital = values.inventory + values.receivables - values.payables
  const exchangeRate = (currencies[values.toCurrency]?.rate || 1) / (currencies[values.fromCurrency]?.rate || 1)
  const exchanged = values.fromAmount * exchangeRate
  const title = toolPages.find(([key]) => key === toolKey)?.[1] || 'Finance workspace'
  const Icon = toolPages.find(([key]) => key === toolKey)?.[2] || Calculator
  const toolNotes = {
    budget: ['Recommended split', '50% needs Â· 30% wants Â· 20% future', 'Next action', 'Enter take-home income and compare every category.'],
    cashflow: ['Runway signal', 'Track incoming cash against planned outflows', 'Next action', 'Add recurring bills before changing your plan.'],
    emergency: ['Safety target', 'Aim for three to six months of essential costs', 'Next action', 'Keep this reserve separate from investments.'],
    debt: ['Payoff strategy', 'Compare avalanche and snowball repayment paths', 'Next action', 'Prioritize the highest effective interest rate.'],
    tax: ['Document score', 'Collect proofs, deductions, and investment statements', 'Next action', 'Mark each document as ready before filing.'],
    allocation: ['Diversification check', 'Balance growth, stability, liquidity, and protection', 'Next action', 'Review allocation when any sleeve moves 5%.'],
    goals: ['Progress pulse', 'Connect target amount, deadline, and monthly contribution', 'Next action', 'Increase contribution before shortening the deadline.'],
    retirement: ['Planning lens', 'Build a future income target with todayâ€™s assumptions', 'Next action', 'Revisit inflation and expected returns yearly.'],
  }[toolKey] || ['Planning signal', 'Turn your saved data into a repeatable money decision', 'Next action', 'Review this page monthly and update the assumptions.']
  const result = isLoan ? emi : isSip ? (toolKey === 'sip' ? sipFuture : compound) : isInflation ? inflated : toolKey === 'retirement' ? values.monthly * 12 * values.years : toolKey === 'breakeven' ? breakEvenUnits : toolKey === 'pricing' ? pricing : toolKey === 'roi' ? roi : toolKey === 'payroll' ? payroll : toolKey === 'vat' ? vat : toolKey === 'margin' ? margin : toolKey === 'workingcapital' ? workingCapital : toolKey === 'exchange' ? exchanged : values.target
  const chartValues = isLoan ? [values.loan, values.loan * .82, values.loan * .62, values.loan * .38, values.loan * .12] : isInflation ? [values.amount, inflated * .35, inflated * .55, inflated * .72, inflated] : [Math.max(1, values.amount * .35), Math.max(1, values.amount * .55), Math.max(1, result * .72), Math.max(1, result * .88), Math.max(1, result)]
  const resultLabel = isExchange ? `${values.fromCurrency} â†’ ${values.toCurrency} at ${exchangeRate.toFixed(4)}` : toolKey === 'roi' || toolKey === 'margin' ? 'Percentage return' : toolKey === 'breakeven' ? 'Units to break even' : 'Estimated outcome'
  const calculatorFields = isLoan ? <><NumberField label="Loan amount" value={values.loan} onChange={value => set('loan', value)} /><NumberField label="Interest rate" value={values.rate} onChange={value => set('rate', value)} suffix="%" /><NumberField label="Tenure" value={values.tenure} onChange={value => set('tenure', value)} suffix="years" /></> : isExchange ? <><NumberField label="Amount to convert" value={values.fromAmount} onChange={value => set('fromAmount', value)} suffix={values.fromCurrency} /><CurrencyField label="From currency" value={values.fromCurrency} onChange={value => set('fromCurrency', value)} /><CurrencyField label="To currency" value={values.toCurrency} onChange={value => set('toCurrency', value)} /></> : toolKey === 'breakeven' ? <><NumberField label="Fixed costs" value={values.fixedCosts} onChange={value => set('fixedCosts', value)} /><NumberField label="Selling price / unit" value={values.price} onChange={value => set('price', value)} /><NumberField label="Variable cost / unit" value={values.variableCost} onChange={value => set('variableCost', value)} /></> : toolKey === 'pricing' ? <><NumberField label="Cost / unit" value={values.variableCost} onChange={value => set('variableCost', value)} /><NumberField label="Target margin" value={values.rate} onChange={value => set('rate', value)} suffix="%" /></> : toolKey === 'roi' ? <><NumberField label="Initial investment" value={values.investment} onChange={value => set('investment', value)} /><NumberField label="Value received" value={values.returnValue} onChange={value => set('returnValue', value)} /></> : toolKey === 'payroll' ? <><NumberField label="Employees" value={values.employees} onChange={value => set('employees', value)} suffix="people" /><NumberField label="Average salary" value={values.salary} onChange={value => set('salary', value)} /><NumberField label="Benefits / taxes" value={values.benefits} onChange={value => set('benefits', value)} suffix="%" /></> : toolKey === 'vat' ? <><NumberField label="Net invoice amount" value={values.amount} onChange={value => set('amount', value)} /><NumberField label="Tax rate" value={values.taxRate} onChange={value => set('taxRate', value)} suffix="%" /></> : toolKey === 'margin' ? <><NumberField label="Revenue" value={values.revenue} onChange={value => set('revenue', value)} /><NumberField label="Total cost" value={values.cost} onChange={value => set('cost', value)} /></> : toolKey === 'workingcapital' ? <><NumberField label="Inventory" value={values.inventory} onChange={value => set('inventory', value)} /><NumberField label="Receivables" value={values.receivables} onChange={value => set('receivables', value)} /><NumberField label="Payables" value={values.payables} onChange={value => set('payables', value)} /></> : <><NumberField label={isInflation ? 'Todayâ€™s amount' : isSip ? 'Monthly contribution' : 'Starting amount'} value={isSip && toolKey === 'sip' ? values.monthly : values.amount} onChange={value => set(isSip && toolKey === 'sip' ? 'monthly' : 'amount', value)} /><NumberField label={isInflation ? 'Inflation rate' : 'Expected return'} value={isInflation ? values.inflation : values.rate} onChange={value => set(isInflation ? 'inflation' : 'rate', value)} suffix="%" /><NumberField label="Time horizon" value={values.years} onChange={value => set('years', value)} suffix="years" />{!isSip && !isInflation && <NumberField label="Target amount" value={values.target} onChange={value => set('target', value)} />}</>
  return <main className={`tool-page tool-${toolKey}`}><button className="back-link" onClick={onBack}><ArrowLeft size={15} />Back to overview</button><section className="tool-hero"><ToolLogo Icon={Icon} toolKey={toolKey} /><div><p className="eyebrow">{businessType ? 'Business calculator' : 'Dedicated finance tool'}</p><h1>{title}</h1><p>Change the assumptions and instantly see a clear projection for your plan.</p></div></section><section className="calculator-layout"><article className="panel calculator-panel"><div className="panel-header"><div><p className="eyebrow">Inputs</p><h2>Shape your scenario</h2></div><Calculator size={18} className="positive" /></div><div className="calculator-fields">{calculatorFields}</div></article><article className="panel calculator-result"><p className="eyebrow">{resultLabel}</p><strong>{isExchange ? result.toFixed(2) : toolKey === 'roi' || toolKey === 'margin' ? `${result.toFixed(1)}%` : money(result)}</strong><span>{isLoan ? `Monthly EMI Â· total interest ${money(Math.max(0, emi * values.tenure * 12 - values.loan))}` : isInflation ? `Future cost in ${values.years} years` : isExchange ? `${values.fromAmount} ${values.fromCurrency} = ${result.toFixed(2)} ${values.toCurrency}` : 'Projected value at the end of your plan'}</span><TrendChart values={chartValues} /></article></section>  <section className="calculator-insights"><article className="summary-card"><span>Starting value</span><b>{money(isLoan ? values.loan : values.amount)}</b><small>your baseline</small></article><article className="summary-card"><span>Growth / cost</span><b>{money(isLoan ? Math.max(0, emi * values.tenure * 12 - values.loan) : Math.max(0, result - values.amount))}</b><small>estimated difference</small></article><article className="summary-card"><span>Review cadence</span><b>Monthly</b><small>refresh assumptions regularly</small></article></section><section className="tool-guidance"><article className="panel guidance-card"><p className="eyebrow">{toolNotes[0]}</p><h2>{toolNotes[1]}</h2><div className="guidance-meter"><i /></div></article><article className="panel guidance-card"><p className="eyebrow">{toolNotes[2]}</p><h2>{toolNotes[3]}</h2><button className="outline-button compact" onClick={() => window.print()}><FileText size={14} />Save this plan</button></article></section></main>
}

function FinanceToolkit({ setActive }) {
  const action = key => setActive(key)
  return <section className="panel toolkit-panel"><div className="panel-header"><div><p className="eyebrow">{financeTools.length} finance tools</p><h2>Your personal finance toolkit</h2></div><Sparkles size={18} className="positive" /></div><div className="toolkit-grid">{financeTools.map(([key, title, description, Icon], index) => <motion.button className="tool-card" key={key} onClick={() => action(key)} initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: index * .025 }} whileHover={{ y: -5, scale: 1.02 }} whileTap={{ scale: .98 }}><span className="tool-icon"><Icon size={17} /></span><span><b>{title}</b><small>{description}</small></span><ChevronRight size={14} /></motion.button>)}</div></section>
}

function App() {
  const pageFromHash = () => { const value = decodeURIComponent(window.location.hash.replace(/^#\/?/, '')); return pageItems.some(([label]) => label === value) || toolPages.some(([key]) => key === value) ? value : 'Overview' }
  const [authenticated, setAuthenticated] = useState(() => localStorage.getItem('finalca-auth') === 'true')
  const [active, setActiveState] = useState(pageFromHash)
  const [name, setName] = useState(() => localStorage.getItem('finalca-name')?.trim() || 'Agam Mehar')
  const [currency, setCurrency] = useState(getCurrency)
  const [data, setData] = useState(() => { try { return JSON.parse(localStorage.getItem('finalca-data')) || initialData } catch { return initialData } })
  const [chatOpen, setChatOpen] = useState(false), [menuOpen, setMenuOpen] = useState(false), [alertsOpen, setAlertsOpen] = useState(false)
  const [modal, setModal] = useState(null), [message, setMessage] = useState(''), [reply, setReply] = useState(''), [loading, setLoading] = useState(false)
  const rows = data[active] || []
  const setRows = next => setData({ ...data, [active]: next })
  const navigate = page => { setActiveState(page); window.history.pushState({}, '', `#/${encodeURIComponent(page)}`); setMenuOpen(false) }
  const selectCurrency = code => { localStorage.setItem('finalca-currency', code); setCurrency(code); setModal(null) }
  useEffect(() => { const onPopState = () => setActiveState(pageFromHash()); window.addEventListener('popstate', onPopState); window.addEventListener('hashchange', onPopState); return () => { window.removeEventListener('popstate', onPopState); window.removeEventListener('hashchange', onPopState) } }, [])
  useEffect(() => { localStorage.setItem('finalca-name', name) }, [name])
  useEffect(() => { localStorage.setItem('finalca-data', JSON.stringify(data)) }, [data])
  const exportBackup = () => { const link = document.createElement('a'); link.href = URL.createObjectURL(new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' })); link.download = 'finalca-backup.json'; link.click(); URL.revokeObjectURL(link.href); setModal(null) }
  const sendMessage = async event => { event.preventDefault(); if (!message.trim()) return; setLoading(true); setReply(''); try { const response = await fetch('/api/cfo', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ message, context: { name, currency: getCurrency(), data } }) }); const result = await response.json(); if (!response.ok) throw new Error(result.error || 'The CFO service returned an error.'); setReply(result.reply) } catch (error) { setReply(`AI provider error:\n\n${error instanceof Error ? error.message : 'Unable to contact the CFO service.'}`) } finally { setLoading(false); setMessage('') } }
  if (!authenticated) return <Login onLogin={user => { setName(user); setAuthenticated(true) }} />
  const logout = () => { localStorage.removeItem('finalca-auth'); setAuthenticated(false) }
  const displayName = name.trim() || 'there'
  const activeTool = toolPages.find(([key]) => key === active)
  const activeTitle = activeTool?.[1] || active
  return <div className="app-shell"><aside className="sidebar">  <BrandLockup /><button className="workspace-switcher" onClick={() => setModal('workspace')}><div className="avatar">{initials(name)}</div><div><b>{displayName}</b><small>Personal workspace Â· INR</small></div><ChevronDown size={15} /></button><nav className="primary-nav"><p className="eyebrow">Finance workspace</p>{pageItems.map(([label, Icon]) => <button key={label} className={active === label ? 'nav-item active' : 'nav-item'} onClick={() => navigate(label)}><Icon size={17} />{label}</button>)}<p className="eyebrow nav-spacer">Calculators</p>{toolPages.slice(0, 9).map(([key, label, Icon]) => <button key={key} className={active === key ? 'nav-item active' : 'nav-item'} onClick={() => navigate(key)}><Icon size={17} />{label}</button>)}<p className="eyebrow nav-spacer">Manage</p><button className="nav-item" onClick={() => setAlertsOpen(true)}><Bell size={18} />Alerts <span className="alert-count">3</span></button><button className="nav-item" onClick={() => setModal('settings')}><Settings size={18} />Settings</button></nav><div className="sidebar-bottom"><button className="nav-item" onClick={() => setModal('help')}><CircleHelp size={18} />Help center</button><div className="plan-card"><div className="plan-icon"><Sparkles size={15} /></div><div><b>All your finances</b><small>Secure personal workspace</small></div></div></div></aside><main className="main-content"><header className="topbar"><div className="breadcrumb"><button className="back-button" onClick={() => navigate('Overview')} disabled={active === 'Overview'} aria-label="Go back"><ArrowLeft size={15} />Back</button><ChevronRight size={14} /><span>Personal finance</span><ChevronRight size={14} />  <b>{activeTitle}</b></div><div className="top-actions"><button className="icon-button notification-button" onClick={() => setAlertsOpen(true)} aria-label="Open notifications"><Bell size={18} /><i /></button><div className="menu-wrap"><button className="icon-button menu-button" onClick={() => setMenuOpen(!menuOpen)} aria-label="Open workspace menu"><Menu size={22} /></button>  {menuOpen && <div className="quick-menu"><p className="menu-section-label">Finance pages</p>{pageItems.map(([label, Icon]) => <button key={label} onClick={() => navigate(label)}><Icon size={15} />{label}</button>)}<p className="menu-section-label">Calculators & tools</p>{toolPages.map(([key, label, Icon]) => <button key={key} onClick={() => navigate(key)}><Icon size={15} />{label}</button>)}<div className="menu-divider" /><button onClick={() => window.print()}><FileText size={15} />Print current page</button><button onClick={() => setModal('settings')}><Settings size={15} />Workspace settings</button></div>}</div><button className="top-avatar" onClick={() => setModal('workspace')} aria-label="Open profile">{initials(name)}</button></div></header>  <div className="content-wrap" key={active}><section className="welcome-row"><div>  <p className="eyebrow">{active === 'Overview' ? 'Your complete financial command center' : activeTool ? 'Dedicated finance calculator' : 'Separate finance page Â· editable ledger'}</p><h1>{active === 'Overview' ? <>Good morning, <span className="name-title"><input className="name-input" value={name} placeholder="there" onChange={e => setName(e.target.value)} />{!name.trim() && <span className="name-fallback">there</span>} </span><span className="period">{name.trim() ? '.' : ''}</span>  </> : activeTitle}<span className="period">{active === 'Overview' ? '' : '.'}</span></h1><p className="subhead">{active === 'Overview' ? 'Everything editable. Everything in INR. Your wealth, your way.' : activeTool ? 'Model a decision with live assumptions, a projection graph, and practical review prompts.' : `Manage your ${active.toLowerCase()} separately with editable rows and downloads.`}</p></div><button className="primary-button" onClick={() => setChatOpen(true)}><Bot size={17} />Ask your CFO</button>  </section>{active === 'Overview' ? <Overview data={data} setActive={navigate} setChatOpen={setChatOpen} setModal={setModal} /> : toolPages.some(([key]) => key === active) ? <ToolPage toolKey={active} onBack={() => navigate('Overview')} /> : <><section className="page-heading"><div><p className="eyebrow">Dedicated page</p><h2>{active}</h2><p className="subhead">Track, edit, delete, and download every {active.toLowerCase()} record.</p></div><button className="currency-pill" onClick={() =>{currency} <ChevronDown size={14} /></button></section><PageSummary page={active} rows={rows} /><EditableTable page={active} rows={rows} setRows={setRows} /></>}  <div className="disclaimer"><CircleHelp size={14} /> Educational guidance only, not licensed financial advice. Consult a qualified professional for high-stakes decisions.</div>  <footer className="creator-credit">Created by <strong>Agam Mehar</strong><span>Finalca Wealth OS</span><em>Vibe coded</em></footer></div></main>{alertsOpen && <section className="alerts-drawer"><div className="alerts-header"><div><p className="eyebrow">Notifications</p><h2>Alerts & actions</h2></div><button onClick={() => setAlertsOpen(false)} aria-label="Close alerts"><X size={18} /></button></div><div className="alerts-list">{alerts.map(alert => <article className="alert-item" key={alert.title}><span className={`alert-dot ${alert.tone}`} /><div><b>{alert.title}</b><p>{alert.detail}</p><button onClick={() => { setAlertsOpen(false); navigate(alert.page) }}>Review now <ChevronRight size={13} /></button></div></article>)}</div></section>}<button className="chat-fab" onClick={() => setChatOpen(!chatOpen)} aria-label="Open AI CFO chat">{chatOpen ? <X size={21} /> : <MessageSquare size={21} />}<span className="chat-status" /></button>{chatOpen && <section className="chat-drawer"><div className="chat-header"><div className="chat-title"><div className="bot-avatar"><Bot size={19} /></div><div><b>Finalca CFO</b><small><i />Private finance guidance Â· INR context</small></div></div><button onClick={() => setChatOpen(false)}><X size={18} /></button></div><div className="chat-body"><div className="chat-welcome"><Sparkles size={18} /><b>Your editable finance data is connected</b><p>Ask about income, spending, SIPs, loans, assets, liabilities, or goals.</p></div>{reply ? <div className="cfo-bubble cfo-reply"><Bot size={18} /><span>{reply}</span></div> : <><div className="chat-prompt-heading">Start with a finance question</div><div className="prompt-grid">{financePrompts.map(prompt => <button key={prompt} onClick={() => setMessage(prompt)} className="prompt-chip"><span>{prompt}</span><ChevronRight size={14} /></button>)}</div></>}</div><form className="chat-input" onSubmit={sendMessage}><input value={message} onChange={e => setMessage(e.target.value)} placeholder={loading ? 'Thinking...' : 'Ask your AI CFO...'} disabled={loading} /><button type="submit" disabled={loading}><Send size={17} /></button></form></section>}{modal === 'settings' && <Modal title="Workspace settings" eyebrow="Preferences" onClose={() => setModal(null)}><label className="modal-label">Display name<input value={name} onChange={event => setName(event.target.value)} /></label><div className="settings-row"><span><b>Auto-save</b><small>Keep edits synced to this browser</small></span><Check className="positive" size={18} /></div><button className="outline-button modal-action" onClick={exportBackup}><Download size={15} />Export JSON backup</button><button className="outline-button modal-action" onClick={logout}>Lock workspace</button></Modal>}{modal === 'workspace' && <Modal title="Personal workspace" eyebrow="Account" onClose={() => setModal(null)}><div className="profile-summary"><div className="avatar large">{name.split(' ').map(part => part[0]).join('')}</div><div><b>{name}</b><span>Personal workspace Â· INR</span></div></div><button className="primary-button modal-action" onClick={() => setModal('settings')}><Settings size={15} />Manage settings</button><button className="outline-button modal-action" onClick={logout}>Lock and sign out</button></Modal>}{modal === 'help' && <Modal title="How can we help?" eyebrow="Support" onClose={() => setModal(null)}><div className="help-links"><button onClick={() => setModal('guide')}><BookOpen size={16} />Getting started guide <ChevronRight size={14} /></button><button onClick={() => { setModal(null); setChatOpen(true) }}><Bot size={16} />Ask the AI CFO <ChevronRight size={14} /></button><button onClick={() => setModal('shortcuts')}><CircleHelp size={16} />Keyboard shortcuts <ChevronRight size={14} /></button></div></Modal>}{modal === 'currency' &&   <Modal title="Display currency" eyebrow="Formatting" onClose={() => setModal(null)}><p className="modal-copy">Choose the currency used throughout the dashboard and calculators. Stored numbers are converted using the built-in reference rates.</p>{Object.entries(currencies).map(([code, details]) => <button key={code} className={`currency-option ${currency === code ? 'selected' : ''}`} onClick={() => selectCurrency(code)}><Check size={15} />{code} Â· {details.label}</button>)}</Modal>}{modal === 'guide' && <Modal title="Getting started" eyebrow="Guide" onClose={() => setModal(null)}><ol className="guide-list"><li>Add or edit records in any finance page.</li><li>Use search, sorting, duplicate, and CSV export in each ledger.</li><li>Ask the CFO for a plain-language review of your data.</li><li>Export a JSON backup before making major changes.</li></ol></Modal>}{modal === 'shortcuts' && <Modal title="Keyboard shortcuts" eyebrow="Productivity" onClose={() => setModal(null)}><div className="shortcut-list"><span><kbd>Esc</kbd> Close dialogs</span><span><kbd>âŒ˜ / Ctrl</kbd> + P Print current page</span><span><kbd>Enter</kbd> Submit CFO question</span></div></Modal>}</div>
}

createRoot(document.getElementById('root')).render(<StrictMode><App /></StrictMode>)
