import { useState } from 'react';
import { useScrollReveal } from '../hooks/useScrollReveal';
import { api } from '../lib/api';

const SERVICES = [
  'Luxe Events — Wedding',
  'Luxe Events — Corporate',
  'Luxe Events — Birthday Celebration',
  'Luxe Events — Other',
  'Luxe Confectioneries — Custom Cake',
  'Luxe Confectioneries — Dessert Table',
  'Luxe Confectioneries — Other',
  'Luxe Designs — Brand Identity',
  'Luxe Designs — Social Media Design',
  'Luxe Designs — Other',
  'Multiple Services / Bundle Package',
];

export default function Contact() {
  const ref = useScrollReveal();
  const [form, setForm] = useState({
    name: '', phone: '', email: '', service: '', date: '', message: '',
    honeypot: '',
  });
  const [status, setStatus] = useState('idle');

  const handleChange = (e) => {
    setForm((f) => ({ ...f, [e.target.name]: e.target.value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (form.honeypot) return; // spam protection
    setStatus('sending');
    try {
      await api.submitInquiry({
        name: form.name,
        phone: form.phone,
        email: form.email,
        service: form.service,
        preferred_date: form.date || undefined,
        message: form.message,
        honeypot: form.honeypot,
      });
      setStatus('sent');
    } catch (err) {
      console.error('Submission error:', err);
      setStatus('error');
    }
  };

  const inputStyle = {
    width: '100%',
    background: 'rgba(247,243,232,0.05)',
    border: '1px solid rgba(247,243,232,0.15)',
    borderRadius: 3,
    padding: '14px 16px',
    fontFamily: 'var(--font-body)',
    fontSize: 15,
    color: '#F7F3E8',
    outline: 'none',
    transition: 'border-color 0.25s ease',
    boxSizing: 'border-box',
  };

  const labelStyle = {
    display: 'block',
    fontFamily: 'var(--font-body)',
    fontSize: 11,
    fontWeight: 600,
    letterSpacing: '0.18em',
    textTransform: 'uppercase',
    color: 'rgba(247,243,232,0.55)',
    marginBottom: 8,
  };

  return (
    <section
      id="contact"
      aria-label="Contact us"
      ref={ref}
      style={{ background: '#0B2B22', padding: '96px 24px' }}
    >
      <div style={{ maxWidth: 1200, margin: '0 auto' }}>
        <div style={{ textAlign: 'center', marginBottom: 64 }}>
          <p className="reveal" style={{
            fontFamily: 'var(--font-body)',
            fontSize: 11,
            fontWeight: 600,
            letterSpacing: '0.3em',
            textTransform: 'uppercase',
            color: '#D9A521',
            marginBottom: 12,
          }}>
            Contact Us
          </p>
          <h2 className="reveal reveal-delay-1" style={{
            fontFamily: 'var(--font-display)',
            fontSize: 'clamp(28px, 4vw, 46px)',
            fontWeight: 600,
            color: '#F7F3E8',
            margin: '0 0 16px',
            letterSpacing: '-0.02em',
          }}>
            Let's Start a Conversation
          </h2>
          <p className="reveal reveal-delay-2" style={{
            fontFamily: 'var(--font-body)',
            fontSize: 16,
            color: 'rgba(247,243,232,0.6)',
            maxWidth: 480,
            margin: '0 auto',
            lineHeight: 1.7,
          }}>
            Fill in the form below and we'll get back to you within 24 hours
            to discuss your vision.
          </p>
        </div>

        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))',
          gap: 64,
        }}>
          {/* Form */}
          <div className="reveal">
            {status === 'error' && (
              <div style={{
                background: 'rgba(201,123,94,0.12)',
                border: '1px solid rgba(201,123,94,0.4)',
                borderRadius: 4,
                padding: '16px 20px',
                marginBottom: 20,
                fontFamily: 'var(--font-body)',
                fontSize: 14,
                color: '#C97B5E',
              }}>
                Something went wrong. Please try again or contact us directly at{' '}
                <a href="mailto:luxecreationsltd1@gmail.com" style={{ color: '#D9A521' }}>
                  luxecreationsltd1@gmail.com
                </a>
              </div>
            )}
          {status === 'sent' ? (
              <div style={{
                background: 'rgba(217,165,33,0.1)',
                border: '1px solid rgba(217,165,33,0.3)',
                borderRadius: 4,
                padding: '48px 32px',
                textAlign: 'center',
              }}>
                <div style={{ fontSize: 40, marginBottom: 16 }}>✓</div>
                <h3 style={{
                  fontFamily: 'var(--font-display)',
                  fontSize: 24,
                  fontWeight: 600,
                  color: '#D9A521',
                  margin: '0 0 12px',
                }}>
                  Message Received!
                </h3>
                <p style={{
                  fontFamily: 'var(--font-body)',
                  fontSize: 15,
                  color: 'rgba(247,243,232,0.7)',
                  lineHeight: 1.7,
                  margin: 0,
                }}>
                  Thank you for reaching out to Luxe Creations Ltd. We'll review
                  your enquiry and get back to you within 24 hours. A confirmation
                  has been sent to your email.
                </p>
              </div>
            ) : (
              <form onSubmit={handleSubmit} noValidate>
                {/* Honeypot field for spam */}
                <div style={{ display: 'none' }} aria-hidden="true">
                  <label>
                    Leave this empty
                    <input
                      type="text"
                      name="honeypot"
                      value={form.honeypot}
                      onChange={handleChange}
                      tabIndex={-1}
                      autoComplete="off"
                    />
                  </label>
                </div>

                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 18, marginBottom: 18 }}>
                  <div>
                    <label htmlFor="name" style={labelStyle}>Full Name *</label>
                    <input
                      id="name"
                      type="text"
                      name="name"
                      required
                      autoComplete="name"
                      placeholder="Your full name"
                      value={form.name}
                      onChange={handleChange}
                      style={inputStyle}
                      onFocus={(e) => (e.target.style.borderColor = '#D9A521')}
                      onBlur={(e) => (e.target.style.borderColor = 'rgba(247,243,232,0.15)')}
                    />
                  </div>
                  <div>
                    <label htmlFor="phone" style={labelStyle}>Phone Number *</label>
                    <input
                      id="phone"
                      type="tel"
                      name="phone"
                      required
                      autoComplete="tel"
                      placeholder="e.g. 09063930552"
                      value={form.phone}
                      onChange={handleChange}
                      style={inputStyle}
                      onFocus={(e) => (e.target.style.borderColor = '#D9A521')}
                      onBlur={(e) => (e.target.style.borderColor = 'rgba(247,243,232,0.15)')}
                    />
                  </div>
                </div>

                <div style={{ marginBottom: 18 }}>
                  <label htmlFor="email" style={labelStyle}>Email Address *</label>
                  <input
                    id="email"
                    type="email"
                    name="email"
                    required
                    autoComplete="email"
                    placeholder="your@email.com"
                    value={form.email}
                    onChange={handleChange}
                    style={inputStyle}
                    onFocus={(e) => (e.target.style.borderColor = '#D9A521')}
                    onBlur={(e) => (e.target.style.borderColor = 'rgba(247,243,232,0.15)')}
                  />
                </div>

                <div style={{ marginBottom: 18 }}>
                  <label htmlFor="service" style={labelStyle}>Service Needed *</label>
                  <select
                    id="service"
                    name="service"
                    required
                    value={form.service}
                    onChange={handleChange}
                    style={{ ...inputStyle, color: form.service ? '#F7F3E8' : 'rgba(247,243,232,0.4)' }}
                    onFocus={(e) => (e.target.style.borderColor = '#D9A521')}
                    onBlur={(e) => (e.target.style.borderColor = 'rgba(247,243,232,0.15)')}
                  >
                    <option value="" disabled>Select a service</option>
                    {SERVICES.map((s) => (
                      <option key={s} value={s} style={{ background: '#0B2B22', color: '#F7F3E8' }}>
                        {s}
                      </option>
                    ))}
                  </select>
                </div>

                <div style={{ marginBottom: 18 }}>
                  <label htmlFor="date" style={labelStyle}>Preferred Date</label>
                  <input
                    id="date"
                    type="date"
                    name="date"
                    value={form.date}
                    onChange={handleChange}
                    style={{ ...inputStyle, colorScheme: 'dark' }}
                    onFocus={(e) => (e.target.style.borderColor = '#D9A521')}
                    onBlur={(e) => (e.target.style.borderColor = 'rgba(247,243,232,0.15)')}
                  />
                </div>

                <div style={{ marginBottom: 28 }}>
                  <label htmlFor="message" style={labelStyle}>Message *</label>
                  <textarea
                    id="message"
                    name="message"
                    required
                    rows={5}
                    placeholder="Tell us about your vision, event, or project..."
                    value={form.message}
                    onChange={handleChange}
                    style={{ ...inputStyle, resize: 'vertical', minHeight: 120 }}
                    onFocus={(e) => (e.target.style.borderColor = '#D9A521')}
                    onBlur={(e) => (e.target.style.borderColor = 'rgba(247,243,232,0.15)')}
                  />
                </div>

                <button
                  type="submit"
                  disabled={status === 'sending'}
                  style={{
                    width: '100%',
                    background: '#D9A521',
                    color: '#0B2B22',
                    padding: '16px',
                    fontSize: 14,
                    fontWeight: 700,
                    letterSpacing: '0.1em',
                    textTransform: 'uppercase',
                    border: 'none',
                    borderRadius: 3,
                    cursor: status === 'sending' ? 'wait' : 'pointer',
                    fontFamily: 'var(--font-body)',
                    opacity: status === 'sending' ? 0.8 : 1,
                    transition: 'background 0.25s ease, transform 0.2s ease',
                  }}
                  onMouseEnter={(e) => {
                    if (status !== 'sending') {
                      e.target.style.background = '#f0c84a';
                      e.target.style.transform = 'translateY(-1px)';
                    }
                  }}
                  onMouseLeave={(e) => {
                    e.target.style.background = '#D9A521';
                    e.target.style.transform = 'translateY(0)';
                  }}
                >
                  {status === 'sending' ? 'Sending…' : 'Send Message'}
                </button>
              </form>
            )}
          </div>

          {/* Business details */}
          <div className="reveal reveal-delay-2" style={{ display: 'flex', flexDirection: 'column', gap: 32 }}>
            <div>
              <h3 style={{
                fontFamily: 'var(--font-display)',
                fontSize: 22,
                fontWeight: 600,
                color: '#F7F3E8',
                margin: '0 0 24px',
              }}>
                Get In Touch
              </h3>

              {[
                {
                  icon: (
                    <svg width="20" height="20" viewBox="0 0 20 20" fill="none" aria-hidden="true">
                      <path d="M3 5C3 3.9 3.9 3 5 3H7.3C7.7 3 8.1 3.2 8.3 3.6L9.7 6.7C9.9 7.1 9.8 7.6 9.4 7.9L8.1 8.9C9.1 10.9 10.7 12.5 12.6 13.4L13.6 12.1C14 11.7 14.5 11.6 14.8 11.8L18 13.2C18.4 13.4 18.6 13.8 18.6 14.2V16.5C18.6 17.6 17.7 18.5 16.6 18.5C9.1 18.5 3 12.4 3 5Z" stroke="#D9A521" strokeWidth="1.5" strokeLinecap="round" />
                    </svg>
                  ),
                  label: 'Phone',
                  value: '09063930552',
                  href: 'tel:09063930552',
                },
                {
                  icon: (
                    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" aria-hidden="true">
                      <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51C8 7 7.8 7 7.6 7c-.2 0-.52.075-.792.372C6.537 7.67 5.5 8.7 5.5 10.163c0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413z" stroke="#D9A521" strokeWidth="1.5" fill="none" strokeLinecap="round" strokeLinejoin="round" />
                      <circle cx="12" cy="12" r="10" stroke="#D9A521" strokeWidth="1.5" />
                    </svg>
                  ),
                  label: 'WhatsApp',
                  value: '+234 906 393 0552',
                  href: 'https://wa.me/2349063930552',
                  external: true,
                },
                {
                  icon: (
                    <svg width="20" height="20" viewBox="0 0 20 20" fill="none" aria-hidden="true">
                      <rect x="2" y="4" width="16" height="12" rx="2" stroke="#D9A521" strokeWidth="1.5" />
                      <path d="M2 7L10 12L18 7" stroke="#D9A521" strokeWidth="1.5" strokeLinecap="round" />
                    </svg>
                  ),
                  label: 'Email',
                  value: 'luxecreationsltd1@gmail.com',
                  href: 'mailto:luxecreationsltd1@gmail.com',
                },
                {
                  icon: (
                    <svg width="20" height="20" viewBox="0 0 20 20" fill="none" aria-hidden="true">
                      <path d="M10 2C7.2 2 5 4.2 5 7C5 11 10 18 10 18C10 18 15 11 15 7C15 4.2 12.8 2 10 2Z" stroke="#D9A521" strokeWidth="1.5" />
                      <circle cx="10" cy="7" r="2" stroke="#D9A521" strokeWidth="1.5" />
                    </svg>
                  ),
                  label: 'Address',
                  value: 'Awka Road, Onitsha, Anambra State',
                },
              ].map(({ icon, label, value, href, external }) => (
                <div key={label} style={{
                  display: 'flex',
                  alignItems: 'flex-start',
                  gap: 16,
                  padding: '18px 0',
                  borderBottom: '1px solid rgba(247,243,232,0.07)',
                }}>
                  <div style={{ flexShrink: 0, marginTop: 2 }}>{icon}</div>
                  <div>
                    <p style={{
                      fontFamily: 'var(--font-body)',
                      fontSize: 10,
                      fontWeight: 600,
                      letterSpacing: '0.18em',
                      textTransform: 'uppercase',
                      color: 'rgba(247,243,232,0.4)',
                      margin: '0 0 4px',
                    }}>
                      {label}
                    </p>
                    {href ? (
                      <a
                        href={href}
                        target={external ? '_blank' : undefined}
                        rel={external ? 'noopener noreferrer' : undefined}
                        style={{
                          fontFamily: 'var(--font-body)',
                          fontSize: 15,
                          color: '#F7F3E8',
                          textDecoration: 'none',
                          transition: 'color 0.2s ease',
                        }}
                        onMouseEnter={(e) => (e.target.style.color = '#D9A521')}
                        onMouseLeave={(e) => (e.target.style.color = '#F7F3E8')}
                      >
                        {value}
                      </a>
                    ) : (
                      <p style={{
                        fontFamily: 'var(--font-body)',
                        fontSize: 15,
                        color: '#F7F3E8',
                        margin: 0,
                      }}>
                        {value}
                      </p>
                    )}
                  </div>
                </div>
              ))}
            </div>

            {/* Business hours */}
            <div style={{
              background: 'rgba(247,243,232,0.04)',
              border: '1px solid rgba(247,243,232,0.08)',
              borderRadius: 4,
              padding: '28px 24px',
            }}>
              <h4 style={{
                fontFamily: 'var(--font-body)',
                fontSize: 11,
                fontWeight: 600,
                letterSpacing: '0.2em',
                textTransform: 'uppercase',
                color: '#D9A521',
                margin: '0 0 18px',
              }}>
                Business Hours
              </h4>
              {[
                ['Monday – Friday', '8:00 AM – 6:00 PM'],
                ['Saturday', '9:00 AM – 4:00 PM'],
                ['Sunday', 'By Appointment'],
              ].map(([day, hours]) => (
                <div key={day} style={{
                  display: 'flex',
                  justifyContent: 'space-between',
                  fontFamily: 'var(--font-body)',
                  fontSize: 14,
                  padding: '8px 0',
                  borderBottom: '1px solid rgba(247,243,232,0.05)',
                }}>
                  <span style={{ color: 'rgba(247,243,232,0.6)' }}>{day}</span>
                  <span style={{ color: '#F7F3E8', fontWeight: 500 }}>{hours}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
