import { AcceptedFile } from "@/hoc/withDragAndDropFiles";
import { cn } from "@/lib/utils/utils";
import PdfAsImage from "./PdfAsImage";

interface PdfSortableListDragHandleItemProps {
  acceptedFile: AcceptedFile;
  sortable: boolean;
}

export default function PdfSortableListDragHandleItem({
  acceptedFile,
  sortable,
}: PdfSortableListDragHandleItemProps) {
  return (
    <div
      className={cn(
        "aspect-[3/4] w-full rounded-xl bg-gray-100 px-4 py-2 ring-1 ring-primary dark:bg-card",
        sortable ? "cursor-grab" : "cursor-default",
      )}
    >
      <PdfAsImage acceptedFile={acceptedFile}></PdfAsImage>
      <h1 className="truncate text-sm">{acceptedFile.file.name}</h1>
    </div>
  );
}
