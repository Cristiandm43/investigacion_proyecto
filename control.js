document.addEventListener("DOMContentLoaded", function () {
    const aplicarFiltrosButton = document.getElementById('aplicar-filtros-button');
    aplicarFiltrosButton.addEventListener('click', aplicarFiltros);

    function aplicarFiltros() {
        const modalidadSeleccionada = obtenerModalidadSeleccionada();
        const ciudadSeleccionada = obtenerCiudadSeleccionada();
        const salarioSeleccionado = obtenerSalarioSeleccionado();
        const listaTrabajos = document.querySelectorAll('.list-group-item');

        listaTrabajos.forEach(trabajo => {
            const modalidadTrabajo = trabajo.getAttribute('data-modalidad');
            const ciudadTrabajo = trabajo.getAttribute('data-ciudad');
            const salarioTrabajo = parseInt(trabajo.getAttribute('data-salario'));

            const modalidadCoincide = modalidadSeleccionada === 'todos' || modalidadTrabajo === modalidadSeleccionada;
            const ciudadCoincide = ciudadSeleccionada === 'todas' || ciudadTrabajo === ciudadSeleccionada;
            const salarioCoincide = (
                salarioSeleccionado === 'todos' ||
                (salarioSeleccionado === 'menos-de-1m' && salarioTrabajo < 1000000) ||
                (salarioSeleccionado === '1m-a-1.5m' && salarioTrabajo >= 1000000 && salarioTrabajo <= 1500000) ||
                (salarioSeleccionado === '1.5m-a-2.5m' && salarioTrabajo > 1500000 && salarioTrabajo <= 2500000) ||
                (salarioSeleccionado === 'mas-de-2.5m' && salarioTrabajo > 2500000)
            );

            if (modalidadCoincide && ciudadCoincide && salarioCoincide) {
                trabajo.style.display = 'block';
            } else {
                trabajo.style.display = 'none';
            }
        });
    }

    function obtenerModalidadSeleccionada() {
        const modalidadRadios = document.getElementsByName('modalidad');
        let modalidadSeleccionada = "";

        modalidadRadios.forEach(radio => {
            if (radio.checked) {
                modalidadSeleccionada = radio.value;
            }
        });

        return modalidadSeleccionada;
    }

    function obtenerCiudadSeleccionada() {
        const ciudadSelect = document.getElementById('ciudad');
        return ciudadSelect.value;
    }

    function obtenerSalarioSeleccionado() {
        const salarioRadios = document.querySelectorAll('.form-check-input[name="salario"]');
        let salarioSeleccionado = "";

        salarioRadios.forEach(radio => {
            if (radio.checked) {
                salarioSeleccionado = radio.value;
            }
        });

        return salarioSeleccionado;
    }

    // Agregar un evento de escucha a los radios de modalidad para activar el filtro
    const modalidadRadios = document.getElementsByName('modalidad');
    modalidadRadios.forEach(radio => {
        radio.addEventListener('change', aplicarFiltros);
    });

    // Agregar un evento de escucha al select de ciudad para activar el filtro
    const ciudadSelect = document.getElementById('ciudad');
    ciudadSelect.addEventListener('change', aplicarFiltros);

    // Agregar un evento de escucha a los checkboxes de salario para activar el filtro
    const salarioCheckboxes = document.querySelectorAll('.form-check-input[name="salario"]');
    salarioCheckboxes.forEach(checkbox => {
        checkbox.addEventListener('change', aplicarFiltros);
    });

    function mostrarOcultarIcono() {
        const terminoBusqueda = document.getElementById("busqueda").value;
        const icono = document.querySelector(".search-icon i");

        if (terminoBusqueda.trim() === "") {
            icono.style.display = "block";
        } else {
            icono.style.display = "none";
        }

        buscar();
    }

    document.getElementById("busqueda").addEventListener("input", mostrarOcultarIcono);

    function buscar() {
        const terminoBusqueda = document.getElementById("busqueda").value.toLowerCase();
        const listaTrabajos = document.querySelectorAll('.list-group-item');

        listaTrabajos.forEach(trabajo => {
            const tituloTrabajo = trabajo.querySelector('h3 a').textContent.toLowerCase();

            if (tituloTrabajo.includes(terminoBusqueda)) {
                trabajo.style.display = 'block';
            } else {
                trabajo.style.display = 'none';
            }
        });
    }

    // Agregar un evento de escucha al menú desplegable de "ordenar por" para activar el filtro
    const ordenarPorSelect = document.getElementById('ordenar-por');
    ordenarPorSelect.addEventListener('change', ordenarEmpleos);

    function ordenarEmpleos() {
        const criterio = ordenarPorSelect.value;
        const listaElementos = document.getElementById("listaElementos");
        const empleos = Array.from(listaElementos.getElementsByClassName("list-group-item"));

        empleos.sort(function (a, b) {
            if (criterio === "fecha") {
                const fechaA = new Date(a.getAttribute('data-fecha'));
                const fechaB = new Date(b.getAttribute('data-fecha'));
                return fechaB - fechaA;
            } else if (criterio === "relevancia") {
                const relevanciaA = parseInt(a.getAttribute('data-relevancia'), 10);
                const relevanciaB = parseInt(b.getAttribute('data-relevancia'), 10);
                return relevanciaB - relevanciaA;
            }
        });

        // Elimina elementos de la lista actual
        while (listaElementos.firstChild) {
            listaElementos.removeChild(listaElementos.firstChild);
        }

        // Agrega los elementos ordenados de nuevo
        empleos.forEach(function (empleo) {
            listaElementos.appendChild(empleo);
        });
    }

    // Tu código de paginación existente...
    
    const empleosPorPagina = 5;
    let paginaActual = 1;
    const listaElementos = document.getElementById("listaElementos");
    const empleos = Array.from(listaElementos.getElementsByClassName("list-group-item"));
    const totalPaginas = Math.ceil(empleos.length / empleosPorPagina);

    function mostrarEmpleosEnPagina(pagina) {
        const inicio = (pagina - 1) * empleosPorPagina;
        const fin = inicio + empleosPorPagina;

        empleos.forEach(function (empleo, index) {
            if (index >= inicio && index < fin) {
                empleo.style.display = 'block';
            } else {
                empleo.style.display = 'none';
            }
        });
    }

    function generarNumerosPagina() {
        const pagination = document.getElementById("pagination");
        const prevPage = document.getElementById("prev-page");
        const nextPage = document.getElementById("next-page");

        while (pagination.firstChild) {
            pagination.removeChild(pagination.firstChild);
        }

        const ul = document.createElement("ul");
        ul.classList.add("pagination", "justify-content-center");

        if (paginaActual > 1) {
            prevPage.classList.remove("disabled");
        } else {
            prevPage.classList.add("disabled");
        }

        prevPage.addEventListener("click", function (e) {
            e.preventDefault();
            if (paginaActual > 1) {
                paginaActual--;
                mostrarEmpleosEnPagina(paginaActual);
                generarNumerosPagina();
            }
        });

        if (paginaActual < totalPaginas) {
            nextPage.classList.remove("disabled");
        } else {
            nextPage.classList.add("disabled");
        }

        nextPage.addEventListener("click", function (e) {
            e.preventDefault();
            if (paginaActual < totalPaginas) {
                paginaActual++;
                mostrarEmpleosEnPagina(paginaActual);
                generarNumerosPagina();
            }
        });

        ul.appendChild(prevPage);

        for (let i = 1; i <= totalPaginas; i++) {
            const li = document.createElement("li");
            li.classList.add("page-item");
            if (i === paginaActual) {
                li.classList.add("active");
            }
            const a = document.createElement("a");
            a.classList.add("page-link");
            a.href = "#";
            a.textContent = i;
            li.appendChild(a);
            ul.appendChild(li);

            a.addEventListener("click", function (e) {
                e.preventDefault();
                paginaActual = i;
                mostrarEmpleosEnPagina(paginaActual);
                generarNumerosPagina();
            });
        }

        ul.appendChild(nextPage);
        pagination.appendChild(ul);
    }

    mostrarEmpleosEnPagina(paginaActual);
    generarNumerosPagina();
});
