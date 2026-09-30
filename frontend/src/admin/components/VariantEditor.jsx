export default function VariantEditor({ variants, onChange }) {
  const update = (i, field, value) => onChange(variants.map((v, idx) => (idx === i ? { ...v, [field]: value } : v)));
  const add = () => onChange([...variants, { label: '', price: '', mrp: '', stock: '' }]);
  const remove = (i) => onChange(variants.filter((_, idx) => idx !== i));

  return (
    <div>
      {variants.map((v, i) => (
        <div key={i} className="admin-variant-row">
          <input placeholder="Label (e.g. 250 g)" value={v.label} onChange={(e) => update(i, 'label', e.target.value)} />
          <input placeholder="Price" type="number" min="0" value={v.price} onChange={(e) => update(i, 'price', e.target.value)} />
          <input placeholder="MRP (optional)" type="number" min="0" value={v.mrp} onChange={(e) => update(i, 'mrp', e.target.value)} />
          <input placeholder="Stock" type="number" min="0" value={v.stock} onChange={(e) => update(i, 'stock', e.target.value)} />
          <button type="button" className="admin-btn-danger" onClick={() => remove(i)} disabled={variants.length === 1}>Remove</button>
        </div>
      ))}
      <button type="button" className="admin-btn-ghost" onClick={add}>Add variant</button>
    </div>
  );
}