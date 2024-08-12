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

export default function Obat({ diagnosas }) {
    const [dataDiagnosa, setDataDiagnosa] = useState([]);
    const [globalFilter, setGlobalFilter] = useState("");
    useEffect(() => {
        setDataDiagnosa(diagnosas);
    }, []);
    const onInputSearch = (e) => {
        var val = e.target.value;
        setGlobalFilter(val ? val : []);
    };

    let emptyDiagnosa = {
        id: "",
        kode: "",
        nama: "",
    };

    const [diagnosa, setDiagnosa] = useState(emptyDiagnosa);
    const onInputChange = (e, name) => {
        const val = (e.target && e.target.value) || "";
        let _diagnosa = { ...diagnosa };
        _diagnosa[`${name}`] = val;
        setDiagnosa(_diagnosa);
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
                    await axios.delete(route("diagnosa.destroy", rowData.id));
                    toast.current.show({
                        severity: "info",
                        summary: "Confirmed",
                        detail: "You have deleted " + rowData.nama,
                        life: 3000,
                    });

                    setDataDiagnosa((prevItems) =>
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
            const res = await axios.post(route("diagnosa.store"), diagnosa);
            const updatedData = [res.data, ...dataDiagnosa];
            setDataDiagnosa(updatedData);

            setDialogTambah(false);
            toast.current.show({
                severity: "success",
                summary: "Success",
                detail: "You have success create diagnosa " + res.data.nama,
                life: 3000,
            });
            setDiagnosa(emptyDiagnosa);
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
        setDiagnosa(emptyDiagnosa);
        setErrors([]);
        setDialogTambah(false);
    };
    // END TAMBAH

    // EDIT

    const openEdit = (data) => {
        setDialogEdit(true);
        setDiagnosa(data);
    };
    const onHideDialog2 = () => {
        setDiagnosa(emptyDiagnosa);
        setErrors([]);
        setDialogEdit(false);
    };
    const [dialogEdit, setDialogEdit] = useState(false);
    const submit2 = async (e) => {
        try {
            const res = await axios.patch(
                route("diagnosa.update", diagnosa.id),
                diagnosa
            );
            setDataDiagnosa((prevItems) =>
                prevItems.map((item) =>
                    item.id === res.data.id
                        ? {
                              ...item,
                              nama: res.data.nama,
                              kode: res.data.kode,
                          }
                        : item
                )
            );
            toast.current.show({
                severity: "success",
                summary: "Success",
                detail: "You have success updated diagnosa " + res.data.nama,
                life: 3000,
            });
            setDiagnosa(emptyDiagnosa);
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
                <h5>Diagnosa</h5>
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
                            value={dataDiagnosa}
                            paginator
                            dataKey="id"
                            rows={10}
                            rowsPerPageOptions={[5, 10, 25]}
                            paginatorTemplate="FirstPageLink PrevPageLink PageLinks NextPageLink LastPageLink CurrentPageReport RowsPerPageDropdown"
                            currentPageReportTemplate="Showing {first} to {last} of {totalRecords} entries"
                            globalFilter={globalFilter}
                            emptyDiagnosa="Tidak ada diagnosa"
                            globalFilterFields={["nama", "kode"]}
                            header={header}
                        >
                            <Column
                                headerClassName="fw-bold"
                                field="kode"
                                header="Kode Diagnosa"
                                sortable
                                filterPlaceholder="kode"
                                style={{ minWidth: "20rem" }}
                                headerStyle={{ width: "20rem" }}
                            />
                            <Column
                                headerClassName="fw-bold"
                                field="nama"
                                header="Nama diagnosa"
                                sortable
                                filterPlaceholder="nama"
                                style={{ minWidth: "20rem" }}
                                headerStyle={{ width: "20rem" }}
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
                header="Edit Diagnosa"
                modal
                className="p-fluid"
                footer={footerDialogEdit}
                onHide={() => onHideDialog2()}
            >
                <div className="field">
                    <label htmlFor="kode" className="font-bold">
                        Kode diagnosa
                    </label>
                    <InputText
                        id="kode"
                        required
                        autoFocus
                        value={diagnosa.kode}
                        onChange={(e) => onInputChange(e, "kode")}
                        placeholder="Masukkan Kode"
                    />
                    {errors.kode && (
                        <small className="p-error">{errors.kode}</small>
                    )}
                </div>
                <div className="field">
                    <label htmlFor="nama" className="font-bold">
                        Nama Diagnosa
                    </label>
                    <InputText
                        id="nama"
                        required
                        autoFocus
                        value={diagnosa.nama}
                        onChange={(e) => onInputChange(e, "nama")}
                        placeholder="Masukkan Nama Diagnosa"
                    />
                    {errors.nama && (
                        <small className="p-error">{errors.nama}</small>
                    )}
                </div>
            </Dialog>

            <Dialog
                visible={dialogTambah}
                style={{ width: "32rem" }}
                breakpoints={{ "960px": "75vw", "641px": "90vw" }}
                header="New Diagnosa"
                modal
                className="p-fluid"
                footer={footerDialogTambah}
                onHide={() => onHideDialog()}
            >
                <div className="field">
                    <label htmlFor="kode" className="font-bold">
                        Kode diagnosa
                    </label>
                    <InputText
                        id="kode"
                        required
                        autoFocus
                        value={diagnosa.kode}
                        onChange={(e) => onInputChange(e, "kode")}
                        placeholder="Masukkan Kode"
                    />
                    {errors.kode && (
                        <small className="p-error">{errors.kode}</small>
                    )}
                </div>
                <div className="field">
                    <label htmlFor="nama" className="font-bold">
                        Nama Obat
                    </label>
                    <InputText
                        id="nama"
                        required
                        autoFocus
                        value={diagnosa.nama}
                        onChange={(e) => onInputChange(e, "nama")}
                        placeholder="Masukkan Nama Obat"
                    />
                    {errors.nama && (
                        <small className="p-error">{errors.nama}</small>
                    )}
                </div>
            </Dialog>
        </Layout>
    );
}
