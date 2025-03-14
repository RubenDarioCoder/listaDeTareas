document.addEventListener('DOMContentLoaded', () => {
    const inputTarea = document.getElementById('producto');
    const botonAgregarTarea = document.getElementById('botonAgregarTarea');
    const listaProductos = document.getElementById('listaProductos');
    const localStorageKey = 'listaDeComprasProductos'; // Clave para el localStorage

    // Cargar tareas guardadas al iniciar
    function cargarProducto() {
        const productosGuardados = localStorage.getItem(localStorageKey);
        if (productosGuardados) {
            productosGuardados.split(',').forEach(producto => {
                const [productoTexto, marcado] = producto.split('|');
                crearProducto(productoTexto, marcado === 'true');
            });
        }
    }

    // Agregar una nueva tarea
    function agregarProducto() {
        const nuevoProducto = inputTarea.value.trim();
        if (nuevoProducto) {
            crearProducto(nuevoProducto);
            guardarProducto(nuevoProducto);
            inputTarea.value = '';
            inputTarea.placeholder = 'Otra tarea';
        } else {
            alert('Por favor, ingresa un producto válido.');
        }
        inputTarea.focus();
    }

    // Crear una tarea en la lista
    function crearProducto(productoTexto, marcado = false) {
        const productoCreado = document.createElement('li');
        productoCreado.textContent = productoTexto;
        productoCreado.setAttribute('data-texto', productoTexto); // Guardar el texto en un atributo
        productoCreado.classList.add('productoCreado');

        // Botón para marcar/desmarcar tarea
        const botonMarcar = document.createElement('button');
        botonMarcar.textContent = '✓';
        botonMarcar.classList.add(marcado ? 'botonMarcado' : 'botonDesmarcado');
        botonMarcar.addEventListener('click', () => {
            botonMarcar.classList.toggle('botonMarcado');
            botonMarcar.classList.toggle('botonDesmarcado');
            actualizarProductoEnLocalStorage(productoTexto, botonMarcar.classList.contains('botonMarcado'));
        });

        // Botón para eliminar tarea
        const botonEliminar = document.createElement('button');
        botonEliminar.textContent = 'X';
        botonEliminar.classList.add('botonEliminar');
        botonEliminar.addEventListener('click', () => {
            productoCreado.remove();
            eliminarProductoDeLocalStorage(productoTexto);
        });

        // Botón para subir tarea
        const botonSubir = document.createElement('button');
        botonSubir.textContent = '▲';
        botonSubir.classList.add('botonSubir');
        botonSubir.addEventListener('click', () => {
            const elementoAnterior = productoCreado.previousElementSibling;
            if (elementoAnterior) {
                listaProductos.insertBefore(productoCreado, elementoAnterior);
                guardarOrdenEnLocalStorage();
            }
        });

        // Botón para bajar tarea
        const botonBajar = document.createElement('button');
        botonBajar.textContent = '▼';
        botonBajar.classList.add('botonBajar');
        botonBajar.addEventListener('click', () => {
            const elementoSiguiente = productoCreado.nextElementSibling;
            if (elementoSiguiente) {
                listaProductos.insertBefore(elementoSiguiente, productoCreado);
                guardarOrdenEnLocalStorage();
            }
        });

        // Contenedor de botones
        const divBotones = document.createElement('div');
        divBotones.append(botonMarcar, botonEliminar, botonSubir, botonBajar);

        // Agregar botones a la tarea
        productoCreado.appendChild(divBotones);
        listaProductos.appendChild(productoCreado);
    }

    // Guardar una tarea en el localStorage
    function guardarProducto(productoTexto) {
        const productosGuardados = localStorage.getItem(localStorageKey);
        const listaProductos = productosGuardados ? productosGuardados.split(',') : [];
        listaProductos.push(`${productoTexto}|false`);
        localStorage.setItem(localStorageKey, listaProductos.join(','));
    }

    // Actualizar el estado de una tarea en el localStorage
    function actualizarProductoEnLocalStorage(productoTexto, marcado) {
        const productosGuardados = localStorage.getItem(localStorageKey);
        if (productosGuardados) {
            const listaProductos = productosGuardados.split(',').map(producto => {
                const [texto, estado] = producto.split('|');
                return texto === productoTexto ? `${texto}|${marcado}` : producto;
            });
            localStorage.setItem(localStorageKey, listaProductos.join(','));
        }
    }

    // Eliminar una tarea del localStorage
    function eliminarProductoDeLocalStorage(productoTexto) {
        const productosGuardados = localStorage.getItem(localStorageKey);
        if (productosGuardados) {
            const listaProductos = productosGuardados.split(',').filter(producto => {
                const [texto] = producto.split('|');
                return texto !== productoTexto;
            });
            localStorage.setItem(localStorageKey, listaProductos.join(','));
        }
    }

    // Guardar el orden de las tareas en el localStorage
    function guardarOrdenEnLocalStorage() {
        const productos = Array.from(listaProductos.children).map(li => {
            const texto = li.getAttribute('data-texto'); // Obtener el texto desde el atributo
            const marcado = li.querySelector('.botonMarcado') !== null;
            return `${texto}|${marcado}`;
        });
        localStorage.setItem(localStorageKey, productos.join(','));
    }

    // Cargar tareas al iniciar
    cargarProducto();
    inputTarea.focus();

    // Eventos
    botonAgregarTarea.addEventListener('click', agregarProducto);
    inputTarea.addEventListener('keypress', (e) => {
        if (e.key === 'Enter') {
            agregarProducto();
        }
    });
});