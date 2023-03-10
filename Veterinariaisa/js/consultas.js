const listaConsultas = document.getElementById('lista-consultas');
const mascota = document.getElementById('mascota');
const motivo = document.getElementById('motivo');
const atendidoPor = document.getElementById('atendidoPor');
const dueno = document.getElementById('dueno');
const indice = document.getElementById('indice');
const form = document.getElementById('form');
const btnGuardar = document.getElementById('btn-guardar');

let consulta = [
    {
        mascota: "Paco",
        motivo: "Cirugia",
        atendidoPor: "Helena Rodriguez",
        dueno: "nombre1",

    },
    {
        nombre: "Isabunny",
        apellido: "Bunny",
        pais: "Colombia",
        identificacion: "12131415",

    }
    
];

function listarConsultas() {
    const htmlConsultas = consultas.map((consulta, index) => `<tr>
            <th scope="row">${index}</th>
            <td>${consulta.mascota}</td>
            <td>${consulta.motivo}</td>
            <td>${consulta.atendidoPor}</td>
            <td>${consulta.dueno}</td>
            <td>
            <div class="btn-group" role="group" aria-label="Basic example">
                <button type="button" class="btn btn-info editar" ><i class="fa-solid fa-pen-to-square"></i></button>
                <button type="button" class="btn btn-danger eliminar"><i class="fa-solid fa-trash"></i></button>
                
            </div>
            </td>
        </tr>`).join(" ");
        listaConsultas.innerHTML = htmlConsultas;
        Array.from(document.getElementsByClassName("editar")).forEach((botonEditar, index) => botonEditar.onclick = editar(index));
        Array.from(document.getElementsByClassName("eliminar")).forEach((botonEliminar, index) => botonEliminar.onclick = eliminar(index));
}

function enviarDatos(evento) {
    evento.preventDefault();
    const datos = {
        mascota: mascota.value,
        motivo: motivo.value,
        atendidoPor: atendidoPor.value,
        dueno: dueno.value,
    };
    const accion = btnGuardar.innerHTML;
    switch(accion) {
        case 'Editar':
            consultas[indice.value] = datos;
            break;
        default:
            consultas.push(datos);
            break;
    }
    listarConsultas();
    resetModal();
}

function editar(index) {
    return function cuandoHagoClick () {
        btnGuardar.innerHTML = 'Editar'
        $('#exampleModalCenter').modal('toggle');
        const consulta = consultas[index];
        indice.value = index;
        mascota.value = consulta.nombre;
        motivo.value = consulta.apellido
        atendidoPor.value = consulta.pais;
        dueno.value = consulta.identificacion
        
    }
}


function resetModal() {
    indice.value = '';
    mascota.value = '';
    motivo.value = '';
    atendidoPor.value = '';
    dueno.value = '';
    btnGuardar.innerHTML = 'Crear'
}


function eliminar(index) {
    return function clickEnEliminar() {
        consultas = consultas.filter((consulta, indiceConsulta)=> indiceConsulta !==index);
        listarConsultas()
    }

}
listarConsultas();

form.onsubmit = enviarDatos;
btnGuardar.onclick = enviarDatos;