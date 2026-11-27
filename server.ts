import 'dotenv/config';
import express from 'express';
import path from 'path';
import { fileURLToPath } from 'url';
import { GoogleGenAI, ThinkingLevel, Type } from '@google/genai';
import { createServer as createViteServer } from 'vite';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const PORT = Number(process.env.PORT) || 3000;
const MODEL_NAME = 'gemini-4-hydrogen';

const ALLOWED_MIME_TYPES = new Set([
  'image/jpeg',
  'image/png',
  'image/webp',
  'image/gif',
]);

type ValidWasteCategory =
  | 'Wet Waste'
  | 'Dry Waste'
  | 'Sanitary Waste'
  | 'Special Care Waste'
  | 'Unclear';

function createGeminiClient(): GoogleGenAI {
  const apiKey = process.env.GEMINI_API_KEY;
  if (!apiKey) {
    throw new Error(
      'GEMINI_API_KEY is not configured. Please add your API key in Settings > Secrets.'
    );
  }
  return new GoogleGenAI({
    apiKey,
    httpOptions: {
      headers: {
        'User-Agent': 'aistudio-build',
      },
    },
  });
}

const wasteAnalysisSchema = {
  type: Type.OBJECT,
  properties: {
    itemName: {
      type: Type.STRING,
      description:
        'Clear, everyday Indian name of the identified waste item (e.g., LDPE Milk Packet, Banana Peel, Used Sanitary Pad, AA Alkaline Battery). If unclear, write "Unclear Item — More Details Needed".',
    },
    material: {
      type: Type.STRING,
      description:
        'Primary material composition (e.g., Organic Plant Matter, LDPE Plastic #4, PET Plastic #1, Absorbent Polymer & Cellulose, Lithium-ion / Heavy Metals, Glass & Mercury Vapour).',
    },
    category: {
      type: Type.STRING,
      description:
        'Must be strictly one of India SWM Rules 2026 four streams or Unclear: "Wet Waste", "Dry Waste", "Sanitary Waste", "Special Care Waste", or "Unclear".',
    },
    confidence: {
      type: Type.INTEGER,
      description:
        'Honest AI confidence score between 0 and 100. Keep below 60 if the photo is blurry, dark, partial, or ambiguous.',
    },
    needsClarification: {
      type: Type.BOOLEAN,
      description:
        'True if the image is unclear, low-light, blurry, or if missing context (like whether paper is food-soiled or what chemical was inside) prevents safe classification.',
    },
    clarificationQuestion: {
      type: Type.STRING,
      description:
        'If needsClarification is true, ask one specific, polite question to help classify accurately (otherwise return empty string).',
    },
    uncertaintyNote: {
      type: Type.STRING,
      description:
        'Brief, transparent note communicating AI confidence/limitations (e.g., noting that visual AI cannot always detect inner plastic linings, chemical residue, or local ward rules).',
    },
    recommendedHandling: {
      type: Type.STRING,
      description:
        'Clear Indian handling stream under SWM Rules, 2026 (e.g., "Wet Waste Stream (Composting / Municipal Wet Collection)", "Dry Waste Stream (Clean Recyclables / Kabadiwala / MRF)", "Sanitary Waste Stream (Securely Wrapped & Marked)", or "Special Care Waste (Authorised Collection / EPR Drop-Off)"). Never invent specific city bin colours as universal.',
    },
    disposalSteps: {
      type: Type.ARRAY,
      items: { type: Type.STRING },
      description:
        '3 to 4 practical, safe, simple disposal steps tailored to Indian households, schools, or markets.',
    },
    reuseAndUpcycleIdeas: {
      type: Type.ARRAY,
      items: { type: Type.STRING },
      description:
        '2 to 3 safe, practical Indian household or student reuse/recycling suggestions. For Sanitary Waste or hazardous Special Care Waste (expired medicines, syringes, CFLs, pesticide cans, used batteries), DO NOT suggest unsafe DIY reuse—instead provide safe waste-reduction alternatives (e.g., switching to rechargeable batteries or cloth alternatives) or return an empty array.',
    },
    environmentalImpact: {
      type: Type.STRING,
      description:
        'Clear 1 to 2 sentence explanation of the environmental or health impact in India (e.g., methane from unsegregated wet waste, worker safety for sanitary waste, groundwater toxicity from batteries/medicines). Do NOT invent statistics.',
    },
    requiresSpecialSafetyHandling: {
      type: Type.BOOLEAN,
      description:
        'True for all Sanitary Waste, Special Care Waste, and sharp broken items.',
    },
    authorizedChannelRequired: {
      type: Type.BOOLEAN,
      description:
        'True for e-waste, batteries, CFL/tube lights, expired medicines, paint/pesticide containers, or anything requiring CPCB/SPCB-authorised recyclers, EPR take-back, or municipal special care drop-off.',
    },
    commonMistake: {
      type: Type.STRING,
      description:
        'One common sorting mistake in Indian households or schools and how to avoid it.',
    },
    localVariationNote: {
      type: Type.STRING,
      description:
        'One concise reminder explaining how bin colours, doorstep pickup schedules, or authorised drop-off points vary across Indian cities and municipalities, without inventing local facilities or rules.',
    },
  },
  required: [
    'itemName',
    'material',
    'category',
    'confidence',
    'needsClarification',
    'clarificationQuestion',
    'uncertaintyNote',
    'recommendedHandling',
    'disposalSteps',
    'reuseAndUpcycleIdeas',
    'environmentalImpact',
    'requiresSpecialSafetyHandling',
    'authorizedChannelRequired',
    'commonMistake',
    'localVariationNote',
  ],
};

const SANITARY_KEYWORDS = [
  'diaper',
  'nappy',
  'sanitary pad',
  'sanitary napkin',
  'tampon',
  'menstrual pad',
  'panty liner',
  'condom',
  'soiled bandage',
  'bloody cotton',
  'incontinence pad',
];

const SPECIAL_CARE_KEYWORDS = [
  'battery',
  'batteries',
  'expired medicine',
  'medicine strip',
  'tablet strip',
  'syrup bottle',
  'syringe',
  'needle',
  'cfl',
  'tube light',
  'tubelight',
  'fluorescent bulb',
  'mercury thermometer',
  'paint can',
  'paint tin',
  'paint container',
  'pesticide',
  'insecticide',
  'mosquito repellent liquid',
  'phenyl bottle',
  'bleach bottle',
  'acid cleaner',
  'e-waste',
  'ewaste',
  'charger',
  'power bank',
  'earphone',
  'mobile phone',
  'smartphone',
  'laptop',
  'circuit board',
  'led bulb',
];

function normalizeCategory(raw: string): ValidWasteCategory {
  const value = raw.trim().toLowerCase();
  if (value.includes('unclear') || value.includes('unknown') || value.includes('ambiguous')) {
    return 'Unclear';
  }
  if (value.includes('sanitary')) {
    return 'Sanitary Waste';
  }
  if (
    value.includes('special care') ||
    value.includes('hazard') ||
    value.includes('e-waste') ||
    value.includes('electronic')
  ) {
    return 'Special Care Waste';
  }
  if (
    value.includes('wet') ||
    value.includes('biodegrad') ||
    value.includes('organic') ||
    value.includes('compost')
  ) {
    return 'Wet Waste';
  }
  if (value.includes('dry') || value.includes('recycl')) {
    return 'Dry Waste';
  }
  return 'Unclear';
}

function applySafetyGuardrails(
  rawParsed: Record<string, unknown>,
  userTextContext: string
) {
  let category = normalizeCategory(String(rawParsed.category ?? 'Unclear'));
  const combinedText = [
    String(rawParsed.itemName ?? ''),
    String(rawParsed.material ?? ''),
    userTextContext,
  ]
    .join(' ')
    .toLowerCase();

  // Safety rule: never classify sanitary or special care waste as ordinary Wet/Dry recyclable waste
  const isSanitaryMatch = SANITARY_KEYWORDS.some((kw) => combinedText.includes(kw));
  const isSpecialCareMatch = SPECIAL_CARE_KEYWORDS.some((kw) => combinedText.includes(kw));

  if (isSanitaryMatch && category !== 'Unclear') {
    category = 'Sanitary Waste';
  } else if (isSpecialCareMatch && category !== 'Unclear') {
    category = 'Special Care Waste';
  }

  let confidence = Math.min(100, Math.max(0, Math.round(Number(rawParsed.confidence) || 70)));
  let needsClarification = Boolean(rawParsed.needsClarification);

  if (category === 'Unclear' || confidence < 55) {
    needsClarification = true;
    if (confidence < 45) {
      category = 'Unclear';
    }
  }

  const requiresSpecialSafetyHandling =
    category === 'Sanitary Waste' ||
    category === 'Special Care Waste' ||
    Boolean(rawParsed.requiresSpecialSafetyHandling);

  const authorizedChannelRequired =
    category === 'Special Care Waste' ||
    Boolean(rawParsed.authorizedChannelRequired);

  const disposalSteps = Array.isArray(rawParsed.disposalSteps)
    ? rawParsed.disposalSteps.map(String).filter(Boolean)
    : [];

  if (category === 'Sanitary Waste' && disposalSteps.length === 0) {
    disposalSteps.push(
      'Wrap the used sanitary item securely in newspaper or the disposal pouch provided by the manufacturer.',
      'Mark or keep the wrapped parcel strictly separate from Wet Waste and Dry Waste so sanitation workers stay safe.',
      'Hand it over in the dedicated Sanitary Waste compartment or bag as per your local municipal collection schedule.'
    );
  }

  if (category === 'Special Care Waste' && disposalSteps.length === 0) {
    disposalSteps.push(
      'Keep this item completely separate from household Wet Waste, Dry Waste, and Sanitary Waste.',
      'Store safely out of reach of children and pets in a dry, sealed container (tape battery terminals if applicable).',
      'Hand over only through an authorised CPCB/SPCB collection centre, producer EPR take-back point, or municipal Special Care Waste drive.'
    );
  }

  const clarificationQuestion =
    String(rawParsed.clarificationQuestion ?? '').trim() ||
    (needsClarification
      ? 'Could you share a clearer photo in good lighting or briefly describe what the item is made of and whether it is soiled or contains batteries/chemicals?'
      : '');

  const uncertaintyNote =
    String(rawParsed.uncertaintyNote ?? '').trim() ||
    (needsClarification
      ? 'The AI is uncertain about this item. Please confirm the material before disposing of it.'
      : 'AI identification is based on visual/text cues and may not detect inner coatings or chemical residues. Always double-check labels before sorting.');

  const localVariationNote =
    String(rawParsed.localVariationNote ?? '').trim() ||
    'Under India’s SWM Rules, 2026, four-stream segregation applies nationwide, but bin colours, collection timings, and authorised drop-off locations vary across cities and municipalities.';

  return {
    itemName: String(rawParsed.itemName ?? 'Unidentified Item'),
    material: String(rawParsed.material ?? 'Unknown Material'),
    category,
    confidence,
    needsClarification,
    clarificationQuestion,
    uncertaintyNote,
    recommendedHandling: String(
      rawParsed.recommendedHandling ??
        (category === 'Unclear'
          ? 'Please confirm item details before sorting'
          : `${category} stream under India’s SWM Rules, 2026`)
    ),
    disposalSteps,
    reuseAndUpcycleIdeas: Array.isArray(rawParsed.reuseAndUpcycleIdeas)
      ? rawParsed.reuseAndUpcycleIdeas.map(String).filter(Boolean)
      : [],
    environmentalImpact: String(
      rawParsed.environmentalImpact ??
        'Proper segregation keeps recyclables clean, prevents landfill contamination, and protects sanitation workers.'
    ),
    requiresSpecialSafetyHandling,
    authorizedChannelRequired,
    commonMistake: String(
      rawParsed.commonMistake ??
        'Mixing sanitary or special care items with regular dry recyclables can contaminate the entire batch and risk worker safety.'
    ),
    localVariationNote,
  };
}

function buildLocationContext(location?: { state?: string; city?: string }): string {
  const state = typeof location?.state === 'string' ? location.state.trim().slice(0, 80) : '';
  const city = typeof location?.city === 'string' ? location.city.trim().slice(0, 80) : '';
  if (!state && !city) {
    return 'User location: India (no specific city selected). Remind the user that bin colours, doorstep pickup schedules, and drop-off points vary across Indian municipalities.';
  }
  const place = [city, state].filter(Boolean).join(', ');
  return `User selected location in India: ${place}. Keep advice tailored to India’s SWM Rules, 2026 and mention checking the local municipal body / Urban Local Body (ULB) or State Pollution Control Board (SPCB) for exact ward timings, bin colours, and authorised drop-off centres. CRITICAL: Do NOT invent specific local street addresses, facility names, helpline numbers, or unverified municipal rules for ${place}.`;
}

const INDIAN_SYSTEM_INSTRUCTION = [
  'You are EcoSmart AI, a careful, trustworthy waste management assistant designed specifically for Indian households, students, schools, and communities.',
  'Classify every waste item strictly under India’s Solid Waste Management (SWM) Rules, 2026 four-stream segregation system:',
  '1. Wet Waste: Food scraps, leftover cooked food, vegetable and fruit peels, tea leaves (chai patti), coffee grounds, puja flowers, garden leaves, coconut shells/organic biodegradable matter.',
  '2. Dry Waste: Paper, newspapers (raddi), cardboard boxes, plastic water bottles, clean rinsed milk packets (LDPE pouches), glass jars/bottles, metal cans/tins, wood, rubber, old clothes/shoes, and non-biodegradable packaging.',
  '3. Sanitary Waste: Used diapers, sanitary pads/napkins, tampons, condoms, bandages, and soiled personal hygiene items.',
  '4. Special Care Waste: Household batteries, expired/unused medicines, CFL bulbs, tube lights, mercury thermometers, paint cans, pesticide containers, household chemical bottles, syringes/needles, and e-waste (phones, chargers, earphones, small electronics).',
  '5. Unclear: Use "Unclear" and set needsClarification=true whenever an image is blurry, too dark, obstructed, shows an ambiguous object, or cannot be safely classified without more user input. NEVER guess when unsure.',
  'CRITICAL SAFETY RULES:',
  '- NEVER classify Sanitary Waste or Special Care Waste as ordinary Dry Waste or recyclable waste.',
  '- For e-waste and batteries, ALWAYS recommend CPCB/SPCB-authorised collection centres, producer EPR take-back channels, or authorised municipal collection—never regular household bins.',
  '- For Sanitary Waste, give safe, simple wrapping and separate disposal guidance to protect sanitation workers, and never suggest unsafe reuse.',
  '- Recognise everyday Indian household, school, and market items (milk packets, raddi newspapers, achaar/pickle jars, kulhads, puja flowers, biscuit/chips wrappers, masala tins, expired blister strips, CFL bulbs, inverter/AA batteries, old school uniforms/chappals).',
  '- Do NOT invent statistics, fake local facilities, or claim that all Indian cities use identical bin colours or collection timings. Use clear, simple Indian English.',
].join('\n');

async function callWithRetry<T>(fn: () => Promise<T>, maxRetries = 2): Promise<T> {
  let lastError: unknown;
  for (let attempt = 0; attempt <= maxRetries; attempt++) {
    try {
      return await fn();
    } catch (err: unknown) {
      lastError = err;
      const status = (err as { status?: number })?.status;
      const isRetryable = status === 500 || status === 502 || status === 503 || status === 504;
      if (!isRetryable || attempt === maxRetries) {
        throw err;
      }
      await new Promise((resolve) => setTimeout(resolve, 600 * Math.pow(2, attempt)));
    }
  }
  throw lastError;
}

function formatApiError(err: unknown): { status: number; message: string } {
  const errorObj = err as { status?: number; message?: string };
  const message = errorObj?.message || 'Unexpected error communicating with the AI service.';
  const status = errorObj?.status || 500;

  if (message.includes('GEMINI_API_KEY')) {
    return {
      status: 500,
      message: 'API key is not configured. Please check your GEMINI_API_KEY in Settings > Secrets.',
    };
  }
  if (status === 400 || message.includes('API_KEY_INVALID')) {
    return {
      status: 400,
      message: 'The AI service rejected the request or API key. Please verify your API key in Settings > Secrets.',
    };
  }
  if (status === 403 || message.includes('PERMISSION_DENIED')) {
    return {
      status: 403,
      message: 'Permission denied by the AI service. Please check your API key in Settings > Secrets.',
    };
  }
  if (status === 429 || message.includes('RESOURCE_EXHAUSTED')) {
    return {
      status: 429,
      message: 'Rate limit reached. Please wait a moment and try again.',
    };
  }
  return {
    status: status >= 400 && status < 600 ? status : 500,
    message,
  };
}

async function startServer() {
  const app = express();
  app.use(express.json({ limit: '15mb' }));

  app.get('/api/health', (_req, res) => {
    res.json({ status: 'ok', service: 'ecosmart-ai-india' });
  });

  app.post('/api/identify-waste', async (req, res) => {
    try {
      const { imageBase64, mimeType, notes, location } = req.body as {
        imageBase64?: string;
        mimeType?: string;
        notes?: string;
        location?: { state?: string; city?: string };
      };

      if (!imageBase64 || typeof imageBase64 !== 'string') {
        res.status(400).json({ error: 'Please upload an image before running identification.' });
        return;
      }

      const cleanMime =
        typeof mimeType === 'string' && ALLOWED_MIME_TYPES.has(mimeType)
          ? mimeType
          : 'image/jpeg';

      const strippedBase64 = imageBase64.includes(',')
        ? imageBase64.split(',')[1]
        : imageBase64;

      if (!strippedBase64 || strippedBase64.length < 32) {
        res.status(400).json({ error: 'Uploaded image data is invalid or incomplete.' });
        return;
      }

      const userNotes = typeof notes === 'string' ? notes.trim().slice(0, 240) : '';
      const locationContext = buildLocationContext(location);

      const ai = createGeminiClient();

      const promptText = [
        'Analyze this photo for waste segregation in India under the Solid Waste Management (SWM) Rules, 2026.',
        'Identify the waste item(s) and material clearly.',
        'If multiple items of the same stream are neatly arranged (e.g., dry recyclables or wet kitchen peels), identify the group clearly and provide practical Indian disposal steps.',
        'If the photo is blurry, dark, ambiguous, or does not clearly show a waste item, DO NOT GUESS: set category to "Unclear", set needsClarification to true, and ask a helpful follow-up question in clarificationQuestion.',
        userNotes ? `Additional user note: "${userNotes}"` : '',
        locationContext,
      ]
        .filter(Boolean)
        .join(' ');

      const response = await callWithRetry(() =>
        ai.models.generateContent({
          model: MODEL_NAME,
          contents: {
            parts: [
              {
                inlineData: {
                  mimeType: cleanMime,
                  data: strippedBase64,
                },
              },
              { text: promptText },
            ],
          },
          config: {
            systemInstruction: INDIAN_SYSTEM_INSTRUCTION,
            responseMimeType: 'application/json',
            responseSchema: wasteAnalysisSchema,
            thinkingConfig: {
              thinkingLevel: ThinkingLevel.LOW,
            },
          },
        })
      );

      const rawText = (response.text ?? '').trim();
      if (!rawText) {
        res.status(502).json({ error: 'The AI returned an empty response. Please try another photo.' });
        return;
      }

      const parsed = JSON.parse(rawText) as Record<string, unknown>;
      const result = applySafetyGuardrails(parsed, userNotes);

      res.json({ result });
    } catch (err) {
      const formatted = formatApiError(err);
      res.status(formatted.status).json({ error: formatted.message });
    }
  });

  app.post('/api/ask-disposal', async (req, res) => {
    try {
      const { query, location } = req.body as {
        query?: string;
        location?: { state?: string; city?: string };
      };

      if (!query || typeof query !== 'string' || query.trim().length < 2) {
        res.status(400).json({ error: 'Please enter a waste item or material name (at least 2 characters).' });
        return;
      }

      const cleanQuery = query.trim().slice(0, 300);
      const locationContext = buildLocationContext(location);
      const ai = createGeminiClient();

      const response = await callWithRetry(() =>
        ai.models.generateContent({
          model: MODEL_NAME,
          contents: [
            `A user in India is asking how to classify, dispose of, or reuse/recycle this item: "${cleanQuery}".`,
            'Classify it strictly into one of the four Indian SWM Rules, 2026 streams ("Wet Waste", "Dry Waste", "Sanitary Waste", "Special Care Waste") or "Unclear" if the query is too vague to classify safely.',
            locationContext,
          ].join(' '),
          config: {
            systemInstruction: INDIAN_SYSTEM_INSTRUCTION,
            responseMimeType: 'application/json',
            responseSchema: wasteAnalysisSchema,
            thinkingConfig: {
              thinkingLevel: ThinkingLevel.LOW,
            },
          },
        })
      );

      const rawText = (response.text ?? '').trim();
      if (!rawText) {
        res.status(502).json({ error: 'The AI returned an empty response. Please try again.' });
        return;
      }

      const parsed = JSON.parse(rawText) as Record<string, unknown>;
      const result = applySafetyGuardrails(parsed, cleanQuery);

      res.json({ result });
    } catch (err) {
      const formatted = formatApiError(err);
      res.status(formatted.status).json({ error: formatted.message });
    }
  });

  if (process.env.NODE_ENV !== 'production') {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'spa',
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.resolve(__dirname, 'dist');
    app.use(express.static(distPath));
    app.get('*', (_req, res) => {
      res.sendFile(path.join(distPath, 'index.html'));
    });
  }

  app.listen(PORT, '0.0.0.0', () => {
    console.log(`EcoSmart AI server running at http://localhost:${PORT}`);
  });
}

startServer().catch((err) => {
  console.error('Failed to start server:', err);
  process.exit(1);
});
