import { demoApi as api } from './demo-store.js';
const loginView = document.querySelector('#login-view');
const appView = document.querySelector('#app-view');
const logoutButton = document.querySelector('#logout-button');
const activeCard = document.querySelector('#active-card');
const activeSide = document.querySelector('#active-side');
const activeTime = document.querySelector('#active-time');
const stopButton = document.querySelector('#stop-button');
const startLeft = document.querySelector('#start-left');
const startBottle = document.querySelector('#start-bottle');
const editVolumeField = document.querySelector('#edit-volume-field');
const editVolume = document.querySelector('#edit-volume');
const editVolumeUnit = document.querySelector('#edit-volume-unit');
const startRight = document.querySelector('#start-right');
const weighInButton = document.querySelector('#weigh-in-button');
const editMeasurements = document.querySelector('#edit-measurements');
const editWeight = document.querySelector('#edit-weight');
const editWeightUnit = document.querySelector('#edit-weight-unit');
const editHeight = document.querySelector('#edit-height');
const editHeightUnit = document.querySelector('#edit-height-unit');
const editDialogTitle = document.querySelector('#edit-dialog-title');
const noteButton = document.querySelector('#note-button');
const peeButton = document.querySelector('#pee-button');
const poopButton = document.querySelector('#poop-button');
const refreshButton = document.querySelector('#refresh-button');
const feedingChart = document.querySelector('#feeding-chart');
const diaperChart = document.querySelector('#diaper-chart');
const feedingCountChart = document.querySelector('#feeding-count-chart');
const noteInput = document.querySelector('#note-input');
const logList = document.querySelector('#log-list');
const logRange = document.querySelector('#log-range');
const historyButton = document.querySelector('#history-button');
const typeFilterOptions = [...document.querySelectorAll('#entry-type-filters input')];
const filterFrom = document.querySelector('#filter-from');
const filterThrough = document.querySelector('#filter-through');
const filterError = document.querySelector('#filter-error');
const clearFilters = document.querySelector('#clear-filters');
const logResults = document.querySelector('#log-results');
const saveError = document.querySelector('#save-error');
const historyPagination = document.querySelector('#history-pagination');
const previousPageButton = document.querySelector('#previous-page');
const nextPageButton = document.querySelector('#next-page');
const pageStatus = document.querySelector('#page-status');
const toast = document.querySelector('#toast');
const editDialog = document.querySelector('#edit-dialog');
const editForm = document.querySelector('#edit-form');
const cancelEditButton = document.querySelector('#cancel-edit-button');
const editEntryType = document.querySelector('#edit-entry-type');
const editStartedAt = document.querySelector('#edit-started-at');
const editStoppedAtField = document.querySelector('#edit-stopped-at-field');
const editStoppedAt = document.querySelector('#edit-stopped-at');
const editNote = document.querySelector('#edit-note');
const editError = document.querySelector('#edit-error');
const saveEditButton = document.querySelector('#save-edit-button');
const deleteEditButton = document.querySelector('#delete-edit-button');

const sleepCard = document.querySelector('#sleep-card');
const sleepType = document.querySelector('#sleep-type');
const sleepTime = document.querySelector('#sleep-time');
const startNap = document.querySelector('#start-nap');
const startBedtime = document.querySelector('#start-bedtime');
const stopSleepButton = document.querySelector('#stop-sleep');
let activeSleep = null;
let sleepTimerHandle = null;
let activeFeed = null;
let editingEntry = null;
let timerHandle = null;
let syncHandle = null;
let toastHandle = null;
let loadedEntries = [];
let showingAllEntries = false;
let historyPage = 0;
let readPending = false;
let writePending = false;
let readQueued = false;
let loadedFullHistory = false;
let readFailures = 0;
let nextBackgroundRead = 0;
const HISTORY_PAGE_SIZE = 50;
const logDateFormatter = new Intl.DateTimeFormat('en-CA', {
  timeZone: 'America/New_York', year: 'numeric', month: '2-digit', day: '2-digit'
});

init();

async function init() {

  bindEvents();
  const status = await api('/login-status', { authOptional: true });
  showAuthenticated(status.authenticated);
}

function bindEvents() {

  logoutButton.addEventListener('click', async () => {
    window.location.reload();
  });

  startLeft.addEventListener('click', () => startFeed('left'));
  startRight.addEventListener('click', () => startFeed('right'));
  startBottle.addEventListener('click', () => startFeed('bottle'));
  stopButton.addEventListener('click', stopFeed);
  startNap.addEventListener('click', () => startSleep('nap'));
  startBedtime.addEventListener('click', () => startSleep('bedtime'));
  stopSleepButton.addEventListener('click', stopSleep);
  weighInButton.addEventListener('click', () => openEditDialog({ weigh_in: true, time_start: new Date().toISOString(), note: noteInput.value.trim() }));
  noteButton.addEventListener('click', createNote);
  peeButton.addEventListener('click', () => createSimpleEntry('pee'));
  poopButton.addEventListener('click', () => createSimpleEntry('poop'));
  refreshButton.addEventListener('click', loadEntries);
  historyButton.addEventListener('click', async () => {
    showingAllEntries = !showingAllEntries;
    filterFrom.value = filterThrough.value = '';
    historyPage = 0;
    await loadEntries();
  });
  for (const option of typeFilterOptions) option.addEventListener('change', () => {
    historyPage = 0;
    renderLog();
  });
  for (const input of [filterFrom, filterThrough]) input.addEventListener('change', async () => {
    historyPage = 0;
    renderLog();
    if (!invalidDateRange() && needsFullHistory() !== loadedFullHistory) await loadEntries();
  });
  clearFilters.addEventListener('click', async () => {
    for (const option of typeFilterOptions) option.checked = false;
    filterFrom.value = filterThrough.value = '';
    historyPage = 0;
    renderLog();
    if (needsFullHistory() !== loadedFullHistory) await loadEntries();
  });
  document.addEventListener('visibilitychange', () => {
    if (!document.hidden && !appView.hidden) loadEntries();
  });
  window.addEventListener('online', () => { if (!appView.hidden) loadEntries(); });
  previousPageButton.addEventListener('click', () => {
    historyPage -= 1;
    renderLog();
    logRange.scrollIntoView({ block: 'start' });
  });
  nextPageButton.addEventListener('click', () => {
    historyPage += 1;
    renderLog();
    logRange.scrollIntoView({ block: 'start' });
  });
  cancelEditButton.addEventListener('click', closeEditDialog);
  editForm.addEventListener('submit', saveEdit);
  deleteEditButton.addEventListener('click', deleteEditingEntry);
  editDialog.addEventListener('click', (event) => {
    if (event.target === editDialog) closeEditDialog();
  });
}

function showAuthenticated(authenticated) {
  loginView.hidden = authenticated;
  appView.hidden = !authenticated;

  window.clearInterval(syncHandle);
  syncHandle = null;
  if (authenticated) {
    showingAllEntries = false;
    loadedEntries = [];
    loadedFullHistory = false;
    for (const option of typeFilterOptions) option.checked = false;
    filterFrom.value = filterThrough.value = '';
    historyPage = 0;
    loadEntries();
    syncHandle = window.setInterval(() => {
      if (!document.hidden && !writePending && Date.now() >= nextBackgroundRead) loadEntries();
    }, 60000);
  }
}

function startSleep(sleepType) {
  return createEntry({ type: 'sleep', sleepType, startedAt: new Date().toISOString(), note: '' }, `${sleepType === 'nap' ? 'Nap' : 'Bedtime'} started`);
}

async function stopSleep() {
  if (!activeSleep) return;
  await updateEntry(activeSleep.id, {
    type: 'sleep', sleepType: activeSleep.sleep_type,
    startedAt: activeSleep.time_start, stoppedAt: new Date().toISOString(),
    note: takeNote() || activeSleep.note || ''
  }, 'Sleep saved');
}

function syncActiveSleep(entries) {
  activeSleep = entries.find(entry => entry.sleep_type && !entry.time_stop) || null;
  window.clearInterval(sleepTimerHandle);
  sleepCard.hidden = !activeSleep;
  startNap.disabled = writePending || Boolean(activeSleep);
  startBedtime.disabled = writePending || Boolean(activeSleep);
  if (!activeSleep) return;
  sleepType.textContent = activeSleep.sleep_type === 'nap' ? 'Nap' : 'Bedtime';
  updateSleepTimer();
  sleepTimerHandle = window.setInterval(updateSleepTimer, 1000);
}

function updateSleepTimer() {
  if (!activeSleep) return;
  const seconds = Math.max(0, Math.floor((Date.now() - Date.parse(activeSleep.time_start)) / 1000));
  sleepTime.textContent = [Math.floor(seconds / 3600), Math.floor(seconds / 60) % 60, seconds % 60]
    .map(value => String(value).padStart(2, '0')).join(':');
}

function startFeed(side) {
  createEntry({ type: 'feeding', side, startedAt: new Date().toISOString(), note: '' }, `${side === 'left' ? 'Left' : side === 'bottle' ? 'Bottle' : 'Right'} feeding started`)
;
}

async function stopFeed() {
  if (!activeFeed) return;

  const stoppedFeed = activeFeed;
  const saved = await updateEntry(activeFeed.id, {
    type: 'feeding',
    side: activeFeed.side,
    startedAt: activeFeed.startedAt.toISOString(),
    stoppedAt: new Date().toISOString(),
    note: takeNote()
  }, 'Feeding saved');
  if (!saved) return;
  activeFeed = null;
  window.clearInterval(timerHandle);
  activeCard.hidden = true;
  startLeft.disabled = false;
  startRight.disabled = false;
  startBottle.disabled = false;
  if (stoppedFeed.side === 'bottle') {
    openEditDialog(loadedEntries.find(entry => entry.id === stoppedFeed.id));
    editVolume.focus();
  }
}

async function createSimpleEntry(type) {
  const note = noteInput.value.trim();
  const saved = await createEntry({ type, occurredAt: new Date().toISOString(), note }, type === 'pee' ? 'Pee logged' : 'Poop logged');
  if (saved && noteInput.value.trim() === note) noteInput.value = '';
}

async function createNote() {
  const note = noteInput.value.trim();
  if (!note) {
    noteInput.focus();
    return;
  }

  const saved = await createEntry({
    type: 'note',
    occurredAt: new Date().toISOString(),
    note
  }, 'Note saved');
  if (saved && noteInput.value.trim() === note) noteInput.value = '';
}

async function createEntry(entry, successMessage) {
  if (writePending) return false;
  writePending = true;
  setActionButtonsDisabled(true);
  try {
    const { entry: saved } = await api('/api/entries', {
      method: 'POST',
      body: entry
    });
    applySavedEntry(saved);
    saveError.hidden = true;
    showToast(successMessage);
    return true;
  } catch {
    saveError.textContent = 'Could not confirm this entry was saved. Tap Refresh to check before trying again.';
    saveError.hidden = false;
    showToast('Could not save that entry. Please try again.', true);
    return false;
  } finally {
    writePending = false;
    setActionButtonsDisabled(false);
    if (readQueued) loadEntries();
    if (activeFeed) {
      startLeft.disabled = true;
      startRight.disabled = true;
      startBottle.disabled = true;
    }
  }
}

async function updateEntry(id, entry, successMessage) {
  writePending = true;
  setActionButtonsDisabled(true);
  try {
    const { entry: saved } = await api(`/api/entries/${encodeURIComponent(id)}`, { method: 'PUT', body: entry });
    applySavedEntry(saved);
    saveError.hidden = true;
    showToast(successMessage);
    return true;
  } catch {
    saveError.textContent = 'Could not confirm this entry was saved. Tap Refresh to check before trying again.';
    saveError.hidden = false;
    showToast('Could not save that entry. Please try again.', true);
    return false;
  } finally {
    writePending = false;
    setActionButtonsDisabled(false);
    if (readQueued) loadEntries();
  }
}

function applySavedEntry(entry) {
  loadedEntries = [entry, ...loadedEntries.filter(row => row.id !== entry.id)]
    .sort((a, b) => b.time_start.localeCompare(a.time_start));
  syncActiveFeed(loadedEntries);
  syncActiveSleep(loadedEntries);
  renderGraphs(loadedEntries.slice(0, 100));
  renderLog();
}

async function loadEntries() {
  if (readPending || writePending) { readQueued = true; return; }
  readQueued = false;
  readPending = true;
  const fullHistory = needsFullHistory();
  refreshButton.disabled = true;
  const startingEntries = loadedEntries;
  try {
    const { entries } = await api(fullHistory ? '/api/entries?limit=all' : '/api/entries');
    // A read begun before a save must not replace the newer saved state.
    if (writePending || startingEntries !== loadedEntries || fullHistory !== needsFullHistory()) { readQueued = true; return; }
    loadedEntries = Array.isArray(entries) ? entries : [];
    loadedFullHistory = fullHistory;
    readFailures = 0;
    nextBackgroundRead = Date.now() + 60000;
    syncActiveFeed(loadedEntries);
    syncActiveSleep(loadedEntries);
    renderGraphs(loadedEntries.slice(0, 100));
    historyButton.disabled = false;
    renderLog();
  } catch {
    readFailures += 1;
    nextBackgroundRead = Date.now() + Math.min(3600000, 60000 * 2 ** Math.min(readFailures, 6));
    // Keep the last known records and feeding controls usable when reads fail.
    showToast('Could not refresh. Showing the last loaded entries; you can still try saving.', true);
  } finally {
    readPending = false;
    refreshButton.disabled = false;
    if (readQueued && !writePending) loadEntries();
  }
}

function logDate(iso) {
  const parts = logDateFormatter.formatToParts(new Date(iso));
  const values = Object.fromEntries(parts.map(({ type, value }) => [type, value]));
  return `${values.year}-${values.month}-${values.day}`;
}

function recentEntries(entries, now = new Date()) {
  const today = logDate(now);
  // Calendar arithmetic in UTC avoids daylight-saving shifts in the date range.
  const cutoff = new Date(`${today}T12:00:00Z`);
  cutoff.setUTCDate(cutoff.getUTCDate() - 2);
  const firstDay = cutoff.toISOString().slice(0, 10);
  return entries.filter((entry) => {
    const day = logDate(entry.time_start);
    return day >= firstDay && day <= today;
  });
}

function needsFullHistory() {
  return showingAllEntries || Boolean(filterFrom.value || filterThrough.value);
}

function invalidDateRange() {
  return Boolean(filterFrom.value && filterThrough.value && filterFrom.value > filterThrough.value);
}

function entryType(entry) {
  if (entry.weigh_in) return 'weigh-in';
  if (entry.sleep_type) return entry.sleep_type;
  if (entry.bottle) return 'bottle';
  if (entry.left_side) return 'left';
  if (entry.right_side) return 'right';
  if (entry.pee) return 'pee';
  if (entry.poop) return 'poop';
  return 'note';
}

function filterLogEntries(entries, { types = [], from = '', through = '', allTime = false, now = new Date() } = {}) {
  if (from && through && from > through) return [];
  const dated = (from || through || allTime) ? entries : recentEntries(entries, now);
  return dated.filter(entry => {
    const day = logDate(entry.time_start);
    return (!from || day >= from) && (!through || day <= through) && (!types.length || types.includes(entryType(entry)));
  });
}

function renderLog() {
  const types = typeFilterOptions.filter(option => option.checked).map(option => option.value);
  const from = filterFrom.value, through = filterThrough.value;
  const invalid = invalidDateRange();
  filterError.hidden = !invalid;
  filterError.textContent = invalid ? 'The From date must be on or before the Through date.' : '';
  const matches = filterLogEntries(loadedEntries, { types, from, through, allTime: showingAllEntries });
  const pageCount = Math.max(1, Math.ceil(matches.length / HISTORY_PAGE_SIZE));
  historyPage = Math.max(0, Math.min(historyPage, pageCount - 1));
  const start = historyPage * HISTORY_PAGE_SIZE;
  const visible = matches.slice(start, start + HISTORY_PAGE_SIZE);
  const waitingForHistory = needsFullHistory() && !loadedFullHistory;

  logRange.textContent = from || through ? `${from || 'Beginning'} through ${through || 'present'}` : showingAllEntries ? 'All time' : 'Last 3 days';
  historyButton.textContent = showingAllEntries ? 'Show last 3 days' : 'See all entries';
  historyButton.setAttribute('aria-expanded', String(showingAllEntries));
  historyPagination.hidden = pageCount <= 1 || invalid || waitingForHistory;
  previousPageButton.disabled = historyPage === 0;
  nextPageButton.disabled = historyPage >= pageCount - 1;
  pageStatus.textContent = `Page ${historyPage + 1} of ${pageCount}`;
  logResults.textContent = invalid ? '' : waitingForHistory ? 'Loading full history…' : `${matches.length} ${matches.length === 1 ? 'entry' : 'entries'}${types.length ? ' matching selected types' : ''}`;

  if (!visible.length || invalid || waitingForHistory) {
    const empty = document.createElement('p');
    empty.className = 'empty-log';
    empty.textContent = invalid ? 'Adjust the date range to view entries.' : waitingForHistory ? 'Full history is not loaded yet. If loading fails, tap Refresh to try again.' : types.length || from || through ? 'No entries match these filters. Try other types or dates, or clear the filters.' : showingAllEntries ? 'Nothing logged yet. Your first entry will show up here.' : 'No entries in the last 3 days. Tap See all entries to view older records.';
    logList.replaceChildren(empty);
    return;
  }
  logList.replaceChildren(...visible.map(renderEntry));
}


function syncActiveFeed(entries) {
  const openFeed = entries.find((entry) => (entry.left_side || entry.right_side || entry.bottle) && !entry.time_stop);
  if (!openFeed) {
    if (activeFeed) {
      activeFeed = null;
      window.clearInterval(timerHandle);
      activeCard.hidden = true;
      startLeft.disabled = false;
      startRight.disabled = false;
      startBottle.disabled = false;
    }
    return;
  }

  activeFeed = {
    id: openFeed.id,
    side: openFeed.bottle ? 'bottle' : openFeed.left_side ? 'left' : 'right',
    startedAt: new Date(openFeed.time_start)
  };
  activeSide.textContent = activeFeed.side === 'bottle' ? 'Bottle feed' : activeFeed.side === 'left' ? 'Left side' : 'Right side';
  activeCard.hidden = false;
  startLeft.disabled = true;
  startRight.disabled = true;
      startBottle.disabled = true;
  updateTimer();
  window.clearInterval(timerHandle);
  timerHandle = window.setInterval(updateTimer, 1000);
}

function renderEntry(entry) {
  const element = document.createElement('article');
  element.className = 'entry';

  const details = document.createElement('div');
  details.className = 'entry-details';

  const title = document.createElement('p');
  title.className = 'entry-title';
  title.textContent = entryTitle(entry);

  const time = document.createElement('span');
  time.className = 'entry-time';
  time.textContent = `${logDate(entry.time_start)} · ${entry.time_display}`;

  details.append(title, time);

  const actions = document.createElement('div');
  actions.className = 'entry-actions';

  const editButton = document.createElement('button');
  editButton.className = 'edit-entry-button';
  editButton.type = 'button';
  editButton.innerHTML = '<span aria-hidden="true">✎</span><span>Edit entry</span>';
  editButton.setAttribute('aria-label', `Edit ${entryTitle(entry)} entry`);
  editButton.addEventListener('click', () => openEditDialog(entry));

  const deleteButton = document.createElement('button');
  deleteButton.className = 'delete-entry-button';
  deleteButton.type = 'button';
  deleteButton.innerHTML = '<span aria-hidden="true">×</span><span>Delete</span>';
  deleteButton.setAttribute('aria-label', `Delete ${entryTitle(entry)} entry`);
  deleteButton.addEventListener('click', async () => {
    deleteButton.disabled = true;
    try {
      if (!await deleteEntry(entry)) return;
      await loadEntries();
      showToast('Entry deleted');
    } catch {
      showToast('Could not delete this entry. Please try again.', true);
    } finally {
      deleteButton.disabled = false;
    }
  });

  actions.append(editButton, deleteButton);
  element.append(details, actions);

  if (entry.note) {
    const note = document.createElement('p');
    note.className = 'entry-note';
    note.textContent = entry.note;
    element.append(note);
  }

  return element;
}

function renderGraphs(entries) {
  feedingChart.replaceChildren(renderFeedingChart(entries));
  diaperChart.replaceChildren(renderDiaperChart(entries));
  feedingCountChart.replaceChildren(renderFeedingCountsChart(entries));
}

function renderFeedingChart(entries) {
  const cutoff = Date.now() - 48 * 60 * 60 * 1000;
  const feedingEntries = entries
    .filter((entry) => entry.left_side || entry.right_side || entry.bottle)
    .filter((entry) => new Date(entry.time_start).getTime() >= cutoff)
    .map((entry) => ({
      side: entry.bottle ? 'bottle' : entry.left_side ? 'left' : 'right',
      x: new Date(entry.time_start).getTime(),
      dateLabel: entry.entry_date || new Date(entry.time_start).toISOString().slice(0, 10),
      value: timeToMinutes(entry.time_start)
    }))
    .sort((a, b) => a.x - b.x);

  return renderLineChart(feedingEntries, {
    series: [
      { key: 'left', label: 'Left', color: '#2f6f63' },
      { key: 'right', label: 'Right', color: '#405e91' },
      { key: 'bottle', label: 'Bottle', color: '#956b38' }
    ],
    xLabel: 'Last 48 hours',
    yLabel: 'Time of day',
    emptyLabel: 'No feeding data in the last 48 hours'
  });
}

function renderDiaperChart(entries) {
  const days = groupByDay(entries.filter((entry) => entry.pee || entry.poop));
  const values = days.map((day) => ({
    label: day.label,
    pee: day.entries.filter((entry) => entry.pee).length,
    poop: day.entries.filter((entry) => entry.poop).length
  }));

  return renderBarChart(values, {
    series: [
      { key: 'pee', label: 'Pee', color: '#7db7f2' },
      { key: 'poop', label: 'Poop', color: '#c89b5a' }
    ],
    emptyLabel: 'No diaper events yet'
  });
}

function renderFeedingCountsChart(entries) {
  const left = entries.filter((entry) => entry.left_side).length;
  const right = entries.filter((entry) => entry.right_side).length;

  return renderBarChart([
    { label: 'Left', left, right: 0 },
    { label: 'Right', left: 0, right: right },
    { label: 'Bottle', bottle: entries.filter(entry => entry.bottle).length }
  ], {
    series: [
      { key: 'left', label: 'Left', color: '#2f6f63' },
      { key: 'right', label: 'Right', color: '#405e91' },
      { key: 'bottle', label: 'Bottle', color: '#956b38' }
    ],
    compact: true,
    emptyLabel: 'No feeding data yet'
  });
}

function renderLineChart(rows, options) {
  const svg = makeSvg();
  const width = 640;
  const height = 260;
  const padding = { top: 16, right: 18, bottom: 38, left: 52 };
  const innerWidth = width - padding.left - padding.right;
  const innerHeight = height - padding.top - padding.bottom;

  if (!rows.length) return emptyChart(options.emptyLabel);

  const bySeries = options.series.map((series) => rows.filter((row) => row.side === series.key));
  const dates = rows.map((row) => row.x);
  const minX = Math.min(...dates);
  const maxX = Math.max(...dates);

  svg.setAttribute('viewBox', `0 0 ${width} ${height}`);

  drawAxes(svg, width, height, padding, options.xLabel, options.yLabel);

  options.series.forEach((series, index) => {
    const points = bySeries[index];
    if (!points.length) return;
    const path = points.map((point, pointIndex) => {
      const x = scale(point.x, minX, maxX, padding.left, padding.left + innerWidth);
      const y = scale(point.value, 0, 24 * 60, padding.top + innerHeight, padding.top);
      return `${pointIndex === 0 ? 'M' : 'L'} ${x.toFixed(1)} ${y.toFixed(1)}`;
    }).join(' ');
    const line = createSvg('path', {
      d: path,
      fill: 'none',
      stroke: series.color,
      'stroke-width': '3',
      'stroke-linecap': 'round',
      'stroke-linejoin': 'round'
    });
    svg.append(line);
  });

  addLineLegend(svg, options.series, width, padding.top);
  addDateTicks(svg, rows, width, height, padding);
  addTimeTicks(svg, width, height, padding);
  return svg;
}

function renderBarChart(rows, options) {
  const svg = makeSvg();
  const width = 640;
  const height = 260;
  const padding = { top: 18, right: 14, bottom: options.compact ? 36 : 44, left: 42 };
  const innerWidth = width - padding.left - padding.right;
  const innerHeight = height - padding.top - padding.bottom;

  if (!rows.length) return emptyChart(options.emptyLabel);

  svg.setAttribute('viewBox', `0 0 ${width} ${height}`);

  const grouped = rows.map((row) => ({
    label: row.label,
    values: options.series.map((series) => Number(row[series.key] || 0))
  }));
  const maxValue = Math.max(1, ...grouped.flatMap((row) => row.values));
  const groupWidth = innerWidth / grouped.length;
  const barGap = 8;
  const barWidth = Math.max(10, (groupWidth - barGap * (options.series.length + 1)) / options.series.length);

  grouped.forEach((row, rowIndex) => {
    const xBase = padding.left + rowIndex * groupWidth;
    row.values.forEach((value, seriesIndex) => {
      const x = xBase + barGap + seriesIndex * (barWidth + barGap);
      const h = (value / maxValue) * innerHeight;
      const y = padding.top + innerHeight - h;
      const rect = createSvg('rect', {
        x: x.toFixed(1),
        y: y.toFixed(1),
        width: barWidth.toFixed(1),
        height: h.toFixed(1),
        rx: '8',
        fill: options.series[seriesIndex].color
      });
      svg.append(rect);
    });

    const label = createSvg('text', {
      x: (xBase + groupWidth / 2).toFixed(1),
      y: (height - 12).toFixed(1),
      'text-anchor': 'middle',
      class: 'chart-label'
    });
    label.textContent = row.label;
    svg.append(label);
  });

  addBarLegend(svg, options.series, width, padding.top);
  drawChartFrame(svg, width, height, padding);
  return svg;
}

function drawAxes(svg, width, height, padding, xLabel, yLabel) {
  drawChartFrame(svg, width, height, padding);
  const xAxis = createSvg('text', {
    x: (width - padding.right).toFixed(1),
    y: (height - 8).toFixed(1),
    'text-anchor': 'end',
    class: 'chart-axis-label'
  });
  xAxis.textContent = xLabel;
  const yAxis = createSvg('text', {
    x: 12,
    y: 18,
    class: 'chart-axis-label'
  });
  yAxis.textContent = yLabel;
  svg.append(xAxis, yAxis);
}

function drawChartFrame(svg, width, height, padding) {
  const frame = createSvg('rect', {
    x: padding.left,
    y: padding.top,
    width: width - padding.left - padding.right,
    height: height - padding.top - padding.bottom,
    rx: '14',
    fill: 'transparent',
    stroke: 'rgba(37, 33, 27, 0.12)'
  });
  svg.append(frame);
}

function addDateTicks(svg, rows, width, height, padding) {
  const dates = [...new Map(rows.map((row) => [row.dateLabel, row.x])).entries()];
  const innerWidth = width - padding.left - padding.right;
  const minX = rows[0].x;
  const maxX = rows[rows.length - 1].x;
  dates.slice(0, 5).forEach(([dateLabel, xValue]) => {
    const tickX = scale(xValue, minX, maxX, padding.left, padding.left + innerWidth);
    const line = createSvg('line', {
      x1: tickX.toFixed(1),
      x2: tickX.toFixed(1),
      y1: padding.top + 4,
      y2: height - padding.bottom,
      stroke: 'rgba(37, 33, 27, 0.06)'
    });
    const label = createSvg('text', {
      x: tickX.toFixed(1),
      y: (height - 12).toFixed(1),
      'text-anchor': 'middle',
      class: 'chart-tick-label'
    });
    label.textContent = dateLabel.slice(5);
    svg.append(line);
    svg.append(label);
  });
}

function addTimeTicks(svg, width, height, padding) {
  const innerHeight = height - padding.top - padding.bottom;
  [0, 6, 12, 18, 24].forEach((hour) => {
    const y = scale(hour * 60, 0, 24 * 60, padding.top + innerHeight, padding.top);
    const label = createSvg('text', {
      x: 10,
      y: (y + 4).toFixed(1),
      class: 'chart-tick-label'
    });
    label.textContent = `${hour.toString().padStart(2, '0')}:00`;
    svg.append(label);
  });
}

function addLineLegend(svg, series, width, paddingTop) {
  series.forEach((item, index) => {
    const group = createSvg('g', {
      transform: `translate(${18 + index * 92}, ${paddingTop})`
    });
    const swatch = createSvg('rect', {
      x: 0,
      y: 0,
      width: 12,
      height: 12,
      rx: 4,
      fill: item.color
    });
    const label = createSvg('text', {
      x: 18,
      y: 11,
      class: 'chart-legend'
    });
    label.textContent = item.label;
    group.append(swatch, label);
    svg.append(group);
  });
}

function addBarLegend(svg, series, width, paddingTop) {
  addLineLegend(svg, series, width, paddingTop);
}

function emptyChart(label) {
  const empty = document.createElement('p');
  empty.className = 'empty-chart';
  empty.textContent = label;
  return empty;
}

function makeSvg() {
  return document.createElementNS('http://www.w3.org/2000/svg', 'svg');
}

function createSvg(tag, attrs = {}) {
  const node = document.createElementNS('http://www.w3.org/2000/svg', tag);
  for (const [key, value] of Object.entries(attrs)) {
    node.setAttribute(key, String(value));
  }
  return node;
}

function scale(value, inMin, inMax, outMin, outMax) {
  if (inMax === inMin) return (outMin + outMax) / 2;
  return outMin + ((Number(value) - inMin) / (inMax - inMin)) * (outMax - outMin);
}

function timeToMinutes(iso) {
  const date = new Date(iso);
  return date.getHours() * 60 + date.getMinutes();
}

function groupByDay(entries) {
  const map = new Map();
  entries.forEach((entry) => {
    const key = String(entry.entry_date || new Date(entry.time_start).toISOString().slice(0, 10));
    if (!map.has(key)) map.set(key, []);
    map.get(key).push(entry);
  });
  return [...map.entries()]
    .sort(([left], [right]) => left.localeCompare(right))
    .map(([label, dayEntries]) => ({ label, entries: dayEntries }));
}

function openEditDialog(entry) {
  editingEntry = entry;
  editError.textContent = '';
  editEntryType.textContent = entry.id ? entryTitle(entry) : 'Add weight and optional height';
  editDialogTitle.textContent = entry.id ? 'Edit entry' : 'Weigh in';
  saveEditButton.textContent = entry.id ? 'Save changes' : 'Save weigh-in';
  deleteEditButton.hidden = !entry.id;
  editMeasurements.hidden = !entry.weigh_in;
  editWeight.disabled = editHeight.disabled = !entry.weigh_in;
  editWeight.required = Boolean(entry.weigh_in);
  editWeight.value = entry.weight ?? '';
  editWeightUnit.value = entry.weight_unit || 'lb';
  editHeight.value = entry.height ?? '';
  editHeightUnit.value = entry.height_unit || 'in';
  editStartedAt.value = toLocalDateTime(entry.time_start);
  const isTimed = Boolean(entry.left_side || entry.right_side || entry.bottle || entry.sleep_type);
  editStoppedAtField.hidden = !isTimed;
  editStoppedAt.required = isTimed;
  editStoppedAt.value = isTimed ? toLocalDateTime(entry.time_stop) : '';
  editVolumeField.hidden = !entry.bottle || !entry.time_stop;
  editVolume.disabled = editVolumeField.hidden;
  editVolume.value = entry.volume ?? '';
  editVolumeUnit.value = entry.volume_unit || 'oz';
  editNote.value = entry.note || '';
  editDialog.showModal();
  (entry.weigh_in ? editWeight : editStartedAt).focus();
}

function closeEditDialog() {
  editingEntry = null;
  editForm.reset();
  editError.textContent = '';
  if (editDialog.open) editDialog.close();
}

async function deleteEntry(entry) {
  const entryName = entryTitle(entry).toLowerCase();
  if (!window.confirm(`Delete this ${entryName} entry? This cannot be undone.`)) return false;
  await api(`/api/entries/${encodeURIComponent(entry.id)}`, {
    method: 'DELETE'
  });
  return true;
}

async function deleteEditingEntry() {
  if (!editingEntry) return;
  deleteEditButton.disabled = true;
  saveEditButton.disabled = true;
  try {
    if (!await deleteEntry(editingEntry)) return;
    closeEditDialog();
    await loadEntries();
    showToast('Entry deleted');
  } catch {
    editError.textContent = 'Could not delete this entry. Please try again.';
  } finally {
    deleteEditButton.disabled = false;
    saveEditButton.disabled = false;
  }
}

async function saveEdit(event) {
  event.preventDefault();
  if (!editingEntry) return;

  const startedAt = editStartedAt.value === toLocalDateTime(editingEntry.time_start) ? editingEntry.time_start : fromLocalDateTime(editStartedAt.value);
  const isTimed = Boolean(editingEntry.left_side || editingEntry.right_side || editingEntry.bottle || editingEntry.sleep_type);
  const stoppedAt = isTimed ? (editStoppedAt.value === toLocalDateTime(editingEntry.time_stop) ? editingEntry.time_stop : fromLocalDateTime(editStoppedAt.value)) : null;

  if (!startedAt || (isTimed && !editingEntry.time_stop && !stoppedAt)) {
    editError.textContent = 'Enter a valid time.';
    return;
  }

  if (stoppedAt && stoppedAt < startedAt) {
    editError.textContent = 'Session must end after it starts.';
    return;
  }

  saveEditButton.disabled = true;
  try {
    const payload = isTimed
      ? {
          type: editingEntry.sleep_type ? 'sleep' : 'feeding',
          ...(editingEntry.sleep_type ? { sleepType: editingEntry.sleep_type } : {}),
          side: editingEntry.bottle ? 'bottle' : editingEntry.left_side ? 'left' : 'right',
          ...(editingEntry.bottle && stoppedAt ? { volume: editVolume.value === '' ? null : Number(editVolume.value), volumeUnit: editVolumeUnit.value } : {}),
          startedAt,
          stoppedAt,
          note: editNote.value.trim()
        }
      : {
          type: editingEntry.weigh_in ? 'weigh-in' : editingEntry.pee ? 'pee' : editingEntry.poop ? 'poop' : 'note',
          ...(editingEntry.weigh_in ? { weight: Number(editWeight.value), weightUnit: editWeightUnit.value, height: editHeight.value === '' ? null : Number(editHeight.value), heightUnit: editHeightUnit.value } : {}),
          occurredAt: startedAt,
          note: editNote.value.trim()
        };
    const isNew = !editingEntry.id;
    const { entry: saved } = await api(isNew ? '/api/entries' : `/api/entries/${encodeURIComponent(editingEntry.id)}`, {
      method: isNew ? 'POST' : 'PUT',
      body: payload
    });
    applySavedEntry(saved);
    if (isNew && noteInput.value.trim() === payload.note) noteInput.value = '';
    closeEditDialog();
    showToast(isNew ? 'Weigh-in saved' : 'Entry updated');
  } catch {
    editError.textContent = 'Could not save changes. Please try again.';
  } finally {
    saveEditButton.disabled = false;
  }
}

function toLocalDateTime(iso) {
  if (!iso) return '';
  const date = new Date(iso);
  const parts = new Intl.DateTimeFormat('en-CA', {
    timeZone: 'America/New_York',
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
    hour: '2-digit',
    minute: '2-digit',
    hourCycle: 'h23'
  }).formatToParts(date).reduce((values, part) => {
    if (part.type !== 'literal') values[part.type] = part.value;
    return values;
  }, {});
  return `${parts.year}-${parts.month}-${parts.day}T${parts.hour}:${parts.minute}`;
}

function fromLocalDateTime(value) {
  if (!value || !/^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}$/.test(value)) return '';
  const [datePart, timePart] = value.split('T');
  const [year, month, day] = datePart.split('-').map(Number);
  const [hour, minute] = timePart.split(':').map(Number);
  const intended = Date.UTC(year, month - 1, day, hour, minute);
  let guess = intended + 4 * 60 * 60 * 1000;
  for (let i = 0; i < 3; i += 1) {
    const displayed = toLocalDateTime(new Date(guess).toISOString());
    const [displayedDate, displayedTime] = displayed.split('T');
    const [displayedYear, displayedMonth, displayedDay] = displayedDate.split('-').map(Number);
    const [displayedHour, displayedMinute] = displayedTime.split(':').map(Number);
    const displayedUtc = Date.UTC(displayedYear, displayedMonth - 1, displayedDay, displayedHour, displayedMinute);
    guess += intended - displayedUtc;
  }
  return new Date(guess).toISOString();
}

function entryTitle(entry) {
  if (entry.weigh_in) return `Weigh-in${entry.weight != null ? ` · ${entry.weight} ${entry.weight_unit}` : ''}${entry.height != null ? ` · ${entry.height} ${entry.height_unit}` : ''}`;
  if (entry.sleep_type) return entry.sleep_type === 'nap' ? 'Nap' : 'Bedtime';
  if (entry.bottle) return `Bottle feed${entry.volume != null ? ` · ~${entry.volume} ${entry.volume_unit}` : ''}`;
  if (entry.left_side) return 'Left feeding';
  if (entry.right_side) return 'Right feeding';
  if (entry.pee) return 'Pee';
  if (entry.poop) return 'Poop';
  return 'Note';
}

function updateTimer() {
  if (!activeFeed) return;
  const elapsed = Math.max(0, Date.now() - activeFeed.startedAt.getTime());
  const minutes = Math.floor(elapsed / 60000);
  const seconds = Math.floor((elapsed % 60000) / 1000);
  activeTime.textContent = `${String(minutes).padStart(2, '0')}:${String(seconds).padStart(2, '0')}`;
}

function takeNote() {
  const note = noteInput.value.trim();
  noteInput.value = '';
  return note;
}

function setActionButtonsDisabled(disabled) {
  startNap.disabled = disabled || Boolean(activeSleep);
  startBedtime.disabled = disabled || Boolean(activeSleep);
  stopSleepButton.disabled = disabled;
  weighInButton.disabled = disabled;
  noteButton.disabled = disabled;
  peeButton.disabled = disabled;
  poopButton.disabled = disabled;
  stopButton.disabled = disabled;
  if (!activeFeed) {
    startLeft.disabled = disabled;
    startRight.disabled = disabled;
    startBottle.disabled = disabled;
  }
}

function showToast(message, isError = false) {
  window.clearTimeout(toastHandle);
  toast.textContent = message;
  toast.hidden = false;
  toast.style.background = isError ? '#a12c1d' : '';
  toastHandle = window.setTimeout(() => {
    toast.hidden = true;
    toast.style.background = '';
  }, 2600);
}

