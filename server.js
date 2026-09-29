const express = require('express');
const path = require('path');

const app = express();
const PORT = process.env.PORT || 3000;

app.use(express.json());
app.use(express.static(path.join(__dirname, 'public')));

// Persistencia en memoria (se reinicia al reiniciar el servidor)
let productos = [
  { id: 1, nombre: 'Laptop Lenovo 15"', categoria: 'Computación', cantidad: 8, precio: 5200 },
  { id: 2, nombre: 'Mouse inalámbrico', categoria: 'Accesorios', cantidad: 40, precio: 85 },
  { id: 3, nombre: 'Monitor 24 pulgadas', categoria: 'Computación', cantidad: 12, precio: 1300 },
];
let siguienteId = 4;

// Listar productos
app.get('/api/productos', (req, res) => {
  res.json(productos);
});

// Registrar producto
app.post('/api/productos', (req, res) => {
  const nombre = String(req.body.nombre || '').trim();
  const categoria = String(req.body.categoria || '').trim();
  const cantidad = Number(req.body.cantidad);
  const precio = Number(req.body.precio);

  if (!nombre || !categoria) {
    return res.status(400).json({ error: 'Nombre y categoría son obligatorios.' });
  }
  if (!Number.isInteger(cantidad) || cantidad < 0) {
    return res.status(400).json({ error: 'La cantidad debe ser un entero mayor o igual a 0.' });
  }
  if (!Number.isFinite(precio) || precio < 0) {
    return res.status(400).json({ error: 'El precio debe ser un número mayor o igual a 0.' });
  }

  const producto = { id: siguienteId++, nombre, categoria, cantidad, precio };
  productos.push(producto);
  console.log(`Producto registrado: ${producto.nombre}`);
  res.status(201).json(producto);
});

// Eliminar producto
app.delete('/api/productos/:id', (req, res) => {
  const id = Number(req.params.id);
  const antes = productos.length;
  productos = productos.filter((p) => p.id !== id);

  if (productos.length === antes) {
    return res.status(404).json({ error: 'Producto no encontrado.' });
  }
  console.log(`Producto eliminado: id ${id}`);
  res.status(204).end();
});

app.listen(PORT, () => {
  console.log(`Servidor escuchando en el puerto ${PORT}`);
});
