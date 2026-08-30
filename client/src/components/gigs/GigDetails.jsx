import { GigProgress } from './GigProgress'

export const GigDetails = ({ gig, isSaved, completedSteps, onClose, onSave, onToggleStep }) => {
  if (!gig) return null

  return (
    <section aria-labelledby="gig-detail-title" className="gig-details">
      <div className="gig-details__header">
        <div>
          <p className="gig-eyebrow">Opportunity Explorer</p>
          <h2 id="gig-detail-title">{gig.title}</h2>
          <p>{gig.description}</p>
        </div>
        <button className="gig-close" onClick={onClose} type="button">Close</button>
      </div>
      <div className="gig-details__grid">
        <section>
          <h3>Why it was suggested</h3>
          <p>This opportunity connects with your exploration of {gig.relatedRegions.map((region) => region.label).join(' and ')}.</p>
          <div className="gig-skills">{gig.skills.map((skill) => <span key={skill}>{skill}</span>)}</div>
        </section>
        <section>
          <h3>Skills you can build</h3>
          <ul>{gig.skills.map((skill) => <li key={skill}>{skill}</li>)}</ul>
        </section>
        <section>
          <h3>Beginner requirements</h3>
          <ul>{gig.requirements.map((requirement) => <li key={requirement}>{requirement}</li>)}</ul>
          <p className="gig-qualification-note">Some advanced or paid roles can require further training or credentials. This page only suggests ways to start exploring.</p>
        </section>
      </div>
      <GigProgress completedCount={completedSteps.length} totalCount={gig.roadmap.length} />
      <section className="gig-roadmap">
        <p className="gig-eyebrow">How To Start</p>
        <h3>Build experience one small step at a time</h3>
        {gig.roadmap.map((step, index) => <label className="gig-roadmap-step" key={step.phase}><input checked={completedSteps.includes(index)} onChange={() => onToggleStep(index)} type="checkbox" /><span><strong>{step.phase}</strong>{step.action}</span></label>)}
      </section>
      <button className="gig-primary-action" onClick={() => onSave(gig.id)} type="button">{isSaved ? 'Remove from saved gigs' : 'Save opportunity'}</button>
    </section>
  )
}
