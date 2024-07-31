import "dotenv/config";
import express from "express";
import { v4 as uuidv4 } from "uuid";
import { handleConectionDb } from "./src/config/myDb.js";
import livro from "./src/models/Livros.js";

const app = express();
const PORT = process.env.PORT;

app.use(express.json());

const dbConnect = handleConectionDb();

dbConnect.on("connected", () => {
  console.log("A conexão com o banco de dados foi estabelecida.");
});

dbConnect.on("error", (error) => {
  console.log("Ocorreu um erro na conexão:", error);
});

dbConnect.on("disconnected", () => {
  console.log("A conexão com o banco de dados foi finalizada.");
});

const data = { livros: [] };

const findIndexLivros = (id) => {
  return data.livros.findIndex((livro) => {
    return livro.id === id;
  });
};

app.get("/", (req, res) => {
  res.status(200).send("Eae Brother da `/`");
});

app.get("/livros/:id", (req, res) => {
  const index = findIndexLivros(req.params.id);
  res.status(200).send(data.livros[index]);
});

app.get("/livros", (req, res) => {
  if (!data.livros.length) {
    res.status(404).json({
      error: {
        status: res.status,
        message: "Nenhum item encontrado",
      },
    });
  } else {
    res.status(200).json({
      success: {
        livros: data.livros,
      },
    });
  }
});

app.post("/livros", (req, res) => {
  data.livros.push({ id: uuidv4(), ...req.body });
  res.status(200).json(data.livros);
});

app.put("/livros/:id", (req, res) => {
  const index = findIndexLivros(req.params.id);
  data.livros[index].titulo = req.body.titulo;
  res.status(200).json(data.livros[index]);
});

app.delete("/livros/:id", (req, res) => {
  const index = findIndexLivros(req.params.id);
  data.livros.splice(index, 1);
  res.status(200).json(data.livros);
});

app.listen(PORT, (req, res) => {
  console.log(`
Servidor está rodando na porta ${PORT}.
Para acessa-lo clique em: http://localhost:3000`);
});
