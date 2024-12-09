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
    <style>
        #customers {
            font-family: Arial, Helvetica, sans-serif;
            border-collapse: collapse;
            width: 100%;
        }

        #customers td,
        #customers th {
            border: 1px solid #ddd;
            padding: 8px;
        }

        #customers tr:nth-child(even) {
            background-color: #f2f2f2;
        }

        #customers tr:hover {
            background-color: #ddd;
        }

        #customers th {
            padding-top: 12px;
            padding-bottom: 12px;
            text-align: left;
            background-color: #04AA6D;
            color: white;
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

    <table border="1" id="customers">
        <thead>
            <tr>
                <th>No.RM</th>
                <th>Nama</th>
                <th>Dokter DPJP</th>
                <th>Tgl Masuk</th>
                <th>Tgl Keluar</th>
                <th>Obat</th>
                <th>Diagnosa</th>
            </tr>
        </thead>
        <tbody>
            @foreach ($rekamMedis as $data)
                <tr>
                    <td>{{ $data->pasien->no_rm }}</td>
                    <td>{{ $data->pasien->nama }}</td>
                    <td>{{ $data->dokter->nama }}</td>
                    <td>{{ $data->tgl_masuk }}</td>
                    <td>{{ $data->tgl_keluar }}</td>
                    <td>
                        @foreach ($data->obats as $obat)
                            {{ $obat->obat->nama }} <br>
                        @endforeach
                    </td>
                    <td>{{ $data->diagnosa->nama }}</td>
                </tr>
            @endforeach
        </tbody>
    </table>
</body>

</html>
