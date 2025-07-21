from fastapi import FastAPI, UploadFile, File, Form
from fastapi.middleware.cors import CORSMiddleware
from typing import List
import fitz  # PyMuPDF
from fastapi.responses import StreamingResponse
from io import BytesIO
from reportlab.lib.pagesizes import letter
from reportlab.pdfgen import canvas


app = FastAPI()

# CORS for React frontend
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

@app.post("/upload/")
async def upload_resumes(
    files: List[UploadFile] = File(...),
    job_description: str = Form(...)
):
    results = []

    for file in files:
        content = await file.read()
        text = extract_text(content)
        match_score = score_match(text, job_description)
        results.append({
            "filename": file.filename,
            "match_score": match_score,
            "parsed_data": {
                "skills": extract_skills(text)
            }
        })

    return {"results": results}

def extract_text(file_bytes):
    try:
        with fitz.open(stream=file_bytes, filetype="pdf") as doc:
            return "\n".join([page.get_text() for page in doc])
    except:
        return "Could not extract text"

def extract_skills(text):
    skills = ["Python", "Java", "SQL", "React", "Node", "AWS"]
    return [skill for skill in skills if skill.lower() in text.lower()]

def score_match(resume, jd):
    jd_words = set(jd.lower().split())
    resume_words = set(resume.lower().split())
    if not jd_words:
        return 0
    return int(100 * len(jd_words & resume_words) / len(jd_words))

@app.post("/generate-pdf/")
async def generate_pdf(resume_data: List[dict]):
    buffer = BytesIO()
    p = canvas.Canvas(buffer, pagesize=letter)
    width, height = letter

    y = height - 50
    p.setFont("Helvetica", 12)
    p.drawString(50, y, "QuickHire - Resume Match Report")
    y -= 30

    for index, res in enumerate(resume_data, 1):
        p.drawString(50, y, f"{index}. {res['filename']} - {res['match_score']}% Match")
        y -= 20
        p.drawString(60, y, f"Skills: {', '.join(res['parsed_data']['skills'])}")
        y -= 30
        if y < 100:
            p.showPage()
            y = height - 50

    p.save()
    buffer.seek(0)

    return StreamingResponse(buffer, media_type="application/pdf", headers={
        "Content-Disposition": "attachment; filename=QuickHire_Report.pdf"
    })

