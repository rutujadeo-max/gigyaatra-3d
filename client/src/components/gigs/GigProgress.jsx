const stages = ['Exploring', 'Learning', 'Practicing', 'Building Experience', 'Ready to Seek Opportunities']

export const GigProgress = ({ completedCount, totalCount }) => {
  const stageIndex = totalCount ? Math.min(stages.length - 1, Math.floor((completedCount / totalCount) * stages.length)) : 0

  return (
    <section className="gig-progress" aria-label="Your exploration stage">
      <p className="gig-eyebrow">Your Exploration Stage</p>
      <div className="gig-stage-list">
        {stages.map((stage, index) => <span className={index === stageIndex ? 'gig-stage gig-stage--current' : 'gig-stage'} key={stage}>{index === stageIndex ? 'Current: ' : ''}{stage}</span>)}
      </div>
      <p>{completedCount} of {totalCount} optional action steps checked. This is a personal progress tracker, not a readiness claim.</p>
    </section>
  )
}
