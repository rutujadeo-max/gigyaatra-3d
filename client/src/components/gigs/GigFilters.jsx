import { gigCategories } from '../../data/gigs'

export const GigFilters = ({ activeCategory, onChange }) => (
  <div aria-label="Filter opportunities by category" className="gig-filters" role="group">
    {gigCategories.map((category) => (
      <button aria-pressed={activeCategory === category} className={activeCategory === category ? 'gig-filter gig-filter--active' : 'gig-filter'} key={category} onClick={() => onChange(category)} type="button">
        {category}
      </button>
    ))}
  </div>
)
