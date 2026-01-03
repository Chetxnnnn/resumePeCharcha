import {PDFLoader} from "@langchain/community/document_loaders/fs/pdf"
import { RecursiveCharacterTextSplitter } from "@langchain/textsplitters";
import { ChatGoogleGenerativeAI } from "@langchain/google-genai";
import * as fs from 'node:fs/promises';

const loader = new PDFLoader("./resume (1).pdf")

const spliter = new RecursiveCharacterTextSplitter({
    chunkSize: 700,
    chunkOverlap: 100
})

const docs = await loader.load()

const splits = await spliter.splitDocuments(docs)

const resume = splits.map(doc => doc.pageContent).join("\n")

const llm = new ChatGoogleGenerativeAI({
    temperature: 0.7,
    model:"gemini-2.5-flash",
    apiKey:"AIzaSyCIUYkfgk_yn0fU9WrHIS1K3r44tJNpBRM"
})

const jd = `Minimum qualifications:
Bachelor's degree or equivalent practical experience.
Experience working with Unix/Linux environments, distributed systems, machine learning, information retrieval, and TCP/IP.
Experience programming in C, C++, Java, or Python.

Preferred qualifications:
Bachelor's degree or advanced degree in Computer Science or Computer Engineering, or a related field.
About the job
Google's software engineers develop the next-generation technologies that change how billions of users connect, explore, and interact with information and one another. Our products need to handle information at massive scale, and extend well beyond web search. We're looking for engineers who bring fresh ideas from all areas, including information retrieval, distributed computing, large-scale system design, networking and data storage, security, artificial intelligence, natural language processing, UI design and mobile; the list goes on and is growing every day. As a software engineer, you will work on a specific project critical to Google s needs with opportunities to switch teams and projects as you and our fast-paced business grow and evolve. We need our engineers to be versatile, display leadership qualities and be enthusiastic to take on new problems across the full-stack as we continue to push technology forward.

As a key member of a small and versatile team, you design, test, deploy and maintain software solutions.
Google is an engineering company at heart. We hire people with a broad set of technical skills who are ready to take on some of technology's greatest challenges and make an impact on users around the world. At Google, engineers not only revolutionize search, they routinely work on scalability and storage solutions, large-scale applications and entirely new platforms for developers around the world. From Google Ads to Chrome, Android to YouTube, social to local, Google engineers are changing the world one technological achievement after another.
Responsibilities
Research, conceive, and develop software applications to extend and improve on Google's product offering.
Contribute to a wide variety of projects utilizing natural language processing, artificial intelligence, data compression, machine learning, and search technologies.
Collaborate on scalability issues involving access to data and information.
Solve challenges/problems that you are presented with.
Role: Software Development - Other
Industry Type: IT Services & Consulting
Department: Engineering - Software & QA
Employment Type: Full Time, Permanent
Role Category: Software Development
Education
UG: Any Graduate
PG: Any Postgraduate
Key Skills
Unix, C++, Linux, Networking, Machine learning, System design, Distribution system, Android, Python`

const response = await llm.invoke(`You are an experienced Human Resources professional and technical hiring manager.

Your role is to analyze a candidate’s resume against a provided Job Description (JD) and determine whether the candidate is suitable for the role.

INPUTS:
- Job Description: ${jd}
- Candidate Resume: ${resume}

OBJECTIVES:
1. Evaluate the candidate’s overall eligibility for the role.
2. Perform a deep analysis of projects, internships, and practical experience.
3. Assess alignment between required skills in the JD and skills demonstrated in the resume.
4. Give strong importance to:
   - Real-world projects
   - Impact, complexity, and relevance of projects
   - Extra-curricular activities, leadership, hackathons, open-source work, or competitions
5. Be objective, precise, and justify all conclusions with evidence from the resume.

EVALUATION CRITERIA:
- Skills Match:
  - Required skills vs demonstrated skills
  - Tools, technologies, and frameworks relevance
- Projects Analysis (High Priority):
  - Relevance to job role
  - Technical depth and complexity
  - Problem-solving and real-world application
  - Ownership and contribution clarity
- Experience:
  - Internships, freelance, or professional experience relevance
- Education:
  - Relevance of degree or certifications (do not overvalue grades)
- Extra Activities (Bonus):
  - Hackathons, clubs, leadership roles, open-source contributions, competitions
- Gaps or Weaknesses:
  - Missing key skills
  - Shallow or irrelevant projects
  - Lack of hands-on experience

OUTPUT FORMAT (STRICTLY FOLLOW):

1. Candidate Overview
   - Brief 3–4 line summary of the candidate profile

2. Skills Match Analysis
   - Strong Matches:
   - Partial Matches:
   - Missing or Weak Skills:

3. Projects Evaluation (Most Important Section)
   - Project 1:
     - Relevance to JD:
     - Technical Depth:
     - Real-world Impact:
     - Overall Assessment:
   - Project 2:
     - ...
   - Final Project Verdict (Strong / Average / Weak)

4. Experience & Education Evaluation
   - Experience relevance:
   - Education relevance:

5. Extra Activities & Achievements
   - Notable activities and how they add value to the role

6. Strengths
   - Bullet points

7. Concerns / Risks
   - Bullet points

8. Final Hiring Recommendation
   - Verdict: (Strong Yes / Yes / Maybe / No)
   - Justification: Clear reasoning in 3–5 lines
   - Suitable Level: (Intern / Junior / Mid-level / Not Suitable)

RULES:
- Do NOT hallucinate missing information.
- Do NOT assume skill proficiency without evidence.
- Be unbiased and professional.
- Prefer practical experience and projects over theoretical knowledge.
- If projects are weak or irrelevant, clearly mention it.

Your goal is to help HR make a confident and well-justified hiring decision.
`)

await fs.writeFile("./output.md", response.content, "utf8")
console.log(response.content);


