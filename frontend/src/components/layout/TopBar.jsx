import { Link } from 'react-router-dom';
import { SITE } from '../../config/site';
import Icon from '../ui/Icon';

export default function TopBar() {
  return (
    <div className="top2">
      <div className="w top2-inner">
        <ul className="top2-left">
          <li><Icon name="shipping" size={14} /> Free Shipping all over India</li>
          <li className="top2-hide-sm"><Icon name="leaf" size={14} /> 100% Natural</li>
          <li className="top2-hide-sm"><Icon name="shield" size={14} /> No Harmful Chemicals</li>
          <li className="top2-hide-md"><Icon name="drop" size={14} /> Pure & Authentic Herbs</li>
        </ul>
        <ul className="top2-right">
          <li><Link to="/track-order"><Icon name="location" size={14} /> Track Order</Link></li>
          <li className="top2-hide-sm"><a href={`mailto:${SITE.email}`}><Icon name="headset" size={14} /> Customer Care</a></li>
          <li className="top2-hide-md"><Link to="/bulk-order"><Icon name="gift" size={14} /> Bulk Orders</Link></li>
          <li className="top2-hide-md"><Link to="/policy/shipping-and-delivery"><Icon name="question" size={14} /> FAQ</Link></li>
        </ul>
      </div>
    </div>
  );
}