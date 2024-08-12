import Layout from "@/Layouts/layout/layout";
import { Link } from "@inertiajs/react";
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
import { MultiSelect } from "primereact/multiselect";
import { RadioButton } from "primereact/radiobutton";
import { Toast } from "primereact/toast";
import { Toolbar } from "primereact/toolbar";
import React from "react";
import { useRef } from "react";
import { useEffect } from "react";
import { useState } from "react";

export default function RekamMedis({
    auth,
    rekamMedis,
    pasiens,
    obats,
    diagnosas,
}) {
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
        obats: "",
        tgl_masuk: "",
        tgl_keluar: "",
        keadaan_keluar: "",
        cara_keluar: "",
    };

    const [medis, setMedis] = useState(emptyMedis);
    const [selectedPasien, setSelectedPasien] = useState(null);
    const [selectedDiagnosa, setSelectedDiagnosa] = useState(null);

    const onPasienChange = (e) => {
        setSelectedPasien(e.value);
        let _medis = { ...medis };
        _medis[`pasien_id`] = e.value.id;
        setMedis(_medis);
    };

    const onDiagnosaChange = (e) => {
        setSelectedDiagnosa(e.value);
        let _medis = { ...medis };
        _medis[`diagnosa`] = e.value.id;
        setMedis(_medis);
    };

    const onObatChange = (e) => {
        setSelectedObats(e);
        let _medis = { ...medis };
        _medis[`obats`] = e;
        setMedis(_medis);
    };

    const [selectedObats, setSelectedObats] = useState([]);

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
            console.log("RESPON", res);
            setMedis(emptyMedis);
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
                              diagnosa: res.data.diagnosa,
                              keluhan: res.data.keluhan,
                              tgl_masuk: res.data.tgl_masuk,
                              tgl_keluar: res.data.tgl_keluar,
                              cara_keluar: res.data.cara_keluar,
                              keadaan_keluar: res.data.keadaan_keluar,
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
                        {auth.user.role !== "pasien" && (
                            <Toolbar
                                className="mb-4"
                                left={leftToolbarTemplate}
                                right={rightToolbarTemplate}
                            ></Toolbar>
                        )}

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
                            header={header}
                        >
                            <Column
                                hidden={auth.user.role === "pasien"}
                                body={actionBodyTemplate}
                                exportable={false}
                                style={{ minWidth: "10rem" }}
                            ></Column>
                            <Column
                                headerClassName="fw-bold"
                                body={(rowData) => {
                                    return moment(rowData.created_at).format(
                                        "DD/MM/YYYY ~ hh:mm:ss"
                                    );
                                }}
                                header="Tanggal"
                                filter
                                sortable
                                filterElement={dateFilter}
                                filterPlaceholder="Tanggal"
                                style={{ minWidth: "15rem" }}
                                headerStyle={{ width: "15rem" }}
                            />
                            <Column
                                hidden={auth.user.role === "pasien"}
                                headerClassName="fw-bold"
                                body={(rowData) => {
                                    return (
                                        <Link
                                            href={route(
                                                "pasien.show",
                                                rowData.id
                                            )}
                                        >
                                            {rowData.pasien.no_rm}
                                        </Link>
                                    );
                                }}
                                field="pasien.no_rm"
                                header="No RM"
                                filter
                                sortable
                                filterPlaceholder="Nama pasien"
                                style={{ minWidth: "9rem" }}
                                headerStyle={{ width: "9rem" }}
                            />
                            <Column
                                hidden={auth.user.role === "pasien"}
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
                    <label htmlFor="pasien" className="font-bold">
                        Tanggal Masuk
                    </label>
                    <InputText
                        id="tgl_masuk"
                        required
                        autoFocus
                        type="date"
                        value={medis.tgl_masuk}
                        onChange={(e) => onInputChange(e, "tgl_masuk")}
                        placeholder="Masukkan Tanggal Masuk"
                    />
                    {errors.tgl_masuk && (
                        <small className="p-error">{errors.tgl_masuk}</small>
                    )}
                </div>
                <div className="field">
                    <label htmlFor="tgl_keluar" className="font-bold">
                        Tanggal Keluar
                    </label>
                    <InputText
                        id="tgl_keluar"
                        required
                        type="date"
                        autoFocus
                        value={medis.tgl_keluar}
                        onChange={(e) => onInputChange(e, "tgl_keluar")}
                        placeholder="Masukkan Tanggal Keluar"
                    />
                    {errors.tgl_keluar && (
                        <small className="p-error">{errors.tgl_keluar}</small>
                    )}
                </div>
                <div className="field">
                    <label htmlFor="diagnosa" className="font-bold">
                        Diagnosa
                    </label>
                    <Dropdown
                        showClear
                        filter
                        filterBy="diagnosa"
                        value={selectedDiagnosa}
                        options={diagnosas}
                        onChange={onDiagnosaChange}
                        optionLabel="nama"
                        placeholder="Select a Diagnosa"
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

                <div className="field">
                    <label htmlFor="keluhan" className="font-bold">
                        Obat
                    </label>
                    <MultiSelect
                        value={selectedObats}
                        options={obats}
                        onChange={(e) => onObatChange(e.value)}
                        optionLabel="name"
                        placeholder="Pilih Obat"
                        display="chip"
                        filter
                        showClear
                    />
                </div>
                <div className="field">
                    <label htmlFor="keadaan_keluar" className="font-bold">
                        Keadaan Keluar
                    </label>
                    <div className="flex flex-wrap gap-3">
                        <div className="flex align-items-center">
                            <RadioButton
                                inputId="Sembuh"
                                name="keadaan_keluar"
                                value="Sembuh"
                                onChange={(e) =>
                                    onInputChange(e, "keadaan_keluar")
                                }
                                checked={medis.keadaan_keluar === "Sembuh"}
                            />
                            <label htmlFor="Sembuh" className="ml-2">
                                Sembuh
                            </label>
                        </div>
                        <div className="flex align-items-center">
                            <RadioButton
                                inputId="Membaik"
                                name="keadaan_keluar"
                                value="Membaik"
                                onChange={(e) =>
                                    onInputChange(e, "keadaan_keluar")
                                }
                                checked={medis.keadaan_keluar === "Membaik"}
                            />
                            <label htmlFor="Membaik" className="ml-2">
                                Membaik
                            </label>
                        </div>
                        <div className="flex align-items-center">
                            <RadioButton
                                inputId="Belum Sembuh"
                                name="keadaan_keluar"
                                value="Belum Sembuh"
                                onChange={(e) =>
                                    onInputChange(e, "keadaan_keluar")
                                }
                                checked={
                                    medis.keadaan_keluar === "Belum Sembuh"
                                }
                            />
                            <label htmlFor="Belum Sembuh" className="ml-2">
                                Belum Sembuh
                            </label>
                        </div>
                        <div className="flex align-items-center">
                            <RadioButton
                                inputId="Mati < 48 Jam"
                                name="keadaan_keluar"
                                value="Mati < 48 Jam"
                                onChange={(e) =>
                                    onInputChange(e, "keadaan_keluar")
                                }
                                checked={
                                    medis.keadaan_keluar === "Mati < 48 Jam"
                                }
                            />
                            <label htmlFor="Mati < 48 Jam" className="ml-2">
                                Mati {"<"} 48 Jam
                            </label>
                        </div>
                        <div className="flex align-items-center">
                            <RadioButton
                                inputId="Mati > 48 Jam"
                                name="keadaan_keluar"
                                value="Mati > 48 Jam"
                                onChange={(e) =>
                                    onInputChange(e, "keadaan_keluar")
                                }
                                checked={
                                    medis.keadaan_keluar === "Mati > 48 Jam"
                                }
                            />
                            <label htmlFor="Mati > 48 Jam" className="ml-2">
                                Mati {">"} 48 Jam
                            </label>
                        </div>
                    </div>
                </div>
                <div className="field">
                    <label htmlFor="cara_keluar" className="font-bold">
                        Cara Keluar
                    </label>
                    <div className="flex flex-wrap gap-3">
                        <div className="flex align-items-center">
                            <RadioButton
                                inputId="Diijinkan Pulang"
                                name="cara_keluar"
                                value="Diijinkan Pulang"
                                onChange={(e) =>
                                    onInputChange(e, "cara_keluar")
                                }
                                checked={
                                    medis.cara_keluar === "Diijinkan Pulang"
                                }
                            />
                            <label htmlFor="Diijinkan Pulang" className="ml-2">
                                Diijinkan Pulang
                            </label>
                        </div>
                        <div className="flex align-items-center">
                            <RadioButton
                                inputId="Pulang Paksa"
                                name="cara_keluar"
                                value="Pulang Paksa"
                                onChange={(e) =>
                                    onInputChange(e, "cara_keluar")
                                }
                                checked={medis.cara_keluar === "Pulang Paksa"}
                            />
                            <label htmlFor="Pulang Paksa" className="ml-2">
                                Pulang Paksa
                            </label>
                        </div>
                        <div className="flex align-items-center">
                            <RadioButton
                                inputId="Dirujuk"
                                name="cara_keluar"
                                value="Dirujuk"
                                onChange={(e) =>
                                    onInputChange(e, "cara_keluar")
                                }
                                checked={medis.cara_keluar === "Dirujuk"}
                            />
                            <label htmlFor="Dirujuk" className="ml-2">
                                Dirujuk
                            </label>
                        </div>
                        <div className="flex align-items-center">
                            <RadioButton
                                inputId="Lari"
                                name="cara_keluar"
                                value="Lari"
                                onChange={(e) =>
                                    onInputChange(e, "cara_keluar")
                                }
                                checked={medis.cara_keluar === "Lari"}
                            />
                            <label htmlFor="Lari" className="ml-2">
                                Lari
                            </label>
                        </div>
                        <div className="flex align-items-center">
                            <RadioButton
                                inputId="Pindah RS"
                                name="cara_keluar"
                                value="Pindah RS"
                                onChange={(e) =>
                                    onInputChange(e, "cara_keluar")
                                }
                                checked={medis.cara_keluar === "Pindah RS"}
                            />
                            <label htmlFor="Pindah RS" className="ml-2">
                                Pindah RS
                            </label>
                        </div>
                    </div>
                </div>
            </Dialog>

            <Dialog
                visible={dialogTambah}
                style={{ width: "75vw" }}
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
                    {errors.pasien_id && (
                        <small className="p-error">{errors.pasien_id}</small>
                    )}
                </div>
                <div className="field">
                    <label htmlFor="pasien" className="font-bold">
                        Tanggal Masuk
                    </label>
                    <InputText
                        id="tgl_masuk"
                        required
                        autoFocus
                        type="date"
                        value={medis.tgl_masuk}
                        onChange={(e) => onInputChange(e, "tgl_masuk")}
                        placeholder="Masukkan Tanggal Masuk"
                    />
                    {errors.tgl_masuk && (
                        <small className="p-error">{errors.tgl_masuk}</small>
                    )}
                </div>
                <div className="field">
                    <label htmlFor="tgl_keluar" className="font-bold">
                        Tanggal Keluar
                    </label>
                    <InputText
                        id="tgl_keluar"
                        required
                        type="date"
                        autoFocus
                        value={medis.tgl_keluar}
                        onChange={(e) => onInputChange(e, "tgl_keluar")}
                        placeholder="Masukkan Tanggal Keluar"
                    />
                    {errors.tgl_keluar && (
                        <small className="p-error">{errors.tgl_keluar}</small>
                    )}
                </div>
                <div className="field">
                    <label htmlFor="diagnosa" className="font-bold">
                        Diagnosa
                    </label>
                    <Dropdown
                        showClear
                        filter
                        filterBy="diagnosa"
                        value={selectedDiagnosa}
                        options={diagnosas}
                        onChange={onDiagnosaChange}
                        optionLabel="nama"
                        placeholder="Select a Diagnosa"
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

                <div className="field">
                    <label htmlFor="obat" className="font-bold">
                        Obat
                    </label>
                    <MultiSelect
                        value={selectedObats}
                        options={obats}
                        onChange={(e) => onObatChange(e.value)}
                        optionLabel="name"
                        placeholder="Pilih Obat"
                        display="chip"
                        filter
                        showClear
                    />
                    {errors.obats && (
                        <small className="p-error">{errors.obats}</small>
                    )}
                </div>
                <div className="field">
                    <label htmlFor="keadaan_keluar" className="font-bold">
                        Keadaan Keluar
                    </label>
                    <div className="flex flex-wrap gap-3">
                        <div className="flex align-items-center">
                            <RadioButton
                                inputId="Sembuh"
                                name="keadaan_keluar"
                                value="Sembuh"
                                onChange={(e) =>
                                    onInputChange(e, "keadaan_keluar")
                                }
                                checked={medis.keadaan_keluar === "Sembuh"}
                            />
                            <label htmlFor="Sembuh" className="ml-2">
                                Sembuh
                            </label>
                        </div>
                        <div className="flex align-items-center">
                            <RadioButton
                                inputId="Membaik"
                                name="keadaan_keluar"
                                value="Membaik"
                                onChange={(e) =>
                                    onInputChange(e, "keadaan_keluar")
                                }
                                checked={medis.keadaan_keluar === "Membaik"}
                            />
                            <label htmlFor="Membaik" className="ml-2">
                                Membaik
                            </label>
                        </div>
                        <div className="flex align-items-center">
                            <RadioButton
                                inputId="Belum Sembuh"
                                name="keadaan_keluar"
                                value="Belum Sembuh"
                                onChange={(e) =>
                                    onInputChange(e, "keadaan_keluar")
                                }
                                checked={
                                    medis.keadaan_keluar === "Belum Sembuh"
                                }
                            />
                            <label htmlFor="Belum Sembuh" className="ml-2">
                                Belum Sembuh
                            </label>
                        </div>
                        <div className="flex align-items-center">
                            <RadioButton
                                inputId="Mati < 48 Jam"
                                name="keadaan_keluar"
                                value="Mati < 48 Jam"
                                onChange={(e) =>
                                    onInputChange(e, "keadaan_keluar")
                                }
                                checked={
                                    medis.keadaan_keluar === "Mati < 48 Jam"
                                }
                            />
                            <label htmlFor="Mati < 48 Jam" className="ml-2">
                                Mati {"<"} 48 Jam
                            </label>
                        </div>
                        <div className="flex align-items-center">
                            <RadioButton
                                inputId="Mati > 48 Jam"
                                name="keadaan_keluar"
                                value="Mati > 48 Jam"
                                onChange={(e) =>
                                    onInputChange(e, "keadaan_keluar")
                                }
                                checked={
                                    medis.keadaan_keluar === "Mati > 48 Jam"
                                }
                            />
                            <label htmlFor="Mati > 48 Jam" className="ml-2">
                                Mati {">"} 48 Jam
                            </label>
                        </div>
                    </div>
                    {errors.keadaan_keluar && (
                        <small className="p-error">
                            {errors.keadaan_keluar}
                        </small>
                    )}
                </div>
                <div className="field">
                    <label htmlFor="cara_keluar" className="font-bold">
                        Cara Keluar
                    </label>
                    <div className="flex flex-wrap gap-3">
                        <div className="flex align-items-center">
                            <RadioButton
                                inputId="Diijinkan Pulang"
                                name="cara_keluar"
                                value="Diijinkan Pulang"
                                onChange={(e) =>
                                    onInputChange(e, "cara_keluar")
                                }
                                checked={
                                    medis.cara_keluar === "Diijinkan Pulang"
                                }
                            />
                            <label htmlFor="Diijinkan Pulang" className="ml-2">
                                Diijinkan Pulang
                            </label>
                        </div>
                        <div className="flex align-items-center">
                            <RadioButton
                                inputId="Pulang Paksa"
                                name="cara_keluar"
                                value="Pulang Paksa"
                                onChange={(e) =>
                                    onInputChange(e, "cara_keluar")
                                }
                                checked={medis.cara_keluar === "Pulang Paksa"}
                            />
                            <label htmlFor="Pulang Paksa" className="ml-2">
                                Pulang Paksa
                            </label>
                        </div>
                        <div className="flex align-items-center">
                            <RadioButton
                                inputId="Dirujuk"
                                name="cara_keluar"
                                value="Dirujuk"
                                onChange={(e) =>
                                    onInputChange(e, "cara_keluar")
                                }
                                checked={medis.cara_keluar === "Dirujuk"}
                            />
                            <label htmlFor="Dirujuk" className="ml-2">
                                Dirujuk
                            </label>
                        </div>
                        <div className="flex align-items-center">
                            <RadioButton
                                inputId="Lari"
                                name="cara_keluar"
                                value="Lari"
                                onChange={(e) =>
                                    onInputChange(e, "cara_keluar")
                                }
                                checked={medis.cara_keluar === "Lari"}
                            />
                            <label htmlFor="Lari" className="ml-2">
                                Lari
                            </label>
                        </div>
                        <div className="flex align-items-center">
                            <RadioButton
                                inputId="Pindah RS"
                                name="cara_keluar"
                                value="Pindah RS"
                                onChange={(e) =>
                                    onInputChange(e, "cara_keluar")
                                }
                                checked={medis.cara_keluar === "Pindah RS"}
                            />
                            <label htmlFor="Pindah RS" className="ml-2">
                                Pindah RS
                            </label>
                        </div>
                    </div>
                    {errors.cara_keluar && (
                        <small className="p-error">{errors.cara_keluar}</small>
                    )}
                </div>
            </Dialog>
        </Layout>
    );
}
