export function normalizeEntry(input, now = new Date()) {
  const type = String(input.type || '').trim();
  const note = String(input.note || '').trim();

  if (!['feeding', 'sleep', 'pee', 'poop', 'note', 'weigh-in'].includes(type)) {
    throw Object.assign(new Error('Unsupported entry type'), { statusCode: 400 });
  }

  const startedAt = input.startedAt || input.occurredAt || now.toISOString();
  const stoppedAt = input.stoppedAt || null;
  const start = new Date(startedAt);
  const stop = stoppedAt ? new Date(stoppedAt) : null;

  if (Number.isNaN(start.getTime()) || (stop && Number.isNaN(stop.getTime()))) {
    throw Object.assign(new Error('Invalid timestamp'), { statusCode: 400 });
  }

  if (type === 'feeding' && !['left', 'right', 'bottle'].includes(input.side)) {
    throw Object.assign(new Error('Feeding side must be left, right, or bottle'), { statusCode: 400 });
  }

  if (stop && stop.getTime() < start.getTime()) {
    throw Object.assign(new Error('End time cannot be before start time'), { statusCode: 400 });
  }

  if (type === 'sleep' && !['nap', 'bedtime'].includes(input.sleepType)) {
    throw Object.assign(new Error('Sleep type must be nap or bedtime'), { statusCode: 400 });
  }

  const isBottle = type === 'feeding' && input.side === 'bottle';
  const hasVolume = input.volume !== undefined && input.volume !== null && input.volume !== '';
  if (hasVolume && (!isBottle || !stop || typeof input.volume !== 'number' || !Number.isFinite(input.volume) || input.volume < 0 || !['oz', 'ml'].includes(input.volumeUnit))) {
    throw Object.assign(new Error('Volume requires a stopped bottle feed, a nonnegative number, and oz or ml'), { statusCode: 400 });
  }

  const isWeighIn = type === 'weigh-in';
  const hasHeight = input.height !== undefined && input.height !== null && input.height !== '';
  if (isWeighIn && (typeof input.weight !== 'number' || !Number.isFinite(input.weight) || input.weight <= 0 || !['lb', 'kg'].includes(input.weightUnit))) {
    throw Object.assign(new Error('Weight must be a positive number in lb or kg'), { statusCode: 400 });
  }
  if (isWeighIn && hasHeight && (typeof input.height !== 'number' || !Number.isFinite(input.height) || input.height <= 0 || !['in', 'cm'].includes(input.heightUnit))) {
    throw Object.assign(new Error('Height must be a positive number in in or cm'), { statusCode: 400 });
  }

  return {
    ...(isWeighIn ? { weigh_in: true, weight: input.weight, weight_unit: input.weightUnit, height: hasHeight ? input.height : null, height_unit: hasHeight ? input.heightUnit : null } : {}),
    ...(isBottle ? { bottle: true, volume: hasVolume ? input.volume : null, volume_unit: hasVolume ? input.volumeUnit : null } : {}),
    ...(type === 'sleep' ? { sleep_type: input.sleepType } : {}),
    id: input.id || crypto.randomUUID(),
    entry_date: formatDate(start),
    time_start: start.toISOString(),
    time_stop: stop ? stop.toISOString() : null,
    time_display: formatTimeDisplay(start, stop),
    left_side: type === 'feeding' && input.side === 'left',
    right_side: type === 'feeding' && input.side === 'right',
    pee: type === 'pee',
    poop: type === 'poop',
    note,
    created_at: now.toISOString(),
    created_by: 'family'
  };
}


function formatDate(date) {
  return new Intl.DateTimeFormat('en-CA', {
    timeZone: 'America/New_York'
  }).format(date);
}

function formatTimeDisplay(start, stop) {
  const formatter = new Intl.DateTimeFormat('en-US', {
    hour: 'numeric',
    minute: '2-digit',
    timeZone: 'America/New_York'
  });

  if (!stop) return formatter.format(start);
  return `${formatter.format(start)} to ${formatter.format(stop)}`;
}


export function createDemoStore() {
  let rows = [];
  const now = Date.now();
  for (let i = 0; i < 18; i++) {
    const start = new Date(now - (i * 150 + 30) * 60000).toISOString();
    const type = ['feeding', 'pee', 'sleep', 'feeding', 'poop', 'note'][i % 6];
    rows.push(normalizeEntry({type, side: i % 2 ? 'bottle' : 'left', sleepType: 'nap',
      startedAt: start, stoppedAt: ['feeding', 'sleep'].includes(type) ? new Date(Date.parse(start) + 15 * 60000).toISOString() : null,
      note: type === 'note' ? 'Fictional example: a calm afternoon.' : ''}));
  }
  rows.push(normalizeEntry({type: 'weigh-in', weight: 4.2, weightUnit: 'kg', height: 54, heightUnit: 'cm', note: 'Fictional sample measurement.'}));
  return async function demoApi(path, options = {}) {
    const method = options.method || 'GET';
    if (path === '/login-status') return {authenticated: true};
    if (path === '/api/entries' || path.startsWith('/api/entries?')) {
      if (method === 'GET') {
        rows = rows.map(row => {
          if (!(row.left_side || row.right_side || row.bottle) || row.time_stop || Date.now() - Date.parse(row.time_start) < 3600000) return row;
          const stop = new Date(Date.parse(row.time_start) + 3600000);
          return {...row, time_stop: stop.toISOString(), time_display: formatTimeDisplay(new Date(row.time_start), stop)};
        });
        return {entries: structuredClone(rows.sort((a,b) => b.time_start.localeCompare(a.time_start)))};
      }
      if (method === 'POST') {
        const entry = normalizeEntry(options.body);
        if ((entry.left_side || entry.right_side || entry.bottle) && !entry.time_stop && rows.some(r => (r.left_side || r.right_side || r.bottle) && !r.time_stop)) throw new Error('A feed is already active');
        if (entry.sleep_type && !entry.time_stop && rows.some(r => r.sleep_type && !r.time_stop)) throw new Error('Sleep is already active');
        rows.push(entry); return {entry: structuredClone(entry)};
      }
    }
    const match = path.match(/^\/api\/entries\/([^/]+)$/);
    if (match) {
      const index = rows.findIndex(row => row.id === decodeURIComponent(match[1]));
      if (index < 0) throw new Error('Entry not found');
      if (method === 'DELETE') {rows.splice(index, 1); return {ok: true};}
      if (method === 'PUT') {
        rows[index] = {...normalizeEntry(options.body), id: rows[index].id, created_at: rows[index].created_at};
        return {entry: structuredClone(rows[index])};
      }
    }
    throw new Error('Unsupported demo operation');
  };
}
export const demoApi = createDemoStore();
