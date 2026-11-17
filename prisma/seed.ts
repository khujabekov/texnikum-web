import path from "node:path";
import bcrypt from "bcryptjs";
import { PrismaBetterSqlite3 } from "@prisma/adapter-better-sqlite3";
import { PrismaClient } from "../src/generated/prisma/client";

function resolveDbUrl(): string {
  const raw = process.env.DATABASE_URL ?? "file:./prisma/dev.db";
  const filePath = raw.replace(/^file:/, "");
  const absolute = path.isAbsolute(filePath)
    ? filePath
    : path.resolve(process.cwd(), filePath);
  return "file:" + absolute;
}

const adapter = new PrismaBetterSqlite3({ url: resolveDbUrl() });
const prisma = new PrismaClient({ adapter });

async function main() {
  await prisma.siteConfig.upsert({
    where: { id: 1 },
    update: {},
    create: {
      id: 1,
      collegeName: "Toshkent texnologiya texnikumi",
      slogan: "Kelajak kasblari — bugundan boshlanadi!",
      logoUrl: "/images/logo.png",
      heroTitle: "Zamonaviy kasblar sari ishonch qadami",
      heroSubtitle:
        "Bizning texnikum — malakali mutaxassislar tayyorlaydigan, zamonaviy laboratoriyalar va tajriba maydonlariga ega ta'lim maskani. 12 ta ta'lim yo'nalishida kunduzgi va sirtqi bo'limlarda tahsil oling.",
      heroImageUrl: "/images/hero.jpg",
      aboutTitle: "Texnikum haqida",
      aboutText:
        "Toshkent texnologiya texnikumi 1998-yilda tashkil etilgan bo'lib, bugungi kunda 12 ta ta'lim yo'nalishi bo'yicha mutaxassislar tayyorlamqda. Texnikumda 40 dan ortiq zamonaviy laboratoriya va ustaxonalar, keng kutubxona, yotoqxona va sport zali faoliyat yuritadi. Ta'lim jarayoni korxonalar bilan tuzilgan hamkorlik memorandumlari asosida amalga oshiriladi, talabalar amaliyotni yetakchi korxonalarda o'taydi.",
      aboutImageUrl: "/images/about.jpg",
      stat1Label: "Talabalar",
      stat1Value: "2400+",
      stat2Label: "O'qituvchilar",
      stat2Value: "85+",
      stat3Label: "Ta'lim yo'nalishlari",
      stat3Value: "12",
      stat4Label: "Bitiruvchilar ishga joylashuvi",
      stat4Value: "96%",
      address: "Toshkent shahri, Yunusobod tumani, Amir Temur shoh ko'chasi, 108-uy",
      phones: "+998 71 200-50-50, +998 90 123-45-67",
      email: "info@texnikum.uz",
      workHours: "Dushanba – Shanba: 08:00 – 17:00",
      telegramUrl: "https://t.me/toshkenttexnikum",
      instagramUrl: "https://instagram.com/toshkenttexnikum",
      youtubeUrl: "https://youtube.com/@toshkenttexnikum",
      mapEmbedUrl:
        "https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d2996.5!2d69.28!3d41.33!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x0%3A0x0!2zNDHCsDAwJzAwLjAiTiA2OcKwMTYnMDAuMCJF!5e0!3m2!1suz!2s!4v1700000000000",
      footerText:
        "© 2026 Toshkent texnologiya texnikumi. Barcha huquqlar himoyalangan.",
      showStats: true,
      showDirections: true,
      showNews: true,
      showStaff: true,
      showGallery: true,
    },
  });

  const directions = [
    {
      title: "Kompyuter injiniringi",
      slug: "kompyuter-injiniringi",
      shortDesc:
        "Dasturlash, kompyuter tarmoqlari va tizimlarini boshqarish mutaxassisini tayyorlash.",
      fullDesc:
        "Talabalar dasturlash tillari (Python, JavaScript, C++), ma'lumotlar bazasi, kompyuter tarmoqlari, web va mobil ilovalar ishlab chiqish, shuningdek apparat qismlarini ta'mirlash yo'nalishlarida chuqur bilimlar oladi. Ta'lim yakunida bitiruvchilar IT-kompaniyalar, banklar va davlat idoralarida tizim administratori, dasturchi va texnik mutaxassis sifatida faoliyat yuritadi.",
      duration: "2 yil 10 oy",
      eduForm: "Kunduzgi",
      imageUrl: "/images/directions/kompyuter.jpg",
      order: 1,
    },
    {
      title: "Elektr ta'minoti va avtomatlashtirish",
      slug: "elektr-taminoti-va-avtomatlashtirish",
      shortDesc:
        "Sanoat elektr jihozlari va avtomatlashtirilgan tizimlarni boshqarish mutaxassisini tayyorlash.",
      fullDesc:
        "Yo'nalish talabalari elektr tarmoqlari, transformator stansiyalari, chastota boshqaruvchilari, PLC kontrollerlar va SCADA tizimlari bilan ishlashni o'rganadi. Amaliy mashg'ulotlar energetika korxonalarida o'tkaziladi. Bitiruvchilar elektr montyori, avtomatlashtirish texnigi va energetik sifatida ishga joylashadi.",
      duration: "2 yil 10 oy",
      eduForm: "Kunduzgi",
      imageUrl: "/images/directions/elektr.jpg",
      order: 2,
    },
    {
      title: "Buxgalteriya hisobi va nazorati",
      slug: "buxgalteriya-hisobi-va-nazorati",
      shortDesc:
        "Moliyaviy hisob-kitob va soliq hisobotini yuritish mutaxassisini tayyorlash.",
      fullDesc:
        "Talabalar buxgalteriya hisobi nazariyasi, moliyaviy va soliq hisoboti, '1S:Buxgalteriya' dasturi, audit asoslari va tahlil usullarini o'zlashtiradi. Bitiruvchilar korxonalar, banklar va moliya institutlarida buxgalter, hisobchi va moliya nazoratchisi lavozimlarida faoliyat yuritadi.",
      duration: "2 yil 10 oy",
      eduForm: "Kunduzgi / Sirtqi",
      imageUrl: "/images/directions/buxgalteriya.jpg",
      order: 3,
    },
    {
      title: "Qurilish va arxitektura",
      slug: "qurilish-va-arxitektura",
      shortDesc:
        "Binolar loyihalash va qurilish ishlarini olib borish mutaxassisini tayyorlash.",
      fullDesc:
        "Yo'nalish talabalari qurilish materiallari, konstruksiyalar, AutoCAD va BIM-texnologiyalari, qurilish ishlarini tashkil etish va nazorat qilish bo'yicha bilimlar oladi. Amaliyot yetakchi qurilish kompaniyalarida o'tkaziladi. Bitiruvchilar qurilish ustasi, proyektchisi va smeta mutaxassisi sifatida mehnat qiladi.",
      duration: "2 yil 10 oy",
      eduForm: "Kunduzgi",
      imageUrl: "/images/directions/qurilish.jpg",
      order: 4,
    },
    {
      title: "Transport logistikasi",
      slug: "transport-logistikasi",
      shortDesc:
        "Yuk tashish tizimlarini boshqarish va xalqaro logistika mutaxassisini tayyorlash.",
      fullDesc:
        "Talabalar logistika jarayonlarini boshqarish, transport turlari, yuk hujjatlari, xalqaro qoidalar (Incoterms) va ombor tizimlarini o'rganadi. Bitiruvchilar logistika markazlari, transport kompaniyalari va bojxona idoralarida ishga joylashadi.",
      duration: "2 yil 10 oy",
      eduForm: "Kunduzgi / Sirtqi",
      imageUrl: "/images/directions/logistika.jpg",
      order: 5,
    },
    {
      title: "Agrotexnologiya va mexanizatsiya",
      slug: "agrotexnologiya-va-mexanizatsiya",
      shortDesc:
        "Qishloq xo'jaligi texnikasi va agrotexnologiyalar mutaxassisini tayyorlash.",
      fullDesc:
        "Yo'nalish talabalari traktor va qishloq xo'jaligi mashinalari, sug'orish tizimlari, agroTexnologiyalar va o'simliklar himoyasi bo'yicha bilimlar oladi. Amaliyot tajriba xo'jaliklarida o'tkaziladi. Bitiruvchilar fermer xo'jaliklari, agrokompaniyalar va ta'mirlash ustaxonalarida faoliyat yuritadi.",
      duration: "2 yil 10 oy",
      eduForm: "Kunduzgi",
      imageUrl: "/images/directions/agro.jpg",
      order: 6,
    },
  ];
  await prisma.direction.createMany({ data: directions });

  const news = [
    {
      title: "2026/2027 o'quv yili uchun qabul jarayoni boshlandi",
      slug: "qabul-2026-boshlandi",
      category: "E'lon",
      imageUrl: "/images/news/qabul.jpg",
      content:
        "Texnikumga 2026/2027 o'quv yili uchun hujjatlar qabul qilish 20-iyundan boshlandi. Qabul 12 ta ta'lim yo'nalishi bo'yicha kunduzgi va sirtqi bo'limlarda o'tkaziladi. Hujjatlar raqamli tarzda qabulqilish.texnikum.uz portali orqali yoki bevosita qabul komissiyasiga topshirilishi mumkin. Qabul 10-avgustga qadar davom etadi. Batafsil ma'lumot uchun +998 71 200-50-50 raqamiga murojaat qiling.",
      views: 1240,
      published: true,
    },
    {
      title: "Talabalarimiz respublika kasb olimpiadasida g'olib bo'ldi",
      slug: "kasb-olimpiadasi-galaba",
      category: "Tanlov",
      imageUrl: "/images/news/olimpiada.jpg",
      content:
        "Toshkent shahrida o'tkazilgan 'Kasb egallash — kelajak garovi' respublika kasb olimpiadasida texnikum talabalari 3 ta oltin va 2 ta kumush medalni qo'lga kiritdi. Kompyuter injiniringi yo'nalishi talabasi Islom Karimov dasturlash yo'nalishida 1-o'rinni egalladi. G'oliblar ta'lim vazirligi tomonidan grant bilan taqdirlandi.",
      views: 986,
      published: true,
    },
    {
      title: "Yangi 'Aqlli ustaxona' laboratoriyasi ochildi",
      slug: "aqlli-ustaxona-ochilishi",
      category: "Yangilik",
      imageUrl: "/images/news/ustaxona.jpg",
      content:
        "Texnikumda sanoat robototexnikasi va PLC-kontrollerlar bilan jihozlangan 'Aqlli ustaxona' laboratoriyasi foydalanishga topshirildi. Laboratoriya 3D-printerlar, CNC-stanoklar va o'quvi simulyatsiya tizimlari bilan jihozlangan. Bu zalda elektr ta'minoti va kompyuter injiniringi yo'nalishlari talabalari amaliy mashg'ulotlar o'tkazadi.",
      views: 754,
      published: true,
    },
    {
      title: "Yetakchi IT-kompaniya bilan hamkorlik memorandumi imzolandi",
      slug: "it-hamkorlik-memorandumi",
      category: "Hamkorlik",
      imageUrl: "/images/news/hamkorlik.jpg",
      content:
        "Texnikum va 'Digital Solutions' IT-kompaniyasi o'rtasida talabalarni amaliyotga joylashtirish va bitiruvchilarni ish bilan ta'minlash bo'yicha hamkorlik memorandumi imzolandi. Kelishuvga muvofiq, kompaniya har yili 50 tagacha talabani stajirovkaga qabul qiladi va eng yaxshi bitiruvchilarga ish taklif qiladi.",
      views: 632,
      published: true,
    },
    {
      title: "'Texnikum kunlari' madaniy tadbiri o'tkazildi",
      slug: "texnikum-kunlari-tadbiri",
      category: "Tadbir",
      imageUrl: "/images/news/tadbir.jpg",
      content:
        "An'anaviy 'Texnikum kunlari' madaniy-ma'rifiy tadbiri bo'lib o'tdi. Tadbir doirasida sport musobaqalari, intellektual o'yinlar, kitob ko'rgazmasi va talabalar ijodiyot kechasi tashkil etildi. Tadbirda 500 dan ortiq talaba faol ishtirok etdi, g'oliblar diploma va esdalik sovg'alar bilan taqdirlandi.",
      views: 445,
      published: true,
    },
    {
      title: "Bitiruvchilarimizning ishga joylashuvi ko'rsatkichi oshdi",
      slug: "ishga-joylashuv-oshdi",
      category: "Mehnat bozori",
      imageUrl: "/images/news/mehnat.jpg",
      content:
        "Ta'lim vazirligining so'nggi hisobotiga ko'ra, bitiruvchilarning 96 foizi o'qishni tugatgach 6 oy ichida ishga joylashgan yoki oliy ta'limni davom ettirgan. Bu ko'rsatkich o'tgan yilga nisbatan 4 foizga yuqori. Mutaxassislarning eng ko'p talab qilinadigan yo'nalishlari — kompyuter injiniringi va logistika.",
      views: 389,
      published: true,
    },
  ];
  await prisma.news.createMany({ data: news });

  const staff = [
    {
      fullName: "Rustam Abdullayev",
      role: "Texnikum direktori",
      department: "Rahbariyat",
      bio: "Falsafa doktori (PhD), 25 yillik pedagogik va 15 yillik rahbarlik tajribasiga ega. 'Xalq ta'limi a'lochisi' ko'krak nishoni sohibi.",
      imageUrl: "/images/staff/direktor.jpg",
      order: 1,
    },
    {
      fullName: "Dilnoza Rahimova",
      role: "O'quv ishlari bo'yicha direktor o'rinbosari",
      department: "Rahbariyat",
      bio: "Matematika fani o'qituvchisi, 20 yillik tajribaga ega. O'quv jarayonini raqamlashtirish bo'yicha loyihalar muallifi.",
      imageUrl: "/images/staff/oquv.jpg",
      order: 2,
    },
    {
      fullName: "Bahodir Nazarov",
      role: "Kompyuter injiniringi kafedrasi mudiri",
      department: "Kompyuter injiniringi",
      bio: "Dasturiy injiniring magistri, 12 yillik amaliyot. Talabalari xalqaro hakatonlar g'oliblari.",
      imageUrl: "/images/staff/nazarov.jpg",
      order: 3,
    },
    {
      fullName: "Shahnoza Yusupova",
      role: "Buxgalteriya hisobi o'qituvchisi",
      department: "Iqtisodiyot",
      bio: "Sertifikatlangan buxgalter-eksper (CIPA), '1S:Buxgalteriya' bo'yicha sertifikatli trener.",
      imageUrl: "/images/staff/yusupova.jpg",
      order: 4,
    },
    {
      fullName: "Jasur To'rayev",
      role: "Elektr ta'minoti kafedrasi mudiri",
      department: "Energetika",
      bio: "Elektr muhandisi, 18 yillik sanoat tajribasi. Sanoat avtomatlashtirish bo'yicha 3 patent muallifi.",
      imageUrl: "/images/staff/torayev.jpg",
      order: 5,
    },
    {
      fullName: "Kamola Ergasheva",
      role: "Qurilish yo'nalishi o'qituvchisi",
      department: "Qurilish",
      bio: "Arxitektura magistri, AutoCAD va Revit bo'yicha Autodesk sertifikatli mutaxassis.",
      imageUrl: "/images/staff/ergasheva.jpg",
      order: 6,
    },
    {
      fullName: "Sardor Umarov",
      role: "Jismoniy tarbiya o'qituvchisi",
      department: "Umumiy fanlar",
      bio: "Sport ustasi, talabalar sport jamoasi murabbiyi. Respublika universiadasining kumush medali sohibi.",
      imageUrl: "/images/staff/umarov.jpg",
      order: 7,
    },
    {
      fullName: "Nodira Sultonova",
      role: "Kutubxona mudiri",
      department: "Ma'naviyat",
      bio: "Axborot-resurs markazi rahbari, raqamli kutubxona tizimini joriy etish tashabbuskori.",
      imageUrl: "/images/staff/sultonova.jpg",
      order: 8,
    },
  ];
  await prisma.staff.createMany({ data: staff });

  const gallery = [
    { title: "Texnikum bosh binosi", category: "Kampus", imageUrl: "/images/gallery/bino.jpg" },
    { title: "Kompyuter laboratoriyasi", category: "Laboratoriyalar", imageUrl: "/images/gallery/komp-lab.jpg" },
    { title: "Elektromontaj ustaxonasi", category: "Laboratoriyalar", imageUrl: "/images/gallery/elektr-ustaxona.jpg" },
    { title: "Qabul kunidagi ota-onalar", category: "Tadbirlar", imageUrl: "/images/gallery/qabul-kuni.jpg" },
    { title: "Talabalar sport o'yinlari", category: "Sport", imageUrl: "/images/gallery/sport.jpg" },
    { title: "Yotoqxona binosi", category: "Kampus", imageUrl: "/images/gallery/yotoqxona.jpg" },
    { title: "Kasb olimpiadasi g'oliblari", category: "Tadbirlar", imageUrl: "/images/gallery/olimpiada.jpg" },
    { title: "Kutubxona o'qish zali", category: "Kampus", imageUrl: "/images/gallery/kutubxona.jpg" },
  ];
  await prisma.gallery.createMany({ data: gallery });

  const documents = [
    {
      title: "2026/2027 o'quv yili qabul qoidalari",
      description: "Qabul jarayoni, kontrakt to'lovlari va imtiyozlar to'g'risidagi rasmiy hujjat.",
      fileUrl: "/documents/qabul-qoidalari-2026.pdf",
      category: "Qabul",
    },
    {
      title: "O'quv rejalari (barcha yo'nalishlar)",
      description: "Ta'lim yo'nalishlari bo'yicha mavzular, soatlar va kompetensiyalar tavsifi.",
      fileUrl: "/documents/oquv-rejalari.pdf",
      category: "O'quv jarayoni",
    },
    {
      title: "Talabalar stipendiyalari nizomi",
      description: "Davlat stipendiyasi, nomdor va rag'batlantiruvchi stipendiyalar berish tartibi.",
      fileUrl: "/documents/stipendiya-nizomi.pdf",
      category: "Talabalar hayoti",
    },
    {
      title: "Texnikum ichki tartib qoidalari",
      description: "Talabalar va xodimlar uchun kunlik tartib, intizom va mas'uliyat me'yorlari.",
      fileUrl: "/documents/ichki-tartib-qoidalari.pdf",
      category: "Nizomlar",
    },
    {
      title: "Amaliyot va stajirovka memorandumlari",
      description: "Korxonalar bilan tuzilgan hamkorlik shartnomalari ro'yxati va shartlari.",
      fileUrl: "/documents/amaliyot-memorandumlari.pdf",
      category: "Hamkorlik",
    },
  ];
  await prisma.document.createMany({ data: documents });

  const passwordHash = bcrypt.hashSync("admin123", 10);
  await prisma.admin.upsert({
    where: { username: "admin" },
    update: {},
    create: { username: "admin", passwordHash },
  });

  console.log("Seed muvaffaqiyatli yakunlandi!");
  console.log("Admin login: admin / admin123");
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
