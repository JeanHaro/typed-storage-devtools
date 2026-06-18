# typed-storage DevTools

Chrome DevTools extension for [@jeanharo98/typed-storage](https://github.com/JeanHaro/typed-storage) — inspect your storage signals in real time.

![typed-storage DevTools panel showing app:theme, app:language, app:fontSize keys]

---

## ✨ Features

- **Real-time inspection** — see all your typed-storage keys and values
- **Filtered view** — only shows keys registered by typed-storage, not the entire localStorage
- **Type coloring** — strings, numbers, booleans and objects have different colors
- **Auto-refresh** — updates automatically when you navigate to a new page
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

The extension automatically detects pages that use `@jeanharo98/typed-storage`. No extra configuration needed — just use typed-storage normally:

```typescript
// Angular
import { TypedStorageService } from '@jeanharo98/typed-storage-angular';

@Service()
export class StorageService {
    storage = new TypedStorageService().initialize({
        theme: 'dark' as 'dark' | 'light',
        language: 'es' as 'es' | 'en',
        fontSize: 16,
    }, { prefix: 'app' });
}
```

```typescript
// React
import { useStorage } from '@jeanharo98/typed-storage-react';

function App() {
    const storage = useStorage({
        theme: 'dark' as 'dark' | 'light',
        language: 'es' as 'es' | 'en',
    }, { prefix: 'app' });
}
```

```typescript
// Vanilla TypeScript
import { createStorage } from '@jeanharo98/typed-storage';

const storage = createStorage({
    theme: 'dark' as 'dark' | 'light',
    language: 'es',
}, { prefix: 'app' });
```

### What you'll see in the panel

```
┌─────────────────────────────────────────────────┐
│ typed-storage DevTools              ↺ Refresh   │
├─────────────────────────────────────────────────┤
│ http://localhost:4200/                           │
├──────────────────┬──────────────────────────────┤
│ Key              │ Value                        │
├──────────────────┼──────────────────────────────┤
│ app:theme        │ dark                         │
│ app:language     │ es                           │
│ app:fontSize     │ 16                           │
│ app:sidebarOpen  │ true                         │
└──────────────────┴──────────────────────────────┘
```

---

## ⚙️ How it works

### Registry system

When `createStorage()` is called, typed-storage automatically registers the prefix in a special localStorage key:

```
localStorage['__typed-storage__'] = '["app"]'
```

The DevTools extension reads this registry to know which keys belong to typed-storage and filters the display accordingly — you only see your app's storage, not other libraries' data.

### inspectedWindow.eval

The extension uses `chrome.devtools.inspectedWindow.eval()` to read localStorage directly from the inspected page — no content scripts needed. This is the most reliable and performant approach for a DevTools panel.

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
├── manifest.json    ← Extension configuration
├── devtools.html    ← DevTools page entry point
├── devtools.js      ← Creates the panel in DevTools
├── panel.html       ← Panel UI
├── panel.js         ← Panel logic — reads localStorage and renders table
└── icons/
    ├── storage16.png
    ├── storage48.png
    └── storage128.png
```

---

## 🗺️ Roadmap

```
v0.1.0 — Current:
  ✅ Read and display typed-storage keys
  ✅ Filter by registered prefixes
  ✅ Type coloring
  ✅ Auto-refresh on navigation
  ✅ Manual refresh button

Coming soon:
  ⬜ Edit values directly from the panel
  ⬜ Delete individual keys from the panel
  ⬜ History of changes
  ⬜ Search/filter by key name
  ⬜ Chrome Web Store publication
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