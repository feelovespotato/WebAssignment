async function loadComponent(id, file) {
  const response = await fetch(file);
  const html = await response.text();
  document.getElementById(id).innerHTML = html;
}

loadComponent('welcoming', '../components/productpage/Welcomingsection.html');
loadComponent('category', '../components/productpage/ProductCategory.html');
loadComponent('Search', '../components/productpage/Searchbar.html')