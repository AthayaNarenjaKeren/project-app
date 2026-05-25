const express = require("express");
const mysql = require("mysql2");
const cors = require("cors");

const app = express();

app.use(cors());
app.use(express.json());

const db = mysql.createConnection({
  host: "localhost",
  user: "root",
  password: "",
  database: "KasirDB",
});

db.connect((err) => {
  if (err) {
    console.log("Database gagal terhubung:", err);
  } else {
    console.log("Database berhasil terhubung");
  }
});

app.get("/", (req, res) => {
  res.send("Backend Gudang Kasir berjalan");
});

app.get("/barang", (req, res) => {
  const sql = "SELECT * FROM barang";

  db.query(sql, (err, result) => {
    if (err) {
      return res.status(500).json(err);
    }

    return res.json(result);
  });
});

// GET semua barang
app.get("/barang", (req, res) => {
  db.query("SELECT * FROM barang", (err, result) => {
    if (err) return res.status(500).json(err);
    res.json(result);
  });
});

// TAMBAH barang
app.post("/barang", (req, res) => {
  const { nama_barang, harga, stok } = req.body;

  const sql = "INSERT INTO barang (nama_barang, harga, stok) VALUES (?, ?, ?)";

  db.query(sql, [nama_barang, harga, stok], (err) => {
    if (err) return res.status(500).json(err);

    res.json({
      message: "Barang berhasil ditambahkan",
    });
  });
});

// EDIT barang
app.put("/barang/:id", (req, res) => {
  const { id } = req.params;
  const { nama_barang, harga, stok } = req.body;

  const sql =
    "UPDATE barang SET nama_barang = ?, harga = ?, stok = ? WHERE id = ?";

  db.query(sql, [nama_barang, harga, stok, id], (err) => {
    if (err) return res.status(500).json(err);

    res.json({
      message: "Barang berhasil diubah",
    });
  });
});

// HAPUS barang
app.delete("/barang/:id", (req, res) => {
  const { id } = req.params;

  const sql = "DELETE FROM barang WHERE id = ?";

  db.query(sql, [id], (err) => {
    if (err) return res.status(500).json(err);

    res.json({
      message: "Barang berhasil dihapus",
    });
  });
});

app.post("/transaksi", (req, res) => {
  const { nama_barang, jumlah } = req.body;

  const cekSql = "SELECT * FROM barang WHERE nama_barang = ?";

  db.query(cekSql, [nama_barang], (err, result) => {
    if (err) {
      return res.status(500).json(err);
    }

    if (result.length === 0) {
      return res.status(404).json({
        message: "Barang tidak ditemukan",
      });
    }

    const barang = result[0];
    const jumlahBeli = Number(jumlah);

    if (!jumlahBeli || jumlahBeli <= 0) {
      return res.status(400).json({
        message: "Jumlah tidak valid",
      });
    }

    if (barang.stok < jumlahBeli) {
      return res.status(400).json({
        message: "Stok tidak cukup",
      });
    }

    const totalHarga = barang.harga * jumlahBeli;

    const insertSql =
      "INSERT INTO transaksi (nama_barang, jumlah, total_harga) VALUES (?, ?, ?)";

    db.query(insertSql, [nama_barang, jumlahBeli, totalHarga], (err2) => {
      if (err2) {
        return res.status(500).json(err2);
      }

      const updateSql =
        "UPDATE barang SET stok = stok - ? WHERE nama_barang = ?";

      db.query(updateSql, [jumlahBeli, nama_barang], (err3) => {
        if (err3) {
          return res.status(500).json(err3);
        }

        return res.json({
          message: "Transaksi berhasil, stok berkurang",
          total_harga: totalHarga,
        });
      });
    });
  });
});

app.get("/transaksi", (req, res) => {
  const sql = "SELECT * FROM transaksi ORDER BY id DESC";

  db.query(sql, (err, result) => {
    if (err) {
      return res.status(500).json(err);
    }

    return res.json(result);
  });
});

app.listen(5001, () => {
  console.log("Server berjalan di http://localhost:5001");
});
