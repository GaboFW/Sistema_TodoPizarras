const tbody = document.getElementById("tbodyTable");
const spinner = document.getElementById("spinner");

function mostrarSpinner() {
    spinner.parentNode.style.display = "flex";
}

function ocultarSpinner() {
    spinner.parentNode.style.display = "none";
}

function crearFilas(nombre, cantidad) {
    const tr = document.createElement("tr");

    const thNombre = document.createElement("th");
    thNombre.textContent = nombre;

    const thCantidad = document.createElement("th");
    thCantidad.textContent = cantidad;

    tr.appendChild(thNombre);
    tr.appendChild(thCantidad);

    tbody.appendChild(tr);

    return tr;
}

mostrarSpinner();

const uriML = "./simulacionML.json";
const uriTN = "./simulacionTN.json";

const ml = fetch(uriML)
    .then(response => { return response.json() })
    .catch((error) => console.error(error));

const tn = fetch(uriTN)
    .then(response => { return response.json() })
    .catch((error) => console.error(error));

Promise.all([ml, tn])
    .then(([dataML, dataTN]) => {
        const infoML = dataML.results;
        const infoTN = dataTN;

        const inventario = {};

        infoML.forEach(item => {
            const nombre = item.title;
            const cantidad = item.available_quantity;

            if (!inventario[nombre]) {
                inventario[nombre] = cantidad;
            } else {
                inventario[nombre] += cantidad;
            }
        });

        infoTN.forEach(item => {
            const nombre = item.name?.es;
            const cantidad = item.variants[0].stock;

            if (!inventario[nombre]) {
                inventario[nombre] = cantidad;
            } else {
                inventario[nombre] += cantidad;
            }
        });

        Object.entries(inventario).forEach(([nombre, cantidad]) => {
            crearFilas(nombre, cantidad);
        });
    })
    .catch((error) => console.error(error))
    .finally(() => { ocultarSpinner() });
