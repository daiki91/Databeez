const express = require("express");

const app = express();
const PORT = 3000;

// route test
app.get("/", (req, res) => {
    res.send("Serveur Node.js fonctionne !");
});

// lancer serveur
app.listen(PORT, () => {
    console.log(`Serveur lancé sur http://localhost:${PORT}`);
});