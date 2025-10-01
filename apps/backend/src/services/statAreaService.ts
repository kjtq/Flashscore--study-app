private parseStatAreaHTML(html: string): StatAreaPrediction[] {
  const $ = cheerio.load(html);

  const predictions: StatAreaPrediction[] = [];

  $('.prediction-row, .match-row, .tip-row').each((i: number, el: cheerio.Element) => {
    const $el = $(el);

    const homeTeam = $el.find('.home-team, .team-home').text().trim();
    const awayTeam = $el.find('.away-team, .team-away').text().trim();
    const predictionText = $el.find('.tip, .prediction').text().trim();

    if (!homeTeam || !awayTeam || !predictionText) {
      return; // Skip this element
    }

    predictions.push({
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
    });
  });

  return predictions;
}