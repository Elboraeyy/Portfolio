// Activate gradual appearance during scrolling
const obs = new IntersectionObserver((entries) => {
  entries.forEach(e => {
    if (e.isIntersecting) {
      setTimeout(() => {
        e.target.classList.add('show');
      }, 100);
      if (e.target.id === 'skills') {
        document.querySelectorAll('.bar > i').forEach((bar, index) => {
          setTimeout(() => {
            bar.style.animation = `fillBar 1.5s ease forwards`;
          }, index * 200);
        });
      }
      if (e.target.classList.contains('section')) {
        e.target.classList.add('visible');
      }
    }
  });
}, { threshold: 0.12 });

document.querySelectorAll('.card, .h1, .h2, .avatar, .section, .skill, .project, .tag, .btn').forEach(el => {
  el.classList.add('fade');
  obs.observe(el);
});

// Highlight active section link
const sections = [...document.querySelectorAll('main section')];
const links = [...document.querySelectorAll('header.nav a.link')];
const spy = new IntersectionObserver((entries) => {
  entries.forEach(e => {
    if (e.isIntersecting) {
      links.forEach(a => a.classList.remove('active'));
      const id = e.target.getAttribute('id');
      const active = document.querySelector(`header.nav a[href="#${id}"]`);
      if (active) active.classList.add('active');
    }
  });
}, { threshold: 0.6 });

sections.forEach(s => spy.observe(s));

// Navbar scroll effect
window.addEventListener('scroll', () => {
  const header = document.querySelector('header.nav');
  if (window.scrollY > 50) {
    header.classList.add('scrolled');
  } else {
    header.classList.remove('scrolled');
  }
});

// Mobile menu toggle
const menuBtn = document.getElementById('menuBtn');
const navLinks = document.getElementById('navLinks');
menuBtn.addEventListener('click', () => {
  navLinks.classList.toggle('active');
  menuBtn.innerHTML = navLinks.classList.contains('active') ? 
    '<i class="fas fa-times"></i>' : '<i class="fas fa-bars"></i>';
});

document.querySelectorAll('.nav-links a').forEach(link => {
  link.addEventListener('click', () => {
    navLinks.classList.remove('active');
    menuBtn.innerHTML = '<i class="fas fa-bars"></i>';
  });
});

// Initialize animations
document.addEventListener('DOMContentLoaded', () => {
  document.getElementById('cover').classList.add('visible');
  const avatar = document.querySelector('.avatar');
  avatar.classList.add('fade');
  setTimeout(() => {
    avatar.classList.add('show');
  }, 300);
});

// Project Modal functionality
(function(){
  const modal = document.getElementById('projectModal');
  const backdrop = document.getElementById('pmBackdrop');
  const closeBtn = document.getElementById('pmClose');
  const titleEl = document.getElementById('pmTitle');
  const descEl = document.getElementById('pmDesc');
  const imageEl = document.getElementById('pmImage');
  const thumbsRow = document.getElementById('pmThumbs');
  const prevBtn = document.getElementById('pmPrev');
  const nextBtn = document.getElementById('pmNext');
  const actionsEl = document.getElementById('pmActions');
  let images = [];
  let currentImageIndex = 0;

  function openModalFromCard(card) {
    const title = card.dataset.title || '';
    const desc = card.dataset.desc || '';
    const imgs = (card.dataset.images || '').split(',').map(s => s.trim()).filter(Boolean);
    titleEl.textContent = title;
    descEl.textContent = desc;
    images = imgs.length ? imgs : ['https://placehold.co/800x500?text=No+Image'];
    currentImageIndex = 0;
    actionsEl.innerHTML = '';
    if (card.dataset.github && card.dataset.github !== '#') {
      const githubBtn = document.createElement('a');
      githubBtn.href = card.dataset.github;
      githubBtn.target = '_blank';
      githubBtn.rel = 'noopener noreferrer';
      githubBtn.className = 'pm-btn github';
      githubBtn.innerHTML = '<i class="fab fa-github"></i> View on GitHub';
      actionsEl.appendChild(githubBtn);
    }
    renderImage();
    renderThumbs();
    showModal();
  }

  function renderImage(){
    if (images.length > 0) {
      const img = new Image();
      img.src = images[currentImageIndex];
      img.onload = function() {
        const aspectRatio = img.width / img.height;
        const maxWidth = 0.9 * modal.clientWidth;
        const maxHeight = 0.7 * modal.clientHeight;
        let displayWidth = img.width;
        let displayHeight = img.height;
        if (displayWidth > maxWidth) {
          displayWidth = maxWidth;
          displayHeight = displayWidth / aspectRatio;
        }
        if (displayHeight > maxHeight) {
          displayHeight = maxHeight;
          displayWidth = displayHeight * aspectRatio;
        }
        imageEl.style.width = `${displayWidth}px`;
        imageEl.style.height = `${displayHeight}px`;
        imageEl.src = images[currentImageIndex];
        imageEl.alt = titleEl.textContent + ' - image ' + (currentImageIndex + 1);
      };
      img.onerror = function() {
        imageEl.src = '  https://placehold.co/800x500?text=Image+Not+Found';
        imageEl.alt = 'Image Not Found';
        imageEl.style.width = '100%';
        imageEl.style.height = 'auto';
      };
    }
  }

  function renderThumbs(){
    thumbsRow.innerHTML = '';
    images.forEach((src, i) => {
      const thumb = document.createElement('img');
      thumb.src = src;
      thumb.alt = `Thumbnail ${i + 1}`;
      if(i === currentImageIndex) thumb.classList.add('active');
      thumb.addEventListener('click', () => { 
        currentImageIndex = i; 
        renderImage(); 
        updateThumbs(); 
      });
      thumbsRow.appendChild(thumb);
    });
  }

  function updateThumbs(){
    thumbsRow.querySelectorAll('img').forEach((thumb, i) => {
      thumb.classList.toggle('active', i === currentImageIndex);
    });
  }

  function showModal(){
    modal.classList.add('show');
    modal.setAttribute('aria-hidden','false');
    document.body.style.overflow = 'hidden';
  }

  function hideModal(){
    modal.classList.remove('show');
    modal.setAttribute('aria-hidden','true');
    document.body.style.overflow = '';
  }

  prevBtn.addEventListener('click', () => { 
    currentImageIndex = (currentImageIndex - 1 + images.length) % images.length; 
    renderImage(); 
    updateThumbs(); 
  });

  nextBtn.addEventListener('click', () => { 
    currentImageIndex = (currentImageIndex + 1) % images.length; 
    renderImage(); 
    updateThumbs(); 
  });

  closeBtn.addEventListener('click', hideModal);
  backdrop.addEventListener('click', hideModal);
  document.addEventListener('keydown', (e) => { 
    if(e.key === 'Escape') hideModal(); 
  });

  document.querySelectorAll('.card.project').forEach(card => {
    card.addEventListener('click', (e) => {
      if (!e.target.closest('a')) {
        openModalFromCard(card);
      }
    });
  });
})();

// Theme Toggle
(function() {
  const themeToggle = document.getElementById('themeToggle');
  const body = document.body;
  const savedTheme = localStorage.getItem('theme') || 'light';
  if (savedTheme === 'dark') {
    body.setAttribute('data-theme', 'dark');
    themeToggle.innerHTML = '<i class="fas fa-sun"></i>';
  }
  themeToggle.addEventListener('click', () => {
    const currentTheme = body.getAttribute('data-theme');
    if (currentTheme === 'dark') {
      body.removeAttribute('data-theme');
      localStorage.setItem('theme', 'light');
      themeToggle.innerHTML = '<i class="fas fa-moon"></i>';
    } else {
      body.setAttribute('data-theme', 'dark');
      localStorage.setItem('theme', 'dark');
      themeToggle.innerHTML = '<i class="fas fa-sun"></i>';
    }
  });
})();

// Skills toggle + progress bars
document.querySelectorAll('.skill-category').forEach(cat => {
  const header = cat.querySelector('.category-header');
  const fill = cat.querySelector('.progress-fill');
  const percent = cat.dataset.percent;

  header.addEventListener('click', () => {
    cat.classList.toggle('open');

    if (cat.classList.contains('open')) {
      // animate progress bar
      requestAnimationFrame(() => {
        fill.style.width = percent + '%';
      });
    } else {
      fill.style.width = '0';
    }
  });
});   

