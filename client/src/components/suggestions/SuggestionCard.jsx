export const SuggestionCard = ({ path, isSelected, onSelect }) => (
  <article className={isSelected ? 'suggestion-card suggestion-card--selected' : 'suggestion-card'}>
    <p className="exploration-eyebrow">Possible Direction</p>
    <h3>{path.title}</h3>
    <p>{path.description}</p>
    <div className="suggestion-reasons">
      <strong>Why this appears</strong>
      {path.related.map((region) => <span key={region.slug}>{region.label}: {region.interestLabel}</span>)}
    </div>
    <button className="exploration-action" onClick={() => onSelect(path.id)} type="button">
      {isSelected ? 'Viewing roadmap' : 'Explore this path'}
    </button>
  </article>
)
