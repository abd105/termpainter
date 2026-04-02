# termpainter

tired of staring at walls of plain `console.log`? termpainter gives your terminal output actual structure. colors, boxes, badges, tables, timestamps. zero dependencies, works in Node 18+ and Bun.
```sh
npm install termpainter
```

<img src="https://raw.githubusercontent.com/abd105/termpainter/main/assets/demo.png" width="450" alt="termpainter demo" />

---

## usage
```ts
import { style, badge, box, paint } from 'termpainter'
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

draws a clean unicode border around anything. multiline works fine.
```ts
box('Deploy complete\n3 services restarted\nAll checks passed', 'green')
box('Critical error\nProcess exited with code 1', 'red')
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

low level, for when you need something the presets dont cover.
```ts
paint('custom text', { color: 'magenta', bold: true })
paint('highlighted', { color: 'white', bg: 'blue' })
paint('soft note', { color: 'gray', italic: true, dim: true })
```

---

## color support

termpainter automatically strips all ANSI codes when `NO_COLOR` is set, when running in CI, or when output is piped. your logs wont be full of broken escape sequences.
```ts
import { isColorEnabled } from 'termpainter'

isColorEnabled() // true in an interactive terminal, false everywhere else
```

---

## api

| function | description |
|---|---|
| `style.error(msg)` | red, prepends ✖ |
| `style.success(msg)` | green, prepends ✔ |
| `style.warn(msg)` | yellow, prepends ⚠ |
| `style.info(msg)` | blue, prepends ℹ |
| `style.muted(msg)` | gray, dimmed |
| `style.bold(msg)` | bold white |
| `style.highlight(msg)` | cyan |
| `style.divider(color?)` | 40 char horizontal rule, default gray |
| `style.table(data, color?)` | aligned key-value table, keys in cyan |
| `style.timestamp(msg, color?)` | prepends [HH:MM:SS], default gray |
| `badge(text, color?)` | [text] in chosen color, default white |
| `box(text, color?)` | unicode border box, multiline aware |
| `paint(text, options?)` | raw ANSI composer |
| `isColorEnabled()` | returns true if colors are active |

---

## license

MIT © Abdullah Hashmi