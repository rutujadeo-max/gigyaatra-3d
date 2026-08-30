import { enjoymentOptions } from '../../data/explorationData'

export const ActivityFeedback = ({ regions, onFeedback }) => (
  <section className="exploration-card">
    <p className="exploration-eyebrow">Optional Feedback</p>
    <h2 className="exploration-heading">Did you enjoy an activity?</h2>
    <p className="exploration-copy">Your answer helps the suggestions reflect interest as well as scores. You can change it anytime.</p>
    <div className="feedback-list">
      {regions.filter((region) => region.explored).map((region) => (
        <fieldset className="feedback-row" key={region.slug}>
          <legend>{region.label}</legend>
          <div className="feedback-options">
            {enjoymentOptions.map((option) => (
              <button aria-pressed={region.enjoyment === option.value} className={region.enjoyment === option.value ? 'feedback-button feedback-button--selected' : 'feedback-button'} key={option.value} onClick={() => onFeedback(region.slug, option.value)} style={{ '--region-accent': region.accent }} type="button">
                {option.label}
              </button>
            ))}
          </div>
        </fieldset>
      ))}
    </div>
  </section>
)
