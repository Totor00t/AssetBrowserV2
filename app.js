let itemsData = [];

const CRC32 = (() => {
  let table = new Uint32Array(256);
  for (let i = 0; i < 256; i++) {
    let c = i;
    for (let k = 0; k < 8; k++) {
      c = (c & 1) ? (0xEDB88320 ^ (c >>> 1)) : (c >>> 1);
    }
    table[i] = c >>> 0;
  }

  function crc32(str) {
    let crc = 0 ^ (-1);
    for (let i = 0; i < str.length; i++) {
      crc = (crc >>> 8) ^ table[(crc ^ str.charCodeAt(i)) & 0xFF];
    }
    return (crc ^ (-1)) | 0;
  }

  return { str: crc32 };
})();

 fetch('items.json')

  .then(r => r.json())

  .then(items => {

    itemsData = items;

    render(itemsData);

  });


function render(items) {

  const list = document.getElementById('list');

 

  list.innerHTML = '';


  const fragment = document.createDocumentFragment();


  items.forEach(item => {

    const div = document.createElement('div');

    div.className = 'item';


    const img = document.createElement('img');

    img.loading = 'lazy';

    img.src = new URL('icons/' + item.Hash + '.png', document.baseURI).href;

   

    img.width = 50;

    img.height = 50;


    const text = document.createElement('span');

    text.textContent = item.Name;


    div.appendChild(img);

    div.appendChild(text);


    div.addEventListener('click', () => {

      onItemClick(item);

    });


    fragment.appendChild(div);

  });


  list.appendChild(fragment);

} 

function onItemClick(item) {
  const copyText = GetID(item.Name).toString();
  
  navigator.clipboard.writeText(copyText)
    .then(() => {
      alert('Name: ' + item.Name + '\nID: ' + copyText + '\n\nID copied to clipboard.');
    })
    .catch(err => {
      console.error('Error : ', err);
    });
}

let searchTimeout;
document.getElementById('search').addEventListener('input', (e) => {
  clearTimeout(searchTimeout);
  searchTimeout = setTimeout(() => {
    const value = e.target.value.toLowerCase();
    const filtered = itemsData.filter(item =>
      item.Name.toLowerCase().includes(value)
    );
    render(filtered);
  }, 250);
});

document.getElementById('customID').addEventListener('click', () => {
  const input = document.getElementById('customids');
  const name = input.value.trim();

  if (!name) {
    alert('Please enter an item name to generate an ID.');
    return;
  }

  const copyText = GetID(name).toString();

  navigator.clipboard.writeText(copyText)
    .then(() => {
      alert('Copied ID: ' + copyText);
    })
    .catch((err) => {
      console.error('Error copying ID:', err);
    });
});

function GetID(name){
  return CRC32.str(name);
}