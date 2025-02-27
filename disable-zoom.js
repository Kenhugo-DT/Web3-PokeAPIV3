// disable-zoom.js - Deaktiverer nettleser-zoom for å bevare elementposisjoner
(function() {
  // Kjør når dokumentet er lastet
  document.addEventListener('DOMContentLoaded', function() {
      console.log('Zoom-deaktivering initialisert');
      
      // Deaktiver zoom ved hjelp av musehjulet (wheel event)
      document.addEventListener('wheel', function(e) {
          // Sjekk om Ctrl-tasten er trykket ned (typisk for zoom)
          if (e.ctrlKey) {
              // Hindre standard oppførsel (zoom)
              e.preventDefault();
          }
      }, { passive: false }); // 'passive: false' er viktig for at preventDefault skal fungere
      
      // Deaktiver pinch-zoom på berøringsenheter
      document.addEventListener('touchmove', function(e) {
          // Sjekk om det er mer enn én finger (typisk for pinch-zoom)
          if (e.touches.length > 1) {
              // Hindre standard oppførsel (zoom)
              e.preventDefault();
          }
      }, { passive: false });
      
      // Deaktiver dobbeltklikk-zoom
      document.addEventListener('dblclick', function(e) {
          e.preventDefault();
      }, { passive: false });
      
      // Deaktiver tastatur-zoom (Ctrl+Plus, Ctrl+Minus)
      document.addEventListener('keydown', function(e) {
          if (e.ctrlKey && (e.key === '+' || e.key === '-' || e.key === '=')) {
              e.preventDefault();
          }
      });
      
      console.log('Zoom-deaktivering fullført');
  });
})();
