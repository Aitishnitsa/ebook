import { useEffect, useState } from "react";

export const PdfViewer = ({ file, fileData }) => {
    const [text, setText] = useState("");

    useEffect(() => {
        setText(fileData);
    }, [file, fileData]);

    return (
        <div className="prose max-w-full p-4 overflow-auto h-full">
            {text?.split("\n").map((line, i) => (
                <p key={i} className="selectable cursor-pointer">
                    {line}
                </p>
            ))}
        </div>
    );
};