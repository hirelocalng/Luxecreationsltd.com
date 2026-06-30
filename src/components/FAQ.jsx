import { useState } from 'react';
import { useScrollReveal } from '../hooks/useScrollReveal';

const FAQS = [
  {
    q: 'What is Luxe Creations Ltd?',
    a: 'Luxe Creations Ltd is a premium creative lifestyle brand based in Onitsha, Anambra State, with three core divisions: Luxe Events (luxury event planning and management), Luxe Confectioneries (artisan baked goods and custom cakes), and Luxe Designs (creative branding and visual identity design).',
  },
  {
    q: 'What areas do you serve?',
    a: 'We are based in Onitsha, Anambra State, and primarily serve clients across the South-East and South-South regions of Nigeria. We are also available for events and projects across Nigeria and select international destinations — contact us to discuss your specific location.',
  },
  {
    q: 'How do I get started with Luxe Creations?',
    a: 'Simply reach out via our contact form on this page, call us on 09063930552, send an email to luxecreationsltd1@gmail.com, or message us on WhatsApp. We\'ll schedule a complimentary consultation to understand your vision and how we can bring it to life.',
  },
  {
    q: 'What types of events does Luxe Events handle?',
    a: 'We handle a wide range of events including weddings, corporate galas and product launches, milestone birthday celebrations, baby showers, bridal showers, traditional and cultural ceremonies, private dinners, and more. Every event is tailored specifically to you.',
  },
  {
    q: 'How far in advance should I book my event?',
    a: 'For weddings and large-scale events, we recommend booking at least 3–6 months in advance to allow adequate time for planning, sourcing, and design. Smaller events may be booked 4–6 weeks ahead, subject to availability. The earlier, the better — our diary fills quickly.',
  },
  {
    q: 'Does Luxe Events handle destination events?',
    a: 'Yes. We have experience coordinating events outside of Onitsha and are available to travel across Nigeria for the right project. International destination projects are considered on a case-by-case basis. Please contact us to discuss your requirements.',
  },
  {
    q: 'What is included in your event planning packages?',
    a: 'Our packages are fully bespoke, but typically include: concept development, venue sourcing and management, décor design and execution, full vendor coordination (catering, photography, music, florals, etc.), on-the-day event management, and a post-event review. We tailor every package to your specific event.',
  },
  {
    q: 'Can I bring my own ideas and inspirations?',
    a: 'Absolutely — we actively encourage it. Mood boards, Pinterest boards, reference images, colour swatches, or any inspiration you have are very welcome. Your vision is our starting point, and we refine and elevate it into something extraordinary.',
  },
  {
    q: 'What confectionery products does Luxe Confectioneries offer?',
    a: 'We offer custom celebration and wedding cakes, tiered cakes, cupcakes and mini cakes, cake pops, dessert tables, artisan pastries, bespoke confectionery gift packages, and more. Every piece is handcrafted with premium ingredients and exceptional attention to detail.',
  },
  {
    q: 'Do you cater for dietary restrictions or special requirements?',
    a: 'Yes. We can accommodate a range of dietary needs including gluten-free, nut-free, and reduced-sugar options. Please inform us of any specific dietary requirements, allergies, or preferences at the time of placing your order so we can ensure the safest and most delicious result for you.',
  },
  {
    q: 'How much notice do you need for a custom cake order?',
    a: 'Standard cake orders require a minimum of 7–10 days\' notice. Elaborate tiered cakes, wedding cakes, and large dessert table commissions require at least 3–4 weeks. Rush orders may occasionally be accommodated for an additional fee, subject to our schedule — please enquire early.',
  },
  {
    q: 'Do you offer cake tasting sessions?',
    a: 'Yes! We offer tasting sessions for wedding and milestone celebration cake orders by appointment. This is a lovely opportunity to explore flavour combinations and finalize your design choices. Contact us to schedule your tasting session.',
  },
  {
    q: 'What services does Luxe Designs offer?',
    a: 'Luxe Designs covers: brand identity design (logo, colour palette, typography), stationery and print design, event branding and signage, social media graphics and templates, marketing collateral, packaging design, digital content design, brand guidelines, and monthly social media design retainers.',
  },
  {
    q: 'How long does a branding project take?',
    a: 'A complete brand identity project (logo, colours, typography, core assets) typically takes 2–4 weeks from the initial discovery call to final delivery. Timelines vary depending on the scope of the project and the number of revision rounds. We\'ll give you a specific timeline during your consultation.',
  },
  {
    q: 'What file formats will I receive for my brand assets?',
    a: 'You will receive a comprehensive brand asset pack including: all source files (AI/EPS), high-resolution PNGs with transparent backgrounds, PDF formats, JPEG versions, and web-optimized files — all ready for both professional print and digital use.',
  },
  {
    q: 'Can Luxe Designs help with ongoing content creation?',
    a: 'Yes. We offer social media design retainers for clients who need consistent, on-brand graphics and content templates on a monthly basis. This is ideal for businesses who want to maintain a polished, professional visual presence without creating every asset from scratch.',
  },
  {
    q: 'How do you price your services?',
    a: 'All our pricing is project-based, reflecting the scope, complexity, timeline, and specific requirements of each client. We do not publish one-size-fits-all rates because every project we take on is unique. Contact us for a personalized quote following your consultation — we\'re always transparent about pricing.',
  },
  {
    q: 'What is your deposit and payment policy?',
    a: 'We require a non-refundable deposit (typically 50% of the agreed project fee) to secure your booking. The balance is due before the event date or delivery of final assets. We accept bank transfers and mobile payment options. Full payment terms are outlined in your project agreement.',
  },
  {
    q: 'Can I bundle services across multiple divisions?',
    a: 'Absolutely, and we love it when clients do! We offer bundled packages for clients working with multiple divisions simultaneously — for example, combining event planning with cake design and event branding. Ask us about our Full Luxe Experience package for maximum value and creative cohesion.',
  },
  {
    q: 'What makes Luxe Creations different from other vendors?',
    a: 'We combine artistry with precision, passion with professionalism. Every project is deeply personal to us — we invest in truly understanding your vision and then exceed it. Our integrated approach across events, confectioneries, and design means you work with one committed team who knows your brand inside out. That\'s the Luxe difference.',
  },
];

function FAQItem({ q, a, index }) {
  const [open, setOpen] = useState(false);

  return (
    <div style={{
      borderBottom: '1px solid rgba(11,43,34,0.1)',
    }}>
      <button
        aria-expanded={open}
        onClick={() => setOpen((o) => !o)}
        style={{
          width: '100%',
          textAlign: 'left',
          background: 'none',
          border: 'none',
          cursor: 'pointer',
          padding: '22px 0',
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          gap: 16,
        }}
      >
        <div style={{ display: 'flex', alignItems: 'flex-start', gap: 16 }}>
          <span style={{
            fontFamily: 'var(--font-body)',
            fontSize: 11,
            fontWeight: 600,
            color: '#D9A521',
            letterSpacing: '0.12em',
            flexShrink: 0,
            marginTop: 2,
          }}>
            {String(index + 1).padStart(2, '0')}
          </span>
          <span style={{
            fontFamily: 'var(--font-display)',
            fontSize: 'clamp(15px, 2vw, 18px)',
            fontWeight: 500,
            color: open ? '#D9A521' : '#0B2B22',
            lineHeight: 1.4,
            transition: 'color 0.25s ease',
          }}>
            {q}
          </span>
        </div>
        <span
          aria-hidden="true"
          style={{
            width: 28,
            height: 28,
            borderRadius: '50%',
            border: `1.5px solid ${open ? '#D9A521' : 'rgba(11,43,34,0.2)'}`,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            flexShrink: 0,
            transition: 'border-color 0.25s ease, transform 0.3s ease',
            transform: open ? 'rotate(45deg)' : 'rotate(0)',
            color: open ? '#D9A521' : 'rgba(11,43,34,0.5)',
          }}
        >
          <svg width="12" height="12" viewBox="0 0 12 12" fill="none" aria-hidden="true">
            <path d="M6 1V11M1 6H11" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
          </svg>
        </span>
      </button>

      <div className={`faq-answer ${open ? 'open' : ''}`}>
        <p style={{
          fontFamily: 'var(--font-body)',
          fontSize: 15,
          lineHeight: 1.8,
          color: 'rgba(11,43,34,0.7)',
          margin: '0 0 22px',
          paddingLeft: 44,
        }}>
          {a}
        </p>
      </div>
    </div>
  );
}

export default function FAQ() {
  const ref = useScrollReveal();

  return (
    <section
      id="faq"
      aria-label="Frequently asked questions"
      ref={ref}
      style={{ background: '#F7F3E8', padding: '96px 24px' }}
    >
      <div style={{ maxWidth: 860, margin: '0 auto' }}>
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
            FAQ
          </p>
          <h2 className="reveal reveal-delay-1" style={{
            fontFamily: 'var(--font-display)',
            fontSize: 'clamp(28px, 4vw, 46px)',
            fontWeight: 600,
            color: '#0B2B22',
            margin: '0 0 16px',
            letterSpacing: '-0.02em',
          }}>
            Frequently Asked Questions
          </h2>
          <p className="reveal reveal-delay-2" style={{
            fontFamily: 'var(--font-body)',
            fontSize: 16,
            color: 'rgba(11,43,34,0.6)',
            maxWidth: 460,
            margin: '0 auto',
            lineHeight: 1.7,
          }}>
            Everything you need to know about working with Luxe Creations Ltd.
          </p>
        </div>

        <div className="reveal reveal-delay-2">
          {FAQS.map((item, i) => (
            <FAQItem key={i} {...item} index={i} />
          ))}
        </div>

        <div style={{ textAlign: 'center', marginTop: 48 }}>
          <p style={{
            fontFamily: 'var(--font-body)',
            fontSize: 15,
            color: 'rgba(11,43,34,0.65)',
            marginBottom: 20,
          }}>
            Still have questions?
          </p>
          <a
            href="#contact"
            style={{
              display: 'inline-block',
              background: '#0B2B22',
              color: '#D9A521',
              padding: '13px 30px',
              fontSize: 13,
              fontWeight: 600,
              letterSpacing: '0.08em',
              textTransform: 'uppercase',
              textDecoration: 'none',
              borderRadius: 3,
              fontFamily: 'var(--font-body)',
              transition: 'background 0.25s ease, transform 0.2s ease',
            }}
            onMouseEnter={(e) => {
              e.target.style.background = '#0f3a2e';
              e.target.style.transform = 'translateY(-2px)';
            }}
            onMouseLeave={(e) => {
              e.target.style.background = '#0B2B22';
              e.target.style.transform = 'translateY(0)';
            }}
          >
            Get In Touch
          </a>
        </div>
      </div>
    </section>
  );
}
