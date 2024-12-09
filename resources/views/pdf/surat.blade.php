<!DOCTYPE html>
<html lang="id">

<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Surat Rujukan BPJS</title>
    <style>
        body {
            font-family: Arial, sans-serif;
            margin: 20px;
        }

        .container {
            max-width: 800px;
            margin: auto;
            padding: 20px;
            border: 1px solid #ddd;
            border-radius: 8px;
        }

        .header,
        .footer {
            text-align: center;
        }

        .header h1,
        .footer p {
            margin: 0;
        }

        .content {
            margin-top: 20px;
        }

        .content p {
            margin: 8px 0;
        }

        .signature {
            margin-top: 40px;
        }

        .signature div {
            margin-top: 20px;
        }
    </style>
</head>

<body>
    <div class="container">
        <div class="header">
            <h1>Rumah Sakit Wahidin Sudirohusodo</h1>
            <p>Jl. Perintis Kemerdekaan No.Km.11, Tamalanrea Jaya, Kec. Tamalanrea, Kota Makassar, Sulawesi Selatan
                90245, Makassar</p>
        </div>

        <div class="content">
            <p>Makassar, {{ now('Asia/Makassar')->format('d M Y') }}</p>

            <p>Kepada Yth.</p>
            <p>Dokter Spesialis di {{ $rekammedis->dirujuk_ke }}</p>
            <p>Jl. Contoh No. 456, Jakarta</p>

            <p>Nomor: {{ $rekammedis->nomor_surat }}</p>
            <p>Perihal: Rujukan Pasien</p>

            <p>Dengan hormat,</p>
            <p>Sehubungan dengan pemeriksaan yang telah dilakukan terhadap pasien di fasilitas kami, dengan ini kami
                merujuk pasien untuk mendapatkan penanganan lebih lanjut di fasilitas kesehatan tingkat lanjutan.</p>

            <p><strong>Data Pasien:</strong></p>
            <p>Nama: {{ $rekammedis->pasien->nama }}</p>
            <p>Nomor BPJS: {{ $rekammedis->pasien->no_bpjs }}</p>
            <p>Usia: {{ \Carbon\Carbon::parse($rekammedis->pasien->tgl_lahir)->age }} Tahun</p>
            <p>Jenis Kelamin: {{ $rekammedis->pasien->jk }}</p>
            <p>Alamat: {{ $rekammedis->pasien->alamat }}</p>

            <p><strong>Keluhan:</strong></p>
            <p>{{ $rekammedis->keluhan }}</p>

            <p><strong>Hasil Pemeriksaan:</strong></p>
            <p>{{ $rekammedis->keadaan_keluar }}</p>

            <p><strong>Diagnosis Sementara:</strong></p>
            <p>
                {{ $rekammedis->diagnosa }} , {{ $rekammedis->diagnosa_akhir }}
            </p>

            <p>Demikian surat rujukan ini kami buat untuk digunakan sebagaimana mestinya. Mohon agar pasien mendapatkan
                penanganan yang sesuai dengan kebutuhan medisnya.</p>

            <p>Atas perhatian dan kerjasamanya, kami ucapkan terima kasih.</p>
        </div>

        <div class="signature">
            <p>Hormat kami,</p>
            <div>
                <p>{{ $rekammedis->dokter->user?->nama ?? 'Dr. Andi' }}</p>
                <p>{{ $rekammedis->dokter->kode }}</p>
            </div>
        </div>

        <div class="footer">
            <p>&copy; 2024 Rumah Sakit Wahidin Sudirharsono</p>
        </div>
    </div>
    <script>
        window.print()
    </script>
</body>

</html>
