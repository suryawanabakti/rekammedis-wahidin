import React, { useContext } from "react";
import AppMenuitem from "./AppMenuitem";
import { LayoutContext } from "./context/layoutcontext";
import { MenuProvider } from "./context/menucontext";
import { Link } from "@inertiajs/react";

const AppMenu = () => {
    const { layoutConfig } = useContext(LayoutContext);

    const model = [
        {
            label: "Menu",
            items: [
                {
                    label: "Dashboard",
                    icon: "pi pi-fw pi-home",
                    to: route("dashboard"),
                },
                {
                    label: "Master Data",
                    icon: "pi pi-fw pi-database",
                    items: [
                        {
                            label: "Obat",
                            icon: "pi pi-fw pi-box",
                            to: route("obat.index"),
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
                {model.map((item, i) => {
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
