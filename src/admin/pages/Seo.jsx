import { useState, useEffect, useCallback } from 'react';
import { adminApi } from '../lib/api';
import { useToast } from '../context/ToastContext';
import {
  PageHeader, LoadingRows, Modal, FormField, Card,
  btnPrimary, btnEdit, btnGhost, inputStyle,
} from '../components/ui';

// Backend columns: page_key, meta_title, meta_description

const PAGE_LABELS = {
  home:           'Home (/)',
  about:          'About (/#about)',
  events:         'Events (/events)',
  confectioneries:'Confectioneries (/confectioneries)',
  designs:        'Designs (/designs)',
  portfolio:      'Portfolio (/#portfolio)',
  blog:           'Blog (/blog)',
};

export default function Seo() {
  const { toast } = useToast();
  const [pages, setPages] = useState([]);
  const [loading, setLoading] = useState(true);
  const [modal, setModal] = useState(null);

  const load = useCallback(async () => {
    setLoading(true);
    try {
      const res = await adminApi.getAllSeo();
      setPages(res.data || []);
    } catch {
      toast('Failed to load SEO settings', 'error');
    } finally {
      setLoading(false);
    }
  }, [toast]);

  useEffect(() => { load(); }, [load]);

  async function save(form) {
    try {
      await adminApi.updateSeo(form.page_key, {
        meta_title: form.meta_title,
        meta_description: form.meta_description,
      });
      toast('SEO updated');
      setModal(null);
      load();
    } catch {
      toast('Save failed', 'error');
    }
  }

  return (
    <div>
      <PageHeader title="SEO Settings" />
      <p style={{ fontSize: 13, color: '#6b7280', fontFamily: 'Inter, sans-serif', marginTop: -12, marginBottom: 24 }}>
        Set meta title and description for each page. Keep title under 60 characters and description under 160.
      </p>

      {loading ? <LoadingRows n={7} /> : (
        <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
          {pages.map(p => (
            <Card key={p.page_key} style={{ padding: '14px 20px', display: 'flex', alignItems: 'center', gap: 16 }}>
              <div style={{ flex: 1, minWidth: 0 }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 4 }}>
                  <span style={{ fontFamily: 'Inter, sans-serif', fontWeight: 700, fontSize: 12, color: '#D9A521', minWidth: 140, whiteSpace: 'nowrap' }}>
                    {PAGE_LABELS[p.page_key] || p.page_key}
                  </span>
                  <span style={{ fontFamily: 'Georgia, serif', fontSize: 14, color: '#111827', fontWeight: 600, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                    {p.meta_title || <em style={{ color: '#9ca3af', fontStyle: 'normal', fontFamily: 'Inter, sans-serif', fontSize: 13 }}>No title set</em>}
                  </span>
                </div>
                <p style={{ fontSize: 12, color: '#6b7280', fontFamily: 'Inter, sans-serif', margin: 0, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap', paddingLeft: 152 }}>
                  {p.meta_description || <em>No description set</em>}
                </p>
              </div>
              <button onClick={() => setModal(p)} style={btnEdit}>Edit</button>
            </Card>
          ))}
        </div>
      )}

      {modal && <SeoModal page={modal} onSave={save} onClose={() => setModal(null)} />}
    </div>
  );
}

function SeoModal({ page, onSave, onClose }) {
  const [form, setForm] = useState({
    page_key:        page.page_key,
    meta_title:      page.meta_title || '',
    meta_description:page.meta_description || '',
  });
  const set = (k, v) => setForm(f => ({ ...f, [k]: v }));
  const titleLen = form.meta_title.length;
  const descLen  = form.meta_description.length;

  return (
    <Modal title={`SEO — ${PAGE_LABELS[page.page_key] || page.page_key}`} onClose={onClose}>
      <FormField
        label="Meta Title"
        hint={`${titleLen}/60 characters — shown in browser tab and search results`}
      >
        <input
          value={form.meta_title}
          onChange={e => set('meta_title', e.target.value)}
          style={{ ...inputStyle, borderColor: titleLen > 60 ? '#ef4444' : undefined }}
          placeholder="Luxe Creations — Premium Events & Design Studio"
          maxLength={80}
        />
      </FormField>

      <FormField
        label="Meta Description"
        hint={`${descLen}/160 characters — shown in search result snippets`}
      >
        <textarea
          value={form.meta_description}
          onChange={e => set('meta_description', e.target.value)}
          rows={3}
          style={{ ...inputStyle, resize: 'vertical', fontFamily: 'Inter, sans-serif', borderColor: descLen > 160 ? '#ef4444' : undefined }}
          placeholder="We craft extraordinary events, confectioneries, and brand designs in Onitsha…"
          maxLength={200}
        />
      </FormField>

      <div style={{ display: 'flex', gap: 10, justifyContent: 'flex-end' }}>
        <button onClick={onClose} style={btnGhost}>Cancel</button>
        <button onClick={() => onSave(form)} style={btnPrimary}>Save</button>
      </div>
    </Modal>
  );
}
