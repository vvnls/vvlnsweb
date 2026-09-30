export default function StatusBadge({ active }) {
  return <span className={`admin-badge ${active ? 'on' : 'off'}`}>{active ? 'Active' : 'Inactive'}</span>;
}