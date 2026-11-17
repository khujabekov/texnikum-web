"use client";

import {
  AlertCircle,
  CheckCircle2,
  Compass,
  Eye,
  FileText,
  Globe,
  Image as ImageIcon,
  Loader2,
  MapPin,
  Phone,
  Save,
  Sparkles,
} from "lucide-react";
import { useActionState, type ReactNode } from "react";
import {
  updateSiteSettings,
  type SettingsState,
} from "@/app/admin/sozlamalar/actions";
import type { SiteConfig } from "@/generated/prisma/client";
import FileUpload from "./FileUpload";

const initialState: SettingsState = { status: "idle", message: "" };

const inputClass =
  "w-full rounded-2xl border border-slate-200 bg-white px-4 py-3 text-sm font-semibold text-navy-900 placeholder:font-medium placeholder:text-slate-400 outline-none transition focus:border-emerald-400 focus:ring-2 focus:ring-emerald-400/20";

type FieldProps = {
  label: string;
  name: string;
  defaultValue?: string;
  placeholder?: string;
  required?: boolean;
  type?: string;
  hint?: string;
};

function Field({
  label,
  name,
  defaultValue = "",
  placeholder,
  required,
  type = "text",
  hint,
}: FieldProps) {
  return (
    <div>
      <label
        htmlFor={`${name}-${type}`}
        className="block text-xs font-bold uppercase tracking-wider text-slate-500"
      >
        {label}
        {required && <span className="ml-0.5 text-red-500">*</span>}
      </label>
      <input
        id={`${name}-${type}`}
        name={name}
        type={type}
        required={required}
        defaultValue={defaultValue}
        placeholder={placeholder}
        className={`mt-2 ${inputClass}`}
      />
      {hint && <p className="mt-1.5 text-xs font-medium text-slate-400">{hint}</p>}
    </div>
  );
}

function TextareaField({
  label,
  name,
  defaultValue = "",
  placeholder,
  required,
  rows = 4,
  hint,
}: FieldProps & { rows?: number }) {
  return (
    <div>
      <label
        htmlFor={name}
        className="block text-xs font-bold uppercase tracking-wider text-slate-500"
      >
        {label}
        {required && <span className="ml-0.5 text-red-500">*</span>}
      </label>
      <textarea
        id={name}
        name={name}
        rows={rows}
        required={required}
        defaultValue={defaultValue}
        placeholder={placeholder}
        className={`mt-2 resize-y ${inputClass}`}
      />
      {hint && <p className="mt-1.5 text-xs font-medium text-slate-400">{hint}</p>}
    </div>
  );
}

function ToggleRow({
  label,
  description,
  name,
  defaultChecked,
}: {
  label: string;
  description: string;
  name: string;
  defaultChecked: boolean;
}) {
  return (
    <label
      htmlFor={name}
      className="flex cursor-pointer items-center justify-between gap-4 rounded-2xl border border-slate-200 bg-white px-4 py-3.5 transition hover:border-emerald-300/60"
    >
      <span className="min-w-0">
        <span className="block text-sm font-bold text-navy-900">{label}</span>
        <span className="mt-0.5 block text-xs font-medium text-slate-500">
          {description}
        </span>
      </span>
      <span className="relative inline-flex shrink-0">
        <input
          id={name}
          name={name}
          type="checkbox"
          defaultChecked={defaultChecked}
          className="peer sr-only"
        />
        <span className="h-6 w-11 rounded-full bg-slate-300 transition-colors duration-200 peer-checked:bg-emerald-500 peer-focus-visible:ring-2 peer-focus-visible:ring-emerald-400/40" />
        <span className="absolute left-0.5 top-0.5 h-5 w-5 rounded-full bg-white shadow transition-transform duration-200 peer-checked:translate-x-5" />
      </span>
    </label>
  );
}

function FormSection({
  icon: Icon,
  title,
  description,
  children,
}: {
  icon: typeof Globe;
  title: string;
  description: string;
  children: ReactNode;
}) {
  return (
    <section className="overflow-hidden rounded-3xl border border-slate-200/80 bg-white shadow-sm">
      <div className="flex items-start gap-4 border-b border-slate-100 px-5 py-5 sm:px-6">
        <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-2xl bg-gradient-to-br from-emerald-400 to-sky-500 text-white shadow-lg shadow-emerald-500/25">
          <Icon className="h-5 w-5" />
        </span>
        <div>
          <h2 className="text-base font-extrabold tracking-tight text-navy-900">
            {title}
          </h2>
          <p className="mt-0.5 text-xs font-medium leading-relaxed text-slate-500">
            {description}
          </p>
        </div>
      </div>
      <div className="grid gap-5 px-5 py-6 sm:grid-cols-2 sm:px-6">
        {children}
      </div>
    </section>
  );
}

export default function SiteSettingsForm({ config }: { config: SiteConfig }) {
  const [state, formAction, pending] = useActionState(
    updateSiteSettings,
    initialState
  );

  return (
    <form action={formAction} className="space-y-6">
      {state.status !== "idle" && state.message && (
        <div
          role="status"
          className={`flex items-start gap-2.5 rounded-2xl border px-4 py-3.5 text-sm font-bold ${
            state.status === "success"
              ? "border-emerald-300/60 bg-emerald-50 text-emerald-700"
              : "border-red-300/60 bg-red-50 text-red-700"
          }`}
        >
          {state.status === "success" ? (
            <CheckCircle2 className="mt-0.5 h-4 w-4 shrink-0" />
          ) : (
            <AlertCircle className="mt-0.5 h-4 w-4 shrink-0" />
          )}
          <span>{state.message}</span>
        </div>
      )}

      <FormSection
        icon={Globe}
        title="Umumiy ma'lumotlar"
        description="Sayt nomi, shiori va logotipi — barcha sahifalarda ko'rinadi"
      >
        <div className="sm:col-span-2">
          <Field
            label="Muassasa nomi"
            name="collegeName"
            defaultValue={config.collegeName}
            placeholder="Texnikum nomi"
            required
          />
        </div>
        <div className="sm:col-span-2">
          <Field
            label="Shior (slogan)"
            name="slogan"
            defaultValue={config.slogan}
            placeholder="Masalan: Zamonaviy kasb ta'limi maskani"
          />
        </div>
        <div className="sm:col-span-2">
          <FileUpload
            name="logoUrl"
            label="Sayt logotipi"
            initialUrl={config.logoUrl}
            hint="Kvadrat formatda tavsiya etiladi (masalan, 512x512)"
          />
        </div>
      </FormSection>

      <FormSection
        icon={ImageIcon}
        title="Asosiy bo'lim (Hero)"
        description="Sayt ochilganda ko'rinadigan katta sarlavha, matn va fon rasmi"
      >
        <div className="sm:col-span-2">
          <Field
            label="Asosiy sarlavha"
            name="heroTitle"
            defaultValue={config.heroTitle}
            placeholder="Bosh sahifa sarlavhasi"
            required
          />
        </div>
        <div className="sm:col-span-2">
          <TextareaField
            label="Asosiy matn"
            name="heroSubtitle"
            defaultValue={config.heroSubtitle}
            placeholder="Bosh sahifa tavsifi"
            required
            rows={3}
          />
        </div>
        <div className="sm:col-span-2">
          <FileUpload
            name="heroImageUrl"
            label="Asosiy fon rasmi"
            initialUrl={config.heroImageUrl}
            hint="Keng formatda (masalan, 1920x1080)"
          />
        </div>
      </FormSection>

      <FormSection
        icon={FileText}
        title="'Biz haqimizda' bo'limi"
        description="Muassasa haqidagi ma'lumotlar va rasm"
      >
        <div className="sm:col-span-2">
          <Field
            label="Bo'lim sarlavhasi"
            name="aboutTitle"
            defaultValue={config.aboutTitle}
            placeholder="Biz haqimizda"
            required
          />
        </div>
        <div className="sm:col-span-2">
          <TextareaField
            label="Bo'lim matni"
            name="aboutText"
            defaultValue={config.aboutText}
            placeholder="Muassasa faoliyati haqida ma'lumot"
            required
            rows={6}
          />
        </div>
        <div className="sm:col-span-2">
          <FileUpload
            name="aboutImageUrl"
            label="Bo'lim rasmi"
            initialUrl={config.aboutImageUrl}
          />
        </div>
      </FormSection>

      <FormSection
        icon={Sparkles}
        title="Statistika ko'rsatkichlari"
        description="Bosh sahifadagi 4 ta statistika bloki (qiymat va nom)"
      >
        <Field
          label="1-ko'rsatkich qiymati"
          name="stat1Value"
          defaultValue={config.stat1Value}
          placeholder="1200+"
        />
        <Field
          label="1-ko'rsatkich nomi"
          name="stat1Label"
          defaultValue={config.stat1Label}
          placeholder="O'quvchilar"
        />
        <Field
          label="2-ko'rsatkich qiymati"
          name="stat2Value"
          defaultValue={config.stat2Value}
          placeholder="45"
        />
        <Field
          label="2-ko'rsatkich nomi"
          name="stat2Label"
          defaultValue={config.stat2Label}
          placeholder="O'qituvchilar"
        />
        <Field
          label="3-ko'rsatkich qiymati"
          name="stat3Value"
          defaultValue={config.stat3Value}
          placeholder="12"
        />
        <Field
          label="3-ko'rsatkich nomi"
          name="stat3Label"
          defaultValue={config.stat3Label}
          placeholder="Yo'nalishlar"
        />
        <Field
          label="4-ko'rsatkich qiymati"
          name="stat4Value"
          defaultValue={config.stat4Value}
          placeholder="25"
        />
        <Field
          label="4-ko'rsatkich nomi"
          name="stat4Label"
          defaultValue={config.stat4Label}
          placeholder="Yillik tajriba"
        />
      </FormSection>

      <FormSection
        icon={Phone}
        title="Aloqa ma'lumotlari"
        description="Manzil, telefon raqamlari, elektron pochta va ish vaqti"
      >
        <div className="sm:col-span-2">
          <Field
            label="Manzil"
            name="address"
            defaultValue={config.address}
            placeholder="Shahar, ko'cha, uy"
          />
        </div>
        <div className="sm:col-span-2">
          <Field
            label="Telefon raqamlari"
            name="phones"
            defaultValue={config.phones}
            placeholder="+998 90 123 45 67, +998 71 123 45 67"
            hint="Bir nechta raqamni vergul bilan ajratib yozing"
          />
        </div>
        <Field
          label="Elektron pochta"
          name="email"
          defaultValue={config.email}
          placeholder="info@texnikum.uz"
          type="email"
        />
        <Field
          label="Ish vaqti"
          name="workHours"
          defaultValue={config.workHours}
          placeholder="Dushanba - Shanba, 08:00 - 17:00"
        />
      </FormSection>

      <FormSection
        icon={Eye}
        title="Ijtimoiy tarmoqlar"
        description="Telegram, Instagram va YouTube havolalari"
      >
        <div className="sm:col-span-2">
          <Field
            label="Telegram havolasi"
            name="telegramUrl"
            defaultValue={config.telegramUrl}
            placeholder="https://t.me/texnikum"
            type="url"
          />
        </div>
        <div className="sm:col-span-2">
          <Field
            label="Instagram havolasi"
            name="instagramUrl"
            defaultValue={config.instagramUrl}
            placeholder="https://instagram.com/texnikum"
            type="url"
          />
        </div>
        <div className="sm:col-span-2">
          <Field
            label="YouTube havolasi"
            name="youtubeUrl"
            defaultValue={config.youtubeUrl}
            placeholder="https://youtube.com/@texnikum"
            type="url"
          />
        </div>
      </FormSection>

      <FormSection
        icon={MapPin}
        title="Xarita va footer"
        description="Joylashuv xaritasi havolasi va sayt pastidagi matn"
      >
        <div className="sm:col-span-2">
          <Field
            label="Xarita embed havolasi"
            name="mapEmbedUrl"
            defaultValue={config.mapEmbedUrl}
            placeholder="https://www.google.com/maps/embed?pb=..."
            hint="Google Maps'dan 'Share' > 'Embed a map' orqali olingan havola"
          />
        </div>
        <div className="sm:col-span-2">
          <TextareaField
            label="Footer matni"
            name="footerText"
            defaultValue={config.footerText}
            placeholder="Sayt pastida ko'rinadigan qisqa matn"
            rows={3}
          />
        </div>
      </FormSection>

      <FormSection
        icon={Compass}
        title="Bo'limlarning ko'rinishi"
        description="Bosh sahifada qaysi bo'limlar ko'rinishini boshqaring"
      >
        <div className="sm:col-span-2">
          <ToggleRow
            name="showStats"
            label="Statistika bo'limi"
            description="Bosh sahifada statistika ko'rsatkichlari ko'rinadi"
            defaultChecked={config.showStats}
          />
        </div>
        <div className="sm:col-span-2">
          <ToggleRow
            name="showDirections"
            label="Yo'nalishlar bo'limi"
            description="Bosh sahifada o'quv yo'nalishlari ko'rinadi"
            defaultChecked={config.showDirections}
          />
        </div>
        <div className="sm:col-span-2">
          <ToggleRow
            name="showNews"
            label="Yangiliklar bo'limi"
            description="Bosh sahifada so'nggi yangiliklar ko'rinadi"
            defaultChecked={config.showNews}
          />
        </div>
        <div className="sm:col-span-2">
          <ToggleRow
            name="showStaff"
            label="Rahbariyat bo'limi"
            description="Bosh sahifada rahbariyat ko'rinadi"
            defaultChecked={config.showStaff}
          />
        </div>
        <div className="sm:col-span-2">
          <ToggleRow
            name="showGallery"
            label="Galereya bo'limi"
            description="Bosh sahifada galereya va aloqa ko'rinadi"
            defaultChecked={config.showGallery}
          />
        </div>
      </FormSection>

      <div className="sticky bottom-4 z-10 rounded-3xl border border-slate-200/80 bg-white/90 p-4 shadow-xl shadow-navy-900/10 backdrop-blur-md sm:px-6">
        <div className="flex flex-col items-stretch gap-3 sm:flex-row sm:items-center sm:justify-between">
          <p className="text-xs font-semibold leading-relaxed text-slate-500">
            O&apos;zgarishlar saqlangandan so&apos;ng sayt darhol yangilanadi.
          </p>
          <button
            type="submit"
            disabled={pending}
            className="flex items-center justify-center gap-2 rounded-2xl bg-gradient-to-r from-emerald-500 to-sky-500 px-8 py-3.5 text-sm font-bold text-white shadow-lg shadow-emerald-500/30 transition duration-300 hover:shadow-emerald-400/40 hover:brightness-110 disabled:cursor-not-allowed disabled:opacity-60"
          >
            {pending ? (
              <>
                <Loader2 className="h-4 w-4 animate-spin" />
                Saqlanmoqda...
              </>
            ) : (
              <>
                <Save className="h-4 w-4" />
                Saqlash
              </>
            )}
          </button>
        </div>
      </div>
    </form>
  );
}
