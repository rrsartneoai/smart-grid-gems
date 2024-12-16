import { useState } from "react";
import { useToast } from "@/hooks/use-toast";
import { DropZone } from "./upload/DropZone";
import {
  processImageFile,
  processPdfFile,
  processDocxFile,
  ALLOWED_FILE_TYPES,
  MAX_FILE_SIZE,
} from "@/utils/fileProcessing";
import { processDocumentForRAG } from "@/utils/ragUtils";

export function FileUpload() {
  const [isDragging, setIsDragging] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const { toast } = useToast();

  const handleFileValidation = (file: File) => {
    if (!ALLOWED_FILE_TYPES.includes(file.type)) {
      toast({
        variant: "destructive",
        title: "Error",
        description: "Invalid file type. Accepted formats: PDF, DOCX, PNG, JPG",
      });
      return false;
    }

    if (file.size > MAX_FILE_SIZE) {
      toast({
        variant: "destructive",
        title: "Error",
        description: "File is too large. Maximum size is 5MB",
      });
      return false;
    }

    return true;
  };

  const processFile = async (file: File) => {
    try {
      let extractedText = '';
      
      switch (file.type) {
        case 'application/pdf':
          extractedText = await processPdfFile(file);
          break;
        case 'application/vnd.openxmlformats-officedocument.wordprocessingml.document':
          extractedText = await processDocxFile(file);
          break;
        case 'image/png':
        case 'image/jpeg':
          extractedText = await processImageFile(file);
          break;
        default:
          throw new Error('Unsupported file format');
      }

      // Process the extracted text for RAG
      await processDocumentForRAG(extractedText);
      
      toast({
        title: "Success",
        description: "File processed and ready for questions",
      });

      return extractedText;
    } catch (error) {
      console.error('Error processing file:', error);
      toast({
        variant: "destructive",
        title: "Error",
        description: "An error occurred while processing the file",
      });
      throw error;
    }
  };

  const handleFiles = async (files: FileList | null) => {
    if (!files || files.length === 0) return;

    const file = files[0];
    setSelectedFile(file);
    
    if (!handleFileValidation(file)) {
      setSelectedFile(null);
      return;
    }

    setIsProcessing(true);
    try {
      await processFile(file);
    } catch (error) {
      console.error('Error in handleFiles:', error);
    } finally {
      setIsProcessing(false);
      setSelectedFile(null);
    }
  };

  return (
    <DropZone
      isDragging={isDragging}
      isProcessing={isProcessing}
      selectedFile={selectedFile}
      onFileSelect={handleFiles}
      setIsDragging={setIsDragging}
    />
  );
}