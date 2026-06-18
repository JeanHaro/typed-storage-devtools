const content = document.getElementById('content');
const urlBar = document.getElementById('url-bar');
const refreshBtn = document.getElementById('refresh-btn');

// Determina el color según el tipo de valor
function getValueClass(value) {
    if (value === null) return 'null';
    if (typeof value === 'number') return 'number';
    if (typeof value === 'boolean') return 'boolean';
    if (typeof value === 'object') return 'object';
    return '';
}

// Formatea el valor para mostrarlo
function formatValue(value) {
    if (value === null) return 'null';
    if (typeof value === 'object') return JSON.stringify(value);
    return String(value);
}

// Renderiza la tabla con los datos
function renderTable(data) {
    const keys = Object.keys(data);

    if (keys.length === 0) {
        content.innerHTML = '<p id="empty">No localStorage data found on this page.</p>';
        return;
    }

    const rows = keys.map(key => {
        const value = data[key];
        const valueClass = getValueClass(value);
        return `
            <tr>
                <td class="key">${key}</td>
                <td class="value ${valueClass}">${formatValue(value)}</td>
            </tr>
        `;
    }).join('');

    content.innerHTML = `
        <table>
            <thead>
                <tr>
                    <th>Key</th>
                    <th>Value</th>
                </tr>
            </thead>
            <tbody>${rows}</tbody>
        </table>
    `;
}

// Lee localStorage directamente desde la página inspeccionada
function requestStorageData() {
    chrome.devtools.inspectedWindow.eval(
        `
        (function() {
            const data = {};
            const registryKey = '__typed-storage__';
            const registry = localStorage.getItem(registryKey);
            const prefixes = registry ? JSON.parse(registry) : [];
            
            if (prefixes.length > 0) {
                for (let i = 0; i < localStorage.length; i++) {
                    const key = localStorage.key(i);
                    if (key && key !== registryKey) {
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
            return JSON.stringify({ data, url: window.location.href });
        })()
        `,
        (result) => {
            if (result) {
                const parsed = JSON.parse(result);
                urlBar.textContent = parsed.url;
                renderTable(parsed.data);
            }
        }
    );
}

// Botón refresh
refreshBtn.addEventListener('click', requestStorageData);

// Al cargar el panel
requestStorageData();

// Auto-refresh cuando la página navega
chrome.devtools.network.onNavigated.addListener(() => {
    requestStorageData();
});