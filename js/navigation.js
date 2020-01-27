/*jshint esversion: 6 */
function render() {
  renderHeader();
  const path = window.location.pathname;
  const pageName = path.split('/')[1];

  switch (pageName) {
    case 'category':
      renderTestsList();
      break;
    case 'categories':
      renderCategories();
      break;
    case 'test':
      renderTest();
      break;
    case 'stats':
      renderStats();
      break;
    case 'auth':
      renderAuth();
      break;
    case 'register':
      renderRegister();
      break;
    case 'alltests':
      renderAllTests();
      break;
    case 'search':
      renderSearch();
      break;
    case 'about':
      renderAbout();
      break;
    case 'result':
      renderResult();
      break;
    default:
      renderMain();
      break;
  }
}

function navigate(path) {
  //event.preventDefault();
  window.history.pushState(
    {},
    path,
    window.location.origin + path
  );
}
