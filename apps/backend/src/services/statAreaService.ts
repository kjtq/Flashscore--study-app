private parseStatAreaHTML(html: string): StatAreaPrediction[] {
  const $ = cheerio.load(html);

  const predictions: StatAreaPrediction[] = $('.prediction-row, .match-row, .tip-row')
    .map((i: number, el: cheerio.Element): StatAreaPrediction | null => {
      const $el = $(el);

      const homeTeam = $el.find('.home-team, .team-home').text().trim();
      const awayTeam = $el.find('.away-team, .team-away').text().trim();
      const predictionText = $el.find('.tip, .prediction').text().trim();

      if (!homeTeam || !awayTeam || !predictionText) {
        return null;
      }

      return {
        matchId: `${homeTeam}_vs_${awayTeam}_${Date.now()}`,
        homeTeam,
        awayTeam,
        prediction: predictionText,
        confidence: 75,
        league: 'Unknown',
        odds: 0,
        date: new Date().toISOString(),
        status: 'active',
        categories: []
      };
    })
    .get() // convert cheerio object into array
    .filter((p: StatAreaPrediction | null): p is StatAreaPrediction => p !== null);

  return predictions;
}