"use client"

import { useState, useEffect } from "react"
import { Header } from "@/components/layout/header"
import { Footer } from "@/components/layout/footer"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { useAuth, mockLogin } from "@/lib/auth"
import type { Case } from "@/lib/types"
import { FileText, Upload, Eye, Plus, Search, Filter, User, Settings, History } from "lucide-react"

export default function PanelKlientaPage() {
  const { user, isAuthenticated } = useAuth()
  const [activeTab, setActiveTab] = useState("sprawy")
  const [sidebarOpen, setSidebarOpen] = useState(false)

  // Mock login if not authenticated
  useEffect(() => {
    if (!isAuthenticated) {
      mockLogin("klient@example.com", "client")
    }
  }, [isAuthenticated])

  const mockCases: Case[] = [
    {
      id: "1",
      name: "Nakaz zapłaty - Sprawa nr 1",
      clientId: user?.id || "",
      status: "analysis_ready",
      documents: [
        {
          id: "1",
          name: "nakaz_zaplaty.pdf",
          type: "pdf",
          url: "/documents/nakaz.pdf",
          uploadedAt: new Date("2024-01-15"),
        },
      ],
      analysis: {
        id: "1",
        caseId: "1",
        content: "Otrzymany nakaz zapłaty jest prawidłowy pod względem formalnym...",
        recommendations: [
          "Złożenie sprzeciwu w terminie 14 dni",
          "Przygotowanie dowodów na poparcie stanowiska",
          "Rozważenie ugody pozasądowej",
        ],
        possibleDocuments: [
          {
            id: "1",
            name: "Sprzeciw od nakazu zapłaty",
            description: "Profesjonalnie przygotowany sprzeciw z uzasadnieniem",
            price: 89,
            estimatedTime: "24h",
          },
          {
            id: "2",
            name: "Wniosek o rozłożenie na raty",
            description: "Wniosek o rozłożenie należności na raty",
            price: 59,
            estimatedTime: "12h",
          },
        ],
        price: 59,
        status: "completed",
        createdAt: new Date("2024-01-16"),
      },
      generatedDocuments: [],
      createdAt: new Date("2024-01-15"),
      updatedAt: new Date("2024-01-16"),
    },
    {
      id: "2",
      name: "Wezwanie komornika - Sprawa nr 2",
      clientId: user?.id || "",
      status: "analyzing",
      documents: [
        {
          id: "2",
          name: "wezwanie_komornik.jpg",
          type: "image",
          url: "/documents/wezwanie.jpg",
          uploadedAt: new Date("2024-01-18"),
        },
      ],
      generatedDocuments: [],
      createdAt: new Date("2024-01-18"),
      updatedAt: new Date("2024-01-18"),
    },
  ]

  const sidebarItems = [
    { id: "sprawy", label: "Moje sprawy", icon: FileText },
    { id: "nowa-sprawa", label: "Nowa sprawa", icon: Plus },
    { id: "historia", label: "Historia płatności", icon: History },
    { id: "profil", label: "Mój profil", icon: User },
    { id: "ustawienia", label: "Ustawienia", icon: Settings },
  ]

  const getStatusBadge = (status: Case["status"]) => {
    const statusConfig = {
      new: { label: "Nowa", color: "bg-blue-100 text-blue-800" },
      analyzing: { label: "Analizujemy", color: "bg-yellow-100 text-yellow-800" },
      analysis_ready: { label: "Analiza gotowa", color: "bg-green-100 text-green-800" },
      documents_ready: { label: "Pisma gotowe", color: "bg-purple-100 text-purple-800" },
      completed: { label: "Zakończona", color: "bg-gray-100 text-gray-800" },
    }

    return statusConfig[status] || statusConfig.new
  }

  if (!isAuthenticated) {
    return <div>Ładowanie...</div>
  }

  return (
    <div className="min-h-screen flex flex-col bg-gray-50">
      <Header onMenuToggle={() => setSidebarOpen(!sidebarOpen)} showMenuButton />

      <div className="flex flex-1">
        {/* Sidebar */}
        <div
          className={`bg-white shadow-lg transition-all duration-300 ${sidebarOpen ? "w-64" : "w-64 hidden lg:block"}`}
        >
          <div className="p-6">
            <div className="flex items-center mb-6">
              <div className="w-10 h-10 bg-red-100 rounded-full flex items-center justify-center mr-3">
                <User className="h-5 w-5 text-red-600" />
              </div>
              <div>
                <div className="font-medium">{user?.name}</div>
                <div className="text-sm text-gray-500">Panel klienta</div>
              </div>
            </div>

            <nav className="space-y-2">
              {sidebarItems.map((item) => (
                <button
                  key={item.id}
                  onClick={() => setActiveTab(item.id)}
                  className={`w-full flex items-center px-3 py-2 rounded-lg text-left transition-colors ${
                    activeTab === item.id ? "bg-red-100 text-red-700" : "text-gray-700 hover:bg-gray-100"
                  }`}
                >
                  <item.icon className="h-5 w-5 mr-3" />
                  {item.label}
                </button>
              ))}
            </nav>
          </div>
        </div>

        {/* Main Content */}
        <div className="flex-1 p-6">
          {activeTab === "sprawy" && (
            <div className="space-y-6">
              <div className="flex justify-between items-center">
                <h1 className="text-2xl font-bold text-gray-900">Moje sprawy</h1>
                <Button onClick={() => setActiveTab("nowa-sprawa")}>
                  <Plus className="mr-2 h-4 w-4" />
                  Nowa sprawa
                </Button>
              </div>

              <div className="flex space-x-4 mb-6">
                <div className="flex-1 relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
                  <Input placeholder="Szukaj spraw..." className="pl-10" />
                </div>
                <Button variant="outline">
                  <Filter className="mr-2 h-4 w-4" />
                  Filtruj
                </Button>
              </div>

              <div className="grid grid-cols-1 gap-6">
                {mockCases.map((case_) => (
                  <Card key={case_.id} className="hover:shadow-md transition-shadow">
                    <CardHeader>
                      <div className="flex justify-between items-start">
                        <div>
                          <CardTitle className="text-lg">{case_.name}</CardTitle>
                          <p className="text-sm text-gray-500 mt-1">
                            Utworzona: {case_.createdAt.toLocaleDateString()}
                          </p>
                        </div>
                        <Badge className={getStatusBadge(case_.status).color}>
                          {getStatusBadge(case_.status).label}
                        </Badge>
                      </div>
                    </CardHeader>

                    <CardContent className="space-y-4">
                      <div>
                        <h4 className="font-medium mb-2">Dokumenty ({case_.documents.length})</h4>
                        <div className="space-y-2">
                          {case_.documents.map((doc) => (
                            <div key={doc.id} className="flex items-center justify-between p-2 bg-gray-50 rounded">
                              <div className="flex items-center">
                                <FileText className="h-4 w-4 text-gray-500 mr-2" />
                                <span className="text-sm">{doc.name}</span>
                              </div>
                              <Button variant="ghost" size="sm">
                                <Eye className="h-4 w-4" />
                              </Button>
                            </div>
                          ))}
                        </div>
                      </div>

                      {case_.analysis && (
                        <div className="border-t pt-4">
                          <div className="flex justify-between items-center mb-2">
                            <h4 className="font-medium">Analiza prawna</h4>
                            <Badge className="bg-green-100 text-green-800">Gotowa</Badge>
                          </div>
                          <p className="text-sm text-gray-600 mb-3">{case_.analysis.content.substring(0, 100)}...</p>

                          {case_.analysis.possibleDocuments.length > 0 && (
                            <div className="space-y-2">
                              <h5 className="text-sm font-medium">Dostępne pisma do zamówienia:</h5>
                              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                                {case_.analysis.possibleDocuments.map((doc) => (
                                  <Card key={doc.id} className="border border-red-200">
                                    <CardContent className="p-3">
                                      <div className="flex justify-between items-start mb-2">
                                        <h6 className="text-sm font-medium">{doc.name}</h6>
                                        <span className="text-sm font-bold text-red-600">{doc.price} zł</span>
                                      </div>
                                      <p className="text-xs text-gray-600 mb-2">{doc.description}</p>
                                      <div className="flex justify-between items-center">
                                        <span className="text-xs text-gray-500">Czas: {doc.estimatedTime}</span>
                                        <Button size="sm" className="text-xs">
                                          Zamów
                                        </Button>
                                      </div>
                                    </CardContent>
                                  </Card>
                                ))}
                              </div>
                            </div>
                          )}
                        </div>
                      )}

                      <div className="flex space-x-2 pt-2">
                        <Button variant="outline" size="sm">
                          <Eye className="mr-2 h-4 w-4" />
                          Zobacz szczegóły
                        </Button>
                        {case_.status === "new" && (
                          <Button size="sm">
                            <Upload className="mr-2 h-4 w-4" />
                            Dodaj dokumenty
                          </Button>
                        )}
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </div>
          )}

          {activeTab === "nowa-sprawa" && (
            <div className="space-y-6">
              <h1 className="text-2xl font-bold text-gray-900">Nowa sprawa</h1>

              <Card>
                <CardHeader>
                  <CardTitle>Rozpocznij nową sprawę</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-center py-8">
                    <Upload className="mx-auto h-16 w-16 text-gray-400 mb-4" />
                    <h3 className="text-lg font-medium mb-2">Prześlij dokumenty do analizy</h3>
                    <p className="text-gray-600 mb-6">
                      Rozpocznij od przesłania dokumentów, które chcesz przeanalizować
                    </p>
                    <Button size="lg" onClick={() => (window.location.href = "/zamow-analize")}>
                      Zamów analizę
                    </Button>
                  </div>
                </CardContent>
              </Card>
            </div>
          )}

          {activeTab === "profil" && (
            <div className="space-y-6">
              <h1 className="text-2xl font-bold text-gray-900">Mój profil</h1>

              <Card>
                <CardHeader>
                  <CardTitle>Dane osobowe</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Imię i nazwisko</label>
                      <Input value={user?.name || ""} />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Email</label>
                      <Input value={user?.email || ""} />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Telefon</label>
                      <Input placeholder="+48 123 456 789" />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Data rejestracji</label>
                      <Input value={user?.createdAt.toLocaleDateString()} disabled />
                    </div>
                  </div>

                  <Button>Zapisz zmiany</Button>
                </CardContent>
              </Card>
            </div>
          )}
        </div>
      </div>

      <Footer />
    </div>
  )
}
