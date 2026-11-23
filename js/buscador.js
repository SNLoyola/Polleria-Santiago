
const buscador = document.querySelector("#buscador-productos");
const productos = document.querySelectorAll(".card-producto");
const mensaje = document.querySelector("#mensaje-sin-resultados");
const titulos = document.querySelectorAll(
    ".titulo-categoria, .subtitulo-categoria"
);

buscador.addEventListener("input", function () {

    const textoBuscado = buscador.value.toLowerCase().trim();

    let cantidadCoincidencias = 0;

    // Mostrar u ocultar títulos
    titulos.forEach(function (titulo) {
        titulo.style.display = textoBuscado ? "none" : "";
    });

    // Filtrar productos
    productos.forEach(function (producto) {

        const textoProducto = producto.textContent.toLowerCase();

        const coincide = textoProducto.includes(textoBuscado);

        if (coincide) {
            producto.style.display = "";
            cantidadCoincidencias++;
        } else {
            producto.style.display = "none";
        }

    });

    // Mostrar mensaje si no hay resultados
    mensaje.hidden = cantidadCoincidencias > 0;

});