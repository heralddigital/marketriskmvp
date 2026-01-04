'use client'

import { Building2, Receipt, AlertTriangle, CheckCircle2, XCircle, Info } from 'lucide-react'
import type { CompanyData } from '@/lib/anaf/types'

interface FinancialDataCardProps {
  company: CompanyData
}

export default function FinancialDataCard({ company }: FinancialDataCardProps) {
  const formatDate = (date?: string) => {
    if (!date) return 'N/A'
    try {
      return new Date(date).toLocaleDateString('ro-RO', {
        year: 'numeric',
        month: 'short',
        day: 'numeric'
      })
    } catch {
      return date
    }
  }

  const getVATStatusColor = (isRegistered: boolean) => {
    return isRegistered
      ? 'text-[#22C55E] bg-[#22C55E]/10'
      : 'text-[#EF4444] bg-[#EF4444]/10'
  }

  const getVATStatusIcon = (isRegistered: boolean) => {
    return isRegistered ? CheckCircle2 : XCircle
  }

  return (
    <div className="bg-white border border-gray-200 rounded-lg p-6 space-y-6">
      <div className="flex items-center gap-2 mb-4">
        <Receipt className="w-5 h-5 text-[#2F5232]" />
        <h3 className="text-lg font-semibold text-gray-900">
          Date financiare și fiscale
        </h3>
      </div>

      {/* VAT Registration Status */}
      <div className="space-y-4">
        <div>
          <h4 className="text-sm font-semibold text-gray-900 mb-3">
            Status TVA
          </h4>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="p-4 bg-gray-50 rounded-lg border border-gray-200">
              <div className="flex items-center justify-between mb-2">
                <span className="text-xs text-gray-500">Înregistrare TVA</span>
                {(() => {
                  const isRegistered = company.vatRegistration?.isRegistered ?? false
                  return (
                    <span className={`px-2 py-1 rounded-lg text-xs font-semibold flex items-center gap-1 ${getVATStatusColor(isRegistered)}`}>
                      {isRegistered ? <CheckCircle2 className="w-3 h-3" /> : <XCircle className="w-3 h-3" />}
                      {isRegistered ? 'Înregistrat' : 'Neînregistrat'}
                    </span>
                  )
                })()}
              </div>
              {company.vatRegistration?.startDate && (
                <p className="text-xs text-gray-600">
                  Din: {formatDate(company.vatRegistration.startDate)}
                </p>
              )}
              {company.vatRegistration?.endDate && (
                <p className="text-xs text-gray-600">
                  Până: {formatDate(company.vatRegistration.endDate)}
                </p>
              )}
            </div>

            {company.isVATSplit && (
              <div className="p-4 bg-[#F59E0B]/10 border border-[#F59E0B]/20 rounded-lg">
                <div className="flex items-center gap-2 mb-2">
                  <AlertTriangle className="w-4 h-4 text-[#F59E0B]" />
                  <span className="text-xs font-semibold text-[#F59E0B]">Split TVA</span>
                </div>
                <p className="text-xs text-gray-600">
                  În regim Split TVA
                  {company.splitTVADetails?.startDate && (
                    <span className="block mt-1">Din: {formatDate(company.splitTVADetails.startDate)}</span>
                  )}
                </p>
              </div>
            )}

            {company.isTVAIncasare && (
              <div className="p-4 bg-[#F59E0B]/10 border border-[#F59E0B]/20 rounded-lg">
                <div className="flex items-center gap-2 mb-2">
                  <Info className="w-4 h-4 text-[#F59E0B]" />
                  <span className="text-xs font-semibold text-[#F59E0B]">TVA la încasare</span>
                </div>
                <p className="text-xs text-gray-600">
                  TVA la încasare activ
                  {company.vatIncasareDetails?.startDate && (
                    <span className="block mt-1">Din: {formatDate(company.vatIncasareDetails.startDate)}</span>
                  )}
                </p>
              </div>
            )}
          </div>
        </div>

        {/* VAT Periods */}
        {company.vatRegistration?.periods && company.vatRegistration.periods.length > 0 && (
          <div>
            <h4 className="text-sm font-semibold text-gray-900 mb-3">
              Perioade TVA
            </h4>
            <div className="space-y-2">
              {company.vatRegistration.periods.slice(0, 5).map((period, idx) => (
                <div key={idx} className="p-3 bg-gray-50 rounded-lg border border-gray-200 text-xs">
                  <div className="flex items-center justify-between mb-1">
                    <span className="font-medium text-gray-900">
                      {formatDate(period.data_inceput_ScpTVA)} - {formatDate(period.data_sfarsit_ScpTVA)}
                    </span>
                  </div>
                  {period.mesaj_ScpTVA && (
                    <p className="text-gray-500">{period.mesaj_ScpTVA}</p>
                  )}
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Company Status */}
        <div>
          <h4 className="text-sm font-semibold text-gray-900 mb-3">
            Status companie
          </h4>
          <div className="grid grid-cols-2 gap-4">
            <div className="p-4 bg-gray-50 rounded-lg border border-gray-200">
              <p className="text-xs text-gray-500 mb-1">Status înregistrare</p>
              <p className="text-sm font-medium text-gray-900">{company.status}</p>
            </div>
            <div className="p-4 bg-gray-50 rounded-lg border border-gray-200">
              <p className="text-xs text-gray-500 mb-1">Status activitate</p>
              {company.isInactive ? (
                <div className="flex items-center gap-2">
                  <XCircle className="w-4 h-4 text-[#EF4444]" />
                  <span className="text-sm font-medium text-[#EF4444]">Inactiv</span>
                </div>
              ) : (
                <div className="flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-[#22C55E]" />
                  <span className="text-sm font-medium text-[#22C55E]">Activ</span>
                </div>
              )}
            </div>
          </div>
          {company.isInactive && company.inactiveDate && (
            <div className="mt-3 p-3 bg-[#EF4444]/10 border border-[#EF4444]/20 rounded-lg">
              <p className="text-xs text-[#EF4444]">
                <strong>Data inactivare:</strong> {formatDate(company.inactiveDate)}
              </p>
              {company.reactivationDate && (
                <p className="text-xs text-[#EF4444] mt-1">
                  <strong>Data reactivare:</strong> {formatDate(company.reactivationDate)}
                </p>
              )}
            </div>
          )}
        </div>

        {/* Addresses */}
        {(company.fiscalAddress || company.socialAddress) && (
          <div>
            <h4 className="text-sm font-semibold text-gray-900 mb-3">
              Adrese
            </h4>
            <div className="space-y-3">
              {company.fiscalAddress && (
                <div className="p-4 bg-gray-50 rounded-lg border border-gray-200">
                  <p className="text-xs font-semibold text-gray-900 mb-2">Domiciliu fiscal</p>
                  <p className="text-xs text-gray-600">
                    {company.fiscalAddress.sdenumire_Strada} {company.fiscalAddress.snumar_Strada}
                    <br />
                    {company.fiscalAddress.scod_Postal} {company.fiscalAddress.sdenumire_Localitate}
                    <br />
                    {company.fiscalAddress.sdenumire_Judet}
                  </p>
                </div>
              )}
              {company.socialAddress && (
                <div className="p-4 bg-gray-50 rounded-lg border border-gray-200">
                  <p className="text-xs font-semibold text-gray-900 mb-2">Sediu social</p>
                  <p className="text-xs text-gray-600">
                    {company.socialAddress.sdenumire_Strada} {company.socialAddress.snumar_Strada}
                    <br />
                    {company.socialAddress.scod_Postal} {company.socialAddress.sdenumire_Localitate}
                    <br />
                    {company.socialAddress.sdenumire_Judet}
                  </p>
                </div>
              )}
            </div>
          </div>
        )}

        {/* IBAN */}
        {company.iban && (
          <div>
            <h4 className="text-sm font-semibold text-gray-900 mb-2">
              IBAN
            </h4>
            <p className="text-sm font-mono text-gray-900 bg-gray-50 p-3 rounded-lg border border-gray-200">
              {company.iban}
            </p>
          </div>
        )}

        {/* e-Invoice Status */}
        <div className="p-4 bg-gray-50 rounded-lg border border-gray-200">
          <div className="flex items-center justify-between">
            <span className="text-xs text-gray-500">Facturare electronică</span>
            {company.eInvoiceStatus ? (
              <span className="px-2 py-1 rounded-lg text-xs font-semibold text-[#22C55E] bg-[#22C55E]/10 flex items-center gap-1">
                <CheckCircle2 className="w-3 h-3" />
                Activă
              </span>
            ) : (
              <span className="px-2 py-1 rounded-lg text-xs font-semibold text-gray-500 bg-gray-100">
                Inactivă
              </span>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}

