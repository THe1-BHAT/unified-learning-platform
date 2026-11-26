const fs = require('fs');
const path = require('path');

const projectRoot = path.resolve(__dirname, '..', '..');
const appDir = path.join(projectRoot, 'app');
const dataFile = path.join(projectRoot, 'source', 'data-mlops-studio', 'dist', 'data.json');
const resourcesFile = path.join(projectRoot, 'source', 'data-mlops-studio', 'dist', 'resources.json');

const d = JSON.parse(fs.readFileSync(dataFile, 'utf8'));
const r = JSON.parse(fs.readFileSync(resourcesFile, 'utf8'));

const moduleMeta = [
  {id: 'data-foundations', icon: 'layers', stage: 0, time: '60 min', skills: ['Data lifecycle', 'Ingestion', 'Business alignment'], sources: ['oreilly', 'databricks']},
  {id: 'data-architecture', icon: 'network', stage: 0, time: '60 min', skills: ['Lakehouse', 'Batch vs Stream', 'Microservices'], sources: ['databricks', 'oreilly']},
  {id: 'data-pipelines', icon: 'code', stage: 1, time: '75 min', skills: ['dbt', 'SQL modeling', 'ETL/ELT'], sources: ['dbt', 'oreilly']},
  {id: 'data-mlops', icon: 'activity', stage: 1, time: '75 min', skills: ['MLflow', 'Feature store', 'Model registry'], sources: ['mlflow', 'googlecloud']},
  {id: 'data-production', icon: 'spark', stage: 2, time: '90 min', skills: ['Airflow', 'DataOps', 'Monitoring'], sources: ['airflow', 'mlopsorg']}
];

let js = `/* Data Engineering & MLOps curriculum and resources merged from data-mlops-studio */\n`;
js += `Object.assign(R, {\n`;
js += `  oreilly: {title: 'O’Reilly · Fundamentals of Data Engineering (Reis & Housley)', url: 'https://www.oreilly.com/library/view/fundamentals-of-data/9781098108298/'},\n`;
js += `  mlopsorg: {title: 'MLOps.org · Continuous Delivery for Machine Learning', url: 'https://mlops.org/'},\n`;
js += `  databricks: {title: 'Databricks · Lakehouse Architecture Guide', url: 'https://www.databricks.com/glossary/data-lakehouse'},\n`;
js += `  airflow: {title: 'Apache Airflow · Documentation', url: 'https://airflow.apache.org/docs/'},\n`;
js += `  dbt: {title: 'dbt Labs · What is dbt?', url: 'https://www.getdbt.com/product/what-is-dbt'},\n`;
js += `  mlflow: {title: 'MLflow · Tracking & Model Registry', url: 'https://mlflow.org/'},\n`;
js += `  googlecloud: {title: 'Google Cloud · MLOps Architecture Guide', url: 'https://cloud.google.com/architecture/mlops-continuous-delivery-and-automation-pipelines-in-machine-learning'},\n`;
js += `  dataiku: {title: 'Introducing MLOps · O’Reilly & Dataiku', url: 'https://www.dataiku.com/resources/introducing-mlops/'}\n`;
js += `});\n\n`;

const dataModules = d.map((m, idx) => {
  const meta = moduleMeta[idx];
  const lessons = m.lessons.map((l, lIdx) => {
    // Form body
    let body = l.sections.map(s => `<b>${s.title}</b><p>${s.body}</p>`).join('');
    if (l.code) {
      body += `<p><b>Worked example</b></p><pre><code>${l.code}</code></pre><p>${l.codeCaption || ''}</p>`;
    }
    const qObj = m.quizzes && m.quizzes[lIdx] ? m.quizzes[lIdx] : {
      question: `Key concept check for ${l.title}`,
      options: ['Option A', 'Option B', 'Option C'],
      answer: 0,
      explanation: l.objective
    };
    return {
      title: l.title,
      body: body,
      principle: l.objective,
      exercise: l.activity,
      q: qObj.question,
      options: qObj.options,
      correct: qObj.answer,
      explanation: qObj.explanation
    };
  });

  return {
    id: meta.id,
    course: 'data',
    title: m.name,
    subtitle: m.description,
    stage: meta.stage,
    icon: meta.icon,
    time: meta.time,
    skills: meta.skills,
    sources: meta.sources,
    quizBank: m.quizzes.map(q => ({
      question: q.question,
      options: q.options,
      correct: q.answer,
      explanation: q.explanation
    })),
    lessons: lessons
  };
});

js += `const dataModules = ${JSON.stringify(dataModules, null, 2)};\n\n`;
js += `modules.push(...dataModules);\n\n`;

// Also extract Data & MLOps videos from resources.json
const dataVideos = r.filter(x => x.video).map((v, i) => {
  const modId = moduleMeta[v.module - 1].id;
  const topicMap = {
    1: 'Data Engineering & Pipelines',
    2: 'Data Engineering & Pipelines',
    3: 'MLOps & Model Lifecycle',
    4: 'MLOps & Model Lifecycle',
    5: 'Production & DataOps'
  };
  return {
    id: 'data-' + v.id,
    course: 'data',
    title: v.title,
    shortTitle: v.title.split(':')[0],
    provider: v.creator,
    subtitle: `${v.creator} · Module 0${v.module}`,
    video: v.video,
    topic: topicMap[v.module] || 'Data Engineering & Pipelines',
    format: 'Video Masterclass',
    edition: 'Industry standard',
    desc: v.desc,
    modules: [modId],
    notesUrl: v.url,
    notesLabel: `Watch on ${v.creator} ↗`,
    practice: `#lesson/${modId}/0`,
    activity: v.prompt,
    chapters: []
  };
});

js += `const dataVideos = ${JSON.stringify(dataVideos, null, 2)};\n`;
js += `videos.push(...dataVideos);\n`;

// Data resources
const dataResources = r.filter(x => !x.video && x.format !== 'PDF').map(item => {
  return {
    id: 'data-res-' + item.id,
    course: 'data',
    title: item.title,
    type: 'Reference',
    level: 'Core concept',
    desc: item.desc || (item.sections ? item.sections[0].body.slice(0, 140) + '...' : 'Data & MLOps reference guide.'),
    ref: 'oreilly',
    brief: item.id,
    creator: item.creator,
    url: item.url,
    sections: item.sections || []
  };
});

js += `const dataResources = ${JSON.stringify(dataResources, null, 2)};\n`;
js += `resources.push(...dataResources);\n`;

// Export Data curriculum stages
const dataStages = [
  {
    id: 'data-stage-1',
    course: 'data',
    title: 'Data foundations & architectural design',
    short: 'Foundations',
    tone: 'mint',
    label: 'STAGE 01 · DATA BASE',
    modules: ['data-foundations', 'data-architecture'],
    before: 'Basic programming familiarity (Python/SQL). Curiosity for data systems.',
    goal: 'Understand the data engineering lifecycle, storage tiers, lakehouses, and batch vs. stream tradeoffs.',
    outcome: 'An end-to-end data lifecycle diagram with storage checkpoints.',
    checkpoint: 'Can you explain the difference between a data warehouse and a data lakehouse in your own words?',
    practice: '#labs/pipeline',
    practiceLabel: 'Try the Pipeline Lab ordering exercise',
    videos: ['data-etl', 'data-lake', 'data-micro'],
    pdf: 'data-mlops-course-guide'
  },
  {
    id: 'data-stage-2',
    course: 'data',
    title: 'Transformations, MLOps & model pipelines',
    short: 'Pipelines',
    tone: 'sky',
    label: 'STAGE 02 · MODEL LIFECYCLE',
    modules: ['data-pipelines', 'data-mlops'],
    before: 'Completed stage 01. Understand storage formats and SQL basics.',
    goal: 'Build modular dbt transformation models, track experiments with MLflow, and design feature stores.',
    outcome: 'A reproducible dbt model specification and an MLflow experiment tracking plan.',
    checkpoint: 'Why do data teams transform data inside the warehouse (ELT) rather than before loading (ETL)?',
    practice: '#project/mlops-pipeline',
    practiceLabel: 'Open the MLOps pipeline project brief',
    videos: ['data-mlops', 'data-cloud', 'data-tracking'],
    pdf: 'data-mlops-study-companion'
  },
  {
    id: 'data-stage-3',
    course: 'data',
    title: 'Production orchestration, DataOps & governance',
    short: 'Production',
    tone: 'gold',
    label: 'STAGE 03 · PRODUCTION',
    modules: ['data-production'],
    before: 'Completed stage 02. Understand pipelines and model lifecycle.',
    goal: 'Automate workflows with Apache Airflow DAGs, monitor data quality, and prevent model drift in production.',
    outcome: 'A production DAG design with automated data quality assertions and alerting.',
    checkpoint: 'What happens when upstream data schemas change without contracts, and how does DataOps protect downstream models?',
    practice: '#labs',
    practiceLabel: 'Explore the project workbook',
    videos: ['data-governance', 'data-best', 'data-tracking'],
    pdf: 'data-mlops-project-workbook'
  }
];

js += `\nconst dataLearningPhases = ${JSON.stringify(dataStages, null, 2)};\n`;
js += `learningPhases.push(...dataLearningPhases);\n`;
js += `guidedModuleIds.push(...dataLearningPhases.flatMap(p => p.modules));\n`;

const dataProjects = [
  {
    id: 'mlops-pipeline',
    title: 'Design your own MLOps pipeline',
    type: 'MLOps portfolio project',
    icon: 'layers',
    desc: 'Design an end-to-end reproducible machine learning workflow from ingestion to deployment.',
    deliverables: [
      'Define business objective, data sources, and SLA requirements.',
      'Design schema validation, feature engineering, and feature store interface.',
      'Specify model training, experiment tracking with MLflow, and versioning.',
      'Plan evaluation metrics, fairness checks, and pre-deployment gates.',
      'Produce an architecture diagram and CI/CD deployment plan with drift alerts.'
    ]
  },
  {
    id: 'mlops-tool',
    title: 'Explore an MLOps platform & tool',
    type: 'Data engineering portfolio project',
    icon: 'terminal',
    desc: 'Deep dive into MLflow, Airflow, or Kubeflow with an evaluation and comparison case study.',
    deliverables: [
      'Compare platform features, self-hosted vs managed tradeoffs, and setup costs.',
      'Configure or prototype a minimal DAG or tracking run with synthetic data.',
      'Document artifact storage, model registry lifecycle, and access control.',
      'Formulate monitoring rules for data drift and concept drift.',
      'Write an engineering assessment report with recommendations and limitations.'
    ]
  }
];
js += `\nconst dataProjects = ${JSON.stringify(dataProjects, null, 2)};\nprojects.push(...dataProjects);\n`;

const dataRoles = [
  {
    id: 'dataengineer',
    title: 'Data engineer',
    tag: 'DATA INFRASTRUCTURE',
    icon: 'layers',
    modules: ['data-foundations','data-architecture','data-pipelines'],
    project: 'mlops-pipeline',
    credential: 'oreilly',
    daily: 'Design and maintain robust batch and streaming data pipelines, schemas, and warehouse models.',
    desc: 'Design and maintain robust batch and streaming data pipelines, schemas, and warehouse models.',
    skills: ['Data lifecycle', 'Lakehouse', 'SQL / dbt', 'Orchestration'],
    milestones: [
      'Build core data engineering, storage, and SQL foundations.',
      'Practice building pipeline models and automated DAGs.',
      'Produce an end-to-end data pipeline specification with quality assertions.',
      'Prepare for data platform and pipeline engineering roles.'
    ]
  },
  {
    id: 'mlopsengineer',
    title: 'MLOps engineer',
    tag: 'MACHINE LEARNING OPERATIONS',
    icon: 'spark',
    modules: ['data-pipelines','data-mlops','data-production'],
    project: 'mlops-pipeline',
    credential: 'mlopsorg',
    daily: 'Automate model deployment, manage feature stores, track experiments, and prevent production drift.',
    desc: 'Automate model deployment, manage feature stores, track experiments, and prevent production drift.',
    skills: ['MLflow', 'Feature Stores', 'CI/CD for ML', 'Model Monitoring'],
    milestones: [
      'Understand the continuous delivery lifecycle for machine learning.',
      'Implement tracking, artifact versioning, and feature stores.',
      'Design automated evaluation gates and deployment workflows.',
      'Build automated drift detection and retraining triggers.'
    ]
  },
  {
    id: 'analyticsengineer',
    title: 'Analytics engineer',
    tag: 'MODERN DATA STACK',
    icon: 'code',
    modules: ['data-foundations','data-pipelines'],
    project: 'mlops-pipeline',
    credential: 'dbt',
    daily: 'Transform raw data with dbt, build dimensional models, and ensure data quality contracts.',
    desc: 'Transform raw data with dbt, build dimensional models, and ensure data quality contracts.',
    skills: ['dbt', 'Data Modeling', 'Data Contracts', 'Testing'],
    milestones: [
      'Learn modular transformation and dimensional modeling principles.',
      'Build testing suites and automated schema validation.',
      'Collaborate with data analysts and engineers on serving layers.',
      'Establish semantic layers and business metric definitions.'
    ]
  }
];
js += `\nconst dataRoles = ${JSON.stringify(dataRoles, null, 2)};\nroles.push(...dataRoles);\n`;

fs.writeFileSync(path.join(appDir, 'dist', 'data-mlops-content.js'), js);
console.log('Successfully written data-mlops-content.js with 5 modules, 20 lessons, 8 videos, and 3 learning stages!');
