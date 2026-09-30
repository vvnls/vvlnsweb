const stars = (n) => '★★★★★☆☆☆☆☆'.slice(5 - n, 10 - n);

export default function ReviewList({ reviews, average, total }) {
  if (total === 0) return <p className="empty">No reviews yet for this product.</p>;

  return (
    <div>
      <p style={{ fontWeight: 600, marginBottom: 14 }}>
        <span style={{ color: 'var(--y)' }}>{stars(Math.round(average))}</span>{' '}
        {average} out of 5 ({total} review{total !== 1 ? 's' : ''})
      </p>
      <div className="rv pd-reviews">
        {reviews.map((r) => (
          <div key={r._id}>
            <span style={{ color: 'var(--y)', display: 'block', marginBottom: 4 }}>{stars(r.rating)}</span>
            <p>{r.comment}</p>
            <b>{r.name}</b>
          </div>
        ))}
      </div>
    </div>
  );
}