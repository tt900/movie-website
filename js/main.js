const filterButtons = document.querySelectorAll('.filter-tag');
const cards = document.querySelectorAll('.style-card');
const searchInput = document.getElementById('searchInput');

let activeFilter = 'all';

function applyFilter() {
  const searchValue = searchInput.value.trim().toLowerCase();

  cards.forEach((card) => {
    const category = card.dataset.category;
    const keywords = card.dataset.keywords.toLowerCase();
    const title = card.querySelector('h3')?.textContent.toLowerCase() || '';
    const description = card.querySelector('p')?.textContent.toLowerCase() || '';

    const matchesCategory = activeFilter === 'all' || category === activeFilter;
    const matchesSearch = !searchValue || [title, description, keywords].join(' ').includes(searchValue);

    card.classList.toggle('hidden', !(matchesCategory && matchesSearch));
  });
}

filterButtons.forEach((button) => {
  button.addEventListener('click', () => {
    activeFilter = button.dataset.filter;
    filterButtons.forEach((btn) => btn.classList.toggle('is-active', btn === button));
    applyFilter();
  });
});

searchInput.addEventListener('input', applyFilter);
