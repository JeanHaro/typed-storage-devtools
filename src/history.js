export function addHistoryEntry (
    key, 
    oldValue, 
    newValue
) {
    chrome.storage.local.get(['history'], (result) => {
        const history = result.history || [];
        history.push({
            key,
            oldValue: String(oldValue),
            newValue: String(newValue),
            timestamp: Date.now()
        });
        chrome.storage.local.set({ history: history.slice(-100) });
    });
}

export function renderHistory ( historyContent ) {
    chrome.storage.local.get(['history'], (result) => {
        const history = (result.history || []).slice().reverse();

        if (history.length === 0) {
            historyContent.innerHTML = '<p id="empty">No changes recorded yet.</p>';
            return;
        }

        historyContent.innerHTML = history.map(entry => {
            const time = new Date(entry.timestamp).toLocaleTimeString();
            return `
                <div class="history-entry">
                    <span class="h-time">${time}</span>
                    <span class="h-key">${entry.key}</span><br>
                    <span class="h-change">${entry.oldValue}</span>
                    <span class="h-arrow">→</span>
                    <span class="h-change">${entry.newValue}</span>
                </div>
            `;
        }).join('');
    });
}