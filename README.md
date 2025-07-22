This porject takes pool of resumes and job description as input and Sort the resumes according to fufillment of job description. You can also generate the sortlisted applicant in excel format.

Feature Tech/Library Backend API Python + FastAPI, Resume Parsing PyMuPDF / python-docx + NLP (spaCy), Job Matching Python logic / OpenAI (optional), File Upload FastAPI UploadFile, Database (Optional) MongoDB, Frontend React.js

Steps to create this project.

step 1- install python in your system, if not avilable.

step 2- create a Backend folder. go into Backend folder in terminal.

step 3-Create a virtual environment use this command :python -m venv venv.

step 4-Activate the virtual environment: venv\Scripts\activate

step 5-Install required packages inside the venv: pip install fastapi uvicorn python-multipart python-docx python-dotenv pymupdf

step 6- pip install -r requirements.txt # if you have one

step 7- pip freeze > requirements.txt

step 8- copy the main.py file in your Backend folder.

step 10- run the project : uvicorn main:app --reload

step 11- open another terminal.

step 12- npx create-react-app frontend , cd frontend , npm install axios

    this will create a folder frontend and download some dependencies.
step 13- go to src/app.js

step 14- replace the full content with this app.js as provided above.

step 15- in terminal run command : npm start
