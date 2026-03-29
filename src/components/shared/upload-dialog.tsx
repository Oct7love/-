"use client";

import { useState, useCallback } from "react";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Progress } from "@/components/ui/progress";
import { Upload, FileText, CheckCircle, AlertCircle, Loader2 } from "lucide-react";

interface UploadDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onUploadComplete?: (content: unknown) => void;
}

type UploadState = "idle" | "uploading" | "parsing" | "success" | "error";

export function UploadDialog({
  open,
  onOpenChange,
  onUploadComplete,
}: UploadDialogProps) {
  const [state, setState] = useState<UploadState>("idle");
  const [progress, setProgress] = useState(0);
  const [fileName, setFileName] = useState("");
  const [errorMsg, setErrorMsg] = useState("");
  const [dragActive, setDragActive] = useState(false);

  const resetState = useCallback(() => {
    setState("idle");
    setProgress(0);
    setFileName("");
    setErrorMsg("");
  }, []);

  async function handleFile(file: File) {
    const allowedTypes = [
      "application/pdf",
      "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
      "text/plain",
    ];

    if (!allowedTypes.includes(file.type)) {
      setState("error");
      setErrorMsg("仅支持 PDF、DOCX、TXT 格式");
      return;
    }

    if (file.size > 10 * 1024 * 1024) {
      setState("error");
      setErrorMsg("文件大小不能超过 10MB");
      return;
    }

    setFileName(file.name);
    setState("uploading");
    setProgress(30);

    try {
      const formData = new FormData();
      formData.append("file", file);

      setProgress(50);
      setState("parsing");

      const res = await fetch("/api/resumes/upload", {
        method: "POST",
        body: formData,
      });

      setProgress(80);

      if (!res.ok) {
        const data = await res.json();
        throw new Error(data.error?.message || "上传失败");
      }

      const data = await res.json();
      setProgress(100);
      setState("success");

      onUploadComplete?.(data.data.parsedContent);
    } catch (err) {
      setState("error");
      setErrorMsg(err instanceof Error ? err.message : "上传失败，请重试");
    }
  }

  function handleDrop(e: React.DragEvent) {
    e.preventDefault();
    setDragActive(false);
    const file = e.dataTransfer.files[0];
    if (file) handleFile(file);
  }

  function handleFileInput(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (file) handleFile(file);
  }

  return (
    <Dialog
      open={open}
      onOpenChange={(v) => {
        if (!v) resetState();
        onOpenChange(v);
      }}
    >
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>上传简历</DialogTitle>
          <DialogDescription>
            上传你的简历文件，AI 将自动解析内容
          </DialogDescription>
        </DialogHeader>

        {state === "idle" && (
          <div
            className={`border-2 border-dashed rounded-lg p-8 text-center transition-colors ${
              dragActive
                ? "border-emerald-400 bg-emerald-50"
                : "border-gray-200 hover:border-gray-300"
            }`}
            onDragOver={(e) => {
              e.preventDefault();
              setDragActive(true);
            }}
            onDragLeave={() => setDragActive(false)}
            onDrop={handleDrop}
          >
            <Upload className="h-10 w-10 text-gray-300 mx-auto" />
            <p className="mt-3 text-sm text-gray-600">
              拖拽文件到这里，或{" "}
              <label className="text-emerald-600 hover:underline cursor-pointer">
                点击选择文件
                <input
                  type="file"
                  accept=".pdf,.docx,.txt"
                  className="hidden"
                  onChange={handleFileInput}
                />
              </label>
            </p>
            <p className="mt-1 text-xs text-gray-400">
              支持 PDF、DOCX、TXT，最大 10MB
            </p>
          </div>
        )}

        {(state === "uploading" || state === "parsing") && (
          <div className="py-8 text-center space-y-4">
            <Loader2 className="h-10 w-10 text-emerald-600 mx-auto animate-spin" />
            <div>
              <p className="font-medium">{fileName}</p>
              <p className="text-sm text-gray-500 mt-1">
                {state === "uploading" ? "正在上传..." : "AI 正在解析简历内容..."}
              </p>
            </div>
            <Progress value={progress} className="h-2 max-w-xs mx-auto" />
          </div>
        )}

        {state === "success" && (
          <div className="py-8 text-center space-y-4">
            <CheckCircle className="h-12 w-12 text-green-500 mx-auto" />
            <div>
              <p className="font-medium text-green-700">解析完成！</p>
              <p className="text-sm text-gray-500 mt-1">
                简历内容已成功提取，请检查并编辑
              </p>
            </div>
            <Button
              onClick={() => {
                resetState();
                onOpenChange(false);
              }}
            >
              开始编辑
            </Button>
          </div>
        )}

        {state === "error" && (
          <div className="py-8 text-center space-y-4">
            <AlertCircle className="h-12 w-12 text-red-400 mx-auto" />
            <div>
              <p className="font-medium text-red-600">上传失败</p>
              <p className="text-sm text-gray-500 mt-1">{errorMsg}</p>
            </div>
            <Button variant="outline" onClick={resetState}>
              重新上传
            </Button>
          </div>
        )}
      </DialogContent>
    </Dialog>
  );
}
