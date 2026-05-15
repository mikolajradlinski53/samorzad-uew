export interface PrawoStudenta {
  title: string
  content: string
}

export const prawaNr: PrawoStudenta[] = [
  {
    title: 'Powtarzania zajęć',
    content: 'Student ma prawo do powtarzania określonych zajęć w przypadku niezadowalających wyników w nauce, z zastrzeżeniem warunków określonych w regulaminie uczelni.',
  },
  {
    title: 'Indywidualnej organizacji studiów',
    content: 'Prawo do ubiegania się o indywidualną organizację studiów (IOS) umożliwiającą elastyczne dostosowanie programu do indywidualnych potrzeb i możliwości studenta.',
  },
  {
    title: 'Usprawiedliwienia nieobecności',
    content: 'Prawo do usprawiedliwienia nieobecności i urlopu od zajęć oraz przystąpienia do egzaminów w innym terminie niż pierwotnie wyznaczony.',
  },
  {
    title: 'Zmiany kierunku studiów',
    content: 'Możliwość zmiany kierunku studiów przy zachowaniu procedur określonych w regulaminie uczelni.',
  },
  {
    title: 'Przenoszenia i uznawania punktów ECTS',
    content: 'Prawo do przenoszenia i uznawania punktów ECTS — zarówno krajowych jak i zagranicznych — zgodnie z zasadami mobilności akademickiej.',
  },
  {
    title: 'Egzaminu komisyjnego',
    content: 'Prawo do przystąpienia do egzaminu komisyjnego przy udziale wskazanego przez studenta obserwatora.',
  },
  {
    title: 'Zmiany trybu studiów',
    content: 'Prawo do przeniesienia między studiami stacjonarnymi a niestacjonarnymi zgodnie z procedurami uczelni.',
  },
]
