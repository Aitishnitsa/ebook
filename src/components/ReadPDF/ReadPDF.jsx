import { useState } from "react";
import { PdfViewer } from "./PdfViewer";
import { DrawingLayer } from "./DrawingLayer";

export const ReadPDF = () => {
    const [file, setFile] = useState(null);
    const [fileData, setFileData] = useState(null);
    const [isDrawingEnabled, setIsDrawingEnabled] = useState(true);
    const [isErasing, setIsErasing] = useState(false);
    const [color, setColor] = useState("#000000");
    const [brushSize, setBrushSize] = useState(5);

    const handleFileChange = (e) => {
        const selectedFile = e.target.files[0];
        setFile(selectedFile);

        if (selectedFile) {
            const reader = new FileReader();
            // reader.readAsDataURL(selectedFile);
            reader.readAsText(selectedFile);
            reader.onload = () => {
                setFileData(reader.result);
            };
        }
    };

    return (
        <div className="relative w-full h-[75vh]">
            <div className={"flex flex-row space-between items-center justify-between"}>
                <input
                    type="file"
                    accept="*/*" // "application/pdf"
                    onChange={handleFileChange}
                    className="cursor-pointer p-2 border border-gray-300 rounded shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
                <button
                    onClick={() => setIsDrawingEnabled((prev) => !prev)}
                    className="mb-4 px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 transition"
                >
                    {isDrawingEnabled ? "Disable Drawing" : "Enable Drawing"}
                </button>
                <button onClick={() => setIsErasing((prev) => !prev)} className="mb-4 px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 transition">
                    {isErasing ? "Draw" : "Erase"}
                </button>
                <input
                    type="color"
                    value={color}
                    onChange={(e) => setColor(e.target.value)}
                    disabled={isErasing}
                    className="cursor-pointer p-2 border border-gray-300 rounded shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
                <input
                    type="number"
                    value={brushSize}
                    onChange={(e) => setBrushSize(e.target.value)}
                    disabled={isErasing}
                    className="cursor-pointer p-2 border border-gray-300 rounded shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
            </div>
            {file && (
                <div className="relative w-full h-full border rounded overflow-hidden">
                    <DrawingLayer isEnabled={isDrawingEnabled} color={color} isErasing={isErasing} brushSize={brushSize} />
                    <PdfViewer file={file} fileData={fileData} />
                </div>
            )}
        </div>
    );
};