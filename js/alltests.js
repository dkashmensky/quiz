/*jshint esversion: 6 */
function renderAllTests() {
  const searchParams = new URLSearchParams(window.location.search);
  const page = searchParams.get('page') != null ? Number(searchParams.get('page')) : 1;
  const data = JSON.parse(localStorage.getItem('data'));

  const filteredTests = filterTests(data.tests, page);

  const testsList = filteredTests
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

  const paging = getPaging(page, data.tests);

  const testsListContainer = `
    <section>
      <div class="test-cat">
        <h1>All tests</h1>
        <ul>
          ${testsList}
        </ul>
      </div>
      ${paging}
    </section>
  `;

  document.querySelector('main').innerHTML = testsListContainer;
}

function getPaging(page, items, itemsPerPage = 10) {
  // TODO: REFACTOR IF POSSIBLE
  const pagesCount = Math.ceil(items.length / itemsPerPage);

  const pageBack = page - 1 > 0 ? page - 1 : 1;
  const pageLast = pagesCount;
  const pageNext = page + 1 <= pagesCount ? page + 1 : pagesCount;

  const pagesBefore = `
    ${page - 2 > 0 ? `<div><a href="" onclick="navigate('/alltests?page=${page - 2}')">${page - 2}</a></div>` : ``}
    ${page - 1 > 0 ? `<div><a href="" onclick="navigate('/alltests?page=${page - 1}')">${page - 1}</a></div>` : ``}
  `;

  const pagesAfter = `
    ${page + 1 <= pagesCount ? `<div><a href="" onclick="navigate('/alltests?page=${page + 1}')">${page + 1}</a></div>` : ``}
    ${page + 2 <= pagesCount ? `<div><a href="" onclick="navigate('/alltests?page=${page + 2}')">${page + 2}</a></div>` : ``}
  `;

  return `
    <div class="paging-container">
      <div class="test-paging">
        <div class="test-paging__first">
          <a href="" onclick="navigate('/alltests?page=1')">
            <img src="/res/img/first.png">
          </a>
        </div>
        <div class="test-paging__back">
          <a href="" onclick="navigate('/alltests?page=${pageBack}')">
            <img src="/res/img/back.png">
          </a>
        </div>
        <div class="test-paging__pages">
          ${pagesBefore}
          <div class="active-page"><a href="" onclick="navigate('/alltests?page=${page}')">${page}</a></div>
          ${pagesAfter}
        </div>
        <div class="test-paging__next">
          <a href="" onclick="navigate('/alltests?page=${pageNext}')">
            <img src="/res/img/next.png">
          </a>
        </div>
        <div class="test-paging__last">
          <a href="" onclick="navigate('/alltests?page=${pageLast}')">
            <img src="/res/img/last.png">
          </a>
        </div>
      </div>
    </div>
  `;
}

function filterTests(items, pageId, itemsPerPage = 10) {
  if(pageId < 1) {
    pageId = 1;
  }

  const filtered = items.filter((item, index) => {
    const page = Math.floor(index / itemsPerPage);
    return page === pageId - 1;
  });

  if(filtered.length <= 0) {
    return filterTests(items, 1);
  }

  return filtered;
}
