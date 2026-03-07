/**
 * sections/CaseStudies/index.jsx
 */

import SectionHeader from '@/components/ui/SectionHeader';
import CaseCard from './CaseCard';
import { CASE_STUDIES } from '@/data';

const DELAYS = ['d1', 'd2', 'd3'];

export default function CaseStudiesSection() {
  return (
    <section id="case-studies" className="section" style={{ background: 'transparent' }}>
      <div className="inner">
        <SectionHeader
          eyebrow="Case Studies"
          title="Real briefs.<br/>Real outcomes."
          sub="Enterprise engagements where architecture decisions moved the needle."
        />
        <div className="grid-3">
          {CASE_STUDIES.map((cs, i) => (
            <CaseCard key={cs.title} cs={cs} delayClass={DELAYS[i] ?? ''} />
          ))}
        </div>
      </div>
    </section>
  );
}
