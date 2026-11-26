"""Create NxGenVarsity's four original Cyber Studio PDF study companions."""
from pathlib import Path
from xml.sax.saxutils import escape
import json, shutil
from reportlab.pdfgen import canvas
from reportlab.lib.colors import HexColor, Color, white
from reportlab.lib.pagesizes import A4
from reportlab.lib.styles import ParagraphStyle
from reportlab.platypus import Paragraph, Table, TableStyle
from reportlab.pdfbase import pdfmetrics
from reportlab.pdfbase.ttfonts import TTFont
from reportlab.lib.utils import ImageReader

ROOT=Path(__file__).resolve().parents[1]
OUT=ROOT/'output/pdf';OUT.mkdir(parents=True,exist_ok=True)
FONT=Path('/Users/maheshpremachandra/.cache/codex-runtimes/codex-primary-runtime/dependencies/native/libreoffice-headless/libreoffice/LibreOfficeDev.app/Contents/Resources/fonts/truetype')
for n,f in [('Body','DejaVuSans.ttf'),('Bold','DejaVuSans-Bold.ttf'),('Italic','DejaVuSans-Oblique.ttf')]:pdfmetrics.registerFont(TTFont(n,str(FONT/f)))
pdfmetrics.registerFontFamily('Body',normal='Body',bold='Bold',italic='Italic',boldItalic='Bold')
W,H=A4;M=46;CW=W-2*M
INK=HexColor('#21343e');MUTED=HexColor('#667b80');LINE=HexColor('#dce5e3');NAVY=HexColor('#182e3a')
SITE='https://cyber-studio-engineering.maheshp.chatgpt.site'
LOGO=ImageReader(str(ROOT/'dist/assets/nxgenvarsity-logo.png'))
DOCS=[]
class Guide:
 def __init__(self,slug,title,subtitle,number,accent,tint):
  self.slug=slug;self.title=title;self.subtitle=subtitle;self.number=number;self.accent=HexColor(accent);self.tint=HexColor(tint);self.page=0;self.y=0;self.c=canvas.Canvas(str(OUT/(slug+'.pdf')),pagesize=A4,pageCompression=1)
  self.c.setTitle(title+' | NxGenVarsity Cyber Studio');self.c.setAuthor('NxGenVarsity');self.c.setSubject(subtitle);self.c.setCreator('NxGenVarsity Cyber Studio')
 def para(self,text,size=9.4,leading=14,color=None,bold=False,x=None,width=None,gap=9):
  style=ParagraphStyle('p',fontName='Bold' if bold else 'Body',fontSize=size,leading=leading,textColor=color or INK,spaceAfter=0,allowWidows=0,allowOrphans=0)
  p=Paragraph(text,style);pw,ph=p.wrap(width or CW,700)
  if self.y-ph<60:raise ValueError(f'Overflow: {self.slug} p{self.page}: {text[:65]} at {self.y-ph}')
  p.drawOn(self.c,x or M,self.y-ph);self.y-=ph+gap;return ph
 def start(self,title,kicker='STUDY COMPANION',intro=None):
  if self.page:self.c.showPage()
  self.page+=1;self.c.setFillColor(white);self.c.rect(0,0,W,H,fill=1,stroke=0)
  self.c.drawImage(LOGO,M,H-69,width=205,height=35.4,mask='auto',preserveAspectRatio=True,anchor='c')
  self.c.setFont('Bold',7.3);self.c.setFillColor(self.accent);self.c.drawRightString(W-M,H-43,'CYBER STUDIO / '+self.number)
  self.c.setFont('Body',7);self.c.setFillColor(MUTED);self.c.drawRightString(W-M,H-57,'NXGENVARSITY LEARNING SERIES')
  self.c.setStrokeColor(LINE);self.c.line(M,H-82,W-M,H-82)
  self.c.setFillColor(self.accent);self.c.rect(M,H-103,23,3,fill=1,stroke=0)
  self.y=H-123;self.para(kicker.upper(),size=8,leading=10,color=self.accent,bold=True,gap=11)
  self.para(title,size=25,leading=30,bold=True,gap=12)
  if intro:self.para(intro,size=10.2,leading=16,color=MUTED,gap=18)
  self.footer()
 def footer(self):
  c=self.c;c.setStrokeColor(LINE);c.line(M,47,W-M,47);c.setFont('Body',6.8);c.setFillColor(MUTED);c.drawString(M,32,'NxGenVarsity | Cyber Studio | Edition 02 Nov 2026');c.drawRightString(W-M,32,f'{self.page:02d} / 05')
  c.setFont('Body',6.6);c.setFillColor(self.accent);c.drawString(M,20,'Continue learning: cyber-studio-engineering.maheshp.chatgpt.site');c.linkURL(SITE,(M,17,W-M,28),relative=0)
 def section(self,title):self.y-=5;self.para(title,size=13,leading=17,bold=True,gap=9)
 def box(self,title,text):
  style=ParagraphStyle('box',fontName='Body',fontSize=9,leading=13.5,textColor=INK)
  p=Paragraph('<b>'+title+'</b><br/>'+text,style);_,h=p.wrap(CW-30,700);h+=24
  if self.y-h<60:raise ValueError('Box overflow '+self.slug)
  self.c.setFillColor(self.tint);self.c.roundRect(M,self.y-h,CW,h,8,fill=1,stroke=0);self.c.setFillColor(self.accent);self.c.roundRect(M,self.y-h,3,h,1.5,fill=1,stroke=0);p.drawOn(self.c,M+15,self.y-h+12);self.y-=h+14
 def bullets(self,items,check=False):
  for t in items:
   if check:self.c.setStrokeColor(self.accent);self.c.rect(M+1,self.y-10,6,6,fill=0,stroke=1)
   else:self.c.setFillColor(self.accent);self.c.circle(M+4,self.y-6,2,fill=1,stroke=0)
   self.para(t,size=9.1,leading=14,x=M+17,width=CW-17,gap=8)
 def table(self,headers,rows,widths):
  sty=ParagraphStyle('cell',fontName='Body',fontSize=8.3,leading=12,textColor=INK)
  hsty=ParagraphStyle('head',parent=sty,fontName='Bold',textColor=self.accent)
  data=[[Paragraph(escape(v),hsty) for v in headers]]+[[Paragraph(str(v),sty) for v in row]for row in rows]
  tab=Table(data,colWidths=widths,hAlign='LEFT');tab.setStyle(TableStyle([('BACKGROUND',(0,0),(-1,0),self.tint),('VALIGN',(0,0),(-1,-1),'TOP'),('LINEBELOW',(0,0),(-1,0),.7,self.accent),('LINEBELOW',(0,1),(-1,-1),.35,LINE),('LEFTPADDING',(0,0),(-1,-1),9),('RIGHTPADDING',(0,0),(-1,-1),9),('TOPPADDING',(0,0),(-1,-1),8),('BOTTOMPADDING',(0,0),(-1,-1),8)]));_,th=tab.wrap(CW,700)
  if self.y-th<60:raise ValueError(f'Table overflow {self.slug} p{self.page}: {self.y-th}')
  tab.drawOn(self.c,M,self.y-th);self.y-=th+15
 def lines(self,label,n=3):
  self.para(label,size=8.4,leading=12,bold=True,gap=3)
  for _ in range(n):
   if self.y-22<60:raise ValueError('Lines overflow '+self.slug)
   self.c.setStrokeColor(LINE);self.c.line(M,self.y-16,W-M,self.y-16);self.y-=22
  self.y-=7
 def source(self,label,url):
  self.para('<link href="'+escape(url,{'"':'&quot;'})+'" color="'+self.accent.hexval()+'"><b>'+escape(label)+'</b></link>',size=8.8,leading=13,gap=3)
  self.para(escape(url),size=7.2,leading=10,color=MUTED,gap=10)
 def finish(self):
  assert self.page==5,(self.slug,self.page);self.c.save();shutil.copy2(OUT/(self.slug+'.pdf'),ROOT/'dist/downloads'/(self.slug+'.pdf'));DOCS.append({'id':self.slug,'title':self.title,'description':self.subtitle,'pages':5,'url':'downloads/'+self.slug+'.pdf','size':(OUT/(self.slug+'.pdf')).stat().st_size})

# 01: learning and career roadmap
g=Guide('cybersecurity-learning-career-roadmap','Cybersecurity Learning & Career Roadmap','A focused 12-week plan, career comparisons, and a portfolio checklist for engineering students.','01','#315f92','#eaf2ff')
g.start('A curious mind.\nA purposeful career.'.replace('\n','<br/>'),'LEARNING & CAREER ROADMAP','Build understanding in layers, then create evidence of what you can do. Use this companion with the guided lessons in Cyber Studio.')
g.box('Your outcome','Choose a first career direction, complete one scoped project, and explain the evidence, limitations, and improvement steps to another engineer.')
g.section('The learning sequence')
g.table(['Layer','Build understanding','Keep one piece of evidence'],[
['01 / Foundations','Risk, systems, networking, Linux, Windows, identity, and cryptographic purpose.','A diagram explaining one request and its trust boundaries.'],
['02 / Technical depth','Discovery, assessment, web security, cloud controls, monitoring, and incident response.','A short lab note separating an observation from a conclusion.'],
['03 / Specialization','Explore wireless, malware analysis, threat intelligence, GRC, AI, or mobile/OT topics.','A small comparison of the work and prerequisites of two roles.'],
['04 / Professional evidence','Scope, report, remediate, retest, and communicate.','A reproducible project README with safe, sanitized artifacts.']], [88,214,CW-302])
g.section('Make your weekly rhythm sustainable')
g.para('Plan two reading sessions, one bounded practice session, and one short reflection. Progress means being able to explain and apply an idea, not just finishing a playlist.')
g.source('Start the guided path',SITE+'/#roadmap')

g.start('Your 12-week study plan','PLAN / ADAPT TO YOUR PACE','This is a suggested sequence, not a promise of job readiness in twelve weeks. Repeat a week whenever the evidence is still unclear.')
g.table(['Week','Focus','A useful output'],[
['01','Security mindset and written scope','CIA table and a one-page lab scope.'],['02','Networking and protocol reasoning','A DNS-to-HTTPS request diagram.'],['03','Linux, Windows, and safe lab setup','VM manifest and permissions explanation.'],['04','Identity and cryptography','Authentication vs. authorization comparison.'],['05','Reconnaissance and assessment','Synthetic service inventory and validation plan.'],['06','Web application boundaries','One authorized lab note and root-cause fix.'],['07','Monitoring and detection','A detection hypothesis and benign alternative.'],['08','Incident response and recovery','A synthetic timeline and handover.'],['09','Cloud and delivery controls','A least-privilege identity/pipeline review.'],['10','Compare two specializations','Role/task/skill evidence table.'],['11','Build one portfolio project','README, method, findings, and limitations.'],['12','Retest and communicate','Validated improvement and five-minute walkthrough.']], [54,190,CW-244])
g.lines('My weekly study windows and one adjustment to this plan',2)

g.start('Choose the work, then the title','CAREER COMPASS','Job titles vary. Compare daily tasks in current local postings and identify the practical evidence a reviewer would expect.')
g.table(['Direction','Typical question','First portfolio evidence'],[
['SOC analyst','Is this alert meaningful, and what should happen next?','Synthetic log analysis and a clear handover.'],['Application security','Which trust assumption fails, and how can a developer fix it?','A provider-lab finding with a root-cause fix and retest.'],['Penetration testing','What can a scoped assessment establish safely?','Rules of engagement and a bounded lab assessment.'],['Cloud security','Who can access what, and how is a change verified?','Identity review and a deployment-boundary diagram.'],['Incident response / DFIR','What happened, what is affected, and what evidence supports it?','Timeline, evidence register, and recovery criteria.'],['Cyber risk / GRC','Which risk needs an owned decision and control evidence?','Five-row risk register with owners and review dates.']], [110,194,CW-304])
g.box('Credentials are optional study structure','Check the issuer\'s current objectives, eligibility, maintenance, exam availability, and total cost before paying. A credential does not replace practical evidence or guarantee employment.')
g.source('Explore all career orientations',SITE+'/#careers')
g.source('NIST NICE career pathway resources','https://www.nist.gov/itl/applied-cybersecurity/nice/resources/cyber-careers')

g.start('Make your portfolio reviewable','PROJECT CHECKLIST','One narrow, reproducible project is a strong starting point. Use synthetic data or material you have explicit permission to publish.')
g.bullets(['State the problem, asset, objective, and authorized scope.','Document the environment, versions, assumptions, and safe setup.','Explain the method and why each observation matters.','Keep minimal evidence, with time, source, and confidence.','Separate findings from hypotheses and benign alternatives.','Propose mitigation and show a meaningful retest.','Remove credentials, personal records, and third-party solution secrets.','Write limitations and the next improvement you would make.'],check=True)
g.lines('My chosen project and the question it answers',2)
g.lines('Evidence a reviewer should be able to reproduce',3)
g.lines('One interview story: observation, decision, result, limitation',3)

g.start('Keep learning from original sources','READING SHELF & NEXT STEPS','Use the providers\' current material for depth. These links are references, not endorsements or promises of access, certification, or employment.')
for label,url in [
('Harvard CS50 - Introduction to Cybersecurity','https://cs50.harvard.edu/cybersecurity/'),('PortSwigger - Web Security Academy learning paths','https://portswigger.net/web-security/learning-paths'),('OverTheWire - Bandit','https://overthewire.org/wargames/bandit/'),('NIST - Cybersecurity Framework 2.0','https://www.nist.gov/cyberframework'),('OWASP - Web application risk awareness','https://owasp.org/www-project-top-ten/'),('Cyber Studio - Knowledge atlas',SITE+'/#reference/toolkit')]:g.source(label,url)
g.section('Five ideas to explain without jargon')
g.table(['Term','Explain it to a teammate'],[['Risk','Likelihood and consequence in a specific asset context.'],['Least privilege','Only the authority a task needs, for an appropriate lifetime.'],['Evidence','A traceable observation with source, time, and limitations.'],['Trust boundary','Where data or actions cross between different levels of authority.'],['Verification','A check that establishes whether the expected behavior actually occurs.']],[104,CW-104])
g.finish()

# 02: safe lab workbook
g=Guide('safe-cyber-lab-starter-workbook','Safe Cyber Lab Starter Workbook','Plan an isolated training environment and complete ten evidence-based beginner challenges.','02','#286950','#e9f5ef')
g.start('Build a lab you understand.','SAFE LAB STARTER WORKBOOK','A lab is a small system to administer, not just a collection of tools. Plan scope, connectivity, evidence, and cleanup before installing targets.')
g.box('Use a bounded environment','Use equipment you own, provider-hosted training labs, or an explicitly authorized environment. Keep personal data and real credentials out of deliberately vulnerable targets.')
g.table(['Network mode','What to investigate','Preflight question'],[['Internal virtual network','Guest-to-guest connectivity without unintended external access.','Can the target reach an unintended network?'],['Host-only','The host is part of the reachable environment.','Which host services become reachable?'],['NAT','Outbound access and inbound forwarding depend on the hypervisor.','Are there unintended outbound routes or forwards?'],['Bridged','A guest participates on the physical network.','Why would an intentionally vulnerable target need this?']],[108,218,CW-326])
g.para('Verify the exact behavior in your hypervisor\'s current documentation. A snapshot helps restore state; it does not isolate network traffic.')
g.lines('Scope owner, permitted targets, permitted actions, and stop conditions',3)

g.start('Your lab build plan','WORKSHEET / COMPLETE BEFORE PRACTICE','Choose supported images and a hypervisor compatible with your CPU architecture. Do not assume an old installation video matches a current host or guest.')
g.table(['Component','Record your choice'],[['Host / CPU architecture','________________________________________'],['Hypervisor and version','________________________________________'],['Learner image / official source','________________________________________'],['Target image / purpose / license','________________________________________'],['Network mode and allowed flows','________________________________________'],['Clean snapshot and recovery plan','________________________________________']],[185,CW-185])
g.section('Preflight checklist')
g.bullets(['Confirm the scope and target identity.','Check network adapters, routes, and exposure.','Use a dedicated lab profile and approved software sources.','Understand any shared folder, clipboard, or certificate-trust changes.','Define the minimum evidence and where it will be stored.','Record a stop condition and an owner to contact.','Plan cleanup and verify the lab returns to a known state.'],check=True)
g.lines('An allowed flow and a connection that must fail',2)

def challenge(num,title,task,evidence):
 g.box(f'{num:02d} / {title}',task+'<br/><font color="#667b80"><b>Keep:</b> '+evidence+'</font>')

g.start('Five foundation challenges','PRACTICE / CHALLENGES 01-05','Use Cyber Studio\'s browser simulations or a provider-hosted beginner environment. These tasks do not require testing a public target.')
challenge(1,'Read the synthetic workspace','Use pwd, ls, cd, and cat in the simulated terminal. Read the scope note.','Current directory, permitted files, and the authorization boundary.')
challenge(2,'Reason about isolation','Draw learner and target guests on an internal segment. Compare host-only, NAT, and bridged behavior.','One permitted flow and one unintended flow that must fail.')
challenge(3,'Interpret service observations','Review an open, a closed, and a filtered synthetic port observation.','Observation, confidence, and a justified next verification step.')
challenge(4,'Trace a normal request','In an approved beginner web lab, identify method, path, inputs, cookies, and response status.','Which inputs the server must verify rather than trust.')
challenge(5,'Compare injection boundaries','Read SQL injection and XSS material in the Academy. Compare interpreters and mitigations.','Two prevention-oriented regression-test descriptions.')
g.source('Open the field guide',SITE+'/#field')

g.start('Five application challenges','PRACTICE / CHALLENGES 06-10','Prioritize reasoning, evidence, and communication. Keep a short note about what your exercise cannot establish.')
challenge(6,'Review object ownership','Describe a fictional student-record endpoint and the access decision it needs.','One allowed request and one denied-access expectation.')
challenge(7,'Threat-model an upload','Map validation, filenames, storage permissions, executable paths, and downloads.','One file-boundary test and one authorization test.')
challenge(8,'Triage a sign-in sequence','Review the supplied synthetic sign-in and MFA-reset events.','A timeline, a benign explanation, and the next evidence to request.')
challenge(9,'Model an authentication throttle','Change the threshold in the local model; it sends no login requests.','A false-block tradeoff and an omitted real-world condition.')
challenge(10,'Write a responsible finding','Draft a scoped assessment report and private reporting plan.','Impact, evidence, mitigation, retest, and verified cleanup.')
g.source('Practice the sign-in investigation',SITE+'/#labs/triage')

g.start('Your experiment record','REUSABLE WORKSHEET','Use one record per small exercise. Distinguish what you expected from what the evidence actually shows.')
g.lines('Question, scope, target, and starting state',2)
g.lines('Expected observation and the assumption being tested',2)
g.lines('Observed evidence: source, time, result, and confidence',3)
g.lines('Benign alternative, limitation, and next verification step',2)
g.lines('Cleanup performed and how it was checked',2)
g.section('Original setup and practice references')
g.source('Kali Linux - virtualization documentation','https://www.kali.org/docs/virtualization/')
g.source('OWASP Juice Shop - project and deployment guidance','https://owasp.org/www-project-juice-shop/')
g.source('OverTheWire - Bandit beginner environment','https://overthewire.org/wargames/bandit/')
g.finish()

# 03: SOC investigation workbook
g=Guide('soc-investigation-workbook','SOC Investigation Workbook','Investigate a synthetic sign-in case, build a timeline, and produce a concise analyst handover.','03','#68509b','#f0edfc')
g.start('Follow the evidence.','SOC INVESTIGATION WORKBOOK','You are the first analyst to review a small sign-in sequence. Every account and address in this case is synthetic; the IP ranges are reserved for documentation.')
g.table(['UTC time','Account / source','Event'],[['09:40:11','alex / 192.0.2.10','Sign-in success'],['09:41:02','alex / 198.51.100.24','Sign-in failure'],['09:41:07','alex / 198.51.100.24','Sign-in failure'],['09:41:09','alex / 198.51.100.24','Sign-in failure'],['09:41:11','alex / 198.51.100.24','Sign-in success'],['09:42:03','alex / 198.51.100.24','MFA reset requested']],[70,210,CW-280])
g.box('What you know - and what you do not','A burst of failures, a later success, and a recovery-related action warrant investigation. The log alone does not confirm account compromise or show that an MFA reset completed.')
g.section('Start with four decisions')
g.bullets(['Preserve the original synthetic events and note the source and time zone.','Identify the affected account, time window, and observed actions.','List corroborating evidence and at least one benign explanation.','Follow an approved playbook for validation, escalation, and any containment.'])
g.source('Open the interactive case',SITE+'/#labs/triage')

g.start('Build a reliable timeline','WORKSHEET / OBSERVATIONS FIRST','Retain the original time representation. Record conversions, missing fields, and any uncertainty about clock synchronization.')
g.table(['Event time / source','Observation','What it establishes / limitation'],[['________________','________________________','________________________'],['________________','________________________','________________________'],['________________','________________________','________________________'],['________________','________________________','________________________'],['________________','________________________','________________________'],['________________','________________________','________________________']],[125,170,CW-295])
g.lines('Affected account, reviewed time window, and collected sources',2)
g.lines('Clock, time-zone, retention, or collection limitations',3)
g.box('An address is not a person','Shared networks, VPNs, proxies, and reassigned infrastructure complicate identity and location inferences. Do not attribute the behavior to a person from an IP address alone.')

g.start('Test competing explanations','ANALYSIS / AVOID A SINGLE-STORY CONCLUSION','Write what would support or weaken each hypothesis. Prefer evidence that could change your decision.')
g.table(['Hypothesis','Evidence to request','What could weaken it'],[['Legitimate recovery after password errors','User confirmation through a trusted route, device/session context, recovery outcome.','User denies activity, unfamiliar device, or suspicious follow-up actions.'],['Unauthorized account use','Identity, endpoint, session, and recovery logs; associated changes.','Verified normal device and workflow, with no conflicting evidence.'],['Incomplete or misleading collection','Audit configuration, raw source records, clock and parser checks.','Multiple independent sources agree on the same sequence.']],[140,200,CW-340])
g.lines('My current hypothesis, confidence, and the evidence supporting it',3)
g.lines('The next two questions and why their answers matter',3)
g.box('Keep authority and impact visible','Containment actions can interrupt legitimate work. State who may approve them, the intended scope, and how you would verify the outcome.')

g.start('Write the analyst handover','REUSABLE TEMPLATE','A teammate should be able to continue without guessing how you reached your conclusion.')
g.lines('1 / Summary: observed sequence, affected account, and time window',2)
g.lines('2 / Evidence: sources, key events, artifact locations, and integrity notes',2)
g.lines('3 / Assessment: hypothesis, confidence, and benign alternatives',3)
g.lines('4 / Actions taken: authority, time, scope, and verified outcome',2)
g.lines('5 / Next actions: owner, priority, evidence needed, and escalation',3)
g.box('Protect the handover','Use approved evidence storage. Share only the minimum necessary details with the appropriate audience. Never include real passwords or session tokens.')

g.start('A worked example to compare','REVIEW / ONE DEFENSIBLE ANSWER','Use this after completing your own handover. Other well-supported responses may also be reasonable.')
g.box('Example summary','Between 09:41:02 and 09:42:03 UTC, the synthetic account alex had repeated failed sign-ins, a success, and an MFA-reset request from 198.51.100.24. A prior success used another documentation address. The pattern requires validation; compromise is not confirmed.')
g.section('Reasoning and next steps')
g.bullets(['Verify the user and device through a trusted channel independent of the suspicious session.','Review session identifiers, authentication factors, reset outcome, endpoint context, and relevant follow-up changes.','Consider legitimate recovery, a shared network, and incomplete logging as alternatives.','Apply the organization\'s account-compromise playbook if evidence or policy requires escalation or containment.','Record who owns the next step and how success or continued risk will be checked.'])
g.section('Original references')
g.source('NIST SP 800-61 Rev. 3 - incident response','https://csrc.nist.gov/pubs/sp/800/61/r3/final')
g.source('MITRE ATT&CK - behavior vocabulary','https://attack.mitre.org/')
g.source('NIST SP 800-86 - forensic techniques','https://csrc.nist.gov/pubs/sp/800/86/final')
g.source('Build the portfolio version',SITE+'/#project/incident')
g.finish()

# 04: web project playbook
g=Guide('web-security-project-playbook','Web Security Project Playbook','A scoped testing method, prevention-first weakness map, and a reusable finding-report template.','04','#925632','#fff0e5')
g.start('Understand the boundary.\nExplain the fix.'.replace('\n','<br/>'),'WEB SECURITY PROJECT PLAYBOOK','Use an approved training environment to turn one finding into a useful engineering report. Learn the root cause, not just the tool action.')
g.table(['Step','Ask this question','Evidence to keep'],[['Observe','What is the normal request and intended behavior?','Method, path, relevant fields, account role, response.'],['Model','Which component is trusting which input or authority?','A small data-flow or ownership diagram.'],['Test','What one assumption does the authorized lab let me examine?','Minimal, sanitized request/response observations.'],['Explain','What impact follows, and what remains uncertain?','Root cause, affected boundary, and limits.'],['Fix and retest','How does the fix restore the intended rule?','Prevention control and a meaningful regression check.']],[83,200,CW-283])
g.box('Define the boundary before the tool','A hidden button, a client-side role check, or a user-supplied identifier is not server authorization. A browser, application server, database, and file store exercise different authority.')
g.lines('My approved target, test objective, scope, and stop conditions',3)
g.source('Start the project brief',SITE+'/#project/appsec')

g.start('A prevention-first weakness map','STUDY / DISTINGUISH THE ROOT CAUSES','This is a learning map, not a complete testing standard. Use maintained Academy material and the original project guidance for depth.')
g.table(['Weakness','Boundary failure','Control to evaluate'],[['SQL injection','Input is interpreted as query structure.','Parameterized queries and appropriately limited database authority.'],['Command injection','Input reaches an OS-command interpreter.','Avoid shell invocation; prefer a narrow library API and strict argument handling.'],['XSS / HTML injection','Input becomes executable script or unintended document structure.','Context-aware encoding, safe DOM APIs, and careful sanitization when HTML is allowed.'],['Broken access control','A user can act on an object or action beyond permission.','Server-side object and action authorization.'],['File upload','Untrusted files gain unsafe parsing, access, or execution behavior.','Content rules, limits, safe storage, and download authorization.'],['Path traversal','An input escapes the intended file boundary.','Canonical path handling and restricted file access.'],['CSRF','An authenticated browser is induced to submit an unintended action.','Request-origin protections appropriate to the application design.'],['SSRF','The server fetches an attacker-influenced destination with its authority.','Restricted destinations, protocols, and network access.']],[101,185,CW-286])
g.box('Control in context','A WAF, a scan result, a CSP, or input validation is not a universal substitute for fixing the failed trust assumption. Validate the specific operation and its authority.')

g.start('Write a small, meaningful test plan','WORKSHEET / EXPECTED VS. OBSERVED','Use synthetic users and records. Keep each test tied to a rule the application should enforce.')
g.table(['Feature / rule','Allowed behavior','Denied or constrained behavior'],[['Student record ownership','A student reads their own permitted record.','Another student\'s protected record is denied.'],['Role-limited change','An authorized role performs the documented update.','A lower-privilege role cannot invoke it directly.'],['Upload storage','An allowed training file is stored and retrieved safely.','Unexpected content, execution paths, or oversized input are constrained.'],['Expired session','The application applies its documented session policy.','An expired or revoked session cannot act as valid.'],['Structured data input','Input is processed as data in its intended context.','Input does not become query, shell, or script instructions.']],[142,180,CW-322])
g.lines('My selected feature, account role, object owner, and expected rule',3)
g.lines('Observed result, evidence reference, and remaining uncertainty',3)

g.start('Create a developer-friendly finding','REUSABLE REPORT TEMPLATE','Make the report actionable and reproducible without exposing private data or third-party lab secrets.')
g.lines('Title and summary: the failed rule and affected feature',2)
g.lines('Scope and setup: training target, identity, versions, assumptions',2)
g.lines('Evidence: minimal observations and a reproducible authorized method',3)
g.lines('Impact and limitations: established consequence vs. hypothesis',2)
g.lines('Mitigation and retest: root-cause fix, expected behavior, owner',3)
g.box('Close the loop','Validate the mitigation, remove temporary access and files, preserve the agreed evidence, and confirm cleanup. Report privately through the approved contact or provider process.')

g.start('Practice, report, and improve','ORIGINAL SOURCES / PROJECT CLOSEOUT','Use provider-hosted labs or a properly isolated environment. Providers set their own rules, account requirements, and availability.')
for label,url in [('PortSwigger - beginner guide','https://portswigger.net/web-security/getting-started'),('PortSwigger - vulnerability topics and labs','https://portswigger.net/web-security/all-topics'),('Burp Suite - official documentation','https://portswigger.net/burp/documentation'),('OWASP Juice Shop - project guidance','https://owasp.org/www-project-juice-shop/'),('OWASP - Top 10 risk awareness','https://owasp.org/www-project-top-ten/')]:g.source(label,url)
g.section('A project is ready to review when...')
g.bullets(['The scope and authorization are clear.','The root cause, evidence, and limitations are explained.','The mitigation has a meaningful retest.','Artifacts are sanitized, and cleanup has been checked.','The README supports a short walkthrough by another engineer.'],check=True)
g.source('Continue with the web testing modules',SITE+'/#lesson/webdepth/0')
g.finish()

(ROOT/'dist/downloads/manifest.json').write_text(json.dumps(DOCS,indent=2))
print(json.dumps(DOCS,indent=2))
