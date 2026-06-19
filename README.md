# typed-storage DevTools

Chrome DevTools extension for [@jeanharo98/typed-storage](https://github.com/JeanHaro/typed-storage) — inspect, edit, and track changes to your storage signals in real time.

---

## ✨ Features

- **Real-time inspection** — see all your typed-storage keys and values
- **Filtered view** — only shows keys registered by typed-storage, not the entire localStorage
- **Type coloring** — strings, numbers, booleans and objects have different colors
- **Auto-refresh** — updates automatically when you navigate to a new page
- **Edit values directly** — click any value to edit it inline
- **Type validation** — prevents setting a boolean/number key to an invalid value
- **Delete keys** — remove individual keys with one click
- **Search/filter** — filter the table by key name
- **Change history** — track every edit and deletion made through the panel
- **Manual refresh** — refresh button to force an update
- **URL bar** — shows which page you're inspecting

---

## 📦 Installation

> The extension is not yet published on the Chrome Web Store. Install it manually in developer mode.

### Step 1 — Download the extension

```bash
git clone https://github.com/JeanHaro/typed-storage-devtools.git
```

Or download the ZIP from GitHub and extract it.

### Step 2 — Load in Chrome

1. Open Chrome and go to `chrome://extensions/`
2. Enable **Developer mode** (toggle in the top right)
3. Click **"Load unpacked"**
4. Select the `typed-storage-devtools` folder

### Step 3 — Open DevTools

1. Open any page that uses `@jeanharo98/typed-storage`
2. Press `F12` to open DevTools
3. Look for the **"typed-storage"** tab in the DevTools panel

---

## 🚀 Usage

### Setup in your project

The extension automatically detects pages that use `@jeanharo98/typed-storage` (version 0.1.9+, which registers a type schema). No extra configuration needed:

```typescript
import { createStorage } from '@jeanharo98/typed-storage';

const storage = createStorage({
    theme: 'dark' as 'dark' | 'light',
    fontSize: 16,
    sidebarOpen: true,
}, { prefix: 'app' });
```

### What you'll see in the panel

```
┌──────────────────────────────────────────────────────────┐
│ typed-storage DevTools  [Filtrar...] 📜 History  ↺ Refresh│
├──────────────────────────────────────────────────────────┤
│ http://localhost:4200/                                    │
├──────────────────┬──────────────────────┬────────────────┤
│ Key              │ Value                │                │
├──────────────────┼──────────────────────┼────────────────┤
│ app:theme        │ dark                 │  🗑️            │
│ app:fontSize     │ 16                   │  🗑️            │
│ app:sidebarOpen  │ true                 │  🗑️            │
└──────────────────┴──────────────────────┴────────────────┘
```

### Editing values

Click any value cell to make it editable. Press `Enter` or click outside to save, or `Escape` to cancel.

```
Click on "dark" → becomes an input field → type "light" → Enter
The page's Signal/state updates automatically without reloading
(requires sync: true in your createStorage options for live updates)
```

### Type validation

If a key was registered as `boolean` or `number` (inferred automatically from your schema), the panel blocks invalid edits:

```
Trying to set app:sidebarOpen to "trues"
→ Alert: "app:sidebarOpen" debe ser "true" o "false" (es de tipo boolean)
→ Edit is rejected, value stays unchanged
```

> Note: string-typed keys with literal unions (`'dark' | 'light'`) can't be validated this strictly — TypeScript erases that information at compile time. Only the primitive type (`string`, `number`, `boolean`, `object`) is available at runtime.

### Search/filter

Type in the filter box to narrow down the table by key name — useful when you have many registered prefixes or keys.

### Change history

Click **"📜 History"** to see a log of every edit and deletion made through the panel, with timestamps and old/new values. History persists across DevTools sessions (stored in the extension's own storage, not in the page's localStorage) and keeps the last 100 entries.

> History only tracks changes made **through this panel** — not changes made by the app itself (`signal.set()` in your code) or via Chrome's native Application tab.

---

## ⚙️ How it works

### Registry system

When `createStorage()` is called, typed-storage automatically registers:

```
localStorage['__typed-storage__'] = '["app"]'
// which prefixes are active

localStorage['__typed-storage-schema__'] = '{"app":{"theme":"string","fontSize":"number","sidebarOpen":"boolean"}}'
// the primitive type of each key, used for validation
```

The DevTools extension reads both registries to filter the display to only typed-storage keys, and to validate edits against the expected type.

### inspectedWindow.eval

The extension uses `chrome.devtools.inspectedWindow.eval()` to read and write localStorage directly on the inspected page — no content scripts needed.

### Live sync after editing

When you edit a value, the extension dispatches a `StorageEvent` manually:

```javascript
window.dispatchEvent(new StorageEvent('storage', { key, newValue, storageArea: localStorage }));
```

This makes the change visible immediately in apps using `sync: true`, without needing a page reload.

### chrome.storage.local for history

The change history is stored using `chrome.storage.local` — the extension's own private storage, completely separate from the page's localStorage. This means it doesn't pollute your app's data and persists independently of page reloads.

---

## 🎨 Value colors

| Type | Color | Example |
|------|-------|---------|
| String | Orange | `dark` |
| Number | Green | `16` |
| Boolean | Blue | `true` |
| Object | Yellow | `{"fontSize":16}` |
| null | Gray | `null` |

---

## 🔧 Development

To modify the extension:

1. Edit the files directly — no build step needed
2. Go to `chrome://extensions/`
3. Click the reload button ↺ on the typed-storage DevTools card
4. Reopen DevTools on your page

### File structure

```
typed-storage-devtools/
├── manifest.json    ← Extension configuration (storage permission required)
├── devtools.html    ← DevTools page entry point
├── devtools.js       ← Creates the panel in DevTools
├── panel.html        ← Panel UI (table, search, history)
├── panel.js          ← Panel logic — reads, edits, validates, tracks history
└── icons/
    ├── storage16.png
    ├── storage48.png
    └── storage128.png
```

---

## 🗺️ Roadmap

```
v0.2.0 — Current:
  ✅ Read and display typed-storage keys
  ✅ Filter by registered prefixes
  ✅ Type coloring
  ✅ Auto-refresh on navigation
  ✅ Edit values inline
  ✅ Delete individual keys
  ✅ Type validation (boolean, number)
  ✅ Search/filter by key
  ✅ Change history

Coming later (when there's real user demand):
  ⬜ Chrome Web Store publication
  ⬜ Export/import storage snapshots
  ⬜ Diff view between history entries
```

---

## 🔗 Related

| Package | Description |
|---------|-------------|
| [@jeanharo98/typed-storage](https://github.com/JeanHaro/typed-storage) | Core library |
| [@jeanharo98/typed-storage-angular](https://github.com/JeanHaro/typed-storage-angular) | Angular wrapper |
| [@jeanharo98/typed-storage-react](https://github.com/JeanHaro/typed-storage-react) | React wrapper |

---

## 📄 License

MIT