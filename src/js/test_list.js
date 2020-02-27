/*jshint esversion: 6 */
function renderCategories() {
  const data = JSON.parse(localStorage.getItem('data'));

  const categoriesList = data.categories
    .map((item) => {
      return `
        <div class="category__test">
          <a href="" onclick="navigate('/category?id=${item.id}')">
            <div class="category__img-wrapper">
              <img src="${item.img}">
            </div>
            <div class="category__test-name">
              ${item.name}
            </div>
          </a>
        </div>
      `;
    })
    .join('');

  const categoriesMarkup = `
    <section class="category">
      <div class="category__header">
        <h1>Categories</h1>
      </div>
      <div class="category-container">
        ${categoriesList}
      </div>
    </section>
  `;

  document.querySelector('main').innerHTML = categoriesMarkup;
}

function renderTestsList() {
  const searchParams = new URLSearchParams(window.location.search);
  const catId = searchParams.get('id');
  const data = JSON.parse(localStorage.getItem('data'));
  const category = data.categories.find((item) => {
    return item.id === catId;
  });

  const testsList = data.tests
    .filter((item) => {
      return item.category_id === catId;
    })
    .map(item => {
      return `
      <li>
        <a href="" onclick="navigate('/test?id=${item.id}')">
          <div class="test-cat__item">
            ${item.name}
          </div>
        </a>
      </li>
      `;
    })
    .join('');

  const testsListContainer = `
    <div class="test-cat">
      <h1>${category.name}</h1>
      <ul>
        ${testsList}
      </ul>
    </div>
  `;

  document.querySelector('main').innerHTML = testsListContainer;
}
