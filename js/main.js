const movies = [
  {
    title: 'The Last Mission',
    category: 'action',
    year: '2024',
    rating: '4.9',
    price: '12 SR',
    badge: 'New',
    cover: 'https://images.unsplash.com/photo-1517604931442-7e0c8ed2963c?auto=format&fit=crop&w=900&q=80'
  },
  {
    title: 'Midnight City',
    category: 'thriller',
    year: '2023',
    rating: '4.8',
    price: '10 SR',
    badge: 'Popular',
    cover: 'https://images.unsplash.com/photo-1513106580091-1d82408b8cd6?auto=format&fit=crop&w=900&q=80'
  },
  {
    title: 'Summer Echo',
    category: 'drama',
    year: '2024',
    rating: '4.7',
    price: '9 SR',
    badge: 'Top',
    cover: 'https://images.unsplash.com/photo-1504384308090-c894fdcc538d?auto=format&fit=crop&w=900&q=80'
  },
  {
    title: 'Laugh & Run',
    category: 'comedy',
    year: '2022',
    rating: '4.6',
    price: '8 SR',
    badge: 'Classic',
    cover: 'https://images.unsplash.com/photo-1489599849927-2ee91cede3ba?auto=format&fit=crop&w=900&q=80'
  }
];

const channels = [
  { name: 'MBC 1', status: 'مباشر', quality: 'HD', program: 'الأخبار والعروض', color: 'linear-gradient(135deg, #f59e0b, #f97316)' },
  { name: 'Rotana Cinema', status: 'مباشر', quality: 'FHD', program: 'أفلام عربية', color: 'linear-gradient(135deg, #8b5cf6, #ec4899)' },
  { name: 'Al Jazeera', status: 'مباشر', quality: 'HD', program: 'أخبار عربية', color: 'linear-gradient(135deg, #10b981, #06b6d4)' },
  { name: 'Nile Drama', status: 'مباشر', quality: 'HD', program: 'مسلسلات', color: 'linear-gradient(135deg, #ef4444, #f97316)' },
  { name: 'Dubai TV', status: 'مباشر', quality: 'FHD', program: 'ترفيه ورياضة', color: 'linear-gradient(135deg, #3b82f6, #06b6d4)' },
  { name: 'Syria TV', status: 'مباشر', quality: 'HD', program: 'محتوى عربي', color: 'linear-gradient(135deg, #14b8a6, #22c55e)' }
];

const reviews = [
  {
    user: 'سارة',
    movie: 'The Last Mission',
    text: 'واجهة ممتازة وسريعة، ومحتوى الأفلام جيد جدًا. تجربة المشاهدة مريحة جدًا.',
    stars: '★★★★★'
  },
  {
    user: 'يوسف',
    movie: 'Midnight City',
    text: 'القنوات المباشرة تعمل بشكل ممتاز، خاصة جودة الفيديو والسرعة في التشغيل.',
    stars: '★★★★★'
  },
  {
    user: 'ليلى',
    movie: 'Summer Echo',
    text: 'التقييمات والمواد المقترحة مفيدة، والواجهة مناسبة جدًا للهواتف المحمولة.',
    stars: '★★★★☆'
  }
];

function renderMovies() {
  const grid = document.getElementById('moviesGrid');
  if (!grid) return;

  grid.innerHTML = movies.map(movie => `
    <article class="movie-card" data-category="${movie.category}">
      <div class="card-cover" style="background-image: url('${movie.cover}')">
        <span class="card-badge">${movie.badge}</span>
      </div>
      <div class="card-body">
        <div class="card-head">
          <h3>${movie.title}</h3>
          <span class="rating">★ ${movie.rating}</span>
        </div>
        <div class="meta-line">
          <span>${movie.year}</span>
          <span>${movie.category}</span>
        </div>
        <div class="card-footer">
          <span class="price-tag">${movie.price}</span>
          <button class="watch-btn">شاهد الآن</button>
        </div>
      </div>
    </article>
  `).join('');
}

function renderChannels() {
  const grid = document.getElementById('channelsGrid');
  if (!grid) return;

  grid.innerHTML = channels.map(channel => `
    <article class="channel-card">
      <div class="channel-header">
        <div class="channel-logo" style="background: ${channel.color};">${channel.name.slice(0, 2)}</div>
        <div>
          <div class="channel-name">${channel.name}</div>
          <div class="channel-status">${channel.status}</div>
        </div>
      </div>
      <div class="channel-meta">
        <div>الجودة: ${channel.quality}</div>
        <div>البرنامج: ${channel.program}</div>
      </div>
      <button class="live-btn">تشغيل مباشر</button>
    </article>
  `).join('');
}

function renderReviews() {
  const grid = document.getElementById('reviewsGrid');
  if (!grid) return;

  grid.innerHTML = reviews.map(review => `
    <article class="review-card">
      <div class="review-top">
        <div class="user-meta">
          <div class="avatar">${review.user.slice(0, 1)}</div>
          <div>
            <strong>${review.user}</strong>
            <div>${review.movie}</div>
          </div>
        </div>
        <span class="review-stars">${review.stars}</span>
      </div>
      <p>${review.text}</p>
    </article>
  `).join('');
}

function bindFilters() {
  const buttons = document.querySelectorAll('.filter-btn');
  const cards = document.querySelectorAll('.movie-card');

  buttons.forEach(button => {
    button.addEventListener('click', () => {
      const selected = button.dataset.filter;
      buttons.forEach(btn => btn.classList.toggle('active', btn === button));

      cards.forEach(card => {
        const matches = selected === 'all' || card.dataset.category === selected;
        card.style.display = matches ? 'flex' : 'none';
      });
    });
  });
}

function bindSearch() {
  const searchInput = document.getElementById('globalSearch');
  if (!searchInput) return;

  searchInput.addEventListener('input', (event) => {
    const term = event.target.value.trim().toLowerCase();

    document.querySelectorAll('.movie-card, .channel-card, .review-card').forEach(item => {
      const text = item.textContent.toLowerCase();
      item.style.display = !term || text.includes(term) ? '' : 'none';
    });
  });
}

function bindAuthModal() {
  const loginBtn = document.getElementById('loginBtn');
  const modal = document.getElementById('authModal');
  const closeBtn = document.getElementById('closeModal');
  const searchToggle = document.getElementById('searchToggle');
  const searchBar = document.getElementById('searchBar');

  loginBtn?.addEventListener('click', () => modal.classList.remove('hidden'));
  closeBtn?.addEventListener('click', () => modal.classList.add('hidden'));
  modal?.addEventListener('click', (event) => {
    if (event.target === modal) modal.classList.add('hidden');
  });

  searchToggle?.addEventListener('click', () => {
    searchBar.classList.toggle('hidden');
  });

  const tabs = document.querySelectorAll('.tab-btn');
  const forms = document.querySelectorAll('.auth-form');

  tabs.forEach(tab => {
    tab.addEventListener('click', () => {
      const target = tab.dataset.tab;
      tabs.forEach(btn => btn.classList.toggle('active', btn === tab));
      forms.forEach(form => form.classList.toggle('active', form.id === `${target}Form`));
    });
  });

  document.getElementById('loginForm')?.addEventListener('submit', (event) => {
    event.preventDefault();
    modal.classList.add('hidden');
    alert('تم تسجيل الدخول بنجاح');
  });

  document.getElementById('registerForm')?.addEventListener('submit', (event) => {
    event.preventDefault();
    modal.classList.add('hidden');
    alert('تم إنشاء الحساب بنجاح');
  });
}

renderMovies();
renderChannels();
renderReviews();
bindFilters();
bindSearch();
bindAuthModal();
