# termpainter

Build clean, structured CLI output with zero dependencies.

termpainter gives you semantic styles, boxes, tables, spinners, layouts and more. works in Node 18+ and Bun. full TypeScript support.
```sh
npm install termpainter
```

<img src="https://raw.githubusercontent.com/abd105/termpainter/main/assets/demo.png" width="450" alt="termpainter demo" />

---

## real world examples

### deploy pipeline
```ts
import { style, box, columns } from 'termpainter'

console.log(box(
  style.group('Deploy', [
    style.success('Dependencies installed'),
    style.success('TypeScript compiled'),
    style.success('22/22 tests passed'),
    style.success('Bundle created (10.5 kB)'),
  ]),
  { color: 'green', title: 'CI/CD' }
))

console.log(columns(
  style.group('Services', [
    style.success('API'),
    style.success('Auth'),
    style.error('Database'),
    style.warn('Cache'),
  ]),
  style.group('Stats', [
    style.info('Uptime: 3d 2h'),
    style.info('Memory: 512 MB'),
    style.warn('CPU: 87%'),
    style.info('Port: 3000'),
  ])
))
```

<img src="https://raw.githubusercontent.com/abd105/termpainter/main/assets/example-deploy.png" width="500" alt="deploy pipeline example" />

### structured logging
```ts
import { style } from 'termpainter'

style.success('User created', { id: 847, role: 'admin', plan: 'pro' })
style.error('Request failed', { status: 503, path: '/api/checkout', retries: 3 })
style.warn('Rate limit approaching', { limit: 1000, current: 847, reset: '60s' })
style.info('Deploy started', { env: 'production', version: 'v2.0.0', region: 'us-east-1' })
```

<img src="https://raw.githubusercontent.com/abd105/termpainter/main/assets/example-logs.png" width="400" alt="structured logging example" />

### CLI status dashboard
```ts
import { style, badge, columns } from 'termpainter'

console.log(columns(
  style.table({ Status: 'Running', Uptime: '3d 2h', Memory: '512 MB', CPU: '12%' }),
  style.table({ Region: 'us-east-1', Version: 'v2.0.0', Node: '22.x', Port: '3000' })
))

console.log(
  badge('production', 'green') + '  ' +
  badge('v2.0.0', 'cyan') + '  ' +
  badge('0 deps', 'magenta') + '  ' +
  badge('TypeScript', 'blue')
)
```

<img src="https://raw.githubusercontent.com/abd105/termpainter/main/assets/example-dashboard.png" width="500" alt="status dashboard example" />

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

any `style.*` method accepts an optional second argument. a plain object whose keys and values are printed below the message, indented with keys in cyan.
```ts
style.info('User created', { id: 123, role: 'admin' })
// ℹ User created
//   id    123
//   role  admin
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
badge('v2.0.0', 'cyan')
badge('PASS', 'green')
badge('FAIL', 'red')
badge('production', 'green')
badge('offline', 'red')
```

### boxes

draws a clean unicode border around anything. multiline works fine. fully composable. supports an optional title in the top border.
```ts
box('Deploy complete\n3 services restarted\nAll checks passed', 'green')
box('Critical error\nProcess exited with code 1', 'red')
box(style.success('done'))   // styled content inside a box

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

truncates a string to a maximum visible length and appends `...`. uses `strip()` internally so ANSI codes don't count toward the length.
```ts
truncate('very long string that overflows', 20)
// => 'very long string tha...'

truncate(style.success('Build complete'), 10)
```

### spinner

animated terminal spinner. returns a handle with `succeed`, `fail`, and `update`. no external dependencies. automatically degrades to static output when not in a TTY.
```ts
const s = spin('Deploying...')

s.update('Still working...')
s.update('Almost done...')

s.succeed('Deploy complete')
s.fail('Deploy failed')
```

### strip

removes all ANSI escape codes from a string. useful for writing styled output to log files or comparing strings in tests.
```ts
const raw = strip(style.success('Build complete'))
// => '✔ Build complete'

fs.appendFileSync('app.log', strip(style.info('Server started')) + '\n')
```

### paint

low level, for when you need something the presets don't cover.
```ts
paint('custom text', { color: 'magenta', bold: true })
paint('highlighted', { color: 'white', bg: 'blue' })
paint('soft note', { color: 'gray', italic: true, dim: true })
```

### themes

globally override colors and icons for all `style.*` methods. all keys are optional. call `resetTheme()` to restore defaults.
```ts
setTheme({
  success: { color: 'cyan',    icon: '✓' },
  error:   { color: 'magenta', icon: '✕' },
  warn:    { color: 'yellow' },
  info:    { color: 'blue',    icon: '>' },
})

style.success('done')   // ✓ done (cyan, custom icon)
style.error('oops')     // ✕ oops (magenta)

resetTheme()            // back to defaults
```

### custom icons

override the default icons for any or all style methods. unspecified keys fall back to defaults.
```ts
setIcons({ success: '✓', error: '✕' })

style.success('done')    // ✓ done
style.warn('careful')    // ⚠ careful (default unchanged)
```

available keys: `success`, `error`, `warn`, `info`, `debug`

### silent mode

suppress all output globally. every function returns an empty string and produces no side effects. useful for tests, CI, and benchmarks.
```ts
setSilent(true)

style.success('done')    // ''
badge('v2.0.0', 'cyan')  // ''
box('hello')             // ''

setSilent(false)         // restore normal output
```

### test mode

makes output deterministic for snapshot testing. `style.timestamp()` omits the time prefix, `spin()` renders statically, `isInteractive()` returns `false`.
```ts
setTestMode(true)

style.timestamp('Server started')   // 'Server started' (no [HH:MM:SS])
const s = spin('Loading...')        // prints once, no animation
s.succeed('Done')

setTestMode(false)
```

### isInteractive

returns `true` if stdout is a TTY. always `false` in test mode.
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
| `style.debug(msg, meta?)` | gray+dim, 🔍 prefix, only when DEBUG is set |
| `style.muted(msg)` | gray, dimmed |
| `style.bold(msg)` | bold white |
| `style.highlight(msg)` | cyan |
| `style.divider(color?)` | 40 char horizontal rule, default gray |
| `style.table(data, color?)` | aligned key-value table, keys in cyan |
| `style.timestamp(msg, color?)` | prepends [HH:MM:SS], omitted in test mode |
| `style.group(label, lines[])` | labeled indented section |
| `style.list(items, options?)` | bulleted list, options: bullet, color, indent |
| `badge(text, color?)` | [text] in chosen color, default white |
| `box(text, color or options?)` | unicode border box with optional title |
| `columns(left, right, options?)` | side by side output, options: width, gap |
| `truncate(str, maxLength)` | truncate preserving ANSI codes |
| `spin(msg)` | animated spinner, returns succeed, fail, update |
| `strip(str)` | removes all ANSI escape codes |
| `paint(text, options?)` | raw ANSI composer |
| `setTheme(theme)` | override colors and icons globally |
| `resetTheme()` | restore default theme |
| `setIcons(icons)` | override icons for success, error, warn, info, debug |
| `setSilent(bool)` | suppress all output globally |
| `setTestMode(bool)` | deterministic output for snapshot testing |
| `isColorEnabled()` | true if colors are active |
| `isInteractive()` | true if stdout is a TTY, false in test mode |

---

## license

MIT © Abdullah Hashmi