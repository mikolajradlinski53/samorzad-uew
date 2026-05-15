import { FaTiktok, FaFacebook, FaLinkedin, FaInstagram } from 'react-icons/fa'
import Link from 'next/link'
import { contactInfo } from '@/data/contact'
import { socialLinks } from '@/data/social'

const iconMap: Record<string, React.ComponentType<{ className?: string }>> = {
  tiktok:    FaTiktok,
  facebook:  FaFacebook,
  linkedin:  FaLinkedin,
  instagram: FaInstagram,
}

export function Footer() {
  return (
    <footer className="bg-ssuew-black text-white py-16">
      <div className="max-w-[1200px] mx-auto px-6">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-12 mb-12">

          {/* Column 1: Address */}
          <div>
            <h4 className="text-[0.85rem] font-bold uppercase tracking-widest text-ssuew-gray-200 mb-4">
              Adres
            </h4>
            <address className="not-italic text-white/60 text-[0.85rem] leading-relaxed">
              {contactInfo.addressLines.map((line, i) => (
                <span key={i} className="block">{line}</span>
              ))}
            </address>
          </div>

          {/* Column 2: Social Media */}
          <div>
            <h4 className="text-[0.85rem] font-bold uppercase tracking-widest text-ssuew-gray-200 mb-4">
              Social Media
            </h4>
            <div className="flex gap-3">
              {socialLinks.map((link) => {
                const Icon = iconMap[link.platform]
                return (
                  <a
                    key={link.platform}
                    href={link.href}
                    aria-label={link.ariaLabel}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="w-[40px] h-[40px] rounded-full border border-white/20 flex items-center justify-center text-white/70 text-base transition-all duration-300 hover:bg-primary hover:border-primary hover:text-white focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2 focus-visible:ring-offset-ssuew-black"
                  >
                    {Icon && <Icon className="w-4 h-4" />}
                  </a>
                )
              })}
            </div>
          </div>

          {/* Column 3: Contact */}
          <div>
            <h4 className="text-[0.85rem] font-bold uppercase tracking-widest text-ssuew-gray-200 mb-4">
              Kontakt
            </h4>
            <Link
              href={`mailto:${contactInfo.email}`}
              className="text-primary hover:text-primary-dark text-[0.85rem] transition-colors duration-300 focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2 focus-visible:ring-offset-ssuew-black rounded"
            >
              {contactInfo.email}
            </Link>
          </div>
        </div>

        {/* Copyright */}
        <div className="border-t border-white/10 pt-8 text-center text-white/40 text-[0.85rem]">
          © 2026 Samorząd Studentów UEW
        </div>
      </div>
    </footer>
  )
}
