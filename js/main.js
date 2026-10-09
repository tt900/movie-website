const filterButtons = document.querySelectorAll('.filter-tag');
const cards = document.querySelectorAll('.style-card');
const searchInput = document.getElementById('searchInput');
const searchButton = document.querySelector('.search-bar .primary-btn');

let activeFilter = 'all';

function ensureStatusMessage() {
  let status = document.querySelector('.search-status');

  if (!status) {
    status = document.createElement('div');
    status.className = 'search-status';
    const searchPanel = document.querySelector('.search-panel');
    if (searchPanel) {
      searchPanel.appendChild(status);
    }
  }

  return status;
}

function applyFilter() {
  const searchValue = searchInput ? searchInput.value.trim().toLowerCase() : '';
  const status = ensureStatusMessage();

  let visibleCount = 0;

  cards.forEach((card) => {
    const category = card.dataset.category;
    const keywords = (card.dataset.keywords || '').toLowerCase();
    const title = card.querySelector('h3')?.textContent.toLowerCase() || '';
    const description = card.querySelector('p')?.textContent.toLowerCase() || '';

    const matchesCategory = activeFilter === 'all' || category === activeFilter;
    const haystack = [title, description, keywords].join(' ');
    const matchesSearch = !searchValue || haystack.includes(searchValue);

    const isVisible = matchesCategory && matchesSearch;
    card.classList.toggle('hidden', !isVisible);

    if (isVisible) {
      visibleCount += 1;
    }
  });

  if (!visibleCount) {
    status.textContent = searchValue
      ? `لا توجد نتائج لـ "${searchValue}" في هذا التصنيف.`
      : 'لا توجد نتائج في هذا التصنيف حاليًا.';
    status.classList.add('show');
    return;
  }

  status.textContent = searchValue
    ? `تم العثور على ${visibleCount} أسلوبًا يناسب البحث.`
    : `عرض ${visibleCount} أسلوبًا متاحًا.`;
  status.classList.add('show');
}

filterButtons.forEach((button) => {
  button.addEventListener('click', () => {
    activeFilter = button.dataset.filter;
    filterButtons.forEach((btn) => btn.classList.toggle('is-active', btn === button));
    applyFilter();
  });
});

if (searchInput) {
  searchInput.addEventListener('input', applyFilter);
  searchInput.addEventListener('keydown', (event) => {
    if (event.key === 'Enter') {
      event.preventDefault();
      applyFilter();
    }
  });
}

if (searchButton) {
  searchButton.addEventListener('click', applyFilter);
}

applyFilter();
