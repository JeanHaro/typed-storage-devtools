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

export function renderHistory(historyContent) {
    chrome.storage.local.get(['history'], (result) => {
        const history = (result.history || []).slice().reverse();

        if (history.length === 0) {
            historyContent.innerHTML = '<p id="empty">No changes recorded yet.</p>';
            return;
        }

        historyContent.innerHTML = history.map((entry, index) => {
            const date = new Date(entry.timestamp);
            const dateStr = date.toLocaleDateString();
            const timeStr = date.toLocaleTimeString();
            
            return `
                <div class="history-entry">
                    <div class="h-header">
                        <span class="h-key">${entry.key}</span>
                        <span>
                            <span class="h-time">${dateStr} ${timeStr}</span>
                            <button class="history-delete-btn" data-index="${index}">✕</button>
                        </span>
                    </div>
                    <span class="h-change">${entry.oldValue}</span>
                    <span class="h-arrow">→</span>
                    <span class="h-change">${entry.newValue}</span>
                </div>
            `;
        }).join('');

        document.querySelectorAll('.history-delete-btn').forEach(btn => {
            btn.addEventListener('click', () => {
                const index = parseInt(btn.getAttribute('data-index'));
                deleteHistoryEntry(history, index, historyContent);
            });
        });
    });
}

function deleteHistoryEntry(reversedHistory, indexInReversed, historyContent) {
    // El historial mostrado está invertido (más reciente primero)
    // hay que convertir el índice de vuelta al orden original
    chrome.storage.local.get(['history'], (result) => {
        const history = result.history || [];
        const realIndex = history.length - 1 - indexInReversed;
        history.splice(realIndex, 1);
        chrome.storage.local.set({ history }, () => renderHistory(historyContent));
    });
}

export function clearHistory(historyContent) {
    chrome.storage.local.set({ history: [] }, () => renderHistory(historyContent));
}