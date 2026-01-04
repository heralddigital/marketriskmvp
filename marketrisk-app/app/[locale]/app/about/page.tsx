'use client'

import React from 'react'
import Link from 'next/link'
import { Check, Shield, Target, Users, TrendingUp, Bell } from 'lucide-react'

export default function AboutPage() {
  return (
    <div className="p-8 bg-[var(--surface-paper)] min-h-full">
      <div className="space-y-12 max-w-5xl">
        {/* Hero Section */}
        <section>
          <div>
            <p className="text-xs text-[var(--text-muted)] mb-2">Despre noi</p>
            <h1 className="text-3xl md:text-4xl font-semibold text-[var(--text-primary)] mb-4" style={{ letterSpacing: '-0.5px' }}>
              Construit pentru raportare de risc clară și credibilă
            </h1>
            <p className="text-lg text-[var(--text-secondary)] max-w-3xl">
              <span className="text-[var(--brand-mughal-green)] font-medium">marketrisk</span> ajută IMM-urile românești să transforme datele despre riscul de credit în decizii clare—fără dashboard-uri aglomerate, derapaje în spreadsheet-uri sau surprize de ultimă oră.
            </p>
          </div>
        </section>

        {/* Who We Are */}
        <section>
          <div className="mb-6">
            <p className="text-xs text-[var(--text-muted)] mb-2">Cine suntem</p>
            <h2 className="text-2xl font-semibold text-[var(--text-primary)]" style={{ letterSpacing: '-0.3px' }}>
              O echipă concentrată pe succesul afacerilor românești
            </h2>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="bg-white border border-[var(--border-subtle)] p-6 rounded-[4px] hover:shadow-sm transition-all">
              <h3 className="text-lg font-medium text-[var(--text-primary)] mb-3">Povestea noastră</h3>
              <p className="text-sm text-[var(--text-secondary)] mb-4">
                <span className="text-[var(--brand-mughal-green)] font-medium">marketrisk</span> s-a născut dintr-o observație simplă: IMM-urile românești pierdeau bani din cauza datoriilor neperformante pentru că nu aveau instrumente simple și accesibile pentru a monitoriza riscul de credit al partenerilor lor. Soluțiile tradiționale erau fie prea scumpe, fie prea complexe, fie nu se concentrau pe piața românească.
              </p>
              <p className="text-sm text-[var(--text-secondary)]">
                Ne-am propus să construim ceva diferit—un instrument accesibil, transparent și conceput special pentru modul în care funcționează afacerile românești. Fără cicluri de vânzări enterprise, fără costuri ascunse, doar alerte clare când ceva se schimbă.
              </p>
            </div>
            <div className="bg-white border border-[var(--border-subtle)] p-6 rounded-[4px] hover:shadow-sm transition-all">
              <h3 className="text-lg font-medium text-[var(--text-primary)] mb-3">Misiunea noastră</h3>
              <p className="text-sm text-[var(--text-secondary)] mb-4">
                Să împuternicim IMM-urile românești cu instrumentele de care au nevoie pentru a-și proteja fluxul de numerar și pentru a lua decizii de afaceri informate. Credem că fiecare afacere, indiferent de dimensiune, merită acces la monitorizarea profesională a riscului.
              </p>
              <p className="text-sm text-[var(--text-secondary)]">
                Suntem dedicați transparenței, simplității și punem succesul clienților noștri pe primul loc. Asta înseamnă prețuri clare, funcții directe și suport care chiar ajută.
              </p>
            </div>
          </div>
        </section>

        {/* What We Do */}
        <section>
          <div className="mb-6">
            <p className="text-xs text-[var(--text-muted)] mb-2">Ce facem</p>
            <h2 className="text-2xl font-semibold text-[var(--text-primary)]" style={{ letterSpacing: '-0.3px' }}>
              Monitorizare simplă a riscului de credit pentru IMM-urile românești
            </h2>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="bg-white border border-[var(--border-subtle)] p-6 rounded-[4px] hover:shadow-sm transition-all">
              <div className="w-10 h-10 bg-[var(--brand-pistachio)]/10 flex items-center justify-center rounded-[4px] mb-4">
                <Shield className="w-5 h-5 text-[var(--brand-mughal-green)]" />
              </div>
              <h3 className="text-lg font-medium text-[var(--text-primary)] mb-2">Monitorizare risc de credit</h3>
              <p className="text-sm text-[var(--text-secondary)]">
                Monitorizează până la 250 de companii în watchlist-ul tău. Primește alerte în timp real despre dosare de insolvență, cazuri în instanță, datorii fiscale și alte modificări critice care ar putea afecta afacerea ta.
              </p>
            </div>
            <div className="bg-white border border-[var(--border-subtle)] p-6 rounded-[4px] hover:shadow-sm transition-all">
              <div className="w-10 h-10 bg-[var(--brand-pistachio)]/10 flex items-center justify-center rounded-[4px] mb-4">
                <Bell className="w-5 h-5 text-[var(--brand-mughal-green)]" />
              </div>
              <h3 className="text-lg font-medium text-[var(--text-primary)] mb-2">Alerte proactive</h3>
              <p className="text-sm text-[var(--text-secondary)]">
                Nu aștepta ca problemele să apară. Sistemul nostru monitorizează BPI (Proceduri de Insolvență), cazurile în instanță (Dosare) și datoriile fiscale ANAF, trimitându-ți alerte acționabile când ceva se schimbă.
              </p>
            </div>
            <div className="bg-white border border-[var(--border-subtle)] p-6 rounded-[4px] hover:shadow-sm transition-all">
              <div className="w-10 h-10 bg-[var(--brand-pistachio)]/10 flex items-center justify-center rounded-[4px] mb-4">
                <Target className="w-5 h-5 text-[var(--brand-mughal-green)]" />
              </div>
              <h3 className="text-lg font-medium text-[var(--text-primary)] mb-2">Prețuri transparente</h3>
              <p className="text-sm text-[var(--text-secondary)]">
                Fără taxe ascunse, fără ziduri "contactează vânzările". Alege din planurile Free, Starter (€39), PRO (€99) sau Enterprise. Upgrade-uri self-serve, limite clare și prețuri care se adaptează nevoilor tale.
              </p>
            </div>
          </div>
        </section>

        {/* How We Do It */}
        <section>
          <div className="mb-6">
            <p className="text-xs text-[var(--text-muted)] mb-2">Cum o facem</p>
            <h2 className="text-2xl font-semibold text-[var(--text-primary)]" style={{ letterSpacing: '-0.3px' }}>
              Construit pe principii care contează
            </h2>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
            <div className="bg-white border border-[var(--border-subtle)] p-6 rounded-[4px] hover:shadow-sm transition-all">
              <p className="text-xs text-[var(--text-muted)] mb-2">Principiu</p>
              <h3 className="text-lg font-medium text-[var(--text-primary)] mb-2">Claritate în loc de aglomerație</h3>
              <p className="text-sm text-[var(--text-secondary)]">
                Ierarhia, spațierea și valorile implicite deliberate fac povestea evidentă dintr-o privire. Fără supraîncărcare de informații—doar ce ai nevoie, când ai nevoie.
              </p>
            </div>
            <div className="bg-white border border-[var(--border-subtle)] p-6 rounded-[4px] hover:shadow-sm transition-all">
              <p className="text-xs text-[var(--text-muted)] mb-2">Principiu</p>
              <h3 className="text-lg font-medium text-[var(--text-primary)] mb-2">Numere de încredere</h3>
              <p className="text-sm text-[var(--text-secondary)]">
                Formatare consistentă, delte lizibile și modele prietenoase cu auditul reduc momentele "Care număr este corect?". Poți avea încredere în date pentru că le obținem din registrele oficiale românești.
              </p>
            </div>
            <div className="bg-white border border-[var(--border-subtle)] p-6 rounded-[4px] hover:shadow-sm transition-all">
              <p className="text-xs text-[var(--text-muted)] mb-2">Principiu</p>
              <h3 className="text-lg font-medium text-[var(--text-primary)] mb-2">Decizii rapide</h3>
              <p className="text-sm text-[var(--text-secondary)]">
                Rezumatelor sunt concepute pentru acțiune: ce s-a schimbat, de ce contează și ce să faci în continuare. Primește alerte pe telefon, verifică statusul în secunde, acționează înainte ca problemele să escaladeze.
              </p>
            </div>
          </div>
          <div className="bg-[var(--brand-mughal-green)] rounded-[4px] p-8 relative overflow-hidden">
            <div className="absolute inset-0 opacity-20">
              <svg className="w-full h-full" xmlns="http://www.w3.org/2000/svg">
                <rect
                  x="66%"
                  y="-10%"
                  width="360"
                  height="220"
                  rx="4"
                  fill="none"
                  stroke="rgba(220, 222, 197, 0.28)"
                  strokeWidth="1"
                />
              </svg>
            </div>
            <div className="relative z-10">
              <h3 className="text-xl font-semibold text-white mb-3" style={{ letterSpacing: '-0.3px' }}>
                Conceput pentru actualizări importante
              </h3>
              <p className="text-white/80 text-sm max-w-2xl mb-4">
                Fie că este o revizuire săptămânală a riscului sau o verificare executivă, <span className="text-white font-medium">marketrisk</span> păstrează narațiunea curată și semnalul puternic. Designul mobile-first înseamnă că poți verifica alertele oriunde, oricând.
              </p>
              <ul className="space-y-2 text-sm text-white/80">
                <li className="flex items-start gap-2">
                  <Check size={16} className="text-[var(--brand-pistachio)] mt-[2px] flex-shrink-0" />
                  <span>Monitorizare în timp real a registrelor de afaceri românești (ONRC, BPI, ANAF)</span>
                </li>
                <li className="flex items-start gap-2">
                  <Check size={16} className="text-[var(--brand-pistachio)] mt-[2px] flex-shrink-0" />
                  <span>Gestionare simplă a watchlist-ului cu tag-uri și note</span>
                </li>
                <li className="flex items-start gap-2">
                  <Check size={16} className="text-[var(--brand-pistachio)] mt-[2px] flex-shrink-0" />
                  <span>Exporturi PDF pentru rapoarte și documentație</span>
                </li>
                <li className="flex items-start gap-2">
                  <Check size={16} className="text-[var(--brand-pistachio)] mt-[2px] flex-shrink-0" />
                  <span>Colaborare în echipă cu acces bazat pe roluri</span>
                </li>
              </ul>
            </div>
          </div>
        </section>

        {/* Why We Do It */}
        <section>
          <div className="mb-6">
            <p className="text-xs text-[var(--text-muted)] mb-2">De ce o facem</p>
            <h2 className="text-2xl font-semibold text-[var(--text-primary)]" style={{ letterSpacing: '-0.3px' }}>
              Pentru că datoria neperformantă nu ar trebui să fie o surpriză
            </h2>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
            <div className="bg-white border border-[var(--border-subtle)] p-6 rounded-[4px] hover:shadow-sm transition-all">
              <h3 className="text-lg font-medium text-[var(--text-primary)] mb-3">Problema pe care o rezolvăm</h3>
              <p className="text-sm text-[var(--text-secondary)] mb-4">
                IMM-urile românești pierd milioane de euro în fiecare an din cauza datoriilor neperformante. Adesea, semnalele de avertizare erau acolo—dosare de insolvență, cazuri în instanță, datorii fiscale—dar afacerile nu știau despre ele la timp pentru a acționa.
              </p>
              <p className="text-sm text-[var(--text-secondary)]">
                Soluțiile tradiționale de monitorizare a creditului sunt scumpe, complexe sau nu se concentrează pe piața românească. Afacerile mici ajung fie să plătească prea mult pentru instrumente enterprise de care nu au nevoie, fie să meargă fără protecție deloc.
              </p>
            </div>
            <div className="bg-white border border-[var(--border-subtle)] p-6 rounded-[4px] hover:shadow-sm transition-all">
              <h3 className="text-lg font-medium text-[var(--text-primary)] mb-3">Viziunea noastră</h3>
              <p className="text-sm text-[var(--text-secondary)] mb-4">
                Ne imaginăm o Românie în care fiecare IMM are acces la instrumente profesionale de monitorizare a riscului. Unde datoria neperformantă este excepția, nu regula. Unde afacerile se pot concentra pe creștere, nu pe îngrijorarea dacă partenerii lor vor plăti.
              </p>
              <p className="text-sm text-[var(--text-secondary)]">
                Credem în transparență, echitate și construirea de instrumente care chiar funcționează pentru oamenii care le folosesc. Fără umflături enterprise, fără funcții confuze—doar informații clare și acționabile despre risc.
              </p>
            </div>
          </div>
          <div className="bg-white border border-[var(--border-subtle)] rounded-[4px] p-8">
            <h3 className="text-lg font-medium text-[var(--text-primary)] mb-4">Valorile noastre</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <h4 className="text-sm font-medium text-[var(--text-primary)] mb-2">Transparență</h4>
                <p className="text-sm text-[var(--text-secondary)]">
                  Prețuri clare, comunicare onestă și fără surprize ascunse. Ceea ce vezi este ceea ce primești.
                </p>
              </div>
              <div>
                <h4 className="text-sm font-medium text-[var(--text-primary)] mb-2">Simplitate</h4>
                <p className="text-sm text-[var(--text-secondary)]">
                  Problemele complexe merită soluții simple. Tăiem prin zgomot pentru a livra ceea ce contează.
                </p>
              </div>
              <div>
                <h4 className="text-sm font-medium text-[var(--text-primary)] mb-2">Accesibilitate</h4>
                <p className="text-sm text-[var(--text-secondary)]">
                  Instrumentele profesionale nu ar trebui să fie rezervate doar pentru întreprinderile mari. Fiecare afacere merită protecție.
                </p>
              </div>
              <div>
                <h4 className="text-sm font-medium text-[var(--text-primary)] mb-2">Succesul clienților</h4>
                <p className="text-sm text-[var(--text-secondary)]">
                  Succesul tău este succesul nostru. Construim funcții care rezolvă probleme reale, nu doar bifă casete.
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* Call to Action */}
        <section className="bg-[var(--brand-mughal-green)] rounded-[4px] p-8 md:p-12 relative overflow-hidden">
          <div className="absolute inset-0 opacity-10">
            <svg className="w-full h-full" xmlns="http://www.w3.org/2000/svg">
              <defs>
                <pattern id="grid-about" width="40" height="40" patternUnits="userSpaceOnUse">
                  <path d="M 40 0 L 0 0 0 40" fill="none" stroke="var(--brand-pistachio)" strokeWidth="1"/>
                </pattern>
              </defs>
              <rect width="100%" height="100%" fill="url(#grid-about)" />
            </svg>
          </div>
          <div className="relative z-10 max-w-2xl mx-auto text-center">
            <h2 className="text-2xl md:text-3xl font-semibold text-white mb-4" style={{ letterSpacing: '-0.5px' }}>
              Gata să-ți protejezi afacerea?
            </h2>
            <p className="text-white/80 text-lg mb-6">
              Alătură-te listei de așteptare pentru a fi notificat când lansăm. Acces timpuriu disponibil pentru testerii beta.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link
                href="/app/dashboard"
                className="px-6 py-3 bg-white text-[var(--brand-mughal-green)] rounded-[4px] font-medium text-sm hover:shadow-sm transition-all text-center"
              >
                Vezi dashboard-ul
              </Link>
              <Link
                href="/pricing"
                className="px-6 py-3 bg-white/10 text-white border border-white/20 rounded-[4px] font-medium text-sm hover:bg-white/20 transition-all text-center"
              >
                Vezi prețurile
              </Link>
            </div>
          </div>
        </section>
      </div>
    </div>
  )
}

