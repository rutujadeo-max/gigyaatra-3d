export const ActivityComparison = ({ regions }) => (
  <section className="exploration-card">
    <p className="exploration-eyebrow">Activity Comparison</p>
    <h2 className="exploration-heading">How your exploration is building</h2>
    <p className="exploration-copy">Each bar balances completion, repeat play, performance, time spent, and optional enjoyment feedback.</p>
    <div className="comparison-list">
      {regions.map((region) => (
        <div className="comparison-row" key={region.slug}>
          <div className="comparison-label"><span>{region.label}</span><strong>{region.explored ? `${region.affinity}%` : 'Not explored yet'}</strong></div>
          <div aria-label={`${region.label} exploration score ${region.affinity}%`} className="comparison-track" role="progressbar" aria-valuemax="100" aria-valuemin="0" aria-valuenow={region.affinity}>
            <div className="comparison-fill" style={{ width: `${region.affinity}%`, backgroundColor: region.accent }} />
          </div>
          <p className="comparison-detail">{region.explored ? `${region.attempts} ${region.attempts === 1 ? 'attempt' : 'attempts'} · ${region.completions} completed` : 'Play this region whenever you are curious.'}</p>
        </div>
      ))}
    </div>
  </section>
)
