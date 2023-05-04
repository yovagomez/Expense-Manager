// Variables and selectors
const formulario = document.querySelector('#agregar-gasto');
const gastoListado = document.querySelector('#gastos ul');


// Events 
eventListeners();
function eventListeners() {
    document.addEventListener('DOMContentLoaded', preguntarPresupuesto);

    formulario.addEventListener('submit', agregarGasto);
}

// Classes
class Presupuesto {
    constructor(presupuesto){
        this.presupuesto = Number(presupuesto);
        this.restante = Number(presupuesto);
        this.gastos = '';
    }

    nuevoGasto(gasto) {
        this.gastos = [...this.gastos, gasto]
        this.calcularRestante();
    }

    calcularRestante() {
        const gastado = this.gastos.reduce( (total, gasto) => total + gasto.cantidad, 0);
        this.restante = this.presupuesto - gastado;
        console.log(this.restante);
    }

    eliminarGasto(id) {
        this.gastos = this.gastos.filter(gasto => gasto.id !== id);
        this.calcularRestante();
    }
}

class UI {
    insertarPresupuesto(cantidad) {
        // Extranyendo valor
        const {presupuesto, restante} = cantidad;

        // Agregar al HTML
        document.querySelector('#total').textContent = presupuesto;
        document.querySelector('#restante').textContent = restante;

    }

    imprimirAlertar(mensaje, tipo) {
        // Create div 
        const divMensaje = document.createElement('div');
        divMensaje.classList.add('text-center','alert');

        if(tipo === 'error'){
            divMensaje.classList.add('alert-danger');
        } else {
            divMensaje.classList.add('alert-success');
        }

        // Error message 
        divMensaje.textContent = mensaje;
        
        // Insert in the HTML 
        document.querySelector('.primario').insertBefore(divMensaje, formulario);

        setTimeout(() => {
            divMensaje.remove()
        }, 3000);
    }

    mostrarGastos(gastos) {

        // Elimina el HTML previo
        this.limpiarHTML();
        
        // Iterate on expenses 
        gastos.forEach(gasto => {
            const {cantidad, nombre, id} = gasto;

            // Create a List 
            const nuevoGasto = document.createElement('li');
            nuevoGasto.className = 'list-group-item d-flex justify-content-between align-items-center';
            nuevoGasto.dataset.id = id;

            console.log(nuevoGasto);

            // Add expense in the HTML
            nuevoGasto.innerHTML = `${nombre} <span class="badge badge-primary badge-pill"> $${cantidad} </span>`;

            // Boton to remove the expense 
            const btnBorrar = document.createElement('button');
            btnBorrar.classList.add('btn', 'btn-danger', 'borrar-gasto');
            btnBorrar.innerHTML = 'Borrar &times';
            btnBorrar.onclick = () => {
                eliminarGasto(id);
            }
            nuevoGasto.appendChild(btnBorrar);

            // Add to HTML

            gastoListado.appendChild(nuevoGasto);

        });
    }

    limpiarHTML() {
        while(gastoListado.firstChild) {
            gastoListado.removeChild(gastoListado.firstChild);
        }
    }

    actualizarRestante (restante ) {
        document.querySelector('#restante').textContent = restante;
    }

    comprobarPresupuesto (presupuestoObj) {
        const { presupuesto, restante } = presupuestoObj;
        const restanteDiv = document.querySelector('.restante');

        // Check 25%
        if((presupuesto / 4) > restante ) {
            restanteDiv.classList.remove('alert-success', 'alert-warning');
            restanteDiv.classList.add('alert-danger');
        } else if ((presupuesto / 2) > restante) {
            restanteDiv.classList.remove('alert-success', 'alert-danger');
            restanteDiv.classList.add('alert-warning');
        } else {
            restanteDiv.classList.remove('alert-danger', 'alert-warning');
            restanteDiv.classList.add('alert-success');
        }

        // If the total is low to cero
        if(restante <= 0) {
            ui.imprimirAlertar('El presupuesto se ha agotado', 'error');

            formulario.querySelector('button[type = "submit"]').disabled = true;
        }
    }
}

const ui = new UI();
let presupuesto;

// Functions
function preguntarPresupuesto() {
    const presupuestoUsuario = prompt('Cual es tu presupuesto?');

    // console.log(Number(presupuestoUsuario));

    if(presupuestoUsuario === '' || presupuestoUsuario === null || isNaN(presupuestoUsuario) || presupuestoUsuario <= 0) {
        window.location.reload(); 
    }

    // Presupuesto valido 
    presupuesto = new Presupuesto(presupuestoUsuario);
    console.log(presupuesto);

    ui.insertarPresupuesto(presupuesto)
}

function agregarGasto (e) {
    e.preventDefault();

    // Read data of the form 
    const nombre = document.querySelector('#gasto').value;
    const cantidad = Number(document.querySelector('#cantidad').value);

    if(nombre === '' || cantidad === ''){
        ui.imprimirAlertar('Ambos campos son obligatorios', 'error');

        return;
    } else if (cantidad <= 0 || isNaN(cantidad)){
        ui.imprimirAlertar('Cantidad no valida', 'error');

        return;
    }

    // Generar un objecto con el gasto
    const gasto = {nombre, cantidad, id: Date.now()};

    // Add new expense
    presupuesto.nuevoGasto(gasto);

    // Success message
    ui.imprimirAlertar('Gasto agregado correctamente');

    // Print expenses
    const { gastos, restante } = presupuesto;
    ui.mostrarGastos(gastos);

    ui.actualizarRestante(restante);

    ui.comprobarPresupuesto(presupuesto);

    // Reset Form 
    formulario.reset();
}

function eliminarGasto (id) {

    // Delete expense from object 
    presupuesto.eliminarGasto(id);

    // Delete expenses from HTML
    const { gastos, restante } = presupuesto;
    ui.mostrarGastos(gastos);
    ui.actualizarRestante(restante);
    ui.comprobarPresupuesto(presupuesto);

}