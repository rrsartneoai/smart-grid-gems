import { useState } from "react";
import { Upload } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";
import { Card } from "@/components/ui/card";
import { getDocument } from 'pdfjs-dist';
import mammoth from 'mammoth';
import Tesseract from 'tesseract.js';

// Initialize PDF.js worker
import 'pdfjs-dist/build/pdf.worker.entry';

const ALLOWED_FILE_TYPES = [
  "application/pdf",
  "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
  "image/png",
  "image/jpeg",
];

const MAX_FILE_SIZE = 5 * 1024 * 1024; // 5MB

export function FileUpload() {
  const [isDragging, setIsDragging] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);
  const { toast } = useToast();

  const handleFileValidation = (file: File) => {
    if (!ALLOWED_FILE_TYPES.includes(file.type)) {
      toast({
        variant: "destructive",
        title: "Błąd",
        description: "Niedozwolony typ pliku. Akceptowane formaty: PDF, DOCX, PNG, JPG",
      });
      return false;
    }

    if (file.size > MAX_FILE_SIZE) {
      toast({
        variant: "destructive",
        title: "Błąd",
        description: "Plik jest za duży. Maksymalny rozmiar to 5MB",
      });
      return false;
    }

    return true;
  };

  const processImageFile = async (file: File): Promise<string> => {
    const result = await Tesseract.recognize(file, 'pol');
    return result.data.text;
  };

  const processPdfFile = async (file: File): Promise<string> => {
    const arrayBuffer = await file.arrayBuffer();
    const pdf = await getDocument(arrayBuffer).promise;
    let fullText = '';
    
    for (let i = 1; i <= pdf.numPages; i++) {
      const page = await pdf.getPage(i);
      const textContent = await page.getTextContent();
      const pageText = textContent.items.map((item: any) => item.str).join(' ');
      fullText += pageText + '\n';
    }
    
    return fullText;
  };

  const processDocxFile = async (file: File): Promise<string> => {
    const arrayBuffer = await file.arrayBuffer();
    const result = await mammoth.extractRawText({ arrayBuffer });
    return result.value;
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
          throw new Error('Nieobsługiwany format pliku');
      }

      console.log('Extracted text:', extractedText);
      
      toast({
        title: "Sukces",
        description: "Plik został przetworzony pomyślnie",
      });

      return extractedText;
    } catch (error) {
      console.error('Error processing file:', error);
      toast({
        variant: "destructive",
        title: "Błąd",
        description: "Wystąpił błąd podczas przetwarzania pliku",
      });
    }
  };

  const handleFiles = async (files: FileList | null) => {
    if (!files) return;

    const file = files[0];
    if (!handleFileValidation(file)) return;

    setIsProcessing(true);
    try {
      await processFile(file);
    } finally {
      setIsProcessing(false);
    }
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    handleFiles(e.dataTransfer.files);
  };

  return (
    <Card
      className={`p-8 border-2 border-dashed transition-colors ${
        isDragging ? "border-primary bg-primary/10" : "border-border"
      }`}
      onDragOver={handleDragOver}
      onDragLeave={handleDragLeave}
      onDrop={handleDrop}
    >
      <div className="flex flex-col items-center gap-4">
        <Upload className="w-12 h-12 text-muted-foreground" />
        <div className="text-center">
          <p className="text-sm text-muted-foreground">
            {isProcessing ? "Przetwarzanie pliku..." : "Przeciągnij i upuść plik lub"}
          </p>
          <label htmlFor="file-upload" className="cursor-pointer">
            <Button variant="link" className="mt-1" disabled={isProcessing}>
              wybierz z dysku
            </Button>
            <input
              id="file-upload"
              type="file"
              className="hidden"
              accept=".pdf,.docx,.png,.jpg,.jpeg"
              onChange={(e) => handleFiles(e.target.files)}
              disabled={isProcessing}
            />
          </label>
        </div>
        <p className="text-xs text-muted-foreground">
          PDF, DOCX, PNG, JPG (max. 5MB)
        </p>
      </div>
    </Card>
  );
}