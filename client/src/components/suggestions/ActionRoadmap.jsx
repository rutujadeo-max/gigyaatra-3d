import { resourceActions } from '../../data/explorationData'

const phases = ['Explore', 'Learn', 'Practice', 'Participate', 'Build']

export const ActionRoadmap = ({ path }) => {
  if (!path) return null

  return (
    <section className="exploration-card roadmap-card" id="path-roadmap">
      <p className="exploration-eyebrow">How To Explore</p>
      <h2 className="exploration-heading">{path.title}</h2>
      <p className="exploration-copy">Choose only the next small step that feels useful. There is no required timeline.</p>
      <ol className="roadmap-list">
        {path.steps.map((step, index) => <li key={step}><span>{phases[Math.min(index, phases.length - 1)]}</span><p>{step}</p></li>)}
      </ol>
      <div className="resource-actions">
        {resourceActions.map((action) => <span key={action}>{action}</span>)}
      </div>
    </section>
  )
}
