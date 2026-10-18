import axios from "axios";
import { CROPS_DATABASE } from "../data/cropDatabase.js";
import { DISTRICTS } from "../data/bangladeshLocations.js";
import { WeatherResponse } from "./weatherService.js";

export interface ChatMessage {
  role: "user" | "assistant" | "system";
  content: string;
}

export interface AIResponse {
  reply: string;
  assistantName: string;
  source: "gemini_api" | "knowledge_engine";
  timestamp: string;
  suggestedQuestions: string[];
}

export async function askNiyamulAI(
  messages: ChatMessage[],
  weatherContext?: WeatherResponse,
  selectedDistrictId?: string
): Promise<AIResponse> {
  const lastUserMessage = messages[messages.length - 1]?.content || "";
  const assistantName = "নিয়ামুল এআই (Niyamul AI)";

  const district = DISTRICTS.find(d => d.id === (selectedDistrictId || "dhaka")) || DISTRICTS[0];

  // System Context Prompt
  const systemPrompt = `
তুমি "নিয়ামুল এআই (Niyamul AI)" — বাংলাদেশ স্মার্ট আবহাওয়া ও কৃষি প্ল্যাটফর্মের প্রধান এআই সহকারী ও কৃষিবিদ পরামর্শক।
তোমার নাম 'নিয়ামুল'। সর্বদা নিজেকে 'নিয়ামুল এআই' হিসেবে পরিচয় দেবে।
তোমার বৈশিষ্ট্য:
1. অত্যন্ত শ্রদ্ধাশীল, আন্তরিক ও সহজ-সরল বাংলা ভাষায় কৃষক ভাই ও সাধারণ মানুষের প্রশ্নের উত্তর দাও।
2. বর্তমানে ব্যবহারকারীর নির্বাচিত জেলা: ${district.bnName} (${district.name}), কৃষি অঞ্চল: ${district.aeZoneBn}।
3. বর্তমান আবহাওয়া: তাপমাত্রা ${weatherContext?.current.temp ?? 28}°C (অনুভূত: ${weatherContext?.current.apparentTemp ?? 30}°C), আকাশ: ${weatherContext?.current.condition.descriptionBn ?? "পরিস্কার"}, আর্দ্রতা: ${weatherContext?.current.humidity ?? 70}%, বৃষ্টির সম্ভাবনা: ${weatherContext?.current.rainProbNow ?? 10}%।
4. কৃষি গবেষণা প্রতিষ্ঠান (BRRI, BARI, BJRI, DAE, BAMIS) এর সঠিক বৈজ্ঞানিক তথ্য ও বিধি অনুসরণ করো।
5. উত্তরগুলো তথ্যবহুল, বুলেট পয়েন্ট বিশিষ্ট এবং চোখে পড়ার মতো সুন্দর করে সাজিয়ে দাও।
6. কোনো মনগড়া ভুল তথ্য দেবে না। অনিশ্চিত বিষয়ে সতর্ক করবে।
7. অত্যন্ত গুরুত্বপূর্ণ নির্দেশনা: তুমি ফসলে কোনো নির্দিষ্ট রাসায়নিক ঔষধ, কীটনাশক বা বাণিজ্যিক ব্র্যান্ডের প্রেসক্রিপশন দেবে না। রোগবালাই প্রতিরোধে প্রাকৃতিক কৃষি ব্যবস্থাপনা (সুষম সার, পানি নিষ্কাশন, আক্রান্ত পাতা অপসারণ) পরামর্শ দেবে এবং নির্দিষ্ট রাসায়নিক ঔষধের জন্য স্থানীয় উপজেলা কৃষি কর্মকর্তা বা উপসহকারী কৃষি কর্মকর্তার (SAAO) সাথে সরাসরি পরামর্শ নিতে বলবে।
`.trim();

  // Check if GEMINI_API_KEY exists in environment
  const geminiApiKey = process.env.GEMINI_API_KEY;
  if (geminiApiKey) {
    try {
      const contents = [
        { role: "user", parts: [{ text: systemPrompt }] },
        ...messages.map(m => ({
          role: m.role === "assistant" ? "model" : "user",
          parts: [{ text: m.content }]
        }))
      ];

      const res = await axios.post(
        `https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${geminiApiKey}`,
        { contents },
        { timeout: 12000 }
      );

      const candidate = res.data.candidates?.[0]?.content?.parts?.[0]?.text;
      if (candidate) {
        return {
          reply: candidate,
          assistantName,
          source: "gemini_api",
          timestamp: new Date().toLocaleTimeString("bn-BD", { hour: "2-digit", minute: "2-digit" }),
          suggestedQuestions: getSmartSuggestions(lastUserMessage)
        };
      }
    } catch (err) {
      console.warn("Gemini API call failed, falling back to Niyamul Agro Engine:", err);
    }
  }

  // Domain Knowledge Engine
  const intelligentReply = generateIntelligentAgroReply(lastUserMessage, district, weatherContext);

  return {
    reply: intelligentReply,
    assistantName,
    source: "knowledge_engine",
    timestamp: new Date().toLocaleTimeString("bn-BD", { hour: "2-digit", minute: "2-digit" }),
    suggestedQuestions: getSmartSuggestions(lastUserMessage)
  };
}

function generateIntelligentAgroReply(
  query: string,
  district: typeof DISTRICTS[0],
  weather?: WeatherResponse
): string {
  const q = query.toLowerCase();

  const currentTemp = weather?.current.temp ?? 28;
  const rainProb = weather?.current.rainProbNow ?? 15;
  const humidity = weather?.current.humidity ?? 68;

  // 1. সেচ (Irrigation) প্রশ্ন
  if (q.includes("সেচ") || q.includes("পানি") || q.includes("irrigation") || q.includes("pani")) {
    if (rainProb >= 50) {
      return `🌾 **আসসালামু আলাইকুম! আমি নিয়ামুল এআই।**

আপনার **${district.bnName}** এলাকায় আগামী ২৪-৪৮ ঘণ্টায় বৃষ্টির সম্ভাবনা **${rainProb}%** রয়েছে।

💧 **সেচ বিষয়ে নিয়ামুল এআই-এর তাৎক্ষণিক পরামর্শ:**
* **সেচ স্থগিত রাখুন:** আগামী ১-২ দিন নতুন করে জমিতে সেচ দেওয়া থেকে বিরত থাকুন, কারণ বৃষ্টির পানিতে জমিতে জলাবদ্ধতা তৈরি হতে পারে।
* **নিকাশ নালা প্রস্তুত রাখুন:** সবজি, আলু ও ভুট্টার ক্ষেতে যাতে পানি জমে না থাকে সে জন্য দ্রুত নালা বা ড্রেন কেটে পানি বের করার ব্যবস্থা রাখুন।
* **বোরো ধান:** জমিতে যদি ইতিমধ্যেই ২-৩ ইঞ্চি পানি থাকে, তবে পাম্প বন্ধ রাখুন এবং বৃষ্টির পানিকে কাজে লাগান।

আরও কোনো নির্দিষ্ট ফসলের সেচ সম্পর্কে জানতে চাইলে আমাকে জানান!`;
    } else {
      return `🌾 **আসসালামু আলাইকুম! আমি নিয়ামুল এআই।**

আপনার **${district.bnName}** এলাকায় বর্তমান তাপমাত্রা **${currentTemp}°C** এবং আকাশ মূলত রোদযুক্ত ও শুষ্ক।

💧 **সেচ বিষয়ে নিয়ামুল এআই-এর বৈজ্ঞানিক পরামর্শ:**
* **অনুকূল সময়:** বাতাস ও মাটির আর্দ্রতা কমে যাচ্ছে, তাই ধান ও সবজির জমিতে সেচ দেওয়ার উপযুক্ত সময় এখন।
* **দিনের সঠিক সময়:** দুপুরের কড়া রোদে সেচ দেবেন না। সকালের দিকে বা বিকাল ৩টার পর জমিতে নিয়ন্ত্রিত সেচ দিন।
* **ভুট্টা ও গম:** শীষ আসার সময় ও মোচা গঠনের সময় জমিতে রসের ঘাটতি হলে ফলন কমে যায়, তাই হালকা সেচ নিশ্চিত করুন।
* **আলু ক্ষেত:** আলু তোলার ১৫-২০ দিন আগে সেচ বন্ধ করতে হবে যাতে আলুর খোসা শক্ত হয়।`;
    }
  }

  // 2. সার ও পুষ্টি ব্যবস্থাপনা (Fertilizer & Soil Nutrition)
  if (q.includes("সার") || q.includes("fertilizer") || q.includes("ইউরিয়া") || q.includes("পটাশ")) {
    if (rainProb >= 40) {
      return `🌾 **নিয়ামুল এআই সতর্কতা বার্তা:**

বর্তমানে **${district.bnName}** জেলায় মেঘলা আকাশ ও বৃষ্টির সম্ভাবনা (**${rainProb}%**) রয়েছে।

⚠️ **সার প্রয়োগ সংক্রান্ত নির্দেশনা:**
* **এখনই সার ছিটাবেন না:** বৃষ্টির পূর্বে ইউরিয়া বা অন্যান্য দানাদার সার প্রয়োগ করলে তা বৃষ্টির পানিতে ধুয়ে নষ্ট হবে এবং ফসলের কোনো উপকারে আসবে না।
* **কখন প্রয়োগ করবেন:** বৃষ্টি থেমে যাওয়ার পর এবং জমির অতিরিক্ত পানি নেমে গেলে জো অবস্থা দেখে সার কিস্তিতে প্রয়োগ করুন।`;
    } else {
      return `🌾 **নিয়ামুল এআই কৃষি পরামর্শ:**

**${district.bnName}** জেলার বর্তমান আবহাওয়া সার প্রয়োগের জন্য **অনুকূল** রয়েছে।

✅ **সুপারিশসমূহ:**
* **সারের ক্ষেত্রে:** জমিতে পর্যাপ্ত জো বা রস থাকা অবস্থায় ইউরিয়া সার কিস্তিতে প্রয়োগ করুন। গুটি ইউরিয়া ব্যবহার করলে সারের অপচয় ৩০% পর্যন্ত কমে।
* **জৈব সার:** রাসায়নিক সারের পাশাপাশি জমিতে জৈব সার ও কম্পোস্ট ব্যবহার করুন, যা মাটির আর্দ্রতা ধরে রাখতে সাহায্য করে।`;
    }
  }

  // 3. লাভজনক ফসল / কোন ফসল চাষ করব (Most Profitable Crop)
  if (q.includes("লাভ") || q.includes("ফসল") || q.includes("profit") || q.includes("কোন ফসল") || q.includes("কি চাষ")) {
    return `🌾 **আসসালামু আলাইকুম! আমি নিয়ামুল এআই।**

আপনার **${district.bnName}** জেলা (${district.aeZoneBn}) এর ভৌগোলিক মাটি ও চলতি মৌসুমের সাপেক্ষে সর্বাধিক লাভজনক ফসলসমূহ:

💰 **শীর্ষ লাভজনক ফসলের তালিকা ও প্রাক্কলিত মুনাফা (প্রতি বিঘা):**
1. **উচ্চফলনশীল আলু (ডায়মন্ড / অ্যাস্টেরিক্স):**
   * গড় ফলন: ৮০-৮৫ মণ / বিঘা
   * আনুমানিক নিট লাভ: **৳১৫,০০০ - ৳২৫,০০০ / বিঘা** (সঠিক সময়ে বাজারজাত করলে)।
2. **বারি হাইব্রিড ভুট্টা-৯ / এনকে-৪০:**
   * গড় ফলন: ৩৫-৪০ মণ / বিঘা
   * উৎপাদন খরচ কম, পোল্ট্রি ফিডের উচ্চ চাহিদা থাকায় নগদ বিক্রির সুবিধা।
   * আনুমানিক নিট লাভ: **৳১৬,০০০ - ৳২২,০০০ / বিঘা**।
3. **উচ্চফলনশীল বোরো ধান (ব্রি ধান৮৯ বা ব্রি ধান৫০ বাংলামতি):**
   * ব্রি ধান৮৯ জাতের চাল বেশি হয় এবং সহজে হেলে পড়ে না।
   * বাংলামতি চাল বাজারে চড়া দামে বিক্রি হয়।
4. **বারি সরিষা-১৪ / সরিষা-১৮:**
   * মাত্র ৭৫-৮০ দিনে ফসল ওঠে। আমন ও বোরোর মধ্যবর্তী সময়ে বাড়তি **৳১০,০০০ - ৳১৫,০০০** লাভ নিশ্চিত করে।

👉 আপনি আমাদের প্ল্যাটফর্মের **'লাভ-ক্ষতি ও ব্যয় হিসাব'** ট্যাবে গিয়ে আপনার জমির সঠিক মাপ বসিয়ে নির্ভুল হিসাব দেখে নিতে পারেন!`;
  }

  // 4. রোগবালাই প্রতিরোধ ও সাধারণ ক্ষেত পরিচর্যা (Pest Management & Cultural Care)
  if (q.includes("রোগ") || q.includes("পোকা") || q.includes("পচা") || q.includes("ব্লাইট") || q.includes("disease") || q.includes("pest") || q.includes("ঔষধ") || q.includes("কীটনাশক") || q.includes("স্প্রে")) {
    return `🌾 **নিয়ামুল এআই কৃষি ও ক্ষেত পরিচর্যা নির্দেশিকা:**

বর্তমান তাপমাত্রা **${currentTemp}°C** এবং আপেক্ষিক আর্দ্রতা **${humidity}%**।

🔍 **সমন্বিত বালাই ব্যবস্থাপনা ও ক্ষেত পরিচর্যার সাধারণ নিয়ম:**
* **পরিচ্ছন্ন চাষাবাদ:** ক্ষেতের আগাছা সর্বদা পরিষ্কার রাখুন এবং রোগাক্রান্ত গাছ বা পাতা দেখলে তা ছিঁড়ে দূরে মাটির নিচে পুঁতে ফেলুন।
* **পানি নিষ্কাশন:** শিকড় পচা রোধে কোনো অবস্থাতেই জমিতে অতিরিক্ত পানি জমতে দেবেন না।
* **সুষম সার:** অতিরিক্ত ইউরিয়া দিলে ফসলে রোগ ও পোকার আক্রমণ বাড়ে, তাই ইউরিয়ার পাশাপাশি অনুমোদিত হারে পটাশ ব্যবহার করুন।
* **আলো-বাতাস চলাচল:** চারা ঘন করে না লাগিয়ে সঠিক দূরত্ব বজায় রাখুন যাতে ভেতরে পর্যাপ্ত রোদ ও বাতাস প্রবেশ করতে পারে।

⚠️ **বিশেষ সতর্কতা:** ফসলের কোনো নির্দিষ্ট রোগ বা পোকার জন্য আন্দাজে রাসায়নিক ঔষধ বা কীটনাশক ব্যবহার করবেন না। রোগ বা পোকার সঠিক মাত্রা ও উপযুক্ত সমাধানের জন্য নিকটস্থ উপজেলা কৃষি অফিস বা স্থানীয় উপসহকারী কৃষি কর্মকর্তার (SAAO) সাথে সরাসরি পরামর্শ করুন।`;
  }

  // 5. আবহাওয়া / বৃষ্টি হবে কি না (Weather Query)
  if (q.includes("আবহাওয়া") || q.includes("বৃষ্টি") || q.includes("weather") || q.includes("rain") || q.includes("gorom") || q.includes("shit")) {
    return `🌾 **আসসালামু আলাইকুম! আমি নিয়ামুল এআই।**

📍 **${district.bnName}** জেলার বর্তমান আবহাওয়া পরিস্থিতি:
* 🌡️ **তাপমাত্রা:** ${currentTemp}°C (অনুভূত: ${weather?.current.apparentTemp ?? currentTemp + 2}°C)
* ☀️ **আকাশের অবস্থা:** ${weather?.current.condition.descriptionBn ?? "পরিস্কার আকাশ"}
* 💧 **বৃষ্টির সম্ভাবনা:** ${rainProb}%
* 💨 **বাতাসের গতি:** ${weather?.current.windSpeedKmh ?? 12} কিমি/ঘণ্টা
* 🌅 **সূর্যোদয় / সূর্যাস্ত:** ${weather?.current.sunrise ?? "০৬:০৫"} / ${weather?.current.sunset ?? "১৭:৪৫"}

${rainProb >= 40 
  ? "⚠️ **সতর্কতা:** আগামী ২৪-৪৮ ঘণ্টায় বৃষ্টির ঝুঁকি রয়েছে। বাইরে রাখা ধান বা শস্য নিরাপদ আশ্রয়ে রাখুন।" 
  : "✅ **অনুকূল বার্তা:** আগামী কয়েকদিন আবহাওয়া কৃষিকাজ ও চলাচলের জন্য স্বাভাবিক ও অনুকূল থাকবে।"}

অন্য কোনো জেলার আবহাওয়া জানতে চাইলে জেলার নাম বলুন!`;
  }

  // 6. সাধারণ পরিচয় / শুভেচ্ছা (Greetings)
  return `🌾 **আসসালামু আলাইকুম! আমি নিয়ামুল এআই (Niyamul AI)।**
আমি আপনার সার্বক্ষণিক কৃষি ও আবহাওয়া বন্ধু ও সহকারী।

বর্তমানে আমি আপনার নির্বাচিত জেলা **${district.bnName}**-এর মাটির ধরন (${district.aeZoneBn}) এবং আজকের লাইভ আবহাওয়া (${currentTemp}°C, ${weather?.current.condition.descriptionBn || "স্বাভাবিক"}) মাথায় রেখে সার্বক্ষণিক সহায়তা দিতে প্রস্তুত।

**আপনি আমাকে যেকোনো প্রশ্ন করতে পারেন, যেমন:**
1. *"আজকে কি জমিতে সেচ বা পানি দেওয়া যাবে?"*
2. *"বৃষ্টির সম্ভাবনা থাকলে সার প্রয়োগের কী হবে?"*
3. *"আমার জমিতে এই মৌসুমে কোন ফসল চাষ করলে সবচেয়ে বেশি লাভ হবে?"*
4. *"আলু বা ধানের রোগবালাই প্রতিরোধের সাধারণ নিয়ম কী?"*
5. *"আগামী ৭ দিনের আবহাওয়া কেমন থাকবে?"*

আপনার প্রশ্নটি লিখুন, আমি দ্রুত সঠিক পরামর্শ দিচ্ছি!`;
}

function getSmartSuggestions(lastQuery: string): string[] {
  const q = lastQuery.toLowerCase();
  if (q.includes("সেচ") || q.includes("পানি")) {
    return [
      "বৃষ্টির দিনে ধানের ক্ষেতের নালা ব্যবস্থাপনা কীভাবে করব?",
      "ভুট্টা ক্ষেতে কত দিন পর পর সেচ দিতে হয়?",
      "এই মৌসুমে সবচেয়ে কম খরচে কোন ফসল চাষ করা যায়?"
    ];
  }
  if (q.includes("সার")) {
    return [
      "ইউরিয়া সার প্রয়োগের সঠিক নিয়ম কী?",
      "জৈব সার তৈরির সহজ উপায় কী?",
      "আজকে জমিতে সেচ দেওয়া কি ঠিক হবে?"
    ];
  }
  return [
    "আজকের আবহাওয়ায় জমিতে সেচ দেওয়া কি ঠিক হবে?",
    "আমার জমিতে এই মৌসুমে সবচেয়ে লাভজনক ফসল কোনটি?",
    "জমিতে সেচ ও জৈব সার প্রয়োগের সঠিক নিয়ম কী?",
    "আবহাওয়ার পরিবর্তনজনিত ফসল সুরক্ষা ও যত্ন নেওয়ার উপায়"
  ];
}
