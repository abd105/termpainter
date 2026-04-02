# termpainter

tired of staring at walls of plain `console.log`? termpainter gives your terminal output actual structure. colors, boxes, badges, tables, timestamps. zero dependencies, works in Node 18+ and Bun.
```sh
npm install termpainter
```

<img src="https://raw.githubusercontent.com/abd105/termpainter/main/assets/demo.png" width="450" alt="termpainter demo" />

---

## usage
```ts
import { style, badge, box, paint, spin, strip, columns, truncate,
         setIcons, setSilent, setTheme, resetTheme, setTestMode, isInteractive } from 'termpainter'
```

### styles

the bread and butter. semantic methods so you stop hardcoding colors everywhere.
```ts
style.success('Build complete')        // ✔ green
style.error('Something went wrong')    // ✖ red
style.warn('Disk usage at 87%')        // ⚠ yellow
style.info('Server started on :3000')  // ℹ blue
style.muted('debug: cache hit')        // gray, dimmed
style.bold('Important message')        // bold white
style.highlight('termpainter')         // cyan
```

### structured log output

any `style.*` method accepts an optional second argument — a plain object whose keys and values are printed below the message, indented and with keys in cyan.
```ts
style.info('User created', { id: 123, role: 'admin' })
// ℹ User created
//   id    123
//   role  admin

style.error('Request failed', { status: 503, path: '/api/data' })
```

### debug

only outputs when `DEBUG` is set to any truthy value. silently returns an empty string otherwise. styled gray + dim with a 🔍 prefix.
```ts
style.debug('cache miss for key xyz')
style.debug('query executed', { rows: 42, ms: 18 })
```
```sh
DEBUG=1 node app.js   # shows debug output
node app.js           # debug lines are invisible
```

### list

bulleted list. each item can be a plain string or a pre-styled string.
```ts
style.list(['Build started', 'Running tests', 'Deploying'])
// • Build started
// • Running tests
// • Deploying

style.list([style.success('Lint passed'), style.warn('Coverage at 74%')])

style.list(items, { bullet: '-', color: 'gray', indent: 2 })
```

### badges

inline labels. good for status, versions, environments.
```ts
badge('v1.0.0', 'cyan')
badge('PASS', 'green')
badge('FAIL', 'red')
badge('production', 'green')
badge('offline', 'red')
```

### boxes

draws a clean unicode border around anything. multiline works fine. fully composable — pass styled strings directly. supports an optional title in the top border.
```ts
box('Deploy complete\n3 services restarted\nAll checks passed', 'green')
box('Critical error\nProcess exited with code 1', 'red')
box(style.success('done'))   // styled content inside a box

// with title
box('Deploy complete\n3 services restarted', { color: 'green', title: 'Deploy' })
// ╭ Deploy ──────────────────╮
// │ Deploy complete          │
// │ 3 services restarted     │
// ╰──────────────────────────╯
```

### divider

horizontal rule. useful for separating sections in long output.
```ts
style.divider()         // gray
style.divider('cyan')   // pick a color
```

### table

aligned key-value output. great for config dumps, status checks, anything tabular.
```ts
style.table({
  Status:      'Running',
  Uptime:      '3d 2h 14m',
  Memory:      '512 MB',
  Port:        '3000',
  Environment: 'production',
})
```

### timestamp

prefixes your message with the current time.
```ts
style.timestamp('Server started')            // [14:32:05] Server started
style.timestamp('Deploy complete', 'green')  // timestamp in green
style.timestamp('Connection failed', 'red')  // timestamp in red
```

### paint

low level, for when you need something the presets don't cover.
```ts
paint('custom text', { color: 'magenta', bold: true })
paint('highlighted', { color: 'white', bg: 'blue' })
paint('soft note', { color: 'gray', italic: true, dim: true })
```

### group

groups a list of already-styled lines under a labeled header.
```ts
style.group('Deploy', [
  style.info('Building'),
  style.success('Done'),
])
// ▶ Deploy
//   ℹ Building
//   ✔ Done
```

### columns

renders two strings side by side, ANSI-aware. falls back to two lines in non-interactive environments.
```ts
columns('Left content', 'Right content')
columns(style.success('Build passed'), style.info('Tests: 22/22'))
columns(badge('production', 'green'), badge('v2.0.0', 'cyan'))

columns(left, right, { width: 100, gap: 6 })
```

### truncate

truncates a string to a maximum visible length and appends `…`. uses `strip()` internally so ANSI codes don't count toward the length.
```ts
truncate('very long string that overflows', 20)
// => 'very long string tha…'

truncate(style.success('Build complete'), 10)
// => truncated styled string with ANSI codes preserved
```

### spinner

animated terminal spinner. returns a handle with `succeed`, `fail`, and `update`. no external dependencies. automatically degrades to static line-by-line output when not in a TTY.
```ts
const s = spin('Deploying...')

s.update('Still working...')   // update message while spinning
s.update('Almost done...')

s.succeed('Deploy complete')   // stops spinner, shows style.success
s.fail('Deploy failed')        // stops spinner, shows style.error

s.succeed()                    // reuse current message
```

### strip

removes all ANSI escape codes from a string. useful for writing styled output to log files or comparing strings in tests.
```ts
const raw = strip(style.success('Build complete'))
// => '✔ Build complete'

fs.appendFileSync('app.log', strip(style.info('Server started')) + '\n')
```

### themes

globally override colors and icons for all `style.*` methods. all keys are optional — unspecified entries fall back to defaults. call `resetTheme()` to restore factory defaults.
```ts
import { setTheme, resetTheme } from 'termpainter'

setTheme({
  success: { color: 'cyan',    icon: '✓' },
  error:   { color: 'magenta', icon: '✕' },
  warn:    { color: 'yellow' },
  info:    { color: 'blue',    icon: '→' },
  debug:   { color: 'gray',    dim: true },
  muted:   { color: 'gray',    dim: true },
  highlight: { color: 'green' },
})

style.success('done')    // ✓ done  (cyan, custom icon)
style.error('oops')      // ✕ oops  (magenta)

resetTheme()             // back to defaults
```

### test mode

makes output deterministic for snapshot testing. `style.timestamp()` omits the time prefix, `spin()` renders statically without animation, `isInteractive()` returns `false`.
```ts
import { setTestMode } from 'termpainter'

setTestMode(true)

style.timestamp('Server started')   // => 'Server started'  (no [HH:MM:SS])
const s = spin('Loading...')        // prints once, no animation
s.succeed('Done')                   // prints style.success line

setTestMode(false)                  // restore normal behavior
```

### silent mode

suppress all output globally. every function returns an empty string and produces no side effects. useful for tests, CI, and benchmarks.
```ts
setSilent(true)

style.success('done')   // ''
badge('v1.0.0', 'cyan') // ''
box('hello')            // ''

setSilent(false)        // restore normal output
```

### custom icons

override the default icons for any or all style methods. unspecified keys fall back to defaults.
```ts
setIcons({ success: '✓', error: '✕' })

style.success('done')   // ✓ done
style.warn('careful')   // ⚠ careful  (default unchanged)
```

available keys: `success`, `error`, `warn`, `info`, `debug`

### isInteractive

returns `true` if stdout is an interactive TTY. always `false` in test mode.
```ts
if (isInteractive()) {
  const s = spin('Loading...')
} else {
  console.log(style.muted('Loading...'))
}
```

---

## color support

termpainter automatically strips all ANSI codes when `NO_COLOR` is set, when running in CI, or when output is piped. your logs won't be full of broken escape sequences.
```ts
isColorEnabled() // true in an interactive terminal, false everywhere else
```

---

## api

| function | description |
|---|---|
| `style.error(msg, meta?)` | red, prepends ✖ |
| `style.success(msg, meta?)` | green, prepends ✔ |
| `style.warn(msg, meta?)` | yellow, prepends ⚠ |
| `style.info(msg, meta?)` | blue, prepends ℹ |
| `style.debug(msg, meta?)` | gray+dim, 🔍 prefix, only when `DEBUG` is set |
| `style.muted(msg)` | gray, dimmed |
| `style.bold(msg)` | bold white |
| `style.highlight(msg)` | cyan |
| `style.divider(color?)` | 40 char horizontal rule, default gray |
| `style.table(data, color?)` | aligned key-value table, keys in cyan |
| `style.timestamp(msg, color?)` | prepends [HH:MM:SS], default gray; omitted in test mode |
| `style.group(label, lines[])` | ▶ label in cyan, lines indented 2 spaces |
| `style.list(items, options?)` | bulleted list, options: bullet, color, indent |
| `badge(text, color?)` | [text] in chosen color, default white |
| `box(text, color\|options?)` | unicode border box; options: color, title |
| `columns(left, right, options?)` | two columns side by side; options: width, gap |
| `truncate(str, maxLength)` | truncate to maxLength visible chars, append … |
| `spin(msg)` | animated spinner; returns `{ succeed, fail, update }` |
| `strip(str)` | removes all ANSI escape codes |
| `setTheme(theme)` | override colors and icons globally |
| `resetTheme()` | restore default theme |
| `setIcons(icons)` | override icons for error, success, warn, info, debug |
| `setSilent(mode)` | suppress all output globally when `true` |
| `setTestMode(mode)` | deterministic output for snapshot testing |
| `isInteractive()` | returns `true` if stdout is a TTY (false in test mode) |
| `paint(text, options?)` | raw ANSI composer |
| `isColorEnabled()` | returns true if colors are active |

---

## license

MIT © Abdullah Hashmi
