import { renderTable } from './render-table.js';
import { makeEditable, updateKey } from './edit-value.js';
import { deleteKey } from './delete-key.js';
import { addHistoryEntry, renderHistory } from './history.js';
import { applyFilter } from './search.js';
import { requestStorageData } from './storage-reader.js';

// Referencias al DOM — viven aquí porque panel.js es el orquestador
const content = document.getElementById('content');
const urlBar = document.getElementById('url-bar');
const refreshBtn = document.getElementById('refresh-btn');
const historyBtn = document.getElementById('history-btn');
const historyPanel = document.getElementById('history-panel');
const historyContent = document.getElementById('history-content');
const searchInput = document.getElementById('search-input');

let historyVisible = false;
let allData = {}; // el estado "vivo" de los datos cargados

// --- Wrappers que conectan los módulos con el estado de panel.js ---

function refresh() {
    requestStorageData(urlBar, (data) => {
        allData = data;
        applyFilter(searchInput, allData, content, renderTableWithDelete);
    });
}

function renderTableWithDelete(contentEl, data) {
    renderTable(contentEl, data, handleDeleteKey);
}

function handleDeleteKey(key) {
    deleteKey(key, allData, addHistoryEntry, refresh);
}

function handleUpdateKey(key, newValue) {
    updateKey(key, newValue, allData, addHistoryEntry, refresh);
}

function handleMakeEditable(td) {
    makeEditable(td, handleUpdateKey, refresh);
}

// --- Event listeners ---

historyBtn.addEventListener('click', () => {
    historyVisible = !historyVisible;
    historyPanel.style.display = historyVisible ? 'block' : 'none';
    historyBtn.classList.toggle('active', historyVisible);
    if (historyVisible) renderHistory(historyContent);
});

searchInput.addEventListener('input', () => {
    applyFilter(searchInput, allData, content, renderTableWithDelete);
});

refreshBtn.addEventListener('click', refresh);

content.addEventListener('click', (e) => {
    const td = e.target.closest('td.value');
    if (td && !td.querySelector('input')) {
        handleMakeEditable(td);
    }
});

chrome.devtools.network.onNavigated.addListener(refresh);

// Carga inicial
refresh();