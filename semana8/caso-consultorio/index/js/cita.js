document.addEventListener("DOMContentLoaded", function () {

    // HORARIOS DISPONIBLES
    const horarios = ["09:00", "10:00", "11:00", "15:00", "16:00"];
    const selectHorario = document.getElementById("horario");

    horarios.forEach(function (hora) {
        if (hora !== "11:00") {
            const opcion = document.createElement("option");
            opcion.value = hora;
            opcion.textContent = hora;
            selectHorario.appendChild(opcion);
        }
    });

    // FECHA MÍNIMA: HOY
    const fechaInput = document.getElementById("fecha");
    const hoy = new Date();

    const fechaActual =
        hoy.getFullYear() + "-" +
        String(hoy.getMonth() + 1).padStart(2, "0") + "-" +
        String(hoy.getDate()).padStart(2, "0");

    fechaInput.min = fechaActual;

    // FORMULARIO
    const formulario = document.getElementById("formCita");

    formulario.addEventListener("submit", function (event) {
        event.preventDefault();

        const nombre = document.getElementById("nombre").value.trim();
        const correo = document.getElementById("correo").value.trim();
        const fecha = fechaInput.value;
        const especialidad = document.getElementById("especialidad").value;
        const horario = selectHorario.value;

        let valido = true;

        // LIMPIAR MENSAJES ANTERIORES
        document.getElementById("errorNombre").textContent = "";
        document.getElementById("errorCorreo").textContent = "";
        document.getElementById("errorFecha").textContent = "";
        document.getElementById("errorEspecialidad").textContent = "";
        document.getElementById("errorHorario").textContent = "";

        // VALIDAR NOMBRE
        if (nombre.length < 3 || nombre.length > 60) {
            document.getElementById("errorNombre").textContent =
                "El nombre debe tener entre 3 y 60 caracteres.";
            valido = false;
        }

        // VALIDAR CORREO
        if (correo === "" || !document.getElementById("correo").checkValidity()) {
            document.getElementById("errorCorreo").textContent =
                "Ingrese un correo electrónico válido.";
            valido = false;
        }

        // VALIDAR FECHA
        if (fecha === "" || fecha < fechaActual) {
            document.getElementById("errorFecha").textContent =
                "Seleccione una fecha válida, desde hoy en adelante.";
            valido = false;
        }

        // VALIDAR ESPECIALIDAD
        if (especialidad === "") {
            document.getElementById("errorEspecialidad").textContent =
                "Seleccione una especialidad.";
            valido = false;
        }

        // VALIDAR HORARIO
        if (horario === "" || horario === "11:00") {
            document.getElementById("errorHorario").textContent =
                "Seleccione un horario disponible.";
            valido = false;
        }

        // GUARDAR Y PASAR A CONFIRMACIÓN
        if (valido) {
            const solicitud = {
                nombre: nombre,
                correo: correo,
                fecha: fecha,
                especialidad: especialidad,
                horario: horario
            };

            sessionStorage.setItem("cita", JSON.stringify(solicitud));
            window.location.href = "confirmacion-cita.html";
        }
    });

});