"""Publish the same structured learning material to PDF and the in-site reader."""
from pathlib import Path
from html import escape
import json, shutil
from reportlab.platypus import SimpleDocTemplate, Paragraph, Spacer, PageBreak, Image, Preformatted, KeepTogether
from reportlab.lib.styles import ParagraphStyle
from reportlab.lib import colors
from reportlab.pdfbase.pdfmetrics import stringWidth
from reportlab.lib.utils import ImageReader
R=Path(__file__).parent
mods=json.loads((R/'dist/data.json').read_text())
logo=R/'dist/assets/nxgen-logo.png'
C=colors.HexColor

def block(text,type='paragraph',**kw):return dict(type=type,text=text,**kw)
def heading(text):return block(text,'heading')
def para(text):return block(text)
def items(*text):return dict(type='list',items=list(text))
def pg(title,eyebrow,*blocks):return dict(title=title,eyebrow=eyebrow,blocks=list(blocks))

guide=[
 pg('Good data. Great possibilities.','YOUR DATA ENGINEERING & MLOPS ROADMAP',para('A practical, self-paced journey through the systems that turn data into dependable machine learning.'),dict(type='image',src='assets/students.png',alt='Students collaborating on a data project'),heading('Build the thinking behind the tools.'),para('Explore five connected modules, twenty focused lessons, eight practitioner videos and fifty explained quiz questions. Bring the ideas together in two guided projects.'),block('A learning resource from NxGenVarsity. Read in sequence or return to a topic when your project needs it.','callout')),
 pg('Your five-module journey.','LEARN THE CONNECTIONS',*[x for m in mods for x in (heading(f"0{m['id']}. {m['name']}"),para(m['description']),para('Lessons: '+' / '.join(l['title'] for l in m['lessons']))) ]),
 pg('Make each idea useful.','A FLEXIBLE STUDY ROUTINE',heading('Before you begin'),para('Basic familiarity with programming, SQL and introductory machine learning will help. You can still use the conceptual lessons to build vocabulary before writing code.'),heading('Read, try, reflect'),items('Read one lesson and explain its core idea in your own words.','Work through the example and answer its activity prompt.','Watch a related video and record one trade-off the speaker describes.','Take the ten-question module assessment. Aim for 80%, then review every explanation.','Keep a project notebook with assumptions, decisions and open questions.'),heading('Use the resources together'),para('The study companion contains all twenty lessons. The project workbook provides planning sheets. The revision workbook has fifty questions and answer keys. Every guide is readable inside the studio and available as a PDF.'),block('Take the time you need. A clear explanation and a justified design are more useful than rushing through a list of tools.','callout')),
 pg('Turn learning into a portfolio.','TWO GUIDED PROJECTS',heading('Project 01: design an MLOps pipeline'),para('Choose house-price prediction, customer churn or another simple use case. Connect its business objective, data sources, exploration, features, evaluation and reproducibility plan. Draw the full pipeline, including quality gates and the monitoring loop.'),heading('Project 02: evaluate an MLOps tool'),para('Study MLflow, Kubeflow or TFX using official documentation. Explain its components, CI/CD support, validation and one deployment strategy. Separate native functionality from integrations and assess operational trade-offs.'),heading('Your final evidence'),items('A pipeline diagram and data-quality contract','An experiment and versioning plan','A release record with promotion and rollback criteria','A monitoring playbook and model-card outline','A tool recommendation with references and stated assumptions'),block('These are flexible learning projects. Adapt the scope and evidence to the problem you are trying to solve.','callout'))
]
study=[pg('The complete study companion.','DATA ENGINEERING & MLOPS',para('Twenty lessons to connect reliable data systems with responsible machine learning operations.'),dict(type='image',src='assets/students.png',alt='Students working together on a data pipeline'),heading('Read for understanding. Build to remember.'),para('Each lesson includes a learning goal, core explanations and a practical reflection. Worked examples are illustrative and need to be adapted to the actual data, environment and requirements.')),
 pg('Find your next connection.','YOUR LEARNING MAP',*[x for m in mods for x in (heading(f"Module 0{m['id']}: {m['name']}"),para(' / '.join(l['title'] for l in m['lessons'])))])]
for m in mods:
 for i,l in enumerate(m['lessons']):
  bs=[para(l['objective'])]
  for s in l['sections']:bs += [heading(s['title']),para(s['body'])]
  if l.get('code'):bs += [heading('Worked example'),block(l['code'],'code'),block(l['codeCaption'],'caption')]
  bs += [block('PUT THE IDEA TO WORK: '+l['activity'],'callout')]
  study.append(pg(l['title'],f"MODULE 0{m['id']} / LESSON 0{i+1}",*bs))
study += [pg('A vocabulary for the whole system.','QUICK REFERENCE',*[x for term,definition in [
 ('Data contract','Documented expectations for a dataset: schema, quality, ownership and delivery behavior.'),('Idempotency','Repeating an operation has the same intended final effect as performing it once.'),('DAG','A directed acyclic graph describing dependencies without directed cycles.'),('Data leakage','Using information during development that would be unavailable at prediction time.'),('Artifact','A versioned output such as a trained model, evaluation report or environment file.'),('Release gate','A check that must pass before a candidate is promoted.'),('Input drift','A change in input distribution relative to a reference; a signal to investigate.'),('Ground truth','Observed outcomes used to evaluate predictions.'),('Model card','A record of intended use, evaluation, limitations and relevant model context.'),('Lineage','The connection between outputs and the data, code and transformations that produced them.')
 ] for x in (heading(term),para(definition))]),
 pg('Read deeper. Build thoughtfully.','FURTHER READING',heading('Books'),items('Joe Reis and Matt Housley, Fundamentals of Data Engineering, 2022.','Mark Treveil and the Dataiku Team, Introducing MLOps, 2020.','Martin Kleppmann, Designing Data-Intensive Applications.','Andriy Burkov, Machine Learning Engineering.','Noah Gift and Alfredo Deza, Practical MLOps.'),heading('Primary references'),*[block(title,'link',url=url) for title,url in [
 ('IBM: data engineering','https://www.ibm.com/think/topics/data-engineering'),('MLflow: tracking quickstart','https://mlflow.org/docs/latest/ml/tracking/quickstart/'),('scikit-learn: common pitfalls','https://scikit-learn.org/stable/common_pitfalls.html'),('Apache Airflow: architecture overview','https://airflow.apache.org/docs/apache-airflow/stable/core-concepts/overview.html'),('Google Cloud: MLOps automation pipelines','https://docs.cloud.google.com/architecture/mlops-continuous-delivery-and-automation-pipelines-in-machine-learning')]],para('This companion contains original explanations and illustrative examples. Consult official documentation for the versions and deployment environment you use. References checked on 2 November 2026.'))]
workbook=[pg('Your MLOps project workbook.','FROM IDEAS TO ARTIFACTS',para('Two practical projects. One place to make your reasoning clear.'),heading('Project 01: design a pipeline'),para('Choose a simple prediction problem and connect the business goal, data, features, evaluation and reproducibility plan in a coherent system.'),heading('Project 02: evaluate a tool'),para('Choose MLflow, Kubeflow or TFX. Assess its core components, delivery workflow, model validation and deployment trade-offs.'),block('Name / Use case / Tool selected','callout'),dict(type='lines'))]
work_sections=[
 ('Start with the decision.','PROJECT 01 / PROBLEM & DATA',[('Problem statement and objective','Who will use the prediction? What decision changes? Define a business success measure, prediction target and simple baseline.'),('Data sources and exploration','List datasets, owners and access assumptions. Describe missingness, target quality, time boundaries and the train/validation/test split.')]),
 ('Make the experiment repeatable.','PROJECT 01 / FEATURES & EVALUATION',[('Feature engineering and selection','List features, transformations and rationale. Explain prediction-time availability and leakage prevention.'),('Training and evaluation plan','Choose a baseline, candidate algorithms and metrics. State quality thresholds, relevant error slices and operational constraints.')]),
 ('Draw the whole system.','PROJECT 01 / REPRODUCIBILITY & DESIGN',[('Versioning plan','Describe code, data, environment, parameter and artifact versions. How will another person reproduce a run?'),('Pipeline diagram','Draw sources, ingestion, storage, validation, features, training, evaluation and deployment. Add ownership, monitoring, approval and rollback paths.')]),
 ('Understand the building blocks.','PROJECT 02 / TOOL OVERVIEW',[('Overview and components','Record the tool version, purpose and relevant components using its official documentation.'),('CI/CD support','Explain what the tool provides and what needs another service or integration. Trace a change from commit to a validated candidate.')]),
 ('Explain a concrete deployment.','PROJECT 02 / VALIDATION & RELEASE',[('Model testing and validation','Describe schema, quality, metric, interface and runtime checks. Identify where each gate runs and which evidence it retains.'),('A deployment strategy','Explain canary, blue-green, shadow or another relevant strategy. State traffic handling, success criteria, rollback and limitations.')]),
 ('Judge the fit, not the fashion.','PROJECT 02 / CRITICAL REVIEW',[('Advantages and challenges','Assess team capability, integration, operations, cost, reliability and reproducibility. Distinguish documented capabilities from assumptions.'),('Evidence and recommendation','Cite official documentation, versions and access dates. Make a recommendation tied to the use case and a condition that would change it.')])]
for title,eyebrow,qs in work_sections:
 bs=[]
 for t,b in qs:bs += [heading(t),para(b),dict(type='lines')]
 workbook.append(pg(title,eyebrow,*bs))
workbook += [pg('Make your reasoning reviewable.','YOUR PROJECT CHECKLIST',items('Link the business objective to a measurable model outcome.','Make data access, leakage and evaluation assumptions explicit.','Include quality gates, ownership and feedback in the diagram.','Identify the data, code and environment behind a run.','Explain release, rollback and monitoring decisions.','Separate native tool features from required integrations.','Ground advantages and challenges in the use case.','Document references, versions and limitations.'),heading('Suggested evidence bundle'),para('A short design report, architecture diagram, data contract, experiment plan, release checklist, monitoring playbook and tool decision record.'),block('Adapt this workbook to your learning goals. It does not prescribe a fixed grading rubric or submission format.','callout'))]
quizbook=[pg('Fifty questions. Deeper understanding.','YOUR REVISION & QUIZ WORKBOOK',para('Ten questions per module with complete explained answer keys.'),heading('How to use this workbook'),items('Answer a set of ten before checking the answer key.','Aim for at least eight correct answers per module.','Explain why the other choices are less suitable.','Revisit the relevant lesson and retry the question in a new context.'),block('The website shuffles answer choices. The answer letters in this PDF apply only to the choices printed here.','callout'))]
for m in mods:
 for part in range(2):
  bs=[]
  for i,q in enumerate(m['quizzes'][part*5:part*5+5],start=part*5+1):
   bs += [heading(f"{i}. {q['question']}"),items(*[f"{chr(65+j)}. {o}" for j,o in enumerate(q['options'])])]
  quizbook.append(pg(m['name'],f"MODULE 0{m['id']} / QUESTIONS {part*5+1}-{part*5+5}",*bs))
 quizbook.append(pg('Check the reasoning.',f"MODULE 0{m['id']} / ANSWERS & EXPLANATIONS",*[x for i,q in enumerate(m['quizzes'],1) for x in (heading(f"{i}. Answer {chr(65+q['answer'])}"),para(q['explanation']))]))

documents={key:dict(title=title,filename=filename,pages=pages) for key,title,filename,pages in [
 ('guide','Data Engineering & MLOps roadmap','course-guide.pdf',guide),('study','The complete study companion','study-companion.pdf',study),('workbook','Your MLOps project workbook','project-workbook.pdf',workbook),('quizbook','50-question revision workbook','quiz-workbook.pdf',quizbook)]}
(R/'dist/documents.json').write_text(json.dumps(documents,ensure_ascii=False,indent=2))

styles={
 'title':ParagraphStyle('Title',fontName='Times-Roman',fontSize=30,leading=34,textColor=C('#204d47'),spaceAfter=17),
 'heading':ParagraphStyle('Heading',fontName='Helvetica-Bold',fontSize=11,leading=14.2,textColor=C('#204d47'),spaceBefore=12,spaceAfter=5),
 'paragraph':ParagraphStyle('Body',fontName='Helvetica',fontSize=10.3,leading=14.7,textColor=C('#596b56'),spaceAfter=7),
 'caption':ParagraphStyle('Caption',fontName='Helvetica',fontSize=8.2,leading=11,textColor=C('#89937e'),spaceAfter=7),
 'eyebrow':ParagraphStyle('Eyebrow',fontName='Helvetica-Bold',fontSize=7.5,leading=11,textColor=C('#bf5533'),spaceAfter=14),
 'callout':ParagraphStyle('Callout',fontName='Helvetica',fontSize=9.5,leading=13.5,textColor=C('#53694d'),backColor=C('#edf1e5'),borderPadding=9,spaceBefore=13,spaceAfter=14),
 'list':ParagraphStyle('List',fontName='Helvetica',fontSize=9.8,leading=14,textColor=C('#596b56'),leftIndent=11,firstLineIndent=-8,spaceAfter=6),
 'code':ParagraphStyle('Code',fontName='Courier',fontSize=8.3,leading=11.5,textColor=C('#345e49'),backColor=C('#edf1e6'),borderPadding=9,spaceBefore=8,spaceAfter=12)
}
def clean(s):
 for a,b in [('→',' > '),('↗',''),('–','-'),('—','-'),('’',"'"),('‘',"'"),('“','"'),('”','"'),('·',' / ')]:s=s.replace(a,b)
 return s

def p(s,style='paragraph'):return Paragraph(escape(clean(s)),styles[style])
def page(canvas,doc):
 canvas.setFillColor(C('#f8f7f2'));canvas.rect(0,0,595.28,841.89,stroke=0,fill=1)
 canvas.drawImage(ImageReader(str(logo)),48,795,width=155,height=26.75,mask='auto')
 canvas.setFont('Helvetica',6.5);canvas.setFillColor(C('#6f8065'));canvas.drawRightString(547,806,'DATA ENGINEERING & MLOPS')
 canvas.setStrokeColor(C('#dfe4d7'));canvas.line(48,783,547,783);canvas.line(48,45,547,45)
 canvas.setFont('Helvetica',7);canvas.setFillColor(C('#829076'));canvas.drawString(48,30,'NxGenVarsity  /  Learn deeply. Build responsibly.')
 canvas.drawRightString(547,30,str(doc.page))

def render_doc(doc):
 story=[]
 for i,page_data in enumerate(doc['pages']):
  if i:story.append(PageBreak())
  story += [p(page_data['eyebrow'],'eyebrow'),p(page_data['title'],'title')]
  for b in page_data['blocks']:
   typ=b['type']
   if typ in ['heading','paragraph','caption','callout']:story.append(p(b['text'],typ))
   elif typ=='image':story += [Spacer(1,10),Image(str(R/'dist'/b['src']),width=499,height=280),Spacer(1,14)]
   elif typ=='list':
    for t in b['items']:story.append(p('- '+t,'list'))
   elif typ=='code':story.append(Preformatted(clean(b['text']),styles['code']))
   elif typ=='lines':
    for j in range(7):story.append(p('_'*97,'caption'))
   elif typ=='link':story.append(Paragraph('<link href="'+escape(b['url'],quote=True)+'" color="#bf5533">'+escape(b['text'])+'</link>',styles['paragraph']))
 out=R/'output/pdf'/doc['filename'];out.parent.mkdir(exist_ok=True,parents=True)
 pdf=SimpleDocTemplate(str(out),pagesize=(595.28,841.89),leftMargin=48,rightMargin=48,topMargin=76,bottomMargin=66,title=doc['title'],author='NxGenVarsity')
 pdf.build(story,onFirstPage=page,onLaterPages=page)
 shutil.copy(out,R/'dist/resources'/doc['filename'])
 print(doc['filename'],len(doc['pages']),'structured pages')
for doc in documents.values():render_doc(doc)
# Keep a previously shared URL useful without serving the old institution-specific file.
shutil.copy(R/'dist/resources/course-guide.pdf',R/'dist/resources/original-syllabus.pdf')
