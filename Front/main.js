const tbody = document.getElementById("tbodyTable");
const spinner = document.getElementById("spinner");
const inputBuscador = document.getElementById("buscador");

function mostrarSpinner() {
    spinner.parentNode.style.display = "flex";
}

function ocultarSpinner() {
    spinner.parentNode.style.display = "none";
}

function crearFilas(productos) {
    while (tbody.firstChild) {
        tbody.removeChild(tbody.firstChild);
    }

    productos.forEach(item => {
        const tr = document.createElement("tr");

        const thNombre = document.createElement("th");
        thNombre.textContent = item.nombre;

        const thCantidad = document.createElement("th");
        thCantidad.textContent = item.cantidad;

        const thPlataforma = document.createElement("th");
        thPlataforma.textContent = item.plataforma;

        tr.appendChild(thNombre);
        tr.appendChild(thCantidad);
        tr.appendChild(thPlataforma);

        tbody.appendChild(tr);
    });
}

mostrarSpinner();

const uriML = "https://back-jlji.onrender.com/mercadolibre";
const uriTN = "https://back-jlji.onrender.com/tiendanube";

const ml = fetch(uriML)
    .then(response => { return response.json() })
    .catch((error) => console.error(error));

const tn = fetch(uriTN)
    .then(response => { return response.json() })
    .catch((error) => console.error(error));

let allProductos = [];

Promise.all([ml, tn])
    .then(([dataML, dataTN]) => {
        const infoML = dataML.body.map(item => ({
            nombre: item.title,
            cantidad: item.available_quantity,
            plataforma: "ML"
        }));

        const infoTN = dataTN.map(item => ({
            nombre: (item.name?.es).replace(/(^\w|\s\w)/g, m => m.toUpperCase()),
            cantidad: item.variants[0].stock,
            plataforma: "TN"
        }));

        allProductos = [...infoML, ...infoTN];

        crearFilas(allProductos);
    })
    .catch((error) => console.error(error))
    .finally(() => { ocultarSpinner() });

inputBuscador.addEventListener("input", (e) => {
    const textoUsuario = e.target.value.toLowerCase();

    const productosFiltrados = allProductos.filter(producto => {
        return producto.nombre.toLowerCase().includes(textoUsuario);
    });

    crearFilas(productosFiltrados);
});