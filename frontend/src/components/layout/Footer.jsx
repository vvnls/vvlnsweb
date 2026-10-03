import { Link } from 'react-router-dom';
import { SITE } from '../../config/site';

export default function Footer() {
  return (
    <footer id="ft">
      <div className="w">
        <div className="fg">
          <div>
            <h5>{SITE.name}</h5>
            <p>Pure Ayurvedic herbs, powders, spices and superfoods delivered across India.</p>
          </div>
          <div>
            <h5>Our policies</h5>
            <ul>
              <li><Link to="/policy/terms-and-conditions">Terms and Conditions</Link></li>
              <li><Link to="/policy/shipping-and-delivery">Shipping and Delivery</Link></li>
              <li><Link to="/policy/refund-policy">Refund and Return</Link></li>
              <li><Link to="/policy/cancellation-policy">Cancellation Policy</Link></li>
              <li><Link to="/policy/privacy-policy">Privacy Policy</Link></li>
            </ul>
          </div>
          <div>
            <h5>Help</h5>
            <ul>
              <li><Link to="/track-order">Track your order</Link></li>
              <li><Link to="/account/orders">My orders</Link></li>
              <li><Link to="/bulk-order">Bulk Order Enquiry</Link></li>
            </ul>
          </div>
          <div>
            <h5>Contact us</h5>
            <p><b>Address:</b><br />{SITE.address}</p>
            <p style={{ marginTop: 8 }}><b>E-mail:</b><br /><a href={`mailto:${SITE.email}`}>{SITE.email}</a></p>
            {SITE.phone && <p style={{ marginTop: 8 }}><b>Phone:</b><br />{SITE.phone}</p>}
          </div>
        </div>
        <p className="dc">
          <b>Disclaimer:</b> Health information on this site is for basic information only and is not medical advice. Consult your physician before using any herb, especially during pregnancy or while on medication.<b /> <br />
          {SITE.fssai && <>FSSAI Lic. No. {SITE.fssai} · </>}
          {SITE.gstin && <>GSTIN {SITE.gstin} · </>}
          Copyright {new Date().getFullYear()} © {SITE.legalName}. All rights reserved.
        </p> <br />
        <p>
          Website by <a href="https://phanirajbnportfolio.vercel.app" target="_blank" rel="noopener noreferrer">Phaniraj</a>
        </p> <br />
      </div>
    </footer>
  );
}