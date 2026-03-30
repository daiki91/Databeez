require("dotenv").config();
const express = require("express");
const cors = require("cors");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const mysql = require("mysql2/promise");
const Minio = require("minio");
const multer = require("multer");
const path = require("path");

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

// Configuration Multer pour l'upload
const storage = multer.memoryStorage();
const upload = multer({
  storage: storage,
  limits: { fileSize: 50 * 1024 * 1024 }, // 50MB
  fileFilter: (req, file, cb) => {
    const allowedMimes = ['application/pdf', 'image/png', 'image/jpeg', 'image/jpg', 'image/gif', 'image/webp'];
    if (allowedMimes.includes(file.mimetype)) {
      cb(null, true);
    } else {
      cb(new Error('Type de fichier non autorisé. Utilisez PDF ou images (PNG, JPEG, GIF, WEBP)'));
    }
  }
});

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
    created_by INT NOT NULL,
    updated_by INT,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    updated_at DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (created_by) REFERENCES users(id) ON DELETE CASCADE,
    FOREIGN KEY (updated_by) REFERENCES users(id) ON DELETE SET NULL
  )`);

  await db.query(`CREATE TABLE IF NOT EXISTS notes (
    id INT AUTO_INCREMENT PRIMARY KEY,
    project_id INT NOT NULL,
    title VARCHAR(255) NOT NULL,
    description TEXT,
    attachments JSON,
    created_by INT NOT NULL,
    updated_by INT,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    updated_at DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (project_id) REFERENCES projects(id) ON DELETE CASCADE,
    FOREIGN KEY (created_by) REFERENCES users(id) ON DELETE CASCADE,
    FOREIGN KEY (updated_by) REFERENCES users(id) ON DELETE SET NULL
  )`);

  await db.query(`CREATE TABLE IF NOT EXISTS audit_logs (
    id INT AUTO_INCREMENT PRIMARY KEY,
    entity_type VARCHAR(50) NOT NULL,
    entity_id INT NOT NULL,
    action VARCHAR(20) NOT NULL,
    user_id INT NOT NULL,
    old_values JSON,
    new_values JSON,
    action_date DATETIME DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
    INDEX idx_entity (entity_type, entity_id),
    INDEX idx_date (action_date)
  )`);

  // Migration: Ajouter la colonne attachments si elle n'existe pas
  try {
    await db.query(`ALTER TABLE notes ADD COLUMN attachments JSON DEFAULT NULL`);
    console.log("Colonne attachments ajoutée à la table notes");
  } catch (error) {
    if (error.code === "ER_DUP_FIELDNAME") {
      // Column already exists
      console.log("Colonne attachments existe déjà");
    } else {
      console.warn("Erreur migration attachments:", error.message);
    }
  }

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

// Helper pour enregistrer les modifications dans audit_logs
async function logAudit(entityType, entityId, action, userId, oldValues = null, newValues = null) {
  try {
    await db.execute(
      "INSERT INTO audit_logs (entity_type, entity_id, action, user_id, old_values, new_values) VALUES (?, ?, ?, ?, ?, ?)",
      [
        entityType,
        entityId,
        action,
        userId,
        oldValues ? JSON.stringify(oldValues) : null,
        newValues ? JSON.stringify(newValues) : null
      ]
    );
  } catch (error) {
    console.error("Erreur audit log:", error);
  }
}

function normalizeAttachments(attachmentsValue) {
  if (!attachmentsValue) return [];
  if (Array.isArray(attachmentsValue)) return attachmentsValue;
  if (typeof attachmentsValue === "string") {
    try {
      const parsed = JSON.parse(attachmentsValue);
      return Array.isArray(parsed) ? parsed : [];
    } catch (error) {
      console.warn("Erreur parsing attachments:", error.message);
      return [];
    }
  }
  return [];
}

app.get("/", (req, res) => {
  const endpoints = {
    status: "Serveur Databeez API en ligne",
    version: "1.0.0",
    baseURL: "http://localhost:3000",
    endpoints: {
      health: {
        "GET /": "Liste tous les endpoints disponibles",
        "GET /api": "Status de l'API",
      },
      authentication: {
        "POST /api/auth/register": "Inscription - Body: { email?, phone?, password }",
        "POST /api/auth/login": "Connexion - Body: { email?, phone?, password }",
        "GET /api/auth/me": "Infos utilisateur actuels - Nécessite Authorization Bearer",
      },
      projects: {
        "GET /api/projects": "Récupérer tous les projets - Nécessite Authorization Bearer",
        "POST /api/projects": "Créer un projet - Body: { title, description? } - Nécessite Authorization Bearer",
        "PUT /api/projects/:id": "Modifier un projet - Body: { title, description? } - Nécessite Authorization Bearer",
        "DELETE /api/projects/:id": "Supprimer un projet - Nécessite Authorization Bearer",
      },
      notes: {
        "GET /api/notes": "Récupérer toutes les notes - Nécessite Authorization Bearer",
        "GET /api/projects/:projectId/notes": "Récupérer les notes d'un projet - Nécessite Authorization Bearer",
        "POST /api/projects/:projectId/notes": "Créer une note - Body: { title, description? } - Nécessite Authorization Bearer",
        "PUT /api/notes/:id": "Modifier une note - Body: { title, description? } - Nécessite Authorization Bearer",
        "DELETE /api/notes/:id": "Supprimer une note - Nécessite Authorization Bearer",
      },
    },
    authHeader: {
      required: "Authorization: Bearer {token}",
      example: "Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
    },
    databaseStatus: {
      mysql: "Connecté et initialisé",
      minio: "Connecté et prêt",
    },
  };
  res.json(endpoints);
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
    
    // Générer un token immédiatement après l'inscription
    const token = jwt.sign({ id: result.insertId, email: email || null, phone: phone || null }, jwtSecret, { expiresIn: "8h" });
    
    return res.status(201).json({ 
      id: result.insertId, 
      email, 
      phone,
      token 
    });
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

// Mettre à jour le profil utilisateur (téléphone et/ou mot de passe)
app.put("/api/auth/profile", authMiddleware, async (req, res) => {
  const { phone, password } = req.body;
  const userId = req.user.id;

  try {
    // Vérifier si le téléphone est déjà utilisé (s'il a changé)
    if (phone) {
      const [existingPhone] = await db.execute(
        "SELECT id FROM users WHERE phone = ? AND id != ?",
        [phone, userId]
      );
      if (existingPhone.length > 0) {
        return res.status(409).json({ message: "Ce numéro de téléphone est déjà utilisé" });
      }
    }

    let updateFields = [];
    let updateValues = [];

    // Construire les champs à mettre à jour
    if (phone !== undefined) {
      updateFields.push("phone = ?");
      updateValues.push(phone || null);
    }

    if (password) {
      if (password.length < 6) {
        return res.status(400).json({ message: "Le mot de passe doit contenir au moins 6 caractères" });
      }
      const hash = await bcrypt.hash(password, 10);
      updateFields.push("password_hash = ?");
      updateValues.push(hash);
    }

    if (updateFields.length === 0) {
      return res.status(400).json({ message: "Aucune modification à apporter" });
    }

    // Ajouter l'ID pour la clause WHERE
    updateValues.push(userId);

    // Exécuter la mise à jour
    const query = `UPDATE users SET ${updateFields.join(", ")} WHERE id = ?`;
    await db.execute(query, updateValues);

    // Récupérer l'utilisateur mis à jour
    const [updatedUser] = await db.execute("SELECT id, email, phone FROM users WHERE id = ?", [userId]);
    const user = updatedUser[0];

    // Générer un nouveau token avec les données mises à jour
    const newToken = jwt.sign(
      { id: user.id, email: user.email, phone: user.phone },
      jwtSecret,
      { expiresIn: "8h" }
    );

    res.json({
      message: "Profil mis à jour avec succès",
      token: newToken,
      user: {
        id: user.id,
        email: user.email,
        phone: user.phone
      }
    });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: "Erreur lors de la mise à jour du profil" });
  }
});

app.get("/api/projects", authMiddleware, async (req, res) => {
  const [rows] = await db.query(`
    SELECT 
      p.*,
      COUNT(n.id) as notesCount
    FROM projects p
    LEFT JOIN notes n ON p.id = n.project_id
    GROUP BY p.id
    ORDER BY p.created_at DESC
  `);
  res.json(rows);
});

app.post("/api/projects", authMiddleware, async (req, res) => {
  const { title, description } = req.body;
  if (!title) return res.status(400).json({ message: "Titre requis" });
  
  const userId = req.user.id;
  const [result] = await db.execute(
    "INSERT INTO projects (title, description, created_by) VALUES (?, ?, ?)", 
    [title, description || null, userId]
  );
  
  const projectId = result.insertId;
  
  // Enregistrer dans audit_logs
  await logAudit("project", projectId, "CREATE", userId, null, { title, description });
  
  // Récupérer le projet avec infos utilisateur
  const [projectRow] = await db.execute(`
    SELECT 
      p.*,
      u.email as created_by_email,
      u.phone as created_by_phone
    FROM projects p
    JOIN users u ON p.created_by = u.id
    WHERE p.id = ?
  `, [projectId]);
  
  const project = projectRow[0];
  project.notesCount = 0;
  res.status(201).json(project);
});

app.put("/api/projects/:id", authMiddleware, async (req, res) => {
  const { id } = req.params;
  const { title, description } = req.body;
  const userId = req.user.id;
  
  // Récupérer les anciennes valeurs
  const [oldRows] = await db.execute("SELECT * FROM projects WHERE id = ?", [id]);
  const oldValues = oldRows[0] ? { title: oldRows[0].title, description: oldRows[0].description } : null;
  
  // Mettre à jour
  await db.execute(
    "UPDATE projects SET title = ?, description = ?, updated_by = ? WHERE id = ?", 
    [title, description, userId, id]
  );
  
  // Enregistrer dans audit_logs
  const newValues = { title, description };
  await logAudit("project", id, "UPDATE", userId, oldValues, newValues);
  
  const [rows] = await db.execute("SELECT * FROM projects WHERE id = ?", [id]);
  res.json(rows[0]);
});

app.delete("/api/projects/:id", authMiddleware, async (req, res) => {
  const { id } = req.params;
  const userId = req.user.id;
  
  // Récupérer les infos avant suppression
  const [projectRows] = await db.execute("SELECT * FROM projects WHERE id = ?", [id]);
  const project = projectRows[0];
  
  // Supprimer
  await db.execute("DELETE FROM projects WHERE id = ?", [id]);
  
  // Enregistrer dans audit_logs
  await logAudit("project", id, "DELETE", userId, { title: project.title, description: project.description }, null);
  
  res.json({ message: "Projet supprimé" });
});

app.get("/api/notes", authMiddleware, async (req, res) => {
  const [rows] = await db.query("SELECT * FROM notes ORDER BY created_at DESC");
  res.json(rows);
});

app.get("/api/projects/:projectId/notes", authMiddleware, async (req, res) => {
  const { projectId } = req.params;
  const [rows] = await db.execute(`
    SELECT 
      n.*,
      uc.email as created_by_email,
      uc.phone as created_by_phone,
      uu.email as updated_by_email,
      uu.phone as updated_by_phone
    FROM notes n
    LEFT JOIN users uc ON n.created_by = uc.id
    LEFT JOIN users uu ON n.updated_by = uu.id
    WHERE n.project_id = ?
    ORDER BY n.created_at DESC
  `, [projectId]);
  res.json(rows);
});

app.post("/api/projects/:projectId/notes", authMiddleware, async (req, res) => {
  const { projectId } = req.params;
  const { title, description } = req.body;
  if (!title) return res.status(400).json({ message: "Titre requis" });

  const userId = req.user.id;
  
  const [result] = await db.execute(
    "INSERT INTO notes (project_id, title, description, created_by, attachments) VALUES (?, ?, ?, ?, ?)",
    [projectId, title, description || null, userId, JSON.stringify([])]
  );
  
  const noteId = result.insertId;
  
  // Enregistrer dans audit_logs
  await logAudit("note", noteId, "CREATE", userId, null, { title, description });
  
  const [rows] = await db.execute("SELECT * FROM notes WHERE id = ?", [noteId]);
  const note = rows[0];

  // Save note in S3
  await minioClient.putObject(bucketName, `notes/${note.id}.json`, JSON.stringify(note));

  res.status(201).json(note);
});

app.put("/api/notes/:id", authMiddleware, async (req, res) => {
  const { id } = req.params;
  const { title, description } = req.body;
  const userId = req.user.id;

  // Récupérer les anciennes valeurs
  const [oldRows] = await db.execute("SELECT * FROM notes WHERE id = ?", [id]);
  const oldValues = oldRows[0] ? { title: oldRows[0].title, description: oldRows[0].description } : null;

  // Mettre à jour
  await db.execute("UPDATE notes SET title = ?, description = ?, updated_by = ? WHERE id = ?", [title, description, userId, id]);
  
  // Enregistrer dans audit_logs
  const newValues = { title, description };
  await logAudit("note", id, "UPDATE", userId, oldValues, newValues);
  
  const [rows] = await db.execute("SELECT * FROM notes WHERE id = ?", [id]);
  const note = rows[0];

  await minioClient.putObject(bucketName, `notes/${note.id}.json`, JSON.stringify(note));

  res.json(note);
});

app.delete("/api/notes/:id", authMiddleware, async (req, res) => {
  const { id } = req.params;
  const userId = req.user.id;
  
  // Récupérer les infos avant suppression
  const [noteRows] = await db.execute("SELECT * FROM notes WHERE id = ?", [id]);
  const note = noteRows[0];
  
  // Supprimer tous les fichiers attachés de Minio
  if (note.attachments) {
    const attachments = normalizeAttachments(note.attachments);
    for (const attachment of attachments) {
      try {
        await minioClient.removeObject(bucketName, attachment.minioPath);
      } catch (err) {
        console.warn(`Suppression fichier ${attachment.minioPath} échouée:`, err.message);
      }
    }
  }
  
  // Supprimer
  await db.execute("DELETE FROM notes WHERE id = ?", [id]);
  
  // Enregistrer dans audit_logs
  await logAudit("note", id, "DELETE", userId, { title: note.title, description: note.description }, null);
  
  try {
    await minioClient.removeObject(bucketName, `notes/${id}.json`);
  } catch (err) {
    // ignore if object not found
    console.warn("Suppression S3 note échouée :", err.message);
  }
  res.json({ message: "Note supprimée" });
});

// ====== ENDPOINTS UPLOAD DE FICHIERS ======

// Upload d'un fichier attaché à une note
app.post("/api/notes/:noteId/attachments", authMiddleware, upload.single('file'), async (req, res) => {
  const { noteId } = req.params;
  
  if (!req.file) {
    return res.status(400).json({ message: "Aucun fichier fourni" });
  }

  const userId = req.user.id;

  try {
    const [noteRows] = await db.execute("SELECT * FROM notes WHERE id = ?", [noteId]);
    if (!noteRows.length) {
      return res.status(404).json({ message: "Note non trouvée" });
    }

    const note = noteRows[0];
    const fileExt = path.extname(req.file.originalname);
    const fileName = `${noteId}-${Date.now()}${fileExt}`;
    const minioPath = `notes/attachments/${fileName}`;

    // Upload to Minio
    await minioClient.putObject(bucketName, minioPath, req.file.buffer, req.file.size, {
      'Content-Type': req.file.mimetype
    });

    // Mettre à jour les attachments dans la note
    let attachments = [];
    if (note.attachments) {
      attachments = normalizeAttachments(note.attachments);
    }

    const newAttachment = {
      id: Date.now(),
      fileName: req.file.originalname,
      minioPath: minioPath,
      fileType: req.file.mimetype,
      size: req.file.size,
      uploadedAt: new Date().toISOString()
    };

    attachments.push(newAttachment);

    await db.execute(
      "UPDATE notes SET attachments = ?, updated_by = ? WHERE id = ?",
      [JSON.stringify(attachments), userId, noteId]
    );

    // Enregistrer dans audit_logs
    await logAudit("note", noteId, "UPDATE", userId, null, { attachments: attachments });

    res.status(201).json(newAttachment);
  } catch (error) {
    console.error("Erreur upload:", error);
    res.status(500).json({ message: "Erreur lors de l'upload du fichier" });
  }
});

// Récupérer les attachments d'une note
app.get("/api/notes/:noteId/attachments", authMiddleware, async (req, res) => {
  const { noteId } = req.params;

  try {
    const [noteRows] = await db.execute("SELECT * FROM notes WHERE id = ?", [noteId]);
    if (!noteRows.length) {
      return res.status(404).json({ message: "Note non trouvée" });
    }

    const note = noteRows[0];
    let attachments = [];
    if (note.attachments) {
      attachments = normalizeAttachments(note.attachments);
    }

    res.json(attachments);
  } catch (error) {
    console.error("Erreur récupération attachments:", error);
    res.status(500).json({ message: "Erreur lors de la récupération des attachments" });
  }
});

// Supprimer un attachement d'une note
app.delete("/api/notes/:noteId/attachments/:attachmentId", authMiddleware, async (req, res) => {
  const { noteId, attachmentId } = req.params;
  const userId = req.user.id;

  try {
    const [noteRows] = await db.execute("SELECT * FROM notes WHERE id = ?", [noteId]);
    if (!noteRows.length) {
      return res.status(404).json({ message: "Note non trouvée" });
    }

    const note = noteRows[0];
    let attachments = [];
    if (note.attachments) {
      try {
        attachments = JSON.parse(note.attachments);
      } catch (err) {
        console.warn("Erreur parsing attachments:", err.message);
      }
    }

    const attachmentToRemove = attachments.find(a => a.id == attachmentId);
    if (!attachmentToRemove) {
      return res.status(404).json({ message: "Fichier non trouvé" });
    }

    // Supprimer de Minio
    try {
      await minioClient.removeObject(bucketName, attachmentToRemove.minioPath);
    } catch (err) {
      console.warn("Suppression fichier Minio échouée:", err.message);
    }

    // Mettre à jour la note
    attachments = attachments.filter(a => a.id != attachmentId);
    await db.execute(
      "UPDATE notes SET attachments = ?, updated_by = ? WHERE id = ?",
      [JSON.stringify(attachments), userId, noteId]
    );

    // Enregistrer dans audit_logs
    await logAudit("note", noteId, "UPDATE", userId, null, { attachments: attachments });

    res.json({ message: "Fichier supprimé" });
  } catch (error) {
    console.error("Erreur suppression attachement:", error);
    res.status(500).json({ message: "Erreur lors de la suppression du fichier" });
  }
});

// Télécharger/Afficher un fichier attaché
app.get("/api/notes/:noteId/attachments/:attachmentId/download", authMiddleware, async (req, res) => {
  const { noteId, attachmentId } = req.params;

  try {
    const [noteRows] = await db.execute("SELECT * FROM notes WHERE id = ?", [noteId]);
    if (!noteRows.length) {
      return res.status(404).json({ message: "Note non trouvée" });
    }

    const note = noteRows[0];
    let attachments = [];
    if (note.attachments) {
      attachments = normalizeAttachments(note.attachments);
    }

    const attachment = attachments.find(a => a.id == attachmentId);
    if (!attachment) {
      return res.status(404).json({ message: "Fichier non trouvé" });
    }

    // Récupérer le fichier de Minio
    const dataStream = await minioClient.getObject(bucketName, attachment.minioPath);
    
    res.setHeader('Content-Type', attachment.fileType);
    res.setHeader('Content-Disposition', `inline; filename="${attachment.fileName}"`);
    
    dataStream.pipe(res);
  } catch (error) {
    console.error("Erreur téléchargement fichier:", error);
    res.status(500).json({ message: "Erreur lors du téléchargement du fichier" });
  }
});

// ====== ENDPOINTS HISTORIQUE ======

// Historique d'un projet
app.get("/api/projects/:projectId/history", authMiddleware, async (req, res) => {
  const { projectId } = req.params;
  const [logs] = await db.execute(`
    SELECT 
      al.*,
      u.email as user_email,
      u.phone as user_phone
    FROM audit_logs al
    JOIN users u ON al.user_id = u.id
    WHERE al.entity_type = 'project' AND al.entity_id = ?
    ORDER BY al.action_date DESC
  `, [projectId]);
  res.json(logs);
});

// Historique d'une note
app.get("/api/notes/:noteId/history", authMiddleware, async (req, res) => {
  const { noteId } = req.params;
  const [logs] = await db.execute(`
    SELECT 
      al.*,
      u.email as user_email,
      u.phone as user_phone
    FROM audit_logs al
    JOIN users u ON al.user_id = u.id
    WHERE al.entity_type = 'note' AND al.entity_id = ?
    ORDER BY al.action_date DESC
  `, [noteId]);
  res.json(logs);
});

// Historique général avec filtres
app.get("/api/history", authMiddleware, async (req, res) => {
  const { entityType, entityId, limit = 50, offset = 0 } = req.query;
  
  let query = `
    SELECT 
      al.*,
      u.email as user_email,
      u.phone as user_phone
    FROM audit_logs al
    JOIN users u ON al.user_id = u.id
    WHERE 1=1
  `;
  let params = [];
  
  if (entityType) {
    query += " AND al.entity_type = ?";
    params.push(entityType);
  }
  if (entityId) {
    query += " AND al.entity_id = ?";
    params.push(entityId);
  }
  
  query += " ORDER BY al.action_date DESC LIMIT ? OFFSET ?";
  params.push(parseInt(limit), parseInt(offset));
  
  const [logs] = await db.execute(query, params);
  res.json(logs);
});

(async () => {
  await initDb();
  await initStorage();
  app.listen(PORT, "0.0.0.0", () => {
    console.log(`Serveur lancé sur port ${PORT}`);
  });
})();