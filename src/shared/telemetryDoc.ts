// TELEMETRY.md, GENERATED FROM THE SCHEMA — plan decision T4.
//
// "`TELEMETRY.md` committed in the repo enumerates every event/field/bucket, generated from the
// schema so it cannot drift (a test pins schema↔doc parity)."
//
// That is the whole reason this module exists rather than a hand-written markdown file. The
// enum members, the bucket edges and the funnel steps below are READ OUT OF `shared/telemetry.ts`
// at render time — they are never retyped here — so a schema change that is not reflected in the
// committed doc fails `tests/telemetryDoc.test.mts`, and the fix is `npm run gen:telemetry-doc`,
// never an edit to the markdown.
//
// The only hand-written content here is PROSE: what each event is for, and the promises at the
// top and bottom of the page. Prose cannot drift from the schema because it makes no claims the
// schema could contradict — every claim that could is rendered from the tables.
//
// The rows are also the completeness check: `TELEMETRY_DOC_EVENTS` must cover
// `TELEMETRY_EVENT_KINDS` exactly, which is what makes "adding an event means adding a doc row"
// a test failure rather than a good intention.
//
// THE EVENT TABLE ITSELF LIVES IN `./telemetryDocEvents.ts` — split out when JOS-100's
// `errorReport` row pushed this file past the repo's 400-code-line ceiling, and re-exported
// below so the generator and the parity test import exactly what they always did. What stays
// here is the RENDERING and the bucket tables.

import {
  ALERT_COUNT_EDGES,
  CHAR_COUNT_EDGES,
  COLD_START_MS_EDGES,
  CPU_COUNT_EDGES,
  DISPLAY_COUNT_EDGES,
  LOG_SIZE_BYTES_EDGES,
  MAX_TZ_OFFSET_HOURS,
  MIN_TZ_OFFSET_HOURS,
  NEW_BYTES_EDGES,
  PRIMARY_SCALE_EDGES,
  SESSION_AGE_MS_EDGES,
  STUTTER_MS_EDGES,
  TELEMETRY_API_VERSION,
  TELEMETRY_BUFFER_CAP,
  TELEMETRY_EVENT_KINDS,
  TELEMETRY_FUNNELS,
  TELEMETRY_FUNNEL_STEPS,
  TOTAL_MEM_GB_EDGES,
  bucketRange,
  type TelemetryEventKind
} from './telemetry'
import { FREE_MEM_GB_EDGES, LIVE_STALL_MS_EDGES, WORKING_SET_MB_EDGES } from './telemetryLive'
import { TELEMETRY_DOC_EVENTS, type DocEvent, type DocField } from './telemetryDocEvents'

export { TELEMETRY_DOC_EVENTS }
export type { DocEvent, DocField }

// ------------------------------------------------------------------ the tables

export interface DocBucket {
  /** The field name the bucket index appears under. */
  field: string
  edges: readonly number[]
  /** `gb` and `percent` arrived with JOS-364's machine class: memory is declared in whole
   *  gibibytes (a byte ladder would print `4 GB – 8 GB` from numbers nobody wrote) and a display
   *  scale is a percentage, which no existing format spells. `mb` arrived with JOS-367's working
   *  set for the same reason in the other direction — that ladder is declared in mebibytes, and
   *  `gb` would print `0 GB` for its first three rungs. */
  format: 'count' | 'ms' | 'bytes' | 'gb' | 'mb' | 'percent'
  what: string
}

/** `` `a` · `b` · `c` `` — one spelling for every closed enum in the doc. */
function values(list: readonly string[]): string {
  return list.map((v) => `\`${v}\``).join(' · ')
}

export const TELEMETRY_DOC_BUCKETS: readonly DocBucket[] = [
  {
    field: 'coldStartMsBucket',
    edges: COLD_START_MS_EDGES,
    format: 'ms',
    what: 'How long the app took to start.'
  },
  {
    field: 'charCountBucket',
    edges: CHAR_COUNT_EDGES,
    format: 'count',
    what: 'How many character logs the app can see.'
  },
  {
    field: 'logSizeBucket',
    edges: LOG_SIZE_BYTES_EDGES,
    format: 'bytes',
    what: 'Size of the log file being read.'
  },
  {
    field: 'alertCountBucket',
    edges: ALERT_COUNT_EDGES,
    format: 'count',
    what: 'How many alerts are configured.'
  },
  {
    field: 'sessionAgeBucket',
    edges: SESSION_AGE_MS_EDGES,
    format: 'ms',
    what: 'How long the app had been running when an error happened.'
  },
  {
    field: 'startup.newBytesBucket',
    edges: NEW_BYTES_EDGES,
    format: 'bytes',
    what: 'How much the log grew while the app was closed.'
  },
  {
    field: 'startup.stutter.p50Bucket',
    edges: STUTTER_MS_EDGES,
    format: 'ms',
    what: 'How late the app’s own clock ran while it read (typical beat).'
  },
  {
    field: 'startup.stutter.p95Bucket',
    edges: STUTTER_MS_EDGES,
    format: 'ms',
    what: 'The same, at the worse end (one beat in twenty).'
  },
  // JOS-364's machine class. Each of these is a range for the same reason every row above is one:
  // the exact figures together would describe one machine, and the questions they exist to answer
  // ("do the freezes cluster on four-core boxes, or on scaled 4K displays") only need the range.
  {
    field: 'cpuCountBucket',
    edges: CPU_COUNT_EDGES,
    format: 'count',
    what: 'How many processor cores the machine has.'
  },
  {
    field: 'totalMemBucket',
    edges: TOTAL_MEM_GB_EDGES,
    format: 'gb',
    what: 'How much memory the machine has.'
  },
  {
    field: 'displayCountBucket',
    edges: DISPLAY_COUNT_EDGES,
    format: 'count',
    what: 'How many monitors are attached.'
  },
  {
    field: 'primaryScaleBucket',
    edges: PRIMARY_SCALE_EDGES,
    format: 'percent',
    what: 'The main monitor’s display scaling.'
  },
  // JOS-367's live-session riders. The stall ladder is printed ONCE and named for the four fields
  // that share it (two clock readings, two read-latency readings): four identical tables would be
  // four chances for one of them to be read as a different ladder than it is.
  {
    field: 'live.p95Bucket · live.maxBucket · tail.p95Bucket · tail.maxBucket',
    edges: LIVE_STALL_MS_EDGES,
    format: 'ms',
    what: 'How late the app’s own timers ran, and how long its reads of the log took.'
  },
  {
    field: 'tail.deltaBytesBucket',
    edges: NEW_BYTES_EDGES,
    format: 'bytes',
    what: 'The biggest single chunk of new log read at once.'
  },
  {
    field: 'state.freeMemBucket',
    edges: FREE_MEM_GB_EDGES,
    format: 'gb',
    what: 'How much free memory the computer had.'
  },
  {
    field: 'state.workingSetBucket',
    edges: WORKING_SET_MB_EDGES,
    format: 'mb',
    what: 'How much memory this app was using.'
  }
]

// ------------------------------------------------------------------ rendering

/** KB below a megabyte, GB above a gigabyte, MB in between. The KB arm arrived with JOS-57's
 *  new-bytes ladder, whose first edge is 64 KB — rounded to megabytes it would print `0 MB`, which
 *  is a table saying nothing. Nothing on the log-size ladder is affected: its first edge IS 1 MB. */
function fmtBytes(n: number): string {
  if (n < 1_048_576) return `${String(Math.round(n / 1024))} KB`
  const mb = n / 1_048_576
  return mb >= 1024 ? `${String(Math.round(mb / 1024))} GB` : `${String(Math.round(mb))} MB`
}

function fmtValue(n: number, format: DocBucket['format']): string {
  if (format === 'bytes') return fmtBytes(n)
  if (format === 'ms') return n >= 1000 ? `${String(n / 1000)} s` : `${String(n)} ms`
  if (format === 'gb') return `${String(n)} GB`
  if (format === 'mb') return `${String(n)} MB`
  if (format === 'percent') return `${String(n)}%`
  return String(n)
}

/**
 * Every range a bucket index can mean: `< 1 s` · `1 s – 2.5 s` · `≥ 20 s`.
 *
 * Ranges are half-open `[lo, hi)`. For a COUNT that reads wrong ("1 – 2" for a bucket that only
 * ever holds 1), so counts print the inclusive integer span instead — `1`, `3 – 4`, `≥ 9`.
 */
function bucketLabels(b: DocBucket): string[] {
  const out: string[] = []
  for (let i = 0; i <= b.edges.length; i++) {
    const { lo, hi } = bucketRange(b.edges, i)
    if (hi === null) out.push(`≥ ${fmtValue(lo, b.format)}`)
    else if (b.format !== 'count') out.push(i === 0 ? `< ${fmtValue(hi, b.format)}` : `${fmtValue(lo, b.format)} – ${fmtValue(hi, b.format)}`)
    else out.push(hi - lo === 1 ? String(lo) : `${String(lo)} – ${String(hi - 1)}`)
  }
  return out
}

/**
 * ONE EVENT'S SECTION. An event with NO fields prints a sentence instead of an empty table
 * (JOS-109's `optOut` / `optIn`): a table with a header row and nothing under it looks like a
 * rendering bug, and "there is nothing in it" is the single most reassuring thing this page can
 * say about those two events, so it is said in words.
 */
function eventSection(e: DocEvent): string[] {
  const lines = [`### \`${e.t}\``, '', e.when, '']
  if (e.fields.length === 0) {
    lines.push('**This event has no fields at all.** It says only that it happened, alongside the', 'five facts every send carries (above).', '')
    return lines
  }
  lines.push('| Field | Values | What it means |', '| --- | --- | --- |')
  for (const f of e.fields) lines.push(`| \`${f.name}\` | ${f.type} | ${f.note} |`)
  lines.push('')
  return lines
}

function bucketSection(): string[] {
  const lines = [
    '## Buckets',
    '',
    'The legacy telemetry schema used ranges instead of exact numbers to limit detail.',
    'Telemetry uploads are disabled. These are the historical ranges defined in the schema:',
    ''
  ]
  for (const b of TELEMETRY_DOC_BUCKETS) {
    lines.push(`**\`${b.field}\`** — ${b.what}`, '')
    lines.push('| Bucket | Range |', '| --- | --- |')
    bucketLabels(b).forEach((label, i) => lines.push(`| ${String(i)} | ${label} |`))
    lines.push('')
  }
  return lines
}

function funnelSection(): string[] {
  const lines = [
    '## Flows',
    '',
    'A `funnelStep` event says which step of one of these you reached — nothing else.',
    ''
  ]
  for (const funnel of TELEMETRY_FUNNELS) {
    lines.push(`**\`${funnel}\`** — ${TELEMETRY_FUNNEL_STEPS[funnel].map((s) => `\`${s}\``).join(' → ')}`, '')
  }
  return lines
}

function headerSection(): string[] {
  return [
    '# What this app measures',
    '',
    '<!-- GENERATED FILE — do not edit by hand.',
    '     Rendered from src/shared/telemetry.ts by `npm run gen:telemetry-doc`.',
    '     tests/telemetryDoc.test.mts fails if this file and the schema disagree. -->',
    '',
    'EQ Legends Companion does not upload anonymous usage analytics or automatic error reports.',
    'The previous AWS telemetry service has been disabled, and the application no longer',
    'starts its telemetry collection or upload service.',
    '',
    '**This build does not send telemetry.** The AWS telemetry endpoint is disabled.',
    'The Usage analytics setting and first-run telemetry notice have been removed.',
    'The event definitions below document the legacy telemetry schema retained in the',
    'source code; they do not indicate that these events are currently collected or uploaded.',
    '',
    '## What can never be collected',
    '',
    'Not "what we choose not to collect" — what the schema has no room for:',
    '',
    '- your character names, your server, your guild, anyone you play with',
    '- zone, mob, spell, item or quest names',
    '- anything you typed: chat, tells, search boxes, alert names, feedback text',
    '- any line of your log',
    '- any path on your machine — where the app is installed, where your log lives, your',
    '  account name',
    '- your IP address, your machine name, your account — there is no account',
    '',
    'Almost every field on this page is a number, or one value from a fixed list printed here,',
    'so there is simply nowhere for any of that to go.',
    '',
    '**Legacy error-report event:** The `errorReport` schema previously described',
    'technical failure details, including error categories, redacted messages,',
    'and application code locations. This event is retained for historical',
    'documentation only. Automatic error-report uploads are disabled, and',
    'the application does not transmit these reports.',
    '',
    '## Legacy telemetry identifiers',
    '',
    'The previous telemetry schema included a random `analyticsId` to identify an',
    'installation without using a character name or account identifier.',
    'These fields are retained below to document the historical schema.',
    'The telemetry service is disabled, so these identifiers are not uploaded.',
    '',
    '| Field | Values |',
    '| --- | --- |',
        '| `analyticsId` | a random UUID used by the legacy telemetry schema; no longer transmitted |',
    '| `appVersion` | the app version, e.g. `0.2.0` |',
    `| \`channel\` | ${values(['prod', 'dev'])} |`,
    '| `platform` | `win32` · `darwin` · `linux` · `other` |',
    `| \`tzOffsetBucket\` | your UTC offset in whole hours (${String(MIN_TZ_OFFSET_HOURS)} to ${String(MAX_TZ_OFFSET_HOURS)}) |`,
    '',
    `The legacy telemetry schema supported buffering up to ${String(TELEMETRY_BUFFER_CAP)} events, dropping the oldest first.`,
    'Events were designed to be uploaded in batches. Telemetry collection and uploads are',
    'disabled in this build. Schema version: ' + String(TELEMETRY_API_VERSION) + '.',
    '',
    '## Events',
    ''
  ]
}

function footerSection(): string[] {
  return [
    '## Telemetry status',
    '',
    'Anonymous usage analytics and automatic error-report uploads are disabled.',
    'The application does not start the previous AWS telemetry service.',
    '',
    'There is no Usage analytics switch or first-run telemetry notice because',
    'the telemetry collection and upload service is no longer active.',
    '',
    'The event definitions above are retained as historical technical documentation.',
    'They do not represent data currently being transmitted.',
    '',
    'To report a problem or suggest an improvement, use GitHub Issues:',
    'https://github.com/Constantine-Decrypt/everquest-companion/issues',
    ''
  ]
}

/** The whole page. Deterministic: same schema in, byte-identical markdown out. */
export function renderTelemetryDoc(): string {
  const lines = [...headerSection()]
  for (const e of TELEMETRY_DOC_EVENTS) lines.push(...eventSection(e))
  lines.push(...funnelSection(), ...bucketSection(), ...footerSection())
  return lines.join('\n')
}

/** Event kinds the doc covers, in doc order — the completeness check's left-hand side. */
export const DOC_EVENT_KINDS: readonly TelemetryEventKind[] = TELEMETRY_DOC_EVENTS.map((e) => e.t)

/** True when the doc describes exactly the schema's event union — no extras, no omissions. */
export function docCoversSchema(): boolean {
  return (
    DOC_EVENT_KINDS.length === TELEMETRY_EVENT_KINDS.length &&
    TELEMETRY_EVENT_KINDS.every((k, i) => DOC_EVENT_KINDS[i] === k)
  )
}
