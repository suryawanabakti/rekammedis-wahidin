import { Button } from "primereact/button";

export default function PrimaryButton({
    className = "",
    disabled,
    children,
    ...props
}) {
    return (
        <Button
            {...props}
            className={` ${disabled && "opacity-25"} ` + className}
            disabled={disabled}
        >
            {children}
        </Button>
    );
}
