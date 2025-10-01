import { EnhancedSportsService } from '../services/enhancedSportsService';
import { statAreaService } from '../services/statAreaService';

async function main() {
  const sportsService = new EnhancedSportsService({});
  const statService = statAreaService;

  console.log('=== Fetching Live Matches ===');
  try {
    const matches = await sportsService.fetchLiveMatchesWithStats();
    console.log(matches);
  } catch (err) {
    console.error('Error fetching live matches:', err);
  }

  console.log('\n=== Fetching All StatArea Predictions ===');
  try {
    const allPredictions = await statService.fetchAllPredictions();
    console.log(allPredictions);
  } catch (err) {
    console.error('Error fetching StatArea predictions:', err);
  }

  console.log('\n=== High Confidence Predictions ===');
  try {
    const highConf = await statService.getHighConfidencePredictions(80);
    console.log(highConf);
  } catch (err) {
    console.error('Error fetching high confidence predictions:', err);
  }
}

main().catch(console.error);