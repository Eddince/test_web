// admin.js
const API_URL = 'https://backend-mongo-5bn2.onrender.com'; // URL de tu backend en Render

let datosClientes = [];

// Función para cargar los clientes desde el backend
async function cargarClientes() {
    try {
        const response = await fetch(`${API_URL}/mongo_clientes`);
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
                await fetch(`${API_URL}/actualizar_mongo/`, {
                    method: 'PUT',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify(cliente),
                });
            } else {
               
                // Crear nuevo cliente
                await fetch(`${API_URL}/mongodb/`, {
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


