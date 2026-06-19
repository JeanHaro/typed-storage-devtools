export function makeEditable(
    td, 
    updateKey, 
    requestStorageData
) {
    const key = td.getAttribute('data-key');
    const rawValue = decodeURIComponent(td.getAttribute('data-raw'));

    const input = document.createElement('input');
    input.value = rawValue;
    input.style.width = '100%';
    input.style.background = '#1e1e1e';
    input.style.color = '#ce9178';
    input.style.border = '1px solid #0e639c';

    td.innerHTML = '';
    td.appendChild(input);
    input.focus();

    function save() {
        updateKey(key, input.value);
    }

    input.addEventListener('blur', save);
    input.addEventListener('keydown', (e) => {
        if (e.key === 'Enter') save();
        if (e.key === 'Escape') requestStorageData();
    });
}

export function updateKey(
    key, 
    newValue, 
    allData, 
    addHistoryEntry, 
    requestStorageData
) {
    const expectedType = getExpectedType(key);

    if (expectedType === 'boolean' && newValue !== 'true' && newValue !== 'false') {
        alert(`"${key}" debe ser "true" o "false" (es de tipo boolean)`);
        requestStorageData();
        return;
    }

    if (expectedType === 'number' && isNaN(Number(newValue))) {
        alert(`"${key}" debe ser un número (es de tipo number)`);
        requestStorageData();
        return;
    }

    const oldValue = allData[key];
    addHistoryEntry(key, oldValue, newValue);

    chrome.devtools.inspectedWindow.eval(
        `
        localStorage.setItem(${JSON.stringify(key)}, ${JSON.stringify(newValue)});
        window.dispatchEvent(new StorageEvent('storage', {
            key: ${JSON.stringify(key)},
            newValue: ${JSON.stringify(newValue)},
            storageArea: localStorage
        }));
        `,
        () => requestStorageData()
    );
}

export function getExpectedType ( fullKey ) {
    if (!window.currentSchemas) return null;

    for (const prefix of Object.keys(window.currentSchemas)) {
        const propName = fullKey.startsWith(prefix + ':') 
            ? fullKey.slice(prefix.length + 1) 
            : null;

        if (propName && window.currentSchemas[prefix][propName]) {
            return window.currentSchemas[prefix][propName];
        }
    }
    return null;
}