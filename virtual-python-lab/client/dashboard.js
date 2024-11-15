document.addEventListener("DOMContentLoaded", async () => {
    const token = localStorage.getItem('access_token');
    const userEmailElement = document.getElementById('user-email');
    const userProgressElement = document.getElementById('user-progress');

    // Cek apakah token ada, jika tidak, arahkan ke halaman login
    if (!token) {
        alert("Anda harus login terlebih dahulu!");
        window.location.href = "login.html";
        return;
    }

    // Ambil data profil pengguna menggunakan token
    try {
        const response = await fetch('/api/auth/profile', {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token}`,
            },
        });

        const result = await response.json();
        if (result.success) {
            const user = result.user;
            // Tampilkan email pengguna
            userEmailElement.textContent = `Welcome, ${user.email}`;
            localStorage.setItem('user_id', user.id);

            // Ambil progress dari API
            const userId = user.id; // ID pengguna dari JSON
            const progressResponse = await fetch(`/api/progress/${userId}`);
            
            if (!progressResponse.ok) {
                throw new Error(`HTTP Error: ${progressResponse.status} - ${progressResponse.statusText}`);
            }

            const progressResult = await progressResponse.json();

            if (Array.isArray(progressResult) && progressResult.length > 0) {
                // Tampilkan progress pengguna
                userProgressElement.textContent = "Progress pengguna:";
                progressResult.forEach((item) => {
                    const progressText = document.createElement("p");
                    progressText.textContent = `Page: ${item.page}, Progress: ${item.progress}%`;
                    userProgressElement.appendChild(progressText);
                });
            } else {
                userProgressElement.textContent = "No progress data available.";
            }
        } else {
            alert("Gagal memuat profil. Silakan login ulang.");
            localStorage.removeItem('access_token');
            window.location.href = "login.html";
        }
    } catch (error) {
        console.error("Error loading profile:", error);
        alert("Terjadi kesalahan saat mengambil data profil.");
    }
});

// Tombol logout
document.getElementById('logoutBtn').addEventListener('click', () => {
    // Hapus token dari localStorage dan arahkan ke halaman login
    localStorage.removeItem('access_token');
    alert("Logout berhasil!");
    window.location.href = "index.html";
});

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

// Drag-and-drop logic for latihan 2: basic function
const penjumlahanDraggables = document.querySelectorAll('#draggable-elements-penjumlahan .draggable');
const penjumlahanDropzone = document.getElementById('dropzone-penjumlahan');

penjumlahanDraggables.forEach(draggable => {
  draggable.addEventListener('dragstart', () => {
    draggable.classList.add('dragging');
  });

  draggable.addEventListener('dragend', () => {
    draggable.classList.remove('dragging');
  });
});

penjumlahanDropzone.addEventListener('dragover', (e) => {
  e.preventDefault();
  const dragging = document.querySelector('.dragging');
  // Pastikan hanya elemen penjumlahan yang bisa didrop di sini
  if (dragging && dragging.id.startsWith('penjumlahan-')) {
    const afterElement = getDragAfterElement(penjumlahanDropzone, e.clientY);
    if (afterElement == null) {
      penjumlahanDropzone.appendChild(dragging);
    } else {
      penjumlahanDropzone.insertBefore(dragging, afterElement);
    }
  }
});

document.getElementById('check-code-btn-penjumlahan').addEventListener('click', async function () {
  const order = [...penjumlahanDropzone.querySelectorAll('.draggable')].map(e => e.id);
  const correctOrder = ['penjumlahan-line1', 'penjumlahan-line2', 'penjumlahan-line3', 'penjumlahan-line4'];
  const result = document.getElementById('result-penjumlahan');

  if (JSON.stringify(order) === JSON.stringify(correctOrder)) {
    result.textContent = 'Susunan kode benar!';
    result.style.color = '#45a049';

    const userId = `${user}`;  // ID pengguna yang sedang login
    const page1 = 'basic-function';
    const progress1 = 100;
    const isCompleted1 = true;

  // Mengirim progress ke server
    await saveProgress(userId, page1, progress1, isCompleted1);
  } else {
    result.textContent = 'Susunan kode salah, coba lagi.';
    result.style.color = 'red';
  }
});


// Drag-and-drop logic for latihan 3: if-else
const ifelseDraggables = document.querySelectorAll('#draggable-elements-ifelse .draggable');
const ifelseDropzone = document.getElementById('dropzone-ifelse');

ifelseDraggables.forEach(draggable => {
  draggable.addEventListener('dragstart', () => {
    draggable.classList.add('dragging');
  });

  draggable.addEventListener('dragend', () => {
    draggable.classList.remove('dragging');
  });
});

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

// Handle drag-and-drop untuk mobile
// Tambahkan variabel untuk menyimpan elemen yang sedang di-touch
let touchDragging = null;

// Fungsi helper untuk mendapatkan koordinat touch
function getTouchCoordinates(e) {
  if (e.touches && e.touches.length) {
    return {
      clientX: e.touches[0].clientX,
      clientY: e.touches[0].clientY
    };
  }
  return {
    clientX: e.clientX,
    clientY: e.clientY
  };
}

// Tambahkan touch event listeners untuk draggable elements
function addTouchListeners(draggable) {
  draggable.addEventListener('touchstart', handleTouchStart, { passive: false });
  draggable.addEventListener('touchmove', handleTouchMove, { passive: false });
  draggable.addEventListener('touchend', handleTouchEnd, { passive: false });
}

// Terapkan touch listeners ke semua elemen draggable
penjumlahanDraggables.forEach(draggable => {
  addTouchListeners(draggable);
});

ifelseDraggables.forEach(draggable => {
  addTouchListeners(draggable);
});

function handleTouchStart(e) {
  e.preventDefault();
  const touch = e.touches[0];
  touchDragging = this;
  this.classList.add('dragging');
  
  // Simpan posisi awal touch
  this.dataset.startX = touch.clientX - this.offsetLeft;
  this.dataset.startY = touch.clientY - this.offsetTop;
  
  // Tambahkan styling saat drag
  this.style.position = 'absolute';
  this.style.zIndex = '1000';
  this.style.opacity = '0.8';
}

function handleTouchMove(e) {
  e.preventDefault();
  if (!touchDragging) return;
  
  const touch = e.touches[0];
  const dropzone = touchDragging.id.startsWith('penjumlahan-') 
    ? penjumlahanDropzone 
    : ifelseDropzone;
  
  // Update posisi elemen
  touchDragging.style.left = touch.clientX - touchDragging.dataset.startX + 'px';
  touchDragging.style.top = touch.clientY - touchDragging.dataset.startY + 'px';
  
  // Cek apakah touch berada di atas dropzone
  const dropzoneRect = dropzone.getBoundingClientRect();
  if (touch.clientY >= dropzoneRect.top && 
      touch.clientY <= dropzoneRect.bottom &&
      touch.clientX >= dropzoneRect.left && 
      touch.clientX <= dropzoneRect.right) {
    
    const afterElement = getDragAfterElement(dropzone, touch.clientY);
    if (afterElement == null) {
      dropzone.appendChild(touchDragging);
    } else {
      dropzone.insertBefore(touchDragging, afterElement);
    }
  }
}


function handleTouchEnd(e) {
  e.preventDefault();
  if (!touchDragging) return;
  
  // Reset styling
  touchDragging.classList.remove('dragging');
  touchDragging.style.position = '';
  touchDragging.style.zIndex = '';
  touchDragging.style.opacity = '';
  touchDragging.style.left = '';
  touchDragging.style.top = '';
  
  touchDragging = null;
}

document.getElementById('check-code-btn-ifelse').addEventListener('click', async function () {
  const order = [...ifelseDropzone.querySelectorAll('.draggable')].map(e => e.id);
  const correctOrder = ['ifelse-line2', 'ifelse-line3', 'ifelse-line1', 'ifelse-line4'];
  const result = document.getElementById('result-ifelse');

  if (JSON.stringify(order) === JSON.stringify(correctOrder)) {
    result.textContent = 'Susunan kode benar!';
    result.style.color = '#45a049';

    const userId = `${user}`;  // ID pengguna yang sedang login
    const page2 = 'if-else';
    const progress2 = 100;
    const isCompleted2 = true;

  // Mengirim progress ke server
    await saveProgress(userId, page2, progress2, isCompleted2);
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
async function checkPGAnswers() {
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


  const userId = `${user}`;  // ID pengguna yang sedang login
  const page3 = 'pilihan-ganda';
  const progress3 = (score / 5) * 100;
  const isCompleted3 = true;

  // Mengirim progress ke server
  await saveProgress(userId, page3, progress3, isCompleted3);
}
  

