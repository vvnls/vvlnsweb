import { useRef, useState } from 'react';
import { uploadImages, deleteImage } from '../api/upload';

export default function ImageUploader({ images, onChange }) {
  const fileRef = useRef();
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState('');

  const onPick = async (e) => {
    const files = Array.from(e.target.files || []);
    if (!files.length) return;
    setBusy(true);
    setError('');
    try {
      const uploaded = await uploadImages(files);
      onChange([...images, ...uploaded]);
    } catch (err) {
      setError(err.response?.data?.message || 'Upload failed');
    } finally {
      setBusy(false);
      e.target.value = '';
    }
  };

  const onRemove = (img) => {
    onChange(images.filter((i) => i.publicId !== img.publicId));
    if (img.publicId) deleteImage(img.publicId).catch(() => {});
  };

  return (
    <div>
      <div className="admin-image-grid">
        {images.map((img) => (
          <div key={img.publicId || img.url} className="admin-image-thumb">
            <img src={img.url} alt="" />
            <button type="button" onClick={() => onRemove(img)} aria-label="Remove image">✕</button>
          </div>
        ))}
      </div>
      <input ref={fileRef} type="file" accept="image/*" multiple hidden onChange={onPick} />
      <button type="button" className="admin-btn-ghost" onClick={() => fileRef.current.click()} disabled={busy}>
        {busy ? 'Uploading…' : 'Add images'}
      </button>
      {error && <p className="admin-error">{error}</p>}
    </div>
  );
}