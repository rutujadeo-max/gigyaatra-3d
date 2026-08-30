import { Link } from 'react-router-dom'

import { WORLD_HALF_EXTENT, worldRegions } from '../../data/worldRegions'
import { useWorldStore } from '../../store/worldStore'

const toPercent = (value, maxExtent) => ((value + maxExtent) / (maxExtent * 2)) * 100

export const WorldMinimap = () => {
  const activeRegionId = useWorldStore((state) => state.activeRegionId)
  const avatarPosition = useWorldStore((state) => state.avatarPosition)

  return (
    <div className="rounded-[1.75rem] border border-white/10 bg-slate-950/80 p-4 shadow-2xl shadow-black/35 backdrop-blur">
      <div className="mb-3 flex items-center justify-between gap-3">
        <div>
          <p className="text-xs font-semibold uppercase tracking-[0.24em] text-purple-300">Minimap</p>
          <p className="text-xs text-slate-400">Click a region to open its dashboard</p>
        </div>
        <div className="rounded-full border border-white/10 px-3 py-1 text-[11px] text-slate-300">
          WASD / Arrows
        </div>
      </div>

      <div className="relative h-64 w-72 overflow-hidden rounded-[1.25rem] border border-white/10 bg-slate-900/80">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_top,rgba(124,58,237,0.2),transparent_45%)]" />

        {worldRegions.map((region) => {
          const [centerX, centerZ] = region.position
          const [width, depth] = region.size
          const left = toPercent(centerX - width / 2, WORLD_HALF_EXTENT.x)
          const top = 100 - toPercent(centerZ + depth / 2, WORLD_HALF_EXTENT.z)
          const boxWidth = (width / (WORLD_HALF_EXTENT.x * 2)) * 100
          const boxHeight = (depth / (WORLD_HALF_EXTENT.z * 2)) * 100

          return (
            <Link
              className={`absolute flex items-center justify-center rounded-xl border text-[10px] font-semibold uppercase tracking-[0.18em] text-white/90 transition hover:scale-[1.02] ${
                activeRegionId === region.id
                  ? 'border-white/60 shadow-lg shadow-purple-500/25'
                  : 'border-white/15'
              }`}
              key={region.id}
              style={{
                left: `${left}%`,
                top: `${top}%`,
                width: `${boxWidth}%`,
                height: `${boxHeight}%`,
                backgroundColor: `${region.color}CC`,
              }}
              to={`/regions/${region.slug}`}
            >
              <span className="px-1 text-center">{region.name}</span>
            </Link>
          )
        })}

        <div
          className="absolute h-3.5 w-3.5 -translate-x-1/2 -translate-y-1/2 rounded-full border-2 border-white bg-purple-300 shadow-[0_0_18px_rgba(196,181,253,0.8)]"
          style={{
            left: `${toPercent(avatarPosition.x, WORLD_HALF_EXTENT.x)}%`,
            top: `${100 - toPercent(avatarPosition.z, WORLD_HALF_EXTENT.z)}%`,
          }}
        />
      </div>
    </div>
  )
}
