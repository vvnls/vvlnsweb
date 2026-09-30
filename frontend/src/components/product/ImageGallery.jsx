import { useState } from 'react';

export default function ImageGallery({ images = [] }) {
  const [active, setActive] = useState(0);
  const list = images.length ? images : [null]; // fall back to one placeholder box

  return (
    <div className="pd-gallery">
      <div className="pd-img" style={{
        background: list[active] ? `url(${list[active].url}) center/cover` : 'linear-gradient(150deg,#4f7d2c,#1a2c12)',
      }} />
      {images.length > 1 && (
        <div className="pd-thumbs">
          {images.map((img, i) => (
            <button
              key={img.publicId || img.url}
              type="button"
              className={`pd-thumb${i === active ? ' on' : ''}`}
              style={{ backgroundImage: `url(${img.url})` }}
              onClick={() => setActive(i)}
              aria-label={`Show image ${i + 1}`}
            />
          ))}
        </div>
      )}
    </div>
  );
}