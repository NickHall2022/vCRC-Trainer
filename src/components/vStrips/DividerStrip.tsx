import type { DividerData } from "../../types/common";

type Props = {
    stripData: DividerData,
}

export function DividerStrip({stripData}: Props){

    const style: React.CSSProperties = {
        backgroundImage: `url(${stripData.name}.png)`,
        width: "550px",
        height: "76px"
    }

    return (
        <div style={style} draggable={true}>
        </div>
    )
}
