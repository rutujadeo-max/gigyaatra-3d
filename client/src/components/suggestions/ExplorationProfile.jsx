export const ExplorationProfile = ({ explored }) => {
  const highlights = explored.slice(0, 3)

  return (
    <section className="exploration-card">
      <p className="exploration-eyebrow">Your Exploration Profile</p>
      <h2 className="exploration-heading">Curiosity is taking shape</h2>
      <p className="exploration-copy">
        {highlights.length
          ? 'Your activity suggests curiosity across these areas. This is a starting point for exploration, not a prediction about your future.'
          : 'Play any region activity to begin discovering the skills and directions you may enjoy exploring.'}
      </p>
      {highlights.length > 0 && (
        <div className="exploration-interest-list">
          {highlights.map((region) => (
            <span className="exploration-interest" key={region.slug} style={{ '--region-accent': region.accent }}>
              {region.interestLabel}
            </span>
          ))}
        </div>
      )}
    </section>
  )
}
