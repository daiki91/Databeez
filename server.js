require("dotenv").config();
const express = require("express");
const cors = require("cors");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const mysql = require("mysql2/promise");
const Minio = require("minio");

const app = express();
const PORT = process.env.PORT || 3000;

app.use(cors());
app.use(express.json());

const jwtSecret = process.env.JWT_SECRET || "secret123";

const db = mysql.createPool({
  host: process.env.DATABASE_HOST || "localhost",
  port: process.env.DATABASE_PORT ? Number(process.env.DATABASE_PORT) : 3306,
  user: process.env.DATABASE_USER || "root",
  password: process.env.DATABASE_PASSWORD || "",
  database: process.env.DATABASE_NAME || "databeez",
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0,
});

const minioClient = new Minio.Client({
  endPoint: process.env.MINIO_ENDPOINT_HOST || "localhost",
  port: Number(process.env.MINIO_ENDPOINT_PORT || 9000),
  useSSL: false,
  accessKey: process.env.MINIO_ACCESS_KEY || "admin",
  secretKey: process.env.MINIO_SECRET_KEY || "passer123",
});

const bucketName = process.env.MINIO_BUCKET || "databeez-notes";

async function initStorage() {
  try {
    const found = await minioClient.bucketExists(bucketName);
    if (!found) {
      await minioClient.makeBucket(bucketName, "us-east-1");
      console.log(`Bucket ${bucketName} créé`);
    }
  } catch (error) {
    console.error("Erreur Minio init :", error);
  }
}

async function initDb() {
  await db.query(`CREATE TABLE IF NOT EXISTS users (
    id INT AUTO_INCREMENT PRIMARY KEY,
    email VARCHAR(255) UNIQUE,
    phone VARCHAR(50) UNIQUE,
    password_hash VARCHAR(255) NOT NULL,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    updated_at DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
  )`);

  await db.query(`CREATE TABLE IF NOT EXISTS projects (
    id INT AUTO_INCREMENT PRIMARY KEY,
    title VARCHAR(255) NOT NULL,
    description TEXT,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    updated_at DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
  )`);

  await db.query(`CREATE TABLE IF NOT EXISTS notes (
    id INT AUTO_INCREMENT PRIMARY KEY,
    project_id INT NOT NULL,
    title VARCHAR(255) NOT NULL,
    description TEXT,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    updated_at DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (project_id) REFERENCES projects(id) ON DELETE CASCADE
  )`);

  console.log("Base de données initialisée");
}

function authMiddleware(req, res, next) {
  const header = req.headers.authorization;
  if (!header || !header.startsWith("Bearer ")) {
    return res.status(401).json({ message: "Token manquant" });
  }
  const token = header.substring(7);
  try {
    const payload = jwt.verify(token, jwtSecret);
    req.user = payload;
    next();
  } catch (error) {
    return res.status(401).json({ message: "Token invalide" });
  }
}

app.get("/", (req, res) => {
  res.send("Serveur Node.js fonctionne !");
});

app.get("/api", (req, res) => {
  res.json({ status: "ok", message: "API Databeez en ligne" });
});

app.post("/api/auth/register", async (req, res) => {
  const { email, phone, password } = req.body;
  if ((!email && !phone) || !password) {
    return res.status(400).json({ message: "Email ou téléphone plus mot de passe requis" });
  }
  try {
    const hash = await bcrypt.hash(password, 10);
    const [result] = await db.execute(
      "INSERT INTO users (email, phone, password_hash) VALUES (?, ?, ?)",
      [email || null, phone || null, hash]
    );
    return res.status(201).json({ id: result.insertId, email, phone });
  } catch (error) {
    if (error.code === "ER_DUP_ENTRY") {
      return res.status(409).json({ message: "Email ou téléphone déjà utilisé" });
    }
    console.error(error);
    return res.status(500).json({ message: "Erreur inscription" });
  }
});

app.post("/api/auth/login", async (req, res) => {
  const { email, phone, password } = req.body;
  if ((!email && !phone) || !password) {
    return res.status(400).json({ message: "Email ou téléphone plus mot de passe requis" });
  }
  try {
    const [rows] = await db.execute(
      "SELECT * FROM users WHERE email = ? OR phone = ? LIMIT 1",
      [email || phone, phone || email]
    );
    if (!rows.length) {
      return res.status(401).json({ message: "Utilisateur non trouvé" });
    }
    const user = rows[0];
    const valid = await bcrypt.compare(password, user.password_hash);
    if (!valid) {
      return res.status(401).json({ message: "Mot de passe incorrect" });
    }
    const token = jwt.sign({ id: user.id, email: user.email, phone: user.phone }, jwtSecret, { expiresIn: "8h" });
    return res.json({ token });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: "Erreur connexion" });
  }
});

app.get("/api/auth/me", authMiddleware, async (req, res) => {
  res.json({ user: req.user });
});

app.get("/api/projects", authMiddleware, async (req, res) => {
  const [rows] = await db.query("SELECT * FROM projects ORDER BY created_at DESC");
  res.json(rows);
});

app.post("/api/projects", authMiddleware, async (req, res) => {
  const { title, description } = req.body;
  if (!title) return res.status(400).json({ message: "Titre requis" });
  const [result] = await db.execute("INSERT INTO projects (title, description) VALUES (?, ?)", [title, description || null]);
  const [projectRow] = await db.execute("SELECT * FROM projects WHERE id = ?", [result.insertId]);
  res.status(201).json(projectRow[0]);
});

app.put("/api/projects/:id", authMiddleware, async (req, res) => {
  const { id } = req.params;
  const { title, description } = req.body;
  await db.execute("UPDATE projects SET title = ?, description = ? WHERE id = ?", [title, description, id]);
  const [rows] = await db.execute("SELECT * FROM projects WHERE id = ?", [id]);
  res.json(rows[0]);
});

app.delete("/api/projects/:id", authMiddleware, async (req, res) => {
  const { id } = req.params;
  await db.execute("DELETE FROM projects WHERE id = ?", [id]);
  res.json({ message: "Projet supprimé" });
});

app.get("/api/notes", authMiddleware, async (req, res) => {
  const [rows] = await db.query("SELECT * FROM notes ORDER BY created_at DESC");
  res.json(rows);
});

app.get("/api/projects/:projectId/notes", authMiddleware, async (req, res) => {
  const { projectId } = req.params;
  const [rows] = await db.execute("SELECT * FROM notes WHERE project_id = ? ORDER BY created_at DESC", [projectId]);
  res.json(rows);
});

app.post("/api/projects/:projectId/notes", authMiddleware, async (req, res) => {
  const { projectId } = req.params;
  const { title, description } = req.body;
  if (!title) return res.status(400).json({ message: "Titre requis" });

  const [result] = await db.execute(
    "INSERT INTO notes (project_id, title, description) VALUES (?, ?, ?)",
    [projectId, title, description || null]
  );
  const [rows] = await db.execute("SELECT * FROM notes WHERE id = ?", [result.insertId]);
  const note = rows[0];

  // Save note in S3
  await minioClient.putObject(bucketName, `notes/${note.id}.json`, JSON.stringify(note));

  res.status(201).json(note);
});

app.put("/api/notes/:id", authMiddleware, async (req, res) => {
  const { id } = req.params;
  const { title, description } = req.body;

  await db.execute("UPDATE notes SET title = ?, description = ? WHERE id = ?", [title, description, id]);
  const [rows] = await db.execute("SELECT * FROM notes WHERE id = ?", [id]);
  const note = rows[0];

  await minioClient.putObject(bucketName, `notes/${note.id}.json`, JSON.stringify(note));

  res.json(note);
});

app.delete("/api/notes/:id", authMiddleware, async (req, res) => {
  const { id } = req.params;
  await db.execute("DELETE FROM notes WHERE id = ?", [id]);
  try {
    await minioClient.removeObject(bucketName, `notes/${id}.json`);
  } catch (err) {
    // ignore if object not found
    console.warn("Suppression S3 note échouée :", err.message);
  }
  res.json({ message: "Note supprimée" });
});

(async () => {
  await initDb();
  await initStorage();
  app.listen(PORT, "0.0.0.0", () => {
    console.log(`Serveur lancé sur port ${PORT}`);
  });
})();