// fault.ts

export interface GunBarrelFault {
    id: string;
    name: string;
    image: string;
    description: string;
    causes: string[];
    effects: string[];
    maintenance: string[];
    solutions: string[];
    affectedGunTypes: string[];
    severity: "Low" | "Medium" | "High" | "Critical";
  }
  
  export const BARREL_FAULTS: GunBarrelFault[] = [
    // ============ WEAR & EROSION FAULTS ============
    {
      id: "erosion",
      name: "Barrel Erosion",
      image: "/faults/erosion.png",
      description:
        "Wear or loss of barrel material near the chamber or throat caused by repeated exposure to high temperature and pressure.",
  
      causes: [
        "Frequent firing at high rates",
        "Use of high-pressure ammunition",
        "Excessive heat generation",
        "Long-term operational usage",
        "Insufficient cooling between firing cycles"
      ],
  
      effects: [
        "Reduced accuracy",
        "Decrease in muzzle velocity",
        "Reduced barrel life",
        "Irregular projectile trajectory"
      ],
  
      maintenance: [
        "Allow barrel cooling between firing sessions",
        "Perform regular bore inspections",
        "Use recommended ammunition only",
        "Follow scheduled barrel replacement intervals"
      ],
  
      solutions: [
        "Replace severely eroded barrel",
        "Monitor throat erosion periodically",
        "Reduce sustained firing rates"
      ],
  
      affectedGunTypes: [
        "Assault Rifles",
        "Machine Guns",
        "Sniper Rifles",
        "Artillery Guns",
        "Tank Cannons"
      ],
  
      severity: "High"
    },
  
    {
      id: "rifling_wear",
      name: "Rifling Wear",
      image: "/faults/rifling_wear.png",
      description:
        "Wear or rounding of rifling grooves inside the barrel due to extensive use.",
  
      causes: [
        "High round count",
        "Improper cleaning tools",
        "Use of abrasive ammunition",
        "Normal operational wear"
      ],
  
      effects: [
        "Reduced accuracy",
        "Poor projectile stabilization",
        "Reduced effective range",
        "Keyholing (tumbling bullets)"
      ],
  
      maintenance: [
        "Use proper bore cleaning equipment",
        "Monitor barrel round count",
        "Inspect rifling periodically"
      ],
  
      solutions: [
        "Replace worn barrel",
        "Reduce usage beyond service life"
      ],
  
      affectedGunTypes: [
        "Rifles",
        "Sniper Rifles",
        "Machine Guns",
        "Pistols"
      ],
  
      severity: "Medium"
    },
  
    {
      id: "throat_erosion",
      name: "Throat Erosion",
      image: "/faults/throat_erosion.png",
      description:
        "Accelerated wear in the throat area (leade) of the barrel where the bullet transitions from chamber to rifling.",
  
      causes: [
        "High temperature propellant gases",
        "Hot barrel conditions",
        "High round count",
        "Aggressive ammunition"
      ],
  
      effects: [
        "Decreased accuracy",
        "Increased bullet jump",
        "Pressure variations",
        "Velocity loss"
      ],
  
      maintenance: [
        "Monitor throat condition with borescope",
        "Allow cooling between shots",
        "Use lower temperature propellants"
      ],
  
      solutions: [
        "Set back and re-chamber barrel",
        "Replace barrel when beyond limits",
        "Use barrel with hardened steel alloy"
      ],
  
      affectedGunTypes: [
        "Precision Rifles",
        "Sniper Rifles",
        "Benchrest Rifles",
        "Machine Guns"
      ],
  
      severity: "High"
    },
  
    {
      id: "muzzle_wear",
      name: "Muzzle Wear",
      image: "/faults/muzzle_wear.png",
      description:
        "Wear at the muzzle end of the barrel affecting bullet exit dynamics.",
  
      causes: [
        "Frequent cleaning rod insertion",
        "Improper muzzle handling",
        "Crown damage",
        "High round count"
      ],
  
      effects: [
        "Reduced accuracy",
        "Inconsistent bullet release",
        "Gas deflection effects",
        "Group size enlargement"
      ],
  
      maintenance: [
        "Use bore guides when cleaning",
        "Protect muzzle when handling",
        "Use proper cleaning rods"
      ],
  
      solutions: [
        "Recrown the barrel",
        "Replace damaged barrel",
        "Use muzzle brake to protect crown"
      ],
  
      affectedGunTypes: [
        "All Rifles",
        "Pistols",
        "Shotguns"
      ],
  
      severity: "Medium"
    },
  
    // ============ CORROSION & CHEMICAL FAULTS ============
    {
      id: "pitting",
      name: "Pitting",
      image: "/faults/pitting.png",
      description:
        "Small pits or cavities formed inside the barrel due to corrosion, moisture, or improper cleaning.",
  
      causes: [
        "Moisture accumulation",
        "Improper cleaning",
        "Corrosive ammunition residue",
        "Long-term storage without lubrication"
      ],
  
      effects: [
        "Reduced accuracy",
        "Increased fouling accumulation",
        "Accelerated corrosion",
        "Reduced barrel lifespan"
      ],
  
      maintenance: [
        "Clean barrel after every firing session",
        "Apply protective lubricants",
        "Store weapons in dry environments",
        "Inspect bore periodically"
      ],
  
      solutions: [
        "Remove minor corrosion through professional cleaning",
        "Replace heavily pitted barrels",
        "Apply anti-corrosion coatings"
      ],
  
      affectedGunTypes: [
        "Rifles",
        "Pistols",
        "Shotguns",
        "Machine Guns"
      ],
  
      severity: "Medium"
    },
  
    {
      id: "corrosion",
      name: "Corrosion / Rust",
      image: "/faults/corrosion.png",
      description:
        "Oxidation and rust formation on the barrel surface due to environmental exposure.",
  
      causes: [
        "Humidity",
        "Water exposure",
        "Improper storage",
        "Lack of lubrication",
        "Failure to clean after use"
      ],
  
      effects: [
        "Reduced accuracy",
        "Surface degradation",
        "Increased friction",
        "Structural weakening"
      ],
  
      maintenance: [
        "Store in moisture-controlled environment",
        "Apply rust-preventive oil",
        "Inspect regularly for rust formation",
        "Use dehumidifiers in storage areas"
      ],
  
      solutions: [
        "Remove rust using approved cleaning methods",
        "Re-blue or re-coat affected surfaces",
        "Replace severely corroded barrels"
      ],
  
      affectedGunTypes: [
        "Rifles",
        "Pistols",
        "Shotguns",
        "Machine Guns",
        "Naval Guns"
      ],
  
      severity: "High"
    },
  
    {
      id: "chemical_pitting",
      name: "Chemical Pitting",
      image: "/faults/chemical_pitting.png",
      description:
        "Chemical attack on barrel steel from corrosive primer residues or ammunition.",
  
      causes: [
        "Corrosive primers (mercuric/chlorate)",
        "Pyrodex residue",
        "Black powder fouling",
        "Acidic cleaning solvents"
      ],
  
      effects: [
        "Surface degradation",
        "Loss of accuracy",
        "Rapid bore deterioration",
        "Increased fouling"
      ],
  
      maintenance: [
        "Clean immediately after firing corrosive ammunition",
        "Use water-based cleaning for corrosive residue",
        "Neutralize acids with alkaline cleaners"
      ],
  
      solutions: [
        "Use non-corrosive ammunition",
        "Replace severely pitted barrels",
        "Apply protective bore coatings"
      ],
  
      affectedGunTypes: [
        "Vintage Rifles",
        "Black Powder Arms",
        "Military Surplus Rifles"
      ],
  
      severity: "High"
    },
  
    {
      id: "galvanic_corrosion",
      name: "Galvanic Corrosion",
      image: "/faults/galvanic_corrosion.png",
      description:
        "Corrosion caused by electrochemical reaction between dissimilar metals in contact.",
  
      causes: [
        "Dissimilar metal contact (steel/aluminum)",
        "Moisture and electrolytes",
        "Poor electrical isolation",
        "Saltwater exposure"
      ],
  
      effects: [
        "Metal degradation",
        "Weakening of barrel attachments",
        "Thread seizure",
        "Surface pitting"
      ],
  
      maintenance: [
        "Use anti-seize compounds",
        "Insulate dissimilar metals",
        "Protect from moisture"
      ],
  
      solutions: [
        "Replace corroded components",
        "Apply protective coatings",
        "Use compatible metals"
      ],
  
      affectedGunTypes: [
        "Composite Barrel Systems",
        "Marine Weapons",
        "Titanium/Steel Barrels"
      ],
  
      severity: "Medium"
    },
  
    // ============ MECHANICAL DAMAGE FAULTS ============
    {
      id: "bulge",
      name: "Barrel Bulge",
      image: "/faults/bulge.png",
      description:
        "Localized expansion or swelling of the barrel caused by excessive pressure or barrel obstruction.",
  
      causes: [
        "Obstructed bore",
        "Squib loads",
        "Excessive chamber pressure",
        "Defective ammunition"
      ],
  
      effects: [
        "Loss of accuracy",
        "Structural weakness",
        "Potential catastrophic barrel failure"
      ],
  
      maintenance: [
        "Inspect barrel before firing",
        "Check for bore obstructions",
        "Use quality ammunition",
        "Perform regular safety inspections"
      ],
  
      solutions: [
        "Immediately remove weapon from service",
        "Replace bulged barrel",
        "Investigate ammunition issues"
      ],
  
      affectedGunTypes: [
        "Rifles",
        "Shotguns",
        "Machine Guns",
        "Tank Guns"
      ],
  
      severity: "Critical"
    },
  
    {
      id: "ring_bulge",
      name: "Ring Bulge",
      image: "/faults/ring_bulge.png",
      description:
        "A ring-shaped bulge in the barrel caused by obstruction or firing with a lodged projectile.",
  
      causes: [
        "Squib load followed by live round",
        "Obstruction in barrel",
        "Improper reloading",
        "Foreign object in bore"
      ],
  
      effects: [
        "Visible ring on barrel exterior",
        "Loss of accuracy",
        "Weakened barrel wall",
        "Potential rupture"
      ],
  
      maintenance: [
        "Clear all obstructions before firing",
        "Inspect barrel after squib loads",
        "Use bore light before shooting"
      ],
  
      solutions: [
        "Replace barrel immediately",
        "Never attempt to fire with obstruction"
      ],
  
      affectedGunTypes: [
        "All Firearms",
        "Reloaders/Handloaders"
      ],
  
      severity: "Critical"
    },
  
    {
      id: "cracks",
      name: "Barrel Cracks",
      image: "/faults/cracks.png",
      description:
        "Fine or visible fractures in barrel material caused by fatigue, manufacturing defects, or excessive pressure.",
  
      causes: [
        "Metal fatigue",
        "Overpressure ammunition",
        "Manufacturing defects",
        "Excessive firing cycles"
      ],
  
      effects: [
        "Loss of structural integrity",
        "Safety hazards",
        "Potential catastrophic failure"
      ],
  
      maintenance: [
        "Conduct regular non-destructive inspections",
        "Monitor round count",
        "Avoid overpressure ammunition"
      ],
  
      solutions: [
        "Immediately remove from service",
        "Replace cracked barrel",
        "Perform root cause analysis"
      ],
  
      affectedGunTypes: [
        "Assault Rifles",
        "Machine Guns",
        "Sniper Rifles",
        "Artillery Systems"
      ],
  
      severity: "Critical"
    },
  
    {
      id: "stress_cracks",
      name: "Stress Cracks",
      image: "/faults/stress_cracks.png",
      description:
        "Microscopic cracks developed in the barrel steel due to cyclic stress and fatigue.",
  
      causes: [
        "Repeated pressure cycling",
        "Poor heat treatment",
        "Material inclusions",
        "High stress concentration areas"
      ],
  
      effects: [
        "Sudden catastrophic failure",
        "Hidden structural damage",
        "Reduced safe service life"
      ],
  
      maintenance: [
        "Magnetic particle inspection",
        "Dye penetrant testing",
        "Ultrasonic testing"
      ],
  
      solutions: [
        "Remove barrel from service",
        "Replace immediately",
        "Investigate manufacturing quality"
      ],
  
      affectedGunTypes: [
        "High-Pressure Rifles",
        "Magnum Calibers",
        "Machine Guns"
      ],
  
      severity: "Critical"
    },
  
    {
      id: "flaking_spalling",
      name: "Flaking / Spalling",
      image: "/faults/flaking_off.png",
      description:
        "Peeling or detachment of small pieces of metal or chrome lining from the barrel surface.",
  
      causes: [
        "Chrome lining degradation",
        "Repeated thermal stress",
        "Manufacturing defects",
        "Excessive firing"
      ],
  
      effects: [
        "Reduced accuracy",
        "Increased fouling",
        "Potential projectile instability"
      ],
  
      maintenance: [
        "Inspect chrome-lined barrels regularly",
        "Avoid prolonged overheating",
        "Follow barrel replacement schedules"
      ],
  
      solutions: [
        "Replace damaged barrel",
        "Avoid continued firing after severe spalling is detected"
      ],
  
      affectedGunTypes: [
        "Chrome-lined Rifles",
        "Machine Guns",
        "Military Assault Rifles"
      ],
  
      severity: "High"
    },
  
    {
      id: "scoring",
      name: "Barrel Scoring",
      image: "/faults/scoring.png",
      description:
        "Deep scratches or gouges in the barrel bore caused by foreign objects or debris.",
  
      causes: [
        "Dirt or debris in bore",
        "Cleaning rod damage",
        "Bullet jacket separation",
        "Jagged metal particles"
      ],
  
      effects: [
        "Damaged rifling",
        "Increased fouling",
        "Reduced accuracy",
        "Bullet deformation"
      ],
  
      maintenance: [
        "Keep bore clean and clear",
        "Use proper cleaning tools",
        "Inspect ammunition quality"
      ],
  
      solutions: [
        "Evaluate damage severity",
        "Replace if rifling damaged",
        "Professional bore lapping"
      ],
  
      affectedGunTypes: [
        "All Firearms"
      ],
  
      severity: "High"
    },
  
    {
      id: "tool_marks",
      name: "Tool Marks",
      image: "/faults/tool_marks.png",
      description:
        "Imperfections from manufacturing processes like drilling, reaming, or rifling.",
  
      causes: [
        "Machining errors",
        "Dull cutting tools",
        "Improper feed rates",
        "Vibration during manufacturing"
      ],
  
      effects: [
        "Poor accuracy",
        "Increased fouling",
        "Early barrel wear",
        "Reduced velocity"
      ],
  
      maintenance: [
        "Inspect new barrels for quality",
        "Test accuracy before acceptance",
        "Request high-quality barrels"
      ],
  
      solutions: [
        "Reject defective barrels",
        "Use premium barrel manufacturers",
        "Consider custom match barrels"
      ],
  
      affectedGunTypes: [
        "All Factory Barrels",
        "Mass-Produced Firearms"
      ],
  
      severity: "Medium"
    },
  
    // ============ OBSTRUCTION & FOREIGN OBJECT FAULTS ============
    {
      id: "bore_obstruction",
      name: "Bore Obstruction",
      image: "/faults/bore_obstruction.png",
      description:
        "Foreign objects or debris blocking the barrel bore.",
  
      causes: [
        "Mud or debris",
        "Snow or ice",
        "Cleaning patches left in bore",
        "Bullet jacket separation",
        "Case rupture fragments"
      ],
  
      effects: [
        "Barrel bulge or rupture",
        "Catastrophic failure",
        "Safety hazard"
      ],
  
      maintenance: [
        "Always check bore before firing",
        "Keep barrel covers on",
        "Inspect after cleaning"
      ],
  
      solutions: [
        "Remove obstruction safely",
        "Never attempt to fire with obstruction",
        "If in doubt, gunsmith inspection"
      ],
  
      affectedGunTypes: [
        "All Firearms"
      ],
  
      severity: "Critical"
    },
  
    {
      id: "squib_load",
      name: "Squib Load Damage",
      image: "/faults/squib_load.png",
      description:
        "Damage caused by a bullet stuck in the barrel from insufficient propellant.",
  
      causes: [
        "Insufficient powder charge",
        "Primer-only ignition",
        "Reloading errors",
        "Obstructed flash hole"
      ],
  
      effects: [
        "Bulge or ring in barrel",
        "Barrel obstruction",
        "Potential catastrophic failure"
      ],
  
      maintenance: [
        "Watch for reduced report",
        "Check bore after every misfire",
        "Quality control ammunition"
      ],
  
      solutions: [
        "Remove stuck bullet safely",
        "Inspect barrel for damage",
        "Replace damaged barrel"
      ],
  
      affectedGunTypes: [
        "All Firearms",
        "Reloaders/Handloaders"
      ],
  
      severity: "Critical"
    },
  
    // ============ THERMAL & HEAT-RELATED FAULTS ============
    {
      id: "heat_checking",
      name: "Heat Checking",
      image: "/faults/heat_checking.png",
      description:
        "Network of fine cracks on barrel surface from thermal cycling.",
  
      causes: [
        "Rapid temperature changes",
        "Sustained automatic fire",
        "Insufficient cooling",
        "High rate of fire"
      ],
  
      effects: [
        "Surface cracking",
        "Reduced accuracy",
        "Increased erosion"
      ],
  
      maintenance: [
        "Allow cooling between sessions",
        "Use heat-dissipating barrel profiles",
        "Monitor barrel temperature"
      ],
  
      solutions: [
        "Replace cracked barrel",
        "Reduce firing rates",
        "Use fluted or heavy barrels"
      ],
  
      affectedGunTypes: [
        "Machine Guns",
        "Automatic Rifles",
        "Full-Auto Weapons"
      ],
  
      severity: "High"
    },
  
    {
      id: "barrel_melting",
      name: "Barrel Melting",
      image: "/faults/barrel_melting.png",
      description:
        "Thermal deformation and melting of barrel material at extreme temperatures.",
  
      causes: [
        "Extreme sustained fire",
        "Defective cooling system",
        "Use of mismatched ammunition",
        "Catastrophic overheating"
      ],
  
      effects: [
        "Complete barrel failure",
        "Weapon destruction",
        "Safety hazard"
      ],
  
      maintenance: [
        "Never exceed firing limits",
        "Ensure cooling systems work",
        "Monitor barrel temperature"
      ],
  
      solutions: [
        "Replace barrel",
        "Implement firing schedule",
        "Use heat-resistant alloys"
      ],
  
      affectedGunTypes: [
        "Machine Guns",
        "Cannons",
        "Artillery",
        "Rapid-Fire Weapons"
      ],
  
      severity: "Critical"
    },
  
    {
      id: "thermal_distortion",
      name: "Thermal Distortion",
      image: "/faults/thermal_distortion.png",
      description:
        "Barrel bending or warping from uneven heating.",
  
      causes: [
        "Uneven heat distribution",
        "Heavy barrel heating",
        "Shadowing effect (light barrel)",
        "Inadequate heat treatment"
      ],
  
      effects: [
        "Zero shift",
        "Reduced accuracy",
        "Point of impact change"
      ],
  
      maintenance: [
        "Allow barrel cooling",
        "Use free-floating barrels",
        "Consider heavy barrel profiles"
      ],
  
      solutions: [
        "Replace warped barrel",
        "Use stress-relieved barrels",
        "Implement firing schedule"
      ],
  
      affectedGunTypes: [
        "Sniper Rifles",
        "Light Barrels",
        "Hunting Rifles"
      ],
  
      severity: "High"
    },
  
    // ============ COATING & SURFACE FAULTS ============
    {
      id: "coating_failure",
      name: "Coating Failure",
      image: "/faults/coating_failure.png",
      description:
        "Delamination, peeling, or failure of barrel coatings like chrome, nitride, or DLC.",
  
      causes: [
        "Poor coating process",
        "Bonding failure",
        "Impact damage",
        "Thermal expansion mismatch"
      ],
  
      effects: [
        "Accelerated wear",
        "Increased corrosion",
        "Reduced barrel life",
        "Fouling issues"
      ],
  
      maintenance: [
        "Inspect coating regularly",
        "Avoid abrasive cleaners",
        "Use gentle cleaning methods"
      ],
  
      solutions: [
        "Strip and recoating",
        "Replace barrel",
        "Use alternative coatings"
      ],
  
      affectedGunTypes: [
        "Nitride Barrels",
        "DLC Coated Barrels",
        "Cerakote Barrels"
      ],
  
      severity: "Medium"
    },
  
    {
      id: "chrome_stripping",
      name: "Chrome Lining Stripping",
      image: "/faults/chrome_stripping.png",
      description:
        "Peeling or loss of hard chrome lining in barrel bore.",
  
      causes: [
        "Electroplating defects",
        "Hydrogen embrittlement",
        "Thin chrome layer",
        "Aggressive cleaning"
      ],
  
      effects: [
        "Exposed steel corrosion",
        "Increased wear",
        "Reduced accuracy",
        "Fouling increase"
      ],
  
      maintenance: [
        "Proper break-in procedure",
        "Avoid ammonia-based cleaners",
        "Use chrome-safe solvents"
      ],
  
      solutions: [
        "Replace barrel",
        "Refinish (if possible)",
        "Use stainless steel barrels"
      ],
  
      affectedGunTypes: [
        "Military Barrels",
        "M16/M4 Series",
        "Machine Guns"
      ],
  
      severity: "High"
    },
  
    // ============ CHAMBER-RELATED FAULTS ============
    {
      id: "chamber_erosion",
      name: "Chamber Erosion",
      image: "/faults/chamber_erosion.png",
      description:
        "Wear and degradation of the chamber area from pressure and heat.",
  
      causes: [
        "Hot propellant gases",
        "Frequent firing",
        "Improper headspace",
        "Carbon ring formation"
      ],
  
      effects: [
        "Case stickiness",
        "Extraction problems",
        "Pressure venting",
        "Reduced accuracy"
      ],
  
      maintenance: [
        "Clean chamber thoroughly",
        "Remove carbon rings",
        "Inspect with borescope"
      ],
  
      solutions: [
        "Ream chamber to next size",
        "Set back and rechamber",
        "Replace barrel"
      ],
  
      affectedGunTypes: [
        "All Rifles",
        "Machine Guns",
        "Sniper Rifles"
      ],
  
      severity: "High"
    },
  
    {
      id: "chamber_pitting",
      name: "Chamber Pitting",
      image: "/faults/chamber_pitting.png",
      description:
        "Corrosion pits in the chamber affecting case extraction.",
  
      causes: [
        "Moisture in chamber",
        "Corrosive ammunition",
        "Improper storage",
        "Infrequent cleaning"
      ],
  
      effects: [
        "Case sticking",
        "Difficult extraction",
        "Case rupture risk",
        "Headspace issues"
      ],
  
      maintenance: [
        "Keep chamber clean and dry",
        "Lubricate lightly after cleaning",
        "Store with chamber dry"
      ],
  
      solutions: [
        "Polish chamber",
        "Ream if necessary",
        "Replace barrel"
      ],
  
      affectedGunTypes: [
        "All Firearms"
      ],
  
      severity: "High"
    },
  
    {
      id: "damaged_chamber",
      name: "Damaged Chamber",
      image: "/faults/damaged_chamber.png",
      description:
        "Physical damage to chamber from improper handling or overpressure.",
  
      causes: [
        "Overpressure ammunition",
        "Improper extraction",
        "Tool damage",
        "Obstructed chamber"
      ],
  
      effects: [
        "Case rupture",
        "Extraction failures",
        "Unsafe operation"
      ],
  
      maintenance: [
        "Use correct cleaning tools",
        "Inspect chamber regularly",
        "Headspace checks"
      ],
  
      solutions: [
        "Gunsmith repair",
        "Set back barrel",
        "Replace barrel"
      ],
  
      affectedGunTypes: [
        "All Firearms"
      ],
  
      severity: "Critical"
    },
  
    // ============ SIGHT & ATTACHMENT FAULTS ============
    {
      id: "loose_barrel_extension",
      name: "Loose Barrel Extension",
      image: "/faults/loose_extension.png",
      description:
        "Loosening of the barrel extension or barrel-to-receiver connection.",
  
      causes: [
        "Lack of torque",
        "Thread wear",
        "Thermal expansion",
        "Impact damage"
      ],
  
      effects: [
        "Zero shift",
        "Accuracy loss",
        "Headspace changes",
        "Safety issues"
      ],
  
      maintenance: [
        "Check torque regularly",
        "Use proper lubricants",
        "Mark timing marks"
      ],
  
      solutions: [
        "Retorque properly",
        "Replacement if worn",
        "Use thread locking compound"
      ],
  
      affectedGunTypes: [
        "AR-15 Platform",
        "Barrel Nut Systems",
        "Quick-Change Barrels"
      ],
  
      severity: "High"
    },
  
    {
      id: "loose_sights",
      name: "Loose Sights",
      image: "/faults/loose_sights.png",
      description:
        "Front or rear sight bases becoming loose or misaligned.",
  
      causes: [
        "Impact damage",
        "Vibration",
        "Improper attachment",
        "Temperature changes"
      ],
  
      effects: [
        "Zero shift",
        "Accuracy loss",
        "Inconsistent POI"
      ],
  
      maintenance: [
        "Check sight tightness",
        "Stake or loctite sights",
        "Inspect regularly"
      ],
  
      solutions: [
        "Tighten and loctite",
        "Replace sight base",
        "Recalibrate zero"
      ],
  
      affectedGunTypes: [
        "All Firearms"
      ],
  
      severity: "Medium"
    },
  
    // ============ BARREL LIFETIME & FATIGUE FAULTS ============
    {
      id: "fatigue_failure",
      name: "Fatigue Failure",
      image: "/faults/fatigue_failure.png",
      description:
        "Barrel failure from cumulative cyclic loading over service life.",
  
      causes: [
        "Exceeded service life",
        "Manufacturing defects",
        "Inadequate design",
        "Stress risers"
      ],
  
      effects: [
        "Sudden failure",
        "Catastrophic damage",
        "Safety hazard"
      ],
  
      maintenance: [
        "Track round count",
        "Follow replacement schedules",
        "Periodic inspections"
      ],
  
      solutions: [
        "Replace barrel proactively",
        "Use improved materials",
        "Stress relief procedures"
      ],
  
      affectedGunTypes: [
        "All Firearms"
      ],
  
      severity: "Critical"
    },
  
    {
      id: "barrel_swaging",
      name: "Barrel Swaging",
      image: "/faults/barrel_swaging.png",
      description:
        "Reduction in barrel diameter from external forces or impact.",
  
      causes: [
        "Vice damage",
        "Impact from falling",
        "Vehicle running over",
        "Improper gunsmithing"
      ],
  
      effects: [
        "Bore restriction",
        "Pressure increase",
        "Reduced accuracy",
        "Bullet damage"
      ],
  
      maintenance: [
        "Handle with care",
        "Use proper supports",
        "Protect when stored"
      ],
  
      solutions: [
        "Replace barrel",
        "Professional assessment"
      ],
  
      affectedGunTypes: [
        "All Firearms"
      ],
  
      severity: "High"
    },
  
    {
      id: "gas_port_erosion",
      name: "Gas Port Erosion",
      image: "/faults/gas_port_erosion.png",
      description:
        "Wear and enlargement of gas port hole in gas-operated firearms.",
  
      causes: [
        "Hot propellant gas erosion",
        "High round count",
        "Carbon accumulation",
        "Aggressive ammunition"
      ],
  
      effects: [
        "Gas system issues",
        "Cycling problems",
        "Increased recoil",
        "Bolt timing issues"
      ],
  
      maintenance: [
        "Clean gas system regularly",
        "Monitor gas port condition",
        "Use appropriate ammunition"
      ],
  
      solutions: [
        "Replace barrel",
        "Adjust gas system",
        "Use adjustable gas block"
      ],
  
      affectedGunTypes: [
        "Gas-Operated Rifles",
        "AR-15 Platform",
        "AK-Series",
        "Machine Guns"
      ],
  
      severity: "High"
    },
  
    // ============ THREAD & MOUNTING FAULTS ============
    {
      id: "damaged_threads",
      name: "Damaged Threads",
      image: "/faults/damaged_threads.png",
      description:
        "Cross-threaded or damaged barrel threads on receiver or muzzle.",
  
      causes: [
        "Cross-threading",
        "Over-torquing",
        "Corrosion",
        "Impact damage"
      ],
  
      effects: [
        "Muzzle device issues",
        "Barrel mounting problems",
        "Suppressor misalignment",
        "Safety concerns"
      ],
  
      maintenance: [
        "Use thread protectors",
        "Proper torque techniques",
        "Clean threads regularly"
      ],
  
      solutions: [
        "Chase threads",
        "Recut if possible",
        "Replace barrel"
      ],
  
      affectedGunTypes: [
        "Threaded Barrels",
        "Suppressor Hosts",
        "Muzzle Brake Barrels"
      ],
  
      severity: "High"
    },
  
    {
      id: "muzzle_device_damage",
      name: "Muzzle Device Damage",
      image: "/faults/muzzle_device_damage.png",
      description:
        "Damage to muzzle brake, flash hider, or suppressor mount.",
  
      causes: [
        "Impact damage",
        "Strike from projectile",
        "Corrosion",
        "Carbon buildup"
      ],
  
      effects: [
        "Accuracy loss",
        "Reduced performance",
        "Suppressor baffle strikes",
        "Recoil change"
      ],
  
      maintenance: [
        "Inspect muzzle devices",
        "Clean regularly",
        "Check alignment"
      ],
  
      solutions: [
        "Replace damaged device",
        "Recrown barrel if needed",
        "Professional repair"
      ],
  
      affectedGunTypes: [
        "All Firearms with Muzzle Devices"
      ],
  
      severity: "Medium"
    },
  
    // ============ RARE OR SPECIALIZED FAULTS ============
    {
      id: "stress_corrosion_cracking",
      name: "Stress Corrosion Cracking",
      image: "/faults/scc.png",
      description:
        "Cracking caused by combined effect of stress and corrosive environment.",
  
      causes: [
        "Chloride exposure",
        "High stress",
        "Inadequate material choice",
        "Saltwater environment"
      ],
  
      effects: [
        "Sudden failure",
        "Safety hazard",
        "Weapon destruction"
      ],
  
      maintenance: [
        "Protect from salt water",
        "Use corrosion-resistant alloys",
        "Regular inspections"
      ],
  
      solutions: [
        "Use stainless steel",
        "Replace susceptible barrels",
        "Apply protective coatings"
      ],
  
      affectedGunTypes: [
        "Marine Firearms",
        "Naval Guns",
        "Stainless Steel Barrels"
      ],
  
      severity: "Critical"
    },
  
    {
      id: "thermal_fatigue",
      name: "Thermal Fatigue",
      image: "/faults/thermal_fatigue.png",
      description:
        "Damage from repeated heating and cooling cycles causing material degradation.",
  
      causes: [
        "Rapid temperature changes",
        "High round count",
        "Sustained fire",
        "Inadequate cooling"
      ],
  
      effects: [
        "Material property degradation",
        "Cracking",
        "Reduced barrel life"
      ],
  
      maintenance: [
        "Controlled firing schedule",
        "Allow cooling time",
        "Monitor temperature"
      ],
  
      solutions: [
        "Replace barrel",
        "Use thermal resistant alloys",
        "Implement cooling systems"
      ],
  
      affectedGunTypes: [
        "Machine Guns",
        "Precision Rifles",
        "Artillery"
      ],
  
      severity: "High"
    },
  
    {
      id: "fretting_corrosion",
      name: "Fretting Corrosion",
      image: "/faults/fretting.png",
      description:
        "Wear and corrosion at contact surfaces between barrel and receiver.",
  
      causes: [
        "Minor movement under fire",
        "Lack of lubrication",
        "Vibration",
        "Improper fit"
      ],
  
      effects: [
        "Surface degradation",
        "Poor accuracy",
        "Increased headspace",
        "Gas leakage"
      ],
  
      maintenance: [
        "Proper barrel fit",
        "Use anti-seize compounds",
        "Regular inspection"
      ],
  
      solutions: [
        "Bedding compound application",
        "Replace worn components",
        "Professional fitting"
      ],
  
      affectedGunTypes: [
        "Barrel Nut Systems",
        "Interchangeable Barrels",
        "Press-Fit Barrels"
      ],
  
      severity: "Medium"
    },
  
    {
      id: "hydrogen_embrittlement",
      name: "Hydrogen Embrittlement",
      image: "/faults/hydrogen_embrittlement.png",
      description:
        "Loss of ductility and strength from hydrogen absorption during processing.",
  
      causes: [
        "Electroplating process",
        "Acid cleaning",
        "High-strength steel",
        "Manufacturing defects"
      ],
  
      effects: [
        "Sudden failure",
        "Stress cracking",
        "Catastrophic fracture"
      ],
  
      maintenance: [
        "Proper heat treatment after plating",
        "Baking processes",
        "Quality control"
      ],
  
      solutions: [
        "Replace affected barrels",
        "Bake-out treatment",
        "Avoid embrittlement processes"
      ],
  
      affectedGunTypes: [
        "High-Strength Barrels",
        "Plated Barrels",
        "Match Grade Barrels"
      ],
  
      severity: "Critical"
    },
  
    {
      id: "inclusion_defects",
      name: "Inclusion Defects",
      image: "/faults/inclusion.png",
      description:
        "Non-metallic inclusions in barrel steel from manufacturing causing weak points.",
  
      causes: [
        "Poor steel quality",
        "Manufacturing defects",
        "Contamination",
        "Inadequate quality control"
      ],
  
      effects: [
        "Stress risers",
        "Crack initiation",
        "Reduced fatigue life"
      ],
  
      maintenance: [
        "Quality material selection",
        "Magnetic particle inspection",
        "Ultrasonic testing"
      ],
  
      solutions: [
        "Replace defective barrels",
        "Improve quality control",
        "Use premium steel"
      ],
  
      affectedGunTypes: [
        "All Barrels",
        "Cheaper Manufactured Barrels"
      ],
  
      severity: "High"
    },
  
    {
      id: "galling",
      name: "Galling",
      image: "/faults/galling.png",
      description:
        "Surface damage caused by friction welding between moving parts.",
  
      causes: [
        "Stainless steel on stainless steel",
        "Lack of lubrication",
        "High pressure",
        "Rough surfaces"
      ],
  
      effects: [
        "Seized components",
        "Barrel removal issues",
        "Thread damage"
      ],
  
      maintenance: [
        "Use anti-seize compound",
        "Proper lubrication",
        "Different alloys"
      ],
  
      solutions: [
        "Separate and repair",
        "Replacement of components",
        "Use dissimilar metals"
      ],
  
      affectedGunTypes: [
        "Stainless Steel Barrels",
        "Threaded Connections"
      ],
  
      severity: "High"
    }
  ];