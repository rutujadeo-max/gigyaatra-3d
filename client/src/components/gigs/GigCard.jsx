export const GigCard = ({ gig, isSaved, onExplore, onSave }) => (
  <article className="gig-card">
    <div className="gig-card__topline">
      <span>{gig.category}</span>
      <strong>{gig.connection}</strong>
    </div>
    <h3>{gig.title}</h3>
    <p className="gig-card__level">{gig.level} · {gig.type}</p>
    <p className="gig-card__description">{gig.description}</p>
    <div className="gig-card__why">
      <strong>Why this may fit your exploration</strong>
      <p>{gig.relatedRegions.map((region) => region.label).join(' + ')}{gig.matchedPaths.length ? ` · connected to ${gig.matchedPaths.map((path) => path.title).join(', ')}` : ''}</p>
    </div>
    <div className="gig-skills">{gig.skills.map((skill) => <span key={skill}>{skill}</span>)}</div>
    <div className="gig-card__actions">
      <button className="gig-primary-action" onClick={() => onExplore(gig.id)} type="button">Explore opportunity</button>
      <button aria-pressed={isSaved} className="gig-save-action" onClick={() => onSave(gig.id)} type="button">{isSaved ? 'Saved' : 'Save'}</button>
    </div>
  </article>
)
