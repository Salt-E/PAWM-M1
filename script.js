// Burger menu toggle
const burgerMenu = document.getElementById('burger-menu');
const menu = document.getElementById('menu');

burgerMenu.addEventListener('click', () => {
  menu.classList.toggle('show');
});

// Fungsi untuk menangani event drag dan touch pada desktop dan mobile
function handleDragStart(e) {
  this.classList.add('dragging');
  if (e.type === 'touchstart') {
    const touch = e.touches[0];
    this.dataset.touchStartX = touch.clientX;
    this.dataset.touchStartY = touch.clientY;
  }
}

function handleDragEnd(e) {
  this.classList.remove('dragging');
}

// Fungsi untuk menangani event touchmove di mobile
function handleTouchMove(e) {
  const touch = e.touches[0];
  const element = document.querySelector('.dragging');
  const dropzone = document.elementFromPoint(touch.clientX, touch.clientY);

  if (dropzone && dropzone.classList.contains('dropzone')) {
    e.preventDefault();
  }
}

// Menangani pen-drop-an elemen pada dropzone
function handleDrop(e) {
  e.preventDefault();
  const dragging = document.querySelector('.dragging');
  const dropzone = e.target;
  
  if (dropzone && dropzone.classList.contains('dropzone')) {
    dropzone.appendChild(dragging);
  }
}

// Menambahkan event listener untuk elemen yang bisa di-drag
function addDragAndTouchListeners(draggableElements, dropzone) {
  draggableElements.forEach(draggable => {
    // Event listener untuk drag pada desktop
    draggable.addEventListener('dragstart', handleDragStart);
    draggable.addEventListener('dragend', handleDragEnd);
    
    // Event listener untuk touch pada mobile
    draggable.addEventListener('touchstart', handleDragStart);
    draggable.addEventListener('touchmove', handleTouchMove);
    draggable.addEventListener('touchend', handleDragEnd);
  });

  // Event listener untuk dropzone
  dropzone.addEventListener('dragover', (e) => e.preventDefault()); // Untuk mendukung desktop
  dropzone.addEventListener('drop', handleDrop); // Untuk mendukung desktop
  dropzone.addEventListener('touchend', handleDrop); // Untuk mendukung mobile
}

// Inisialisasi drag and drop untuk latihan penjumlahan dan if-else
const penjumlahanDraggables = document.querySelectorAll('#draggable-elements-penjumlahan .draggable');
const penjumlahanDropzone = document.getElementById('dropzone-penjumlahan');

const ifelseDraggables = document.querySelectorAll('#draggable-elements-ifelse .draggable');
const ifelseDropzone = document.getElementById('dropzone-ifelse');

// Memasang event listener untuk desktop dan mobile
addDragAndTouchListeners(penjumlahanDraggables, penjumlahanDropzone);
addDragAndTouchListeners(ifelseDraggables, ifelseDropzone);

ifelseDropzone.addEventListener('dragover', (e) => {
  e.preventDefault();
  const dragging = document.querySelector('.dragging');
  // Pastikan hanya elemen ifelse yang bisa didrop di sini
  if (dragging && dragging.id.startsWith('ifelse-')) {
    const afterElement = getDragAfterElement(ifelseDropzone, e.clientY);
    if (afterElement == null) {
      ifelseDropzone.appendChild(dragging);
    } else {
      ifelseDropzone.insertBefore(dragging, afterElement);
    }
  }
});

penjumlahanDropzone.addEventListener('dragover', (e) => {
  e.preventDefault();
  const dragging = document.querySelector('.dragging');
  // Pastikan hanya elemen ifelse yang bisa didrop di sini
  if (dragging && dragging.id.startsWith('penjumlahan-')) {
    const afterElement = getDragAfterElement(penjumlahanDropzone, e.clientY);
    if (afterElement == null) {
      penjumlahanDropzone.appendChild(dragging);
    } else {
      penjumlahanDropzone.insertBefore(dragging, afterElement);
    }
  }
});

// Fungsi untuk mengecek urutan elemen yang benar untuk latihan penjumlahan
document.getElementById('check-code-btn-penjumlahan').addEventListener('click', function () {
  const order = [...penjumlahanDropzone.querySelectorAll('.draggable')].map(e => e.id);
  const correctOrder = ['penjumlahan-line1', 'penjumlahan-line2', 'penjumlahan-line3', 'penjumlahan-line4'];
  const result = document.getElementById('result-penjumlahan');

  if (JSON.stringify(order) === JSON.stringify(correctOrder)) {
    result.textContent = 'Susunan kode benar!';
    result.style.color = '#45a049';
  } else {
    result.textContent = 'Susunan kode salah, coba lagi.';
    result.style.color = 'red';
  }
});

document.getElementById('check-code-btn-ifelse').addEventListener('click', function () {
  const order = [...ifelseDropzone.querySelectorAll('.draggable')].map(e => e.id);
  const correctOrder = ['ifelse-line2', 'ifelse-line3', 'ifelse-line1', 'ifelse-line4'];
  const result = document.getElementById('result-ifelse');

  if (JSON.stringify(order) === JSON.stringify(correctOrder)) {
    result.textContent = 'Susunan kode benar!';
    result.style.color = '#45a049';
  } else {
    result.textContent = 'Susunan kode salah, coba lagi.';
    result.style.color = 'red';
  }
});

// Fungsi untuk menentukan tempat drop elemen
function getDragAfterElement(container, y) {
  const draggableElements = [...container.querySelectorAll('.draggable:not(.dragging)')];

  return draggableElements.reduce((closest, child) => {
    const box = child.getBoundingClientRect();
    const offset = y - box.top - box.height / 2;
    if (offset < 0 && offset > closest.offset) {
      return { offset: offset, element: child };
    } else {
      return closest;
    }
  }, { offset: Number.NEGATIVE_INFINITY }).element;
}
  
  
function dropItem(e) {
    e.preventDefault();
    const draggedId = e.dataTransfer.getData('text');
    const draggedItem = document.getElementById(draggedId);
    e.target.appendChild(draggedItem);

    // Cek apakah semua item sudah tersusun dengan benar
    const correctOrder = ['2', '3', '1', '4'];
    const dropItems = Array.from(e.target.children).map(item => item.id);
    
    if (dropItems.length === correctOrder.length && dropItems.every((id, index) => id === correctOrder[index])) {
        alert('Urutan benar! Latihan selesai.');
    }
}

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

// Fungsi untuk mengecek jawaban pilihan ganda
function checkPGAnswers() {
  const q1 = document.querySelector('input[name="q1"]:checked');
  const q2 = document.querySelector('input[name="q2"]:checked');
  const q3 = document.querySelector('input[name="q3"]:checked');
  const q4 = document.querySelector('input[name="q4"]:checked');
  const q5 = document.querySelector('input[name="q5"]:checked');
  let score = 0;

  if (q1 && q1.value === "Float") {
      score += 1;
  }
  if (q2 && q2.value === "True") {
      score += 1;
  }
  if (q3 && q3.value === "If statement") {
    score += 1;
  }
  if (q4 && q4.value === "If-elif-else statement") {
    score += 1;
  }
  if (q5 && q5.value === "string") {
    score += 1;
  }


  const resultElement = document.getElementById("pg-result");
  resultElement.textContent = `Skor Anda: ${score}/5`;
  resultElement.style.color = score === 5 ? "#45a049" : "red";
}