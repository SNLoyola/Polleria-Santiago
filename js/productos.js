// COMPLETAR INFORMACIÓN DE LAS CARDS

function completarCardsProductos() {

    const cards = document.querySelectorAll(".card-producto");

    cards.forEach(function (card) {

        const nombre = card.dataset.productoNombre;
        const precio = Number(card.dataset.precio);
        const unidad = card.dataset.unidad;

        const titulo = card.querySelector(".card-producto_title");
        const precioTexto = card.querySelector(".card-producto_precio");

        titulo.textContent = nombre;
        precioTexto.textContent = `${formatearPrecio(precio)} x ${unidad}`;

    });

}

completarCardsProductos();