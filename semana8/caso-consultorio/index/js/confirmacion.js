document.addEventListener("DOMContentLoaded", function () {

    const contenido = document.getElementById("contenido");
    const datosGuardados = sessionStorage.getItem("cita");

    if (datosGuardados === null) {
        contenido.innerHTML = `
            <p class="text-danger">
                No se encontraron datos de una cita.
                Por favor, complete el formulario.
            </p>
        `;
        return;
    }

    const cita = JSON.parse(datosGuardados);

    contenido.innerHTML = `
        <div class="alert alert-success">
            ¡Su solicitud de cita fue registrada correctamente!
        </div>

        <div class="text-start">
            <p><strong>Nombre:</strong> ${cita.nombre}</p>
            <p><strong>Correo:</strong> ${cita.correo}</p>
            <p><strong>Fecha:</strong> ${cita.fecha}</p>
            <p><strong>Especialidad:</strong> ${cita.especialidad}</p>
            <p><strong>Horario:</strong> ${cita.horario}</p>
        </div>
    `;

});