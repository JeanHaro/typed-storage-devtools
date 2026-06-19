export function deleteKey(
    key, 
    allData, 
    addHistoryEntry, 
    requestStorageData
) {
    const oldValue = allData[key];
    addHistoryEntry(key, oldValue, '(deleted)');

    chrome.devtools.inspectedWindow.eval(
        `localStorage.removeItem(${JSON.stringify(key)})`,
        () => requestStorageData()
    );
}