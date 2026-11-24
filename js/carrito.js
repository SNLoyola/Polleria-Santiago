// 1. INICIALIZAR EL CARRITO

let carrito = []


// 2. MOSTRAR LOS PRODUCTOS DEL CARRITO

function renderizarCarrito() {

  const contenedor = document.querySelector("#carrito-productos");
  const totalElemento = document.querySelector("#carrito-total");

  if (!contenedor || !totalElemento) return;

  contenedor.innerHTML = "";

  let total = 0;

  if (carrito.length === 0) {
    contenedor.innerHTML = "<p>Tu carrito está vacío.</p>";
  }

  carrito.forEach(function (producto) {

    const subtotal = producto.precio * producto.cantidad;
    total += subtotal;

    const esPeso = producto.unidad === "kg";

    const incremento = producto.incremento ?? (esPeso ? 0.1 : 1);

    const cantidad = producto.cantidad.toLocaleString("es-AR", {
      maximumFractionDigits: 2
    });

    const elemento = document.createElement("div");

    elemento.classList.add("carrito-producto");

    elemento.innerHTML = `
      <div class="carrito-producto_info">

        <strong>${producto.nombre}</strong>

        <p>
          ${producto.precio.toLocaleString("es-AR", {
            style: "currency",
            currency: "ARS"
          })} / ${esPeso ? "kg" : producto.unidad}
        </p>

      </div>

      <div class="carrito-producto_cantidad">

        <button
          type="button"
          data-accion="restar"
          data-id="${producto.id}"
          aria-label="Restar cantidad"
        >−</button>

        <input
          type="number"
          class="cantidad-carrito"
          data-id="${producto.id}"
          value="${producto.cantidad}"
          min="${esPeso ? "0.1" : "1"}"
          step="${esPeso ? "any" : "1"}"
        >

        <span>${esPeso ? "kg" : producto.unidad}</span>

        <button
          type="button"
          data-accion="sumar"
          data-id="${producto.id}"
          aria-label="Sumar cantidad"
        >+</button>

      </div>

      <div class="carrito-producto_incrementos">

        ${
          esPeso
            ? `
              <button type="button" data-accion="incremento" data-valor="0.1" data-id="${producto.id}">100 g</button>
              <button type="button" data-accion="incremento" data-valor="0.5" data-id="${producto.id}">500 g</button>
              <button type="button" data-accion="incremento" data-valor="1" data-id="${producto.id}">1 kg</button>
            `
            : `
              <button type="button" data-accion="incremento" data-valor="1" data-id="${producto.id}">1 u</button>
              <button type="button" data-accion="incremento" data-valor="5" data-id="${producto.id}">5 u</button>
              <button type="button" data-accion="incremento" data-valor="10" data-id="${producto.id}">10 u</button>
            `
        }

      </div>

      <div class="carrito-producto_detalle">

        <p>
          Subtotal:
          <strong>
            ${subtotal.toLocaleString("es-AR", {
              style: "currency",
              currency: "ARS",
              maximumFractionDigits: 2
            })}
          </strong>
        </p>

        <button
          type="button"
          data-accion="eliminar"
          data-id="${producto.id}"
        >Eliminar</button>

      </div>

      <details class="carrito-producto_indicaciones">
        <summary>Agregar indicaciones (opcional)</summary>

        <textarea
          data-accion="indicaciones"
          data-id="${producto.id}"
          placeholder="Ej.: fileteada, sin piel..."
          rows="2"
        >${producto.indicaciones || ""}</textarea>
      </details>
    `;

    contenedor.appendChild(elemento);

    // Marcar el incremento seleccionado.
    const botonesIncremento = elemento.querySelectorAll(
      '[data-accion="incremento"]'
    );

    botonesIncremento.forEach(function (boton) {
      if (Number(boton.dataset.valor) === incremento) {
        boton.classList.add("activo");
      }
    });

  });

  totalElemento.textContent = total.toLocaleString("es-AR", {
    style: "currency",
    currency: "ARS",
    maximumFractionDigits: 2
  });

}

// 3. AGREGAR PRODUCTOS AL CARRITO

const botonesAgregar = document.querySelectorAll(".btn-agregar-carrito");

botonesAgregar.forEach(function (boton) {

  boton.addEventListener("click", function () {

    const tarjeta = boton.closest(".card-producto");

    // Obtenemos los datos del producto desde el HTML.
    const unidad = tarjeta.dataset.unidad;

    // Definimos la cantidad inicial según el tipo de producto.
    const cantidad = 1;

    const producto = {
      id: tarjeta.dataset.productoId,
      nombre: tarjeta.dataset.productoNombre,
      precio: Number(tarjeta.dataset.precio),
      unidad: unidad,
      cantidad: cantidad,
      incremento: unidad === "kg" ? 0.1 : 1,
      indicaciones: ""
    };

    // Comprobamos si el producto ya existe en el carrito.
    const productoExistente = carrito.find(function (item) {
      return item.id === producto.id;
    });

    if (productoExistente) {

      productoExistente.cantidad += producto.cantidad;

    } else {

      carrito.push(producto);

    }

    // Guardamos el carrito en el navegador.
    localStorage.setItem("carrito", JSON.stringify(carrito));

    // Actualizamos su representación visual.
    renderizarCarrito();

  });

});

// 4. MOSTRAR EL CARRITO AL CARGAR LA PÁGINA

const contenedorCarrito = document.querySelector("#carrito-productos");

if (contenedorCarrito) {

  // Botones: sumar, restar, cambiar incremento y eliminar
  contenedorCarrito.addEventListener("click", function (event) {

    const boton = event.target.closest("button[data-accion]");
    if (!boton) return;

    const id = boton.dataset.id;
    const accion = boton.dataset.accion;

    const producto = carrito.find(function (item) {
      return item.id === id;
    });

    if (!producto) return;

    const incremento = producto.incremento ?? (
      producto.unidad === "kg" ? 0.1 : 1
    );

    if (accion === "sumar") {
      producto.cantidad = Number(
        (producto.cantidad + incremento).toFixed(2)
      );
    }

    if (accion === "restar") {
      producto.cantidad = Number(
        (producto.cantidad - incremento).toFixed(2)
      );

      if (producto.cantidad <= 0) {
        carrito = carrito.filter(function (item) {
          return item.id !== id;
        });
      }
    }

    if (accion === "incremento") {
      producto.incremento = Number(boton.dataset.valor);
    }

    if (accion === "eliminar") {
      carrito = carrito.filter(function (item) {
        return item.id !== id;
      });
    }

    localStorage.setItem("carrito", JSON.stringify(carrito));
    renderizarCarrito();
  });


  // Campo editable de cantidad
  contenedorCarrito.addEventListener("change", function (event) {

    if (!event.target.matches(".cantidad-carrito")) return;

    const id = event.target.dataset.id;

    const producto = carrito.find(function (item) {
      return item.id === id;
    });

    if (!producto) return;

    let cantidad = Number(event.target.value);

    if (!Number.isFinite(cantidad) || cantidad <= 0) {
      renderizarCarrito();
      return;
    }

    if (producto.unidad === "kg") {
      cantidad = Number(cantidad.toFixed(2));
    } else {
      cantidad = Math.round(cantidad);
    }

    producto.cantidad = cantidad;

    localStorage.setItem("carrito", JSON.stringify(carrito));
    renderizarCarrito();
  });


  // Indicaciones opcionales de preparación
  contenedorCarrito.addEventListener("input", function (event) {

    if (!event.target.matches("textarea[data-accion='indicaciones']")) {
      return;
    }

    const id = event.target.dataset.id;

    const producto = carrito.find(function (item) {
      return item.id === id;
    });

    if (!producto) return;

    producto.indicaciones = event.target.value;

    localStorage.setItem("carrito", JSON.stringify(carrito));
  });

}

document.addEventListener("DOMContentLoaded", function () {

  carrito = JSON.parse(localStorage.getItem("carrito")) || [];

  renderizarCarrito();

});

// ========================================
// 5. ABRIR Y CERRAR EL CARRITO
// ========================================

const botonCarrito = document.querySelector(".btn-carrito");
const overlayCarrito = document.querySelector("#carrito-overlay");
const botonCerrarCarrito = document.querySelector(".carrito-cerrar");

function abrirCarrito() {
    overlayCarrito.hidden = false;
    botonCarrito.setAttribute("aria-expanded", "true");
}

function cerrarCarrito() {
    overlayCarrito.hidden = true;
    botonCarrito.setAttribute("aria-expanded", "false");
}

// Abrir o cerrar desde el botón principal.
if (botonCarrito && overlayCarrito) {

    botonCarrito.addEventListener("click", function () {

        if (overlayCarrito.hidden) {
            abrirCarrito();
        } else {
            cerrarCarrito();
        }

    });

}

// Cerrar desde la X.
if (botonCerrarCarrito) {
    botonCerrarCarrito.addEventListener("click", cerrarCarrito);
}

// Cerrar al presionar fuera de la ventana.
if (overlayCarrito) {
    overlayCarrito.addEventListener("click", function (event) {

        if (event.target === overlayCarrito) {
            cerrarCarrito();
        }

    });
}

// Cerrar al presionar Escape.
document.addEventListener("keydown", function (event) {

    if (event.key === "Escape" && overlayCarrito && !overlayCarrito.hidden) {
        cerrarCarrito();
    }

});


// 6. DATOS DEL CLIENTE

const botonEnviarWhatsApp = document.querySelector("#btn-enviar-whatsapp");

const campoNombre = document.querySelector("#cliente-nombre");
const campoDireccion = document.querySelector("#cliente-direccion");
const campoComentarios = document.querySelector("#comentarios-pedido");


function obtenerDatosCliente() {

  const nombre = campoNombre.value.trim();
  const direccion = campoDireccion.value.trim();
  const comentarios = campoComentarios.value.trim();

  if (!nombre || !direccion) {
    alert("Completá tu nombre y dirección para continuar.");
    return null;
  }

  return {
    nombre: nombre,
    direccion: direccion,
    comentarios: comentarios
  };

}


// Comprobar los datos al presionar el botón.
if (botonEnviarWhatsApp) {

  botonEnviarWhatsApp.addEventListener("click", function () {

    const datosCliente = obtenerDatosCliente();

    if (!datosCliente) return;

    const mensaje = generarMensajeWhatsApp(datosCliente);
    const urlWhatsApp = `https://wa.me/${TELEFONO_NEGOCIO}?text=${encodeURIComponent(mensaje)}`;
    window.open(urlWhatsApp, "_blank");

  });

}


// 7. FORMATEAR PRECIOS

function formatearPrecio(precio) {

  return precio.toLocaleString("es-AR", {
    style: "currency",
    currency: "ARS",
    maximumFractionDigits: 2
  });

}


// 8. GENERAR MENSAJE DEL PEDIDO
const TELEFONO_NEGOCIO = "5493876130871";

function generarMensajeWhatsApp(datosCliente) {

  let mensaje = `Hola, quisiera realizar un pedido.

DATOS DEL CLIENTE
Nombre: ${datosCliente.nombre}
Dirección: ${datosCliente.direccion}

DETALLE DEL PEDIDO
`;

  carrito.forEach(function (producto, indice) {

    const subtotal = producto.precio * producto.cantidad;

    const cantidad = producto.cantidad.toLocaleString("es-AR", {
      maximumFractionDigits: 2
    });

    mensaje += `
${indice + 1}. ${producto.nombre}
Cantidad: ${cantidad} ${producto.unidad}
Precio unitario: ${formatearPrecio(producto.precio)}
Subtotal: ${formatearPrecio(subtotal)}
`;

    if (producto.indicaciones) {
      mensaje += `Indicaciones: ${producto.indicaciones}\n`;
    }

  });

  const total = carrito.reduce(function (acumulado, producto) {
    return acumulado + producto.precio * producto.cantidad;
  }, 0);

  mensaje += `
TOTAL DEL PEDIDO: ${formatearPrecio(total)}
`;

  if (datosCliente.comentarios) {
    mensaje += `
COMENTARIOS GENERALES
${datosCliente.comentarios}
`;
  }

  mensaje += `
¡Gracias!`;

  return mensaje;

}
