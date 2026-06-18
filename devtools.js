chrome.devtools.panels.create(
    'typed-storage',  // nombre del tab
    '',                    // icono (vacío por ahora)
    'panel.html',          // la UI del panel
    function(panel) {
        console.log('typed-storage DevTools panel created');
    }
);