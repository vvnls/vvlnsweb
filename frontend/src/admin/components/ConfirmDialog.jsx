export default function ConfirmDialog({ open, title = 'Are you sure?', message, onConfirm, onCancel }) {
  if (!open) return null;
  return (
    <div className="admin-modal-backdrop" onClick={onCancel}>
      <div className="admin-modal" onClick={(e) => e.stopPropagation()}>
        <h3>{title}</h3>
        <p>{message}</p>
        <div className="admin-modal-actions">
          <button className="admin-btn-ghost" onClick={onCancel}>Cancel</button>
          <button className="admin-btn-danger" onClick={onConfirm}>Delete</button>
        </div>
      </div>
    </div>
  );
}