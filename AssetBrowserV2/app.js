let itemsData = [];

fetch('items.json')
  .then(r => r.json())
  .then(items => {
    itemsData = items;
    render(itemsData);
  });

function render(items) {
  const list = document.getElementById('list');
  list.innerHTML = '';

  items.forEach(item => {
    const div = document.createElement('div');
    div.className = 'item';

    const img = document.createElement('img');
    img.src = '/icons/' + item.Hash + '.png';
    img.loading = 'lazy';

    const text = document.createElement('span');
    text.textContent = item.Name;

    div.appendChild(img);
    div.appendChild(text);
    list.appendChild(div);
  });
}

document.getElementById('search').addEventListener('input', (e) => {
  const value = e.target.value.toLowerCase();

  const filtered = itemsData.filter(item =>
    item.Name.toLowerCase().includes(value)
  );

  render(filtered);
});