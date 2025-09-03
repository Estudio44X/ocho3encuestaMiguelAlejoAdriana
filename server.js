const express = require("express");
const fs = require("fs");
const path = require("path");
const app = express();
const PORT = process.env.PORT || 3000;

const DATA_FILE = path.join(__dirname, "respuestas.json");

// Middleware
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static(__dirname)); // sirve index.html, admin.html, styles.css, script.js

// Guardar respuesta
app.post("/api/respuestas", (req, res) => {
  const respuesta = req.body;
  let respuestas = [];
  if (fs.existsSync(DATA_FILE)) {
    respuestas = JSON.parse(fs.readFileSync(DATA_FILE));
  }
  respuestas.push(respuesta);
  fs.writeFileSync(DATA_FILE, JSON.stringify(respuestas, null, 2));
  res.json({ success: true, message: "Respuesta guardada" });
});

// Obtener respuestas
app.get("/api/respuestas", (req, res) => {
  if (!fs.existsSync(DATA_FILE)) return res.json([]);
  const respuestas = JSON.parse(fs.readFileSync(DATA_FILE));
  res.json(respuestas);
});

// Borrar todas las respuestas
app.delete("/api/respuestas", (req, res) => {
  fs.writeFileSync(DATA_FILE, JSON.stringify([]));
  res.json({ success: true, message: "Respuestas borradas" });
});

// Servidor
app.listen(PORT, () => {
  console.log(`Servidor corriendo en http://localhost:${PORT}`);
});
