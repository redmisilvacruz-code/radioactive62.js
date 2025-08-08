// Mod de Radiação para Sandboxels
// Adiciona elementos radioativos e mecânicas de radiação

// Elemento Urânio - fonte de radiação
elements.uranium = {
    color: "#32CD32",
    behavior: [
        "XX|XX|XX",
        "XX|XX|XX", 
        "XX|XX|XX"
    ],
    reactions: {
        "neutron": { "elem1": "uranium_235", "elem2": null }
    },
    category: "radioactive",
    state: "solid",
    density: 19050,
    conduct: 0.1,
    tempHigh: 1405,
    stateHigh: "molten_uranium",
    radiation: 5, // Nível de radiação
    tick: function(pixel) {
        // Emite radiação ocasionalmente
        if (Math.random() < 0.01) {
            emitRadiation(pixel.x, pixel.y, 3);
        }
        // Decaimento radioativo muito lento
        if (Math.random() < 0.0001) {
            changePixel(pixel, "lead");
        }
    }
};

// Urânio enriquecido - mais radioativo
elements.uranium_235 = {
    color: "#00FF00",
    behavior: [
        "XX|XX|XX",
        "XX|XX|XX",
        "XX|XX|XX"
    ],
    reactions: {
        "neutron": { "elem1": ["explosion","explosion","neutron","neutron"], "elem2": null, "chance": 0.3 }
    },
    category: "radioactive",
    state: "solid", 
    density: 19050,
    conduct: 0.1,
    tempHigh: 1405,
    stateHigh: "molten_uranium",
    radiation: 15,
    tick: function(pixel) {
        // Emite mais radiação
        if (Math.random() < 0.03) {
            emitRadiation(pixel.x, pixel.y, 5);
        }
        // Chance de fissão espontânea
        if (Math.random() < 0.0005) {
            createPixel("neutron", pixel.x + Math.random() * 6 - 3, pixel.y + Math.random() * 6 - 3);
            createPixel("neutron", pixel.x + Math.random() * 6 - 3, pixel.y + Math.random() * 6 - 3);
        }
    }
};

// Urânio derretido
elements.molten_uranium = {
    color: "#90EE90",
    behavior: behaviors.LIQUID,
    reactions: {
        "water": { "elem1": "uranium", "elem2": "steam", "temp2": 200 }
    },
    category: "radioactive",
    state: "liquid",
    density: 17300,
    conduct: 0.15,
    tempLow: 1400,
    stateLow: "uranium",
    radiation: 8,
    tick: function(pixel) {
        if (Math.random() < 0.02) {
            emitRadiation(pixel.x, pixel.y, 4);
        }
    }
};

// Plutônio - altamente radioativo
elements.plutonium = {
    color: "#C0C0C0",
    behavior: [
        "XX|XX|XX",
        "XX|XX|XX",
        "XX|XX|XX"
    ],
    reactions: {
        "neutron": { "elem1": ["explosion","explosion","explosion","neutron","neutron"], "elem2": null, "chance": 0.7 }
    },
    category: "radioactive",
    state: "solid",
    density: 19816,
    conduct: 0.1,
    tempHigh: 912,
    stateHigh: "molten_plutonium",
    radiation: 25,
    tick: function(pixel) {
        // Altamente radioativo
        if (Math.random() < 0.05) {
            emitRadiation(pixel.x, pixel.y, 7);
        }
        // Aquece pelo decaimento
        pixel.temp += 0.1;
    }
};

// Plutônio derretido
elements.molten_plutonium = {
    color: "#A9A9A9",
    behavior: behaviors.LIQUID,
    category: "radioactive",
    state: "liquid",
    density: 16630,
    conduct: 0.2,
    tempLow: 900,
    stateLow: "plutonium",
    radiation: 30,
    tick: function(pixel) {
        if (Math.random() < 0.07) {
            emitRadiation(pixel.x, pixel.y, 8);
        }
        pixel.temp += 0.2;
    }
};

// Césio radioativo
elements.cesium_137 = {
    color: "#FFD700",
    behavior: behaviors.POWDER,
    reactions: {
        "water": { "elem1": "radioactive_water", "elem2": null }
    },
    category: "radioactive",
    state: "solid",
    density: 1873,
    radiation: 12,
    tick: function(pixel) {
        if (Math.random() < 0.025) {
            emitRadiation(pixel.x, pixel.y, 4);
        }
        // Decai para bário
        if (Math.random() < 0.00005) {
            changePixel(pixel, "barium");
        }
    }
};

// Água contaminada
elements.radioactive_water = {
    color: "#00FFFF",
    behavior: behaviors.LIQUID,
    reactions: {
        "plant": { "elem1": null, "elem2": "dead_plant" },
        "meat": { "elem1": null, "elem2": "rotten_meat" }
    },
    category: "radioactive",
    state: "liquid",
    density: 1000,
    conduct: 1,
    tempHigh: 100,
    stateHigh: "radioactive_steam",
    tempLow: 0,
    stateLow: "radioactive_ice",
    radiation: 3,
    tick: function(pixel) {
        if (Math.random() < 0.005) {
            emitRadiation(pixel.x, pixel.y, 2);
        }
    }
};

// Vapor radioativo
elements.radioactive_steam = {
    color: "#E0FFFF",
    behavior: behaviors.GAS,
    category: "radioactive",
    state: "gas",
    density: 0.6,
    tempLow: 99,
    stateLow: "radioactive_water",
    radiation: 2,
    tick: function(pixel) {
        if (Math.random() < 0.003) {
            emitRadiation(pixel.x, pixel.y, 1);
        }
    }
};

// Gelo radioativo
elements.radioactive_ice = {
    color: "#B0E0E6",
    behavior: [
        "XX|XX|XX",
        "XX|XX|XX",
        "XX|XX|XX"
    ],
    category: "radioactive",
    state: "solid",
    density: 917,
    tempHigh: 1,
    stateHigh: "radioactive_water",
    radiation: 2
};

// Nêutron - partícula para reações nucleares
elements.neutron = {
    color: "#FFFFFF",
    behavior: [
        "M2%5|M1|M2%5",
        "M1|XX|M1",
        "M2%5|M1|M2%5"
    ],
    category: "energy",
    state: "gas",
    density: 0.001,
    tick: function(pixel) {
        // Nêutrons desaparecem após um tempo
        if (!pixel.life) pixel.life = 100;
        pixel.life--;
        if (pixel.life <= 0) {
            deletePixel(pixel.x, pixel.y);
        }
    }
};

// Material de proteção contra radiação
elements.lead_shield = {
    color: "#708090",
    behavior: [
        "XX|XX|XX",
        "XX|XX|XX",
        "XX|XX|XX"
    ],
    category: "solids",
    state: "solid",
    density: 11340,
    conduct: 0.1,
    tempHigh: 600,
    stateHigh: "molten_lead_shield",
    radiation: -5, // Absorve radiação
    reactions: {
        "acid": { "elem1": "lead", "elem2": "hydrogen" }
    }
};

// Chumbo derretido (proteção)
elements.molten_lead_shield = {
    color: "#778899",
    behavior: behaviors.LIQUID,
    category: "liquids",
    state: "liquid",
    density: 10660,
    conduct: 0.15,
    tempLow: 590,
    stateLow: "lead_shield",
    radiation: -3
};

// Detector Geiger (visual)
elements.geiger_counter = {
    color: "#4169E1",
    behavior: [
        "XX|XX|XX",
        "XX|XX|XX",
        "XX|XX|XX"
    ],
    category: "machines",
    state: "solid",
    density: 2000,
    conduct: 0.5,
    tick: function(pixel) {
        // Detecta radiação próxima e muda de cor
        let radiationLevel = detectRadiationNearby(pixel.x, pixel.y, 5);
        if (radiationLevel > 20) {
            pixel.color = pixelColorPick(pixel, "#FF0000"); // Vermelho - alta radiação
        } else if (radiationLevel > 10) {
            pixel.color = pixelColorPick(pixel, "#FFA500"); // Laranja - média radiação
        } else if (radiationLevel > 5) {
            pixel.color = pixelColorPick(pixel, "#FFFF00"); // Amarelo - baixa radiação
        } else {
            pixel.color = pixelColorPick(pixel, "#4169E1"); // Azul - sem radiação
        }
    }
};

// Funções auxiliares para o sistema de radiação

// Emite radiação em uma área
function emitRadiation(x, y, intensity) {
    let radius = Math.floor(intensity / 2) + 1;
    for (let dx = -radius; dx <= radius; dx++) {
        for (let dy = -radius; dy <= radius; dy++) {
            let distance = Math.sqrt(dx*dx + dy*dy);
            if (distance <= radius && distance > 0) {
                let targetX = x + dx;
                let targetY = y + dy;
                let radiationStrength = intensity / distance;
                applyRadiation(targetX, targetY, radiationStrength);
            }
        }
    }
}

// Aplica efeitos de radiação em um pixel
function applyRadiation(x, y, strength) {
    if (!isEmpty(x, y, true)) {
        let pixel = pixelMap[x][y];
        if (!pixel.radiation_exposure) pixel.radiation_exposure = 0;
        pixel.radiation_exposure += strength;
        
        // Efeitos da radiação
        if (pixel.radiation_exposure > 50) {
            // Mutação/destruição em elementos orgânicos
            if (pixel.element === "plant") {
                changePixel(pixel, "dead_plant");
            } else if (pixel.element === "meat") {
                changePixel(pixel, "rotten_meat");
            } else if (pixel.element === "human") {
                changePixel(pixel, "bone");
            }
        }
        
        // Aquecimento por radiação
        if (pixel.radiation_exposure > 20) {
            pixel.temp += strength * 0.1;
        }
    }
}

// Detecta nível de radiação em uma área
function detectRadiationNearby(x, y, radius) {
    let totalRadiation = 0;
    for (let dx = -radius; dx <= radius; dx++) {
        for (let dy = -radius; dy <= radius; dy++) {
            let targetX = x + dx;
            let targetY = y + dy;
            if (!isEmpty(targetX, targetY, true)) {
                let pixel = pixelMap[targetX][targetY];
                if (elements[pixel.element].radiation) {
                    let distance = Math.sqrt(dx*dx + dy*dy);
                    if (distance <= radius && distance > 0) {
                        totalRadiation += elements[pixel.element].radiation / distance;
                    }
                }
            }
        }
    }
    return totalRadiation;
}

// Adiciona categoria de radioativos
elements.categories = elements.categories || {};
elements.categories.radioactive = {
    name: "Radioactive",
    color: "#32CD32"
};

console.log("Mod de Radiação carregado com sucesso!");
