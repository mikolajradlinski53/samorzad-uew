export interface Projekt {
  title: string
  tag: string
  description: string
}

export const projekty: Projekt[] = [
  { title: 'ADAPCIAK',                    tag: 'Integracja',   description: 'Ośmiodniowy obóz dla pierwszorocznych studentów z atrakcjami i imprezami tematycznymi.' },
  { title: 'ANIMALIA',                    tag: 'Charytatywny', description: 'Projekt charytatywny na ratowanie zagrożonych gatunków zwierząt we współpracy z wrocławskim ZOO i Fundacją DODO.' },
  { title: 'BAL UEW',                     tag: 'Wydarzenie',   description: 'Coroczny bal akademicki UEW łączący kadrę, studentów i absolwentów. Wręczenie statuetek „Ekonomki".' },
  { title: 'DNI ADAPTACYJNE',             tag: 'Edukacja',     description: 'Prelekcje i szkolenia dla pierwszorocznych — prawa, obowiązki, zasady uczelni + imprezy integracyjne.' },
  { title: 'GRADUETION',                  tag: 'Tradycja',     description: 'Ceremonia wręczenia dyplomów z togi i birety — tradycja inspirowana USA. Rzut czapeczkami.' },
  { title: 'MOSTY EKONOMICZNE',           tag: 'Wymiana',      description: 'Wymiana studentów z 5 uczelni ekonomicznych w Polsce. Wykłady, warsztaty, case studies. Od 2005 roku.' },
  { title: 'TEST WIEDZY EKONOMICZNEJ',    tag: 'Konkurs',      description: 'Unikatowy test wiedzy współtworzony przez 5 samorządów. Formuła wzorowana na TVP.' },
  { title: 'TEDxUEW',                     tag: 'Inspiracja',   description: 'Lokalne TEDx — prelegenci z krótkimi inspirującymi prelekcjami dla studentów UEW.' },
  { title: 'UE PARTY',                    tag: 'Rozrywka',     description: 'Cykl imprez dedykowanych studentom UEW i wszystkim studentom Wrocławia.' },
]
