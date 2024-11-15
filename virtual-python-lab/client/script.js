const burgerMenu = document.getElementById('burger-menu');
const menu = document.getElementById('menu');
const user = localStorage.getItem('user_id')

async function saveProgress(user_id, page, progress, is_completed) {
  const response = await fetch('/api/progress/save', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ user_id, page, progress, is_completed })
  });
  const result = await response.json();
  if (response.ok) {
    console.log(result.message);
  } else {
    console.log(user_id)
    console.error(result.error);
  }
}

async function loadProgress(user_id, page) {
  const response = await fetch(`/api/progress/${user_id}/${page}`);
  if (response.ok) {
    const data = await response.json();
    return data;
  } else {
    const error = await response.json();
    console.error(error.message);
  }
}

burgerMenu.addEventListener('click', () => {
  menu.classList.toggle('show');
});


document.addEventListener('DOMContentLoaded', () => {
  // Mengambil semua link yang memiliki hash (#) di href
  const links = document.querySelectorAll('a[href]');
  
  // Menghitung offset header
  const stickyHeader = document.querySelector('.sticky-header');

  const smoothScroll = (target, duration = 800) => {
      // Mengambil tinggi sticky header
      const headerOffset = stickyHeader ? stickyHeader.offsetHeight : 0;
      
      // mengambil target elemen
      const targetElement = document.querySelector(target);
      if (!targetElement) return; // Pastikan elemen ada di halaman saat ini
      
      // menghitung posisi awal dan akhir
      const startPosition = window.scrollY;
      const targetPosition = targetElement.getBoundingClientRect().top + startPosition - headerOffset;
      const distance = targetPosition - startPosition;
      let startTime = null;
      
      // Easing function untuk animasi yang lebih smooth
      const easeInOutQuad = (t) => {
          return t < 0.5 ? 2 * t * t : -1 + (4 - 2 * t) * t;
      };
      
      const animation = (currentTime) => {
          if (startTime === null) startTime = currentTime;
          const timeElapsed = currentTime - startTime;
          const progress = Math.min(timeElapsed / duration, 1);
          
          const easedProgress = easeInOutQuad(progress);
          const newPosition = startPosition + distance * easedProgress;
          
          window.scrollTo(0, newPosition);
          
          if (timeElapsed < duration) {
              requestAnimationFrame(animation);
          }
      };
      
      requestAnimationFrame(animation);
  };
  
  // Menambah event listener untuk seluruh hash
  links.forEach(link => {
      link.addEventListener('click', (e) => {
          const target = link.getAttribute('href');
          
          // Cek apakah hash ada di halaman yang sama
          if (target.startsWith('#')) {
              // Jika benar, gunakan smooth scroll
              e.preventDefault();
              if (target !== '#') {
                  smoothScroll(target);

                  if (history.pushState) {
                      history.pushState(null, null, target);
                  } else {
                      location.hash = target;
                  }
              }
          } else {
              // Jika menuju halaman lain, biarkan browser navigasi secara normal
              return;
          }
      });
  });
  
  // Menangani halaman yang dibuka langsung dengan hash
  if (window.location.hash) {
      setTimeout(() => {
          smoothScroll(window.location.hash);
      }, 100);
  }
});



