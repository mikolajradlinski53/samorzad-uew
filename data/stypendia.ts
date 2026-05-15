export interface StypendiaTile {
  title: string
  href: string
}

export interface StypendiumAttachment {
  number: string
  description: string
  href: string
}

export const stypendiaTiles: StypendiaTile[] = [
  { title: 'SOCJALNE',              href: '/stypendia-socjalne' },
  { title: 'REKTORA',               href: '/stypendia-rektora' },
  { title: 'DLA NIEPEŁNOSPRAWNYCH', href: '/stypendia-dla-niepelnosprawnych' },
  { title: 'ZAPOMOGI',              href: '/zapomoga' },
]

export const stypendiaAttachments: StypendiumAttachment[] = [
  { number: 'Zał. 1',  description: 'Wykaz dokumentacji przy ubieganiu się o stypendium socjalne',          href: 'https://drive.google.com/file/d/18eMIfTCKHe2VkeNhqpbcnE2_dnEfzpv8/view' },
  { number: 'Zał. 2',  description: 'Zasady obliczania dochodu w rodzinie studenta',                        href: 'https://drive.google.com/file/d/1sUkRyknAvDzJAu5WsbBGTuAZDF_ZLSC5/view' },
  { number: 'Zał. 3',  description: 'Zasady oceny osiągnięć naukowych/artystycznych/sportowych do stypendium rektora', href: 'https://drive.google.com/file/d/1ym8hSvH1DNQQfn5TyraKYB7oOeLp3ujJ/view' },
  { number: 'Zał. 4',  description: 'Dane do wyznaczania stypendiów',                                       href: 'https://drive.google.com/file/d/12ZNO2gfq3WHVM5YFSF7EIfImueUJV0-f/view' },
  { number: 'Zał. 5',  description: 'Oświadczenia do stypendium socjalnego',                                href: 'https://drive.google.com/file/d/1wINSrsZjdD1y-Mcq7R7g8TvU4yLhJHR6/view' },
  { number: 'Zał. 6',  description: 'Kwestionariusz rejestracyjny studenta z orzeczoną niepełnosprawnością', href: 'https://drive.google.com/file/d/1PJA2Y43M5ubTk0e_yLQiTdS_vP-0PSzm/view' },
  { number: 'Zał. 7',  description: 'Zasady zakwaterowania w domach studenckich',                           href: 'https://drive.google.com/file/d/1mncNxNd0vN4lx70GNbBqzFHuuGMA_Xo/view' },
  { number: 'Zał. 8',  description: 'Oświadczenie o braku zmiany sytuacji materialnej',                     href: 'https://drive.google.com/file/d/1nLdfEub6IrCZmyU789Ph82greUVmEQRf/view' },
  { number: 'Zał. 9',  description: 'Oświadczenie dot. nie prowadzenia gospodarstwa z rodzicami',           href: 'https://drive.google.com/file/d/1-MDxZO8_It7JvGJkbvvWjqPm8oiQXsH9/view' },
  { number: 'Zał. 10', description: 'Wzór zgody i klauzuli informacyjnej',                                  href: 'https://drive.google.com/file/d/12ZNO2gfq3WHVM5YFSF7EIfImueUJV0-f/view' },
]
