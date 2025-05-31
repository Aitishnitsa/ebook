import { ReadPDF } from "../components/ReadPDF/ReadPDF";

export default function Reader() {
    return (
        <div className="p-6">
            <h1 className="text-2xl font-bold mb-4">PDF Reader & Editor</h1>
            <ReadPDF />
        </div>
    );
}