export interface Document {
  id: string
  name: string
  type: "pdf" | "image"
  url: string
  uploadedAt: Date
}

export interface Case {
  id: string
  name: string
  clientId: string
  status: "new" | "analyzing" | "analysis_ready" | "documents_ready" | "completed"
  documents: Document[]
  analysis?: Analysis
  generatedDocuments: GeneratedDocument[]
  createdAt: Date
  updatedAt: Date
}

export interface Analysis {
  id: string
  caseId: string
  content: string
  recommendations: string[]
  possibleDocuments: DocumentOption[]
  price: number
  status: "pending" | "completed"
  createdAt: Date
}

export interface DocumentOption {
  id: string
  name: string
  description: string
  price: number
  estimatedTime: string
}

export interface GeneratedDocument {
  id: string
  caseId: string
  optionId: string
  name: string
  content: string
  instructions: string
  price: number
  status: "pending" | "completed" | "purchased"
  createdAt: Date
}

export interface Payment {
  id: string
  caseId: string
  amount: number
  type: "analysis" | "document"
  status: "pending" | "completed" | "failed"
  method: "card" | "blik" | "transfer" | "google_pay"
  createdAt: Date
}
