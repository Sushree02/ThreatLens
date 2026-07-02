export default function RecommendationPanel({ recommendations }) {
  if (!recommendations || recommendations.length === 0) return null;

  return (
    <div className="card" id="recommendation-panel">
      <h3 className="text-lg font-semibold mb-4">Security Recommendations</h3>
      <ul className="space-y-2">
        {recommendations.map((rec, idx) => (
          <li key={idx} className="flex items-start gap-2 text-sm">
            <span aria-hidden="true">🛡️</span>
            <span>{rec}</span>
          </li>
        ))}
      </ul>
    </div>
  );
}
