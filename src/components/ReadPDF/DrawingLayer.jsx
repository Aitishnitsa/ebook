import { useRef, useEffect } from "react";

export const DrawingLayer = ({
                                 isEnabled = true,
                                 color = "#000000",
                                 isErasing = false,
                                 brushSize = 5
                             }) => {
    const canvasRef = useRef(null);
    const containerRef = useRef(null);
    const ctxRef = useRef(null);
    const isDrawing = useRef(false);

    useEffect(() => {
        const canvas = canvasRef.current;
        const container = containerRef.current;
        const ctx = canvas.getContext("2d");
        ctxRef.current = ctx;

        const resizeCanvas = () => {
            const { offsetWidth: width, offsetHeight: height } = container;
            const dpr = window.devicePixelRatio || 1;

            const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);

            canvas.width = width * dpr;
            canvas.height = height * dpr;
            canvas.style.width = `${width}px`;
            canvas.style.height = `${height}px`;

            ctx.scale(dpr, dpr);
            ctx.putImageData(imageData, 0, 0);
        };

        resizeCanvas();
        window.addEventListener("resize", resizeCanvas);

        const getOffset = (e) => {
            const rect = canvas.getBoundingClientRect();
            return {
                x: e.clientX - rect.left,
                y: e.clientY - rect.top
            };
        };

        const startDraw = (e) => {
            if (!isEnabled) return;
            isDrawing.current = true;
            const { x, y } = getOffset(e);
            ctx.beginPath();
            ctx.moveTo(x, y);
        };

        const draw = (e) => {
            if (!isDrawing.current || !isEnabled) return;
            const { x, y } = getOffset(e);
            ctx.lineTo(x, y);
            ctx.stroke();
        };

        const endDraw = () => {
            isDrawing.current = false;
        };

        canvas.addEventListener("mousedown", startDraw);
        canvas.addEventListener("mousemove", draw);
        canvas.addEventListener("mouseup", endDraw);
        canvas.addEventListener("mouseout", endDraw);

        return () => {
            window.removeEventListener("resize", resizeCanvas);
            canvas.removeEventListener("mousedown", startDraw);
            canvas.removeEventListener("mousemove", draw);
            canvas.removeEventListener("mouseup", endDraw);
            canvas.removeEventListener("mouseout", endDraw);
        };
    }, [isEnabled]);

    useEffect(() => {
        const ctx = ctxRef.current;
        if (!ctx) return;

        ctx.lineWidth = brushSize;
        ctx.strokeStyle = isErasing ? "rgba(0,0,0,1)" : color;
        ctx.lineCap = "round";
        ctx.lineJoin = "round";

        ctx.globalCompositeOperation = isErasing ? "destination-out" : "source-over";
    }, [color, isErasing, brushSize]);

    return (
        <div ref={containerRef} className={`absolute top-0 left-0 w-full h-full pointer-events-none ${isEnabled ? "z-10" : "-z-10"}`}>
            <canvas
                ref={canvasRef}
                className="w-full h-full pointer-events-auto"
            />
        </div>
    );
};
