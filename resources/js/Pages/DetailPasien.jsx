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

    useEffect(() => {
        setDataRekamMedis(rekamMedis);
    }, []);
    return (
        <Layout>
            <div className="grid">
                <div className="col-12">
                    <div className="flex mb-2 justify-content-between">
                        <Button
                            label="Kembali"
                            link
                            onClick={() => router.visit(route("pasien.index"))}
                        />
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
                            <DataTable
                                header={() => (
                                    <div className="flex flex-wrap gap-2 justify-content-between align-items-center">
                                        <h5>
                                            {pasien.nama} - {pasien.no_rm}
                                        </h5>
                                        <span className="p-input-icon-left">
                                            <i className="pi pi-search" />
                                            <InputText
                                                type="search"
                                                onInput={(e) =>
                                                    onInputSearch(e)
                                                }
                                                placeholder="Global Search"
                                            />
                                        </span>
                                    </div>
                                )}
                                value={dataRekamMedis}
                                paginator
                                dataKey="id"
                                rows={10}
                                rowsPerPageOptions={[5, 10, 25]}
                                paginatorTemplate="FirstPageLink PrevPageLink PageLinks NextPageLink LastPageLink CurrentPageReport RowsPerPageDropdown"
                                currentPageReportTemplate="Showing {first} to {last} of {totalRecords} entries"
                                globalFilter={globalFilter}
                                emptyMessage="Tidak ada Rekam Medis"
                            >
                                <Column
                                    headerClassName="fw-bold"
                                    body={(rowData) => {
                                        return moment(
                                            rowData.created_at
                                        ).format("DD/MM/YYYY ~ hh:mm:ss");
                                    }}
                                    header="Tanggal"
                                    filter
                                    sortable
                                    filterPlaceholder="Tanggal"
                                    style={{ minWidth: "15rem" }}
                                    headerStyle={{ width: "15rem" }}
                                />

                                <Column
                                    headerClassName="fw-bold"
                                    field="dokter.nama"
                                    header="Dokter"
                                    filter
                                    sortable
                                    filterPlaceholder="Nama Dokter"
                                    style={{ minWidth: "15rem" }}
                                    headerStyle={{ width: "15rem" }}
                                />
                                <Column
                                    headerClassName="fw-bold"
                                    field="diagnosa.nama"
                                    header="Diagnosa"
                                    filter
                                    filterPlaceholder="diagnosa"
                                    style={{ minWidth: "10rem" }}
                                    headerStyle={{ width: "10rem" }}
                                />

                                <Column
                                    headerClassName="fw-bold"
                                    field="keluhan"
                                    header="Keluhan"
                                    filterPlaceholder="keluhan"
                                    filter
                                    style={{ minWidth: "20rem" }}
                                    headerStyle={{ width: "20rem" }}
                                />
                                <Column
                                    headerClassName="fw-bold"
                                    field="obats"
                                    header="Obat"
                                    filter
                                    filterPlaceholder="obat"
                                    body={(rowData) => {
                                        return rowData.obats?.map((data) => {
                                            return <div>{data.obat?.nama}</div>;
                                        });
                                    }}
                                    style={{ minWidth: "10rem" }}
                                    headerStyle={{ width: "10rem" }}
                                />
                            </DataTable>
                        </TabPanel>
                    </TabView>
                </div>
            </div>
        </Layout>
    );
};

export default DetailPasien;
