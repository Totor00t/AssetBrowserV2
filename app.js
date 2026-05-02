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

  return {
    str: crc32
  };
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

  items.forEach(item => {
    const div = document.createElement('div');
    div.className = 'item';

    const img = document.createElement('img');
    img.src = new URL('icons/' + item.Hash + '.png', document.baseURI);;

    const text = document.createElement('span');
    text.textContent = item.Name;

    div.appendChild(img);
    div.appendChild(text);

    div.addEventListener('click', () => {
      onItemClick(item);
    });

    list.appendChild(div);
  });
}
function onItemClick(item) {
  var copyText = GetID(item.Name).toString();
   // Copy the text inside the text field
  navigator.clipboard.writeText(copyText)
    .then(() => {
      alert('Copied to clipboard!\n ID: ' + copyText);
    })
    .catch(err => {
      console.error('Failed to copy: ', err);
    });

}
document.getElementById('search').addEventListener('input', (e) => {
  const value = e.target.value.toLowerCase();

  const filtered = itemsData.filter(item =>
    item.Name.toLowerCase().includes(value)
  );

  render(filtered);
});

function GetID(name){
  return CRC32.str(name);
}