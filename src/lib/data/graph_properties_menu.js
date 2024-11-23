let peopleMenu = [
  { label: 'academic appointment', wikidataId: 'P8413', ddcId: '' },
  { label: 'award received', wikidataId: 'P166', ddcId: '' },
  // { label: 'copyright status as a creator', wikidataId: 'P7763', ddcId: ''  },
  // { label: 'documentation files at', wikidataId: 'P10527', ddcId: ''  },
  { label: 'educated at', wikidataId: 'P69', ddcId: '' },
  { label: 'employer', wikidataId: 'P108', ddcId: '' },
  // { label: 'exhibited creator', wikidataId: 'P10661', ddcId: ''  },
  { label: 'founded by', wikidataId: 'P112', ddcId: '' },
  // { label: 'has works in the collection', wikidataId: 'P6379', ddcId: ''  },
  // { label: 'member of', wikidataId: 'P463', ddcId: ''  },
  { label: 'nominated for', wikidataId: 'P1411', ddcId: '' },
  { label: 'notable works', wikidataId: 'P800', ddcId: '' },
  // { label: 'occupation', wikidataId: 'P106', ddcId: ''  },
  { label: 'professorship', wikidataId: 'P803', ddcId: '' },
  { label: 'student of', wikidataId: 'P1066', ddcId: '' },
  { label: 'student', wikidataId: 'P802', ddcId: '' },
  { label: 'work location', wikidataId: 'P937', ddcId: '' },
  { label: 'winner', wikidataId: 'P1346', ddcId: '' }
];
let rolesMenu = [
  { label: 'art director', wikidataId: 'P3174', ddcId: 'P198 P110' },
  { label: 'cast member', wikidataId: 'P161', ddcId: '' },
  { label: 'choreographer', wikidataId: 'P1809', ddcId: 'P116' },
  { label: 'composer', wikidataId: 'P86', ddcId: 'P123 P172' },
  { label: 'costume designer', wikidataId: 'P2515', ddcId: 'P127' },
  { label: 'curator', wikidataId: 'P1640', ddcId: 'P128' },
  { label: 'director', wikidataId: 'P57', ddcId: 'P118 P132' },
  { label: 'director/manager', wikidataId: 'P1037', ddcId: 'P122 P205 P136 P182 P185' },
  { label: 'executive producer', wikidataId: 'P1431', ddcId: 'P223 P164' },
  { label: 'film editor', wikidataId: 'P1040', ddcId: 'P229 P190' },
  { label: 'illustrator', wikidataId: 'P110', ddcId: 'P220 P156' },
  { label: 'librettist', wikidataId: 'P87', ddcId: 'P145' },
  { label: 'lighting designer', wikidataId: 'P5026', ddcId: 'P146' },
  { label: 'make-up artist', wikidataId: 'P4805', ddcId: 'P218' },
  // { label: 'main subject', wikidataId: 'P921', ddcId: '' },
  { label: 'musical conductor', wikidataId: 'P3300', ddcId: 'P124 P207 P152' },
  {
    label: 'performer',
    wikidataId: 'P175',
    ddcId: 'P106 P112 P119 P129 P130 P131 P150 P154 P155 P171 P179 P187 P188 P191'
  },
  { label: 'presenter', wikidataId: 'P371', ddcId: 'P160' },
  { label: 'producer', wikidataId: 'P162', ddcId: 'P162' },
  { label: 'production designer', wikidataId: 'P2554', ddcId: '' },
  { label: 'scenographer', wikidataId: 'P4608', ddcId: 'P224 P170' },
  { label: 'sound designer', wikidataId: 'P5028', ddcId: 'P173' },
  { label: 'speaker', wikidataId: 'P823', ddcId: 'P175' },
  {
    label: 'stage crew member',
    wikidataId: 'P5802',
    ddcId:
      'P108 P109 P113 P114 P115 P125 P135 P137 P138 P139 P144 P147 P159 P161 P163 P165 P166 P167 P168 P169 P174 P176 P177 P178 P180 P181 P183 P189 P192 P193 P197'
  },
  { label: 'translator', wikidataId: 'P655', ddcId: 'P186 P228' }
];
let worksMenu = [
  { label: 'location of first performance', wikidataId: 'P4647', ddcId: '' },
  { label: 'part of the series', wikidataId: 'P179', ddcId: 'P142 P214' },
  { label: 'production company', wikidataId: 'P272', ddcId: 'P121 P204' },
  { label: 'recorded at studio or venue', wikidataId: 'P483', ddcId: '' },
  { label: 'recording or performance of', wikidataId: 'P2550', ddcId: 'P140 P141 P213' }
];

export let allMenuOptions = {
  people: peopleMenu,
  roles: rolesMenu,
  works: worksMenu
};
