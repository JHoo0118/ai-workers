"use client";

import { DragEvent, RefObject, useEffect, useRef, useState } from "react";
import { toast } from "react-hot-toast";
import { v4 as uuidv4 } from "uuid";

export interface AcceptedFile {
  id: string;
  file: File;
  fileData?: string;
}

export interface DragAndDropFilesWrappedProps {
  dragActive: boolean;
  inputRef: RefObject<HTMLInputElement>;
  files: AcceptedFile[];
  setFiles: (files: AcceptedFile[]) => void;
  openFileExplorer: () => void;
  handleChange: (e: React.ChangeEvent<HTMLInputElement>) => Promise<void>;
  handleSubmitFile: (e: any) => void;
  handleDrop: (e: DragEvent<HTMLFormElement>) => Promise<void>;
  handleDragLeave: (e: React.SyntheticEvent) => void;
  handleDragOver: (e: React.SyntheticEvent) => void;
  handleDragEnter: (e: React.SyntheticEvent) => void;
  removeFile: (id: string) => void;
}
export interface DragAndDropFilesComponentProps {
  acceptedFileType: string;
  maxAllowedFileCount?: number;
  maxAllowedFileSize?: number;
  multiple?: boolean;
}

function withDragAndDropFiles<P extends DragAndDropFilesWrappedProps>(
  WrappedComponent: React.ComponentType<P>,
): React.FC<
  DragAndDropFilesComponentProps & Omit<P, keyof DragAndDropFilesWrappedProps>
> {
  const Component = ({
    acceptedFileType,
    multiple = true,
    maxAllowedFileCount = 20,
    maxAllowedFileSize = 100, // MB
    ...props
  }: DragAndDropFilesComponentProps) => {
    const [dragActive, setDragActive] = useState<boolean>(false);
    const inputRef = useRef<HTMLInputElement>(null);

    const [files, setFiles] = useState<AcceptedFile[]>([]);

    const onBlur = () => {
      setDragActive(false);
    };

    useEffect(() => {
      window.addEventListener("blur", onBlur);
      return () => {
        window.removeEventListener("blur", onBlur);
      };
    }, []);

    function openFileExplorer() {
      if (inputRef.current !== null) {
        inputRef.current.value = "";
      }
      inputRef.current?.click();
    }

    async function handleChange(e: React.ChangeEvent<HTMLInputElement>) {
      e.preventDefault();

      // if (_isAlreadyAdded()) {
      //   return;
      // }

      if (e.target.files && e.target.files[0]) {
        const newFileList: AcceptedFile[] = [];
        const inputFiles = e.target.files;

        for (let i = 0; i < inputFiles.length; i++) {
          if (
            _isOnlyAllowedSingleFile(newFileList) ||
            _isExceedAllowedFileCount(newFileList)
          ) {
            break;
          }

          const file: File = inputFiles![i];

          if (
            _cannotUploadFileType(file) ||
            _isExceedAllowedFileSize(file.size)
          ) {
            continue;
          }

          const fileWithId: AcceptedFile = {
            id: uuidv4(),
            file: file,
          };

          fileWithId.fileData = await _getUint8Array(fileWithId);
          newFileList.push(fileWithId);
        }

        if (multiple) {
          setFiles((prevState: AcceptedFile[]) => [
            ...prevState,
            ...newFileList,
          ]);
        } else {
          setFiles(newFileList);
        }
      }
    }

    function handleSubmitFile(e: any) {
      if (files.length === 0) {
        // no file has been submitted
      } else {
        // write submit logic here
      }
    }

    async function handleDrop(e: DragEvent<HTMLFormElement>) {
      e.preventDefault();
      e.stopPropagation();
      setDragActive(false);

      if (_isAlreadyAdded()) {
        return;
      }
      if (e.dataTransfer && e.dataTransfer.files && e.dataTransfer.files[0]) {
        const newFileList: AcceptedFile[] = [];
        const inputFiles = e.dataTransfer.files;
        for (let i = 0; i < inputFiles.length; i++) {
          if (
            _isOnlyAllowedSingleFile(newFileList) ||
            _isExceedAllowedFileCount(newFileList)
          ) {
            break;
          }

          const file: File = inputFiles[i];

          if (
            _cannotUploadFileType(file) ||
            _isExceedAllowedFileSize(file.size)
          ) {
            continue;
          }

          const fileWithId: AcceptedFile = {
            id: uuidv4(),
            file: file,
          };
          fileWithId.fileData = await _getUint8Array(fileWithId);
          newFileList.push(fileWithId);
        }
        setFiles((prevState: AcceptedFile[]) => [...prevState, ...newFileList]);
      }
    }

    function handleDragLeave(e: React.SyntheticEvent) {
      e.preventDefault();
      e.stopPropagation();
      setDragActive(false);
    }

    function handleDragOver(e: React.SyntheticEvent) {
      e.preventDefault();
      e.stopPropagation();
      setDragActive(true);
    }

    function handleDragEnter(e: React.SyntheticEvent) {
      e.preventDefault();
      e.stopPropagation();
      setDragActive(true);
    }

    function removeFile(id: string) {
      setFiles([...files.filter((acceptedFile) => acceptedFile.id !== id)]);
    }

    function _getUint8Array(acceptedFile: AcceptedFile) {
      return new Promise<string>((resolve, reject) => {
        let reader = new FileReader();

        reader.readAsArrayBuffer(acceptedFile.file);
        reader.onloadend = (e) => {
          if (e.target?.result instanceof ArrayBuffer) {
            const uint8Array = new Uint8Array(e.target.result);
            resolve(Buffer.from(uint8Array).toString("base64"));
          }
        };
        reader.onerror = function (e: any) {
          reject(e);
        };
      });
    }

    function _isAlreadyAdded() {
      if (!multiple && files.length > 0) {
        toast.error(
          "이미 추가된 파일이 있습니다. 파일 변경은 우측 메뉴를 이용해 주세요.",
        );
        return true;
      }
      return false;
    }

    function _isOnlyAllowedSingleFile(newFileList: AcceptedFile[]) {
      if (!multiple && newFileList.length > 0) {
        toast.error("한 개의 파일만 업로드 가능합니다.");
        return true;
      }
      return false;
    }

    function _isExceedAllowedFileCount(newFileList: AcceptedFile[]) {
      if (multiple && newFileList.length === maxAllowedFileCount) {
        toast.error(
          `최대 ${maxAllowedFileCount}개의 파일만 업로드 가능합니다.`,
        );
        return true;
      }
      return false;
    }

    function _cannotUploadFileType(file: File) {
      const fileType = file.name.split(".").pop();
      if (acceptedFileType.indexOf(fileType ?? "") == -1) {
        toast.error(`파일 ${file.name}은(는) 업로드 불가합니다.`);
        return true;
      }
      return false;
    }

    function _isExceedAllowedFileSize(fileSize: number) {
      const maxAllowedFileSizeBytes = maxAllowedFileSize * 1024 * 1024;
      if (fileSize > maxAllowedFileSizeBytes) {
        toast.error(
          `크기가 ${maxAllowedFileSize}MB 이상인 파일은 업로드 불가합니다.`,
        );
        return true;
      }
      return false;
    }

    return (
      <>
        <WrappedComponent
          {...(props as P)}
          dragActive={dragActive}
          files={files}
          setFiles={setFiles}
          inputRef={inputRef}
          openFileExplorer={openFileExplorer}
          handleChange={handleChange}
          handleSubmitFile={handleSubmitFile}
          handleDrop={handleDrop}
          handleDragLeave={handleDragLeave}
          handleDragOver={handleDragOver}
          handleDragEnter={handleDragEnter}
          removeFile={removeFile}
          acceptedFileType={acceptedFileType}
          multiple={multiple}
        />
      </>
    );
  };
  return Component;
}

export default withDragAndDropFiles;
