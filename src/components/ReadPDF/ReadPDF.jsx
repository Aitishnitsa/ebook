import { useState } from "react";
import { PdfViewer } from "./PdfViewer";
import { DrawingLayer } from "./DrawingLayer";
import { BookIcon } from "../Icons/BookIcon";
import { BrushIcon } from "../Icons/BrushIcon";
import { EraserIcon } from "../Icons/EraserIcon";
import { SoundIcon } from "../Icons/SoundIcon";
import { MicroIcon } from "../Icons/MicroIcon";
import { ColorIcon } from "../Icons/ColorIcon";

export const ReadPDF = () => {
    const [file, setFile] = useState(null);
    const [fileData, setFileData] = useState(null);
    const [isDrawingEnabled, setIsDrawingEnabled] = useState(false);
    const [isErasing, setIsErasing] = useState(false);
    const [color, setColor] = useState("#000000");
    const [brushSize, setBrushSize] = useState(5);
    const [isSharedMode, setIsSharedMode] = useState(false);
    const [isTextToSpeechEnabled, setIsTextToSpeechEnabled] = useState(false);
    const [isVoiceTrackingEnabled, setIsVoiceTrackingEnabled] = useState(false); // Голосове читання користувача

    const handleFileChange = (e) => {
        const selectedFile = e.target.files[0];
        setFile(selectedFile);

        if (selectedFile) {
            const reader = new FileReader();
            reader.readAsText(selectedFile);
            reader.onload = () => {
                setFileData(reader.result);
            };
        }
    };

    return (
        <div className="relative w-full h-[92vh] flex flex-row justify-between p-4">
            {/* Панель інструментів */}
            <div className="flex flex-row items-center justify-between mb-4">
                <input
                    type="file"
                    // accept="*/*" // "application/pdf"
                    // "application/pdf"
                    onChange={handleFileChange}
                    className="hidden"
                />
                <div className="sticky left-0 top-15 h-fit w-20 flex flex-col items-center py-8 z-50 space-y-6">
                    {/* File Upload */}
                    <label htmlFor="file-upload" className="cursor-pointer flex flex-col items-center">
                        <div className="rounded-full hover:bg-red-200 transition p-2 bg-white">
                        <BookIcon className={"w-7 h-7 fill-black"}/>
                        </div>
                        <input
                            id="file-upload"
                            type="file"
                            accept="text/plain"
                            onChange={handleFileChange}
                            className="hidden"
                        />
                    {!file && <p className="absolute left-20 w-96">Поки що імпортуй .txt файл :)</p>}
                    </label>
                    {/* Drawing Toggle */}
                    <button
                        onClick={() => setIsDrawingEnabled((prev) => !prev)}
                        className={`cursor-pointer p-2 rounded-full hover:bg-blue-200 transition ${isDrawingEnabled ? "bg-blue-500 text-white" : "bg-white text-blue-500"}`}
                        title="Toggle Drawing"
                    >
                        <BrushIcon className={`w-7 h-7 ${isDrawingEnabled ? "fill-white" : "fill-blue-500"}`} />
                    </button>
                    {/* Eraser Toggle */}
                    <button
                        onClick={() => setIsErasing((prev) => !prev)}
                        className={`cursor-pointer p-2 rounded-full hover:bg-blue-200 transition ${isErasing ? "bg-blue-500 text-white" : "bg-white text-blue-500"}`}
                        title="Toggle Eraser"
                    >
                        <EraserIcon className={`w-7 h-7 ${isErasing ? "stroke-white" : "stroke-blue-500"}`} />
                    </button>
                    {/* Color Picker */}
                    <label className="cursor-pointer flex flex-col items-center">
                        <ColorIcon className={`w-7 h-7`} color={ color} />
                        <input
                            type="color"
                            value={color}
                            onChange={(e) => setColor(e.target.value)}
                            disabled={isErasing}
                            className="opacity-0 w-0 h-0"
                            tabIndex={-1}
                        />
                    </label>
                    {/* Brush Size Slider */}
                    <div className="flex flex-col items-center w-full px-2">
                        <svg width="28" height="28" fill="none" stroke={color} strokeWidth="2" viewBox="0 0 28 28">
                            <circle cx="14" cy="14" r={brushSize / 2} fill={color} />
                        </svg>
                        <input
                            type="range"
                            min="1"
                            max="24"
                            value={brushSize}
                            onChange={(e) => setBrushSize(Number(e.target.value))}
                            className="cursor-pointer h-24 w-4 mt-2 accent-blue-500 [writing-mode:vertical-lr] [direction:rtl]"
                            orient="vertical"
                        />
                    </div>
                    {/* Shared Mode */}
                    <button
                        onClick={() => setIsSharedMode((prev) => !prev)}
                        className={`cursor-pointer p-2 rounded-full hover:bg-green-200 transition ${isSharedMode ? "bg-green-500 text-white" : "bg-white text-green-500"}`}
                        title="Toggle Shared Mode"
                    >
                        <svg width="28" height="28" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                            <circle cx="12" cy="8" r="4" />
                            <path d="M2 20c0-4 4-7 10-7s10 3 10 7" />
                        </svg>
                    </button>
                    {/* Text to Speech */}
                    <button
                        onClick={() => setIsTextToSpeechEnabled((prev) => !prev)}
                        className={`cursor-pointer p-2 rounded-full hover:bg-purple-200 transition ${isTextToSpeechEnabled ? "bg-purple-500 text-white" : "bg-white text-purple-500"}`}
                        title="Toggle Text to Speech"
                    >
                        <SoundIcon className={`w-7 h-7 ${isTextToSpeechEnabled ? "fill-white" : "fill-purple-500"}`} />
                    </button>
                    {/* Voice Tracking */}
                    <button
                        onClick={() => setIsVoiceTrackingEnabled((prev) => !prev)}
                        className={`cursor-pointer p-2 rounded-full hover:bg-orange-200 transition ${isVoiceTrackingEnabled ? "bg-orange-500 text-white" : "bg-white text-orange-500"}`}
                        title="Toggle Voice Tracking"
                    >
                        <MicroIcon className={`w-7 h-7 ${isVoiceTrackingEnabled ? "stroke-white" : "stroke-orange-500"}`} />
                    </button>
                </div>
            </div>
            {file && (
                <div className="relative w-full h-full shadow-xl rounded overflow-hidden bg-white">
                    <DrawingLayer
                        isEnabled={isDrawingEnabled}
                        color={color}
                        isErasing={isErasing}
                        brushSize={brushSize}
                    />
                    <PdfViewer
                        file={file}
                        fileData={fileData}
                        isSharedMode={isSharedMode}
                        isTextToSpeechEnabled={isTextToSpeechEnabled}
                        isVoiceTrackingEnabled={isVoiceTrackingEnabled}
                    />
                </div>
            )}
        </div>
    );
};