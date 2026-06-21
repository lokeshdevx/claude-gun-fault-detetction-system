export const weapons = [
    {
      id: "1",
      name: "AK-203",
      type: "Assault Rifle",
      caliber: "7.62×39mm",
      manufacturer: "Indo-Russia Rifles Pvt Ltd / Kalashnikov Concern",
      model: "AK-203",
      countryOfOrigin: "India/Russia",
      images: [
        "/weapons/ak203.jpg",
      ],
      description:
        "Modern assault rifle being inducted as the standard infantry weapon of the Indian Army.",
      specifications: {
        weight: "3.8 kg",
        length: "705 mm (stock folded), 940 mm (extended)",
        barrelLength: "415 mm",
        magazineCapacity: 30,
        rateOfFire: "700 rounds/min",
        effectiveRange: "400-800 m"
      }
    },
  
    {
      id: "2",
      name: "SIG Sauer 716",
      type: "Battle Rifle",
      caliber: "7.62×51mm NATO",
      manufacturer: "SIG Sauer",
      model: "SIG716 Patrol",
      countryOfOrigin: "United States",
      images: [
        "/weapons/sauer.jpg"
      ],
      description:
        "Battle rifle used by frontline troops and counter-terror units.",
      specifications: {
        weight: "4.2 kg",
        length: "940 mm",
        barrelLength: "406 mm",
        magazineCapacity: 20,
        rateOfFire: "Semi-automatic",
        effectiveRange: "600 m"
      }
    },
  
    {
      id: "3",
      name: "INSAS Rifle",
      type: "Assault Rifle",
      caliber: "5.56×45mm NATO",
      manufacturer: "Ordnance Factory Board",
      model: "INSAS 1B1",
      countryOfOrigin: "India",
      images: [
        "/weapons/insas.jpg"
      ],
      description:
        "Indigenous assault rifle that served as the standard infantry weapon for decades.",
      specifications: {
        weight: "4.15 kg",
        length: "960 mm",
        barrelLength: "464 mm",
        magazineCapacity: 20,
        rateOfFire: "650 rounds/min",
        effectiveRange: "400 m"
      }
    },
  
    {
      id: "4",
      name: "Tavor TAR-21",
      type: "Assault Rifle",
      caliber: "5.56×45mm NATO",
      manufacturer: "Israel Weapon Industries",
      model: "TAR-21",
      countryOfOrigin: "Israel",
      images: [
        "/weapons/tavor.jpg"
      ],
      description:
        "Bullpup assault rifle extensively used by Indian Special Forces.",
      specifications: {
        weight: "3.27 kg",
        length: "725 mm",
        barrelLength: "460 mm",
        magazineCapacity: 30,
        rateOfFire: "750-900 rounds/min",
        effectiveRange: "500 m"
      }
    },
  
    {
      id: "5",
      name: "Negev NG7",
      type: "Light Machine Gun",
      caliber: "7.62×51mm NATO",
      manufacturer: "Israel Weapon Industries",
      model: "NG7",
      countryOfOrigin: "Israel",
      images: [
        "/weapons/negev.jpg"
      ],
      description:
        "Modern light machine gun procured to replace older INSAS LMG systems.",
      specifications: {
        weight: "7.95 kg",
        length: "1,010 mm",
        barrelLength: "508 mm",
        magazineCapacity: 100,
        rateOfFire: "600-750 rounds/min",
        effectiveRange: "800 m"
      }
    },
  
    {
      id: "6",
      name: "Dragunov SVD",
      type: "Sniper Rifle",
      caliber: "7.62×54mmR",
      manufacturer: "Kalashnikov Concern",
      model: "SVD",
      countryOfOrigin: "Russia",
      images: [
        "/weapons/dragunov.jpg"
      ],
      description:
        "Designated marksman rifle widely used by Indian Army sniper teams.",
      specifications: {
        weight: "4.3 kg",
        length: "1225 mm",
        barrelLength: "620 mm",
        magazineCapacity: 10,
        rateOfFire: "Semi-automatic",
        effectiveRange: "800 m"
      }
    },
  
    {
      id: "7",
      name: "Glock 17",
      type: "Pistol",
      caliber: "9×19mm",
      manufacturer: "Glock",
      model: "Glock 17 Gen 4",
      countryOfOrigin: "Austria",
      images: [
        "/weapons/glock.webp"
      ],
      description:
        "Service pistol used by various Indian Army units.",
      specifications: {
        weight: "0.71 kg",
        length: "204 mm",
        barrelLength: "114 mm",
        magazineCapacity: 17,
        rateOfFire: "Semi-automatic",
        effectiveRange: "50 m"
      }
    },
  
    {
      id: "8",
      name: "Carl Gustaf M4",
      type: "Recoilless Rifle",
      caliber: "84mm",
      manufacturer: "Saab Bofors Dynamics",
      model: "M4",
      countryOfOrigin: "Sweden",
      images: [
        "/weapons/carl.jpg"
      ],
      description:
        "Shoulder-fired recoilless weapon used against armored targets and fortifications.",
      specifications: {
        weight: "6.7 kg",
        length: "950 mm",
        barrelLength: "N/A",
        magazineCapacity: 1,
        rateOfFire: "Single-shot",
        effectiveRange: "1000 m"
      }
    },

    {
      id: "9",
      name: "AK-47",
      type: "Assault Rifle",
      caliber: "7.62×39mm",
      manufacturer: "Various Manufacturers",
      model: "AK-47",
      countryOfOrigin: "Soviet Union/Russia",
      images: ["/weapons/ak47.png"],
      description:
        "One of the most widely used assault rifles in the world and still used by some Indian Army units.",
      specifications: {
        weight: "4.3 kg",
        length: "870 mm",
        barrelLength: "415 mm",
        magazineCapacity: 30,
        rateOfFire: "600 rounds/min",
        effectiveRange: "350 m"
      }
    },
  
    {
      id: "10",
      name: "INSAS LMG",
      type: "Light Machine Gun",
      caliber: "5.56×45mm NATO",
      manufacturer: "Ordnance Factory Board",
      model: "INSAS LMG",
      countryOfOrigin: "India",
      images: ["/weapons/insas_lmg.jpeg"],
      description:
        "Indian light machine gun derived from the INSAS rifle.",
      specifications: {
        weight: "6.58 kg",
        length: "1040 mm",
        barrelLength: "464 mm",
        magazineCapacity: 30,
        rateOfFire: "650 rounds/min",
        effectiveRange: "700 m"
      }
    },
  
    {
      id: "11",
      name: "FN MAG",
      type: "General Purpose Machine Gun",
      caliber: "7.62×51mm NATO",
      manufacturer: "FN Herstal",
      model: "MAG",
      countryOfOrigin: "Belgium",
      images: ["/weapons/fn_mag.jpg"],
      description:
        "General purpose machine gun used by infantry and vehicle crews.",
      specifications: {
        weight: "11.8 kg",
        length: "1260 mm",
        barrelLength: "545 mm",
        magazineCapacity: 100,
        rateOfFire: "650-1000 rounds/min",
        effectiveRange: "1200 m"
      }
    },
  
    {
      id: "12",
      name: "Sako TRG-42",
      type: "Sniper Rifle",
      caliber: ".338 Lapua Magnum",
      manufacturer: "Sako",
      model: "TRG-42",
      countryOfOrigin: "Finland",
      images: ["/weapons/sako.webp"],
      description:
        "Long-range sniper rifle used by Indian Army sniper teams.",
      specifications: {
        weight: "5.1 kg",
        length: "1200 mm",
        barrelLength: "690 mm",
        magazineCapacity: 5,
        rateOfFire: "Bolt Action",
        effectiveRange: "1500 m"
      }
    },
  
    {
      id: "13",
      name: "Barrett M95",
      type: "Anti-Materiel Rifle",
      caliber: "12.7×99mm NATO (.50 BMG)",
      manufacturer: "Barrett Firearms",
      model: "M95",
      countryOfOrigin: "United States",
      images: ["/weapons/barrett.jpg"],
      description:
        "Heavy sniper rifle used against vehicles and fortified targets.",
      specifications: {
        weight: "10.7 kg",
        length: "1143 mm",
        barrelLength: "737 mm",
        magazineCapacity: 5,
        rateOfFire: "Bolt Action",
        effectiveRange: "1800 m"
      }
    },
  
    {
      id: "14",
      name: "Auto Pistol 1A",
      type: "Pistol",
      caliber: "9×19mm",
      manufacturer: "Ordnance Factory Board",
      model: "1A",
      countryOfOrigin: "India",
      images: ["/weapons/auto_pistol.avif"],
      description:
        "Standard service pistol used by Indian armed forces for many years.",
      specifications: {
        weight: "1.1 kg",
        length: "216 mm",
        barrelLength: "127 mm",
        magazineCapacity: 13,
        rateOfFire: "Semi-automatic",
        effectiveRange: "50 m"
      }
    },
  
    {
      id: "15",
      name: "RPG-7",
      type: "Rocket Launcher",
      caliber: "40mm",
      manufacturer: "Various Manufacturers",
      model: "RPG-7",
      countryOfOrigin: "Soviet Union/Russia",
      images: ["/weapons/rpg.jpg"],
      description:
        "Portable anti-tank rocket launcher used by infantry units.",
      specifications: {
        weight: "7 kg",
        length: "950 mm",
        barrelLength: "950 mm",
        magazineCapacity: 1,
        rateOfFire: "Single Shot",
        effectiveRange: "500 m"
      }
    },
  
    {
      id: "16",
      name: "Milan ATGM",
      type: "Anti-Tank Guided Missile",
      caliber: "115mm",
      manufacturer: "MBDA",
      model: "MILAN",
      countryOfOrigin: "France/Germany",
      images: ["/weapons/milan.jpg"],
      description:
        "Wire-guided anti-tank missile system used against armored vehicles.",
      specifications: {
        weight: "16 kg",
        length: "1200 mm",
        barrelLength: "N/A",
        magazineCapacity: 1,
        rateOfFire: "Single Shot",
        effectiveRange: "2000 m"
      }
    },
  
    {
      id: "17",
      name: "81mm Mortar",
      type: "Mortar",
      caliber: "81mm",
      manufacturer: "Advanced Weapons and Equipment India Limited",
      model: "81mm Mortar",
      countryOfOrigin: "India",
      images: ["/weapons/mortar.jpg"],
      description:
        "Infantry support mortar providing indirect fire support.",
      specifications: {
        weight: "42 kg",
        length: "1280 mm",
        barrelLength: "1280 mm",
        magazineCapacity: 1,
        rateOfFire: "15-20 rounds/min",
        effectiveRange: "5650 m"
      }
    },
  
    {
      id: "18",
      name: "Vidhwansak",
      type: "Anti-Materiel Rifle",
      caliber: "12.7mm",
      manufacturer: "DRDO",
      model: "Vidhwansak",
      countryOfOrigin: "India",
      images: ["/weapons/vidhwansak.jpg"],
      description:
        "Indian anti-material rifle designed for long-range target engagement.",
      specifications: {
        weight: "25 kg",
        length: "1800 mm",
        barrelLength: "1000 mm",
        magazineCapacity: 5,
        rateOfFire: "Bolt Action",
        effectiveRange: "1800 m"
      }
    },

    {
      id: "19",
      name: "MP5",
      type: "Submachine Gun",
      caliber: "9×19mm Parabellum",
      manufacturer: "Heckler & Koch",
      model: "MP5A3",
      countryOfOrigin: "Germany",
      images: ["/weapons/mp5.jpg"],
      description:
        "Compact submachine gun used primarily by special forces and counter-terror units.",
      specifications: {
        weight: "3.1 kg",
        length: "680 mm",
        barrelLength: "225 mm",
        magazineCapacity: 30,
        rateOfFire: "800 rounds/min",
        effectiveRange: "200 m"
      }
    },
  
    {
      id: "20",
      name: "Tavor X95",
      type: "Assault Rifle",
      caliber: "5.56×45mm NATO",
      manufacturer: "Israel Weapon Industries",
      model: "X95",
      countryOfOrigin: "Israel",
      images: ["/weapons/tavor_x95.jpg"],
      description:
        "Compact bullpup rifle used by Indian special forces and infantry units.",
      specifications: {
        weight: "3.3 kg",
        length: "580 mm",
        barrelLength: "330 mm",
        magazineCapacity: 30,
        rateOfFire: "750 rounds/min",
        effectiveRange: "500 m"
      }
    },
  
    {
      id: "21",
      name: "PKM",
      type: "General Purpose Machine Gun",
      caliber: "7.62×54mmR",
      manufacturer: "Kalashnikov Concern",
      model: "PKM",
      countryOfOrigin: "Russia",
      images: ["/weapons/pkm.jpg"],
      description:
        "General-purpose machine gun used by infantry and mounted units.",
      specifications: {
        weight: "7.5 kg",
        length: "1173 mm",
        barrelLength: "658 mm",
        magazineCapacity: 100,
        rateOfFire: "650 rounds/min",
        effectiveRange: "1000 m"
      }
    },
  
    {
      id: "22",
      name: "Bren Light Machine Gun",
      type: "Light Machine Gun",
      caliber: "7.62×51mm NATO",
      manufacturer: "Ishapore Rifle Factory",
      model: "Bren L4",
      countryOfOrigin: "United Kingdom/India",
      images: ["/weapons/bren.jpg"],
      description:
        "Legacy light machine gun still used in reserve and training roles.",
      specifications: {
        weight: "10.15 kg",
        length: "1156 mm",
        barrelLength: "635 mm",
        magazineCapacity: 30,
        rateOfFire: "500 rounds/min",
        effectiveRange: "600 m"
      }
    },
  
    {
      id: "23",
      name: "Galil ACE",
      type: "Assault Rifle",
      caliber: "7.62×51mm NATO",
      manufacturer: "Israel Weapon Industries",
      model: "ACE 52",
      countryOfOrigin: "Israel",
      images: ["/weapons/galil.jpg"],
      description:
        "Modern assault rifle used by some Indian special units.",
      specifications: {
        weight: "3.6 kg",
        length: "850 mm",
        barrelLength: "460 mm",
        magazineCapacity: 20,
        rateOfFire: "650 rounds/min",
        effectiveRange: "500 m"
      }
    },
  
    {
      id: "24",
      name: "M4 Carbine",
      type: "Carbine",
      caliber: "5.56×45mm NATO",
      manufacturer: "Colt",
      model: "M4A1",
      countryOfOrigin: "United States",
      images: ["/weapons/carbine.jpg"],
      description:
        "Compact carbine used by special operations forces.",
      specifications: {
        weight: "3.1 kg",
        length: "840 mm",
        barrelLength: "370 mm",
        magazineCapacity: 30,
        rateOfFire: "700-950 rounds/min",
        effectiveRange: "500 m"
      }
    },
  
    {
      id: "25",
      name: "AGS-30",
      type: "Automatic Grenade Launcher",
      caliber: "30mm",
      manufacturer: "JSC KBP Instrument Design Bureau",
      model: "AGS-30",
      countryOfOrigin: "Russia",
      images: ["/weapons/ags.jpeg"],
      description:
        "Automatic grenade launcher used for infantry fire support.",
      specifications: {
        weight: "16 kg",
        length: "840 mm",
        barrelLength: "290 mm",
        magazineCapacity: 29,
        rateOfFire: "400 rounds/min",
        effectiveRange: "1700 m"
      }
    },
  
    {
      id: "26",
      name: "Under Barrel Grenade Launcher",
      type: "Grenade Launcher",
      caliber: "40mm",
      manufacturer: "Ordnance Factory Board",
      model: "UBGL",
      countryOfOrigin: "India",
      images: ["/weapons/barrel_grenade.jpg"],
      description:
        "Grenade launcher mounted beneath assault rifles for indirect fire support.",
      specifications: {
        weight: "1.5 kg",
        length: "380 mm",
        barrelLength: "280 mm",
        magazineCapacity: 1,
        rateOfFire: "Single Shot",
        effectiveRange: "400 m"
      }
    },
  
    {
      id: "27",
      name: "Browning Hi-Power",
      type: "Pistol",
      caliber: "9×19mm Parabellum",
      manufacturer: "FN Herstal",
      model: "Hi-Power",
      countryOfOrigin: "Belgium",
      images: ["/weapons/browning.jpg"],
      description:
        "Service pistol historically used by Indian armed forces.",
      specifications: {
        weight: "0.88 kg",
        length: "200 mm",
        barrelLength: "118 mm",
        magazineCapacity: 13,
        rateOfFire: "Semi-automatic",
        effectiveRange: "50 m"
      }
    },
  
    {
      id: "28",
      name: "MGL Mk1",
      type: "Multiple Grenade Launcher",
      caliber: "40mm",
      manufacturer: "Milkor",
      model: "Mk1",
      countryOfOrigin: "South Africa",
      images: ["/weapons/mgl.jpg"],
      description:
        "Multi-shot grenade launcher used by special forces and infantry.",
      specifications: {
        weight: "5.3 kg",
        length: "778 mm",
        barrelLength: "300 mm",
        magazineCapacity: 6,
        rateOfFire: "18 rounds/min",
        effectiveRange: "400 m"
      }
    },

    {
      id: "29",
      name: "AK-103",
      type: "Assault Rifle",
      caliber: "7.62×39mm",
      manufacturer: "Kalashnikov Concern",
      model: "AK-103",
      countryOfOrigin: "Russia",
      images: ["/weapons/ak103.jpg"],
      description:
        "Modernized variant of the AK series used by some Indian security forces.",
      specifications: {
        weight: "3.6 kg",
        length: "943 mm",
        barrelLength: "415 mm",
        magazineCapacity: 30,
        rateOfFire: "600 rounds/min",
        effectiveRange: "500 m"
      }
    },
  
    {
      id: "30",
      name: "FN Minimi",
      type: "Light Machine Gun",
      caliber: "5.56×45mm NATO",
      manufacturer: "FN Herstal",
      model: "Minimi",
      countryOfOrigin: "Belgium",
      images: ["/weapons/minimi.jpg"],
      description:
        "Light machine gun used by special units for sustained suppressive fire.",
      specifications: {
        weight: "7.1 kg",
        length: "1040 mm",
        barrelLength: "465 mm",
        magazineCapacity: 100,
        rateOfFire: "700-1000 rounds/min",
        effectiveRange: "800 m"
      }
    },
  
    {
      id: "31",
      name: "Beretta Scorpio TGT",
      type: "Sniper Rifle",
      caliber: ".338 Lapua Magnum",
      manufacturer: "Beretta",
      model: "Scorpio TGT",
      countryOfOrigin: "Italy",
      images: ["/weapons/scorpio.jpg"],
      description:
        "Precision sniper rifle used for long-range engagements.",
      specifications: {
        weight: "6.5 kg",
        length: "1250 mm",
        barrelLength: "690 mm",
        magazineCapacity: 5,
        rateOfFire: "Bolt Action",
        effectiveRange: "1500 m"
      }
    },
  
    {
      id: "32",
      name: "McMillan TAC-50",
      type: "Anti-Materiel Rifle",
      caliber: "12.7×99mm NATO (.50 BMG)",
      manufacturer: "McMillan Firearms",
      model: "TAC-50",
      countryOfOrigin: "United States",
      images: ["/weapons/milan.jpg"],
      description:
        "Long-range anti-materiel rifle employed by special forces.",
      specifications: {
        weight: "11.8 kg",
        length: "1448 mm",
        barrelLength: "737 mm",
        magazineCapacity: 5,
        rateOfFire: "Bolt Action",
        effectiveRange: "1800 m"
      }
    },
  
    {
      id: "33",
      name: "Milan-2T",
      type: "Anti-Tank Guided Missile",
      caliber: "115mm",
      manufacturer: "MBDA",
      model: "MILAN-2T",
      countryOfOrigin: "France/Germany",
      images: ["/weapons/milan_2t.jpg"],
      description:
        "Upgraded anti-tank guided missile with tandem warhead capability.",
      specifications: {
        weight: "26 kg",
        length: "1200 mm",
        barrelLength: "N/A",
        magazineCapacity: 1,
        rateOfFire: "Single Shot",
        effectiveRange: "2000 m"
      }
    },
  
    {
      id: "34",
      name: "Konkurs-M",
      type: "Anti-Tank Guided Missile",
      caliber: "135mm",
      manufacturer: "KBP Instrument Design Bureau",
      model: "Konkurs-M",
      countryOfOrigin: "Russia",
      images: ["/weapons/konkurs.jpg"],
      description:
        "Wire-guided anti-tank missile system deployed with infantry and mechanized units.",
      specifications: {
        weight: "14.6 kg",
        length: "1260 mm",
        barrelLength: "N/A",
        magazineCapacity: 1,
        rateOfFire: "Single Shot",
        effectiveRange: "4000 m"
      }
    },
  
    {
      id: "35",
      name: "Carl Gustaf M3",
      type: "Recoilless Rifle",
      caliber: "84mm",
      manufacturer: "Saab Bofors Dynamics",
      model: "M3",
      countryOfOrigin: "Sweden",
      images: ["/weapons/carl_m3.jpg"],
      description:
        "Recoilless rifle used for anti-armor and bunker engagement.",
      specifications: {
        weight: "10 kg",
        length: "1065 mm",
        barrelLength: "N/A",
        magazineCapacity: 1,
        rateOfFire: "Single Shot",
        effectiveRange: "700 m"
      }
    },
  
    {
      id: "36",
      name: "84mm Rocket Launcher",
      type: "Rocket Launcher",
      caliber: "84mm",
      manufacturer: "Ordnance Factory Board",
      model: "RL Mk III",
      countryOfOrigin: "India",
      images: ["/weapons/rocket.jpg"],
      description:
        "Shoulder-fired rocket launcher used for infantry support.",
      specifications: {
        weight: "14.5 kg",
        length: "1130 mm",
        barrelLength: "N/A",
        magazineCapacity: 1,
        rateOfFire: "Single Shot",
        effectiveRange: "300 m"
      }
    },
  
    {
      id: "37",
      name: "M777 Howitzer",
      type: "Howitzer",
      caliber: "155mm",
      manufacturer: "BAE Systems",
      model: "M777A2",
      countryOfOrigin: "United States",
      images: ["/weapons/m777.webp"],
      description:
        "Ultra-light towed howitzer used by the Indian Army artillery regiments.",
      specifications: {
        weight: "4200 kg",
        length: "10000 mm",
        barrelLength: "5000 mm",
        magazineCapacity: 1,
        rateOfFire: "2-5 rounds/min",
        effectiveRange: "30 km"
      }
    },
  
    {
      id: "38",
      name: "Dhanush",
      type: "Howitzer",
      caliber: "155mm",
      manufacturer: "Advanced Weapons and Equipment India Ltd",
      model: "Dhanush",
      countryOfOrigin: "India",
      images: ["/weapons/dhanush.webp"],
      description:
        "Indigenously developed artillery gun based on the Bofors design.",
      specifications: {
        weight: "13000 kg",
        length: "12000 mm",
        barrelLength: "8060 mm",
        magazineCapacity: 1,
        rateOfFire: "5-6 rounds/min",
        effectiveRange: "38 km"
      }
    },
        {
          id: "39",
          name: "MPATGM",
          type: "Anti-Tank Guided Missile",
          caliber: "N/A",
          manufacturer: "DRDO",
          model: "MPATGM",
          countryOfOrigin: "India",
          images: ["/weapons/mpatgm.jpg"],
          description:
            "Man-Portable Anti-Tank Guided Missile developed indigenously for infantry use.",
          specifications: {
            weight: "14.5 kg",
            length: "975 mm",
            barrelLength: "N/A",
            magazineCapacity: 1,
            rateOfFire: "Single Shot",
            effectiveRange: "2500 m"
          }
        },
      
        {
          id: "40",
          name: "Nag Missile",
          type: "Anti-Tank Guided Missile",
          caliber: "190 mm",
          manufacturer: "DRDO",
          model: "Nag",
          countryOfOrigin: "India",
          images: ["/weapons/nag.jpg"],
          description:
            "Third-generation fire-and-forget anti-tank guided missile.",
          specifications: {
            weight: "42 kg",
            length: "1850 mm",
            barrelLength: "N/A",
            magazineCapacity: 1,
            rateOfFire: "Single Shot",
            effectiveRange: "4000-7000 m"
          }
        },
      
        {
          id: "41",
          name: "Bofors FH-77B",
          type: "Howitzer",
          caliber: "155 mm",
          manufacturer: "BAE Systems Bofors",
          model: "FH-77B",
          countryOfOrigin: "Sweden",
          images: ["/weapons/fh77b.jpg"],
          description:
            "Towed field howitzer that has served with Indian artillery regiments for decades.",
          specifications: {
            weight: "11500 kg",
            length: "11800 mm",
            barrelLength: "6100 mm",
            magazineCapacity: 1,
            rateOfFire: "3 rounds in 8 seconds",
            effectiveRange: "24-30 km"
          }
        },
      
        {
          id: "42",
          name: "ATAGS",
          type: "Howitzer",
          caliber: "155 mm",
          manufacturer: "DRDO / Bharat Forge / Tata Advanced Systems",
          model: "ATAGS",
          countryOfOrigin: "India",
          images: ["/weapons/atags.jpg"],
          description:
            "Advanced Towed Artillery Gun System developed in India.",
          specifications: {
            weight: "18000 kg",
            length: "12000 mm",
            barrelLength: "8060 mm",
            magazineCapacity: 1,
            rateOfFire: "5 rounds/min",
            effectiveRange: "48 km"
          }
        },
      
        {
          id: "43",
          name: "K9 Vajra-T",
          type: "Self-Propelled Howitzer",
          caliber: "155 mm",
          manufacturer: "Larsen & Toubro / Hanwha Aerospace",
          model: "K9 Vajra-T",
          countryOfOrigin: "India/South Korea",
          images: ["/weapons/vajra.webp"],
          description:
            "Tracked self-propelled artillery system used by the Indian Army.",
          specifications: {
            weight: "47000 kg",
            length: "12700 mm",
            barrelLength: "8000 mm",
            magazineCapacity: 48,
            rateOfFire: "6-8 rounds/min",
            effectiveRange: "40 km"
          }
        },
      
        {
          id: "44",
          name: "AGS-17",
          type: "Automatic Grenade Launcher",
          caliber: "30 mm",
          manufacturer: "Molot",
          model: "AGS-17",
          countryOfOrigin: "Russia",
          images: ["weapons/ags_17.jpg"],
          description:
            "Automatic grenade launcher used for infantry fire support.",
          specifications: {
            weight: "18 kg",
            length: "840 mm",
            barrelLength: "305 mm",
            magazineCapacity: 29,
            rateOfFire: "400 rounds/min",
            effectiveRange: "1700 m"
          }
        },
      
        {
          id: "45",
          name: "Remington 870",
          type: "Shotgun",
          caliber: "12 Gauge",
          manufacturer: "Remington Arms",
          model: "870",
          countryOfOrigin: "United States",
          images: ["/weapons/remington.jpg"],
          description:
            "Pump-action shotgun used by specialized and security units.",
          specifications: {
            weight: "3.2 kg",
            length: "1000 mm",
            barrelLength: "470 mm",
            magazineCapacity: 6,
            rateOfFire: "Pump Action",
            effectiveRange: "40 m"
          }
        },
      
        {
          id: "46",
          name: "Mossberg 500",
          type: "Shotgun",
          caliber: "12 Gauge",
          manufacturer: "Mossberg",
          model: "500",
          countryOfOrigin: "United States",
          images: ["/weapons/mossberg.jpg"],
          description:
            "Pump-action shotgun used for close-quarter operations.",
          specifications: {
            weight: "3.4 kg",
            length: "1010 mm",
            barrelLength: "470 mm",
            magazineCapacity: 6,
            rateOfFire: "Pump Action",
            effectiveRange: "40 m"
          }
        },
      
        {
          id: "47",
          name: "Sterling Carbine",
          type: "Submachine Gun",
          caliber: "9×19 mm Parabellum",
          manufacturer: "Small Arms Factory Kanpur",
          model: "1A1 Sterling",
          countryOfOrigin: "India",
          images: ["/weapons/sterling.jpg"],
          description:
            "Submachine gun historically used by Indian armed forces and police units.",
          specifications: {
            weight: "2.7 kg",
            length: "686 mm",
            barrelLength: "198 mm",
            magazineCapacity: 34,
            rateOfFire: "550 rounds/min",
            effectiveRange: "200 m"
          }
        },
      
        {
          id: "48",
          name: "SAF Carbine 1A",
          type: "Carbine",
          caliber: "9×19 mm Parabellum",
          manufacturer: "Small Arms Factory Kanpur",
          model: "1A",
          countryOfOrigin: "India",
          images: ["/weapons/saf_carbine.webp"],
          description:
            "Compact carbine derived from the Sterling design.",
          specifications: {
            weight: "2.87 kg",
            length: "686 mm",
            barrelLength: "198 mm",
            magazineCapacity: 34,
            rateOfFire: "550 rounds/min",
            effectiveRange: "200 m"
          }
        },
            {
              id: "49",
              name: "PKT Machine Gun",
              type: "Vehicle Machine Gun",
              caliber: "7.62×54mmR",
              manufacturer: "Kalashnikov Concern",
              model: "PKT",
              countryOfOrigin: "Russia",
              images: ["/weapons/pkt.jpg"],
              description:
                "Coaxial machine gun mounted on armored vehicles and tanks.",
              specifications: {
                weight: "10.5 kg",
                length: "1098 mm",
                barrelLength: "722 mm",
                magazineCapacity: 250,
                rateOfFire: "700 rounds/min",
                effectiveRange: "1000 m"
              }
            },
          
            {
              id: "50",
              name: "MG3",
              type: "General Purpose Machine Gun",
              caliber: "7.62×51mm NATO",
              manufacturer: "Rheinmetall",
              model: "MG3",
              countryOfOrigin: "Germany",
              images: ["/weapons/mg3.png"],
              description:
                "General-purpose machine gun used by various armed forces worldwide.",
              specifications: {
                weight: "10.5 kg",
                length: "1225 mm",
                barrelLength: "565 mm",
                magazineCapacity: 100,
                rateOfFire: "1000-1300 rounds/min",
                effectiveRange: "1200 m"
              }
            },
          
            {
              id: "51",
              name: "FN FAL",
              type: "Battle Rifle",
              caliber: "7.62×51mm NATO",
              manufacturer: "FN Herstal",
              model: "FN FAL",
              countryOfOrigin: "Belgium",
              images: ["/weapons/fn_fal.jpg"],
              description:
                "Former standard battle rifle of the Indian Army.",
              specifications: {
                weight: "4.45 kg",
                length: "1090 mm",
                barrelLength: "533 mm",
                magazineCapacity: 20,
                rateOfFire: "650 rounds/min",
                effectiveRange: "600 m"
              }
            },
          
            {
              id: "52",
              name: "Ishapore 2A1",
              type: "Bolt-Action Rifle",
              caliber: "7.62×51mm NATO",
              manufacturer: "Rifle Factory Ishapore",
              model: "2A1",
              countryOfOrigin: "India",
              images: ["/weapons/ishapore.webp"],
              description:
                "Bolt-action rifle based on the Lee-Enfield platform.",
              specifications: {
                weight: "4.1 kg",
                length: "1130 mm",
                barrelLength: "640 mm",
                magazineCapacity: 12,
                rateOfFire: "Bolt Action",
                effectiveRange: "800 m"
              }
            },
          
            {
              id: "53",
              name: "Lee-Enfield No.4",
              type: "Bolt-Action Rifle",
              caliber: ".303 British",
              manufacturer: "Various Manufacturers",
              model: "No.4 Mk I",
              countryOfOrigin: "United Kingdom",
              images: ["/weapons/lee.jpg"],
              description:
                "Historic service rifle used extensively by the Indian Army.",
              specifications: {
                weight: "4.1 kg",
                length: "1130 mm",
                barrelLength: "640 mm",
                magazineCapacity: 10,
                rateOfFire: "Bolt Action",
                effectiveRange: "500 m"
              }
            },
          
            {
              id: "54",
              name: "CornerShot",
              type: "Special Purpose Weapon System",
              caliber: "9×19mm Parabellum",
              manufacturer: "CornerShot Holdings",
              model: "CornerShot",
              countryOfOrigin: "Israel",
              images: ["/weapons/cornershot.jpg"],
              description:
                "Specialized weapon platform for urban operations.",
              specifications: {
                weight: "3.9 kg",
                length: "820 mm",
                barrelLength: "N/A",
                magazineCapacity: 17,
                rateOfFire: "Semi-automatic",
                effectiveRange: "100 m"
              }
            },
          
            {
              id: "55",
              name: "Heckler & Koch PSG1",
              type: "Sniper Rifle",
              caliber: "7.62×51mm NATO",
              manufacturer: "Heckler & Koch",
              model: "PSG1",
              countryOfOrigin: "Germany",
              images: ["/weapons/heckler.jpg"],
              description:
                "Precision semi-automatic sniper rifle used by special units.",
              specifications: {
                weight: "8.1 kg",
                length: "1208 mm",
                barrelLength: "650 mm",
                magazineCapacity: 5,
                rateOfFire: "Semi-automatic",
                effectiveRange: "800 m"
              }
            },
          
            {
              id: "56",
              name: "Heckler & Koch MSG90",
              type: "Sniper Rifle",
              caliber: "7.62×51mm NATO",
              manufacturer: "Heckler & Koch",
              model: "MSG90",
              countryOfOrigin: "Germany",
              images: ["/weapons/heckler_msg90.jpg"],
              description:
                "Military sniper rifle used for precision engagements.",
              specifications: {
                weight: "6.4 kg",
                length: "1165 mm",
                barrelLength: "600 mm",
                magazineCapacity: 10,
                rateOfFire: "Semi-automatic",
                effectiveRange: "800 m"
              }
            },
          
            {
              id: "57",
              name: "Beretta 92FS",
              type: "Pistol",
              caliber: "9×19mm Parabellum",
              manufacturer: "Beretta",
              model: "92FS",
              countryOfOrigin: "Italy",
              images: ["/weapons/beretta.jpg"],
              description:
                "Semi-automatic pistol used by military and law enforcement units worldwide.",
              specifications: {
                weight: "0.95 kg",
                length: "217 mm",
                barrelLength: "125 mm",
                magazineCapacity: 15,
                rateOfFire: "Semi-automatic",
                effectiveRange: "50 m"
              }
            },
          
            {
              id: "58",
              name: "FN Five-seven",
              type: "Pistol",
              caliber: "5.7×28mm",
              manufacturer: "FN Herstal",
              model: "Five-seven",
              countryOfOrigin: "Belgium",
              images: ["/weapons/fn_five.jpg"],
              description:
                "Lightweight semi-automatic pistol designed for military applications.",
              specifications: {
                weight: "0.74 kg",
                length: "208 mm",
                barrelLength: "122 mm",
                magazineCapacity: 20,
                rateOfFire: "Semi-automatic",
                effectiveRange: "50 m"
              }
            }
  ];