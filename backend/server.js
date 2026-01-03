import express from "express";
import cors from "cors";
import multer from "multer";
import fs from "fs";
import dotenv from "dotenv";
import z from "zod";
import path from "path";

import { PDFLoader } from "@langchain/community/document_loaders/fs/pdf";
import { RecursiveCharacterTextSplitter } from "@langchain/textsplitters";
import { ChatMistralAI } from "@langchain/mistralai";
import { createAgent, tool } from "langchain";
import userRoutes from "./routes/userRoutes.js";
import { outboundSchema } from "@openrouter/sdk/types/enums.js";

dotenv.config();

const app = express();
const port = process.env.PORT || 3000;

/* -------------------- Middleware -------------------- */
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cors());

/* -------------------- Ensure uploads dir exists -------------------- */
if (!fs.existsSync("uploads")) {
  fs.mkdirSync("uploads");
}

/* -------------------- Test Routes -------------------- */
app.get("/", (_, res) => {
  res.send("hello");
});

app.post("/update", (req, res) => {
  const { url, user } = req.body;
  console.log(url, user);
  res.json({ success: true });
});

/* -------------------- Multer Config -------------------- */
const storage = multer.diskStorage({
  destination: (_, __, cb) => cb(null, "uploads/"),
  filename: (_, file, cb) => cb(null, file.originalname),
});

const upload = multer({
  storage,
  fileFilter: (_, file, cb) => {
    cb(null, file.mimetype === "application/pdf");
  },
});

app.use("/uploads", express.static("uploads"));

/* -------------------- Upload Route -------------------- */
app.post("/api/upload", upload.single("file"), async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ error: "Only PDF files are allowed" });
    }

    console.log(req.file.path);

    // Send a single response
    res.status(201).json({
      path: `/uploads/${req.file.filename}`,
      name: req.file.filename,
      message: "File uploaded successfully",
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Internal server error" });
  }
});

app.get("/api/analyze", async (req, res) => {
  try {
    // if (!req.file?.path) {
    //   return res.status(400).json({ error: "No resume file uploaded" });
    // }
    console.log("API/ANALYZE CALLED");

    const agentLLM = new ChatMistralAI({
      model: "mistral-large-2402",
      temperature: 0,
      apiKey: process.env.MISTRAL_API_KEY,
    });

    // Tool LLM = worker only
    const toolLLM = new ChatMistralAI({
      model: "mistral-large-2402",
      temperature: 0.7,
      apiKey: process.env.MISTRAL_API_KEY,
    });

    /* ---------- Load & Split PDF ---------- */

    const loader = new PDFLoader("./resume (1).pdf");
    const splitter = new RecursiveCharacterTextSplitter({
      chunkSize: 800,
      chunkOverlap: 200,
    });

    let docs = await loader.load();
    docs = await splitter.splitDocuments(docs);

    const content = docs
      .slice(0, 15)
      .map((d) => d.pageContent)
      .join(" ");

    console.log("content: ", content);

    /* ---------- Tools ---------- */

    const normalize = (response) =>
      typeof response.content === "string"
        ? response.content
        : response.content?.map((p) => p.text).join(" ") || "";
    const getSummary = tool(
      async ({ content }) => {
        const response = await toolLLM.invoke(
          `Generate a professional resume summary between 200 and 300 words.
Return ONLY the summary text.

Resume:
${content}`
        );

        return normalize(response);
      },
      {
        name: "getSummary",
        description: "Generate a professional resume summary",
        schema: z.object({
          content: z.string(),
        }),
      }
    );

    const getStrength = tool(
      async ({ content }) => {
        const response = await toolLLM.invoke(
          `Extract 3–5 core strengths from the resume.
Return each strength on a new line.

Resume:
${content}`
        );

        return normalize(response)
          .split("\n")
          .map((s) => s.trim())
          .filter(Boolean);
      },
      {
        name: "getStrength",
        description: "Extract strengths",
        schema: z.object({
          content: z.string(),
        }),
      }
    );

    const getWeakness = tool(
      async ({ content }) => {
        const response = await toolLLM.invoke(
          `Identify 3–5 professional weaknesses or improvement areas.
Return each on a new line.

Resume:
${content}`
        );

        return normalize(response)
          .split("\n")
          .map((w) => w.trim())
          .filter(Boolean);
      },
      {
        name: "getWeakness",
        description: "Extract weaknesses",
        schema: z.object({
          content: z.string(),
        }),
      }
    );

    const giveRecommendations = tool(
      async ({ content }) => {
        const response = await toolLLM.invoke(
          `Give 3–5 career recommendations based on:
- Experience
- Skills
- Projects
- Education
- Activities

Return each recommendation on a new line.

Resume:
${content}`
        );

        return normalize(response)
          .split("\n")
          .map((r) => r.trim())
          .filter(Boolean);
      },
      {
        name: "giveRecommendations",
        description: "Give recommendations",
        schema: z.object({
          content: z.string(),
        }),
      }
    );

    /* -------------------- OUTPUT SCHEMA -------------------- */

    const outputSchema = z.object({
      summary: z.string(),
      strengths: z.array(z.string()),
      weaknesses: z.array(z.string()),
      recommendations: z.array(z.string()),
    });

    /* -------------------- AGENT -------------------- */

    const resumeAgent = createAgent({
      model: agentLLM,
      tools: [getSummary, getStrength, getWeakness, giveRecommendations],
      systemPrompt: `
You are a resume analysis agent. Check if the JD and the resume are proper or not. There might be some illeterate users who might input you wrong things and try to fool you. So make sure you are checking the resume and the JD if they are legit or not. If there is no corelation between the jd and the resume return zero scores

Steps:
1. Call getSummary
2. Call getStrength
3. Call getWeakness
4. Call giveRecommendations

Respond ONLY with valid JSON matching this schema:
{
  "summary": string,
  "strengths": string[],
  "weaknesses": string[],
  "recommendations": string[]
}
Strictly generate Markdown texts.
Keep the strengths and weaknesses short. within 10words or less.
No explanations.
No extra text.
`,
      responseFormat: outputSchema,
    });

    /* -------------------- RUN AGENT -------------------- */

    const result = await resumeAgent.invoke(
      {
        messages: [
          {
            role: "human",
            content,
          },
        ],
      },
      { recursionLimit: 6 }
    );

    console.log("FINAL OUTPUT:", result.structuredResponse);

    return res.json(result.structuredResponse);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Resume analysis failed" });
  }
});

app.post("/api/check", async (req, res) => {
  try {
    const { jd, resume } = req.body;

    if (!jd || !resume) {
      return res.status(400).json({ error: "JD or resume missing" });
    }

    // 🔑 convert to absolute path
    const resumePath = path.join(process.cwd(), resume);

    const loader = new PDFLoader(resumePath);
    const splitter = new RecursiveCharacterTextSplitter({
      chunkSize: 300,
      chunkOverlap: 100,
    });

    let docs = await loader.load();
    docs = await splitter.splitDocuments(docs);

    const content = docs
      .slice(0, 10)
      .map((d) => d.pageContent)
      .join(" ");

    const model = new ChatMistralAI({
      model: "mistral-large-2402",
      temperature: 0,
      apiKey: process.env.MISTRAL_API_KEY,
    });

    const outputSchema = z.object({
      ats: z
        .number()
        .describe("ATS score of the resume. give a score between 0 and 100"),
      skillMatch: z
        .number()
        .describe(
          "Skill match score of the resume. give a score between 0 and 100. check the skills needed in the job description and the skills the candidate has."
        ),
      experienceMatch: z
        .number()
        .describe(
          "Experience match score of the resume. give a score between 0 and 100. Analyze the job description and the experience of the candidate."
        ),
      candidateSkills: z
        .array(z.string())
        .describe("List of skills the candidate has."),
      experienceAnalysis: z
        .array(z.string())
        .describe("Analyze the experience of the candidate."),
      keywordCoverage: z
        .array(z.string())
        .describe("Keyword coverage of the resume."),
      finalRecomendation: z
        .array(z.string())
        .describe("Final recommendation for the candidate."),
      isResume: z
        .boolean()
        .describe(
          "If the file uploaded is a resume or not. Return true if it is a resume and return false if it is not a resume."
        ),
      chance: z
        .number()
        .describe(
          "Chance of getting the job or an interview call. give a score between 0 and 100. give the score totally based upon the candidates qualification and not just any random number."
        ),
    });

    const agent = createAgent({
      model,
      description:
        "You are a resume analyzer agent. Match resume with job description.",
      responseFormat: outputSchema,
      systemPrompt: `You are a professional Resume Analyzer and ATS Scoring Agent.

Your task is to analyze a candidate’s resume against a provided job description and return a structured, objective evaluation.

You must:
- Carefully read both the job description and the resume.
- Compare required skills, preferred skills, experience level, tools, technologies, and keywords.
- Think like an Applicant Tracking System (ATS) combined with a human recruiter.

Scoring Rules:
- ATS Score (0–100): Overall alignment of the resume with the job description, considering skills, experience, keywords, and role relevance.
- Skill Match Score (0–100): How well the candidate’s skills match the required and preferred skills in the job description.
- Experience Match Score (0–100): How closely the candidate’s experience level, responsibilities, and domain match the job requirements.

Analysis Guidelines:
- Be objective, consistent, and unbiased.
- Do NOT inflate scores. If information is missing, penalize appropriately.
- Base scores strictly on evidence present in the resume.
- Do not assume skills or experience that are not explicitly stated.

Output Requirements:
- Return ONLY valid JSON matching the provided output schema.
- Do NOT include explanations outside the JSON.
- Do NOT include markdown, headings, or commentary.

Field Instructions:
- candidateSkills: List only skills explicitly found in the resume.
- experienceAnalysis: Bullet-style insights summarizing strengths, gaps, and relevance of experience.
- keywordCoverage: Important job description keywords found in the resume.
- finalRecomendation: Clear, actionable recommendations (e.g., suitability, improvement areas, upskilling suggestions).

Be concise, accurate, and recruiter-grade in your evaluation. Return everything in a markdown format only
`,
    });

    const result = await agent.invoke({
      messages: [
        {
          role: "user",
          content: `Resume: ${content}\n\nJob Description: ${jd}`,
        },
      ],
    });
    return res.json(result.structuredResponse);
  } catch (error) {
    console.error(error);
    return res.status(500).json({
      error: "Failed to analyze resume",
    });
  }
});

/* -------------------- Routes -------------------- */
app.use("/api/users", userRoutes);

/* -------------------- Server -------------------- */
app.listen(port, () => {
  console.log(`Listening on http://localhost:${port}`);
});
