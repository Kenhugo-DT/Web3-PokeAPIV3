// Når dokumentet er lastet
document.addEventListener('DOMContentLoaded', function() {
  console.log('Zoom-håndtering initialisert');
  
  // Lytt til zoom-endringer ved å sjekke window.innerWidth
  let lastWidth = window.innerWidth;
  let lastHeight = window.innerHeight;
  
  // Startposisjon for kortet (du må justere disse verdiene)
  const cardInitialLeft = 50; // prosent
  const cardInitialTop = 50;  // prosent
  
  // Oppdater kort-posisjon basert på zoom
  function updateCardPosition() {
      const card = document.getElementById('pokemon-card');
      const cardContainer = document.querySelector('.card-container');
      
      if (card && cardContainer) {
          // Hold kortet i samme relative posisjon til hånden
          // ved å justere top, left og transform-origin
          cardContainer.style.transformOrigin = 'center';
      }
  }
  
  // Initial posisjonering
  updateCardPosition();
  
  // Lytt til vindusstørrelse-endringer (som kan skje ved zoom)
  window.addEventListener('resize', function() {
      const currentWidth = window.innerWidth;
      const currentHeight = window.innerHeight;
      
      // Hvis størrelsen endres betydelig, oppdater posisjonen
      if (Math.abs(currentWidth - lastWidth) > 10 || 
          Math.abs(currentHeight - lastHeight) > 10) {
          
          lastWidth = currentWidth;
          lastHeight = currentHeight;
          
          // Oppdater posisjoner basert på ny størrelse
          updateCardPosition();
      }
  });
  
  // Håndter direkte zoom-hendelser fra mus eller tastatur
  document.addEventListener('wheel', function(e) {
      if (e.ctrlKey) {
          // Dette er en zoom-handling
          setTimeout(updateCardPosition, 100);
      }
  }, {passive: false});
  
  // Håndter touch-basert zoom (for mobile enheter)
  let initialPinchDistance = 0;
  
  document.addEventListener('touchstart', function(e) {
      if (e.touches.length === 2) {
          initialPinchDistance = Math.hypot(
              e.touches[0].clientX - e.touches[1].clientX,
              e.touches[0].clientY - e.touches[1].clientY
          );
      }
  });
  
  document.addEventListener('touchmove', function(e) {
      if (e.touches.length === 2) {
          const currentPinchDistance = Math.hypot(
              e.touches[0].clientX - e.touches[1].clientX,
              e.touches[0].clientY - e.touches[1].clientY
          );
          
          if (Math.abs(currentPinchDistance - initialPinchDistance) > 10) {
              // Dette er en pinch-zoom-handling
              setTimeout(updateCardPosition, 100);
              initialPinchDistance = currentPinchDistance;
          }
      }
  });
  
  // Spesifikk funksjon for å justere kortet til hånden
  window.adjustCardToHand = function() {
      const card = document.getElementById('pokemon-card');
      const cardContainer = document.querySelector('.card-container');
      
      if (card && cardContainer) {
          // Her kan du finjustere posisjonen til kortet
          // basert på hvordan det ser ut i forhold til hånden
          
          // Eksempel på justering:
          card.style.marginTop = '50px'; // Juster denne verdien
          card.style.marginLeft = '0px'; // Juster denne verdien
      }
  };
  
  // Kjør justeringen når siden er lastet
  setTimeout(window.adjustCardToHand, 500);
});







