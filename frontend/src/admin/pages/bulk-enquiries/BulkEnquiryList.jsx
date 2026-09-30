import { useEffect, useState } from 'react';
import { adminListBulkEnquiries, adminUpdateBulkEnquiry } from '../../api/bulkenquiries';

const STATUSES = ['new', 'contacted', 'closed'];

export default function BulkEnquiryList() {
  const [data, setData] = useState({ enquiries: [], total: 0 });
  const [status, setStatus] = useState('');
  const [open, setOpen] = useState(null);
  const [note, setNote] = useState('');

  const load = () => {
    adminListBulkEnquiries({ status: status || undefined, limit: 50 }).then(setData);
  };
  useEffect(load, [status]);

  const onStatusChange = async (id, newStatus) => {
    await adminUpdateBulkEnquiry(id, { status: newStatus });
    load();
  };

  const saveNote = async (id) => {
    await adminUpdateBulkEnquiry(id, { adminNote: note });
    setOpen(null);
    load();
  };

  return (
    <div>
      <div className="admin-page-head"><h2 className="admin-page-title">Bulk order enquiries</h2></div>
      <select className="admin-search" value={status} onChange={(e) => setStatus(e.target.value)}>
        <option value="">All statuses</option>
        {STATUSES.map((s) => <option key={s} value={s}>{s}</option>)}
      </select>

      {data.enquiries.length === 0 ? <p className="admin-empty">No enquiries yet.</p> : data.enquiries.map((e) => (
        <div key={e._id} className="admin-form" style={{ marginBottom: 14 }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', flexWrap: 'wrap', gap: 8 }}>
            <div>
              <b>{e.name}</b>{e.businessName ? ` — ${e.businessName}` : ''}
              <p style={{ fontSize: 13, color: 'var(--mut)' }}>{e.email} · {e.phone}</p>
            </div>
            <select value={e.status} onChange={(ev) => onStatusChange(e._id, ev.target.value)}>
              {STATUSES.map((s) => <option key={s} value={s}>{s}</option>)}
            </select>
          </div>
          <p><b>Product(s):</b> {e.productInterest}</p>
          <p><b>Quantity:</b> {e.quantity}</p>
          {e.message && <p><b>Message:</b> {e.message}</p>}
          <p style={{ fontSize: 12.5, color: 'var(--mut)' }}>Submitted {new Date(e.createdAt).toLocaleString('en-IN')}</p>

          {open === e._id ? (
            <div style={{ display: 'flex', gap: 8 }}>
              <input value={note} onChange={(ev) => setNote(ev.target.value)} placeholder="Internal note" style={{ flex: 1 }} />
              <button className="admin-btn" onClick={() => saveNote(e._id)}>Save</button>
            </div>
          ) : (
            <button className="admin-link" onClick={() => { setOpen(e._id); setNote(e.adminNote || ''); }}>
              {e.adminNote ? `Note: ${e.adminNote}` : 'Add a note'}
            </button>
          )}
        </div>
      ))}
    </div>
  );
}