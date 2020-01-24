import styles from './gmail.module.scss';

export async function render(v, scoreData) {
  const { rank, unsubscribed, perWeek } = scoreData;
  // const percentile = percentileRanks[rank];
  // const asArray = Object.keys(percentileRanks);
  // const negativePercentile =
  //   percentileRanks[asArray[asArray.indexOf(rank) + 1]];

  let perWeekText = '';
  if (perWeek < 0.25) {
    perWeekText = 'They usually send 1 or fewer emails per month';
  } else if (perWeek < 0.5) {
    perWeekText = 'They usually send around 2 emails per month';
  } else if (perWeek < 1) {
    perWeekText = 'They usually send 1 or fewer email per week';
  } else if (perWeek === 1) {
    perWeekText = `They usually send around 1 email per week`;
  } else {
    perWeekText = `They usually send around ${Math.ceil(
      perWeek
    )} emails per week`;
  }

  v.addLabel({
    iconClass: styles[`btn-rank-${rank === 'A+' ? 'Aplus' : rank}`],
    title: `${rank} - ${perWeekText}`,
    backgroundColor: 'transparent',
    foregroundColor: 'transparent'
  });

  // const source = await gmail.get.email_source_promise(view.getThreadID());
}

export function renderScores(scores, views) {
  scores.forEach(({ rank, email }) => {
    const viewsWithRank = views.filter(e => e.email === email).map(e => e.view);
    const data = {
      rank: rank,
      perWeek: 10
    };
    viewsWithRank.forEach(v => render(v, data));
  });
}
