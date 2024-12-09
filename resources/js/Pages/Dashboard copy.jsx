import React, { useContext, useEffect, useRef, useState } from "react";
import { LayoutContext } from "@/Layouts/layout/context/layoutcontext";
import Layout from "@/Layouts/layout/layout.jsx";
import DashboardInfoCard from "@/Components/DashboardInfoCard.jsx";

const Dashboard = ({
    auth,
    countPasien,
    countDokter,
    countObat,
    countDiagnosa,
}) => {
    const [lineOptions, setLineOptions] = useState({});
    const { layoutConfig } = useContext(LayoutContext);

    return (
        <Layout>
            {auth.user.role == "admin" && (
                <div className="grid">
                    <DashboardInfoCard
                        title="Pasien"
                        value={countPasien}
                        icon="users"
                        iconColor="teal"
                        descriptionValue={`${countPasien} new`}
                        descriptionText="since last create"
                    ></DashboardInfoCard>
                    <DashboardInfoCard
                        title="Dokter"
                        value={countDokter}
                        icon="users"
                        iconColor="teal"
                        descriptionValue={`${countDokter} new`}
                        descriptionText="since last create"
                    ></DashboardInfoCard>
                    <DashboardInfoCard
                        title="Obat"
                        value={countObat}
                        icon="box"
                        iconColor="teal"
                        descriptionValue={`${countObat} new`}
                        descriptionText="since last create"
                    ></DashboardInfoCard>
                    <DashboardInfoCard
                        title="Diagnosa"
                        value={countDiagnosa}
                        icon="search"
                        iconColor="teal"
                        descriptionValue={`${countDiagnosa} new`}
                        descriptionText="since last create"
                    ></DashboardInfoCard>
                </div>
            )}
        </Layout>
    );
};

export default Dashboard;
