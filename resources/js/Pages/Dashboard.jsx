import { Button } from "primereact/button";
import { Chart } from "primereact/chart";
import { Menu } from "primereact/menu";
import React, { useContext, useEffect, useRef, useState } from "react";
import { LayoutContext } from "@/Layouts/layout/context/layoutcontext";
import Layout from "@/Layouts/layout/layout.jsx";
import DashboardInfoCard from "@/Components/DashboardInfoCard.jsx";

const lineData = {
    labels: ["January", "February", "March", "April", "May", "June", "July"],
    datasets: [
        {
            label: "First Dataset",
            data: [65, 59, 80, 81, 56, 55, 40],
            fill: false,
            backgroundColor: "#2f4860",
            borderColor: "#2f4860",
            tension: 0.4,
        },
        {
            label: "Second Dataset",
            data: [28, 48, 40, 19, 86, 27, 90],
            fill: false,
            backgroundColor: "#00bb7e",
            borderColor: "#00bb7e",
            tension: 0.4,
        },
    ],
};

const Dashboard = ({ countPasien, countDokter, countObat, countDiagnosa }) => {
    const [lineOptions, setLineOptions] = useState({});
    const { layoutConfig } = useContext(LayoutContext);

    return (
        <Layout>
            <div className="grid">
                <DashboardInfoCard
                    title="Pasien"
                    value={countPasien}
                    icon="users"
                    iconColor="teal"
                    descriptionValue={`${countPasien} new`}
                    descriptionText="since last visit"
                ></DashboardInfoCard>
                <DashboardInfoCard
                    title="Dokter"
                    value={countDokter}
                    icon="users"
                    iconColor="teal"
                    descriptionValue={`${countDokter} new`}
                    descriptionText="since last visit"
                ></DashboardInfoCard>
                <DashboardInfoCard
                    title="Obat"
                    value={countObat}
                    icon="box"
                    iconColor="teal"
                    descriptionValue={`${countObat} new`}
                    descriptionText="since last visit"
                ></DashboardInfoCard>
                <DashboardInfoCard
                    title="Diagnosa"
                    value={countDiagnosa}
                    icon="search"
                    iconColor="teal"
                    descriptionValue={`${countDiagnosa} new`}
                    descriptionText="since last visit"
                ></DashboardInfoCard>
            </div>
        </Layout>
    );
};

export default Dashboard;
