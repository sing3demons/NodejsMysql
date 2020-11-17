const express = require('express');
const router = express.Router();
const mysql = require("../config/connect")

/* GET home page. */
router.get('/', (req, res, next) => {
  res.render('index', { title: 'Express' });
});

router.get('/home', (req, res, next) => {
  res.redirect('/')
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
  const condition = [req.params.id];
  let sql = 'SELECT * FROM tb_product WHERE id = ?';

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
  const params = [req.body.barcode, req.body.name, req.params.id];
  const sql = 'UPDATE tb_product SET barcode = ?, name = ? WHERE id = ?';
  mysql.query(sql, params, (err, rs) => {
    if (err) {
      res.send(err);
    } else {
      res.redirect('/product');
    }
  })
})

router.get('/productDelete/:id', (req, res, next) => {
  const condition = [req.params.id];
  mysql.query('DELETE FROM tb_product WHERE id = ?', condition, (err, rs) => {
    if (err) {
      res.send(err);
    } else {
      res.redirect('/product');
    }
  });
})


router.get('/importStock', (req, res, next) => {
  res.render('importStock', { data: {} });
});

router.post('/importStock', (req, res, next) => {
  let sql = 'INSERT INTO tb_import_stock(product_id, qty, import_date) VALUES(?, ?, NOW())';
  let params = [req.body.product_id, req.body.qty];
  mysql.query(sql, params, (err, rs) => {
    if (err) {
      res.send(err);
    } else {
      res.redirect('importStockSuccess');
    }
  })
})


router.get('/importStockSuccess', (req, res) => {
  res.render('importStockSuccess');
})
router.post('/searchProduct', (req, res) => {
  let sql = 'SELECT * FROM tb_product WHERE barcode = ?';
  mysql.query(sql, req.body.barcode, (err, rs) => {
    if (err) {
      res.send(err);
    } else {
      res.json(rs);
    }
  })
})



router.get('/outStock', (req, res, next) => {
  res.render('outStock', { data: {} });
});

router.post('/outStock', (req, res, next) => {
  let sql = 'INSERT INTO tb_outstock(product_id, qty, outdate) VALUES(?, ?, NOW())';
  let params = [req.body.product_id, req.body.qty];
  mysql.query(sql, params, (err, rs) => {
    if (err) {
      res.send(err);
    } else {
      res.redirect('outStockSuccess');
    }
  })
})

router.get('/outStockSuccess', (req, res) => {
  res.render('outStockSuccess');
})

router.get('/report', (req, res) => {
  let data = { from: '', to: '', products: [] };
  res.render('reportStock', data);
})

router.post('/report', (req, res) => {
  let from = req.body.from + ' 00:00';
  from = from.replace('/', '-');

  let to = req.body.to + ' 23:59';
  to = to.replace('/', '-');

  let sql = `
      SELECT
          tb_product.barcode,
          tb_product.name,
          (
              SELECT SUM(qty) FROM tb_import_stock 
              WHERE (import_date BETWEEN ? AND ?) 
              AND product_id = tb_product.id
              ) AS total_import,
              (
                  SELECT SUM(qty) FROM tb_outstock 
                  WHERE (outdate BETWEEN ? AND ?) 
                  AND product_id = tb_product.id
              )AS total_out
          FROM tb_product`;
  let params = [from, to, from, to];

  mysql.query(sql, params, (err, rs) => {
    if (err) {
      res.send(err);
    } else {
      let data = { from: req.body.from, to: req.body.to, products: rs };
      res.render('reportStock', data);
    }
  })
})


module.exports = router;