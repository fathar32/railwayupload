const express = require('express');
const multer = require('multer');
const csv = require('csv-parser');
const fs = require('fs');
const { Pool } = require('pg');

const app = express();
const upload = multer({ dest: 'uploads/' });

// 🔹 Connection string PostgreSQL Railway
// Format biasanya: postgres://user:password@host:port/database
const pool = new Pool({
  connectionString: "postgresql://postgres:DIXOzTOqpeQvPNhuXKtwEriggeGuJjIy@yamabiko.proxy.rlwy.net:29574/railway",
  ssl: { rejectUnauthorized: false } // Railway biasanya butuh SSL
});

app.post('/upload-csv', upload.single('file'), (req, res) => {
  const results = [];
  fs.createReadStream(req.file.path)
    .pipe(csv())
    .on('data', (row) => {
      results.push(row);
    })
    .on('end', async () => {
      try {
        for (const row of results) {
          await pool.query(
            `INSERT INTO berkas_verifikasi 
             (nomor_surat, nama_pegawai, nip, status_verifikasi, created_at, jabatan)
             VALUES ($1, $2, $3, $4, $5, $6)`,
            [
              row.nomor_surat,
              row.nama_pegawai,
              row.nip,
              row.status_verifikasi,
              row.created_at,
              row.jabatan,
              row.perihal
            ]
          );
        }
        res.send('✅ Upload sukses, data masuk ke database Railway!');
      } catch (err) {
        console.error(err);
        res.status(500).send('❌ Error saat insert data');
      }
    });
});

app.listen(3000, () => console.log('Server jalan di port 3000'));
