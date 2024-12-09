<!DOCTYPE html>
<html lang="en">

<head>
    <meta charset="UTF-8">

    <title>Document</title>
    <style>
        .header {
            text-align: center;
            margin-bottom: 20px;
        }
    </style>
</head>

<body>
    <div class="header">
        <img src="data:image/png;base64,{{ base64_encode(file_get_contents(public_path('logo.jpeg'))) }}" alt="Logo"
            width="100px"> <br> <br>
        <b>Rumah Sakit Wahidin Sudirohusodo</b>
        <p>Jl. Perintis Kemerdekaan No.Km.11 (0411) 583333</p>
    </div>

    <b>Informasi Pasien</b> <br><br>
    <table cellspacing="0" width="100%">
        <tr>
            <td>
                <table cellspacing="0">
                    <tr>
                        <td style="padding-bottom: 3px; padding-right:3px;">No.RM </td>
                        <td>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;</td>
                        <td>:{{ $rekammedis->pasien->no_rm }}</td>
                    </tr>
                    <tr>
                        <td style="padding-bottom: 3px; padding-right:3px;">Nama </td>
                        <td>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;</td>
                        <td>:{{ $rekammedis->pasien->nama }}</td>
                    </tr>
                    <tr>
                        <td style="padding-bottom: 3px; padding-right:3px;">Tanggal Lahir </td>
                        <td>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;</td>
                        <td>:{{ $rekammedis->pasien->tgl_lahir }}</td>
                    </tr>
                </table>
            </td>
            <td>
                <table cellspacing="0">
                    <tr>
                        <td>Tanggal Masuk </td>
                        <td>:{{ $rekammedis->tgl_masuk }}</td>
                    </tr>
                    <tr>
                        <td>Tanggal Keluar </td>
                        <td>:{{ $rekammedis->tgl_keluar }}</td>
                    </tr>
                    <tr>
                        <td>Diagnosa </td>
                        <td>:{{ $rekammedis->diagnosa->nama }}</td>
                    </tr>
                </table>
            </td>
        </tr>
    </table> <br>
    <b>Keluhan :</b>
    <p>
        {{ $rekammedis->keluhan }}
    </p>
    </table> <br><br>
    <b>Daftar Obat :</b> <br><br>
    <table cellspacing="0" border="1" width="100%" cellpadding="5">
        <thead>
            <tr>
                <th>Kode</th>
                <th>Nama Obat</th>
            </tr>
        </thead>
        <tbody>
            @foreach ($rekammedis->obats as $obat)
                <tr>
                    <td>{{ $obat->obat->kode }}</td>
                    <td>{{ $obat->obat->nama }}</td>
                </tr>
            @endforeach
        </tbody>


    </table>
    <br><br>
    <b>Dokter Penanggung Jawab Pelayanan : </b>{{ $rekammedis->dokter->kode }} - {{ $rekammedis->dokter->nama }}
</body>

</html>
