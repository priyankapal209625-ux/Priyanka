import type {
  CategoryGuideItem,
  IndianStateGuidance,
  MaterialRecyclingGuide,
  PlasticResinCode,
} from '../types/waste';

export const HERO_IMAGE_URL =
  '/src/assets/images/hero_ecosmart_sorting_1795672702331.jpg';

export const SAMPLE_SCAN_PHOTOS = [
  {
    id: 'sample-dry',
    label: 'Dry Waste Containers',
    hint: 'PET bottle, aluminum can, cardboard box, glass jar',
    imageUrl: '/src/assets/images/category_recyclable_1795672704041.jpg',
  },
  {
    id: 'sample-wet',
    label: 'Wet Kitchen Scraps',
    hint: 'Fruit peels, coffee/tea grounds, fresh leaves',
    imageUrl: '/src/assets/images/category_biodegradable_1795672702368.jpg',
  },
  {
    id: 'sample-mixed',
    label: 'Non-Recyclable Dry Items',
    hint: 'Thermocol cup, foil snack wrapper, sponge, broken ceramic',
    imageUrl: '/src/assets/images/category_non_recyclable_1795672703846.jpg',
  },
] as const;

export const QUICK_TEXT_EXAMPLES = [
  'Empty milk packet (LDPE pouch)',
  'Used AA batteries & old phone charger',
  'Vegetable peels & puja flowers',
  'Used sanitary pad or baby diaper',
  'Expired medicine blister strip',
  'Biscuit & chips foil wrapper',
] as const;

/**
 * Four mandatory waste streams under India's Solid Waste Management (SWM) Rules, 2026
 * Notified by MoEFCC, Government of India (effective April 1, 2026).
 */
export const WASTE_CATEGORIES: CategoryGuideItem[] = [
  {
    id: 'wet-waste',
    streamNumber: '01',
    title: 'Wet Waste',
    categoryType: 'Wet Waste',
    handlingChannel: 'Composting / Bio-methanation / Municipal Wet Collection',
    summary:
      'Kitchen food scraps, vegetable and fruit peels, tea leaves, puja flowers, and garden leaves that decompose naturally into rich compost.',
    whyItMatters:
      'Separating wet kitchen waste at source prevents foul odour and landfill methane, keeps dry recyclables clean, and supports home or community composting.',
    imageUrl: '/src/assets/images/category_biodegradable_1795672702368.jpg',
    imageAlt:
      'Overhead view of banana peel, apple core, coffee grounds, green leaves, and dark organic compost soil',
    examples: [
      'Vegetable & fruit peels (sabzi peels, banana & citrus rinds)',
      'Leftover cooked food, rice, roti & dal scraps',
      'Used tea leaves (chai patti) & coffee grounds',
      'Puja flowers, garlands (without plastic threads) & garden leaves',
      'Eggshells, nutshells & spoiled grains',
      'Tender coconut shells (where accepted by local composters)',
    ],
    doRules: [
      'Drain excess watery gravy or tea liquid before placing scraps in your wet waste bin.',
      'Remove rubber bands, plastic wrappers, and synthetic threads from puja flowers and vegetable bundles.',
      'If composting at home or in a housing society, balance wet scraps with dry browns like dried leaves or cocopeat.',
    ],
    dontRules: [
      'Do not line your wet waste bin with ordinary single-use plastic bags; empty scraps directly or use newspaper.',
      'Never mix sanitary waste, batteries, broken glass, or medicine strips into wet kitchen waste.',
      'Do not place multi-layer food wrappers or thermocol plates in wet waste.',
    ],
  },
  {
    id: 'dry-waste',
    streamNumber: '02',
    title: 'Dry Waste',
    categoryType: 'Dry Waste',
    handlingChannel: 'Municipal Dry Collection / Material Recovery Facility (MRF) / Kabadiwala',
    summary:
      'Paper, newspapers, cardboard, plastics, milk packets, glass, metals, wood, rubber, and old textiles—covering both recyclable and non-recyclable dry materials.',
    whyItMatters:
      'Keeping dry waste completely free of food grease and moisture allows local kabadiwalas and Material Recovery Facilities (MRFs) to recover high-value paper, metal, glass, and rigid plastics.',
    imageUrl: '/src/assets/images/category_recyclable_1795672704041.jpg',
    imageAlt:
      'Overhead view of clean rinsed PET bottle, aluminum can, flattened cardboard box, and clear glass jar',
    examples: [
      'Newspapers (raddi), school notebooks & cardboard delivery boxes',
      'Rinsed plastic water bottles & dairy milk packets',
      'Glass pickle/sauce jars & metal biscuit/oil tins',
      'Chips, biscuit & chocolate multi-layer wrappers (cleaned & dry)',
      'Old clothes, torn textiles, wood scraps & rubber',
      'Thermocol & broken ceramic (wrapped safely inside dry waste)',
    ],
    doRules: [
      'Rinse milk packets, curd cups, and food jars briefly and let them dry so they do not spoil paper and cardboard.',
      'Flatten corrugated shipping boxes and bundle newspapers neatly for your local kabadiwala or dry waste vehicle.',
      'Wrap sharp broken glass or ceramic pieces tightly in thick newspaper and mark clearly before handing over.',
    ],
    dontRules: [
      'Do not mix food scraps, used diapers, sanitary pads, batteries, or CFL bulbs into dry waste.',
      'Do not cut off the tiny corner triangle completely when opening milk pouches—small loose plastic bits are hard to recover.',
      'Avoid burning dry plastic wrappers or leaf litter in open areas; open burning releases toxic smoke.',
    ],
  },
  {
    id: 'sanitary-waste',
    streamNumber: '03',
    title: 'Sanitary Waste',
    categoryType: 'Sanitary Waste',
    handlingChannel: 'Dedicated Sanitary Waste Collection (Wrapped & Separate)',
    summary:
      'Used diapers, sanitary pads, tampons, condoms, and soiled personal hygiene items that must be securely wrapped and kept separate.',
    whyItMatters:
      'Under India’s SWM Rules, 2026, separating and wrapping sanitary waste protects municipal sanitation workers from infection risks and prevents contamination of recyclable dry waste.',
    safetyNotice:
      'Never classify or mix sanitary waste with ordinary recyclable dry waste or wet compostable waste. Always wrap securely to protect sanitation workers.',
    examples: [
      'Used sanitary pads / napkins',
      'Used baby diapers & adult diapers',
      'Tampons & panty liners',
      'Used condoms',
      'Blood-soiled cotton, gauze & adhesive bandages',
      'Soiled personal hygiene wipes',
    ],
    doRules: [
      'Wrap every used pad or diaper securely in old newspaper or the disposal pouch provided by the manufacturer.',
      'Store wrapped sanitary waste in a separate, lidded small bin—clearly kept apart from Wet and Dry waste.',
      'Mark the wrapped packet clearly if advised by your municipality and hand it over in the dedicated sanitary waste compartment.',
    ],
    dontRules: [
      'Never flush sanitary pads, diapers, cotton, or wipes down toilets—they block drains and sewage plants.',
      'Never place loose, unwrapped sanitary waste in common dustbins where workers sort waste by hand.',
      'Do not mix sanitary waste into compost pits or recyclable dry waste bags.',
    ],
  },
  {
    id: 'special-care-waste',
    streamNumber: '04',
    title: 'Special Care Waste',
    categoryType: 'Special Care Waste',
    handlingChannel: 'Authorised Collection Centres / EPR Take-Back / Municipal Special Care Drop-Off',
    summary:
      'Household batteries, expired medicines, CFL bulbs, tube lights, paint containers, pesticide bottles, syringes, and household e-waste requiring specialised collection.',
    whyItMatters:
      'Heavy metals (mercury, lead, cadmium), flammable lithium cells, and chemical residues can leach into groundwater or cause sanitation truck fires if mixed with daily household waste.',
    safetyNotice:
      'Never place Special Care Waste, e-waste, or batteries in regular Wet, Dry, or Sanitary bins. Always use CPCB/SPCB-authorised collection channels or producer EPR take-back.',
    examples: [
      'Used AA/AAA, button-cell, mobile & inverter batteries',
      'Expired or unused medicines, syrups & blister strips',
      'CFL bulbs, fluorescent tube lights & mercury thermometers',
      'Leftover paint cans, thinners & pesticide containers',
      'Old mobile phones, chargers, earphones & small e-waste',
      'Household syringes, lancets & needles (in puncture-proof container)',
    ],
    doRules: [
      'Store batteries, old chargers, and bulbs in a dry, labelled box out of reach of children until drop-off.',
      'Stick clear adhesive tape over lithium or 9V battery terminals to prevent accidental short-circuits.',
      'Hand over electronics and batteries only to CPCB/SPCB-authorised recyclers, brand EPR take-back desks, or official municipal collection drives.',
    ],
    dontRules: [
      'Never throw lithium-ion batteries, swollen power banks, or phones in regular trash or burn them.',
      'Do not break CFL bulbs or tube lights—they contain toxic mercury vapour; wrap carefully in cardboard to avoid breakage.',
      'Never pour leftover paints, pesticides, or liquid medicines down sinks, drains, or soil.',
    ],
  },
];

export const RECYCLING_GUIDES: MaterialRecyclingGuide[] = [
  {
    id: 'plastics-milk',
    name: 'Plastic Bottles & Milk Packets',
    shortLabel: 'Plastics & Milk Packets',
    category: 'Dry Waste',
    channelLabel: 'Dry Waste · Kabadiwala / Municipal MRF',
    keyFact: '41.36 lakh tonnes plastic waste generated in India (2022–23)',
    keyFactSource: 'CPCB Annual Report on Plastic Waste Management Rules, 2022–23',
    overview:
      'PET water/cold-drink bottles (#1) and clean LDPE milk packets (#4) are among the most common plastics in Indian homes. Rinsing them briefly and keeping them dry makes recovery much easier.',
    prepSteps: [
      'Empty plastic water or beverage bottles, rinse lightly, crush gently to save space, and screw the cap back on.',
      'When opening milk or curd packets, snip a neat slant without detaching the tiny plastic corner piece so it stays attached and recyclable.',
      'Rinse milk pouches with a little water, turn inside-out or drain dry, and stack them cleanly inside your Dry Waste bag.',
      'Avoid banned single-use plastic items (identified under MoEFCC’s July 2022 ban such as plastic cutlery, stirrers, and thin carry bags).',
    ],
    reuseIdeas: [
      'Carry a steel or copper reusable water bottle to school, college, or travel instead of buying packaged drinking water.',
      'Use clean wide-mouth PET jars or sturdy HDPE detergent/oil containers for balcony planters or garden watering scoops.',
      'Switch to cloth bags (jhola) for sabzi mandi and kirana shopping so thin carry bags never enter the home.',
    ],
    avoidList: [
      'Do not throw unwashed, milk-filled pouches into Dry Waste—spoiled milk ruins paper and cardboard.',
      'Never burn multi-layer chips/biscuit wrappers or thermocol outdoors.',
      'Do not mix pesticide or chemical plastic bottles here (those belong in Special Care Waste).',
    ],
  },
  {
    id: 'paper-cardboard',
    name: 'Newspaper & Cardboard Boxes',
    shortLabel: 'Paper & Cardboard',
    category: 'Dry Waste',
    channelLabel: 'Dry Waste · Local Kabadiwala / Paper Recycler',
    keyFact: 'Separate dry paper & cardboard streams feed India’s Material Recovery Facilities (MRFs)',
    keyFactSource: 'MoEFCC Solid Waste Management Rules, 2026',
    overview:
      'Newspapers (raddi), old school notebooks, textbooks, and e-commerce delivery cartons have strong recycling value across India when kept dry and oil-free.',
    prepSteps: [
      'Stack newspapers, magazines, and used notebooks flat in a dry corner away from kitchen moisture.',
      'Flatten corrugated online-shopping cartons and remove thick plastic tape, bubble wrap, or thermocol padding.',
      'Keep food-greased pizza boxes or oil-soaked paper plates out of clean paper stacks (tear off clean dry lids for Dry Waste).',
      'Hand over bundled paper to your neighbourhood kabadiwala, school recycling drive, or municipal Dry Waste collection.',
    ],
    reuseIdeas: [
      'Donate clean textbooks and gently used reference books to juniors, school book banks, or community libraries.',
      'Use unused blank pages from last year’s notebooks as rough-work pads for maths and exam practice.',
      'Use old newspapers to wrap sanitary waste safely, line kitchen wet-waste caddies, or cover shelves.',
    ],
    avoidList: [
      'Soiled paper tissues, wet wipes, and heavily oil-soaked food boxes.',
      'Thermal ATM and shopping bills (coated paper—keep minimal or request digital receipts).',
      'Plastic-laminated glossy gift wrap mixed with plain newspapers.',
    ],
  },
  {
    id: 'glass-metals',
    name: 'Glass Bottles & Metal Cans',
    shortLabel: 'Glass & Metals',
    category: 'Dry Waste',
    channelLabel: 'Dry Waste · Kabadiwala / MRF (Keep Unbroken)',
    keyFact: 'Clean metal tins & intact glass jars have high recovery value in formal and informal Indian recycling',
    keyFactSource: 'MoEFCC Solid Waste Management Rules, 2026',
    overview:
      'Glass pickle (achaar), jam, and sauce jars along with aluminum beverage cans and tin ghee/biscuit containers can be reused at home for years and recycled cleanly when no longer needed.',
    prepSteps: [
      'Empty and rinse glass jars and metal cans so leftover oil, syrup, or pickles do not attract pests.',
      'Keep glass bottles unbroken whenever possible so collectors can handle them safely.',
      'If a glass bottle breaks, wrap shards carefully in thick newspaper or a small cardboard carton, tape shut, and label "Broken Glass".',
      'Separate clean aluminum foil trays and metal lids into your Dry Waste stream.',
    ],
    reuseIdeas: [
      'Wash and reuse sturdy glass pickle, honey, and coffee jars to store dals, spices, dry fruits, or stationery.',
      'Reuse tin containers as kitchen storage boxes, art-brush holders, or herb planters.',
      'Pass intact empty glass bottles and metal tins to local kabadiwalas who channel them back to recyclers.',
    ],
    avoidList: [
      'CFL bulbs, fluorescent tube lights, and mercury thermometers (these are Special Care Waste, NOT regular glass).',
      'Pressurised deodorant/insect-spray tins or paint tins (Special Care Waste).',
      'Unwrapped broken glass shards placed loose inside thin plastic bags.',
    ],
  },
  {
    id: 'wet-kitchen',
    name: 'Vegetable Peels & Leftover Food',
    shortLabel: 'Kitchen & Food Waste',
    category: 'Wet Waste',
    channelLabel: 'Wet Waste · Home Composting / Municipal Wet Collection',
    keyFact: 'India generated 1,70,339 TPD of solid waste; 91,511 TPD (~54%) was treated',
    keyFactSource: 'CPCB Annual Report on Solid Waste Management, 2021–22',
    overview:
      'Daily vegetable peels, fruit scraps, tea leaves, and leftover food make up a huge share of Indian household waste. Composting turns them into free, natural manure (khad) for potted plants and gardens.',
    prepSteps: [
      'Keep a dedicated covered kitchen bin exclusively for Wet Waste—never mix plastics or wrappers into it.',
      'Drain excess water from tea leaves and kitchen scraps before adding them to your bin or home composter.',
      'For terracotta pot (khamba) or balcony bin composting, layer wet scraps with dry leaves, sawdust, or cocopeat to prevent smell.',
      'If you do not compost at home, hand over segregated Wet Waste daily to your municipal wet collection vehicle or society composter.',
    ],
    reuseIdeas: [
      'Make nutrient-rich compost for balcony tulsi, curry-leaf, and vegetable pots using a simple terracotta khamba composter.',
      'Prepare natural citrus bio-enzyme household cleaner by fermenting orange or lemon peels with jaggery and water.',
      'Dry used tea leaves and mix lightly into garden soil, or boil clean vegetable peels to make flavourful soup stock.',
    ],
    avoidList: [
      'Plastic produce stickers, rubber bands, and nylon tea bags in compost.',
      'Excess cooking oil, plastic wrappers, or foil lined paper plates.',
      'Mixing sanitary waste or medicines with kitchen organics.',
    ],
  },
  {
    id: 'clothes-shoes',
    name: 'Old Clothes & Shoes',
    shortLabel: 'Clothes & Shoes',
    category: 'Dry Waste',
    channelLabel: 'Donate / Reuse First · Clean Dry Waste for Damaged Textiles',
    keyFact: 'Reuse and donation keep textiles out of municipal landfills and extend fabric life',
    keyFactSource: 'SWM Rules, 2026 Waste Hierarchy (Reduce–Reuse–Recycle)',
    overview:
      'Outgrown school uniforms, cotton clothes, sarees, bedsheets, and usable footwear still have a lot of life left. Always check if they can be repaired, donated, or repurposed before discarding.',
    prepSteps: [
      'Wash and dry wearable clothes, blankets, and school uniforms neatly before donating them.',
      'Tie pairs of usable shoes or chappals together with laces or string so they do not get separated.',
      'For torn or stained fabrics that cannot be donated, keep them completely dry and clean before placing in Dry Waste or textile take-back drives.',
      'Remove reusable metal buttons or zippers if repurposing fabric at home.',
    ],
    reuseIdeas: [
      'Donate wearable clothes, woollens, and shoes to verified local community centres, orphanages, or NGO collection drives.',
      'Cut soft worn-out cotton t-shirts, kurtas, and bedsheets into washable dusting rags and floor cloths (pocha).',
      'Stitch sturdy old denim or cotton dupattas into reusable cloth grocery bags (jholas) or book covers for students.',
    ],
    avoidList: [
      'Do not donate torn, unwashed, or damp clothes—donate only clean items someone can wear with dignity.',
      'Never throw wet, mildewed clothes into Wet Waste or mix them with recyclables.',
      'Avoid burning old rubber footwear or synthetic nylon fabrics.',
    ],
  },
  {
    id: 'ewaste-batteries',
    name: 'Electronic Waste & Batteries',
    shortLabel: 'E-Waste & Batteries',
    category: 'Special Care Waste',
    channelLabel: 'Authorised E-Waste Recyclers / Producer EPR Take-Back Only',
    keyFact: '13.98 lakh MT of e-waste generated in India in 2024–25',
    keyFactSource: 'CPCB / MoEFCC Parliamentary Data (E-Waste EPR Portal), 2024–25',
    overview:
      'Old mobile phones, chargers, earphones, power banks, laptops, and household batteries are regulated under India’s E-Waste (Management) Rules, 2022 and Battery Waste Management Rules, 2022. They must ONLY go through authorised channels.',
    prepSteps: [
      'Back up important photos/documents and perform a factory reset on old phones, tablets, or laptops.',
      'Tape the metal terminals of used AA/AAA, 9V, button-cell, or lithium batteries with clear tape to prevent sparks.',
      'Keep broken screens or swollen batteries in a cool, dry box away from heat and children.',
      'Drop off at CPCB/SPCB-authorised e-waste collection centres, electronics brand EPR take-back stores, or verified school/RWA e-waste drives.',
    ],
    reuseIdeas: [
      'Repair minor faults (charging ports, battery replacements) at trusted local repair shops before replacing devices.',
      'Donate working older laptops, tablets, or calculators to students or community learning centres.',
      'Switch remotes, clocks, and study lamps from disposable cells to rechargeable NiMH batteries.',
    ],
    avoidList: [
      'NEVER put batteries, phones, power banks, or chargers in household Wet, Dry, or Sanitary bins.',
      'Do not sell e-waste to informal scrap handlers who burn wires or use open acid leaching—use CPCB/SPCB-authorised channels.',
      'Never puncture, crush, or expose swollen lithium batteries to water or sunlight.',
    ],
  },
];

export const PLASTIC_RESIN_CODES: PlasticResinCode[] = [
  {
    code: 1,
    abbr: 'PET / PETE',
    name: 'Polyethylene Terephthalate',
    commonItems: 'Packaged water bottles, cold-drink bottles, cooking-oil bottles, masala jars',
    recyclability: 'Commonly Recycled',
    tip: 'Empty, rinse lightly, keep cap on, and place in Dry Waste or give to your kabadiwala.',
  },
  {
    code: 2,
    abbr: 'HDPE',
    name: 'High-Density Polyethylene',
    commonItems: 'Shampoo bottles, detergent cans, phenyl-free cleaner bottles, rigid milk cans',
    recyclability: 'Commonly Recycled',
    tip: 'High-value recyclable plastic when clean. Note: pesticide/toxic chemical bottles go to Special Care Waste instead.',
  },
  {
    code: 3,
    abbr: 'PVC',
    name: 'Polyvinyl Chloride',
    commonItems: 'Plumbing pipes, blister packaging, shower curtains, cling wrap',
    recyclability: 'Rarely Recycled',
    tip: 'Difficult to recycle in municipal systems; keep dry in Dry Waste and avoid open burning.',
  },
  {
    code: 4,
    abbr: 'LDPE',
    name: 'Low-Density Polyethylene',
    commonItems: 'Dairy milk packets, bread bags, atta/rice inner liners, bubble wrap',
    recyclability: 'Depends on Local Facility',
    tip: 'Rinse milk packets dry and keep the cut corner attached; accepted by many Indian kabadiwalas and MRFs when clean.',
  },
  {
    code: 5,
    abbr: 'PP',
    name: 'Polypropylene',
    commonItems: 'Curd (dahi) & ice-cream tubs, takeaway boxes, bottle caps, medicine bottle caps',
    recyclability: 'Commonly Recycled',
    tip: 'Wash out food or oil thoroughly; sturdy #5 containers are great for home reuse before recycling.',
  },
  {
    code: 6,
    abbr: 'PS',
    name: 'Polystyrene (Thermocol)',
    commonItems: 'Thermocol appliance cushioning, disposable foam cups & plates',
    recyclability: 'Rarely Recycled',
    tip: 'Almost never recycled curbside and breaks into micro-beads easily; choose steel, ceramic, or leaf plates instead.',
  },
  {
    code: 7,
    abbr: 'OTHER / MLP',
    name: 'Multi-Layer & Mixed Plastics',
    commonItems: 'Chips & biscuit foil packets, toothpaste tubes, gutkha/shampoo sachets',
    recyclability: 'Rarely Recycled',
    tip: 'Keep clean and dry in Dry Waste so MRFs can channel MLP for authorised co-processing; reduce single-serve sachets where possible.',
  },
];

/**
 * State & City selector data (real official ULBs and SPCBs only — no fabricated addresses or local rules).
 */
export const INDIAN_STATE_CITY_GUIDANCE: IndianStateGuidance[] = [
  {
    state: 'Delhi (NCT)',
    spcbName: 'Delhi Pollution Control Committee (DPCC)',
    cities: [
      {
        city: 'New Delhi / Delhi',
        localBody: 'Municipal Corporation of Delhi (MCD) / NDMC',
        guidanceNote:
          'Segregate into Wet, Dry, Sanitary, and Special Care Waste under SWM Rules, 2026. Check your MCD or NDMC ward collection schedule for doorstep pickup compartments and verify DPCC/CPCB-authorised e-waste recyclers for electronics and batteries.',
      },
    ],
  },
  {
    state: 'Maharashtra',
    spcbName: 'Maharashtra Pollution Control Board (MPCB)',
    cities: [
      {
        city: 'Mumbai',
        localBody: 'Brihanmumbai Municipal Corporation (BMC)',
        guidanceNote:
          'Housing societies and households follow source segregation into Wet, Dry, Sanitary, and Special Care streams. Check BMC ward notices for society composting guidelines and MPCB-authorised collection centres for e-waste and batteries.',
      },
      {
        city: 'Pune',
        localBody: 'Pune Municipal Corporation (PMC)',
        guidanceNote:
          'Keep Wet, Dry, wrapped Sanitary, and Special Care Waste separated for doorstep collection. Confirm ward timings with PMC and check MPCB lists for authorised e-waste and household hazardous waste drop-offs.',
      },
      {
        city: 'Nagpur',
        localBody: 'Nagpur Municipal Corporation (NMC)',
        guidanceNote:
          'Follow four-stream source segregation at home or campus. Verify NMC ward vehicle schedules and MPCB-authorised channels for batteries, bulbs, and electronics.',
      },
    ],
  },
  {
    state: 'Karnataka',
    spcbName: 'Karnataka State Pollution Control Board (KSPCB)',
    cities: [
      {
        city: 'Bengaluru',
        localBody: 'Bruhat Bengaluru Mahanagara Palike (BBMP)',
        guidanceNote:
          'Keep Wet Waste, Dry Waste, wrapped Sanitary Waste, and Special Care Waste separated. Verify your BBMP ward’s Dry Waste Collection Centre (DWCC) schedule and KSPCB-authorised recyclers for e-waste and batteries.',
      },
      {
        city: 'Mysuru',
        localBody: 'Mysuru City Corporation (MCC)',
        guidanceNote:
          'Segregate household waste into the four SWM Rules, 2026 streams before handing over to MCC collection vehicles. Use KSPCB-authorised channels for e-waste and special care items.',
      },
    ],
  },
  {
    state: 'Tamil Nadu',
    spcbName: 'Tamil Nadu Pollution Control Board (TNPCB)',
    cities: [
      {
        city: 'Chennai',
        localBody: 'Greater Chennai Corporation (GCC)',
        guidanceNote:
          'Separate Wet, Dry, Sanitary, and Special Care Waste at source. Confirm ward pickup timings and bin conventions with GCC, and use TNPCB-authorised recyclers or brand EPR take-back for e-waste and batteries.',
      },
      {
        city: 'Coimbatore',
        localBody: 'Coimbatore City Municipal Corporation (CCMC)',
        guidanceNote:
          'Follow four-stream segregation for CCMC doorstep collection. Check municipal updates for special care drop-offs and TNPCB-authorised e-waste channels.',
      },
    ],
  },
  {
    state: 'West Bengal',
    spcbName: 'West Bengal Pollution Control Board (WBPCB)',
    cities: [
      {
        city: 'Kolkata',
        localBody: 'Kolkata Municipal Corporation (KMC)',
        guidanceNote:
          'Segregate Wet, Dry, wrapped Sanitary, and Special Care Waste at source. Confirm ward-level collection timings with KMC and check WBPCB-authorised e-waste recyclers for batteries and electronics.',
      },
      {
        city: 'Siliguri',
        localBody: 'Siliguri Municipal Corporation (SMC)',
        guidanceNote:
          'Keep organic kitchen scraps, clean dry recyclables, sanitary parcels, and special care items separated. Verify SMC ward collection rules and WBPCB-authorised e-waste drop-offs.',
      },
    ],
  },
  {
    state: 'Telangana',
    spcbName: 'Telangana Pollution Control Board (TGPCB)',
    cities: [
      {
        city: 'Hyderabad',
        localBody: 'Greater Hyderabad Municipal Corporation (GHMC)',
        guidanceNote:
          'Separate Wet, Dry, Sanitary, and Special Care Waste before handing over to GHMC doorstep collectors. Verify ward schedules locally and use TGPCB-authorised channels for e-waste and batteries.',
      },
    ],
  },
  {
    state: 'Gujarat',
    spcbName: 'Gujarat Pollution Control Board (GPCB)',
    cities: [
      {
        city: 'Ahmedabad',
        localBody: 'Ahmedabad Municipal Corporation (AMC)',
        guidanceNote:
          'Follow four-stream source segregation under SWM Rules, 2026. Check AMC ward vehicle schedules for wet, dry, and sanitary waste and GPCB-authorised e-waste channels for electronics and batteries.',
      },
      {
        city: 'Surat',
        localBody: 'Surat Municipal Corporation (SMC)',
        guidanceNote:
          'Keep Wet, Dry, Sanitary, and Special Care Waste strictly separate. Confirm SMC ward pickup timings and GPCB-authorised collection points for batteries, bulbs, and e-waste.',
      },
    ],
  },
  {
    state: 'Madhya Pradesh',
    spcbName: 'Madhya Pradesh Pollution Control Board (MPPCB)',
    cities: [
      {
        city: 'Indore',
        localBody: 'Indore Municipal Corporation (IMC)',
        guidanceNote:
          'Separate Wet, Dry, Sanitary, and Special Care Waste at source for multi-compartment municipal collection vehicles. Check IMC ward guidelines for specific bin conventions and MPPCB-authorised e-waste channels.',
      },
      {
        city: 'Bhopal',
        localBody: 'Bhopal Municipal Corporation (BMC)',
        guidanceNote:
          'Segregate into all four SWM Rules, 2026 streams. Verify BMC ward timings and MPPCB-authorised recyclers for e-waste and household hazardous items.',
      },
    ],
  },
  {
    state: 'Uttar Pradesh',
    spcbName: 'Uttar Pradesh Pollution Control Board (UPPCB)',
    cities: [
      {
        city: 'Lucknow',
        localBody: 'Lucknow Municipal Corporation (LMC)',
        guidanceNote:
          'Separate Wet, Dry, wrapped Sanitary, and Special Care Waste at source. Confirm ward collection timings with LMC and check UPPCB-authorised recyclers for e-waste and batteries.',
      },
      {
        city: 'Noida',
        localBody: 'Noida Authority',
        guidanceNote:
          'Segregate household and society waste into the four SWM Rules, 2026 streams. Confirm sector collection guidelines with Noida Authority and use UPPCB-authorised channels for e-waste and batteries.',
      },
    ],
  },
  {
    state: 'Kerala',
    spcbName: 'Kerala State Pollution Control Board (KSPCB)',
    cities: [
      {
        city: 'Kochi',
        localBody: 'Kochi Municipal Corporation',
        guidanceNote:
          'Compost Wet Waste at source where possible and hand over clean Dry Waste, wrapped Sanitary Waste, and Special Care Waste through authorised municipal/Haritha Karma Sena schedules. Verify KSPCB-authorised e-waste channels.',
      },
      {
        city: 'Thiruvananthapuram',
        localBody: 'Thiruvananthapuram Municipal Corporation',
        guidanceNote:
          'Follow decentralised Wet Waste composting and clean Dry Waste handover as per local ward arrangements. Route e-waste and batteries strictly through KSPCB-authorised channels.',
      },
    ],
  },
  {
    state: 'Rajasthan',
    spcbName: 'Rajasthan State Pollution Control Board (RSPCB)',
    cities: [
      {
        city: 'Jaipur',
        localBody: 'Jaipur Municipal Corporation (Heritage / Greater)',
        guidanceNote:
          'Segregate Wet, Dry, wrapped Sanitary, and Special Care Waste at source. Confirm your zone’s municipal pickup schedule and check RSPCB-authorised recyclers for e-waste and batteries.',
      },
    ],
  },
  {
    state: 'Other State / Union Territory',
    spcbName: 'Your State Pollution Control Board (SPCB) / Pollution Control Committee (PCC)',
    cities: [
      {
        city: 'Other City / Town / Gram Panchayat',
        localBody: 'Local Municipal Body (ULB) or Gram Panchayat',
        guidanceNote:
          'Follow India’s four-stream segregation (Wet, Dry, Sanitary, Special Care Waste) at source. Because bin colours, pickup schedules, and authorised drop-off points differ across towns and villages, please confirm local arrangements with your municipality or Gram Panchayat and check the CPCB/SPCB portal for authorised e-waste recyclers.',
      },
    ],
  },
];

/**
 * Official India Municipal Solid Waste Processing Overview (Tonnes Per Day - TPD)
 * Source: Central Pollution Control Board (CPCB), Annual Report on Solid Waste Management (2021–22)
 */
export const INDIA_MSW_STATUS_DATA = [
  { stage: 'Generated', tpd: 170339, shareLabel: '100% baseline', color: '#0F2419' },
  { stage: 'Collected', tpd: 156449, shareLabel: '~92% collected', color: '#0369A1' },
  { stage: 'Treated / Processed', tpd: 91511, shareLabel: '~54% treated', color: '#0F7A4A' },
  { stage: 'Landfilled', tpd: 41455, shareLabel: '~24% landfilled', color: '#B45309' },
  { stage: 'Unaccounted Gap', tpd: 37373, shareLabel: '~22% gap', color: '#64748B' },
];

/**
 * Official India Plastic Waste Generation Trend (Lakh Tonnes Per Annum)
 * Source: CPCB Annual Reports under Plastic Waste Management Rules (2018–19 to 2022–23)
 */
export const INDIA_PLASTIC_TREND_DATA = [
  { year: '2018–19', lakhTonnes: 33.6, exactTpa: '33,60,043 TPA' },
  { year: '2019–20', lakhTonnes: 34.7, exactTpa: '34,69,780 TPA' },
  { year: '2020–21', lakhTonnes: 41.27, exactTpa: '41,26,997 TPA' },
  { year: '2021–22', lakhTonnes: 39.02, exactTpa: '39,01,802 TPA' },
  { year: '2022–23', lakhTonnes: 41.36, exactTpa: '41,36,188 TPA' },
];

/**
 * Official India E-Waste Generation Highlights
 * Source: CPCB / MoEFCC Parliamentary Data (E-Waste EPR Portal), 2020–21 to 2024–25
 */
export const INDIA_EWASTE_HIGHLIGHTS = [
  { year: '2021–22', metricTonnes: '16,01,155 MT' },
  { year: '2022–23', metricTonnes: '16,09,117 MT' },
  { year: '2023–24', metricTonnes: '12,54,287 MT' },
  { year: '2024–25', metricTonnes: '13,97,956 MT' },
];

export const INDIA_POLICY_MILESTONES = [
  {
    title: 'Solid Waste Management (SWM) Rules, 2026',
    source: 'MoEFCC, Government of India · Effective April 1, 2026',
    summary:
      'Mandates four-stream source segregation (Wet, Dry, Sanitary, Special Care Waste) for households, institutions, and bulk waste generators.',
  },
  {
    title: 'Single-Use Plastics (SUP) Prohibition',
    source: 'MoEFCC, Government of India · Effective July 1, 2022',
    summary:
      'Prohibits identified low-utility, high-littering single-use plastics such as plastic cutlery, stirrers, earbuds with plastic sticks, and thermocol decorations.',
  },
  {
    title: 'E-Waste & Battery Waste Management Rules, 2022',
    source: 'MoEFCC & CPCB · Effective 2022–2023',
    summary:
      'Strengthens digital Extended Producer Responsibility (EPR) so electronics and batteries are channelised only to CPCB/SPCB-authorised recyclers.',
  },
];

export const INDIAN_SUSTAINABILITY_HABITS = [
  {
    index: '01',
    title: 'Set Up Four Clear Home Bins',
    detail: 'SWM Rules, 2026 · Source Segregation',
    description:
      'Keep a covered bin for Wet kitchen scraps, a dry bag for clean Dry Waste, a small lidded bin for wrapped Sanitary Waste, and a safe box for Special Care items.',
  },
  {
    index: '02',
    title: 'Rinse Milk Packets & Food Jars',
    detail: 'Keeps Dry Waste Clean for MRFs & Kabadiwalas',
    description:
      'A quick rinse of dairy pouches, curd tubs, and glass jars prevents smell and stops food residue from spoiling recyclable newspapers and cardboard.',
  },
  {
    index: '03',
    title: 'Carry a Cloth Jhola & Steel Bottle',
    detail: 'Aligns with MoEFCC Single-Use Plastic Reduction',
    description:
      'Keeping one foldable cloth bag and a reusable steel bottle in a school bag or scooter boot avoids hundreds of disposable plastic bags and bottles every year.',
  },
  {
    index: '04',
    title: 'Use Authorised E-Waste & Battery Drop-Offs',
    detail: 'CPCB / SPCB Authorised Channels Only',
    description:
      'Collect dead AA cells, old chargers, CFLs, and broken earphones in a labelled box and hand them over only to authorised recyclers or brand EPR take-back centres.',
  },
];
