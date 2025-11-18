const express = require('express');
const multer = require('multer');
const csv = require('csv-parser');
const fs = require('fs');
const { Pool } = require('pg');

const app = express();
const upload = multer({ dest: '/tmp' }); // gunakan /tmp di Vercel

const pool = new Pool({
  connectionString: postgresql://postgres:DIXOzTOqpeQvPNhuXKtwEriggeGuJjIy@yamabiko.proxy.rlwy.net:29574/railway,
  ssl: { rejectUnauthorized: false }
});

app.post('/upload-csv', upload.single('file'), (req, res) => {
  const results = [];
  fs.createReadStream(req.file.path)
    .pipe(csv())
    .on('data', (row) => results.push(row))
    .on('end', async () => {
      try {
        for (const row of results) {
          await pool.query(
            `INSERT INTO berkas_verifikasi 
             (nomor_surat, nama_pegawai, nip, status_verifikasi, created_at, jabatan, perihal)
             VALUES ($1, $2, $3, $4, $5, $6, NOW())`,
            [
              row.nomor_surat,
              row.nama_pegawai,
              row.nip,
              row.status_verifikasi,
              row.jabatan,
              row.perihal
            ]
          );
        }
        res.status(200).send('✅ Upload sukses!');
      } catch (err) {
        res.status(500).send('❌ Database error: ' + err.message);
      }
    });
});

module.exports = app;
