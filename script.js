// script.js
const API_URL = 'http://127.0.0.1:8000'; // URL de tu backend en Render

document.getElementById('verificationForm').addEventListener('submit', async function (e) {
    e.preventDefault(); // Evita que el formulario se envíe

    const nombre = document.getElementById('nombre').value;
    const codigo = document.getElementById('codigo').value;

    try {
        // Buscar el cliente en el backend
        const response = await fetch(`${API_URL}/clientes/buscar/${nombre}&${codigo}`);
        if (!response.ok) throw new Error('Error al principio');

        const cliente = await response.json();

        // Mostrar el estado del cliente
        document.getElementById('estado').textContent = `Estado: ${cliente.Estado}`;
        const barraProgreso = document.getElementById('progreso');
        if (cliente.Estado === 'Inicial') {
            barraProgreso.style.width = '33%';
        } else if (cliente.Estado === 'En desarrollo') {
            barraProgreso.style.width = '66%';
        } else if (cliente.Estado === 'Completada') {
            barraProgreso.style.width = '100%';
        }
    } catch (error) {
        console.error('Error:', error);
        document.getElementById('estado').textContent = 'Cliente no encontrado.';
        document.getElementById('progreso').style.width = '0%';
    }
});