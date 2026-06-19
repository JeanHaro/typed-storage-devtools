export function applyFilter(
    searchInput, 
    allData, 
    content, 
    renderTable
) {
    const query = searchInput.value.toLowerCase();
    
    if (!query) {
        renderTable(content, allData);
        return;
    }

    const filtered = Object.keys(allData)
        .filter(key => key.toLowerCase().includes(query))
        .reduce((acc, key) => {
            acc[key] = allData[key];
            return acc;
        }, {});

    renderTable(content, filtered);
}