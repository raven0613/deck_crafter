"use client"
import { IBoardElement } from "@/type/card";
import React, { useEffect, useRef, useState, DragEvent, ReactNode } from "react";
import Box from "./Box";
import Image from "next/image";
import { v4 as uuidv4 } from 'uuid';
import { ImageLoading } from "../ImageLoading";
import UrlLoading from "../UrlLoading";

interface IImageCore {
    imageData: IBoardElement;
    handleOnLoad: (data: IBoardElement) => void;
}

export function ImageCore({ imageData, handleOnLoad }: IImageCore) {
    console.log("imageData", imageData)
    // console.log("isSelected", isSelected)
    const [url, setUrl] = useState(imageData.content);
    const [showingBlock, setShowingBlock] = useState<"image" | "input" | "none">("none");
    const [imageLoadState, setImageLoadState] = useState<"fail" | "success" | "loading" | "url-loading" | "none">("loading")
    const inputValueRef = useRef<string>("");

    // console.log("url", url)
    console.log("imageSentState", imageLoadState)
    console.log("showingBlock", showingBlock)
    useEffect(() => {
        if (imageData.content === "dragging_image" || imageData.content === "image") {
            setShowingBlock("input");
            setImageLoadState("none")
        }
        if (!imageData.name || !imageData.content) return;
        // console.log("有內容了")
        setShowingBlock("image");
        setUrl(imageData.content);
    }, [imageData])


    return (
        <>
            {(imageLoadState === "loading") && <ImageLoading />}
            {(imageLoadState === "url-loading") && <div className="absolute -bottom-6 left-0 w-full border">
                <UrlLoading isCompleted={imageData.name !== ""} />
            </div>}


            {showingBlock === "image" && <Image id={imageData.id}
                className={`boardElement imagebox ${(imageLoadState === "success") ? "opacity-100" : "opacity-0"}`}
                width={imageData.width}
                height={imageData.height}
                src={url}
                alt={imageData.name}
                style={{
                    objectFit: 'cover', // cover, contain, none
                }}
                onLoad={(e) => {
                    console.log("onLoad")
                    setShowingBlock("image");
                    setImageLoadState("success");
                    const name = uuidv4();
                    if (imageData.name) {
                        handleOnLoad({ ...imageData, content: url, width: imageData.width, height: imageData.height, name: imageData.name });
                    }
                    else {
                        // 沒有名字代表是直接貼上網址
                        handleOnLoad({ ...imageData, content: url, width: e.currentTarget.naturalWidth, height: e.currentTarget.naturalHeight, name });
                    }
                }}
                onError={() => {
                    setShowingBlock("input");
                    setImageLoadState("fail");
                }}
            />}
            {(imageLoadState !== "success" && showingBlock === "input") && <>
                <input id={imageData.id}
                    className={`boardElement imagebox outline-none border px-2 absolute inset-y-0 left-0 right-16 ${imageLoadState === "fail" ? "border border-red-500" : ""}
        `}
                    onChange={(e) => {
                        e.preventDefault();
                        e.stopPropagation();
                        inputValueRef.current = e.currentTarget.value;
                    }}
                    placeholder="請輸入圖片網址"
                    onFocus={() => {
                        setImageLoadState("none");
                    }}
                />
                <button
                    className={`boardElement imagebox w-7 h-7 bg-green-500 absolute right-6 top-1/2 -translate-y-1/2 rounded-full leading-5 text-white
        `}
                    onClick={(e) => {
                        e.preventDefault();
                        e.stopPropagation();
                        console.log("OKOK")
                        if (!getUrlIsValid(inputValueRef.current)) {
                            setImageLoadState("fail")
                            return;
                        }
                        setImageLoadState("url-loading");
                        setShowingBlock("image");
                        setUrl(inputValueRef.current);
                    }}
                >
                    {imageLoadState === "url-loading" ? "o" : "v"}
                </button>
            </>}
        </>
    )
}

function getUrlIsValid(url: string) {
    if (url === "http://" || url === "https://") return false;
    if (!url.includes("http://") && !url.includes("https://")) return false;
    return true;
}

interface IImageBox {
    imageData: IBoardElement;
    handleUpdateElement: (data: IBoardElement) => void;
    isSelected: boolean;
    handleClick: (id: string) => void;
    isShadow?: boolean;
    isLocked: boolean;
    handleDelete: (id: string) => void;
    handleSetDirty: () => void;
    handleChangeZIndex: (id: string) => void;
}

export default function ImageBox({ imageData, handleUpdateElement, handleClick, isShadow, isLocked, handleDelete, handleSetDirty, handleChangeZIndex, isSelected }: IImageBox) {
    // console.log("imageData", imageData)
    return (
        <Box
            handleMove={() => { }}
            isLocked={isLocked}
            isShadowElement={isShadow}
            handleUpdate={handleUpdateElement}
            data={imageData}
            isSelected={isSelected}
            handleClick={handleClick}
            handleDelete={handleDelete}
            handleSetDirty={handleSetDirty}
            handleChangeZIndex={handleChangeZIndex}
            isImage={true}
        >
            <ImageCore imageData={imageData} handleOnLoad={(card) => {
                handleUpdateElement(card);
            }} />
        </Box>
    )
}