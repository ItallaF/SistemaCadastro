# SistemaCadastro
//ADIÇÃO DO MÓDULOS
const express = require('express');
const app = express();
const twig = require('twig');
const bodyParser = require('body-parser');
// CONEXAO COM BANCO DE DADOS
const connection = require('./config/database.js');

// DEFINE AS VIEWS ENGINES (template engines)
app.set('view engine', 'html');
app.engine('html', twig.__express);
app.set('views', 'views');

// DEFINE O MIDDLEWARE BODY-PARSER
app.use(bodyParser.urlencoded({ extended: false }));

app.get('/', (req, res) => {
  // RETORNA TODOS OS USUARIOS DO BANCO DE DADOS
  connection.query('SELECT * FROM `produto`', (err, results) => {
    if (err) throw err;
    // RENDERIZA O ARQUIVO INDEX.HTML CONTENDO TODOS OS USUARIOS
    res.render('index', {
      produtos: results
    });
  });

});

// INSERINDO UM PRODUTO NO BANCO DE DADOS
app.post('/', (req, res) => {
  const descricao = req.body.descricao;
  const quantidade = req.body.quantidade;
  const precoUnit = req.body.precoUnit;
  const fornecedor = req.body.fornecedor;
  const data = req.body.data;
  const desconto = req.body.desconto;
  const icms = req.body.icms;
  const produt = {
    descricao: descricao,
    quantidade: quantidade,
    precoUnit: precoUnit,
    fornecedor: fornecedor,
    data: data,
    desconto: desconto,
    icms: icms
  }
  connection.query('INSERT INTO `produto` SET ?', produt, (err) => {
    if (err) throw err;
    console.log('Produto inserido');
    return res.redirect('/');
  });
});

// PÁGINA DE EDIÇÃO
app.get('/edit/:cod', (req, res) => {
  const edit_produtCod = req.params.cod;
  // PROCURA USUARIO PELO ID
  connection.query('SELECT * FROM `produto` WHERE cod=?', [edit_produtCod], (err, results) => {
    if (err) throw err;
    res.render('edit', {
      produt: results[0]
    });
  });
});

// ALTERANDO O USUARIO
app.post('/edit/:cod', (req, res) => {
  const descricao = req.body.descricao;
  const quantidade = req.body.quantidade;
  const precoUnit = req.body.precoUnit;
  const fornecedor = req.body.fornecedor;
  const data = req.body.data;
  const desconto = req.body.desconto;
  const icms = req.body.icms;
  const produtCod = req.params.cod;
  connection.query('UPDATE `produto` SET descricao = ?, quantidade = ?, precoUnit = ?, fornecedor = ?, data = ?, desconto = ?, icms = ? WHERE cod = ?', [descricao, quantidade, precoUnit, fornecedor, data, desconto, icms, produtCod], (err, results) => {
    if (err) throw err;
    if (results.changedRows === 1) {
      console.log('Produto alterado');
      return res.redirect('/');
    }
  });
});

// REMOVENDO O USUARIO
app.get('/delete/:cod', (req, res) => {
  connection.query('DELETE FROM `produto` WHERE cod = ?', [req.params.cod], (err, results) => {
    if (err) throw err;
    res.redirect('/');
  });
});
// DEFINE  PAGE DE ERRO 404
app.use('/', (req, res) => {
  res.status(404).send('<h1>404 Page Not Found!</h1>');
});
// SE CONEXAO DO BANCO DE DADOS RETORNA SUCESSO
connection.connect((err) => {
  if (err) throw err;
  app.listen(3000);
});
