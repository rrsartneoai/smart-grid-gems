import { useState } from "react";
import { Upload } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";
import { Card } from "@/components/ui/card";

const ALLOWED_FILE_TYPES = [
  "application/pdf",
  "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
  "image/png",
  "image/jpeg",
];

const MAX_FILE_SIZE = 5 * 1024 * 1024; // 5MB

export function FileUpload() {
  const [isDragging, setIsDragging] = useState(false);
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

  const handleFiles = (files: FileList | null) => {
    if (!files) return;

    const file = files[0];
    if (!handleFileValidation(file)) return;

    toast({
      title: "Sukces",
      description: `Plik ${file.name} został wgrany pomyślnie`,
    });
    
    // Here we'll later add the file processing logic
    console.log("Uploaded file:", file);
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
            Przeciągnij i upuść plik lub
          </p>
          <label htmlFor="file-upload" className="cursor-pointer">
            <Button variant="link" className="mt-1">
              wybierz z dysku
            </Button>
            <input
              id="file-upload"
              type="file"
              className="hidden"
              accept=".pdf,.docx,.png,.jpg,.jpeg"
              onChange={(e) => handleFiles(e.target.files)}
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