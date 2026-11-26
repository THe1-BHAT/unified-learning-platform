const crypto = require("node:crypto");
const fs = require("node:fs");
const path = require("node:path");
const vm = require("node:vm");

const root = path.resolve(__dirname, "../..");
const files = [
  "curriculum.js",
  "extension.js",
  "reference-library.js",
  "coverage-data.js",
  "expansion-views.js",
  "pdf-guides.js",
  "learning-flow.js",
  "industry-videos.js",
  "data-mlops-content.js",
];
const context = { window: {}, document: { addEventListener() {} } };
for (const file of files) {
  const source = fs.readFileSync(path.join(root, "app", "dist", file), "utf8");
  vm.runInNewContext(source, context, { filename: file });
}
vm.runInNewContext("globalThis.__curriculum = { modules, dataModules }", context);

const namespace = Buffer.from("a4f637b7-c036-5a73-9b6e-e0be3094c26f".replaceAll("-", ""), "hex");
function stableUuid(name) {
  const digest = crypto.createHash("sha1").update(Buffer.concat([namespace, Buffer.from(name)])).digest();
  digest[6] = (digest[6] & 0x0f) | 0x50;
  digest[8] = (digest[8] & 0x3f) | 0x80;
  const hex = digest.subarray(0, 16).toString("hex");
  return `${hex.slice(0, 8)}-${hex.slice(8, 12)}-${hex.slice(12, 16)}-${hex.slice(16, 20)}-${hex.slice(20)}`;
}
const sql = (value) => `'${String(value).replaceAll("'", "''")}'`;
const uuid = (value) => `'${value}'::uuid`;
const slugify = (value) => value
  .normalize("NFKD")
  .replace(/[\u0300-\u036f]/g, "")
  .toLowerCase()
  .replace(/[^a-z0-9]+/g, "-")
  .replace(/^-|-$/g, "");

const modules = [
  ...context.__curriculum.modules.map((module) => ({ ...module, courseSlug: "cybersecurity" })),
  ...context.__curriculum.dataModules.map((module) => ({ ...module, courseSlug: "data-engineering-mlops" })),
];
if (modules.length !== 35) throw new Error(`Expected 35 curriculum modules; found ${modules.length}.`);

const coursePositions = new Map();
const lessonRows = [];
const quizRows = [];
const questionRows = [];
const moduleRows = modules.map((module) => {
  const modulePosition = coursePositions.get(module.courseSlug) ?? 0;
  coursePositions.set(module.courseSlug, modulePosition + 1);
  const moduleId = stableUuid(`module:${module.courseSlug}:${module.id}`);
  const slug = slugify(module.id);
  module.lessons.forEach((lesson, lessonPosition) => {
    if (!lesson.title || !lesson.body || !lesson.q || !Array.isArray(lesson.options) || !Number.isInteger(lesson.correct)) {
      throw new Error(`Incomplete lesson content: ${module.id}:${lessonPosition}`);
    }
    const lessonId = stableUuid(`lesson:${module.courseSlug}:${module.id}:${lessonPosition}`);
    const lessonSlug = `${String(lessonPosition + 1).padStart(2, "0")}-${slugify(lesson.title)}`;
    const content = JSON.stringify({ body: lesson.body, principle: lesson.principle, exercise: lesson.exercise });
    lessonRows.push(`  (${uuid(lessonId)}, ${uuid(moduleId)}, ${sql(lessonSlug)}, ${sql(lesson.title)}, ${sql(content)}::jsonb, ${lessonPosition}, ${lessonPosition === 0})`);

    const quizId = stableUuid(`quiz:${module.courseSlug}:${module.id}`);
    const questionId = stableUuid(`question:${module.courseSlug}:${module.id}:${lessonPosition}`);
    if (!quizRows.some((row) => row.id === quizId)) {
      quizRows.push({ id: quizId, moduleId, slug: `${slug}-knowledge-check`, title: `${module.title} knowledge check` });
    }
    questionRows.push(`  (${uuid(questionId)}, ${uuid(quizId)}, ${sql(lesson.q)}, ${sql(JSON.stringify(lesson.options))}::jsonb, ${lesson.correct}, ${lessonPosition})`);
  });
  return `  (${uuid(moduleId)}, (select id from public.courses where slug = ${sql(module.courseSlug)}), ${sql(slug)}, ${sql(module.title)}, ${modulePosition})`;
});

const statements = [
  "-- Generated from the curated course scripts in app/dist. Preserve applied migrations; generate a new version for later content edits.",
  "begin;",
  "insert into public.course_modules (id, course_id, slug, title, position) values\n" + moduleRows.join(",\n") + ";",
  "insert into public.lessons (id, module_id, slug, title, content, position, is_preview) values\n" + lessonRows.join(",\n") + ";",
  "insert into public.quizzes (id, module_id, slug, title, passing_percent) values\n" + quizRows.map((row) => `  (${uuid(row.id)}, ${uuid(row.moduleId)}, ${sql(row.slug)}, ${sql(row.title)}, 70)`).join(",\n") + ";",
  "insert into public.quiz_questions (id, quiz_id, prompt, options, correct_option, position) values\n" + questionRows.join(",\n") + ";",
  "commit;",
  "",
];

const version = process.env.COURSE_MIGRATION_VERSION;
if (!/^\d{14}$/.test(version ?? "")) {
  throw new Error("Set COURSE_MIGRATION_VERSION to a unique 14-digit migration timestamp before generating content SQL.");
}
const output = path.join(root, "supabase", "migrations", `${version}_course_content.sql`);
if (fs.existsSync(output)) throw new Error(`Refusing to overwrite applied migration ${path.basename(output)}.`);
fs.writeFileSync(output, statements.join("\n\n"), "utf8");
console.log(`Wrote ${modules.length} modules, ${lessonRows.length} lessons, ${quizRows.length} quizzes, and ${questionRows.length} quiz questions.`);
