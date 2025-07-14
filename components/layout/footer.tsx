"use client"

import { Scale, Phone, Mail, MapPin } from "lucide-react"

export function Footer() {
  return (
    <footer className="bg-gray-900 text-white py-12 mt-auto">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          <div>
            <div className="flex items-center mb-4">
              <Scale className="h-8 w-8 text-red-500 mr-2" />
              <span className="text-xl font-bold">
                Prawnik<span className="text-red-500">Online</span>
              </span>
            </div>
            <p className="text-gray-400 text-sm">
              Profesjonalna pomoc prawna online. Analiza dokumentów i przygotowanie pism prawnych.
            </p>
          </div>

          <div>
            <h4 className="text-lg font-semibold mb-4">Usługi</h4>
            <ul className="space-y-2 text-gray-400">
              <li>
                <a href="/analiza-dokumentow" className="hover:text-white transition-colors">
                  Analiza dokumentów
                </a>
              </li>
              <li>
                <a href="/pisma-prawne" className="hover:text-white transition-colors">
                  Pisma prawne
                </a>
              </li>
              <li>
                <a href="/konsultacje" className="hover:text-white transition-colors">
                  Konsultacje
                </a>
              </li>
              <li>
                <a href="/reprezentacja" className="hover:text-white transition-colors">
                  Reprezentacja
                </a>
              </li>
            </ul>
          </div>

          <div>
            <h4 className="text-lg font-semibold mb-4">Informacje</h4>
            <ul className="space-y-2 text-gray-400">
              <li>
                <a href="/regulamin" className="hover:text-white transition-colors">
                  Regulamin
                </a>
              </li>
              <li>
                <a href="/polityka-prywatnosci" className="hover:text-white transition-colors">
                  Polityka prywatności
                </a>
              </li>
              <li>
                <a href="/rodo" className="hover:text-white transition-colors">
                  RODO
                </a>
              </li>
              <li>
                <a href="/faq" className="hover:text-white transition-colors">
                  FAQ
                </a>
              </li>
            </ul>
          </div>

          <div>
            <h4 className="text-lg font-semibold mb-4">Kontakt</h4>
            <div className="space-y-3 text-gray-400">
              <div className="flex items-center">
                <Phone className="h-4 w-4 mr-2" />
                <span>+48 123 456 789</span>
              </div>
              <div className="flex items-center">
                <Mail className="h-4 w-4 mr-2" />
                <span>kontakt@prawnikonline.pl</span>
              </div>
              <div className="flex items-center">
                <MapPin className="h-4 w-4 mr-2" />
                <span>Gdańsk, Polska</span>
              </div>
            </div>
          </div>
        </div>

        <div className="border-t border-gray-800 pt-8 mt-8 text-center text-gray-400">
          <p>&copy; 2024 PrawnikOnline. Wszystkie prawa zastrzeżone.</p>
        </div>
      </div>
    </footer>
  )
}
