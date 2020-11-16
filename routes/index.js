var express = require('express');
var router = express.Router();
const Config = require('../config/index')

const mysql2 = require('mysql2');
const mysql = mysql2.createConnection({
  host: Config.DB_HOST,
  user: Config.DB_USER,
  password: Config.DB_PASS,
  database: Config.DATABASE
});


/* GET home page. */
router.get('/', (req, res, next) => {
  res.render('index', { title: 'Express' });
});

router.get('/home', (req, res, next) => {
  res.render('index', { title: 'Express' });
});

router.get('/product', (req, res, next) => {
  mysql.query('SELECT * FROM tb_product', (err, rs) => {
    if (err) {
      res.render(err);
    } else {
      console.log(rs);
      res.render('product', { data: {}, products: rs });
    }
  })

});

router.post('/product', (req, res, next) => {
  mysql.query("INSERT INTO tb_product SET ?", req.body, (err, rs) => {
    if (err) {
      res.send(err);
    } else {
      res.redirect('product');
    }
  })
})

router.get('/productEdit/:id', (req, res) => {
  var condition = [req.params.id];
  var sql = 'SELECT * FROM tb_product WHERE id = ?';

  mysql.query(sql, condition, (err, rs) => {
    if (err) {
      res.send(err);
    } else {
      sql = 'SELECT * FROM tb_product';

      mysql.query(sql, (err, products) => {
        if (err) {
          res.send(err);
        } else {
          res.render('product', { data: rs[0], products: products });
        }
      })
    }
  })
})

router.post('/productEdit/:id', (req, res) => {
  var params = [req.body.barcode, req.body.name, req.params.id];
  var sql = 'UPDATE tb_product SET barcode = ?, name = ? WHERE id = ?';

  mysql.query(sql, params, (err, rs) => {
    if (err) {
      res.send(err);
    } else {
      res.redirect('/product');
    }
  })
})


router.get('/productDelete/:id', (req, res, next) => {
  var condition = [req.params.id];
  mysql.query('DELETE FROM tb_product WHERE id = ?', condition, (err, rs) => {
    if (err) {
      res.send(err);
    } else {
      res.redirect('/product');
    }
  });
})



router.get('/importStock', (req, res, next) => {
  res.render('product', { data: {} });
});

router.get('/outStock', (req, res, next) => {
  res.render('product', { data: {} });
});

router.get('/report', (req, res, next) => {
  res.render('product', { data: {} });
});

module.exports = router;
