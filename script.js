  // ---- USUARIOS: Registro, Login, Sesión ----
  function obtenerUsuarios() {
    return JSON.parse(localStorage.getItem('usuarios') || "[]");
  }
  function guardarUsuarios(arr) {
    localStorage.setItem('usuarios', JSON.stringify(arr));
  }
  function guardarUsuarioSesion(usuario) {
    localStorage.setItem('usuarioSesion', JSON.stringify(usuario));
  }
  function obtenerUsuarioSesion() {
    return JSON.parse(localStorage.getItem('usuarioSesion') || "null");
  }
  function cerrarSesion() {
    localStorage.removeItem('usuarioSesion');
    actualizarEstadoSesion();
  }

  function mostrarModalRegistro() {
    document.getElementById('formRegistroUsuario').reset();
    new bootstrap.Modal(document.getElementById('modalRegistro')).show();
  }
  function mostrarModalLogin() {
    document.getElementById('formLoginUsuario').reset();
    new bootstrap.Modal(document.getElementById('modalLogin')).show();
  }
  window.mostrarModalRegistro = mostrarModalRegistro;
  window.mostrarModalLogin = mostrarModalLogin;
  window.cerrarSesion = cerrarSesion;

  // ---- REGISTRO DE USUARIO (con fecha y nacionalidad) ----
  document.addEventListener('DOMContentLoaded', function() {
    if (document.getElementById('formRegistroUsuario')) {
      document.getElementById('formRegistroUsuario').onsubmit = function(e) {
        e.preventDefault();
        const nombre = document.getElementById('regNombre').value.trim();
        const correo = document.getElementById('regCorreo').value.trim();
        const clave = document.getElementById('regClave').value;
        const nacimiento = document.getElementById('regNacimiento').value;
        const nacionalidad = document.getElementById('regNacionalidad').value;
        const telefono = document.getElementById('regTelefono').value.trim();
        if (!nombre || !correo || !clave || !nacimiento || !nacionalidad) {
          alert('Completa todos los campos obligatorios');
          return;
        }
        let usuarios = obtenerUsuarios();
        if (usuarios.find(u => u.correo.toLowerCase() === correo.toLowerCase())) {
          alert('Ya existe un usuario con ese correo');
          return;
        }
        const usuario = { nombre, correo, clave, nacimiento, nacionalidad, telefono, favoritos: { hoteles: [], atractivos: [] } };

        usuarios.push(usuario);
        guardarUsuarios(usuarios);
        alert('Usuario registrado correctamente. Ahora puedes iniciar sesión.');
        bootstrap.Modal.getInstance(document.getElementById('modalRegistro')).hide();
      };
    }

    if (document.getElementById('formLoginUsuario')) {
      document.getElementById('formLoginUsuario').onsubmit = function(e) {
        e.preventDefault();
        const correo = document.getElementById('loginCorreo').value.trim();
        const clave = document.getElementById('loginClave').value;
        let usuarios = obtenerUsuarios();
        const usuario = usuarios.find(u => u.correo.toLowerCase() === correo.toLowerCase() && u.clave === clave);
        if (!usuario) {
          alert('Correo o contraseña incorrectos');
          return;
        }
        guardarUsuarioSesion(usuario);
        bootstrap.Modal.getInstance(document.getElementById('modalLogin')).hide();
        actualizarEstadoSesion();
      };
    }

    actualizarEstadoSesion();
  });

  // ---- ACTUALIZAR SESIÓN (bloquea o desbloquea registro de hoteles/atractivos) ----
function actualizarEstadoSesion() {
  const usuario = obtenerUsuarioSesion();
  const saludo = document.getElementById('saludoUsuario');
  const btnCerrar = document.getElementById('btnCerrarSesion');
  const btnLogin = document.querySelector('button[onclick="mostrarModalLogin()"]');
  const btnRegistro = document.querySelector('button[onclick="mostrarModalRegistro()"]');
  const btnRecomendaciones = document.querySelector('button[onclick="mostrarRecomendaciones()"]');
  const btnPerfil = document.getElementById('btnPerfil');
if (usuario) {
    if (btnPerfil) btnPerfil.classList.remove('d-none');
} else {
    if (btnPerfil) btnPerfil.classList.add('d-none');
}

  const bloqueo = document.getElementById('bloqueoSesion');
  const tipoLugar = document.getElementById('tipoLugar');

  if (usuario) {
    if (saludo) saludo.innerText = "Bienvenido, " + usuario.nombre.split(' ')[0];
    if (btnCerrar) btnCerrar.classList.remove('d-none');
    if (btnLogin) btnLogin.style.display = "none";
    if (btnRegistro) btnRegistro.style.display = "none";
    if (btnRecomendaciones) btnRecomendaciones.style.display = "";
    if (btnPerfil) btnPerfil.style.display = "";
    if (bloqueo) bloqueo.style.display = "none";
    if (tipoLugar) tipoLugar.disabled = false;
    mostrarFormulario();
  } else {
    if (saludo) saludo.innerText = "";
    if (btnCerrar) btnCerrar.classList.add('d-none');
    if (btnLogin) btnLogin.style.display = "";
    if (btnRegistro) btnRegistro.style.display = "";
    if (btnRecomendaciones) btnRecomendaciones.style.display = "none";
    if (btnPerfil) btnPerfil.style.display = "none";
    if (bloqueo) bloqueo.style.display = "block";
    if (tipoLugar) tipoLugar.disabled = true;
    document.getElementById('formularioLugar').innerHTML = "";
  }
}


  // ---- GESTIÓN DE HOTELES Y ATRACTIVOS (igual que antes) ----
  function obtenerDatos() {
    return {
      hoteles: JSON.parse(localStorage.getItem('hoteles') || "[]"),
      atractivos: JSON.parse(localStorage.getItem('atractivos') || "[]")
    };
  }
  function guardarDatos(tipo, data) {
    localStorage.setItem(tipo, JSON.stringify(data));
  }

  function mostrarFormulario() {
    const tipo = document.getElementById('tipoLugar').value;
    const cont = document.getElementById('formularioLugar');
    if (tipo === "hotel") {
      cont.innerHTML = `
        <form id="formHotel">
          <div class="mb-2">
            <label class="form-label">Nombre del Hotel</label>
            <input class="form-control" type="text" id="nombreHotel" required>
          </div>
          <div class="mb-2">
            <label class="form-label">Ubicación</label>
            <input class="form-control" type="text" id="ubicacionHotel" required>
          </div>
          <div class="mb-2">
            <label class="form-label">Descripción</label>
            <textarea class="form-control" id="descripcionHotel" rows="2" required></textarea>
          </div>
          <button type="submit" class="btn btn-warning mt-2"><i class="fas fa-plus"></i> Registrar Hotel</button>
        </form>
      `;
      document.getElementById('formHotel').onsubmit = function(e){
        e.preventDefault();
        agregarHotel();
      };
    } else if (tipo === "atractivo") {
      cont.innerHTML = `
        <form id="formAtractivo">
          <div class="mb-2">
            <label class="form-label">Nombre del Atractivo</label>
            <input class="form-control" type="text" id="nombreAtractivo" required>
          </div>
          <div class="mb-2">
            <label class="form-label">Ubicación</label>
            <input class="form-control" type="text" id="ubicacionAtractivo" required>
          </div>
          <div class="mb-2">
            <label class="form-label">Descripción</label>
            <textarea class="form-control" id="descripcionAtractivo" rows="2" required></textarea>
          </div>
          <button type="submit" class="btn btn-secondary mt-2"><i class="fas fa-plus"></i> Registrar Atractivo</button>
        </form>
      `;
      document.getElementById('formAtractivo').onsubmit = function(e){
        e.preventDefault();
        agregarAtractivo();
      };
    } else {
      cont.innerHTML = '';
    }
  }

function agregarHotel() {
  const nombre = document.getElementById('nombreHotel').value.trim();
  const ubicacion = document.getElementById('ubicacionHotel').value.trim();
  const descripcion = document.getElementById('descripcionHotel').value.trim();
  if (nombre && ubicacion && descripcion) {
    const datos = obtenerDatos();
    datos.hoteles.push({ nombre, ubicacion, descripcion }); // <-- aquí
    guardarDatos('hoteles', datos.hoteles);
    mostrarHoteles();
    document.getElementById('formHotel').reset();
  }
}

function agregarAtractivo() {
  const nombre = document.getElementById('nombreAtractivo').value.trim();
  const ubicacion = document.getElementById('ubicacionAtractivo').value.trim();
  const descripcion = document.getElementById('descripcionAtractivo').value.trim();
  if (nombre && ubicacion && descripcion) {
    const datos = obtenerDatos();
    datos.atractivos.push({ nombre, ubicacion, descripcion }); // <-- aquí
    guardarDatos('atractivos', datos.atractivos);
    mostrarAtractivos();
    document.getElementById('formAtractivo').reset();
  }
}



  function agregarAtractivo() {
    const nombre = document.getElementById('nombreAtractivo').value.trim();
    const ubicacion = document.getElementById('ubicacionAtractivo').value.trim();
    const descripcion = document.getElementById('descripcionAtractivo').value.trim();
    if (nombre && ubicacion && descripcion) {
      const datos = obtenerDatos();
      datos.atractivos.push({ nombre, ubicacion, descripcion });
      guardarDatos('atractivos', datos.atractivos);
      mostrarAtractivos();
      document.getElementById('formAtractivo').reset();
    }
  }

  function mostrarHoteles() {
  const lista = document.getElementById('listaHoteles');
  const datos = obtenerDatos().hoteles;
  const usuario = obtenerUsuarioSesion();
  let favoritos = usuario && usuario.favoritos ? usuario.favoritos.hoteles : [];

  if (!datos.length) {
    lista.innerHTML = `<div class="col-12 text-muted">No hay hoteles registrados.</div>`;
    return;
  }
  lista.innerHTML = datos.map((h, idx) => {
    let isFav = favoritos && favoritos.includes(idx);
    return `
      <div class="col-md-6 col-lg-4">
        <div class="card border-warning">
          <div class="card-body">
            <h5 class="card-title">
              <i class="fas fa-hotel me-2"></i>${h.nombre}
              <span style="float:right;cursor:pointer;" title="Favorito" onclick="toggleFavoritoHotel(${idx})">
                <i class="fa${isFav ? 's' : 'r'} fa-star text-warning"></i>
              </span>
            </h5>
            <p class="card-text"><strong>Ubicación:</strong> ${h.ubicacion}</p>
            <p class="card-text">${h.descripcion}</p>
            <button class="btn btn-sm btn-danger" onclick="eliminarHotel(${idx})"><i class="fas fa-trash"></i> Eliminar</button>
            <button class="btn btn-sm btn-primary mt-2" onclick="mostrarComentarios('hotel', ${idx})">
              <i class="fas fa-comments"></i> Comentarios
            </button>
          </div>
        </div>
      </div>
    `;
  }).join('');
}

  function toggleFavoritoHotel(idx) {
    let usuario = obtenerUsuarioSesion();
    if (!usuario) return alert('Inicia sesión para guardar favoritos');
    if (!usuario.favoritos) usuario.favoritos = { hoteles: [], atractivos: [] };
    let favs = usuario.favoritos.hoteles;
    let i = favs.indexOf(idx);
    if (i === -1) {
      favs.push(idx);
    } else {
      favs.splice(i, 1);
    }
    // Actualiza en LocalStorage
    let usuarios = obtenerUsuarios();
    let uidx = usuarios.findIndex(u => u.correo === usuario.correo);
    usuarios[uidx].favoritos = usuario.favoritos;
    guardarUsuarios(usuarios);
    guardarUsuarioSesion(usuario);
    mostrarHoteles();
  }
  window.toggleFavoritoHotel = toggleFavoritoHotel;



  
  function toggleFavoritoAtractivo(idx) {
    let usuario = obtenerUsuarioSesion();
    if (!usuario) return alert('Inicia sesión para guardar favoritos');
    if (!usuario.favoritos) usuario.favoritos = { hoteles: [], atractivos: [] };
    let favs = usuario.favoritos.atractivos;
    let i = favs.indexOf(idx);
    if (i === -1) {
      favs.push(idx);
    } else {
      favs.splice(i, 1);
    }
    // Actualiza en LocalStorage
    let usuarios = obtenerUsuarios();
    let uidx = usuarios.findIndex(u => u.correo === usuario.correo);
    usuarios[uidx].favoritos = usuario.favoritos;
    guardarUsuarios(usuarios);
    guardarUsuarioSesion(usuario);
    mostrarAtractivos();
  }
  window.toggleFavoritoAtractivo = toggleFavoritoAtractivo;


  function eliminarHotel(idx) {
    if (confirm('¿Eliminar este hotel?')) {
      const datos = obtenerDatos();
      datos.hoteles.splice(idx, 1);
      guardarDatos('hoteles', datos.hoteles);
      mostrarHoteles();
    }
  }
function mostrarAtractivos() {
  const lista = document.getElementById('listaAtractivos');
  const datos = obtenerDatos().atractivos;
  const usuario = obtenerUsuarioSesion();
  let favoritos = usuario && usuario.favoritos ? usuario.favoritos.atractivos : [];

  if (!datos.length) {
    lista.innerHTML = `<div class="col-12 text-muted">No hay atractivos registrados.</div>`;
    return;
  }
  lista.innerHTML = datos.map((a, idx) => {
    let isFav = favoritos && favoritos.includes(idx);
    return `
      <div class="col-md-6 col-lg-4">
        <div class="card border-secondary">
          <div class="card-body">
            <h5 class="card-title d-flex justify-content-between align-items-center">
              <span>
                <i class="fas fa-map-marker-alt me-2"></i>${a.nombre}
              </span>
              <span style="cursor:pointer;" title="Agregar/Quitar Favorito" onclick="toggleFavoritoAtractivo(${idx})">
                <i class="fa${isFav ? 's' : 'r'} fa-star text-warning"></i>
              </span>
            </h5>
            <p class="card-text"><strong>Ubicación:</strong> ${a.ubicacion}</p>
            <p class="card-text">${a.descripcion}</p>
            <button class="btn btn-sm btn-danger" onclick="eliminarAtractivo(${idx})"><i class="fas fa-trash"></i> Eliminar</button>
            <button class="btn btn-sm btn-primary mt-2" onclick="mostrarComentarios('atractivo', ${idx})">
              <i class="fas fa-comments"></i> Comentarios
            </button>
          </div>
        </div>
      </div>
    `;
  }).join('');
}

  function eliminarAtractivo(idx) {
    if (confirm('¿Eliminar este atractivo?')) {
      const datos = obtenerDatos();
      datos.atractivos.splice(idx, 1);
      guardarDatos('atractivos', datos.atractivos);
      mostrarAtractivos();
    }
  }

  window.eliminarHotel = eliminarHotel;
  window.eliminarAtractivo = eliminarAtractivo;

  document.addEventListener('DOMContentLoaded', function(){
    mostrarFormulario();
    mostrarHoteles();
    mostrarAtractivos();
    document.getElementById('tipoLugar').addEventListener('change', mostrarFormulario);
  });

  // ---- DESCARGA Y MODAL DE RECORRIDO VIRTUAL ----
  function descargarArchivo(){
    alert("Función de descarga aún no implementada.");
  }

  function mostrarModal(titulo, imagen, descripcion) {
    document.getElementById('modalTitulo').innerText = titulo;
    document.getElementById('modalImagen').src = imagen;
    document.getElementById('modalDescripcion').innerText = descripcion;
    var modal = new bootstrap.Modal(document.getElementById('imagenModal'));
    modal.show();
  }
  window.mostrarModal = mostrarModal;

  // Lista de recomendaciones (puedes agregar más)
  const recomendaciones = [
     
  {
    titulo: "Fiesta de la Virgen de la Candelaria",
    descripcion: "La festividad más grande de Puno y una de las más importantes del Perú, reconocida por la UNESCO. Incluye danzas típicas, pasacalles, concursos y procesiones religiosas con miles de participantes.",
    fecha: "2 al 18 de febrero (principal día: 2 de febrero)",
    imagen: "https://radioondaazul.com/wp-content/uploads/2025/01/Presentacion-Candelaria-2025.jpg"
  },
  {
    titulo: "Festividad de San Juan",
    descripcion: "Celebración religiosa y popular con actividades gastronómicas, música y rituales relacionados al agua. Es ideal para degustar platos típicos de la región.",
    fecha: "24 de junio",
    imagen: "https://www.enperu.org/festividades/wp-content/uploads/2016/07/san-juan-de-dios-full.jpg"
  },
  {
    titulo: "Día de la Fundación de Puno",
    descripcion: "Conmemora la mítica salida de Manco Cápac y Mama Ocllo del Lago Titicaca. Hay desfiles, danzas autóctonas y recreaciones históricas.",
    fecha: "4 y 5 de noviembre",
    imagen: "https://www.ytuqueplanes.com/imagenes//fotos/novedades/interna-aniversario-puno-2.jpg"
  },
  {
    titulo: "Festival de Alasitas",
    descripcion: "Feria tradicional donde se compran miniaturas para atraer la prosperidad, salud y abundancia, en honor al dios Ekeko.",
    fecha: "3 de mayo",
    imagen: "https://www.infobae.com/resizer/v2/DGQD7POWWJCHNHEFG7RHGIGN2M.jpg?auth=8a81f851e15b2334ed894c26134da2c027214e75e70ab2446381560491f21077&smart=true&width=992&height=558&quality=85"
  },
  {
    titulo: "Semana Santa en Juli",
    descripcion: "Semana Santa en Juli (la 'Pequeña Roma de América') destaca por sus imponentes iglesias coloniales, procesiones y fervor religioso.",
    fecha: "Fechas móviles en marzo o abril",
    imagen: "https://encuentro.pe/wp-content/uploads/2025/04/Alfombras-Chucuito-OK.jpg"
  },

 
  {
    titulo: "Día del Lago Titicaca",
    descripcion: "Se celebran actividades culturales, navegaciones y rituales en honor al lago navegable más alto del mundo.",
    fecha: "22 de noviembre",
    imagen: "https://portal.andina.pe/EDPfotografia/Thumbnail/2015/03/24/000286680W.jpg"
  },
  {
    titulo: "Día del Campesino",
    descripcion: "Reconocimiento a la labor de los campesinos, con ferias, danzas y actividades culturales en toda la región.",
    fecha: "24 de junio",
    imagen: "https://www.elperuchito.com/wp-content/uploads/2014/09/Feliz-d%C3%ADa-del-campesino-peruano.jpg"
  },
  {
    titulo: "Festival de la Cruz de Mayo",
    descripcion: "Celebración tradicional andina donde se decoran cruces con flores y se realizan procesiones y rituales.",
    fecha: "3 de mayo",
    imagen: "https://www.bitacorarevista.com/web/wp-content/uploads/000583497M.jpg"
  },
  
  
  {
    titulo: "Atractivo: Isla Taquile",
    descripcion: "Famosa por sus tejidos declarados Patrimonio Cultural Inmaterial de la Humanidad y su paisaje de terrazas agrícolas sobre el Titicaca.",
    fecha: "Todo el año",
    imagen: "https://machupicchuwayna.com/wp-content/uploads/2025/04/Taquile-puno.png"
  },
  {
    titulo: "Atractivo: Arco Deustua",
    descripcion: "Histórico monumento de piedra y mirador emblemático de la ciudad, punto de encuentro para celebraciones y eventos populares.",
    fecha: "Todo el año",
    imagen: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTyYH_uP7YJl3C3Ly7HaKZwvrDg3Ix7DLxDDw&s"
  },
  {
    titulo: "Atractivo: Catedral de Puno",
    descripcion: "Imponente templo barroco andino del siglo XVIII, símbolo religioso y arquitectónico de la ciudad de Puno.",
    fecha: "Todo el año",
    imagen: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTMl1HkfNodWgnCZTTmtbl_nMYzmmNyssO-Lw&s"
  },
  {
    titulo: "Atractivo: Mirador Kuntur Wasi",
    descripcion: "Uno de los mejores puntos panorámicos de Puno, ofrece vistas espectaculares de la ciudad y el Lago Titicaca.",
    fecha: "Todo el año",
    imagen: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcT-FcE-WhiT1AROJqNCWHP8xmjC_QAVJ-RMSA&s"
  }

  ];

  // Mostrar la sección de recomendaciones y ocultar otras
  function mostrarRecomendaciones() {
    document.getElementById('seccionPerfil').style.display = 'none'; // <- esto
    document.getElementById('seccionRecomendaciones').style.display = 'block';
    window.scrollTo({ top: document.getElementById('seccionRecomendaciones').offsetTop - 70, behavior: "smooth" });
    renderizarRecomendaciones();
  }
  window.mostrarRecomendaciones = mostrarRecomendaciones;

  // Renderizar las tarjetas de recomendaciones
  function renderizarRecomendaciones() {
  const cont = document.getElementById('listaRecomendaciones');
  cont.innerHTML = recomendaciones.map((r, idx) => `
    <div class="col-md-6 col-lg-4 mb-3">
      <div class="card h-100 border-primary shadow-sm pointer" onclick="mostrarModalRecomendacion(${idx})">
        <img src="${r.imagen}" class="card-img-top" alt="${r.titulo}" style="height: 170px; object-fit: cover;">
        <div class="card-body">
          <h5 class="card-title">${r.titulo}</h5>
          <p class="card-text text-secondary">${r.descripcion.substring(0, 80)}...</p>
          <span class="badge bg-primary">${r.fecha}</span>
        </div>
      </div>
    </div>
  `).join('');
}


  // Mostrar modal con info de recomendación
  function mostrarModalRecomendacion(idx) {
    const r = recomendaciones[idx];
    document.getElementById('modalRecTitulo').innerText = r.titulo;
    document.getElementById('modalRecDescripcion').innerText = r.descripcion;
    document.getElementById('modalRecFecha').innerText = "Fecha: " + r.fecha;
    var modal = new bootstrap.Modal(document.getElementById('modalRecomendacion'));
    modal.show();
  }
  window.mostrarModalRecomendacion = mostrarModalRecomendacion;

  // === PERFIL DE USUARIO: VER, EDITAR Y GUARDAR ===

  function mostrarPerfil() {
  document.getElementById('seccionPerfil').style.display = 'block';
  if (document.getElementById('seccionRecomendaciones'))
    document.getElementById('seccionRecomendaciones').style.display = 'none';

  // Oculta ambas secciones por defecto
  document.getElementById('seccionFavoritosPerfil').style.display = 'none';
  document.getElementById('seccionEditarPerfil').style.display = 'none';
}
window.mostrarPerfil = mostrarPerfil;

function mostrarFavoritosUsuario() {
  const usuario = obtenerUsuarioSesion();
  if (!usuario) return;

  // HOTELS
  const hoteles = obtenerDatos().hoteles;
  const favHoteles = usuario.favoritos && usuario.favoritos.hoteles ? usuario.favoritos.hoteles : [];
  const listaHoteles = document.getElementById('favoritosHotelesLista');
  listaHoteles.innerHTML = favHoteles.length === 0
    ? `<li class="list-group-item text-muted">No tienes hoteles favoritos.</li>`
    : favHoteles.map(idx =>
        `<li class="list-group-item d-flex justify-content-between align-items-center">
          ${hoteles[idx]?.nombre || '[Hotel eliminado]'}
          <button class="btn btn-sm btn-outline-danger" title="Quitar de favoritos"
            onclick="toggleFavoritoHotel(${idx})"><i class="fas fa-times"></i></button>
        </li>`
      ).join('');

  // ATRACTIVOS
  const atractivos = obtenerDatos().atractivos;
  const favAtractivos = usuario.favoritos && usuario.favoritos.atractivos ? usuario.favoritos.atractivos : [];
  const listaAtractivos = document.getElementById('favoritosAtractivosLista');
  listaAtractivos.innerHTML = favAtractivos.length === 0
    ? `<li class="list-group-item text-muted">No tienes atractivos favoritos.</li>`
    : favAtractivos.map(idx =>
        `<li class="list-group-item d-flex justify-content-between align-items-center">
          ${atractivos[idx]?.nombre || '[Atractivo eliminado]'}
          <button class="btn btn-sm btn-outline-danger" title="Quitar de favoritos"
            onclick="toggleFavoritoAtractivo(${idx})"><i class="fas fa-times"></i></button>
        </li>`
      ).join('');
}


  // FUNCION para rellenar datos del perfil
  function cargarDatosPerfil() {
    const usuario = obtenerUsuarioSesion();
    if (!usuario) {
      alert("Debes iniciar sesión para ver tu perfil.");
      return;
    }
    document.getElementById('perfilNombre').value = usuario.nombre || '';
    document.getElementById('perfilCorreo').value = usuario.correo || '';
    document.getElementById('perfilNacimiento').value = usuario.nacimiento || '';
    document.getElementById('perfilNacionalidad').value = usuario.nacionalidad || '';
    document.getElementById('perfilTelefono').value = usuario.telefono || '';
    // El campo contraseña lo puedes dejar con asteriscos
    document.getElementById('perfilClave').value = "********";
  }
let tipoComentario = null;
let idxComentario = null;

// Mostrar comentarios (general: para hoteles o atractivos)
function mostrarComentarios(tipo, idx) {
  tipoComentario = tipo;
  idxComentario = idx;
  let datos = obtenerDatos();
  let item, nombre;
  if (tipo === 'hotel') {
    item = datos.hoteles[idx];
    nombre = item?.nombre || '';
  } else {
    item = datos.atractivos[idx];
    nombre = item?.nombre || '';
  }
  document.getElementById('tituloComentarios').innerText = `Comentarios de ${nombre}`;
  const lista = document.getElementById('listaComentarios');
  if (!item.comentarios || item.comentarios.length === 0) {
    lista.innerHTML = `<li class="list-group-item text-muted">No hay comentarios aún.</li>`;
  } else {
    lista.innerHTML = item.comentarios.map(c =>
      `<li class="list-group-item"><b>${c.usuario}:</b> ${c.comentario}</li>`
    ).join('');
  }
  document.getElementById('inputComentario').value = '';
  new bootstrap.Modal(document.getElementById('modalComentarios')).show();
}
window.mostrarComentarios = mostrarComentarios;

// Agregar comentario (sirve para ambos)

document.addEventListener('DOMContentLoaded', function () {
  const formComentario = document.getElementById('formComentario');
  if (formComentario) {
    formComentario.onsubmit = function(e) {
      e.preventDefault();
      const usuario = obtenerUsuarioSesion();
      if (!usuario) return alert("Debes iniciar sesión para comentar.");
      const texto = document.getElementById('inputComentario').value.trim();
      if (!texto) return;

      let datos = obtenerDatos();
      let item;
      if (tipoComentario === 'hotel') {
        item = datos.hoteles[idxComentario];
        if (!item.comentarios) item.comentarios = [];
        item.comentarios.push({ usuario: usuario.nombre.split(' ')[0], comentario: texto });
        guardarDatos('hoteles', datos.hoteles);
        mostrarComentarios('hotel', idxComentario);
      } else if (tipoComentario === 'atractivo') {
        item = datos.atractivos[idxComentario];
        if (!item.comentarios) item.comentarios = [];
        item.comentarios.push({ usuario: usuario.nombre.split(' ')[0], comentario: texto });
        guardarDatos('atractivos', datos.atractivos);
        mostrarComentarios('atractivo', idxComentario);
      }
    }
  }
});

function getComentarios(tipo, idx) {
  const key = `comentarios_${tipo}_${idx}`;
  return JSON.parse(localStorage.getItem(key) || "[]");
}
function saveComentarios(tipo, idx, comentarios) {
  const key = `comentarios_${tipo}_${idx}`;
  localStorage.setItem(key, JSON.stringify(comentarios));
}

// Función para mostrar comentarios
function mostrarComentarios(tipo, idx) {
  // Mostrar modal
  const datos = obtenerDatos();
  let titulo = "";
  if (tipo === "hotel") {
    titulo = datos.hoteles[idx] ? `Comentarios de: ${datos.hoteles[idx].nombre}` : "Comentarios";
  } else {
    titulo = datos.atractivos[idx] ? `Comentarios de: ${datos.atractivos[idx].nombre}` : "Comentarios";
  }
  document.getElementById('modalComentariosTitulo').innerText = titulo;

  // Mostrar lista de comentarios
  const comentarios = getComentarios(tipo, idx);
  const ul = document.getElementById('comentariosLista');
  if (!comentarios.length) {
    ul.innerHTML = `<li class="list-group-item text-muted">No hay comentarios aún.</li>`;
  } else {
    ul.innerHTML = comentarios.map(c =>
      `<li class="list-group-item"><strong>${c.nombre}:</strong> ${c.texto}</li>`
    ).join('');
  }

  // Resetear textarea
  document.getElementById('comentarioTexto').value = "";

  // Guardar tipo e idx temporalmente en el form para usar en submit
  const form = document.getElementById('formAgregarComentario');
  form.setAttribute('data-tipo', tipo);
  form.setAttribute('data-idx', idx);

  // Mostrar modal
  new bootstrap.Modal(document.getElementById('modalComentarios')).show();
}
window.mostrarComentarios = mostrarComentarios;

// Evento para agregar comentario
document.addEventListener('DOMContentLoaded', function () {
  const form = document.getElementById('formAgregarComentario');
  if (form) {
    form.onsubmit = function(e) {
      e.preventDefault();
      const tipo = form.getAttribute('data-tipo');
      const idx = form.getAttribute('data-idx');
      const texto = document.getElementById('comentarioTexto').value.trim();
      const usuario = obtenerUsuarioSesion();
      if (!usuario) {
        alert("Debes iniciar sesión para comentar.");
        return;
      }
      if (!texto) return;
      let comentarios = getComentarios(tipo, idx);
      comentarios.push({
        nombre: usuario.nombre.split(' ')[0] || 'Invitado',
        texto: texto
      });
      saveComentarios(tipo, idx, comentarios);
      mostrarComentarios(tipo, idx); // Refrescar
    };
  }
});
function mostrarSeccionPerfil(seccion) {
  document.getElementById('seccionPerfil').style.display = 'block';
  document.getElementById('seccionFavoritosPerfil').style.display = (seccion === 'favoritos') ? '' : 'none';
  document.getElementById('seccionEditarPerfil').style.display = (seccion === 'editar') ? '' : 'none';
  if (seccion === 'favoritos') mostrarFavoritosUsuario();
  if (seccion === 'editar') cargarDatosPerfil();
}
window.mostrarSeccionPerfil = mostrarSeccionPerfil;

function abrirSidebarPerfil() {
  cargarSidebarEditar(); // Por defecto abre el perfil
  document.getElementById('sidebarPerfil').classList.add('abierto');
  document.getElementById('sidebarOverlay').classList.add('visible');
}
function cerrarSidebarPerfil() {
  document.getElementById('sidebarPerfil').classList.remove('abierto');
  document.getElementById('sidebarOverlay').classList.remove('visible');
}
window.abrirSidebarPerfil = abrirSidebarPerfil;
window.cerrarSidebarPerfil = cerrarSidebarPerfil;



// Mostrar solo el contenido "Editar perfil" en el sidebar
function cargarSidebarEditar() {
  const usuario = obtenerUsuarioSesion();
  if (!usuario) return;
  const cont = document.getElementById('sidebarPerfilContenido');
  cont.innerHTML = `
    <form id="formSidebarEditarPerfil" class="px-3">
      <div class="mb-2">
        <label class="form-label">Nombre</label>
        <input class="form-control" type="text" id="sidebarPerfilNombre" value="${usuario.nombre}" disabled>
      </div>
      <div class="mb-2">
        <label class="form-label">Correo</label>
        <input class="form-control" type="email" id="sidebarPerfilCorreo" value="${usuario.correo}" disabled>
      </div>
      <div class="mb-2">
        <label class="form-label">Fecha de nacimiento</label>
        <input class="form-control" type="date" id="sidebarPerfilNacimiento" value="${usuario.nacimiento}" disabled>
      </div>
      <div class="mb-2">
        <label class="form-label">Nacionalidad</label>
        <input class="form-control" type="text" id="sidebarPerfilNacionalidad" value="${usuario.nacionalidad}" disabled>
      </div>
      <div class="mb-2">
        <label class="form-label">Teléfono</label>
        <input class="form-control" type="text" id="sidebarPerfilTelefono" value="${usuario.telefono}" disabled>
      </div>
      <div class="mb-2">
        <label class="form-label">Contraseña</label>
        <input class="form-control" type="password" value="********" disabled>
      </div>
      <button type="button" class="btn btn-outline-info w-100" onclick="habilitarEdicionSidebarPerfil()">Editar</button>
      <button type="submit" id="btnGuardarPerfil" class="btn btn-primary w-100 mt-2 d-none">Guardar</button>
      <button type="button" id="btnCancelarPerfil" class="btn btn-secondary w-100 mt-2 d-none" onclick="cargarSidebarEditar()">Cancelar</button>
    </form>
  `;
  // Aquí puedes agregar lógica para editar si lo deseas
}

// Mostrar solo el contenido "Favoritos" en el sidebar
function cargarSidebarFavoritos() {
  const usuario = obtenerUsuarioSesion();
  const hoteles = obtenerDatos().hoteles;
  const atractivos = obtenerDatos().atractivos;
  const favHoteles = usuario.favoritos && usuario.favoritos.hoteles ? usuario.favoritos.hoteles : [];
  const favAtractivos = usuario.favoritos && usuario.favoritos.atractivos ? usuario.favoritos.atractivos : [];

  let html = `<h5 class="mb-3 text-info"><i class="fas fa-star"></i> Mis Favoritos</h5>`;

  // Hoteles favoritos
  html += `<h6 class="text-warning">Hoteles</h6>`;
  if (favHoteles.length === 0) {
    html += `<div class="text-muted mb-3">No tienes hoteles favoritos.</div>`;
  } else {
    favHoteles.forEach(idx => {
      const h = hoteles[idx];
      if (h) {
        html += `
        <div class="card border-warning mb-3">
          <div class="card-body py-2">
            <h6 class="card-title mb-1"><i class="fas fa-hotel me-2"></i>${h.nombre}</h6>
            <div class="small"><strong>Ubicación:</strong> ${h.ubicacion}</div>
            <div class="small mb-2"><strong>Descripción:</strong> ${h.descripcion}</div>
            <button class="btn btn-sm btn-outline-danger" onclick="toggleFavoritoHotel(${idx})"><i class="fas fa-times"></i> Quitar</button>
          </div>
        </div>`;
      }
    });
  }

  // Atractivos favoritos
  html += `<h6 class="text-success">Atractivos</h6>`;
  if (favAtractivos.length === 0) {
    html += `<div class="text-muted mb-3">No tienes atractivos favoritos.</div>`;
  } else {
    favAtractivos.forEach(idx => {
      const a = atractivos[idx];
      if (a) {
        html += `
        <div class="card border-success mb-3">
          <div class="card-body py-2">
            <h6 class="card-title mb-1"><i class="fas fa-map-marker-alt me-2"></i>${a.nombre}</h6>
            <div class="small"><strong>Ubicación:</strong> ${a.ubicacion}</div>
            <div class="small mb-2"><strong>Descripción:</strong> ${a.descripcion}</div>
            <button class="btn btn-sm btn-outline-danger" onclick="toggleFavoritoAtractivo(${idx})"><i class="fas fa-times"></i> Quitar</button>
          </div>
        </div>`;
      }
    });
  }

  document.getElementById('sidebarPerfilContenido').innerHTML = html;
}
window.cargarSidebarEditar = cargarSidebarEditar;
window.cargarSidebarFavoritos = cargarSidebarFavoritos;
x