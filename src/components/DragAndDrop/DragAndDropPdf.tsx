"use client";
import { AcceptedFile } from "@/hoc/withDragAndDropFiles";
import { cn } from "@/lib/utils/utils";
import { XIcon } from "lucide-react";
import { DragEvent, RefObject } from "react";
import PdfSortableListDragHandleItem from "../Pdf/PdfSortableListDragHandleItem";
import { SortableList } from "../SortableList";
interface DragAndDropPdfProps {
  dragActive: boolean;
  inputRef: RefObject<HTMLInputElement>;
  files: AcceptedFile[];
  setFiles: (files: AcceptedFile[]) => void;
  handleChange: (e: React.ChangeEvent<HTMLInputElement>) => Promise<void>;
  handleDrop: (e: DragEvent<HTMLFormElement>) => Promise<void>;
  handleDragLeave: (e: React.SyntheticEvent) => void;
  handleDragOver: (e: React.SyntheticEvent) => void;
  handleDragEnter: (e: React.SyntheticEvent) => void;
  removeFile: (id: string) => void;
  sideBarContent?: React.ReactNode;
  acceptedFileType: string;
  multiple?: boolean;
  sortable?: boolean;
  loading?: boolean;
}

function DragAndDropPdf({
  dragActive,
  inputRef,
  files,
  setFiles,
  handleChange,
  handleDrop,
  handleDragLeave,
  handleDragOver,
  handleDragEnter,
  removeFile,
  sideBarContent,
  acceptedFileType,
  multiple = true,
  sortable = true,
  loading = false,
}: DragAndDropPdfProps) {
  return (
    <form
      className="absolute inset-0 h-full w-full flex-col items-center rounded-lg text-center"
      onDragEnter={handleDragEnter}
      onSubmit={(e) => e.preventDefault()}
      onDrop={handleDrop}
      onDragLeave={handleDragLeave}
      onDragOver={handleDragOver}
    >
      <input
        placeholder="fileInput"
        className="hidden"
        ref={inputRef}
        type="file"
        multiple={multiple}
        onChange={handleChange}
        accept={acceptedFileType}
      />

      {files?.length > 0 && (
        <div className="flex h-full flex-col justify-between sm:flex-row">
          <SortableList
            items={files}
            onChange={setFiles}
            renderItem={(acceptedFile) => (
              <div className="group relative">
                <div
                  className={cn(
                    "absolute right-2 top-2 z-20 flex cursor-pointer opacity-0 transition-opacity duration-300 group-hover:opacity-100",
                    dragActive && "hidden",
                  )}
                >
                  <div
                    onClick={
                      loading ? () => {} : () => removeFile(acceptedFile.id)
                    }
                    className="flex h-6 w-6 items-center justify-center rounded-full bg-gray-300 ring-2 ring-gray-500 ring-offset-2"
                  >
                    <XIcon className="h-5 w-5 text-gray-800" />
                  </div>
                </div>
                <SortableList.Item id={acceptedFile.id}>
                  {sortable ? (
                    <SortableList.DragHandle>
                      <PdfSortableListDragHandleItem
                        acceptedFile={acceptedFile}
                        sortable={sortable}
                      />
                    </SortableList.DragHandle>
                  ) : (
                    <PdfSortableListDragHandleItem
                      acceptedFile={acceptedFile}
                      sortable={sortable}
                    />
                  )}
                </SortableList.Item>
              </div>
            )}
            renderDragItem={(acceptedFile) => (
              <SortableList.Item id={acceptedFile.id}>
                <SortableList.DragHandle>
                  <div
                    className={cn(
                      "flex aspect-[3/4] w-full flex-col justify-center rounded-xl border-2 border-dotted border-red-600 bg-gray-200 px-2 py-2 dark:border-amber-400 dark:bg-secondary",
                      sortable ? "cursor-grabbing" : "cursor-default",
                    )}
                  >
                    <h1 className="text-lg">{acceptedFile.file.name}</h1>
                  </div>
                </SortableList.DragHandle>
              </SortableList.Item>
            )}
          ></SortableList>

          {sideBarContent && (
            <div className="h-full w-[30rem] border-l-2 ">{sideBarContent}</div>
          )}
        </div>
      )}
      {dragActive && (
        <div className="pointer-events-none absolute inset-0 h-full w-full bg-black/80"></div>
      )}
    </form>
  );
}

export default DragAndDropPdf;
