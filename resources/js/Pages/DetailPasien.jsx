import React, { useContext, useEffect, useRef, useState } from "react";
import { LayoutContext } from "@/Layouts/layout/context/layoutcontext";
import Layout from "@/Layouts/layout/layout.jsx";
import DashboardInfoCard from "@/Components/DashboardInfoCard.jsx";
import { Card } from "primereact/card";
import { Panel } from "primereact/panel";
import { TabPanel, TabView } from "primereact/tabview";
import { Button } from "primereact/button";
import { DataTable } from "primereact/datatable";
import { FilterMatchMode } from "primereact/api";
import { Column } from "primereact/column";
import moment from "moment";
import { Link, router } from "@inertiajs/react";
import { InputText } from "primereact/inputtext";

const DetailPasien = ({ auth, pasien, rekamMedis }) => {
    const [activeIndex, setActiveIndex] = useState(0);
    const [dataRekamMedis, setDataRekamMedis] = useState([]);
    const [globalFilter, setGlobalFilter] = useState("");
    const [filters, setFilters] = useState({
        global: { value: null, matchMode: FilterMatchMode.CONTAINS },
    });
    const ref = useRef(null);
    useEffect(() => {
        setDataRekamMedis(rekamMedis);
    }, []);
    return (
        <Layout>
            <div className="grid">
                <div className="col-12">
                    <div className="flex mb-2 justify-content-between">
                        {auth.user.role != "pasien" && (
                            <Button
                                label="Kembali"
                                link
                                onClick={() =>
                                    router.visit(route("pasien.index"))
                                }
                            />
                        )}

                        <div className="flex gap-2">
                            <Button
                                onClick={() => setActiveIndex(0)}
                                className="w-2rem h-2rem p-0"
                                rounded
                                outlined={activeIndex !== 0}
                                label="1"
                            />
                            <Button
                                onClick={() => setActiveIndex(1)}
                                className="w-2rem h-2rem p-0"
                                rounded
                                outlined={activeIndex !== 1}
                                label="2"
                            />
                        </div>
                    </div>
                    <TabView
                        activeIndex={activeIndex}
                        onTabChange={(e) => setActiveIndex(e.index)}
                    >
                        <TabPanel header="Informasi Pasien">
                            <p className="m-3">
                                <b>No.RM : </b> {pasien.no_rm}
                            </p>
                            <p className="m-3">
                                <b>Nama : </b> {pasien.nama}
                            </p>
                            <p className="m-3">
                                <b>Jenis Kelamin : </b> {pasien.jk}
                            </p>
                            <p className="m-3">
                                <b>Tanggal Lahir : </b> {pasien.tgl_lahir}
                            </p>
                            <p className="m-3">
                                <b>Jenis Pengobatan : </b>{" "}
                                {pasien.jenis_pengobatan}
                            </p>
                            <p className="m-3">
                                <b>Alamat : </b> {pasien.alamat}
                            </p>
                            <p className="m-3">
                                <b>No HP : </b> {pasien.no_hp}
                            </p>
                            <p className="m-3">
                                <b>Golongan Darah : </b> {pasien.gol_darah}
                            </p>
                            <p className="m-3">
                                <b>Status Perkawinan : </b>{" "}
                                {pasien.status_perkawinan}
                            </p>
                            <p className="m-3">
                                <b>Pendidikan : </b> {pasien.pendidikan}
                            </p>
                            <p className="m-3">
                                <b>Pekerjaan : </b> {pasien.pekerjaan}
                            </p>
                        </TabPanel>
                        <TabPanel header="Rekam Medis">
                            {rekamMedis.map((data) => {
                                return (
                                    <Panel
                                        className="mb-3"
                                        ref={ref}
                                        header={`Masuk : ${moment(
                                            data.created_at
                                        ).format(
                                            "DD/MM/YYYY"
                                        )} , Keluar : ${moment(
                                            data.tgl_keluar
                                        ).format("DD/MM/YYYY")}`}
                                        toggleable
                                    >
                                        <div className="grid">
                                            <div className="col-6">
                                                <p className="m-0">
                                                    Dokter DPJP :{" "}
                                                    {data.dokter.nama} <br />
                                                    Keluhan : {data.keluhan}
                                                    Diagnosa Awal{" "}
                                                    {data.diagnosa} <br />
                                                    Diagnosa Akhir{" "}
                                                    {data.diagnosa_akhir} <br />
                                                    Keadaan Keluar:{" "}
                                                    {data.keadaan_keluar}
                                                    <br />
                                                    Cara Keluar:{" "}
                                                    {data.cara_keluar}
                                                    {data.cara_keluar ===
                                                        "Dirujuk" && (
                                                        <div>
                                                            Nomor Surat :{" "}
                                                            {data.nomor_surat}{" "}
                                                            <br />
                                                            Dirujuk Ke :{" "}
                                                            {data.dirujuk_ke}
                                                        </div>
                                                    )}
                                                </p>
                                            </div>
                                            <div className="col-6">
                                                Daftar Obat : <br />
                                                {data.obats?.map((data) => {
                                                    return (
                                                        <>
                                                            {data.obat.kode} -{" "}
                                                            {data.obat.nama}
                                                            <br />
                                                        </>
                                                    );
                                                })}
                                            </div>
                                        </div>
                                    </Panel>
                                );
                            })}
                        </TabPanel>
                    </TabView>
                </div>
            </div>
        </Layout>
    );
};

export default DetailPasien;
