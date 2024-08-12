import Layout from "@/Layouts/layout/layout";
import { Link } from "@inertiajs/react";
import axios from "axios";
import { Button } from "primereact/button";
import { Column } from "primereact/column";
import { ConfirmPopup, confirmPopup } from "primereact/confirmpopup";
import { DataTable } from "primereact/datatable";
import { Dialog } from "primereact/dialog";
import { InputText } from "primereact/inputtext";
import { RadioButton } from "primereact/radiobutton";
import { Toast } from "primereact/toast";
import { Toolbar } from "primereact/toolbar";
import React from "react";
import { useRef } from "react";
import { useEffect } from "react";
import { useState } from "react";

export default function Pasien({ pasiens }) {
    const [dataPasien, setDataPasien] = useState([]);
    const [globalFilter, setGlobalFilter] = useState("");
    useEffect(() => {
        setDataPasien(pasiens);
    }, []);
    const onInputSearch = (e) => {
        var val = e.target.value;
        setGlobalFilter(val ? val : []);
    };

    let emptyPasien = {
        id: "",
        no_rm: "",
        nama: "",
        alamat: "",
        gol_darah: "",
        tgl_lahir: "",
        nik: "",
        no_bpjs: "",
        no_hp: "",
        jenis_pengobatan: "",
        status_perkawinan: "",
        pendidikan: "",
        pekerjaan: "",
    };

    const [pasien, setPasien] = useState(emptyPasien);
    const onInputChange = (e, name) => {
        const val = (e.target && e.target.value) || "";
        let _pasien = { ...pasien };
        _pasien[`${name}`] = val;
        setPasien(_pasien);
    };

    const [errors, setErrors] = useState([]);
    const actionBodyTemplate = (rowData) => {
        return (
            <React.Fragment>
                <Button
                    icon="pi pi-pencil"
                    rounded
                    outlined
                    className="mr-2"
                    onClick={() => openEdit(rowData)}
                />

                <Button
                    icon="pi pi-trash"
                    rounded
                    outlined
                    severity="danger"
                    onClick={(event) => confirm2(event, rowData)}
                />
            </React.Fragment>
        );
    };
    const toast = useRef(null);
    // DELETE
    const reject = () => {
        toast.current.show({
            severity: "warn",
            summary: "Rejected",
            detail: "You have rejected",
            life: 3000,
        });
    };
    const confirm2 = (event, rowData) => {
        confirmPopup({
            target: event.currentTarget,
            message: "Do you want to delete this record?",
            icon: "pi pi-info-circle",
            defaultFocus: "reject",
            acceptClassName: "p-button-danger",
            accept: async () => {
                try {
                    await axios.delete(route("pasien.destroy", rowData.id));
                    toast.current.show({
                        severity: "info",
                        summary: "Confirmed",
                        detail: "You have deleted " + rowData.nama,
                        life: 3000,
                    });

                    setDataPasien((prevItems) =>
                        prevItems.filter((item) => item.id !== rowData.id)
                    );
                } catch (e) {
                    toast.current.show({
                        severity: "error",
                        summary: "Error",
                        detail: "You have error deleted " + e.message,
                        life: 3000,
                    });
                }
            },
            reject,
        });
    };
    // TAMBAH
    const [dialogTambah, setDialogTambah] = useState(false);
    const openNew = () => {
        setDialogTambah(true);
    };
    const submit = async (e) => {
        try {
            const res = await axios.post(route("pasien.store"), pasien);
            const updatedData = [res.data, ...dataPasien];
            setDataPasien(updatedData);
            setDialogTambah(false);
            toast.current.show({
                severity: "success",
                summary: "Success",
                detail: "You have success create pasien " + res.data.nama,
                life: 3000,
            });
            setPasien(emptyPasien);
        } catch (error) {
            console.log(error.response);
            setErrors(error.response?.data?.errors ?? []);
            alert(error.response?.data?.message ?? "Something wrong");
        }
    };
    const footerDialogTambah = (e) => {
        return (
            <React.Fragment>
                <Button
                    label="Cancel"
                    icon="pi pi-times"
                    outlined
                    onClick={() => onHideDialog()}
                />
                <Button label="Save" icon="pi pi-check" onClick={submit} />
            </React.Fragment>
        );
    };
    const onHideDialog = () => {
        setPasien(emptyPasien);
        setErrors([]);
        setDialogTambah(false);
    };
    // END TAMBAH

    // EDIT

    const openEdit = (data) => {
        setDialogEdit(true);
        setPasien(data);
    };

    const onHideDialog2 = () => {
        setPasien(emptyPasien);
        setErrors([]);
        setDialogEdit(false);
    };
    const [dialogEdit, setDialogEdit] = useState(false);
    const submit2 = async (e) => {
        try {
            const res = await axios.patch(
                route("pasien.update", pasien.id),
                pasien
            );
            setDataPasien((prevItems) =>
                prevItems.map((item) =>
                    item.id === res.data.id
                        ? {
                              ...item,
                              no_rm: res.data.no_rm,
                              nama: res.data.nama,
                              nik: res.data.nik,
                              no_bpjs: res.data.no_bpjs,
                              gol_darah: res.data.gol_darah,
                              no_hp: res.data.no_hp,
                              status_perkawinan: res.data.status_perkawinan,
                              pendidikan: res.data.pendidikan,
                              pekerjaan: res.data.pekerjaan,
                          }
                        : item
                )
            );
            toast.current.show({
                severity: "success",
                summary: "Success",
                detail: "You have success updated pasien " + res.data.nama,
                life: 3000,
            });
            setPasien(emptyPasien);
            setDialogEdit(false);
        } catch (error) {
            console.log(error.response);
            setErrors(error.response?.data?.errors ?? []);
            alert(error.response?.data?.message ?? "Something wrong");
        }
    };
    const footerDialogEdit = (e) => {
        return (
            <React.Fragment>
                <Button
                    label="Cancel"
                    icon="pi pi-times"
                    outlined
                    onClick={() => onHideDialog2()}
                />
                <Button label="Save" icon="pi pi-check" onClick={submit2} />
            </React.Fragment>
        );
    };
    // END EDIT
    const leftToolbarTemplate = () => {
        return (
            <div className="flex flex-wrap gap-2">
                <Button
                    label="New"
                    icon="pi pi-plus"
                    severity="primary"
                    onClick={openNew}
                />
            </div>
        );
    };
    const renderHeader = () => {
        return (
            <div className="flex flex-wrap gap-2 justify-content-between align-items-center">
                <h5>Pasien</h5>
                <span className="p-input-icon-left">
                    <i className="pi pi-search" />
                    <InputText
                        type="search"
                        onInput={(e) => onInputSearch(e)}
                        placeholder="Global Search"
                    />
                </span>
            </div>
        );
    };
    const header = renderHeader();
    return (
        <Layout>
            <Toast ref={toast} />
            <ConfirmPopup />
            <div className="grid">
                <div className="col-12">
                    <div className="card">
                        <Toolbar
                            className="mb-4"
                            left={leftToolbarTemplate}
                        ></Toolbar>
                        <DataTable
                            value={dataPasien}
                            paginator
                            dataKey="id"
                            rows={10}
                            rowsPerPageOptions={[5, 10, 25]}
                            paginatorTemplate="FirstPageLink PrevPageLink PageLinks NextPageLink LastPageLink CurrentPageReport RowsPerPageDropdown"
                            currentPageReportTemplate="Showing {first} to {last} of {totalRecords} entries"
                            globalFilter={globalFilter}
                            emptyMessage="Tidak ada pasien"
                            globalFilterFields={[
                                "nama",
                                "alamat",
                                "gol_darah",
                                "nik",
                                "no_bpjs",
                            ]}
                            header={header}
                        >
                            <Column
                                body={actionBodyTemplate}
                                exportable={false}
                                style={{ minWidth: "12rem" }}
                            ></Column>
                            <Column
                                headerClassName="fw-bold"
                                field="no_rm"
                                header="No.RM"
                                sortable
                                body={(rowData) => {
                                    return (
                                        <Link
                                            className="text-primary"
                                            href={route(
                                                "pasien.show",
                                                rowData.id
                                            )}
                                        >
                                            {rowData.no_rm}
                                        </Link>
                                    );
                                }}
                                filterPlaceholder="No.RM"
                                style={{ minWidth: "12rem" }}
                                headerStyle={{ width: "12rem" }}
                            />
                            <Column
                                headerClassName="fw-bold"
                                field="nama"
                                header="Nama Pasien"
                                sortable
                                filterPlaceholder="nama"
                                style={{ minWidth: "15rem" }}
                                headerStyle={{ width: "15rem" }}
                            />
                            <Column
                                headerClassName="fw-bold"
                                field="jenis_pengobatan"
                                header="Jenis Pengobatan"
                                sortable
                                filterPlaceholder="Jenis Pengobatan"
                                style={{ minWidth: "15rem" }}
                                headerStyle={{ width: "15rem" }}
                            />

                            <Column
                                headerClassName="fw-bold"
                                field="no_bpjs"
                                header="No.BPJS"
                                sortable
                                filterPlaceholder="Nomor BPJS"
                                style={{ minWidth: "15rem" }}
                                headerStyle={{ width: "15rem" }}
                            />

                            <Column
                                headerClassName="fw-bold"
                                field="jk"
                                header="JK"
                                sortable
                                filter
                                filterPlaceholder="Jenis Kelamin"
                                style={{ minWidth: "5rem" }}
                                headerStyle={{ width: "5rem" }}
                            />
                            <Column
                                headerClassName="fw-bold"
                                field="tgl_lahir"
                                header="Tanggal Lahir"
                                sortable
                                filterPlaceholder="Tanggal Lahir"
                                style={{ minWidth: "15rem" }}
                                headerStyle={{ width: "15rem" }}
                            />
                        </DataTable>
                    </div>
                </div>
            </div>
            <Dialog
                visible={dialogEdit}
                style={{ width: "60rem" }}
                breakpoints={{ "960px": "75vw", "641px": "90vw" }}
                header="Edit Pasien"
                modal
                className="p-fluid"
                footer={footerDialogEdit}
                onHide={() => onHideDialog2()}
            >
                <div className="field">
                    <label htmlFor="no_rm" className="font-bold">
                        No. RM
                    </label>
                    <InputText
                        id="no_rm"
                        required
                        autoFocus
                        value={pasien.no_rm}
                        onChange={(e) => onInputChange(e, "no_rm")}
                        placeholder="Masukkan Nama Pasien"
                    />
                    {errors.no_rm && (
                        <small className="p-error">{errors.no_rm}</small>
                    )}
                </div>
                <div className="field">
                    <label htmlFor="nama" className="font-bold">
                        Nama Pasien
                    </label>
                    <InputText
                        id="nama"
                        required
                        autoFocus
                        value={pasien.nama}
                        onChange={(e) => onInputChange(e, "nama")}
                        placeholder="Masukkan Nama Pasien"
                    />
                    {errors.nama && (
                        <small className="p-error">{errors.nama}</small>
                    )}
                </div>
                <div className="field">
                    <label htmlFor="nama" className="font-bold">
                        Jenis Pengobatan
                    </label>
                    <div className="flex flex-wrap gap-3">
                        <div className="flex align-items-center">
                            <RadioButton
                                inputId="ingredient2"
                                name="jenis_pengobatan"
                                value="Umum"
                                onChange={(e) =>
                                    onInputChange(e, "jenis_pengobatan")
                                }
                                checked={pasien.jenis_pengobatan === "Umum"}
                            />
                            <label htmlFor="ingredient2" className="ml-2">
                                Umum
                            </label>
                        </div>
                        <div className="flex align-items-center">
                            <RadioButton
                                inputId="ingredient3"
                                name="jenis_pengobatan"
                                value="BPJS"
                                onChange={(e) =>
                                    onInputChange(e, "jenis_pengobatan")
                                }
                                checked={pasien.jenis_pengobatan === "BPJS"}
                            />
                            <label htmlFor="ingredient3" className="ml-2">
                                BPJS
                            </label>
                        </div>
                    </div>
                </div>
                <div className="field">
                    <label htmlFor="nik" className="font-bold">
                        NIK
                    </label>
                    <InputText
                        id="nik"
                        required
                        autoFocus
                        value={pasien.nik}
                        onChange={(e) => onInputChange(e, "nik")}
                        placeholder="Masukkan NIK Pasien"
                    />
                    {errors.nik && (
                        <small className="p-error">{errors.nik}</small>
                    )}
                </div>
                <div className="field">
                    <label htmlFor="no_bpjs" className="font-bold">
                        Nomor BPJS
                    </label>
                    <InputText
                        id="no_bpjs"
                        required
                        autoFocus
                        value={pasien.no_bpjs}
                        onChange={(e) => onInputChange(e, "no_bpjs")}
                        placeholder="Masukkan Nomor BPJS Pasien"
                    />
                    {errors.no_bpjs && (
                        <small className="p-error">{errors.no_bpjs}</small>
                    )}
                </div>
                <div className="field">
                    <label htmlFor="gol_darh" className="font-bold">
                        Golongan Darah
                    </label>
                    <div className="flex flex-wrap gap-3">
                        <div className="flex align-items-center">
                            <RadioButton
                                inputId="A"
                                name="gol_darah"
                                value="A"
                                onChange={(e) => onInputChange(e, "gol_darah")}
                                checked={pasien.gol_darah === "A"}
                            />
                            <label htmlFor="A" className="ml-2">
                                A
                            </label>
                        </div>
                        <div className="flex align-items-center">
                            <RadioButton
                                inputId="B"
                                name="gol_darah"
                                value="B"
                                onChange={(e) => onInputChange(e, "gol_darah")}
                                checked={pasien.gol_darah === "B"}
                            />
                            <label htmlFor="B" className="ml-2">
                                B
                            </label>
                        </div>
                        <div className="flex align-items-center">
                            <RadioButton
                                inputId="AB"
                                name="gol_darah"
                                value="AB"
                                onChange={(e) => onInputChange(e, "gol_darah")}
                                checked={pasien.gol_darah === "AB"}
                            />
                            <label htmlFor="AB" className="ml-2">
                                AB
                            </label>
                        </div>
                        <div className="flex align-items-center">
                            <RadioButton
                                inputId="O"
                                name="gol_darah"
                                value="O"
                                onChange={(e) => onInputChange(e, "gol_darah")}
                                checked={pasien.gol_darah === "O"}
                            />
                            <label htmlFor="O" className="ml-2">
                                O
                            </label>
                        </div>
                    </div>
                    {errors.gol_darah && (
                        <small className="p-error">{errors.gol_darah}</small>
                    )}
                </div>
                <div className="field">
                    <label htmlFor="tgl_lahir" className="font-bold">
                        Tanggal Lahir
                    </label>
                    <InputText
                        type="date"
                        id="tgl_lahir"
                        required
                        autoFocus
                        value={pasien.tgl_lahir}
                        onChange={(e) => onInputChange(e, "tgl_lahir")}
                        placeholder="Masukkan Tanggal Lahir Pasien"
                    />
                    {errors.tgl_lahir && (
                        <small className="p-error">{errors.tgl_lahir}</small>
                    )}
                </div>
                <div className="field">
                    <label htmlFor="alamat" className="font-bold">
                        Alamat
                    </label>
                    <InputText
                        id="alamat"
                        required
                        autoFocus
                        value={pasien.alamat}
                        onChange={(e) => onInputChange(e, "alamat")}
                        placeholder="Masukkan Tanggal Lahir Pasien"
                    />
                    {errors.alamat && (
                        <small className="p-error">{errors.alamat}</small>
                    )}
                </div>
                <div className="field">
                    <label htmlFor="no_hp" className="font-bold">
                        Nomor HP
                    </label>
                    <InputText
                        id="no_hp"
                        required
                        autoFocus
                        value={pasien.no_hp}
                        onChange={(e) => onInputChange(e, "no_hp")}
                        placeholder="Masukkan Nomor HP Pasien"
                    />
                    {errors.no_hp && (
                        <small className="p-error">{errors.no_hp}</small>
                    )}
                </div>
                <div className="field">
                    <label htmlFor="status_perkawinan" className="font-bold">
                        Status Perkawinan
                    </label>
                    <div className="flex flex-wrap gap-3">
                        <div className="flex align-items-center">
                            <RadioButton
                                inputId="belum_kawin"
                                name="status_perkawinan"
                                value="Belum Kawin"
                                onChange={(e) =>
                                    onInputChange(e, "status_perkawinan")
                                }
                                checked={
                                    pasien.status_perkawinan === "Belum Kawin"
                                }
                            />
                            <label htmlFor="belum_kawin" className="ml-2">
                                Belum Kawin
                            </label>
                        </div>
                        <div className="flex align-items-center">
                            <RadioButton
                                inputId="Kawin"
                                name="status_perkawinan"
                                value="Kawin"
                                onChange={(e) =>
                                    onInputChange(e, "status_perkawinan")
                                }
                                checked={pasien.status_perkawinan === "Kawin"}
                            />
                            <label htmlFor="Kawin" className="ml-2">
                                Kawin
                            </label>
                        </div>
                    </div>
                </div>
                <div className="field">
                    <label htmlFor="status_perkawinan" className="font-bold">
                        Pendidikan
                    </label>
                    <div className="flex flex-wrap gap-3">
                        <div className="flex align-items-center">
                            <RadioButton
                                inputId="tidak_sekolah"
                                name="pendidikan"
                                value="Tidak Sekolah"
                                onChange={(e) => onInputChange(e, "pendidikan")}
                                checked={pasien.pendidikan === "Tidak Sekolah"}
                            />
                            <label htmlFor="tidak_sekolah" className="ml-2">
                                Tidak Sekolah
                            </label>
                        </div>
                        <div className="flex align-items-center">
                            <RadioButton
                                inputId="belum_sekolah"
                                name="pendidikan"
                                value="Belum Sekolah"
                                onChange={(e) => onInputChange(e, "pendidikan")}
                                checked={pasien.pendidikan === "Belum Sekolah"}
                            />
                            <label htmlFor="belum_sekolah" className="ml-2">
                                Belum Sekolah
                            </label>
                        </div>
                        <div className="flex align-items-center">
                            <RadioButton
                                inputId="TK"
                                name="pendidikan"
                                value="TK"
                                onChange={(e) => onInputChange(e, "pendidikan")}
                                checked={pasien.pendidikan === "TK"}
                            />
                            <label htmlFor="TK" className="ml-2">
                                TK
                            </label>
                        </div>
                        <div className="flex align-items-center">
                            <RadioButton
                                inputId="SD"
                                name="pendidikan"
                                value="SD"
                                onChange={(e) => onInputChange(e, "pendidikan")}
                                checked={pasien.pendidikan === "SD"}
                            />
                            <label htmlFor="SD" className="ml-2">
                                SD
                            </label>
                        </div>
                        <div className="flex align-items-center">
                            <RadioButton
                                inputId="SLTP"
                                name="pendidikan"
                                value="SLTP"
                                onChange={(e) => onInputChange(e, "pendidikan")}
                                checked={pasien.pendidikan === "SLTP"}
                            />
                            <label htmlFor="SLTP" className="ml-2">
                                SLTP
                            </label>
                        </div>
                        <div className="flex align-items-center">
                            <RadioButton
                                inputId="SLTA"
                                name="pendidikan"
                                value="SLTA"
                                onChange={(e) => onInputChange(e, "pendidikan")}
                                checked={pasien.pendidikan === "SLTA"}
                            />
                            <label htmlFor="SLTA" className="ml-2">
                                SLTA
                            </label>
                        </div>
                        <div className="flex align-items-center">
                            <RadioButton
                                inputId="Akademi"
                                name="pendidikan"
                                value="Akademi"
                                onChange={(e) => onInputChange(e, "pendidikan")}
                                checked={pasien.pendidikan === "Akademi"}
                            />
                            <label htmlFor="Akademi" className="ml-2">
                                Akademi
                            </label>
                        </div>
                        <div className="flex align-items-center">
                            <RadioButton
                                inputId="S1"
                                name="pendidikan"
                                value="S1"
                                onChange={(e) => onInputChange(e, "pendidikan")}
                                checked={pasien.pendidikan === "S1"}
                            />
                            <label htmlFor="S1" className="ml-2">
                                S1
                            </label>
                        </div>
                        <div className="flex align-items-center">
                            <RadioButton
                                inputId="S2"
                                name="pendidikan"
                                value="S2"
                                onChange={(e) => onInputChange(e, "pendidikan")}
                                checked={pasien.pendidikan === "S2"}
                            />
                            <label htmlFor="S2" className="ml-2">
                                S2
                            </label>
                        </div>
                        <div className="flex align-items-center">
                            <RadioButton
                                inputId="S3"
                                name="pendidikan"
                                value="S3"
                                onChange={(e) => onInputChange(e, "pendidikan")}
                                checked={pasien.pendidikan === "S3"}
                            />
                            <label htmlFor="S3" className="ml-2">
                                S3
                            </label>
                        </div>
                    </div>
                </div>
                <div className="field">
                    <label htmlFor="pekerjaan" className="font-bold">
                        Pekerjaan
                    </label>
                    <div className="flex flex-wrap gap-3">
                        <div className="flex align-items-center">
                            <RadioButton
                                inputId="Pelajar/Mahasiswa"
                                name="pekerjaan"
                                value="Pelajar/Mahasiswa"
                                onChange={(e) => onInputChange(e, "pekerjaan")}
                                checked={
                                    pasien.pekerjaan === "Pelajar/Mahasiswa"
                                }
                            />
                            <label htmlFor="Pelajar/Mahasiswa" className="ml-2">
                                Pelajar/Mahasiswa
                            </label>
                        </div>
                        <div className="flex align-items-center">
                            <RadioButton
                                inputId="Wiraswasta"
                                name="pekerjaan"
                                value="Wiraswasta"
                                onChange={(e) => onInputChange(e, "pekerjaan")}
                                checked={pasien.pekerjaan === "Wiraswasta"}
                            />
                            <label htmlFor="Wiraswasta" className="ml-2">
                                Wiraswasta
                            </label>
                        </div>
                        <div className="flex align-items-center">
                            <RadioButton
                                inputId="PNS"
                                name="pekerjaan"
                                value="PNS"
                                onChange={(e) => onInputChange(e, "pekerjaan")}
                                checked={pasien.pekerjaan === "PNS"}
                            />
                            <label htmlFor="PNS" className="ml-2">
                                PNS
                            </label>
                        </div>
                        <div className="flex align-items-center">
                            <RadioButton
                                inputId="Pensiunan"
                                name="pekerjaan"
                                value="Pensiunan"
                                onChange={(e) => onInputChange(e, "pekerjaan")}
                                checked={pasien.pekerjaan === "Pensiunan"}
                            />
                            <label htmlFor="Pensiunan" className="ml-2">
                                Pensiunan
                            </label>
                        </div>
                        <div className="flex align-items-center">
                            <RadioButton
                                inputId="Pegawai Swasta"
                                name="pekerjaan"
                                value="Pegawai Swasta"
                                onChange={(e) => onInputChange(e, "pekerjaan")}
                                checked={pasien.pekerjaan === "Pegawai Swasta"}
                            />
                            <label htmlFor="Pegawai Swasta" className="ml-2">
                                Pegawai Swasta
                            </label>
                        </div>
                        <div className="flex align-items-center">
                            <RadioButton
                                inputId="Tidak Bekerja"
                                name="pekerjaan"
                                value="Tidak Bekerja"
                                onChange={(e) => onInputChange(e, "pekerjaan")}
                                checked={pasien.pekerjaan === "Tidak Bekerja"}
                            />
                            <label htmlFor="Tidak Bekerja" className="ml-2">
                                Tidak Bekerja
                            </label>
                        </div>
                        <div className="flex align-items-center">
                            <RadioButton
                                inputId="Profesional"
                                name="pekerjaan"
                                value="Profesional"
                                onChange={(e) => onInputChange(e, "pekerjaan")}
                                checked={pasien.pekerjaan === "Profesional"}
                            />
                            <label htmlFor="Profesional" className="ml-2">
                                Profesional
                            </label>
                        </div>
                        <div className="flex align-items-center">
                            <RadioButton
                                inputId="IRT"
                                name="pekerjaan"
                                value="IRT"
                                onChange={(e) => onInputChange(e, "pekerjaan")}
                                checked={pasien.pekerjaan === "IRT"}
                            />
                            <label htmlFor="IRT" className="ml-2">
                                IRT
                            </label>
                        </div>
                        <div className="flex align-items-center">
                            <RadioButton
                                inputId="TNI/POLRI"
                                name="pekerjaan"
                                value="TNI/POLRI"
                                onChange={(e) => onInputChange(e, "pekerjaan")}
                                checked={pasien.pekerjaan === "TNI/POLRI"}
                            />
                            <label htmlFor="TNI/POLRI" className="ml-2">
                                TNI/POLRI
                            </label>
                        </div>
                        <div className="flex align-items-center">
                            <RadioButton
                                inputId="Petani/Buruh/Nelayan/Lainnya"
                                name="pekerjaan"
                                value="Petani/Buruh/Nelayan/Lainnya"
                                onChange={(e) => onInputChange(e, "pekerjaan")}
                                checked={
                                    pasien.pekerjaan ===
                                    "Petani/Buruh/Nelayan/Lainnya"
                                }
                            />
                            <label
                                htmlFor="Petani/Buruh/Nelayan/Lainnya"
                                className="ml-2"
                            >
                                Petani/Buruh/Nelayan/Lainnya
                            </label>
                        </div>
                    </div>
                </div>
            </Dialog>

            <Dialog
                visible={dialogTambah}
                style={{ width: "70rem" }}
                breakpoints={{ "960px": "75vw", "641px": "90vw" }}
                header="New Pasien"
                modal
                className="p-fluid"
                footer={footerDialogTambah}
                onHide={() => onHideDialog()}
            >
                <div className="field">
                    <label htmlFor="no_rm" className="font-bold">
                        No. RM
                    </label>
                    <InputText
                        id="no_rm"
                        required
                        autoFocus
                        value={pasien.no_rm}
                        onChange={(e) => onInputChange(e, "no_rm")}
                        placeholder="Masukkan No. RM"
                    />
                    {errors.no_rm && (
                        <small className="p-error">{errors.no_rm}</small>
                    )}
                </div>
                <div className="field">
                    <label htmlFor="nama" className="font-bold">
                        Nama Pasien
                    </label>
                    <InputText
                        id="nama"
                        required
                        autoFocus
                        value={pasien.nama}
                        onChange={(e) => onInputChange(e, "nama")}
                        placeholder="Masukkan Nama Pasien"
                    />
                    {errors.nama && (
                        <small className="p-error">{errors.nama}</small>
                    )}
                </div>
                <div className="field">
                    <label htmlFor="nama" className="font-bold">
                        Jenis Pengobatan
                    </label>
                    <div className="flex flex-wrap gap-3">
                        <div className="flex align-items-center">
                            <RadioButton
                                inputId="ingredient2"
                                name="jenis_pengobatan"
                                value="Umum"
                                onChange={(e) =>
                                    onInputChange(e, "jenis_pengobatan")
                                }
                                checked={pasien.jenis_pengobatan === "Umum"}
                            />
                            <label htmlFor="ingredient2" className="ml-2">
                                Umum
                            </label>
                        </div>
                        <div className="flex align-items-center">
                            <RadioButton
                                inputId="ingredient3"
                                name="jenis_pengobatan"
                                value="BPJS"
                                onChange={(e) =>
                                    onInputChange(e, "jenis_pengobatan")
                                }
                                checked={pasien.jenis_pengobatan === "BPJS"}
                            />
                            <label htmlFor="ingredient3" className="ml-2">
                                BPJS
                            </label>
                        </div>
                    </div>
                </div>
                <div className="field">
                    <label htmlFor="nik" className="font-bold">
                        NIK
                    </label>
                    <InputText
                        id="nik"
                        required
                        autoFocus
                        value={pasien.nik}
                        onChange={(e) => onInputChange(e, "nik")}
                        placeholder="Masukkan NIK Pasien"
                    />
                    {errors.nik && (
                        <small className="p-error">{errors.nik}</small>
                    )}
                </div>
                <div className="field">
                    <label htmlFor="no_bpjs" className="font-bold">
                        Nomor BPJS
                    </label>
                    <InputText
                        id="no_bpjs"
                        required
                        autoFocus
                        value={pasien.no_bpjs}
                        onChange={(e) => onInputChange(e, "no_bpjs")}
                        placeholder="Masukkan Nomor BPJS Pasien"
                    />
                    {errors.no_bpjs && (
                        <small className="p-error">{errors.no_bpjs}</small>
                    )}
                </div>
                <div className="field">
                    <label htmlFor="gol_darh" className="font-bold">
                        Golongan Darah
                    </label>
                    <div className="flex flex-wrap gap-3">
                        <div className="flex align-items-center">
                            <RadioButton
                                inputId="A"
                                name="gol_darah"
                                value="A"
                                onChange={(e) => onInputChange(e, "gol_darah")}
                                checked={pasien.gol_darah === "A"}
                            />
                            <label htmlFor="A" className="ml-2">
                                A
                            </label>
                        </div>
                        <div className="flex align-items-center">
                            <RadioButton
                                inputId="B"
                                name="gol_darah"
                                value="B"
                                onChange={(e) => onInputChange(e, "gol_darah")}
                                checked={pasien.gol_darah === "B"}
                            />
                            <label htmlFor="B" className="ml-2">
                                B
                            </label>
                        </div>
                        <div className="flex align-items-center">
                            <RadioButton
                                inputId="AB"
                                name="gol_darah"
                                value="AB"
                                onChange={(e) => onInputChange(e, "gol_darah")}
                                checked={pasien.gol_darah === "AB"}
                            />
                            <label htmlFor="AB" className="ml-2">
                                AB
                            </label>
                        </div>
                        <div className="flex align-items-center">
                            <RadioButton
                                inputId="O"
                                name="gol_darah"
                                value="O"
                                onChange={(e) => onInputChange(e, "gol_darah")}
                                checked={pasien.gol_darah === "O"}
                            />
                            <label htmlFor="O" className="ml-2">
                                O
                            </label>
                        </div>
                    </div>
                    {errors.gol_darah && (
                        <small className="p-error">{errors.gol_darah}</small>
                    )}
                </div>
                <div className="field">
                    <label htmlFor="tgl_lahir" className="font-bold">
                        Tanggal Lahir
                    </label>
                    <InputText
                        type="date"
                        id="tgl_lahir"
                        required
                        autoFocus
                        value={pasien.tgl_lahir}
                        onChange={(e) => onInputChange(e, "tgl_lahir")}
                        placeholder="Masukkan Tanggal Lahir Pasien"
                    />
                    {errors.tgl_lahir && (
                        <small className="p-error">{errors.tgl_lahir}</small>
                    )}
                </div>
                <div className="field">
                    <label htmlFor="alamat" className="font-bold">
                        Alamat
                    </label>
                    <InputText
                        id="alamat"
                        required
                        autoFocus
                        value={pasien.alamat}
                        onChange={(e) => onInputChange(e, "alamat")}
                        placeholder="Masukkan Alamat Pasien"
                    />
                    {errors.alamat && (
                        <small className="p-error">{errors.alamat}</small>
                    )}
                </div>
                <div className="field">
                    <label htmlFor="no_hp" className="font-bold">
                        Nomor HP
                    </label>
                    <InputText
                        id="no_hp"
                        required
                        autoFocus
                        value={pasien.no_hp}
                        onChange={(e) => onInputChange(e, "no_hp")}
                        placeholder="Masukkan Nomor HP Pasien"
                    />
                    {errors.no_hp && (
                        <small className="p-error">{errors.no_hp}</small>
                    )}
                </div>
                <div className="field">
                    <label htmlFor="status_perkawinan" className="font-bold">
                        Status Perkawinan
                    </label>
                    <div className="flex flex-wrap gap-3">
                        <div className="flex align-items-center">
                            <RadioButton
                                inputId="belum_kawin"
                                name="status_perkawinan"
                                value="Belum Kawin"
                                onChange={(e) =>
                                    onInputChange(e, "status_perkawinan")
                                }
                                checked={
                                    pasien.status_perkawinan === "Belum Kawin"
                                }
                            />
                            <label htmlFor="belum_kawin" className="ml-2">
                                Belum Kawin
                            </label>
                        </div>
                        <div className="flex align-items-center">
                            <RadioButton
                                inputId="Kawin"
                                name="status_perkawinan"
                                value="Kawin"
                                onChange={(e) =>
                                    onInputChange(e, "status_perkawinan")
                                }
                                checked={pasien.status_perkawinan === "Kawin"}
                            />
                            <label htmlFor="Kawin" className="ml-2">
                                Kawin
                            </label>
                        </div>
                    </div>
                </div>
                <div className="field">
                    <label htmlFor="status_perkawinan" className="font-bold">
                        Pendidikan
                    </label>
                    <div className="flex flex-wrap gap-3">
                        <div className="flex align-items-center">
                            <RadioButton
                                inputId="tidak_sekolah"
                                name="pendidikan"
                                value="Tidak Sekolah"
                                onChange={(e) => onInputChange(e, "pendidikan")}
                                checked={pasien.pendidikan === "Tidak Sekolah"}
                            />
                            <label htmlFor="tidak_sekolah" className="ml-2">
                                Tidak Sekolah
                            </label>
                        </div>
                        <div className="flex align-items-center">
                            <RadioButton
                                inputId="belum_sekolah"
                                name="pendidikan"
                                value="Belum Sekolah"
                                onChange={(e) => onInputChange(e, "pendidikan")}
                                checked={pasien.pendidikan === "Belum Sekolah"}
                            />
                            <label htmlFor="belum_sekolah" className="ml-2">
                                Belum Sekolah
                            </label>
                        </div>
                        <div className="flex align-items-center">
                            <RadioButton
                                inputId="TK"
                                name="pendidikan"
                                value="TK"
                                onChange={(e) => onInputChange(e, "pendidikan")}
                                checked={pasien.pendidikan === "TK"}
                            />
                            <label htmlFor="TK" className="ml-2">
                                TK
                            </label>
                        </div>
                        <div className="flex align-items-center">
                            <RadioButton
                                inputId="SD"
                                name="pendidikan"
                                value="SD"
                                onChange={(e) => onInputChange(e, "pendidikan")}
                                checked={pasien.pendidikan === "SD"}
                            />
                            <label htmlFor="SD" className="ml-2">
                                SD
                            </label>
                        </div>
                        <div className="flex align-items-center">
                            <RadioButton
                                inputId="SLTP"
                                name="pendidikan"
                                value="SLTP"
                                onChange={(e) => onInputChange(e, "pendidikan")}
                                checked={pasien.pendidikan === "SLTP"}
                            />
                            <label htmlFor="SLTP" className="ml-2">
                                SLTP
                            </label>
                        </div>
                        <div className="flex align-items-center">
                            <RadioButton
                                inputId="SLTA"
                                name="pendidikan"
                                value="SLTA"
                                onChange={(e) => onInputChange(e, "pendidikan")}
                                checked={pasien.pendidikan === "SLTA"}
                            />
                            <label htmlFor="SLTA" className="ml-2">
                                SLTA
                            </label>
                        </div>
                        <div className="flex align-items-center">
                            <RadioButton
                                inputId="Akademi"
                                name="pendidikan"
                                value="Akademi"
                                onChange={(e) => onInputChange(e, "pendidikan")}
                                checked={pasien.pendidikan === "Akademi"}
                            />
                            <label htmlFor="Akademi" className="ml-2">
                                Akademi
                            </label>
                        </div>
                        <div className="flex align-items-center">
                            <RadioButton
                                inputId="S1"
                                name="pendidikan"
                                value="S1"
                                onChange={(e) => onInputChange(e, "pendidikan")}
                                checked={pasien.pendidikan === "S1"}
                            />
                            <label htmlFor="S1" className="ml-2">
                                S1
                            </label>
                        </div>
                        <div className="flex align-items-center">
                            <RadioButton
                                inputId="S2"
                                name="pendidikan"
                                value="S2"
                                onChange={(e) => onInputChange(e, "pendidikan")}
                                checked={pasien.pendidikan === "S2"}
                            />
                            <label htmlFor="S2" className="ml-2">
                                S2
                            </label>
                        </div>
                        <div className="flex align-items-center">
                            <RadioButton
                                inputId="S3"
                                name="pendidikan"
                                value="S3"
                                onChange={(e) => onInputChange(e, "pendidikan")}
                                checked={pasien.pendidikan === "S3"}
                            />
                            <label htmlFor="S3" className="ml-2">
                                S3
                            </label>
                        </div>
                    </div>
                </div>
                <div className="field">
                    <label htmlFor="pekerjaan" className="font-bold">
                        Pekerjaan
                    </label>
                    <div className="flex flex-wrap gap-3">
                        <div className="flex align-items-center">
                            <RadioButton
                                inputId="Pelajar/Mahasiswa"
                                name="pekerjaan"
                                value="Pelajar/Mahasiswa"
                                onChange={(e) => onInputChange(e, "pekerjaan")}
                                checked={
                                    pasien.pekerjaan === "Pelajar/Mahasiswa"
                                }
                            />
                            <label htmlFor="Pelajar/Mahasiswa" className="ml-2">
                                Pelajar/Mahasiswa
                            </label>
                        </div>
                        <div className="flex align-items-center">
                            <RadioButton
                                inputId="Wiraswasta"
                                name="pekerjaan"
                                value="Wiraswasta"
                                onChange={(e) => onInputChange(e, "pekerjaan")}
                                checked={pasien.pekerjaan === "Wiraswasta"}
                            />
                            <label htmlFor="Wiraswasta" className="ml-2">
                                Wiraswasta
                            </label>
                        </div>
                        <div className="flex align-items-center">
                            <RadioButton
                                inputId="PNS"
                                name="pekerjaan"
                                value="PNS"
                                onChange={(e) => onInputChange(e, "pekerjaan")}
                                checked={pasien.pekerjaan === "PNS"}
                            />
                            <label htmlFor="PNS" className="ml-2">
                                PNS
                            </label>
                        </div>
                        <div className="flex align-items-center">
                            <RadioButton
                                inputId="Pensiunan"
                                name="pekerjaan"
                                value="Pensiunan"
                                onChange={(e) => onInputChange(e, "pekerjaan")}
                                checked={pasien.pekerjaan === "Pensiunan"}
                            />
                            <label htmlFor="Pensiunan" className="ml-2">
                                Pensiunan
                            </label>
                        </div>
                        <div className="flex align-items-center">
                            <RadioButton
                                inputId="Pegawai Swasta"
                                name="pekerjaan"
                                value="Pegawai Swasta"
                                onChange={(e) => onInputChange(e, "pekerjaan")}
                                checked={pasien.pekerjaan === "Pegawai Swasta"}
                            />
                            <label htmlFor="Pegawai Swasta" className="ml-2">
                                Pegawai Swasta
                            </label>
                        </div>
                        <div className="flex align-items-center">
                            <RadioButton
                                inputId="Tidak Bekerja"
                                name="pekerjaan"
                                value="Tidak Bekerja"
                                onChange={(e) => onInputChange(e, "pekerjaan")}
                                checked={pasien.pekerjaan === "Tidak Bekerja"}
                            />
                            <label htmlFor="Tidak Bekerja" className="ml-2">
                                Tidak Bekerja
                            </label>
                        </div>
                        <div className="flex align-items-center">
                            <RadioButton
                                inputId="Profesional"
                                name="pekerjaan"
                                value="Profesional"
                                onChange={(e) => onInputChange(e, "pekerjaan")}
                                checked={pasien.pekerjaan === "Profesional"}
                            />
                            <label htmlFor="Profesional" className="ml-2">
                                Profesional
                            </label>
                        </div>
                        <div className="flex align-items-center">
                            <RadioButton
                                inputId="IRT"
                                name="pekerjaan"
                                value="IRT"
                                onChange={(e) => onInputChange(e, "pekerjaan")}
                                checked={pasien.pekerjaan === "IRT"}
                            />
                            <label htmlFor="IRT" className="ml-2">
                                IRT
                            </label>
                        </div>
                        <div className="flex align-items-center">
                            <RadioButton
                                inputId="TNI/POLRI"
                                name="pekerjaan"
                                value="TNI/POLRI"
                                onChange={(e) => onInputChange(e, "pekerjaan")}
                                checked={pasien.pekerjaan === "TNI/POLRI"}
                            />
                            <label htmlFor="TNI/POLRI" className="ml-2">
                                TNI/POLRI
                            </label>
                        </div>
                        <div className="flex align-items-center">
                            <RadioButton
                                inputId="Petani/Buruh/Nelayan/Lainnya"
                                name="pekerjaan"
                                value="Petani/Buruh/Nelayan/Lainnya"
                                onChange={(e) => onInputChange(e, "pekerjaan")}
                                checked={
                                    pasien.pekerjaan ===
                                    "Petani/Buruh/Nelayan/Lainnya"
                                }
                            />
                            <label
                                htmlFor="Petani/Buruh/Nelayan/Lainnya"
                                className="ml-2"
                            >
                                Petani/Buruh/Nelayan/Lainnya
                            </label>
                        </div>
                    </div>
                </div>
            </Dialog>
        </Layout>
    );
}
