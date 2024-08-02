import Layout from "@/Layouts/layout/layout";
import axios from "axios";
import moment from "moment";
import { Button } from "primereact/button";
import { Calendar } from "primereact/calendar";
import { Column } from "primereact/column";
import { ConfirmPopup, confirmPopup } from "primereact/confirmpopup";
import { DataTable } from "primereact/datatable";
import { Dialog } from "primereact/dialog";
import { Dropdown } from "primereact/dropdown";
import { InputText } from "primereact/inputtext";
import { Toast } from "primereact/toast";
import { Toolbar } from "primereact/toolbar";
import React from "react";
import { useRef } from "react";
import { useEffect } from "react";
import { useState } from "react";

export default function RekamMedis({ rekamMedis, pasiens }) {
    const [dataRekamMedis, setDataRekamMedis] = useState([]);
    const [globalFilter, setGlobalFilter] = useState("");
    useEffect(() => {
        setDataRekamMedis(rekamMedis);
    }, []);
    const onInputSearch = (e) => {
        var val = e.target.value;
        setGlobalFilter(val ? val : []);
    };

    let emptyMedis = {
        id: "",
        pasien_id: "",
        dokter_id: "",
        diagnosa: "",
        keluhan: "",
    };

    const [medis, setMedis] = useState(emptyMedis);
    const [selectedPasien, setSelectedPasien] = useState(null);

    const onPasienChange = (e) => {
        setSelectedPasien(e.value);
        let _medis = { ...medis };
        _medis[`pasien_id`] = e.value.id;
        setMedis(_medis);
    };

    // const [selectedDiagnosa, setSelectedDiagnosa] = useState(null);

    // const onDiagnosaChange = (e) => {
    //     setSelectedDiagnosa(e.value);
    //     let _medis = { ...medis };
    //     _medis[`diagnosa_id`] = e.value.id;
    //     setMedis(_medis);
    // };

    const onInputChange = (e, name) => {
        const val = (e.target && e.target.value) || "";
        let _medis = { ...medis };
        _medis[`${name}`] = val;
        setMedis(_medis);
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
                    await axios.delete(route("rekammedis.destroy", rowData.id));
                    toast.current.show({
                        severity: "info",
                        summary: "Confirmed",
                        detail: "You have deleted " + rowData.nama,
                        life: 3000,
                    });

                    setDataRekamMedis((prevItems) =>
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
            const res = await axios.post(route("rekammedis.store"), medis);
            const updatedData = [res.data, ...dataRekamMedis];
            setDataRekamMedis(updatedData);

            setDialogTambah(false);
            toast.current.show({
                severity: "success",
                summary: "Success",
                detail: "You have success create rekam medis ",
                life: 3000,
            });

            setMedis(emptyMedis);
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
        setMedis(emptyMedis);
        setErrors([]);
        setDialogTambah(false);
    };
    // END TAMBAH

    // EDIT

    const openEdit = (data) => {
        setDialogEdit(true);
        setMedis(data);
    };
    const onHideDialog2 = () => {
        setMedis(emptyMedis);
        setErrors([]);
        setDialogEdit(false);
    };
    const [dialogEdit, setDialogEdit] = useState(false);
    const submit2 = async (e) => {
        try {
            const res = await axios.patch(
                route("rekammedis.update", medis.id),
                medis
            );
            setDataRekamMedis((prevItems) =>
                prevItems.map((item) =>
                    item.id === res.data.id
                        ? {
                              ...item,
                              pasien_id: res.data.pasien_id,
                              dokter_id: res.data.dokter_id,
                              diagnosa_id: res.data.diagnosa_id,
                              keluhan: res.data.keluhan,
                          }
                        : item
                )
            );
            toast.current.show({
                severity: "success",
                summary: "Success",
                detail: "You have success updated rekam medis " + res.data.id,
                life: 3000,
            });
            setMedis(emptyMedis);
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
    const rightToolbarTemplate = () => {
        return (
            <div className="flex flex-wrap gap-2">
                <Button label="Export" icon="pi pi-export" severity="warning" />
            </div>
        );
    };
    const renderHeader = () => {
        return (
            <div className="flex flex-wrap gap-2 justify-content-between align-items-center">
                <h5>Rekam medis</h5>
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

    const [selectedDate, setSelectedDate] = useState(null);
    const onDateChange = (e) => {
        setSelectedDate(e.value);

        const filteredData = dataRekamMedis.filter(
            (item) => item.tanggal === moment(e.value).format("YYYY-MM-DD")
        );

        setDataRekamMedis(filteredData);
        // Filter logic can be implemented here if needed
    };

    const dateFilter = (
        <Calendar
            value={selectedDate}
            onChange={onDateChange}
            dateFormat="yy-mm-dd"
            placeholder="Select a Date"
            className="p-column-filter"
        />
    );

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
                            right={rightToolbarTemplate}
                        ></Toolbar>
                        <DataTable
                            value={dataRekamMedis}
                            paginator
                            dataKey="id"
                            rows={10}
                            rowsPerPageOptions={[5, 10, 25]}
                            paginatorTemplate="FirstPageLink PrevPageLink PageLinks NextPageLink LastPageLink CurrentPageReport RowsPerPageDropdown"
                            currentPageReportTemplate="Showing {first} to {last} of {totalRecords} entries"
                            globalFilter={globalFilter}
                            emptyMessage="Tidak ada Rekam Medis"
                            globalFilterFields={["nama", "kode"]}
                            header={header}
                        >
                            <Column
                                headerClassName="fw-bold"
                                field="tanggal"
                                header="Tanggal & Waktu"
                                filter
                                sortable
                                filterElement={dateFilter}
                                filterPlaceholder="Tanggal"
                                style={{ minWidth: "15rem" }}
                                headerStyle={{ width: "15rem" }}
                            />
                            <Column
                                headerClassName="fw-bold"
                                field="pasien.no_rm"
                                header="No RM"
                                filter
                                sortable
                                filterPlaceholder="Nama pasien"
                                style={{ minWidth: "9rem" }}
                                headerStyle={{ width: "9rem" }}
                            />
                            <Column
                                headerClassName="fw-bold"
                                field="pasien.nama"
                                header="Pasien"
                                filter
                                sortable
                                filterPlaceholder="Nama pasien"
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
                                field="diagnosa"
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
                                body={actionBodyTemplate}
                                exportable={false}
                                style={{ minWidth: "8rem" }}
                            ></Column>
                        </DataTable>
                    </div>
                </div>
            </div>
            <Dialog
                visible={dialogEdit}
                style={{ width: "32rem" }}
                breakpoints={{ "960px": "75vw", "641px": "90vw" }}
                header="Edit Rekam Medis"
                modal
                className="p-fluid"
                footer={footerDialogEdit}
                onHide={() => onHideDialog2()}
            >
                <div className="field">
                    <label htmlFor="pasien" className="font-bold">
                        Pasien
                    </label>
                    <Dropdown
                        showClear
                        filter
                        filterBy="name"
                        value={selectedPasien}
                        options={pasiens}
                        onChange={onPasienChange}
                        optionLabel="nama"
                        placeholder="Select a Pasien"
                    />
                    {errors.pasien_id && (
                        <small className="p-error">{errors.pasien_id}</small>
                    )}
                </div>

                <div className="field">
                    <label htmlFor="diagnosa" className="font-bold">
                        Diagnosa
                    </label>
                    <InputText
                        id="diagnosa"
                        required
                        autoFocus
                        value={medis.diagnosa}
                        onChange={(e) => onInputChange(e, "diagnosa")}
                        placeholder="Masukkan Diagnosa"
                    />
                    {errors.diagnosa && (
                        <small className="p-error">{errors.diagnosa}</small>
                    )}
                </div>

                <div className="field">
                    <label htmlFor="keluhan" className="font-bold">
                        Keluhan
                    </label>
                    <InputText
                        id="keluhan"
                        required
                        autoFocus
                        value={medis.keluhan}
                        onChange={(e) => onInputChange(e, "keluhan")}
                        placeholder="Masukkan Keluhan"
                    />
                    {errors.keluhan && (
                        <small className="p-error">{errors.keluhan}</small>
                    )}
                </div>
            </Dialog>

            <Dialog
                visible={dialogTambah}
                style={{ width: "32rem" }}
                breakpoints={{ "960px": "75vw", "641px": "90vw" }}
                header="New Rekam Medis"
                modal
                className="p-fluid"
                footer={footerDialogTambah}
                onHide={() => onHideDialog()}
            >
                <div className="field">
                    <label htmlFor="pasien" className="font-bold">
                        Pasien
                    </label>
                    <Dropdown
                        showClear
                        filter
                        filterBy="name"
                        value={selectedPasien}
                        options={pasiens}
                        onChange={onPasienChange}
                        optionLabel="nama"
                        placeholder="Select a Pasien"
                    />
                    {selectedPasien && (
                        <div>You selected: {selectedPasien.id}</div>
                    )}
                </div>

                <div className="field">
                    <label htmlFor="diagnosa" className="font-bold">
                        Diagnosa
                    </label>
                    <InputText
                        id="diagnosa"
                        required
                        autoFocus
                        value={medis.diagnosa}
                        onChange={(e) => onInputChange(e, "diagnosa")}
                        placeholder="Masukkan Diagnosa"
                    />
                    {errors.diagnosa && (
                        <small className="p-error">{errors.diagnosa}</small>
                    )}
                </div>

                <div className="field">
                    <label htmlFor="keluhan" className="font-bold">
                        Keluhan
                    </label>
                    <InputText
                        id="keluhan"
                        required
                        autoFocus
                        value={medis.keluhan}
                        onChange={(e) => onInputChange(e, "keluhan")}
                        placeholder="Masukkan Keluhan"
                    />
                    {errors.keluhan && (
                        <small className="p-error">{errors.keluhan}</small>
                    )}
                </div>
            </Dialog>
        </Layout>
    );
}
