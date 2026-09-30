import { useParams, Link } from 'react-router-dom';
import { Helmet } from 'react-helmet-async';
import { POLICIES } from '../content/policies';
import { SITE } from '../config/site';

export default function Policy() {
  const { slug } = useParams();
  const policy = POLICIES[slug];

  if (!policy) {
    return (
      <section className="sec"><div className="w">
        <p className="empty">Page not found. <Link to="/">Back to home</Link></p>
      </div></section>
    );
  }

  const { Body } = policy;
  return (
    <section className="sec">
      <Helmet>
        <title>{policy.title} | {SITE.name}</title>
        <meta name="description" content={policy.description} />
      </Helmet>
      <div className="w policy">
        <h1>{policy.title}</h1>
        <p className="policy-updated">Last updated: {SITE.policiesUpdated}</p>
        <Body />
        <nav className="policy-links" aria-label="Other policies">
          {Object.entries(POLICIES).filter(([s]) => s !== slug).map(([s, p]) => (
            <Link key={s} to={`/policy/${s}`}>{p.title}</Link>
          ))}
        </nav>
      </div>
    </section>
  );
}