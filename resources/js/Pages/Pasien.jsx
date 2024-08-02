import Layout from "@/Layouts/layout/layout";
import axios from "axios";
import { Button } from "primereact/button";
import { Column } from "primereact/column";
import { ConfirmPopup, confirmPopup } from "primereact/confirmpopup";
import { DataTable } from "primereact/datatable";
import { Dialog } from "primereact/dialog";
import { InputText } from "primereact/inputtext";
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
            console.log(error);
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
            console.log(error);
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
                                headerClassName="fw-bold"
                                field="no_rm"
                                header="No.RM"
                                sortable
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
                                field="nik"
                                header="NIK"
                                sortable
                                filterPlaceholder="nik"
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
                                field="gol_darah"
                                header="GOL"
                                sortable
                                filterPlaceholder="Golongan darah"
                                style={{ minWidth: "5rem" }}
                                headerStyle={{ width: "5rem" }}
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
                            <Column
                                headerClassName="fw-bold"
                                field="no_hp"
                                header="Nomor HP"
                                sortable
                                filterPlaceholder="Nomor HP"
                                style={{ minWidth: "15rem" }}
                                headerStyle={{ width: "15rem" }}
                            />

                            <Column
                                body={actionBodyTemplate}
                                exportable={false}
                                style={{ minWidth: "12rem" }}
                            ></Column>
                        </DataTable>
                    </div>
                </div>
            </div>
            <Dialog
                visible={dialogEdit}
                style={{ width: "32rem" }}
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
                    <InputText
                        id="gol_darah"
                        required
                        autoFocus
                        value={pasien.gol_darah}
                        onChange={(e) => onInputChange(e, "gol_darah")}
                        placeholder="Masukkan Golongan Darah Pasien"
                    />
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
            </Dialog>

            <Dialog
                visible={dialogTambah}
                style={{ width: "32rem" }}
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
                    <InputText
                        id="gol_darah"
                        required
                        autoFocus
                        value={pasien.gol_darah}
                        onChange={(e) => onInputChange(e, "gol_darah")}
                        placeholder="Masukkan Golongan Darah Pasien"
                    />
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
            </Dialog>
        </Layout>
    );
}
