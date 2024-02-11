"use client"
import { IBoardElement } from "@/type/card";
import React, { useEffect, useRef, useState, DragEvent } from "react";
import Box from "./Box";
import Image from "next/image";

function getUrlIsValid(url: string) {
    if (url === "http://" || url === "https://") return false;
    if (!url.includes("http://") && !url.includes("https://")) return false;
    return true;
}

interface IImageBox {
    data: IBoardElement;
    handleUpdateElement: (data: IBoardElement) => void;
    isSelected: boolean;
    handleClick: (id: string) => void;
    isShadow?: boolean;
    handleShadowDragEnd?: (e: DragEvent) => void;
    isLock: boolean;
    handleDelete: (id: string) => void;
}

export default function ImageBox({ data, handleUpdateElement, isSelected, handleClick, isShadow, handleShadowDragEnd, isLock, handleDelete }: IImageBox) {
    // console.log(textData)
    // console.log("isSelected", isSelected)
    const [url, setUrl] = useState(data.content);
    const [showingBlock, setShowingBlock] = useState<"image" | "input">("input");
    const [imageLoadState, setImageLoadState] = useState<"fail" | "success" | "loading" | "none">("none")
    const inputValueRef = useRef<string>("");

    console.log("imageSentState", imageLoadState)
    useEffect(() => {
        if (!getUrlIsValid(data.content)) return;
        setShowingBlock("image");
    }, [data])

    return (
        <Box
            isLock={isLock}
            isShadowElement={isShadow}
            handleUpdate={handleUpdateElement}
            data={data}
            isSelected={isSelected}
            handleClick={handleClick}
            handleShadowDragEnd={handleShadowDragEnd}
            handleDelete={handleDelete}
        >
            {(data.name && imageLoadState !== "success") && <div id={data.id} className="imagebox absolute inset-0 bg-slate-400 z-20"></div>}
            {showingBlock === "image" && <Image id={data.id}
                className={`imagebox ${imageLoadState === "success" ? "opacity-100" : "opacity-0"}`} width={data.width} height={data.height} src={url} alt={data.name}
                style={{
                    objectFit: 'fill', // cover, contain, none
                }}
                onLoad={() => {
                    console.log("onLoad")
                    setShowingBlock("image");
                    handleUpdateElement({ ...data, content: url, width: 300, height: 300 });
                    setImageLoadState("success");
                }}
                onError={() => {
                    setShowingBlock("input");
                    setImageLoadState("fail");
                }}
            />}
            {imageLoadState !== "success" && <>
                <input id={data.id}
                    className={`imagebox outline-none border px-2 absolute inset-y-0 left-0 right-16 ${imageLoadState === "fail" ? "border border-red-500" : ""}
                    `}
                    onChange={(e) => {
                        inputValueRef.current = e.currentTarget.value;
                    }}
                    placeholder="請輸入圖片網址"
                    onFocus={() => {
                        setImageLoadState("none");
                    }}
                />
                <button
                    className={`imagebox w-7 h-7 bg-green-500 absolute right-6 top-1/2 -translate-y-1/2 rounded-full leading-5 text-white
                    `}
                    onClick={(e) => {
                        e.preventDefault();
                        e.stopPropagation();
                        if (!getUrlIsValid(inputValueRef.current)) {
                            setImageLoadState("fail")
                            return;
                        }
                        setImageLoadState("loading")
                        setShowingBlock("image");
                        setUrl(inputValueRef.current);
                    }}
                >
                    {imageLoadState === "loading" ? "o" : "v"}
                </button>
            </>}
        </Box>
    )
}