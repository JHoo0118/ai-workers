"use client";
import { AcceptedFile } from "@/hoc/withDragAndDropFiles";
import { formatBytes } from "@/lib/utils/utils";
import { memo, useCallback, useEffect, useState } from "react";
import { Document, Page, pdfjs } from "react-pdf";
import "react-pdf/dist/Page/AnnotationLayer.css";
import "react-pdf/dist/Page/TextLayer.css";
import { useResizeDetector } from "react-resize-detector";

pdfjs.GlobalWorkerOptions.workerSrc = "/pdf.worker.min.js";
// new URL(
//   "pdfjs-dist/build/pdf.worker.min.js",
//   import.meta.url,
// ).toString();

interface PdfAsImageProps {
  acceptedFile: AcceptedFile;
}

const options = {
  // cMapUrl: "cmaps/",
  cMapPacked: true,
  // length: 1,
  standardFontDataUrl: "standard_fonts/",
};

function PdfAsImage({ acceptedFile }: PdfAsImageProps) {
  const [numPages, setNumPages] = useState<number>();
  const [uint8Arr, setUint8Arr] = useState<Uint8Array>();
  const onResize = useCallback(() => {
    // on resize logic
  }, []);

  const { width, height, ref } = useResizeDetector({
    handleHeight: true,
    // refreshMode: "debounce",
    refreshRate: 1000,
    onResize,
  });

  const handleResize = useCallback(() => {
    setUint8Arr(getUint8Array(acceptedFile.fileData!));
  }, [acceptedFile]);

  useEffect(() => {
    window.addEventListener("resize", handleResize, false);
    if (
      acceptedFile.file &&
      acceptedFile.fileData &&
      acceptedFile.fileData?.length > 0 &&
      !uint8Arr
    ) {
      setUint8Arr(getUint8Array(acceptedFile.fileData!));
    }
  }, [handleResize, acceptedFile, uint8Arr]);

  function getUint8Array(base64Str: string): Uint8Array {
    return new Uint8Array(Buffer.from(base64Str, "base64"));
  }

  function onDocumentLoadSuccess({ numPages }: { numPages: number }) {
    setNumPages(numPages);
  }

  return (
    <div
      className="pointer-events-none relative flex h-full w-full items-center"
      ref={ref as React.LegacyRef<HTMLDivElement>}
    >
      <div className="pointer-events-none absolute -top-14 left-1/2 min-w-48 -translate-x-1/2 rounded-md bg-primary p-2 text-white opacity-0 transition-opacity duration-300 group-hover:opacity-100">
        {formatBytes(acceptedFile.file.size)} - {numPages} 페이지
      </div>
      <Document
        file={{
          data:
            // uint8Arr ??
            new Uint8Array(Buffer.from(acceptedFile.fileData!, "base64")),
        }}
        renderMode="canvas"
        options={options}
        loading={false}
        error={false}
        onLoadSuccess={onDocumentLoadSuccess}
      >
        <Page width={width} height={height} pageNumber={1}></Page>
      </Document>
    </div>
  );
  // );
}

export default memo(PdfAsImage);
