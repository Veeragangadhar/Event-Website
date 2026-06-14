// ===== Sujatha Events - main script =====

// Gallery data: image src is read from hidden img store at runtime
var galleryData = {
  birthday:   { title:'Birthday Celebrations',  sub:'Princess themes, balloon arches & LED setups', defaultImgId:'img-birthday',   extras:[{icon:'🎈',label:'Balloon Arch Setup',desc:'Colourful arrangements for all ages'},{icon:'✨',label:'LED Name Board',desc:'Personalised glowing name boards'},{icon:'🎂',label:'Cake Table Decor',desc:'Themed cake tables with floral accents'}] },
  wedding:    { title:'Wedding & Marriage',      sub:'Traditional & modern wedding setups',          defaultImgId:'img-wedding',    extras:[{icon:'💐',label:'Floral Backdrop',desc:'Full floral wall with custom lettering'},{icon:'🏛️',label:'Grand Entrance',desc:'Welcome gates & flower carpets'}] },
  haldi:      { title:'Haldi Ceremonies',        sub:'Traditional haldi with authentic decor',       defaultImgId:'img-haldi',      extras:[{icon:'🌺',label:'Marigold Flower Wall',desc:'Full marigold wall with banana leaf backdrop'},{icon:'🦚',label:'Traditional Props',desc:'Peacock props, brass lamps, flower rangoli'}] },
  smoke:      { title:'Smoke & Fog Effects',     sub:'Cinematic cloud effects for magical moments',  defaultImgId:'img-smoke',      extras:[{icon:'🎂',label:'Cake Cutting Fog',desc:'Dramatic fog effect at cake cutting'},{icon:'🌫️',label:'Grand Entrance Cloud',desc:'Bride & groom entrance on a cloud'}] },
  engagement: { title:'Engagement Ceremonies',   sub:'Elegant ring ceremony setups',                 defaultImgId:'img-engagement', extras:[{icon:'💡',label:'LED Name Board',desc:'Couple name in golden LED letters'},{icon:'📸',label:'Photo Booth',desc:'Floral frame photo booths for guests'}] },
  babyshower: { title:'Baby Showers & More',     sub:'Traditional & modern baby shower setups',      defaultImgId:'img-babyshower', extras:[{icon:'🎈',label:'Balloon Garland',desc:'Pastel balloon garlands & floral clusters'},{icon:'🌸',label:'Guest Welcome Arch',desc:'Flower arch at entry for guests'}] }
};

// ---- floating petals ----
(function(){
  var petalsArr = ['🌸','🌺','🌼','💐','🌷','✨','🎊','💛'];
  var pc = document.getElementById('petals');
  for(var i=0;i<16;i++){
    var p = document.createElement('div');
    p.className = 'petal';
    p.textContent = petalsArr[Math.floor(Math.random()*petalsArr.length)];
    p.style.left = (Math.random()*100)+'%';
    p.style.fontSize = (0.9+Math.random()*1.1)+'rem';
    p.style.animationDuration = (9+Math.random()*10)+'s';
    p.style.animationDelay = (Math.random()*14)+'s';
    pc.appendChild(p);
  }
})();

// ---- nav ----
function toggleMenu(){ document.getElementById('mobileMenu').classList.toggle('open'); }
function closeMenu(){ document.getElementById('mobileMenu').classList.remove('open'); }
window.addEventListener('scroll', function(){
  document.querySelector('nav').style.background = window.scrollY>50 ? 'rgba(26,10,46,0.99)' : 'rgba(26,10,46,0.96)';
});

// ---- lightbox ----
function openGallery(type){
  var data = galleryData[type];
  if(!data) return;

  document.getElementById('lightboxTitle').textContent = data.title;
  document.getElementById('lightboxSub').textContent = data.sub;
  var container = document.getElementById('lightboxImgs');
  container.innerHTML = '';

  var defaultImg = document.getElementById(data.defaultImgId);
  if(defaultImg){
    var img = document.createElement('img');
    img.src = defaultImg.src;
    img.alt = data.title;
    container.appendChild(img);
  }

  var photoDB = getPhotoDB();
  if(photoDB[type]){
    photoDB[type].forEach(function(photo){
      var img2 = document.createElement('img');
      img2.src = photo.src;
      img2.alt = photo.name || '';
      container.appendChild(img2);
    });
  }

  data.extras.forEach(function(item){
    var div = document.createElement('div');
    div.className = 'demo-placeholder';
    div.innerHTML = '<span>'+item.icon+'</span><div class="dp-label">'+item.label+'</div><div class="dp-desc">'+item.desc+'</div>';
    container.appendChild(div);
  });

  document.getElementById('lightboxOverlay').classList.add('active');
  document.body.style.overflow = 'hidden';
}
function closeLightbox(){
  document.getElementById('lightboxOverlay').classList.remove('active');
  document.body.style.overflow = '';
}
function closeLightboxOutside(e){
  if(e.target === document.getElementById('lightboxOverlay')) closeLightbox();
}
document.addEventListener('keydown', function(e){ if(e.key==='Escape') closeLightbox(); });

// ---- enquiry form + whatsapp ----
var DB_KEY = 'sujatha_events_enquiries';
function getDB(){ try{ return JSON.parse(localStorage.getItem(DB_KEY)||'[]'); }catch(e){ return []; } }
function saveDB(d){ try{ localStorage.setItem(DB_KEY, JSON.stringify(d)); }catch(e){} }

function submitForm(){
  var name   = document.getElementById('f-name').value.trim();
  var phone  = document.getElementById('f-phone').value.trim();
  var email  = document.getElementById('f-email').value.trim();
  var evt    = document.getElementById('f-event').value;
  var date   = document.getElementById('f-date').value;
  var guests = document.getElementById('f-guests').value;
  var msg    = document.getElementById('f-msg').value.trim();

  if(!name){ alert('Please enter your name.'); return; }
  if(!phone){ alert('Please enter your phone number.'); return; }
  if(!evt){ alert('Please select an event type.'); return; }

  var db = getDB();
  db.push({ id:'ENQ-'+Date.now(), timestamp:new Date().toISOString(), name:name, phone:phone, email:email, event:evt, date:date, guests:guests, message:msg, status:'New' });
  saveDB(db);

  document.getElementById('submitBtn').style.display = 'none';
  document.getElementById('formSuccess').style.display = 'block';

  var lines = [];
  lines.push('Hello Sujatha Events!');
  lines.push('');
  lines.push('NEW EVENT ENQUIRY');
  lines.push('-------------------------');
  lines.push('Name: ' + name);
  lines.push('Phone: ' + phone);
  if(email) lines.push('Email: ' + email);
  lines.push('Event: ' + evt);
  lines.push('Date: ' + (date || 'Not specified'));
  lines.push('Guests: ' + (guests || 'Not specified'));
  if(msg) lines.push('Message: ' + msg);
  lines.push('-------------------------');
  lines.push('Please confirm this booking. Thank you!');
  var waText = lines.join('\n');

  setTimeout(function(){
    window.open('https://wa.me/919492946479?text=' + encodeURIComponent(waText), '_blank');
  }, 800);
}

// ---- admin password ----
var ADMIN_PASS = 'sujatha2024';
var adminUnlocked = false;

function checkAdminAccess(){
  if(adminUnlocked){ openAdmin(); return; }
  document.getElementById('adminPassModal').classList.add('open');
  document.getElementById('adminPassInput').value = '';
  document.getElementById('adminPassError').style.display = 'none';
  setTimeout(function(){ document.getElementById('adminPassInput').focus(); }, 200);
}
function closePassModal(){
  document.getElementById('adminPassModal').classList.remove('open');
}
function togglePassView(){
  var inp = document.getElementById('adminPassInput');
  inp.type = inp.type==='password' ? 'text' : 'password';
}
function verifyAdminPass(){
  if(document.getElementById('adminPassInput').value === ADMIN_PASS){
    adminUnlocked = true;
    document.getElementById('adminPassModal').classList.remove('open');
    openAdmin();
  } else {
    document.getElementById('adminPassError').style.display = 'block';
    document.getElementById('adminPassInput').value = '';
    document.getElementById('adminPassInput').focus();
  }
}
document.addEventListener('keydown', function(e){
  if(e.key==='Enter' && document.getElementById('adminPassModal').classList.contains('open')) verifyAdminPass();
});

// ---- admin panel ----
function openAdmin(){
  document.getElementById('adminPanel').classList.add('open');
  document.body.style.overflow = 'hidden';
  switchTab('upload');
}
function closeAdmin(){
  document.getElementById('adminPanel').classList.remove('open');
  document.body.style.overflow = '';
}
function switchTab(name){
  var names = ['upload','manage'];
  document.querySelectorAll('.admin-tab').forEach(function(t,i){
    t.classList.toggle('active', names[i]===name);
  });
  document.querySelectorAll('.admin-section').forEach(function(s){ s.classList.remove('active'); });
  document.getElementById('tab-'+name).classList.add('active');
  if(name==='manage') renderManageGrid('all');
}

// ---- photo upload ----
var PHOTO_DB_KEY = 'sujatha_photos';
var selectedCat = 'birthday';
var pendingFiles = [];

function getPhotoDB(){ try{ return JSON.parse(localStorage.getItem(PHOTO_DB_KEY)||'{}'); }catch(e){ return {}; } }
function savePhotoDB(d){ try{ localStorage.setItem(PHOTO_DB_KEY, JSON.stringify(d)); }catch(e){ showUploadMsg('Storage full! Delete some old photos first.','error'); } }

function selectCat(el){
  document.querySelectorAll('.upload-cat-btn').forEach(function(b){ b.classList.remove('sel'); });
  el.classList.add('sel');
  selectedCat = el.getAttribute('data-cat');
  pendingFiles = [];
  renderPreview();
}
function handleDragOver(e){ e.preventDefault(); document.getElementById('uploadDrop').classList.add('dragover'); }
function handleDragLeave(){ document.getElementById('uploadDrop').classList.remove('dragover'); }
function handleDrop(e){ e.preventDefault(); document.getElementById('uploadDrop').classList.remove('dragover'); handleFiles(e.dataTransfer.files); }
function handleFiles(files){
  Array.from(files).forEach(function(file){
    if(!file.type.match(/^image\//)) return;
    var reader = new FileReader();
    reader.onload = function(ev){
      pendingFiles.push({src: ev.target.result, name: file.name});
      renderPreview();
    };
    reader.readAsDataURL(file);
  });
}
function renderPreview(){
  var c = document.getElementById('uploadPreview');
  c.innerHTML = '';
  pendingFiles.forEach(function(f,i){
    var div = document.createElement('div');
    div.className = 'upload-preview-item';
    div.innerHTML = '<img src="'+f.src+'" alt="preview"/>'
      + '<button class="uprev-del" onclick="removePending('+i+')">x</button>'
      + '<div class="uprev-lbl">'+f.name.substring(0,12)+'</div>';
    c.appendChild(div);
  });
}
function removePending(i){ pendingFiles.splice(i,1); renderPreview(); }
function savePhotos(){
  if(!pendingFiles.length){ showUploadMsg('Please select at least one photo first.','error'); return; }
  var db = getPhotoDB();
  if(!db[selectedCat]) db[selectedCat] = [];
  pendingFiles.forEach(function(f){
    db[selectedCat].push({id:'ph-'+Date.now()+'-'+Math.random().toString(36).substr(2,5), src:f.src, name:f.name, ts:new Date().toISOString()});
  });
  savePhotoDB(db);
  showUploadMsg('Saved '+pendingFiles.length+' photo(s) to '+selectedCat+' gallery! Customers can now see them.','success');
  pendingFiles = [];
  renderPreview();
}
function showUploadMsg(msg,type){
  var el = document.getElementById('uploadMsg');
  el.textContent = msg;
  el.className = 'upload-msg '+type;
  el.style.display = 'block';
  setTimeout(function(){ el.style.display='none'; }, 5000);
}

// ---- manage photos ----
function renderManageGrid(filterCat){
  var db = getPhotoDB();
  var grid = document.getElementById('manageGrid');
  grid.innerHTML = '';
  var all = [];
  Object.keys(db).forEach(function(cat){
    if(filterCat==='all'||filterCat===cat){
      (db[cat]||[]).forEach(function(p){ all.push({id:p.id, src:p.src, name:p.name, cat:cat}); });
    }
  });
  if(!all.length){
    grid.innerHTML = '<div class="no-photos">No photos uploaded yet.<br/>Use Upload tab to add event photos!</div>';
    return;
  }
  var labels = {birthday:'Birthday',wedding:'Wedding',haldi:'Haldi',smoke:'Smoke',engagement:'Engagement',babyshower:'Baby Shower'};
  all.forEach(function(p){
    var div = document.createElement('div');
    div.className = 'manage-item';
    div.innerHTML = '<img src="'+p.src+'" alt="'+p.name+'"/>'
      + '<div class="manage-item-overlay"><button class="mi-del-btn" onclick="deletePhoto(\''+p.cat+'\',\''+p.id+'\')">Del</button></div>'
      + '<div class="mi-cat">'+(labels[p.cat]||p.cat)+'</div>';
    grid.appendChild(div);
  });
}
function filterManage(btn){
  document.querySelectorAll('.mf-btn').forEach(function(b){ b.classList.remove('active'); });
  btn.classList.add('active');
  renderManageGrid(btn.getAttribute('data-cat'));
}
function deletePhoto(cat,id){
  if(!confirm('Delete this photo?')) return;
  var db = getPhotoDB();
  if(db[cat]) db[cat] = db[cat].filter(function(p){ return p.id!==id; });
  savePhotoDB(db);
  renderManageGrid(document.querySelector('.mf-btn.active').getAttribute('data-cat'));
}
