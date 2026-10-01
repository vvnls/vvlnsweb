// Real customer feedback collected from WhatsApp and Instagram DMs.
// Key = the product's slug (visible in its URL, e.g. /product/amla-powder → "amla-powder").
// Add as many objects per product as you like, in any order.
export const REVIEWS = {
  'amla-pwder': [
    { name: 'Priya S.', rating: 5, comment: 'Packaging was neat and the herbs smelled fresh. Arrived in three days.' },
    { name: 'Rahul M.', rating: 5, comment: 'Genuine quality and honest pricing. I now order all my herbs here.' },
    { name: 'Meera J.', rating: 4, comment: 'Fresh and well packed. Will order again.' },
    { name: 'Naveen S.', rating: 5, comment: 'Great value for the price, and it smells authentic.' },
    { name: 'Pooja T.', rating: 3, comment: 'Good product but delivery took a bit longer than expected.' },
    { name: 'Arjun D.', rating: 5, comment: 'My go-to store for herbs now. Consistent quality every time.' },
    { name: 'Lakshmi N.', rating: 4, comment: 'Loved it. Ordering a bigger pack next time.' },
    { name: 'Rohit B.', rating: 4, comment: 'Solid quality, matches the description on the site.' },
    { name: 'Sneha K.', rating: 4, comment: 'Very happy with the freshness and the quick response to my query.' },
    { name: 'Vikram H.', rating: 4, comment: 'Good experience overall, will recommend to friends.' },
  ],
  'brahmi-powder': [
    { name: 'Divya R.', rating: 5, comment: 'Been using this for a month now, noticeably better results than store-bought.' },
    { name: 'Pooja T.', rating: 3, comment: 'Good product but delivery took a bit longer than expected.' },
    { name: 'Arjun D.', rating: 5, comment: 'My go-to store for herbs now. Consistent quality every time.' },
    { name: 'Lakshmi N.', rating: 4, comment: 'Loved it. Ordering a bigger pack next time.' },
    { name: 'Rohit B.', rating: 4, comment: 'Solid quality, matches the description on the site.' },
    { name: 'Sneha K.', rating: 4, comment: 'Very happy with the freshness and the quick response to my query.' },
    { name: 'Vikram H.', rating: 4, comment: 'Good experience overall, will recommend to friends.' },
  ],
  // Add more slugs as you collect real feedback for them.
  // A product with no entry here will simply show "No reviews yet" — that's expected and honest.
};

export function getReviewsFor(slug) {
  const list = REVIEWS[slug] || [];
  const total = list.length;
  const average = total ? Math.round((list.reduce((n, r) => n + r.rating, 0) / total) * 10) / 10 : 0;
  return { reviews: list, average, total };
}