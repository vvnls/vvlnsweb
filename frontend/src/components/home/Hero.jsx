import { Link } from 'react-router-dom';
import Icon from '../ui/Icon';
import heroArt from '../../assets/images/hero-arts.png';

const FEATURES = [
  ['leaf', 'Promotes Wellness'],
  ['drop', '100% Natural'],
  ['sparkle', 'Adds Natural Shine'],
  ['root', 'Strengthens & Nourishes'],
  ['shield', 'Chemical Free'],
];

export default function Hero() {
  return (
    <section className="hero2">
      <div className="w hero2-grid">
        <div>
          <p className="eyebrow">Pure · Natural · Ayurvedic</p>
          <h1 className="hero2-title">
            Natural Herbs <span>for Everyday Wellness</span>
          </h1>
          <p className="hero2-sub">Ancient Ayurvedic Wisdom · Modern Everyday Care</p>
          <p className="hero2-desc">
            A perfect blend of nature's most powerful herbs, powders and spices — sorted, cleaned
            and packed fresh to bring purity and wellness into your everyday routine.
          </p>
          <div className="hero2-features">
            {FEATURES.map(([icon, label]) => (
              <div key={label} className="hero2-feature">
                <span><Icon name={icon} size={20} /></span>
                {label}
              </div>
            ))}
          </div>
          <Link className="btn hero2-cta" to="/shop">Shop All Products <Icon name="arrow" size={16} /></Link>
        </div>
        <div className="hero2-art">
          <div className="hero2-art-box">
            <img src={heroArt} alt="Vedvishwa Naturals" className="hero2-art-img" />
          </div>
          <div className="hero2-badge">
            <span>100%</span>
            <b>NATURAL</b>
            <small>HERBAL CARE</small>
          </div>
        </div>
      </div>
    </section>
  );
}