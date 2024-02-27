import { boxType } from "@/type/card";
import ImageIcon from "./svg/Image";
import TextIcon from "./svg/Text";
import CodeIcon from "./svg/Code";
import NoteIcon from "./svg/Note";
import { ReactNode } from "react";

interface IButton {
    handleDrag: (type: boxType) => void;
    children: ReactNode;
    type: boxType;
}

function Button({ handleDrag, children, type }: IButton) {
    return (
        <button className="p-1 w-10 h-10 bg-transparent border border-slate-400 rounded-md hover:scale-105 duration-200"
            onMouseDown={() => {
                handleDrag(type);
            }}
        >
            {children}
        </button>
    )
}

interface IControlPanel {
    handleDrag: (type: boxType) => void;
}

export default function ControlPanel({ handleDrag }: IControlPanel) {
    return (
        <>
            <main className="absolute left-5 top-8 grid grid-cols-1 grid-rows-4 gap-1.5 p-3 shadow-md shadow-black/40 rounded-lg">
                <Button handleDrag={handleDrag} type="text">
                    <TextIcon classProps="fill-slate-700" />
                </Button>
                <Button handleDrag={handleDrag} type="image">
                    <ImageIcon classProps="stroke-slate-700" />
                </Button>
                <Button handleDrag={handleDrag} type="code">
                    <CodeIcon classProps="stroke-slate-700" />
                </Button>
                <Button handleDrag={handleDrag} type="markdown">
                    <NoteIcon classProps="stroke-slate-700" />
                </Button>
            </main>
        </>
    )
}