/*jshint esversion: 6 */
function renderSearch() {
  const searchParams = new URLSearchParams(window.location.search);
  const searchQuery = searchParams.get('query');
  const category = searchParams.get('cat');
  const data = JSON.parse(localStorage.getItem('data'));

  const catOptions = data.categories
    .map((item) => {
      return `
        <option value="${item.id}"${category && category == item.id ? ' selected' : ''}>
          ${item.name}
        </option>
      `;
    })
    .join('');

  const results = getSearchResults(data, searchQuery, category);

  const searchMarkup = `
    <section>
      <div class="search-container">
        <div>
          <h1>Search</h1>
        </div>
        <div class="search-inputs">
          <form class="search-form" action="">
            <div>
              <label for="search-field">Search query: </label>
              <input type="text" id="search-field" value="${searchQuery ? searchQuery : ''}">
            </div>
            <div>
              <label for="search-cat">In category: </label>
              <select id="search-cat" value="">
                <option value=""${!category ? ' selected' : ''}></option>
                ${catOptions}
              </select>
            </div>
            <div>
              <button type="submit" class="purple-btn">Search</button>
            </div>
          </form>
        </div>
        <div class="search-result">
          <h2>Results:</h2>
          ${results}
        </div>
      </div>
    </section>
  `;

  document.querySelector('main').innerHTML = searchMarkup;

  document.querySelector('.search-form').addEventListener('submit', (event) => {
    event.preventDefault();
    navigate('/search?' + getSearchString());
    renderSearch();
  });
}

function getSearchString() {
  let searchString = '';

  searchString += `query=${document.querySelector('#search-field').value}`;
  searchString += `&cat=${document.querySelector('#search-cat').value}`;

  return searchString;
}

function getSearchResults(data, text, cat, notpassed) {
  let result = '';
  text = text ? text : '';
  cat = cat ? cat : '';
  notpassed = notpassed ? notpassed : false;

  if(text == '' && cat == '') {
    return '';
  }

  if(text != '') {
    const queryCats = data.categories.filter((item) => {
      return item.name.toLowerCase().includes(text.toLowerCase());
    });

    if(queryCats.length > 0) {
      const catsResult = queryCats
        .map((item) => {
          return `
            <li>
              <a href="" onclick="navigate('/category?id=${item.id}')">
                <div class="test-cat__item">
                  ${item.name}
                </div>
              </a>
            </li>
          `;
        })
        .join('');

      result += `
        <div class="search-result-header">
          <h2>Categories</h2>
        </div>
        <div class="test-cat">
          <ul>
            ${catsResult}
          </ul>
        </div>
      `;
    }
  }

  let queryTests = data.tests.filter((item) => {
    return item.name.toLowerCase().includes(text.toLowerCase());
  });

  if(cat != '') {
    queryTests = queryTests.filter((item) => {
      return item.category_id == cat;
    });
  }

  if(queryTests.length > 0) {
    const testsResult = queryTests
      .map((item) => {
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

    result += `
      <div class="search-result-header">
        <h2>Tests</h2>
      </div>
      <div class="test-cat">
        <ul>
          ${testsResult}
        </ul>
      </div>
    `;
  }

  if(result === '') {
    result = 'Nothing found. Please change search parameters';
  }

  return result;
}
