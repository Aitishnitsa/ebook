import { useState } from "react";
import { PdfViewer } from "./PdfViewer";
import { DrawingLayer } from "./DrawingLayer";
import { BookIcon } from "../Icons/BookIcon";
import { BrushIcon } from "../Icons/BrushIcon";
import { EraserIcon } from "../Icons/EraserIcon";
import { SoundIcon } from "../Icons/SoundIcon";
import { MicroIcon } from "../Icons/MicroIcon";
import { ColorIcon } from "../Icons/ColorIcon";
import IconButton from "../Buttons/IconButton";

export const ReadPDF = () => {
    const [file, setFile] = useState(null);
    const [fileData, setFileData] = useState(null);
    const [isDrawingEnabled, setIsDrawingEnabled] = useState(false);
    const [isErasing, setIsErasing] = useState(false);
    const [color, setColor] = useState("#000000");
    const [brushSize, setBrushSize] = useState(2);
    const [isSharedMode, setIsSharedMode] = useState(false);
    const [isTextToSpeechEnabled, setIsTextToSpeechEnabled] = useState(false);
    const [isVoiceTrackingEnabled, setIsVoiceTrackingEnabled] = useState(false);

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
        <div className="relative w-full sm:h-[92vh] h-[90vh] flex flex-row justify-between">
            {/* Панель інструментів */}
            <div className="flex flex-row items-center justify-between mb-4">
                <input
                    type="file"
                    // accept="*/*" // "application/pdf"
                    // "application/pdf"
                    onChange={handleFileChange}
                    className="hidden"
                />
                <div className="sticky left-0 top-15 h-fit sm:w-20 w-15 flex flex-col items-center py-8 z-50 space-y-3">
                    {/* File Upload */}
                    <label htmlFor="file-upload" className="cursor-pointer flex flex-col items-center">
                        <div className={`rounded-full transition p-2 ${file ? "bg-coffee-500 hover:bg-coffee-700" : "bg-coffee-50 hover:bg-coffee-200"}`}>
                            <BookIcon className={`w-7 h-7 ${file ? "stroke-coffee-50" : "stroke-coffee-700"}`}/>
                        </div>
                        <input
                            id="file-upload"
                            type="file"
                            accept="text/plain"
                            onChange={handleFileChange}
                            className="hidden"
                        />
                    {!file && <p className="absolute left-20 w-36">Імпортуй .txt файл руцями :)</p>}
                    </label>
                    {/* Drawing Toggle */}
                    <IconButton
                        isActive={isDrawingEnabled}
                        isDisabled={!file}
                        onClick={() => setIsDrawingEnabled((prev) => !prev)}
                        title="Toggle Drawing">
                        <BrushIcon className={`w-7 h-7 ${isDrawingEnabled ? "fill-coffee-50" : "fill-coffee-700"}`} />
                    </IconButton>
                    {/* Eraser Toggle */}
                    <IconButton
                        isActive={isErasing}
                        isDisabled={!isDrawingEnabled}
                        onClick={() => setIsErasing((prev) => !prev)}
                        title="Toggle Eraser">
                        <EraserIcon className={`w-7 h-7 ${isErasing ? "stroke-coffee-50" : "stroke-coffee-700"}`} />
                    </IconButton>
                    {/* Color Picker */}
                    <label className={`p-2 rounded-full flex flex-col items-center bg-coffee-50 ${isErasing || !isDrawingEnabled ? "cursor-not-allowed opacity-50" : "hover:bg-coffee-200 cursor-pointer"}`}>
                        <ColorIcon className={`w-7 h-7 fill-coffee-700`} color={ color} />
                        <input
                            type="color"
                            value={color}
                            onChange={(e) => setColor(e.target.value)}
                            disabled={isErasing || !isDrawingEnabled}
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
                            min="2"
                            max="24"
                            value={brushSize}
                            onChange={(e) => setBrushSize(Number(e.target.value))}
                            className={`h-24 w-4 mt-2 accent-coffee-500 [writing-mode:vertical-lr] [direction:rtl] ${!isDrawingEnabled ? "opacity-50 cursor-not-allowed" : "cursor-pointer"}`}
                            orient="vertical"
                            disabled={!isDrawingEnabled}
                        />
                    </div>
                    {/* Shared Mode */}
                    <IconButton
                        isActive={isSharedMode}
                        isDisabled={!file}
                        onClick={() => setIsSharedMode((prev) => !prev)}
                        title="Toggle Shared Mode">
                        <svg width="28" height="28" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                            <circle cx="12" cy="8" r="4" />
                            <path d="M2 20c0-4 4-7 10-7s10 3 10 7" />
                        </svg>
                    </IconButton>
                    {/* Text to Speech */}
                    <IconButton
                        isActive={isTextToSpeechEnabled}
                        isDisabled={!file || isVoiceTrackingEnabled}
                        onClick={() => setIsTextToSpeechEnabled((prev) => !prev)}
                        title="Toggle Text to Speech">
                        <SoundIcon className={`w-7 h-7 ${isTextToSpeechEnabled ? "fill-coffee-50" : "fill-coffee-700"}`} />
                    </IconButton>
                    {/* Voice Tracking */}
                    <IconButton
                        isActive={isVoiceTrackingEnabled}
                        isDisabled={!file || isTextToSpeechEnabled}
                        onClick={() => setIsVoiceTrackingEnabled((prev) => !prev)}
                        title="Toggle Voice Tracking">
                        <MicroIcon className={`w-7 h-7 ${isVoiceTrackingEnabled ? "stroke-coffee-50" : "stroke-coffee-700"}`} />
                    </IconButton>
                </div>
            </div>
            <div className="sm:p-4 p-2">
            {file && (
                <div className="relative w-full h-full shadow-xl rounded overflow-hidden bg-coffee-50">
                    <div className={`relative ${isDrawingEnabled ? "z-1" : "z-10"} h-full`}>
                        <PdfViewer
                            file={file}
                            fileData={fileData}
                            isSharedMode={isSharedMode}
                            isTextToSpeechEnabled={isTextToSpeechEnabled}
                            isVoiceTrackingEnabled={isVoiceTrackingEnabled}
                            />
                        </div>
                    <DrawingLayer
                        isEnabled={isDrawingEnabled}
                        color={color}
                        isErasing={isErasing}
                        brushSize={brushSize}
                    />
                </div>
            )}
            </div>
        </div>
    );
};