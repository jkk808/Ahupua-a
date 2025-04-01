
const determineGrade = (score) => {
  if (score >= 0.9) return "EXCELLENT";
  if (score >= 0.7) return "GOOD";
  if (score >= 0.5) return "FAIR";
  if (score >= 0.3) return "POOR";
}

const HealthScore = ({ score }) => {
  const grade = determineGrade(score)
  return (
    <>
    <div className="flex items-center justify-between">
      <div>        
        <div className="text-3xl font-bold">{(score * 100)}%</div>
        <div className="text-sm text-gray-500">{grade}</div>
      </div>
      <div className="h-16 w-16">
        <svg viewBox="0 0 40 40">
          <circle
            cx="20"
            cy="20"
            r="16"
            fill="none"
            stroke="#E5E7EB"
            strokeWidth="4"
          />
          <circle
            cx="20"
            cy="20"
            r="16"
            fill="none"
            stroke="#22C55E"
            strokeWidth="4"
            strokeDasharray={`${(85 * 100) / 100} 100`}
            transform="rotate(-90 20 20)"
          />
        </svg>
      </div>
    </div>
    </>
  )
}

export default HealthScore
