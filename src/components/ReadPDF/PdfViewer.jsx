import { useEffect, useState } from "react";

export const PdfViewer = ({ file, fileData, isSharedMode, isTextToSpeechEnabled }) => {
    const [text, setText] = useState("");
    const [spokenWordIndex, setSpokenWordIndex] = useState(-1); // Індекс поточного слова
    const [lastSpokenIndex, setLastSpokenIndex] = useState(-1);

    useEffect(() => {
        setText(fileData);
    }, [file, fileData]);

    useEffect(() => {
        if (isTextToSpeechEnabled) {
            const speech = new SpeechSynthesisUtterance(text);
            window.speechSynthesis.speak(speech);
        } else {
            window.speechSynthesis.cancel();
        }
    }, [isTextToSpeechEnabled, text]);

    useEffect(() => {
        const recognition = new (window.SpeechRecognition || window.webkitSpeechRecognition)();
        recognition.continuous = true;
        recognition.interimResults = true;
        recognition.lang = "uk-UA";

        recognition.onresult = (event) => {
            const transcript = event.results[event.results.length - 1][0].transcript;
            const n = 10 // getDynamicWordCount(transcript);
            const startIdx = lastSpokenIndex + 1;
            const textWords = text.split(" ");
            const searchWords = textWords.slice(startIdx, startIdx + n);
            const indexInSlice = findNearestWordIndex(searchWords, transcript);
            if (indexInSlice !== -1) {
                const globalIndex = startIdx + indexInSlice;
                setSpokenWordIndex(globalIndex);
                setLastSpokenIndex(globalIndex);
            }
        };

        recognition.onerror = (event) => {
            console.error("Speech recognition error:", event.error);
        };

        recognition.start();

        return () => {
            recognition.stop();
        };
    }, [text, lastSpokenIndex]);

    const getDynamicWordCount = (transcript) => {
        const wordCount = transcript.trim().split(/\s+/).length;
        return Math.max(3, Math.min(15, wordCount + 2));
    }

    const findNearestWordIndex = (words, spoken) => {
        const cleaned = spoken.toLowerCase().trim();
        for (let i = 0; i < words.length; i++) {
            if (words[i].toLowerCase().startsWith(cleaned)) {
                return i;
            }
        }
        return -1;
    };

    return (
        <div className="prose max-w-full p-4 overflow-auto h-full">
            {text?.split(" ").map((word, i) => (
                <span
                    key={i}
                    className={`cursor-pointer ${i < spokenWordIndex
                        ? "bg-yellow-100"
                            : i === spokenWordIndex
                                ? "bg-yellow-300"
                                : ""
                        }`}
                >
                    {word}{" "}
                </span>
            ))}
        </div>
    );
}    