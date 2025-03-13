// admin.js
const API_URL = 'https://backend-imp.onrender.com'; // URL de tu backend en Render

let datosClientes = [];

// Función para cargar los clientes desde el backend
async function cargarClientes() {
    try {
        const response = await fetch(`${API_URL}/clientes`);
        if (!response.ok) throw new Error('Error al cargar los clientes');
        datosClientes = await response.json();
        mostrarClientes();
    } catch (error) {
        console.error('Error:', error);
    }
}

// Función para mostrar la lista de clientes
function mostrarClientes() {
    const listaClientes = document.getElementById('listaClientes');
    listaClientes.innerHTML = ''; // Limpiar la lista

    datosClientes.forEach((cliente, index) => {
        const clienteDiv = document.createElement('div');
        clienteDiv.innerHTML = `
            <input type="text" value="${cliente.nombre}" id="nombre-${index}">
            <input type="text" value="${cliente.codigo}" id="codigo-${index}">
            <select id="estado-${index}">
                <option value="Inicial" ${cliente.estado === 'Inicial' ? 'selected' : ''}>Inicial</option>
                <option value="En desarrollo" ${cliente.estado === 'En desarrollo' ? 'selected' : ''}>En desarrollo</option>
                <option value="Completada" ${cliente.estado === 'Completada' ? 'selected' : ''}>Completada</option>
            </select>
            <button onclick="eliminarCliente('${cliente.codigo}')">Eliminar</button>
        `;
        listaClientes.appendChild(clienteDiv);
    });
}

// Función para agregar un nuevo cliente
document.getElementById('agregarCliente').addEventListener('click', () => {
    datosClientes.push({id: null,nombre: '', codigo: '', estado: 'Inicial' });
    mostrarClientes();
});

// Función para eliminar un cliente
async function eliminarCliente(codigo) {
    try {
        await fetch(`${API_URL}/delete/${codigo}`, { method: 'DELETE' });
        cargarClientes(); // Recargar la lista después de eliminar
    } catch (error) {
        console.error('Error:', error);
    }
}

// Función para guardar los cambios
document.getElementById('guardarCambios').addEventListener('click', async () => {
    try {
        for (let i = 0; i < datosClientes.length; i++) {
            const cliente = {
                id: datosClientes[i].id,
                nombre: document.getElementById(`nombre-${i}`).value,
                codigo: document.getElementById(`codigo-${i}`).value,
                estado: document.getElementById(`estado-${i}`).value,
            };

            if (cliente.id) {
                // Actualizar cliente existente
                await fetch(`${API_URL}/actualizar/`, {
                    method: 'PUT',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify(cliente),
                });
            } else {
               
                // Crear nuevo cliente
                await fetch(`${API_URL}/cliente/`, {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify(cliente),
                });
            }
        }
        alert('Cambios guardados correctamente');
        guardarDatosEnTxt()
        cargarClientes(); // Recargar la lista después de guardar

        



    } catch (error) {
        console.error('Error:', error);
    }





});

// Cargar los clientes al iniciar
cargarClientes();

// Función para guardar los datos en un archivo .txt en formato JSON y enviarlo por correo
async function guardarDatosEnTxt() {
    // Crear un array con los datos actualizados
    const datosActualizados = datosClientes.map((cliente, index) => ({
        id: cliente.id,
        nombre: document.getElementById(`nombre-${index}`).value,
        codigo: document.getElementById(`codigo-${index}`).value,
        estado: document.getElementById(`estado-${index}`).value,
    }));

    // Convertir los datos a formato JSON
    const jsonString = JSON.stringify(datosActualizados, null, 2); // El tercer parámetro (2) es para indentación

    // Crear un archivo .txt
    const blob = new Blob([jsonString], { type: 'text/plain' });
    const file = new File([blob], 'clientes.json', { type: 'text/plain' });

    // Enviar el archivo al backend para que lo envíe por correo
    const formData = new FormData();
    formData.append('file', file);

    try {
        const response = await fetch(`${API_URL}/enviar-correo`, {
            method: 'POST',
            body: formData,
        });

        if (response.ok) {
            alert('Archivo enviado por correo correctamente');
        } else {
            throw new Error('Error al enviar el archivo por correo');
        }
    } catch (error) {
        console.error('Error:', error);
        alert('Error al enviar el archivo por correo');
    }
}