//app / predictions / page.tsx;
import { generatePredictions, getPredictions } from "@actions/predictions";
import PredictionsList from "@components/PredictionsList";
import GeneratePredictionsButton from "@components/GeneratePredictionsButton";

export default async function PredictionsPage() {
  const result = await getPredictions();

  return (
    <div className="container mx-auto p-6">
      <h1 className="text-3xl font-bold mb-6">Match Predictions</h1>

      <GeneratePredictionsButton />

      {result.success ? (
        <PredictionsList predictions={result.data} />
      ) : (
        <p className="text-red-500">Error: {result.error}</p>
      )}
    </div>
  );
}
