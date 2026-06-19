export function requestStorageData ( 
    urlBar, 
    onDataLoaded 
) {
    chrome.devtools.inspectedWindow.eval(
        `
        (function() {
            const data = {};
            const registryKey = '__typed-storage__';
            const schemaKey = '__typed-storage-schema__';
            const registry = localStorage.getItem(registryKey);
            const schemaRegistry = localStorage.getItem(schemaKey);
            const prefixes = registry ? JSON.parse(registry) : [];
            const schemas = schemaRegistry ? JSON.parse(schemaRegistry) : {};
            
            if (prefixes.length > 0) {
                for (let i = 0; i < localStorage.length; i++) {
                    const key = localStorage.key(i);
                    if (key && key !== registryKey && key !== schemaKey) {
                        const isTypedStorage = prefixes.some(
                            p => key.startsWith(p + ':') || key.startsWith(p + '__')
                        );
                        if (isTypedStorage) {
                            try { data[key] = JSON.parse(localStorage.getItem(key)); }
                            catch { data[key] = localStorage.getItem(key); }
                        }
                    }
                }
            }
            return JSON.stringify({ data, url: window.location.href, schemas });
        })()
        `,
        (result) => {
            if (result) {
                const parsed = JSON.parse(result);
                urlBar.textContent = parsed.url;
                window.currentSchemas = parsed.schemas;
                onDataLoaded(parsed.data); // ← callback en lugar de variable global
            }
        }
    );
}