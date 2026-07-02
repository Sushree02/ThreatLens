import RiskGauge from '../components/RiskGauge';
import ResultCard from '../components/ResultCard';
import Flowchart from '../components/Flowchart';
import RecommendationPanel from '../components/RecommendationPanel';
import VerdictCard from '../components/VerdictCard';
import PdfDownloadButton from '../components/PdfDownloadButton';

export default function Results({ result, onReset }) {
  if (!result) return null;

  return (
    <div className="max-w-3xl mx-auto px-4 sm:px-6 py-12">
      <div className="flex items-center justify-between mb-8 flex-wrap gap-3">
        <h2 className="text-2xl font-bold">Analysis Results</h2>
        <button onClick={onReset} className="btn-secondary">
          New Analysis
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
        <RiskGauge
          riskScore={result.riskScore}
          riskLevel={result.riskLevel}
          confidence={result.confidence}
          detectionRatio={result.detectionRatio}
        />
        <ResultCard result={result} />
      </div>

      <div className="mb-6">
        <VerdictCard riskLevel={result.riskLevel} finalVerdict={result.finalVerdict} />
      </div>

      <div className="mb-6">
        <Flowchart />
      </div>

      <div className="mb-6">
        <RecommendationPanel recommendations={result.recommendations} />
      </div>

      <div className="flex justify-center">
        <PdfDownloadButton result={result} />
      </div>
    </div>
  );
}
