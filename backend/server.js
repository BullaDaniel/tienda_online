require('dotenv').config();
const express = require('express');
const mysql   = require('mysql2');
const cors    = require('cors');
const bcrypt  = require('bcrypt');
const jwt     = require('jsonwebtoken');
const cloudinary = require('cloudinary').v2;
const multer     = require('multer');
const { CloudinaryStorage } = require('multer-storage-cloudinary');

// Configuración de Cloudinary
cloudinary.config({
    cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
    api_key:    process.env.CLOUDINARY_API_KEY,
    api_secret: process.env.CLOUDINARY_API_SECRET,
});

// Storage: las imágenes van directo a Cloudinary
const storage = new CloudinaryStorage({
    cloudinary,
    params: {
        folder:         'glosse',        // carpeta en tu Cloudinary
        allowed_formats: ['jpg', 'jpeg', 'png', 'webp'],
        transformation:  [{ width: 1200, quality: 'auto', fetch_format: 'auto' }],
    },
});

const upload = multer({ storage });
const app        = express();
const port       = process.env.PORT || 3001;
const SECRET_KEY = process.env.SECRET_KEY;

app.use(cors());
app.use(express.json());

const DB = mysql.createConnection({
  host:     process.env.DB_HOST,
  user:     process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME,
});

DB.connect((err) => {
  if (err) { console.error('Error BD:', err); return; }
  console.log('Conectado a la base de datos');
});

// ── PRODUCTOS ──────────────────────────────────────

// Todos los productos con su primera imagen
app.get('/api/productos', (req, res) => {
  const query = `
    SELECT p.id, p.nombre, p.descripcion, p.precio,
           MIN(i.ruta_imagen) AS imagen
    FROM productos p
    LEFT JOIN imagenes_producto i ON p.id = i.producto_id
    GROUP BY p.id`;
  DB.query(query, (err, results) => {
    if (err) return res.status(500).json({ error: err.message });
    res.json(results);
  });
});

// Un producto con todas sus imágenes y variantes
app.get('/api/productos/:id', (req, res) => {
  const productoId = req.params.id;

  DB.query('SELECT * FROM productos WHERE id = ?', [productoId], (err, productos) => {
    if (err) return res.status(500).json({ error: err.message });
    if (productos.length === 0) return res.status(404).json({ error: 'Producto no encontrado' });

    const producto = productos[0];

    DB.query('SELECT ruta_imagen FROM imagenes_producto WHERE producto_id = ?', [productoId], (errImg, imagenes) => {
      if (errImg) return res.status(500).json({ error: errImg.message });

      DB.query('SELECT id, color, talla, stock FROM variantes WHERE producto_id = ?', [productoId], (errVar, variantes) => {
        if (errVar) return res.status(500).json({ error: errVar.message });

        const queryRelacionados = `
          SELECT p.id, p.nombre, p.precio,
                 MIN(i.ruta_imagen) AS imagen
          FROM relacionados r
          JOIN productos p ON r.producto_relacionado_id = p.id
          LEFT JOIN imagenes_producto i ON p.id = i.producto_id
          WHERE r.producto_id = ?
          GROUP BY p.id
        `;

        DB.query(queryRelacionados, [productoId], (errRel, relacionados) => {
          if (errRel) return res.status(500).json({ error: errRel.message });

          res.json({
            ...producto,
            imagenes: imagenes.map(i => i.ruta_imagen),
            variantes,
            relacionados,
          });
        });
      });
    });
  });
});

// Crear producto con imagen y tallas
app.post('/api/productos', (req, res) => {
  const { nombre, descripcion, precio, imagen, tallas } = req.body;

  DB.query(
    'INSERT INTO productos (nombre, descripcion, precio) VALUES (?, ?, ?)',
    [nombre, descripcion, precio],
    (err, result) => {
      if (err) return res.status(500).json({ error: err.message });

      const productoId = result.insertId;

      DB.query(
        'INSERT INTO imagenes_producto (producto_id, ruta_imagen) VALUES (?, ?)',
        [productoId, imagen],
        (errImg) => {
          if (errImg) return res.status(500).json({ error: errImg.message });

          const listaTallas = (tallas || '')
            .split(',')
            .map(t => t.trim())
            .filter(Boolean);

          if (listaTallas.length === 0) {
            return res.status(201).json({ id: productoId, nombre, descripcion, precio, imagen });
          }

          const valores = listaTallas.map(talla => [productoId, null, talla, 0]);

          DB.query('INSERT INTO variantes (producto_id, color, talla, stock) VALUES ?', [valores], (errVar) => {
            if (errVar) return res.status(500).json({ error: errVar.message });
            res.status(201).json({ id: productoId, nombre, descripcion, precio, imagen, tallas: listaTallas });
          });
        }
      );
    }
  );
});

// Actualizar producto
app.put('/api/productos/:id', (req, res) => {
  const { nombre, descripcion, precio } = req.body;
  DB.query(
    'UPDATE productos SET nombre=?, descripcion=?, precio=? WHERE id=?',
    [nombre, descripcion, precio, req.params.id],
    (err) => {
      if (err) return res.status(500).json({ error: err.message });
      res.json({ mensaje: 'Producto actualizado' });
    }
  );
});

// Eliminar producto
app.delete('/api/productos/:id', (req, res) => {
  DB.query('DELETE FROM productos WHERE id = ?', [req.params.id], (err) => {
    if (err) return res.status(500).json({ error: err.message });
    res.json({ mensaje: 'Producto eliminado' });
  });
});

// ── USUARIOS ───────────────────────────────────────

app.post('/api/registro', async (req, res) => {
  const { nombre, email, password } = req.body;
  DB.query('SELECT id FROM usuarios WHERE email = ?', [email], async (err, results) => {
    if (err) return res.status(500).json({ error: err.message });
    if (results.length > 0) return res.status(400).json({ error: 'Email ya registrado' });
    const hash = await bcrypt.hash(password, 10);
    DB.query(
      'INSERT INTO usuarios (nombre, email, password, rol) VALUES (?, ?, ?, "cliente")',
      [nombre, email, hash],
      (err) => {
        if (err) return res.status(500).json({ error: err.message });
        res.status(201).json({ mensaje: 'Usuario creado' });
      }
    );
  });
});

app.post('/api/login', async (req, res) => {
  const { email, password } = req.body;
  DB.query('SELECT * FROM usuarios WHERE email = ?', [email], async (err, results) => {
    if (err) return res.status(500).json({ error: err.message });
    if (results.length === 0) return res.status(401).json({ error: 'Email o contraseña incorrectos' });
    const usuario = results[0];
    const esCorrecta = await bcrypt.compare(password, usuario.password);
    if (!esCorrecta) return res.status(401).json({ error: 'Email o contraseña incorrectos' });
    const token = jwt.sign({ id: usuario.id, rol: usuario.rol }, SECRET_KEY, { expiresIn: '8h' });
    res.json({ token, rol: usuario.rol, nombre: usuario.nombre });
  });
});

// ── RELACIONADOS ───────────────────────────────────

// Obtener relacionados de un producto
app.get('/api/productos/:id/relacionados', (req, res) => {
  const query = `
    SELECT p.id, p.nombre, p.precio,
           MIN(i.ruta_imagen) AS imagen
    FROM relacionados r
    JOIN productos p ON r.producto_relacionado_id = p.id
    LEFT JOIN imagenes_producto i ON p.id = i.producto_id
    WHERE r.producto_id = ?
    GROUP BY p.id
  `;
  DB.query(query, [req.params.id], (err, results) => {
    if (err) return res.status(500).json({ error: err.message });
    res.json(results);
  });
});

// Agregar un relacionado
app.post('/api/productos/:id/relacionados', (req, res) => {
  const { producto_relacionado_id } = req.body;
  DB.query(
    'INSERT INTO relacionados (producto_id, producto_relacionado_id) VALUES (?, ?)',
    [req.params.id, producto_relacionado_id],
    (err) => {
      if (err) return res.status(500).json({ error: err.message });
      res.status(201).json({ mensaje: 'Relacionado agregado' });
    }
  );
});

// Eliminar un relacionado
app.delete('/api/productos/:id/relacionados/:relacionadoId', (req, res) => {
  DB.query(
    'DELETE FROM relacionados WHERE producto_id = ? AND producto_relacionado_id = ?',
    [req.params.id, req.params.relacionadoId],
    (err) => {
      if (err) return res.status(500).json({ error: err.message });
      res.json({ mensaje: 'Relacionado eliminado' });
    }
  );
});

// ── REGISTRO CLIENTE ────────────────────────────────
app.post('/api/registro', async (req, res) => {
  const { nombre, email, password } = req.body;
  DB.query('SELECT id FROM usuarios WHERE email = ?', [email], async (err, results) => {
    if (err) return res.status(500).json({ error: err.message });
    if (results.length > 0) return res.status(400).json({ error: 'Email ya registrado' });
    const hash = await bcrypt.hash(password, 10);
    DB.query(
      'INSERT INTO usuarios (nombre, email, password, rol) VALUES (?, ?, ?, "cliente")',
      [nombre, email, hash],
      (err, result) => {
        if (err) return res.status(500).json({ error: err.message });
        const token = jwt.sign({ id: result.insertId, rol: 'cliente' }, SECRET_KEY, { expiresIn: '8h' });
        res.status(201).json({ token, rol: 'cliente', nombre });
      }
    );
  });
});

// ── RESEÑAS ─────────────────────────────────────────

// Obtener reseñas de un producto
app.get('/api/productos/:id/resenas', (req, res) => {
  const query = `
    SELECT r.id, r.comentario, r.calificacion, r.creado_en,
           u.nombre AS autor
    FROM resenas r
    JOIN usuarios u ON r.usuario_id = u.id
    WHERE r.producto_id = ?
    ORDER BY r.creado_en DESC
  `;
  DB.query(query, [req.params.id], (err, results) => {
    if (err) return res.status(500).json({ error: err.message });
    res.json(results);
  });
});

// Crear reseña (requiere token)
app.post('/api/productos/:id/resenas', (req, res) => {
  const authHeader = req.headers.authorization;
  if (!authHeader) return res.status(401).json({ error: 'No autorizado' });

  const token = authHeader.split(' ')[1];
  let usuario;
  try {
    usuario = jwt.verify(token, SECRET_KEY);
  } catch {
    return res.status(401).json({ error: 'Token inválido' });
  }

  const { comentario, calificacion } = req.body;
  if (!comentario || !calificacion) return res.status(400).json({ error: 'Faltan datos' });

  // Verificar que no haya reseñado antes
  DB.query(
    'SELECT id FROM resenas WHERE producto_id = ? AND usuario_id = ?',
    [req.params.id, usuario.id],
    (err, results) => {
      if (err) return res.status(500).json({ error: err.message });
      if (results.length > 0) return res.status(400).json({ error: 'Ya dejaste una reseña para este producto' });

      DB.query(
        'INSERT INTO resenas (producto_id, usuario_id, comentario, calificacion) VALUES (?, ?, ?, ?)',
        [req.params.id, usuario.id, comentario, calificacion],
        (err, result) => {
          if (err) return res.status(500).json({ error: err.message });
          res.status(201).json({ id: result.insertId, mensaje: 'Reseña publicada' });
        }
      );
    }
  );
});

// Eliminar reseña (solo el autor o admin)
app.delete('/api/resenas/:id', (req, res) => {
  const authHeader = req.headers.authorization;
  if (!authHeader) return res.status(401).json({ error: 'No autorizado' });

  const token = authHeader.split(' ')[1];
  let usuario;
  try {
    usuario = jwt.verify(token, SECRET_KEY);
  } catch {
    return res.status(401).json({ error: 'Token inválido' });
  }

  DB.query('SELECT * FROM resenas WHERE id = ?', [req.params.id], (err, results) => {
    if (err) return res.status(500).json({ error: err.message });
    if (results.length === 0) return res.status(404).json({ error: 'Reseña no encontrada' });

    const resena = results[0];
    if (resena.usuario_id !== usuario.id && usuario.rol !== 'admin') {
      return res.status(403).json({ error: 'Sin permiso' });
    }

    DB.query('DELETE FROM resenas WHERE id = ?', [req.params.id], (err) => {
      if (err) return res.status(500).json({ error: err.message });
      res.json({ mensaje: 'Reseña eliminada' });
    });
  });
});

// ── SUBIR IMAGEN ───────────────────────────────
app.post('/api/upload', upload.single('imagen'), (req, res) => {
    if (!req.file) return res.status(400).json({ error: 'No se recibió ninguna imagen.' });
    res.json({ url: req.file.path });
});

// ── COLECCIONES ────────────────────────────────────

// Todas las colecciones (con conteo de cards)
app.get('/api/colecciones', (req, res) => {
  const query = `
    SELECT c.id, c.titulo, c.slug, c.descripcion, c.imagen_portada,
           COUNT(k.id) AS total_cards
    FROM colecciones c
    LEFT JOIN coleccion_cards k ON c.id = k.coleccion_id
    GROUP BY c.id
    ORDER BY c.creado_en DESC`;
  DB.query(query, (err, results) => {
    if (err) return res.status(500).json({ error: err.message });
    res.json(results);
  });
});

// Una colección por slug (para la página pública)
app.get('/api/colecciones/slug/:slug', (req, res) => {
  DB.query('SELECT * FROM colecciones WHERE slug = ?', [req.params.slug], (err, rows) => {
    if (err) return res.status(500).json({ error: err.message });
    if (rows.length === 0) return res.status(404).json({ error: 'Colección no encontrada' });
    const col = rows[0];
    DB.query('SELECT * FROM coleccion_cards WHERE coleccion_id = ? ORDER BY orden ASC, id ASC', [col.id], (err2, cards) => {
      if (err2) return res.status(500).json({ error: err2.message });
      res.json({ ...col, cards });
    });
  });
});

// Una colección por id
app.get('/api/colecciones/:id', (req, res) => {
  DB.query('SELECT * FROM colecciones WHERE id = ?', [req.params.id], (err, rows) => {
    if (err) return res.status(500).json({ error: err.message });
    if (rows.length === 0) return res.status(404).json({ error: 'Colección no encontrada' });
    res.json(rows[0]);
  });
});

// Crear colección
app.post('/api/colecciones', (req, res) => {
  const { titulo, slug, descripcion, imagen_portada } = req.body;
  if (!titulo || !slug) return res.status(400).json({ error: 'titulo y slug son requeridos' });
  DB.query(
    'INSERT INTO colecciones (titulo, slug, descripcion, imagen_portada) VALUES (?, ?, ?, ?)',
    [titulo, slug, descripcion || '', imagen_portada || ''],
    (err, result) => {
      if (err) {
        if (err.code === 'ER_DUP_ENTRY') return res.status(400).json({ error: 'El slug ya existe' });
        return res.status(500).json({ error: err.message });
      }
      res.status(201).json({ id: result.insertId, titulo, slug, descripcion, imagen_portada, total_cards: 0 });
    }
  );
});

// Editar colección
app.put('/api/colecciones/:id', (req, res) => {
  const { titulo, slug, descripcion, imagen_portada } = req.body;
  DB.query(
    'UPDATE colecciones SET titulo=?, slug=?, descripcion=?, imagen_portada=? WHERE id=?',
    [titulo, slug, descripcion || '', imagen_portada || '', req.params.id],
    (err) => {
      if (err) {
        if (err.code === 'ER_DUP_ENTRY') return res.status(400).json({ error: 'El slug ya existe' });
        return res.status(500).json({ error: err.message });
      }
      res.json({ mensaje: 'Colección actualizada' });
    }
  );
});

// Eliminar colección (las cards se eliminan en cascada)
app.delete('/api/colecciones/:id', (req, res) => {
  DB.query('DELETE FROM colecciones WHERE id = ?', [req.params.id], (err) => {
    if (err) return res.status(500).json({ error: err.message });
    res.json({ mensaje: 'Colección eliminada' });
  });
});

// ── CARDS DE COLECCIÓN ──────────────────────────────

// Obtener cards de una colección
app.get('/api/colecciones/:id/cards', (req, res) => {
  DB.query(
    'SELECT * FROM coleccion_cards WHERE coleccion_id = ? ORDER BY orden ASC, id ASC',
    [req.params.id],
    (err, results) => {
      if (err) return res.status(500).json({ error: err.message });
      res.json(results);
    }
  );
});

// Crear card en una colección
app.post('/api/colecciones/:id/cards', (req, res) => {
  const { titulo, descripcion_corta, imagen, enlace, precio, fecha, tags, etiqueta } = req.body;
  if (!titulo) return res.status(400).json({ error: 'titulo es requerido' });
  DB.query(
    `INSERT INTO coleccion_cards
       (coleccion_id, titulo, descripcion_corta, imagen, enlace, precio, fecha, tags, etiqueta)
     VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)`,
    [
      req.params.id,
      titulo,
      descripcion_corta || '',
      imagen || '',
      enlace || '',
      precio || null,
      fecha || null,
      tags || '',
      etiqueta || '',
    ],
    (err, result) => {
      if (err) return res.status(500).json({ error: err.message });
      res.status(201).json({
        id: result.insertId,
        coleccion_id: Number(req.params.id),
        titulo, descripcion_corta, imagen, enlace, precio, fecha, tags, etiqueta,
      });
    }
  );
});

// Editar card
app.put('/api/colecciones/:id/cards/:cardId', (req, res) => {
  const { titulo, descripcion_corta, imagen, enlace, precio, fecha, tags, etiqueta } = req.body;
  DB.query(
    `UPDATE coleccion_cards
     SET titulo=?, descripcion_corta=?, imagen=?, enlace=?, precio=?, fecha=?, tags=?, etiqueta=?
     WHERE id=? AND coleccion_id=?`,
    [
      titulo,
      descripcion_corta || '',
      imagen || '',
      enlace || '',
      precio || null,
      fecha || null,
      tags || '',
      etiqueta || '',
      req.params.cardId,
      req.params.id,
    ],
    (err) => {
      if (err) return res.status(500).json({ error: err.message });
      res.json({ mensaje: 'Card actualizada' });
    }
  );
});

// Eliminar card
app.delete('/api/colecciones/:id/cards/:cardId', (req, res) => {
  DB.query(
    'DELETE FROM coleccion_cards WHERE id = ? AND coleccion_id = ?',
    [req.params.cardId, req.params.id],
    (err) => {
      if (err) return res.status(500).json({ error: err.message });
      res.json({ mensaje: 'Card eliminada' });
    }
  );
});

// ── SERVIDOR ───────────────────────────────────────

app.listen(port, () => {
  console.log(`Servidor corriendo en http://localhost:${port}`);
});