export function getValueClass ( value ) {
    if (value === null) return 'null';
    if (typeof value === 'number') return 'number';
    if (typeof value === 'boolean') return 'boolean';
    if (typeof value === 'object') return 'object';
    return '';
}

export function formatValue ( value ) {
    if (value === null) return 'null';
    if (typeof value === 'object') return JSON.stringify(value);
    return String(value);
}

export function renderTable ( content, data, onDeleteClick ) {
    const keys = Object.keys(data);

    if (keys.length === 0) {
        content.innerHTML = '<p id="empty">No localStorage data found on this page.</p>';
        return;
    }

    const rows = keys.map(key => {
        const value = data[key];
        const valueClass = getValueClass(value);
        const rawValue = typeof value === 'object' ? JSON.stringify(value) : String(value);
        return `
            <tr>
                <td class="key">${key}</td>
                <td class="value ${valueClass}" data-key="${key}" data-raw="${encodeURIComponent(rawValue)}">${formatValue(value)}</td>
                <td><button class="delete-btn" data-key="${key}">🗑️</button></td>
            </tr>
        `;
    }).join('');

    content.innerHTML = `
        <table>
            <thead><tr><th>Key</th><th>Value</th><th></th></tr></thead>
            <tbody>${rows}</tbody>
        </table>
    `;

    document.querySelectorAll('.delete-btn').forEach(btn => {
        btn.addEventListener('click', () => onDeleteClick(btn.getAttribute('data-key')));
    });
}