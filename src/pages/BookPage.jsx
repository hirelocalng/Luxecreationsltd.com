import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import Layout from '../components/Layout';

const DIVISIONS = ['Luxe Events', 'Luxe Confectioneries', 'Luxe Designs', 'Not sure yet'];
const BUDGETS = ['Under ₦100,000', '₦100,000 – ₦300,000', '₦300,000 – ₦700,000', '₦700,000 – ₦1,500,000', 'Above ₦1,500,000', 'Prefer to discuss'];

const fieldStyle = {
  width: '100%',
  background: 'rgba(247,243,232,0.06)',
  border: '1px solid rgba(247,243,232,0.15)',
  borderRadius: 3,
  padding: '14px 16px',
  fontFamily: 'var(--font-body)',
  fontSize: 15,
  color: '#F7F3E8',
  outline: 'none',
  transition: 'border-color 0.2s ease',
  boxSizing: 'border-box',
};

const labelStyle = {
  display: 'block',
  fontFamily: 'var(--font-body)',
  fontSize: 11,
  fontWeight: 600,
  letterSpacing: '0.15em',
  textTransform: 'uppercase',
  color: 'rgba(247,243,232,0.55)',
  marginBottom: 8,
};

export default function BookPage() {
  const [form, setForm] = useState({
    name: '', email: '', phone: '', division: '', eventType: '', date: '',
    budget: '', message: '',
  });
  const [status, setStatus] = useState('idle');
  const [focusedField, setFocusedField] = useState(null);

  useEffect(() => { window.scrollTo(0, 0); }, []);

  const handleChange = (e) => {
    setForm((f) => ({ ...f, [e.target.name]: e.target.value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setStatus('sending');
    try {
      const res = await fetch('/api/inquiries', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name: form.name,
          email: form.email,
          phone: form.phone,
          service: form.division,
          message: `Event/Project Type: ${form.eventType}\nPreferred Date: ${form.date}\nBudget: ${form.budget}\n\n${form.message}`,
          honeypot: '',
        }),
      });
      if (res.ok) {
        setStatus('success');
        setForm({ name: '', email: '', phone: '', division: '', eventType: '', date: '', budget: '', message: '' });
      } else {
        setStatus('error');
      }
    } catch {
      setStatus('error');
    }
  };

  const focusBorder = (name) => setFocusedField(name);
  const blurBorder = () => setFocusedField(null);

  const getFieldStyle = (name) => ({
    ...fieldStyle,
    borderColor: focusedField === name ? '#D9A521' : 'rgba(247,243,232,0.15)',
  });

  return (
    <Layout>
      {/* Page Hero */}
      <section style={{
        position: 'relative',
        background: '#0B2B22',
        padding: '140px 24px 80px',
        textAlign: 'center',
        overflow: 'hidden',
      }}>
        <div aria-hidden="true" style={{
          position: 'absolute', inset: 0,
          backgroundImage: 'radial-gradient(circle, rgba(247,243,232,0.03) 1px, transparent 1px)',
          backgroundSize: '28px 28px',
        }} />
        <div aria-hidden="true" style={{
          position: 'absolute', top: '50%', left: '50%',
          width: 600, height: 320,
          background: 'radial-gradient(ellipse, rgba(217,165,33,0.1) 0%, transparent 70%)',
          transform: 'translate(-50%, -50%)',
          pointerEvents: 'none',
        }} />

        {/* Breadcrumb */}
        <div style={{ position: 'absolute', top: 100, left: 'max(24px, calc(50% - 580px))', zIndex: 1 }}>
          <Link to="/" style={{
            fontFamily: 'var(--font-body)', fontSize: 12, fontWeight: 500,
            letterSpacing: '0.08em', textTransform: 'uppercase',
            color: 'rgba(217,165,33,0.7)', textDecoration: 'none',
            display: 'inline-flex', alignItems: 'center', gap: 6,
            transition: 'color 0.2s ease',
          }}
          onMouseEnter={(e) => (e.currentTarget.style.color = '#D9A521')}
          onMouseLeave={(e) => (e.currentTarget.style.color = 'rgba(217,165,33,0.7)')}
          >
            <svg width="14" height="10" viewBox="0 0 14 10" fill="none" aria-hidden="true">
              <path d="M13 5H1M6 1L1 5L6 9" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
            Back to Home
          </Link>
        </div>

        <div style={{ position: 'relative', zIndex: 1 }}>
          <p style={{
            fontFamily: 'var(--font-body)', fontSize: 11, fontWeight: 600,
            letterSpacing: '0.3em', textTransform: 'uppercase',
            color: '#D9A521', marginBottom: 20,
          }}>
            Let's Create Together
          </p>
          <h1 style={{
            fontFamily: 'var(--font-display)',
            fontSize: 'clamp(40px, 6vw, 80px)',
            fontWeight: 600, lineHeight: 1.1,
            color: '#D9A521', margin: '0 0 24px',
            letterSpacing: '-0.02em',
          }}>
            Book a Consultation
          </h1>
          <p style={{
            fontFamily: 'var(--font-body)', fontSize: 'clamp(15px, 2vw, 18px)',
            lineHeight: 1.7, color: 'rgba(247,243,232,0.65)',
            maxWidth: 600, margin: '0 auto',
          }}>
            Tell us about your vision and we'll reach out within 24 hours to schedule
            your complimentary consultation.
          </p>
        </div>
      </section>

      {/* Booking Form */}
      <section style={{ background: '#0B2B22', padding: '80px 24px 100px' }}>
        <div style={{ maxWidth: 760, margin: '0 auto' }}>

          {status === 'success' ? (
            <div style={{
              textAlign: 'center', padding: '64px 32px',
              background: 'rgba(247,243,232,0.04)',
              border: '1px solid rgba(217,165,33,0.25)',
              borderRadius: 4,
            }}>
              <div style={{ fontSize: 48, marginBottom: 24 }}>✦</div>
              <h2 style={{
                fontFamily: 'var(--font-display)', fontSize: 32,
                fontWeight: 600, color: '#D9A521', margin: '0 0 16px',
              }}>
                Thank You!
              </h2>
              <p style={{
                fontFamily: 'var(--font-body)', fontSize: 16, lineHeight: 1.7,
                color: 'rgba(247,243,232,0.65)', margin: '0 0 32px',
              }}>
                We've received your consultation request. Our team will be in touch
                within 24 hours to schedule your discovery call.
              </p>
              <Link to="/" style={{
                display: 'inline-block', background: '#D9A521', color: '#0B2B22',
                padding: '14px 32px', fontSize: 13, fontWeight: 700,
                letterSpacing: '0.08em', textTransform: 'uppercase',
                textDecoration: 'none', borderRadius: 3, fontFamily: 'var(--font-body)',
              }}>
                Back to Home
              </Link>
            </div>
          ) : (
            <form onSubmit={handleSubmit} noValidate>
              <div style={{
                display: 'grid',
                gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))',
                gap: 24,
                marginBottom: 24,
              }}>
                {/* Name */}
                <div>
                  <label htmlFor="book-name" style={labelStyle}>Full Name *</label>
                  <input
                    id="book-name" name="name" type="text" required
                    placeholder="Your full name"
                    value={form.name} onChange={handleChange}
                    onFocus={() => focusBorder('name')} onBlur={blurBorder}
                    style={getFieldStyle('name')}
                  />
                </div>

                {/* Email */}
                <div>
                  <label htmlFor="book-email" style={labelStyle}>Email Address *</label>
                  <input
                    id="book-email" name="email" type="email" required
                    placeholder="your@email.com"
                    value={form.email} onChange={handleChange}
                    onFocus={() => focusBorder('email')} onBlur={blurBorder}
                    style={getFieldStyle('email')}
                  />
                </div>

                {/* Phone */}
                <div>
                  <label htmlFor="book-phone" style={labelStyle}>Phone Number</label>
                  <input
                    id="book-phone" name="phone" type="tel"
                    placeholder="+234 000 000 0000"
                    value={form.phone} onChange={handleChange}
                    onFocus={() => focusBorder('phone')} onBlur={blurBorder}
                    style={getFieldStyle('phone')}
                  />
                </div>

                {/* Division */}
                <div>
                  <label htmlFor="book-division" style={labelStyle}>Division of Interest *</label>
                  <select
                    id="book-division" name="division" required
                    value={form.division} onChange={handleChange}
                    onFocus={() => focusBorder('division')} onBlur={blurBorder}
                    style={{ ...getFieldStyle('division'), cursor: 'pointer' }}
                  >
                    <option value="" disabled>Select a division</option>
                    {DIVISIONS.map((d) => (
                      <option key={d} value={d} style={{ background: '#0B2B22', color: '#F7F3E8' }}>{d}</option>
                    ))}
                  </select>
                </div>

                {/* Event Type */}
                <div>
                  <label htmlFor="book-eventType" style={labelStyle}>Event / Project Type</label>
                  <input
                    id="book-eventType" name="eventType" type="text"
                    placeholder="e.g. Wedding, Brand Identity, Birthday Cake"
                    value={form.eventType} onChange={handleChange}
                    onFocus={() => focusBorder('eventType')} onBlur={blurBorder}
                    style={getFieldStyle('eventType')}
                  />
                </div>

                {/* Date */}
                <div>
                  <label htmlFor="book-date" style={labelStyle}>Preferred Date / Timeline</label>
                  <input
                    id="book-date" name="date" type="text"
                    placeholder="e.g. December 2026, ASAP, Flexible"
                    value={form.date} onChange={handleChange}
                    onFocus={() => focusBorder('date')} onBlur={blurBorder}
                    style={getFieldStyle('date')}
                  />
                </div>

                {/* Budget */}
                <div style={{ gridColumn: '1 / -1' }}>
                  <label htmlFor="book-budget" style={labelStyle}>Approximate Budget</label>
                  <select
                    id="book-budget" name="budget"
                    value={form.budget} onChange={handleChange}
                    onFocus={() => focusBorder('budget')} onBlur={blurBorder}
                    style={{ ...getFieldStyle('budget'), cursor: 'pointer' }}
                  >
                    <option value="" disabled>Select a budget range</option>
                    {BUDGETS.map((b) => (
                      <option key={b} value={b} style={{ background: '#0B2B22', color: '#F7F3E8' }}>{b}</option>
                    ))}
                  </select>
                </div>

                {/* Message */}
                <div style={{ gridColumn: '1 / -1' }}>
                  <label htmlFor="book-message" style={labelStyle}>Tell Us About Your Vision *</label>
                  <textarea
                    id="book-message" name="message" required rows={6}
                    placeholder="Describe your event, project, or idea in as much detail as you'd like..."
                    value={form.message} onChange={handleChange}
                    onFocus={() => focusBorder('message')} onBlur={blurBorder}
                    style={{ ...getFieldStyle('message'), resize: 'vertical', minHeight: 140 }}
                  />
                </div>
              </div>

              {status === 'error' && (
                <p style={{
                  fontFamily: 'var(--font-body)', fontSize: 14,
                  color: '#ff6b6b', marginBottom: 20,
                }}>
                  Something went wrong. Please try again or reach us on WhatsApp.
                </p>
              )}

              <div style={{ display: 'flex', gap: 16, alignItems: 'center', flexWrap: 'wrap' }}>
                <button
                  type="submit"
                  disabled={status === 'sending'}
                  style={{
                    background: status === 'sending' ? 'rgba(217,165,33,0.6)' : '#D9A521',
                    color: '#0B2B22',
                    padding: '16px 44px', fontSize: 14, fontWeight: 700,
                    letterSpacing: '0.08em', textTransform: 'uppercase',
                    border: 'none', borderRadius: 3, cursor: status === 'sending' ? 'not-allowed' : 'pointer',
                    fontFamily: 'var(--font-body)',
                    transition: 'background 0.25s ease, transform 0.2s ease',
                  }}
                  onMouseEnter={(e) => {
                    if (status !== 'sending') {
                      e.currentTarget.style.background = '#f0c84a';
                      e.currentTarget.style.transform = 'translateY(-2px)';
                    }
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.background = status === 'sending' ? 'rgba(217,165,33,0.6)' : '#D9A521';
                    e.currentTarget.style.transform = 'translateY(0)';
                  }}
                >
                  {status === 'sending' ? 'Sending…' : 'Send Consultation Request'}
                </button>
                <a href="https://wa.me/2349063930552" target="_blank" rel="noopener noreferrer"
                  style={{
                    fontFamily: 'var(--font-body)', fontSize: 13, fontWeight: 500,
                    color: 'rgba(247,243,232,0.5)', textDecoration: 'none',
                    transition: 'color 0.2s ease',
                  }}
                  onMouseEnter={(e) => (e.currentTarget.style.color = '#D9A521')}
                  onMouseLeave={(e) => (e.currentTarget.style.color = 'rgba(247,243,232,0.5)')}
                >
                  Or chat on WhatsApp →
                </a>
              </div>
            </form>
          )}

          {/* Reassurance strip */}
          <div style={{
            marginTop: 56, paddingTop: 40,
            borderTop: '1px solid rgba(247,243,232,0.08)',
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))',
            gap: 28,
          }}>
            {[
              { icon: '✦', label: 'Response within 24 hours' },
              { icon: '◈', label: 'No obligation consultation' },
              { icon: '◉', label: 'Fully bespoke packages' },
            ].map(({ icon, label }) => (
              <div key={label} style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                <span style={{ color: '#D9A521', fontSize: 16 }}>{icon}</span>
                <span style={{
                  fontFamily: 'var(--font-body)', fontSize: 13,
                  color: 'rgba(247,243,232,0.5)',
                }}>
                  {label}
                </span>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Input placeholder styles */}
      <style>{`
        input::placeholder, textarea::placeholder { color: rgba(247,243,232,0.25); }
        select option { background: #0B2B22; color: #F7F3E8; }
      `}</style>
    </Layout>
  );
}
