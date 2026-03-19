'use client'

import { useState } from 'react'
import { useTranslations } from 'next-intl'

export default function ContactPage() {
  const t = useTranslations('contact')
  const [status, setStatus] = useState<'idle' | 'loading' | 'success' | 'error'>('idle')
  const [form, setForm] = useState({ name: '', email: '', message: '' })

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setStatus('loading')
    const res = await fetch('/api/contact', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(form),
    })
    setStatus(res.ok ? 'success' : 'error')
  }

  const inputClass = "w-full bg-transparent border-b border-grain focus:border-accent outline-none py-2 font-garamond text-lg text-ink transition-colors"
  const labelClass = "block font-mono text-xs text-muted tracking-widest uppercase mb-2"

  return (
    <div className="max-w-xl mx-auto px-4 md:px-8 pt-8 pb-20">
      <h1 className="font-cormorant italic text-5xl text-ink mb-4">Contact</h1>
      <p className="font-garamond text-lg text-muted mb-10">{t('intro')}</p>

      <form onSubmit={handleSubmit} className="space-y-6" noValidate>
        <div>
          <label className={labelClass}>{t('name')}</label>
          <input type="text" required value={form.name}
            onChange={(e) => setForm((f) => ({ ...f, name: e.target.value }))}
            className={inputClass} />
        </div>
        <div>
          <label className={labelClass}>{t('email')}</label>
          <input type="email" required value={form.email}
            onChange={(e) => setForm((f) => ({ ...f, email: e.target.value }))}
            className={inputClass} />
        </div>
        <div>
          <label className={labelClass}>{t('message')}</label>
          <textarea required rows={5} value={form.message}
            onChange={(e) => setForm((f) => ({ ...f, message: e.target.value }))}
            className={`${inputClass} resize-none`} />
        </div>

        {status === 'success' ? (
          <p className="font-mono text-sm text-accent tracking-wide">{t('success')}</p>
        ) : (
          <button type="submit" disabled={status === 'loading'}
            className="font-mono text-xs tracking-widest uppercase text-ink border border-ink px-6 py-3 hover:bg-ink hover:text-paper transition-colors disabled:opacity-50">
            {status === 'loading' ? '...' : t('submit')}
          </button>
        )}

        {status === 'error' && (
          <p className="font-mono text-xs text-red-700">
            {t('error')}{' '}
            <a href={`mailto:${process.env.NEXT_PUBLIC_CONTACT_EMAIL}`}
              className="underline hover:text-accent transition-colors">
              {process.env.NEXT_PUBLIC_CONTACT_EMAIL}
            </a>
          </p>
        )}
      </form>

      <div className="mt-16 pt-8 border-t border-grain">
        <a href="https://instagram.com/pilarolivero" target="_blank" rel="noopener noreferrer"
          className="font-mono text-xs text-muted hover:text-accent transition-colors tracking-widest">
          @pilarolivero ↗
        </a>
      </div>
    </div>
  )
}
