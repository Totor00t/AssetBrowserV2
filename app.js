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
  
  // On vide la liste
  list.innerHTML = '';

  // 1. Utilisation d'un DocumentFragment (mémoire tampon)
  // Cela évite de mettre à jour le DOM 1000 fois, on le fait 1 seule fois à la fin.
  const fragment = document.createDocumentFragment();

  items.forEach(item => {
    const div = document.createElement('div');
    div.className = 'item';

    const img = document.createElement('img');
    // 2. LE LAZY LOADING : l'image ne charge que si elle approche du champ de vision
    img.loading = 'lazy'; 
    img.src = new URL('icons/' + item.Hash + '.png', document.baseURI).href;
    
    // Optionnel : Ajouter une largeur/hauteur fixe en CSS pour que le 
    // navigateur réserve l'espace avant que l'image ne charge (évite les sauts d'écran)
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

  // 3. Injection finale unique
  list.appendChild(fragment);
}

function onItemClick(item) {
  // Le calcul CRC32 se fait ici, seulement quand on en a besoin
  const copyText = GetID(item.Name).toString();
  
  navigator.clipboard.writeText(copyText)
    .then(() => {
      alert('Copié ! \nNom: ' + item.Name + '\nID: ' + copyText);
    })
    .catch(err => {
      console.error('Erreur de copie : ', err);
    });
}

// Ajout d'un petit délai (debounce) sur la recherche pour éviter les freezes en tapant
let searchTimeout;
document.getElementById('search').addEventListener('input', (e) => {
  clearTimeout(searchTimeout);
  searchTimeout = setTimeout(() => {
    const value = e.target.value.toLowerCase();
    const filtered = itemsData.filter(item =>
      item.Name.toLowerCase().includes(value)
    );
    render(filtered);
  }, 250); // Attend 250ms après la fin de la frappe
});

function GetID(name){
  return CRC32.str(name);
}