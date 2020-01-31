import styles from './gmail.module.scss';
function getPerWeekText({ perWeek = 0 } = {}) {
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
  return perWeekText;
}

function getLabelMarkup(rank) {
  return `
      <div class="ar as ${
        styles[`btn-rank-${rank === 'A+' ? 'Aplus' : rank}`]
      } ${styles.icon}">
        <div
          class="at"
          title="${rank} - ${getPerWeekText()}"          
        >
          <div class="au" style="border-color:#ddd">
            <div class="av" style="color: #666">
              ${rank}
            </div>
          </div>
        </div>
      </div>
      <div class="as">&nbsp;</div>
    `;
}

// function insetLabelMarkup

export function renderScores(scores) {
  scores.forEach(({ email, rank }) => {
    const $items = [...document.querySelectorAll(`[email="${email}"]`)];
    const $rows = $items
      .map($item => getNearestRow($item))
      .filter((v, i, arr) => arr.indexOf(v) === i)
      .filter($row => !$row.getAttribute('sub-scored'));

    injectRankIntoRows($rows, rank);
  });
}

const SELECTORS = {
  subject: '.a4W .y6',
  subjectGroup: '.xT'
};

function injectRankIntoRows($rows, rank) {
  const labelInner = getLabelMarkup(rank);
  $rows.forEach($row => {
    const label = document.createElement('div');
    label.classList.add('yi');
    label.id = ':4q';
    label.innerHTML = labelInner;
    const $subject = $row.querySelector(SELECTORS.subject);
    $row.querySelector(SELECTORS.subjectGroup).insertBefore(label, $subject);
    $row.setAttribute('sub-scored', true);
  });
}

function getNearestRow($element) {
  let $el = $element;
  do {
    if ($el.nodeName === 'TR') {
      return $el;
    }
    $el = $el.parentElement;
  } while ($el);
  return null;
}
