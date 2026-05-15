import { quickLinks } from '@/data/student-zone'

export function QuickLinks() {
  return (
    <div className="flex flex-wrap gap-3 justify-center">
      {quickLinks.map((link) => (
        <a
          key={link.href}
          href={link.href}
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex items-center gap-2 px-5 py-2.5 rounded-full border-2 border-primary text-primary text-[0.85rem] font-bold hover:bg-primary hover:text-white transition-all duration-300"
        >
          {link.text}
          <svg xmlns="http://www.w3.org/2000/svg" width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true"><path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6"/><polyline points="15 3 21 3 21 9"/><line x1="10" y1="14" x2="21" y2="3"/></svg>
        </a>
      ))}
    </div>
  )
}
