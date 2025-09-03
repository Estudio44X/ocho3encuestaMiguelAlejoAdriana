const express = require("express");
const fs = require("fs");
const path = require("path");
const app = express();
const PORT = process.env.PORT || 3000;

const DATA_FILE = path.join(__dirname, "respuestas.json");

// Middleware
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static(__dirname));

// Función segura para leer respuestas
function leerRespuestas() {
  if (!fs.existsSync(DATA_FILE)) return [];
  try {
    const data = fs.readFileSync(DATA_FILE, "utf8");
    return data ? JSON.parse(data) : [];
  } catch (err) {
    console.error("Error leyendo respuestas:", err);
    return [];
  }
}

// Guardar respuesta
app.post("/api/respuestas", (req, res) => {
  const respuesta = req.body;
  const respuestas = leerRespuestas();
  respuestas.push(respuesta);
  try {
    fs.writeFileSync(DATA_FILE, JSON.stringify(respuestas, null, 2));
    res.json({ success: true, message: "Respuesta guardada" });
  } catch (err) {
    console.error("Error guardando respuesta:", err);
    res.status(500).json({ success: false, message: "Error al guardar respuesta" });
  }
});

// Obtener respuestas
app.get("/api/respuestas", (req, res) => {
  res.json(leerRespuestas());
});

// Borrar todas las respuestas
app.delete("/api/respuestas", (req, res) => {
  try {
    fs.writeFileSync(DATA_FILE, JSON.stringify([]));
    res.json({ success: true, message: "Respuestas borradas" });
  } catch (err) {
    console.error("Error borrando respuestas:", err);
    res.status(500).json({ success: false, message: "Error al borrar respuestas" });
  }
});

// Servidor
app.listen(PORT, () => console.log(`Servidor corriendo en http://localhost:${PORT}`));
