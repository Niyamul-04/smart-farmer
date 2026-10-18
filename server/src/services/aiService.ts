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

  // 2. সার ও কীটনাশক স্প্রে (Fertilizer & Spray)
  if (q.includes("সার") || q.includes("কীটনাশক") || q.includes("স্প্রে") || q.includes("spray") || q.includes("fertilizer") || q.includes("বিষ")) {
    if (rainProb >= 40) {
      return `🌾 **নিয়ামুল এআই সতর্কতা বার্তা:**

বর্তমানে **${district.bnName}** জেলায় মেঘলা আকাশ ও বৃষ্টির সম্ভাবনা (**${rainProb}%**) রয়েছে।

⚠️ **সার ও স্প্রে সংক্রান্ত বিশেষ নির্দেশনা:**
* **এখনই সার ছিটাবেন না:** বৃষ্টির পূর্বে ইউরিয়া বা অন্যান্য সার প্রয়োগ করলে তা বৃষ্টির পানিতে ধুয়ে নষ্ট হবে এবং ফসলের কোনো উপকারে আসবে না।
* **কীটনাশক স্প্রে স্থগিত রাখুন:** বৃষ্টির আগে স্প্রে করা রাসায়নিক কীটনাশক বা ছত্রাকনাশক ধুয়ে চলে যাবে।
* **কখন স্প্রে করবেন:** আকাশ পুরোপুরি রোদযুক্ত হলে এবং বৃষ্টি থেমে যাওয়ার পর পাতার পানি শুকিয়ে গেলে বিকালে অনুমোদিত মাত্রায় স্প্রে করুন।`;
    } else {
      return `🌾 **নিয়ামুল এআই কৃষি পরামর্শ:**

**${district.bnName}** জেলার বর্তমান আবহাওয়া সার ও বালাইনাশক স্প্রে করার জন্য **অনুকূল** রয়েছে।

✅ **সুপারিশসমূহ:**
* **সারের ক্ষেত্রে:** জমিতে পর্যাপ্ত জো বা রস থাকা অবস্থায় ইউরিয়া সার কিস্তিতে প্রয়োগ করুন। গুটি ইউরিয়া ব্যবহার করলে সারের অপচয় ৩০% পর্যন্ত কমে।
* **কীটনাশক ও ছত্রাকনাশক:** সকালের শিশির শুকিয়ে যাওয়ার পর অথবা বিকালের মিষ্টি রোদে স্প্রে করুন। বাতাসের বিপরীত দিকে স্প্রে করবেন না।
* **রোগবালাই দমন:** ধানে ব্লাস্ট বা আলুতে নাবি ধসা দেখা দিলে কৃষি কর্মকর্তার পরামর্শে অনুমোদিত ছত্রাকনাশক (যেমন: ট্রাইসাইক্লাজোল বা ম্যানকোজেব) সঠিক মাত্রায় ব্যবহার করুন।`;
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

  // 4. রোগবালাই / পোকা দমন (Pest & Disease)
  if (q.includes("রোগ") || q.includes("পোকা") || q.includes("পচা") || q.includes("ব্লাইট") || q.includes("disease") || q.includes("pest")) {
    return `🌾 **নিয়ামুল এআই রোগবালাই ও বালাই ব্যবস্থাপনা সমাধান:**

বর্তমান তাপমাত্রা **${currentTemp}°C** এবং আপেক্ষিক আর্দ্রতা **${humidity}%**।

🔍 **গুরুত্বপূর্ণ রোগবালাই ও চিকিৎসা নির্দেশিকা:**
* **আলুর নাবি ধসা (Late Blight):** ঘন কুয়াশা ও ঠান্ডা আবহাওয়ায় এই রোগ দ্রুত ছড়ায়। পাতায় ভেজা কালো ছোপ দেখলে তৎক্ষণাৎ ম্যানকোজেব (ডায়থেন এম-৪৫) প্রতি লিটার পানিতে ২ গ্রাম হারে স্প্রে করুন।
* **ধানের নেক ব্লাস্ট (Neck Blast):** শিষের গোড়া কালো হয়ে ধান চিটা হয়ে যায়। শিষ বের হওয়ার মুখে ট্রাইসাইক্লাজোল গ্রুপের ছত্রাকনাশক (যেমন ট্রুপার বা নেটিভো) স্প্রে করুন।
* **মরিচ ও বেগুনের ডগা পচা / পোকা:** আক্রান্ত ডগা কেটে মাটিতে পুঁতে ফেলুন এবং ফেরোমোন ফাঁদ ব্যবহার করুন।
* **ভুট্টার ফল আর্মিওয়ার্ম:** আক্রান্ত গাছে ছাই বা জৈব বালাইনাশক প্রয়োগ করুন।

প্রয়োজনে আক্রান্ত অংশের ছবি তুলে স্থানীয় উপসহকারী কৃষি কর্মকর্তার সাথে যোগাযোগ করার পরামর্শ দেওয়া হচ্ছে।`;
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
2. *"বৃষ্টির সম্ভাবনা থাকলে সার ছিটানোর কী হবে?"*
3. *"আমার জমিতে এই মৌসুমে কোন ফসল চাষ করলে সবচেয়ে বেশি লাভ হবে?"*
4. *"আলু বা ধানের রোগবালাই প্রতিকার কী?"*
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
  if (q.includes("সার") || q.includes("কীটনাশক")) {
    return [
      "ইউরিয়া সার প্রয়োগের সঠিক নিয়ম কী?",
      "আলুর নাবি ধসা রোগ প্রতিরোধে সেরা স্প্রে কোনটি?",
      "আজকে জমিতে সেচ দেওয়া কি ঠিক হবে?"
    ];
  }
  return [
    "আজকের আবহাওয়ায় জমিতে সেচ দেওয়া কি ঠিক হবে?",
    "আমার জমিতে এই মৌসুমে সবচেয়ে লাভজনক ফসল কোনটি?",
    "সার ও কীটনাশক স্প্রে করার সঠিক সময় কখন?",
    "আলুর মড়ক বা ধসা রোগ প্রতিরোধে করণীয় কী?"
  ];
}
