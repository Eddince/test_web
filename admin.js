// admin.js
const API_URL = 'http://127.0.0.1:8000'; // URL de tu backend en Render

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
            <input type="text" value="${datosClientes.nombre}" id="nombre-${index}">
            <input type="text" value="${cliente.codigo}" id="codigo-${index}">
            <select id="estado-${index}">
                <option value="Inicial" ${cliente.estado === 'Inicial' ? 'selected' : ''}>Inicial</option>
                <option value="En desarrollo" ${cliente.estado === 'En desarrollo' ? 'selected' : ''}>En desarrollo</option>
                <option value="Completada" ${cliente.estado === 'Completada' ? 'selected' : ''}>Completada</option>
            </select>
            <button onclick="eliminarCliente('${cliente.id}')">Eliminar</button>
        `;
        listaClientes.appendChild(clienteDiv);
    });
}

// Función para agregar un nuevo cliente
document.getElementById('agregarCliente').addEventListener('click', () => {
    datosClientes.push({ Nombre: '', Código: '', Estado: 'Inicial' });
    mostrarClientes();
});

// Función para eliminar un cliente
async function eliminarCliente(id) {
    try {
        await fetch(`${API_URL}/clientes/${id}`, { method: 'DELETE' });
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
                Nombre: document.getElementById(`nombre-${i}`).value,
                Código: document.getElementById(`codigo-${i}`).value,
                Estado: document.getElementById(`estado-${i}`).value,
            };

            if (datosClientes[i].id) {
                // Actualizar cliente existente
                await fetch(`${API_URL}/clientes/${datosClientes[i].id}`, {
                    method: 'PUT',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify(cliente),
                });
            } else {
                // Crear nuevo cliente
                await fetch(`${API_URL}/clientes`, {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify(cliente),
                });
            }
        }
        alert('Cambios guardados correctamente');
        cargarClientes(); // Recargar la lista después de guardar
    } catch (error) {
        console.error('Error:', error);
    }
});

// Cargar los clientes al iniciar
cargarClientes();
