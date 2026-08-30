export const FullScreenLoader = ({ title, subtitle }) => (
  <div className="flex min-h-screen items-center justify-center px-6">
    <div className="w-full max-w-md rounded-3xl border border-white/10 bg-slate-950/70 p-8 text-center shadow-2xl shadow-purple-950/30 backdrop-blur">
      <div className="mx-auto mb-4 h-12 w-12 animate-spin rounded-full border-4 border-purple-400/25 border-t-purple-400" />
      <h1 className="text-2xl font-semibold text-white">{title}</h1>
      <p className="mt-2 text-sm text-slate-300">{subtitle}</p>
    </div>
  </div>
)
