import React, { useContext } from "react";
import AppMenuitem from "./AppMenuitem";
import { LayoutContext } from "./context/layoutcontext";
import { MenuProvider } from "./context/menucontext";
import { Link } from "@inertiajs/react";
import { usePage } from "@inertiajs/react";

const AppMenu = () => {
    const { layoutConfig } = useContext(LayoutContext);
    const { auth } = usePage().props;
    console.log(auth.user);
    const modelAdmin = [
        {
            label: "DASHBOARD",
            items: [
                {
                    label: "Dashboard",
                    icon: "pi pi-fw pi-home",
                    to: route("dashboard"),
                },
                {
                    label: "Rekam Medis",
                    icon: "pi pi-fw pi-search",
                    to: route("rekammedis.index"),
                },
            ],
        },
        {
            label: "Master Data",
            items: [
                {
                    label: "Obat",
                    icon: "pi pi-fw pi-box",
                    items: [
                        {
                            label: "Satuan",
                            to: route("satuan.index"),
                        },
                        {
                            label: "Kategori",
                            to: route("category.index"),
                        },
                        {
                            label: "Data Obat",
                            to: route("obat.index"),
                        },
                    ],
                },
                {
                    label: "Dokter",
                    icon: "pi pi-fw pi-users",
                    to: route("dokter.index"),
                },
                {
                    label: "Pasien",
                    icon: "pi pi-fw pi-users",
                    to: route("pasien.index"),
                },
            ],
        },
    ];
    const modelDokter = [
        {
            label: "Menu",
            items: [
                {
                    label: "Rekam Medis",
                    icon: "pi pi-fw pi-search",
                    to: route("rekammedis.index"),
                },
            ],
        },
    ];
    return (
        <MenuProvider>
            <ul className="layout-menu">
                {auth.user.role == "admin" &&
                    modelAdmin.map((item, i) => {
                        return !item?.seperator ? (
                            <AppMenuitem
                                item={item}
                                root={true}
                                index={i}
                                key={item.label}
                            />
                        ) : (
                            <li className="menu-separator"></li>
                        );
                    })}
                {auth.user.role == "pasien" &&
                    modelDokter.map((item, i) => {
                        return !item?.seperator ? (
                            <AppMenuitem
                                item={item}
                                root={true}
                                index={i}
                                key={item.label}
                            />
                        ) : (
                            <li className="menu-separator"></li>
                        );
                    })}
                {auth.user.role == "dokter" &&
                    modelDokter.map((item, i) => {
                        return !item?.seperator ? (
                            <AppMenuitem
                                item={item}
                                root={true}
                                index={i}
                                key={item.label}
                            />
                        ) : (
                            <li className="menu-separator"></li>
                        );
                    })}
            </ul>
        </MenuProvider>
    );
};

export default AppMenu;
