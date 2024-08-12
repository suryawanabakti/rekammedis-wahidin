import { PrimeReactContext } from "primereact/api";
import { Button } from "primereact/button";
import { InputSwitch } from "primereact/inputswitch";
import { RadioButton } from "primereact/radiobutton";
import { Sidebar } from "primereact/sidebar";
import { classNames } from "primereact/utils";
import React, { useContext, useEffect, useState } from "react";
import { LayoutContext } from "./context/layoutcontext";
import AppConfigButton from "@/Components/AppConfigButton.jsx";

const AppConfig = (props) => {
    const [scales] = useState([12, 13, 14, 15, 16]);
    const { layoutConfig, setLayoutConfig, layoutState, setLayoutState } =
        useContext(LayoutContext);
    const { setRipple, changeTheme } = useContext(PrimeReactContext);

    const onConfigButtonClick = () => {
        setLayoutState((prevState) => ({
            ...prevState,
            configSidebarVisible: true,
        }));
    };

    const onConfigSidebarHide = () => {
        setLayoutState((prevState) => ({
            ...prevState,
            configSidebarVisible: false,
        }));
    };

    const changeInputStyle = (e) => {
        setLayoutConfig((prevState) => ({ ...prevState, inputStyle: e.value }));
    };

    const changeRipple = (e) => {
        setRipple(e.value);
        setLayoutConfig((prevState) => ({ ...prevState, ripple: e.value }));
    };

    const changeMenuMode = (e) => {
        setLayoutConfig((prevState) => ({ ...prevState, menuMode: e.value }));
    };

    const _changeTheme = (theme, colorScheme) => {
        changeTheme?.(layoutConfig.theme, theme, "theme-css", () => {
            setLayoutConfig((prevState) => ({
                ...prevState,
                theme,
                colorScheme,
            }));
        });
    };

    const decrementScale = () => {
        setLayoutConfig((prevState) => ({
            ...prevState,
            scale: prevState.scale - 1,
        }));
    };

    const incrementScale = () => {
        setLayoutConfig((prevState) => ({
            ...prevState,
            scale: prevState.scale + 1,
        }));
    };

    const applyScale = () => {
        document.documentElement.style.fontSize = layoutConfig.scale + "px";
    };

    useEffect(() => {
        applyScale();
    }, [layoutConfig.scale]);

    return <></>;
};

export default AppConfig;
