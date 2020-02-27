/*jshint esversion: 6 */
(() => {
  const getData = localStorage.getItem('data');
  if(getData === undefined || getData === null) {
    fetch('/json/data.json')
      .then(response => response.json())
      .then((json) => {
         localStorage.setItem('data', JSON.stringify(json));
      });
  }
})();
