/* Data Engineering & MLOps curriculum and resources merged from data-mlops-studio */
Object.assign(R, {
  oreilly: {title: 'O’Reilly · Fundamentals of Data Engineering (Reis & Housley)', url: 'https://www.oreilly.com/library/view/fundamentals-of-data/9781098108298/'},
  mlopsorg: {title: 'MLOps.org · Continuous Delivery for Machine Learning', url: 'https://mlops.org/'},
  databricks: {title: 'Databricks · Lakehouse Architecture Guide', url: 'https://www.databricks.com/glossary/data-lakehouse'},
  airflow: {title: 'Apache Airflow · Documentation', url: 'https://airflow.apache.org/docs/'},
  dbt: {title: 'dbt Labs · What is dbt?', url: 'https://www.getdbt.com/product/what-is-dbt'},
  mlflow: {title: 'MLflow · Tracking & Model Registry', url: 'https://mlflow.org/'},
  googlecloud: {title: 'Google Cloud · MLOps Architecture Guide', url: 'https://cloud.google.com/architecture/mlops-continuous-delivery-and-automation-pipelines-in-machine-learning'},
  dataiku: {title: 'Introducing MLOps · O’Reilly & Dataiku', url: 'https://www.dataiku.com/resources/introducing-mlops/'}
});

const dataModules = [
  {
    "id": "data-foundations",
    "course": "data",
    "title": "Data engineering foundations",
    "subtitle": "Understand the people, systems and lifecycle behind useful data.",
    "stage": 0,
    "icon": "layers",
    "time": "60 min",
    "skills": [
      "Data lifecycle",
      "Ingestion",
      "Business alignment"
    ],
    "sources": [
      "oreilly",
      "databricks"
    ],
    "quizBank": [
      {
        "question": "Which concern spans the entire data engineering lifecycle?",
        "options": [
          "Security and data management",
          "Only chart design",
          "Only model tuning"
        ],
        "correct": 0,
        "explanation": "Security and data management affect every stage, from source access to serving and retention."
      },
      {
        "question": "Which role most directly owns a dependable ingestion and transformation system?",
        "options": [
          "Data engineer",
          "Only a graphic designer",
          "Only the model end user"
        ],
        "correct": 0,
        "explanation": "Data engineers build and operate systems that make data reliably available to consumers."
      },
      {
        "question": "A daily report arrives late even though its rows are correct. Which quality concern failed?",
        "options": [
          "Uniqueness",
          "Freshness",
          "Encoding"
        ],
        "correct": 1,
        "explanation": "Freshness concerns whether data is available within the time window required by its consumers."
      },
      {
        "question": "A source sends the same batch twice after a timeout. What helps prevent duplicate output?",
        "options": [
          "A random output filename each time",
          "An idempotent load using stable keys",
          "Deleting every historical record"
        ],
        "correct": 1,
        "explanation": "Stable identifiers and idempotent operations let a retry produce the same intended result."
      },
      {
        "question": "Which is a business responsibility of a data engineer?",
        "options": [
          "Clarifying which decision the data should support",
          "Choosing tools without requirements",
          "Ignoring downstream consumers"
        ],
        "correct": 0,
        "explanation": "Business context connects technical work to a useful outcome and defines practical service expectations."
      },
      {
        "question": "A new column appears upstream. What is the best first response?",
        "options": [
          "Automatically treat all values as valid",
          "Evaluate schema compatibility and downstream expectations",
          "Disable all tests permanently"
        ],
        "correct": 1,
        "explanation": "A schema change needs to be assessed against contracts and consumers before it is accepted."
      },
      {
        "question": "Which activity belongs to the wider data lifecycle?",
        "options": [
          "Only calculating a model score",
          "Retention and eventual deletion",
          "Only building a chart"
        ],
        "correct": 1,
        "explanation": "Data persists beyond transformation and serving; retention and deletion are part of its wider lifecycle."
      },
      {
        "question": "Which workload is a reasonable starting point for scheduled batch ingestion?",
        "options": [
          "A report required once each morning",
          "A strict sub-second alerting requirement",
          "Every workload without considering latency"
        ],
        "correct": 0,
        "explanation": "Scheduled batch processing can fit daily reporting when the freshness requirement allows it."
      },
      {
        "question": "Why document a dataset owner?",
        "options": [
          "To avoid writing schemas",
          "To make responsibility and incident response clear",
          "To guarantee the data never changes"
        ],
        "correct": 1,
        "explanation": "An owner is accountable for expectations, changes and coordination when issues occur."
      },
      {
        "question": "A duplicate-key SQL query returns rows. What should happen before publishing?",
        "options": [
          "Ignore the result because the script ran",
          "Investigate or quarantine the duplicates according to the contract",
          "Declare the dataset unique"
        ],
        "correct": 1,
        "explanation": "The query identifies a contract violation that needs an explicit response before promotion."
      }
    ],
    "lessons": [
      {
        "title": "The data engineering landscape",
        "body": "<b>The core idea</b><p>Data engineering designs, builds and operates systems that turn raw data into reliable, usable data. Data science often uses that data for analysis and prediction; engineering makes the inputs accessible and dependable.</p><b>Roles change with context</b><p>A small team may need one generalist to own ingestion, storage and analytics. A larger organization may separate platform, analytics and infrastructure responsibilities. Data maturity describes how consistently an organization manages and uses its data.</p><b>Business meets engineering</b><p>Clarify the decision the data will support, who owns it and when it must arrive. Technical responsibilities include modeling, orchestration, quality, security and operations. A technically impressive pipeline has little value if it misses the business need.</p>",
        "principle": "Define data engineering and distinguish engineering responsibilities from data science.",
        "exercise": "Choose a campus use case. List its data producers, consumers and one business question.",
        "q": "Which concern spans the entire data engineering lifecycle?",
        "options": [
          "Security and data management",
          "Only chart design",
          "Only model tuning"
        ],
        "correct": 0,
        "explanation": "Security and data management affect every stage, from source access to serving and retention."
      },
      {
        "title": "Follow the data lifecycle",
        "body": "<b>From source to use</b><p>Operational applications, devices and external services generate data. Engineers ingest it, choose suitable storage, transform it and serve it to downstream consumers. The wider data lifecycle also includes retention and eventual deletion.</p><b>Batch or continuous</b><p>A daily enrollment report can use scheduled batch ingestion. A live service may need streaming updates. Select the arrival pattern from latency and correctness needs rather than tool popularity.</p><b>The undercurrents</b><p>Security, data management, DataOps, architecture, orchestration and software engineering span the lifecycle. For example, a change to a source schema can require updates to contracts, tests, permissions and downstream models.</p>",
        "principle": "Trace data from generation to serving and identify lifecycle undercurrents.",
        "exercise": "Draw a source → ingestion → storage → transformation → serving flow. Add quality and ownership checkpoints.",
        "q": "Which role most directly owns a dependable ingestion and transformation system?",
        "options": [
          "Data engineer",
          "Only a graphic designer",
          "Only the model end user"
        ],
        "correct": 0,
        "explanation": "Data engineers build and operate systems that make data reliably available to consumers."
      },
      {
        "title": "Skills, ownership and trade-offs",
        "body": "<b>Start with responsibility</b><p>For every dataset, identify an owner, consumers, expected freshness and a recovery plan. Ownership helps teams resolve incidents without guessing who should act.</p><b>Build a balanced skill set</b><p>SQL, programming and data modeling support implementation. Communication, requirements analysis and prioritization connect those skills to business needs. Operational habits make the system dependable over time.</p><b>Assess maturity</b><p>A team using manual exports needs different improvements from a team operating governed, automated pipelines. Choose the next reliable step and document the trade-off.</p>",
        "principle": "Connect team maturity and responsibilities with practical engineering choices.",
        "exercise": "Write a dataset contract with its owner, schema, freshness expectation and failure response.",
        "q": "A daily report arrives late even though its rows are correct. Which quality concern failed?",
        "options": [
          "Uniqueness",
          "Freshness",
          "Encoding"
        ],
        "correct": 1,
        "explanation": "Freshness concerns whether data is available within the time window required by its consumers."
      },
      {
        "title": "SQL checks, contracts & safe retries",
        "body": "<b>Specify the contract</b><p>For an orders table, define order_id as a unique non-null key, amount as a non-negative number and event_time as a timestamp. Record the source owner, freshness target and the action to take when a rule fails. A schema check alone cannot tell you whether the values are meaningful.</p><b>Inspect before publishing</b><p>Count rows, null keys and duplicate keys before loading the serving table. Compare the row count with a sensible reference window. Quarantine unexpected records for investigation rather than silently discarding them. The thresholds below are illustrative; choose them from your business requirements.</p><b>Make retries safe</b><p>A retry may read the same batch twice. Use stable event identifiers and an idempotent merge so the second attempt does not duplicate orders. Store the input partition and completion status, then make backfills explicit. A successful task should mean the expected data was published, not just that a script exited.</p><p><b>Worked example</b></p><pre><code>SELECT order_id, COUNT(*) AS copies\nFROM orders\nGROUP BY order_id\nHAVING COUNT(*) > 1;\n\nSELECT COUNT(*) AS missing_keys\nFROM orders\nWHERE order_id IS NULL;</code></pre><p>Illustrative SQL: a duplicate-key query should return no rows before promotion.</p>",
        "principle": "Turn quality expectations into checks that a pipeline can run.",
        "exercise": "Write three SQL checks for an orders dataset, then explain how your load avoids duplicates when the job retries.",
        "q": "A source sends the same batch twice after a timeout. What helps prevent duplicate output?",
        "options": [
          "A random output filename each time",
          "An idempotent load using stable keys",
          "Deleting every historical record"
        ],
        "correct": 1,
        "explanation": "Stable identifiers and idempotent operations let a retry produce the same intended result."
      }
    ]
  },
  {
    "id": "data-architecture",
    "course": "data",
    "title": "Data architecture & technology",
    "subtitle": "Make architecture decisions around reliability, coupling and business value.",
    "stage": 0,
    "icon": "network",
    "time": "60 min",
    "skills": [
      "Lakehouse",
      "Batch vs Stream",
      "Microservices"
    ],
    "sources": [
      "databricks",
      "oreilly"
    ],
    "quizBank": [
      {
        "question": "What belongs in total cost of ownership?",
        "options": [
          "Only the monthly service invoice",
          "Development, operations and training as well as service costs",
          "Only initial setup time"
        ],
        "correct": 1,
        "explanation": "Total cost of ownership accounts for the effort and expense of operating the system over its life."
      },
      {
        "question": "Why use a stable interface between services?",
        "options": [
          "To hide every failure",
          "To reduce dependence on implementation details",
          "To remove all coordination"
        ],
        "correct": 1,
        "explanation": "Stable interfaces can reduce coupling, although distributed systems still require coordination and operations."
      },
      {
        "question": "What should an architecture decision record include?",
        "options": [
          "Only the final product name",
          "Context, alternatives, consequences and a review trigger",
          "Only the monthly bill"
        ],
        "correct": 1,
        "explanation": "A decision record makes the reasoning and conditions behind an architecture choice reviewable."
      },
      {
        "question": "What is a practical cost of introducing many microservices?",
        "options": [
          "They eliminate all deployment work",
          "Additional coordination and operational complexity",
          "They make failures impossible"
        ],
        "correct": 1,
        "explanation": "Service boundaries may enable independence but also introduce network, observability and operational work."
      },
      {
        "question": "Which design directly acknowledges partial failure?",
        "options": [
          "Assuming every network call succeeds",
          "Timeouts, bounded retries and recovery paths",
          "Removing error handling"
        ],
        "correct": 1,
        "explanation": "Distributed components may fail independently; designs need explicit behavior for those failures."
      },
      {
        "question": "Hybrid cloud generally combines…",
        "options": [
          "Local infrastructure and cloud environments",
          "Two tables in one database",
          "Only two branches in Git"
        ],
        "correct": 0,
        "explanation": "Hybrid cloud connects on-premises or private infrastructure with public-cloud environments."
      },
      {
        "question": "Why consider team capability before choosing a tool?",
        "options": [
          "Operating and maintaining it is part of the design cost",
          "Tools never require learning",
          "It removes the need for reliability"
        ],
        "correct": 0,
        "explanation": "A tool has to fit the skills and operational capacity of the people who will run it."
      },
      {
        "question": "What is a workflow DAG used to represent?",
        "options": [
          "Dependencies between tasks without directed cycles",
          "Only a model accuracy score",
          "A list of passwords"
        ],
        "correct": 0,
        "explanation": "A directed acyclic graph expresses task dependencies and valid ordering in a workflow."
      },
      {
        "question": "A data lake stores raw files. What is still needed?",
        "options": [
          "Nothing; files govern themselves",
          "Metadata, access control and quality management",
          "A guarantee that every query is fast"
        ],
        "correct": 1,
        "explanation": "Storage alone does not make data understandable, trustworthy or appropriately accessible."
      },
      {
        "question": "A daily batch design must now support a five-second freshness target. What should the team do?",
        "options": [
          "Revisit the architecture against the new requirement",
          "Ignore the changed requirement",
          "Rename the existing job"
        ],
        "correct": 0,
        "explanation": "A changed service expectation is a reason to reassess the architecture and its trade-offs."
      }
    ],
    "lessons": [
      {
        "title": "Principles of good architecture",
        "body": "<b>Architecture has a purpose</b><p>Enterprise architecture connects business processes and technology. Data architecture describes how data is collected, stored, transformed and used within that larger system.</p><b>Design for change</b><p>Prefer clear interfaces, explicit ownership and components that can evolve without forcing every other component to change. Document the assumptions behind each choice.</p><b>Design for failure</b><p>Distributed components can fail independently. Plan retries, timeouts, idempotent writes and recovery paths. Reliability is a design concern, not only an operations concern.</p>",
        "principle": "Connect enterprise goals with data architecture decisions.",
        "exercise": "Sketch an architecture for attendance analytics. Annotate one failure mode and its recovery path.",
        "q": "What belongs in total cost of ownership?",
        "options": [
          "Only the monthly service invoice",
          "Development, operations and training as well as service costs",
          "Only initial setup time"
        ],
        "correct": 1,
        "explanation": "Total cost of ownership accounts for the effort and expense of operating the system over its life."
      },
      {
        "title": "Coupling, services and scale",
        "body": "<b>Coupling creates obligations</b><p>Tightly coupled components depend on each other's implementation or availability. Loose coupling uses stable interfaces and can reduce the impact of change, but often adds operational complexity.</p><b>Pick a sensible boundary</b><p>A monolith may be easier for a small team to build and operate. Services allow independent development and scaling when boundaries and ownership are clear. Neither structure is universally best.</p><b>Scaling is multidimensional</b><p>Consider data volume, request rates, latency and the number of independent teams. Partitioning and asynchronous communication help some workloads but introduce consistency and coordination trade-offs.</p>",
        "principle": "Compare monoliths, tiers and microservices in a data system.",
        "exercise": "Compare a shared-database monolith with event-connected services using cost, reliability and team effort.",
        "q": "Why use a stable interface between services?",
        "options": [
          "To hide every failure",
          "To reduce dependence on implementation details",
          "To remove all coordination"
        ],
        "correct": 1,
        "explanation": "Stable interfaces can reduce coupling, although distributed systems still require coordination and operations."
      },
      {
        "title": "Choose technology deliberately",
        "body": "<b>Fit before fashion</b><p>Evaluate team size, skills, delivery speed, operational burden and compatibility with existing systems. A tool the team can operate well may outperform a more fashionable alternative.</p><b>Look beyond the bill</b><p>Total cost of ownership includes development, maintenance, training, data transfer and incident response. Tie spending to the business outcome and expected service levels.</p><b>Cloud choices</b><p>Hybrid cloud combines local and cloud environments; multicloud uses more than one cloud provider. Both can address constraints but add integration and governance work. Distinguish durable architectural principles from rapidly changing tools.</p>",
        "principle": "Evaluate technology choices using team capability, cost and interoperability.",
        "exercise": "Create a decision record comparing two storage options. State assumptions and a condition that would change your decision.",
        "q": "What should an architecture decision record include?",
        "options": [
          "Only the final product name",
          "Context, alternatives, consequences and a review trigger",
          "Only the monthly bill"
        ],
        "correct": 1,
        "explanation": "A decision record makes the reasoning and conditions behind an architecture choice reviewable."
      },
      {
        "title": "Write an architecture decision record",
        "body": "<b>State the workload</b><p>A fictional retailer needs a daily sales report by 08:00 and a weekly model-training dataset. Begin with a batch design because the requirement does not call for sub-second data. Record volume, privacy constraints, failure tolerance and expected growth before selecting services.</p><b>Choose and compare</b><p>Compare an analytical warehouse with files in object storage plus a query engine. Consider schema evolution, query patterns, access control, operational effort and cost. A lake stores varied data; it still needs metadata, quality and lifecycle management to remain usable.</p><b>Make the decision revisitable</b><p>An architecture decision record captures context, options, decision, consequences and a review trigger. For orchestration, represent extract, validate, transform and publish as tasks with dependencies. Airflow represents workflows as directed acyclic graphs; task retries still require idempotent data operations.</p><p><b>Worked example</b></p><pre><code>Context: daily report, ready by 08:00\nDecision: scheduled batch ingestion\nQuality gate: schema + keys + freshness\nRecovery: retry the same partition safely\nReview trigger: freshness needs fall below 5 minutes</code></pre><p>Illustrative architecture decision outline, not a product recommendation.</p>",
        "principle": "Justify a storage and orchestration design with explicit trade-offs.",
        "exercise": "Write a one-page decision record for the retailer. Include a rejected option, an outage scenario and a trigger for reassessing the design.",
        "q": "What is a practical cost of introducing many microservices?",
        "options": [
          "They eliminate all deployment work",
          "Additional coordination and operational complexity",
          "They make failures impossible"
        ],
        "correct": 1,
        "explanation": "Service boundaries may enable independence but also introduce network, observability and operational work."
      }
    ]
  },
  {
    "id": "data-pipelines",
    "course": "data",
    "title": "MLOps & model development",
    "subtitle": "Move from a promising experiment to a reproducible, risk-aware workflow.",
    "stage": 1,
    "icon": "code",
    "time": "75 min",
    "skills": [
      "dbt",
      "SQL modeling",
      "ETL/ELT"
    ],
    "sources": [
      "dbt",
      "oreilly"
    ],
    "quizBank": [
      {
        "question": "Which practice best supports reproducibility?",
        "options": [
          "Saving only the final accuracy",
          "Recording data, code, environment and parameters",
          "Renaming the model file each time"
        ],
        "correct": 1,
        "explanation": "Reproducing a run requires its inputs and environment, not just its final score."
      },
      {
        "question": "Which is an example of target leakage in churn prediction?",
        "options": [
          "Account age before the prediction date",
          "A cancellation flag recorded after the prediction date",
          "Usage measured before the prediction date"
        ],
        "correct": 1,
        "explanation": "A future cancellation flag would not be available when making the intended prediction."
      },
      {
        "question": "When should a scaler learn its parameters?",
        "options": [
          "From the training partition only",
          "From the combined training and test partitions",
          "From future production labels"
        ],
        "correct": 0,
        "explanation": "Fit preprocessing on training data and reuse the learned transformation on held-out data."
      },
      {
        "question": "Why compare against a simple baseline?",
        "options": [
          "To establish whether added complexity is useful",
          "To avoid evaluating the candidate",
          "To guarantee the baseline is always best"
        ],
        "correct": 0,
        "explanation": "A baseline provides context for judging improvements and the cost of additional complexity."
      },
      {
        "question": "Which record is an experiment parameter?",
        "options": [
          "A learning-rate setting",
          "A validation error measured after training",
          "An exported plot"
        ],
        "correct": 0,
        "explanation": "Parameters describe configuration; metrics record measurements and artifacts store output files."
      },
      {
        "question": "Which record is an experiment artifact?",
        "options": [
          "A saved feature-importance plot",
          "Only a scalar learning rate",
          "Only an experiment name"
        ],
        "correct": 0,
        "explanation": "Artifacts can include files such as plots, models and environment specifications."
      },
      {
        "question": "A model has 99% accuracy on a highly imbalanced dataset. What should you do?",
        "options": [
          "Assume it is ready for production",
          "Inspect class-specific metrics and error patterns",
          "Discard the test labels"
        ],
        "correct": 1,
        "explanation": "Accuracy alone can hide poor performance on a small but important class."
      },
      {
        "question": "Do random seeds always guarantee identical results across hardware?",
        "options": [
          "Yes, in every library and environment",
          "No; document the environment and expected variability",
          "Seeds make versioning unnecessary"
        ],
        "correct": 1,
        "explanation": "Hardware, libraries and nondeterministic operations can affect reproducibility despite fixed seeds."
      },
      {
        "question": "What is MLflow Tracking primarily useful for in an experiment?",
        "options": [
          "Recording run metadata, metrics and artifacts",
          "Automatically eliminating every data leak",
          "Replacing every production monitor"
        ],
        "correct": 0,
        "explanation": "Tracking makes run inputs and outputs reviewable, but evaluation design and operations remain your responsibility."
      },
      {
        "question": "Which is a sound model-development starting point?",
        "options": [
          "Choose the largest model before defining the task",
          "Define intended use, prediction target and evaluation criteria",
          "Optimize only the training score"
        ],
        "correct": 1,
        "explanation": "A clear objective and evaluation plan give the modeling work a meaningful target."
      }
    ],
    "lessons": [
      {
        "title": "Why MLOps exists",
        "body": "<b>More than a trained model</b><p>A useful ML system needs data, code, runtime environments, evaluation and operational ownership. A good offline score alone does not establish production readiness.</p><b>Recognize risk</b><p>Risks include unreliable inputs, irreproducible experiments, inappropriate use and performance changes after deployment. Assess likelihood and impact, then define controls and owners.</p><b>Responsible development</b><p>Document intended use and limitations. Examine error patterns across relevant groups and use cases. Decide when a person must review a result or stop a deployment.</p>",
        "principle": "Identify model lifecycle risks and the role of MLOps.",
        "exercise": "Make a risk register for a house-price model with three risks, their impacts and proposed controls.",
        "q": "Which practice best supports reproducibility?",
        "options": [
          "Saving only the final accuracy",
          "Recording data, code, environment and parameters",
          "Renaming the model file each time"
        ],
        "correct": 1,
        "explanation": "Reproducing a run requires its inputs and environment, not just its final score."
      },
      {
        "title": "From objective to features",
        "body": "<b>Define success first</b><p>Translate a business question into a prediction target, an evaluation metric and an acceptable error range. Include a simple baseline so a complex model must justify its added effort.</p><b>Explore before training</b><p>Inspect missing values, outliers, distributions, time boundaries and target quality. Split data to reflect how future predictions will be made; keep evaluation data out of feature selection.</p><b>Engineer with care</b><p>Encoding, scaling, aggregation and domain-derived features can help. Avoid target leakage: a feature unavailable at prediction time can create misleading evaluation results.</p>",
        "principle": "Connect business objectives, exploration and feature selection.",
        "exercise": "For churn prediction, propose three features available before the prediction date and one leakage feature to exclude.",
        "q": "Which is an example of target leakage in churn prediction?",
        "options": [
          "Account age before the prediction date",
          "A cancellation flag recorded after the prediction date",
          "Usage measured before the prediction date"
        ],
        "correct": 1,
        "explanation": "A future cancellation flag would not be available when making the intended prediction."
      },
      {
        "title": "Reproducible training & evaluation",
        "body": "<b>An experiment is a record</b><p>Track dataset version, code revision, dependency versions, parameters, random seeds and metrics. Store the resulting model artifact with the experiment that produced it.</p><b>Compare appropriate baselines</b><p>Select algorithms for the target, data and operational constraints. Compare with consistent splits and metrics. Accuracy alone may hide important error patterns on imbalanced data.</p><b>Reproduction has limits</b><p>Seeds help but may not guarantee bit-for-bit results across hardware and libraries. Document expected variability and verify that the relevant conclusions remain stable.</p>",
        "principle": "Record the inputs and artifacts required to repeat an experiment.",
        "exercise": "Design an experiment log that another student could use to reproduce your baseline.",
        "q": "When should a scaler learn its parameters?",
        "options": [
          "From the training partition only",
          "From the combined training and test partitions",
          "From future production labels"
        ],
        "correct": 0,
        "explanation": "Fit preprocessing on training data and reuse the learned transformation on held-out data."
      },
      {
        "title": "Track an experiment with MLflow",
        "body": "<b>Give each run an identity</b><p>A run connects a candidate model to its parameters, metrics and artifacts. Choose an experiment name, record the code revision and dataset identifier, and log the evaluation metric. These records make comparisons reviewable; they do not guarantee that the underlying evaluation design is sound.</p><b>Separate artifacts from numbers</b><p>Metrics such as validation MAE describe measured behavior. Parameters record configuration. Artifacts include plots, feature lists, environment specifications and model files. Keep confidential data out of logs and restrict access to tracking storage.</p><b>Use tracking with a good split</b><p>Fit preprocessing on the training partition only, then apply it to validation data. MLflow can log an experiment, but it will not automatically prevent leakage in your feature construction. The minimal example below illustrates logging; it does not train or validate a real model.</p><p><b>Worked example</b></p><pre><code>import mlflow\n\nmlflow.set_experiment(\"house-price-baseline\")\nwith mlflow.start_run():\n    mlflow.log_param(\"dataset_version\", \"demo-v1\")\n    mlflow.log_param(\"split_strategy\", \"time-based\")\n    mlflow.log_metric(\"validation_mae\", 42000.0)</code></pre><p>Illustrative logging example. The metric is fictional. Install and configure MLflow separately to run it.</p>",
        "principle": "Map experiment metadata to a minimal tracking workflow.",
        "exercise": "Design two comparable training runs. List what remains fixed, what changes and which artifacts a reviewer needs.",
        "q": "Why compare against a simple baseline?",
        "options": [
          "To establish whether added complexity is useful",
          "To avoid evaluating the candidate",
          "To guarantee the baseline is always best"
        ],
        "correct": 0,
        "explanation": "A baseline provides context for judging improvements and the cost of additional complexity."
      }
    ]
  },
  {
    "id": "data-mlops",
    "course": "data",
    "title": "Production & CI/CD",
    "subtitle": "Validate artifacts, automate delivery and plan a safe production release.",
    "stage": 1,
    "icon": "activity",
    "time": "75 min",
    "skills": [
      "MLflow",
      "Feature store",
      "Model registry"
    ],
    "sources": [
      "mlflow",
      "googlecloud"
    ],
    "quizBank": [
      {
        "question": "What is the purpose of a release gate?",
        "options": [
          "Stop every release permanently",
          "Require agreed checks before promotion",
          "Replace monitoring after deployment"
        ],
        "correct": 1,
        "explanation": "Release gates prevent promotion until explicit quality and risk criteria are met."
      },
      {
        "question": "What is a canary release?",
        "options": [
          "Sending a limited traffic share to a candidate version",
          "Deleting the previous model immediately",
          "Replacing every user request without observation"
        ],
        "correct": 0,
        "explanation": "A canary limits initial exposure so the candidate can be observed before expanding the rollout."
      },
      {
        "question": "What distinguishes shadow deployment?",
        "options": [
          "Candidate predictions are evaluated without driving live decisions",
          "The candidate receives no inputs",
          "Monitoring is disabled"
        ],
        "correct": 0,
        "explanation": "Shadow deployment observes a candidate alongside production without using its outputs for the live decision."
      },
      {
        "question": "A production runtime must include…",
        "options": [
          "Only a notebook filename",
          "Compatible dependencies, configuration and prediction interfaces",
          "Only a model accuracy number"
        ],
        "correct": 1,
        "explanation": "The model artifact needs a compatible environment and clear input/output expectations."
      },
      {
        "question": "What does continuous delivery emphasize?",
        "options": [
          "A validated candidate kept ready for release",
          "Automatic release with no checks",
          "Training a model exactly once"
        ],
        "correct": 0,
        "explanation": "Continuous delivery prepares validated changes for release; deployment may still require approval."
      },
      {
        "question": "What evidence belongs in a release record?",
        "options": [
          "Model version, code revision, data version and evaluation report",
          "Only the developer’s name",
          "Only an unversioned model filename"
        ],
        "correct": 0,
        "explanation": "A release record connects the deployed artifact to the evidence and inputs that justify it."
      },
      {
        "question": "Which test checks that the prediction endpoint accepts the expected input?",
        "options": [
          "An interface or integration test",
          "A font comparison",
          "Only a training-loss plot"
        ],
        "correct": 0,
        "explanation": "An interface test exercises the schema and behavior expected by clients of the prediction service."
      },
      {
        "question": "Why test rollback before a rollout?",
        "options": [
          "To verify the earlier release remains compatible and recoverable",
          "To avoid keeping the earlier artifact",
          "To ensure the new model never needs monitoring"
        ],
        "correct": 0,
        "explanation": "Recovery depends on retained artifacts and compatibility, not just a written intention to roll back."
      },
      {
        "question": "Which serving mode suits a nightly list of predicted demand values?",
        "options": [
          "Scheduled batch prediction",
          "Only one-request-at-a-time interactive serving",
          "No serving mode can support it"
        ],
        "correct": 0,
        "explanation": "Batch prediction fits results produced on a schedule when the business can wait for the batch."
      },
      {
        "question": "A model beats the baseline but exceeds the latency limit. Should it automatically pass?",
        "options": [
          "Yes, quality scores override every requirement",
          "No; operational requirements are also release gates",
          "Yes, if its filename contains “final”"
        ],
        "correct": 1,
        "explanation": "Production readiness includes runtime constraints as well as model-quality criteria."
      }
    ],
    "lessons": [
      {
        "title": "Prepare a production runtime",
        "body": "<b>Development is not production</b><p>Production has different traffic, permissions, dependencies and reliability expectations. Package the model and its runtime so behavior is consistent and configuration is explicit.</p><b>Validate access and behavior</b><p>Check input schemas, data access, dependencies and prediction interfaces before launch. Separate validation from the training process and test against the intended use.</p><b>Evaluate model risk</b><p>A higher-impact use case may need more review, documentation and monitoring. Decide release criteria before evaluating the candidate model, and record approval decisions.</p>",
        "principle": "Explain environment differences and model validation before launch.",
        "exercise": "Write a pre-launch checklist covering environment, access, data schema and model behavior.",
        "q": "What is the purpose of a release gate?",
        "options": [
          "Stop every release permanently",
          "Require agreed checks before promotion",
          "Replace monitoring after deployment"
        ],
        "correct": 1,
        "explanation": "Release gates prevent promotion until explicit quality and risk criteria are met."
      },
      {
        "title": "Build the CI/CD pipeline",
        "body": "<b>Continuous integration</b><p>A code change triggers checks such as unit tests, schema validation and data-quality checks. Versioned artifacts connect each result to the source and environment that produced it.</p><b>From candidate to release</b><p>A pipeline can train, evaluate, package and validate a model before promoting it. Model metrics are one gate alongside security, interface and operational checks.</p><b>Automate with judgment</b><p>Continuous delivery keeps a validated candidate ready to release. Continuous deployment releases automatically after gates pass. Human approval may be appropriate depending on risk.</p>",
        "principle": "Design a delivery pipeline with meaningful quality gates.",
        "exercise": "Draw commit → test → train → evaluate → package → stage → approve → deploy. Add a stop condition to three stages.",
        "q": "What is a canary release?",
        "options": [
          "Sending a limited traffic share to a candidate version",
          "Deleting the previous model immediately",
          "Replacing every user request without observation"
        ],
        "correct": 0,
        "explanation": "A canary limits initial exposure so the candidate can be observed before expanding the rollout."
      },
      {
        "title": "Deployment & maintenance",
        "body": "<b>Match the serving pattern</b><p>Batch prediction produces results on a schedule. Online prediction responds to requests. Select the mode using latency, throughput and business needs.</p><b>Release gradually</b><p>A canary release sends a small share of traffic to a new version. Blue-green uses parallel environments and a traffic switch. Shadow deployment evaluates a candidate without using its predictions for live decisions.</p><b>Keep a recovery path</b><p>Retain the last validated model and compatible environment. Monitor service health and model behavior, define rollback triggers and assign someone to respond.</p>",
        "principle": "Compare deployment modes and plan rollback and maintenance.",
        "exercise": "Plan a canary release. Define the traffic share, evaluation window, success criteria and rollback trigger.",
        "q": "What distinguishes shadow deployment?",
        "options": [
          "Candidate predictions are evaluated without driving live decisions",
          "The candidate receives no inputs",
          "Monitoring is disabled"
        ],
        "correct": 0,
        "explanation": "Shadow deployment observes a candidate alongside production without using its outputs for the live decision."
      },
      {
        "title": "Design release gates & a rollback record",
        "body": "<b>Make the candidate identifiable</b><p>A release record links the model artifact, training dataset version, code commit, environment and evaluation report. Include the expected request schema and response contract. This allows a release to be investigated without guessing which model file was deployed.</p><b>Separate kinds of tests</b><p>Unit tests check transformation logic; data checks validate inputs; model checks evaluate quality; integration tests exercise prediction interfaces; load tests assess runtime behavior. A single accuracy threshold cannot substitute for these other checks. Compare the candidate with the deployed baseline under equivalent conditions.</p><b>Rehearse recovery</b><p>Before a canary, retain the last approved release and compatible configuration. Define who can stop the rollout, which metrics trigger rollback and how delayed labels affect the decision. Validate that the older model can still read the current input schema. A rollback that exists only on paper is not an operational plan.</p><p><b>Worked example</b></p><pre><code>release: house-price-demo-v2\nmodel: immutable-artifact-id\ndata: training-snapshot-id\ncode: source-commit-id\ngates:\n  - schema-compatible\n  - evaluation-approved\n  - latency-within-target\nrollback: last-approved-release</code></pre><p>Illustrative release record. Targets and approval rules depend on the application.</p>",
        "principle": "Specify evidence required to promote a candidate and recover safely.",
        "exercise": "Draft a release record and three go/no-go gates. Add an owner, an observation window and a rollback decision for each.",
        "q": "A production runtime must include…",
        "options": [
          "Only a notebook filename",
          "Compatible dependencies, configuration and prediction interfaces",
          "Only a model accuracy number"
        ],
        "correct": 1,
        "explanation": "The model artifact needs a compatible environment and clear input/output expectations."
      }
    ]
  },
  {
    "id": "data-production",
    "course": "data",
    "title": "Monitoring & governance",
    "subtitle": "Detect change, close the feedback loop and make model decisions traceable.",
    "stage": 2,
    "icon": "spark",
    "time": "90 min",
    "skills": [
      "Airflow",
      "DataOps",
      "Monitoring"
    ],
    "sources": [
      "airflow",
      "mlopsorg"
    ],
    "quizBank": [
      {
        "question": "An input-drift alert means…",
        "options": [
          "The model must be retrained immediately",
          "The input distribution changed and needs investigation",
          "The model is certainly inaccurate"
        ],
        "correct": 1,
        "explanation": "Drift identifies a change in inputs; investigate data quality and outcome performance before deciding how to respond."
      },
      {
        "question": "Which observation directly measures model error when outcomes are available?",
        "options": [
          "Comparing predictions with ground-truth labels",
          "Counting input columns alone",
          "Checking only the service hostname"
        ],
        "correct": 0,
        "explanation": "Ground-truth evaluation measures predictive behavior against observed outcomes."
      },
      {
        "question": "A unit conversion bug changes a feature distribution. What should happen first?",
        "options": [
          "Retrain immediately on the corrupted inputs",
          "Investigate and repair the data transformation",
          "Disable the alert forever"
        ],
        "correct": 1,
        "explanation": "An upstream defect should be fixed before considering retraining on the changed data."
      },
      {
        "question": "What should a model card document?",
        "options": [
          "Intended use, evaluation and known limitations",
          "Only the model file extension",
          "Only the cloud invoice"
        ],
        "correct": 0,
        "explanation": "Model cards support informed use by describing purpose, evaluation and constraints."
      },
      {
        "question": "Why can production accuracy be unavailable immediately?",
        "options": [
          "Outcome labels may arrive later",
          "Accuracy never requires labels",
          "Model versions remove the need for outcomes"
        ],
        "correct": 0,
        "explanation": "Many tasks have delayed ground truth, so early signals must be distinguished from confirmed outcome performance."
      },
      {
        "question": "What is a monitoring baseline?",
        "options": [
          "A documented reference for comparison",
          "A guarantee that drift is harmful",
          "A replacement for incident ownership"
        ],
        "correct": 0,
        "explanation": "A baseline defines the reference distribution or performance against which changes are assessed."
      },
      {
        "question": "Should a retrained model skip release validation?",
        "options": [
          "Yes, retraining proves it is better",
          "No, it should pass evaluation and release gates",
          "Yes, if the data is newer"
        ],
        "correct": 1,
        "explanation": "New training data can introduce new failures; a retrained model needs evidence before promotion."
      },
      {
        "question": "How should governance effort relate to model risk?",
        "options": [
          "Controls should reflect the impact and context of use",
          "Every model needs identical controls regardless of impact",
          "Higher impact means less documentation"
        ],
        "correct": 0,
        "explanation": "Proportionate controls focus review and accountability where potential harm or failure matters most."
      },
      {
        "question": "Which belongs in an alert playbook?",
        "options": [
          "An owner, diagnostic checks and escalation decisions",
          "Only a chart color",
          "Only a model nickname"
        ],
        "correct": 0,
        "explanation": "An actionable playbook links a signal to accountable investigation and recovery decisions."
      },
      {
        "question": "A new customer population changes the relationship between features and outcomes. What concern does this suggest?",
        "options": [
          "Possible concept drift requiring outcome-based evaluation",
          "Only a visual formatting issue",
          "Proof that the network is unavailable"
        ],
        "correct": 0,
        "explanation": "A changed feature-to-outcome relationship suggests concept drift; evaluate behavior with suitable outcome evidence."
      }
    ],
    "lessons": [
      {
        "title": "Recognize model degradation",
        "body": "<b>The world changes</b><p>A model can degrade as customer behavior, products or data collection change. Monitor service health, input data and outcomes because each reveals a different class of problem.</p><b>Drift is a signal</b><p>Input drift means a feature distribution has changed relative to a reference. It does not prove prediction quality has declined. Investigate the cause and evaluate outcomes when labels are available.</p><b>Use ground truth</b><p>Ground-truth evaluation compares predictions with observed outcomes. Labels may arrive late, so define the evaluation window and distinguish early proxy signals from confirmed performance changes.</p>",
        "principle": "Distinguish input drift from changes in model performance.",
        "exercise": "For a demand forecast, list one service metric, one input-drift signal and one ground-truth metric.",
        "q": "An input-drift alert means…",
        "options": [
          "The model must be retrained immediately",
          "The input distribution changed and needs investigation",
          "The model is certainly inaccurate"
        ],
        "correct": 1,
        "explanation": "Drift identifies a change in inputs; investigate data quality and outcome performance before deciding how to respond."
      },
      {
        "title": "Build the feedback loop",
        "body": "<b>Choose a reference</b><p>Compare recent inputs to a documented baseline. Missingness rates, summary statistics and distribution comparisons can highlight change; thresholds should reflect the use case and data variability.</p><b>Investigate before reacting</b><p>A drift alert could indicate real population change or a broken upstream transformation. Check data quality and context before retraining a model on potentially corrupted inputs.</p><b>Retraining is another release</b><p>Trigger retraining based on evidence or a schedule, then apply the same evaluation and release gates used for initial deployment. Keep an audit record and a rollback option.</p>",
        "principle": "Design monitoring and retraining decisions with validation.",
        "exercise": "Write an alert playbook: trigger, owner, checks, decision and recovery. Include a reason not to retrain immediately.",
        "q": "Which observation directly measures model error when outcomes are available?",
        "options": [
          "Comparing predictions with ground-truth labels",
          "Counting input columns alone",
          "Checking only the service hostname"
        ],
        "correct": 0,
        "explanation": "Ground-truth evaluation measures predictive behavior against observed outcomes."
      },
      {
        "title": "Govern the model lifecycle",
        "body": "<b>Make ownership visible</b><p>A model inventory records purpose, owner, versions, status and intended users. A model card adds evaluation results, data limitations and known failure modes.</p><b>Scale controls with risk</b><p>Use review, access control, lineage, approvals and change logs in proportion to the impact of model decisions. Reproducibility and traceability support responsible operations.</p><b>Regulatory context</b><p>Model governance includes risk management, privacy-aware data handling and clear accountability. Study how documentation, data handling and accountability relate to governance. Actual obligations depend on jurisdiction and context; this lesson is a conceptual introduction.</p>",
        "principle": "Connect documentation and controls with model risk.",
        "exercise": "Draft a model card with intended use, excluded uses, training data summary, evaluation, limitations and owner.",
        "q": "A unit conversion bug changes a feature distribution. What should happen first?",
        "options": [
          "Retrain immediately on the corrupted inputs",
          "Investigate and repair the data transformation",
          "Disable the alert forever"
        ],
        "correct": 1,
        "explanation": "An upstream defect should be fixed before considering retraining on the changed data."
      },
      {
        "title": "Write a monitoring incident playbook",
        "body": "<b>Begin with a concrete signal</b><p>Suppose the missing-value rate for floor_area rises after a data-source change. An input alert is evidence of changed data, not proof of model failure. Inspect collection, schemas, transformations and affected traffic before acting. Record the baseline and the alert window.</p><b>Separate diagnosis from retraining</b><p>If a broken unit conversion caused the shift, repair the data path first. Retraining on corrupted inputs can reinforce the error. When labels arrive, compare outcome metrics and error slices against the baseline. Keep service failures, data drift and concept changes distinct in the investigation.</p><b>Close the feedback loop</b><p>Record the incident, impact, owner, corrective action and follow-up check. For any retraining decision, version the new data and reuse evaluation and release gates. Update the model card when intended use, limitations or measured behavior changes.</p><p><b>Worked example</b></p><pre><code>Alert → acknowledge → inspect source\n      → validate transformations\n      → assess affected predictions\n      → repair / rollback / evaluate retraining\n      → validate recovery → record lessons</code></pre><p>A conceptual response flow. Operational thresholds must be set for the actual system.</p>",
        "principle": "Turn an alert into an owned, evidence-based response.",
        "exercise": "Create a playbook for a sudden missing-feature alert. Include triage checks, an escalation owner and evidence required before retraining.",
        "q": "What should a model card document?",
        "options": [
          "Intended use, evaluation and known limitations",
          "Only the model file extension",
          "Only the cloud invoice"
        ],
        "correct": 0,
        "explanation": "Model cards support informed use by describing purpose, evaluation and constraints."
      }
    ]
  }
];

modules.push(...dataModules);

const dataVideos = [
  {
    "id": "data-etl",
    "course": "data",
    "title": "ETL vs ELT: Powering Data Pipelines for AI & Analytics",
    "shortTitle": "ETL vs ELT",
    "provider": "IBM Technology",
    "subtitle": "IBM Technology · Module 01",
    "video": "KIv2Na2-u24",
    "topic": "Data Engineering & Pipelines",
    "format": "Video Masterclass",
    "edition": "Industry standard",
    "desc": "Compare when transformation happens and how that affects your pipeline design.",
    "modules": [
      "data-foundations"
    ],
    "notesUrl": "https://www.youtube.com/watch?v=KIv2Na2-u24",
    "notesLabel": "Watch on IBM Technology ↗",
    "practice": "#lesson/data-foundations/0",
    "activity": "What would make you transform data before loading it?",
    "chapters": []
  },
  {
    "id": "data-lake",
    "course": "data",
    "title": "What is a Data Lake?",
    "shortTitle": "What is a Data Lake?",
    "provider": "IBM Technology",
    "subtitle": "IBM Technology · Module 02",
    "video": "LxcH6z8TFpI",
    "topic": "Data Engineering & Pipelines",
    "format": "Video Masterclass",
    "edition": "Industry standard",
    "desc": "Explore a data-lake architecture and how raw data becomes useful for analysis.",
    "modules": [
      "data-architecture"
    ],
    "notesUrl": "https://www.youtube.com/watch?v=LxcH6z8TFpI",
    "notesLabel": "Watch on IBM Technology ↗",
    "practice": "#lesson/data-architecture/0",
    "activity": "What metadata and quality controls would keep your lake usable?",
    "chapters": []
  },
  {
    "id": "data-micro",
    "course": "data",
    "title": "What are Microservices?",
    "shortTitle": "What are Microservices?",
    "provider": "IBM Technology",
    "subtitle": "IBM Technology · Module 02",
    "video": "CdBtNQZH8a4",
    "topic": "Data Engineering & Pipelines",
    "format": "Video Masterclass",
    "edition": "Industry standard",
    "desc": "Compare a service-based architecture with a traditional monolith.",
    "modules": [
      "data-architecture"
    ],
    "notesUrl": "https://www.youtube.com/watch?v=CdBtNQZH8a4",
    "notesLabel": "Watch on IBM Technology ↗",
    "practice": "#lesson/data-architecture/0",
    "activity": "Which boundary could your team own and deploy independently?",
    "chapters": []
  },
  {
    "id": "data-mlops",
    "course": "data",
    "title": "What is MLOps?",
    "shortTitle": "What is MLOps?",
    "provider": "IBM Technology",
    "subtitle": "IBM Technology · Module 03",
    "video": "OejCJL2EC3k",
    "topic": "MLOps & Model Lifecycle",
    "format": "Video Masterclass",
    "edition": "Industry standard",
    "desc": "Connect model development with automation and operations.",
    "modules": [
      "data-pipelines"
    ],
    "notesUrl": "https://www.youtube.com/watch?v=OejCJL2EC3k",
    "notesLabel": "Watch on IBM Technology ↗",
    "practice": "#lesson/data-pipelines/0",
    "activity": "Which risks remain after a model has been trained successfully?",
    "chapters": []
  },
  {
    "id": "data-cloud",
    "course": "data",
    "title": "An introduction to MLOps on Google Cloud",
    "shortTitle": "An introduction to MLOps on Google Cloud",
    "provider": "Google Cloud Tech",
    "subtitle": "Google Cloud Tech · Module 04",
    "video": "6gdrwFMaEZ0",
    "topic": "MLOps & Model Lifecycle",
    "format": "Video Masterclass",
    "edition": "Industry standard",
    "desc": "See a production ML lifecycle through a cloud-platform example.",
    "modules": [
      "data-mlops"
    ],
    "notesUrl": "https://www.youtube.com/watch?v=6gdrwFMaEZ0",
    "notesLabel": "Watch on Google Cloud Tech ↗",
    "practice": "#lesson/data-mlops/0",
    "activity": "Which parts of this lifecycle apply even if you use a different platform?",
    "chapters": []
  },
  {
    "id": "data-tracking",
    "course": "data",
    "title": "MLflow 3.0: AI and MLOps on Databricks",
    "shortTitle": "MLflow 3.0",
    "provider": "Databricks",
    "subtitle": "Databricks · Module 03",
    "video": "UezTglxJC88",
    "topic": "MLOps & Model Lifecycle",
    "format": "Video Masterclass",
    "edition": "Industry standard",
    "desc": "Explore experiment tracking, model lifecycle management and deployment workflows.",
    "modules": [
      "data-pipelines"
    ],
    "notesUrl": "https://www.youtube.com/watch?v=UezTglxJC88",
    "notesLabel": "Watch on Databricks ↗",
    "practice": "#lesson/data-pipelines/0",
    "activity": "What evidence would you retain to compare two candidate models?",
    "chapters": []
  },
  {
    "id": "data-best",
    "course": "data",
    "title": "MLOps Best Practices on Google Cloud",
    "shortTitle": "MLOps Best Practices on Google Cloud",
    "provider": "Google Cloud Tech",
    "subtitle": "Google Cloud Tech · Module 04",
    "video": "20h_RTHEtZI",
    "topic": "MLOps & Model Lifecycle",
    "format": "Video Masterclass",
    "edition": "Industry standard",
    "desc": "A conference session linked from Google Cloud’s MLOps architecture guide.",
    "modules": [
      "data-mlops"
    ],
    "notesUrl": "https://www.youtube.com/watch?v=20h_RTHEtZI",
    "notesLabel": "Watch on Google Cloud Tech ↗",
    "practice": "#lesson/data-mlops/0",
    "activity": "Where would you place validation and promotion gates in your own design?",
    "chapters": []
  },
  {
    "id": "data-governance",
    "course": "data",
    "title": "Data Governance Explained in 5 Minutes",
    "shortTitle": "Data Governance Explained in 5 Minutes",
    "provider": "IBM Technology",
    "subtitle": "IBM Technology · Module 05",
    "video": "uPsUjKLHLAg",
    "topic": "Production & DataOps",
    "format": "Video Masterclass",
    "edition": "Industry standard",
    "desc": "Connect data ownership, access and governance with reliable use.",
    "modules": [
      "data-production"
    ],
    "notesUrl": "https://www.youtube.com/watch?v=uPsUjKLHLAg",
    "notesLabel": "Watch on IBM Technology ↗",
    "practice": "#lesson/data-production/0",
    "activity": "Who owns each dataset and model decision in your project?",
    "chapters": []
  }
];
videos.push(...dataVideos);
const dataResources = [
  {
    "id": "data-res-data-brief",
    "course": "data",
    "title": "What makes data useful?",
    "type": "Reference",
    "level": "Core concept",
    "desc": "Read an original study brief in the studio, then explore the source for more detail.",
    "ref": "oreilly",
    "brief": "data-brief",
    "creator": "IBM",
    "url": "https://www.ibm.com/think/topics/data-engineering",
    "sections": [
      {
        "title": "Start with the consumer",
        "body": "A pipeline is useful when people can rely on its outputs for a decision. Define the required dataset, its meaning and the time by which it should arrive before choosing tools."
      },
      {
        "title": "Think across stages",
        "body": "Source collection, transformation and serving are connected. A clean transformation cannot rescue an incorrectly defined source or an output nobody understands. Record lineage and ownership through the flow."
      },
      {
        "title": "Try it",
        "body": "Choose a daily sales report. Write its freshness target, key fields and the person who resolves a failed delivery."
      }
    ]
  },
  {
    "id": "data-res-architecture",
    "course": "data",
    "title": "Service boundaries and trade-offs",
    "type": "Reference",
    "level": "Core concept",
    "desc": "Read an original study brief in the studio, then explore the source for more detail.",
    "ref": "oreilly",
    "brief": "architecture",
    "creator": "James Lewis & Martin Fowler",
    "url": "https://martinfowler.com/articles/microservices.html",
    "sections": [
      {
        "title": "A boundary is a commitment",
        "body": "A service should have a clear purpose and interface. Independence is useful only when a team can build, release and operate the component responsibly."
      },
      {
        "title": "Count the costs",
        "body": "Network calls, partial failures, debugging and cross-service data consistency add work. Compare those costs with the value of independent changes and scaling."
      },
      {
        "title": "Try it",
        "body": "Draw two components for a retailer and identify the interface between them. Explain one failure that should not stop the other component."
      }
    ]
  },
  {
    "id": "data-res-airflow",
    "course": "data",
    "title": "Orchestration as a dependency graph",
    "type": "Reference",
    "level": "Core concept",
    "desc": "Read an original study brief in the studio, then explore the source for more detail.",
    "ref": "oreilly",
    "brief": "airflow",
    "creator": "Apache Airflow",
    "url": "https://airflow.apache.org/docs/apache-airflow/stable/core-concepts/overview.html",
    "sections": [
      {
        "title": "Describe the dependencies",
        "body": "A workflow graph records which tasks must finish before others begin. For example, validate an ingested partition before publishing the transformed table."
      },
      {
        "title": "Task success is not data correctness",
        "body": "An orchestrator tracks execution, but your tasks must check the data they publish. Retries also need safe write behavior to avoid duplicated output."
      },
      {
        "title": "Try it",
        "body": "Draw extract, validate, transform and publish as a directed acyclic graph. Add the action to take when validation fails."
      }
    ]
  },
  {
    "id": "data-res-tracking-brief",
    "course": "data",
    "title": "A useful experiment record",
    "type": "Reference",
    "level": "Core concept",
    "desc": "Read an original study brief in the studio, then explore the source for more detail.",
    "ref": "oreilly",
    "brief": "tracking-brief",
    "creator": "MLflow",
    "url": "https://www.mlflow.org/docs/latest/tracking/",
    "sections": [
      {
        "title": "Connect inputs and evidence",
        "body": "Record the code and data identifiers, environment, configuration, evaluation metrics and output files for each run. Use consistent naming so comparisons answer a clear question."
      },
      {
        "title": "Separate the record types",
        "body": "Parameters describe settings. Metrics hold measurements. Artifacts preserve files such as plots or models. Tracking helps review an experiment; it does not prove the experiment was designed correctly."
      },
      {
        "title": "Try it",
        "body": "Specify two runs that change one parameter while keeping the evaluation split fixed. Name the metric and artifacts you would compare."
      }
    ]
  },
  {
    "id": "data-res-leakage",
    "course": "data",
    "title": "Keep evaluation data out of training decisions",
    "type": "Reference",
    "level": "Core concept",
    "desc": "Read an original study brief in the studio, then explore the source for more detail.",
    "ref": "oreilly",
    "brief": "leakage",
    "creator": "scikit-learn",
    "url": "https://scikit-learn.org/stable/common_pitfalls.html",
    "sections": [
      {
        "title": "Split before learning transformations",
        "body": "Learn scaling or imputation statistics from the training data. Apply those learned operations to held-out data without fitting them again."
      },
      {
        "title": "Check prediction-time availability",
        "body": "A field can be accurate and still leak the future. Exclude information recorded after the point where the real system must make a prediction."
      },
      {
        "title": "Try it",
        "body": "For a churn model, compare last month’s usage with a cancellation date recorded after the prediction. Explain which field leaks the outcome."
      }
    ]
  },
  {
    "id": "data-res-delivery",
    "course": "data",
    "title": "Build a delivery loop for ML",
    "type": "Reference",
    "level": "Core concept",
    "desc": "Read an original study brief in the studio, then explore the source for more detail.",
    "ref": "oreilly",
    "brief": "delivery",
    "creator": "Google Cloud",
    "url": "https://docs.cloud.google.com/architecture/mlops-continuous-delivery-and-automation-pipelines-in-machine-learning",
    "sections": [
      {
        "title": "Automate a tested path",
        "body": "Connect changes to repeatable checks, training, evaluation and artifact creation. Keep evidence for the candidate that passes the gates."
      },
      {
        "title": "Distinguish the loops",
        "body": "Software delivery changes the implementation. Retraining updates a model with data. Both require validation, traceability and an appropriate promotion decision."
      },
      {
        "title": "Try it",
        "body": "Sketch a path from a code commit to a staged model, then draw a separate retraining trigger that reuses the same evaluation gate."
      }
    ]
  },
  {
    "id": "data-res-monitoring",
    "course": "data",
    "title": "Investigate a drift signal",
    "type": "Reference",
    "level": "Core concept",
    "desc": "Read an original study brief in the studio, then explore the source for more detail.",
    "ref": "oreilly",
    "brief": "monitoring",
    "creator": "Google Cloud",
    "url": "https://docs.cloud.google.com/gemini-enterprise-agent-platform/machine-learning/model-monitoring/overview",
    "sections": [
      {
        "title": "Name the reference",
        "body": "A distribution comparison only makes sense against a documented baseline and observation window. Track changes in inputs separately from confirmed changes in outcomes."
      },
      {
        "title": "Investigate before retraining",
        "body": "A broken data transformation and a changing user population can both shift input statistics. Check quality and context, then use outcome evidence when available."
      },
      {
        "title": "Try it",
        "body": "Write a missing-value alert with an owner, first diagnostic step and follow-up metric. Decide what evidence would justify retraining."
      }
    ]
  }
];
resources.push(...dataResources);

const dataLearningPhases = [
  {
    "id": "data-stage-1",
    "course": "data",
    "title": "Data foundations & architectural design",
    "short": "Foundations",
    "tone": "mint",
    "label": "STAGE 01 · DATA BASE",
    "modules": [
      "data-foundations",
      "data-architecture"
    ],
    "before": "Basic programming familiarity (Python/SQL). Curiosity for data systems.",
    "goal": "Understand the data engineering lifecycle, storage tiers, lakehouses, and batch vs. stream tradeoffs.",
    "outcome": "An end-to-end data lifecycle diagram with storage checkpoints.",
    "checkpoint": "Can you explain the difference between a data warehouse and a data lakehouse in your own words?",
    "practice": "#labs/pipeline",
    "practiceLabel": "Try the Pipeline Lab ordering exercise",
    "videos": [
      "data-etl",
      "data-lake",
      "data-micro"
    ],
    "pdf": "data-mlops-course-guide"
  },
  {
    "id": "data-stage-2",
    "course": "data",
    "title": "Transformations, MLOps & model pipelines",
    "short": "Pipelines",
    "tone": "sky",
    "label": "STAGE 02 · MODEL LIFECYCLE",
    "modules": [
      "data-pipelines",
      "data-mlops"
    ],
    "before": "Completed stage 01. Understand storage formats and SQL basics.",
    "goal": "Build modular dbt transformation models, track experiments with MLflow, and design feature stores.",
    "outcome": "A reproducible dbt model specification and an MLflow experiment tracking plan.",
    "checkpoint": "Why do data teams transform data inside the warehouse (ELT) rather than before loading (ETL)?",
    "practice": "#project/mlops-pipeline",
    "practiceLabel": "Open the MLOps pipeline project brief",
    "videos": [
      "data-mlops",
      "data-cloud",
      "data-tracking"
    ],
    "pdf": "data-mlops-study-companion"
  },
  {
    "id": "data-stage-3",
    "course": "data",
    "title": "Production orchestration, DataOps & governance",
    "short": "Production",
    "tone": "gold",
    "label": "STAGE 03 · PRODUCTION",
    "modules": [
      "data-production"
    ],
    "before": "Completed stage 02. Understand pipelines and model lifecycle.",
    "goal": "Automate workflows with Apache Airflow DAGs, monitor data quality, and prevent model drift in production.",
    "outcome": "A production DAG design with automated data quality assertions and alerting.",
    "checkpoint": "What happens when upstream data schemas change without contracts, and how does DataOps protect downstream models?",
    "practice": "#labs",
    "practiceLabel": "Explore the project workbook",
    "videos": [
      "data-governance",
      "data-best",
      "data-tracking"
    ],
    "pdf": "data-mlops-project-workbook"
  }
];
learningPhases.push(...dataLearningPhases);
guidedModuleIds.push(...dataLearningPhases.flatMap(p => p.modules));

const dataProjects = [
  {
    "id": "mlops-pipeline",
    "title": "Design your own MLOps pipeline",
    "type": "MLOps portfolio project",
    "icon": "layers",
    "desc": "Design an end-to-end reproducible machine learning workflow from ingestion to deployment.",
    "deliverables": [
      "Define business objective, data sources, and SLA requirements.",
      "Design schema validation, feature engineering, and feature store interface.",
      "Specify model training, experiment tracking with MLflow, and versioning.",
      "Plan evaluation metrics, fairness checks, and pre-deployment gates.",
      "Produce an architecture diagram and CI/CD deployment plan with drift alerts."
    ]
  },
  {
    "id": "mlops-tool",
    "title": "Explore an MLOps platform & tool",
    "type": "Data engineering portfolio project",
    "icon": "terminal",
    "desc": "Deep dive into MLflow, Airflow, or Kubeflow with an evaluation and comparison case study.",
    "deliverables": [
      "Compare platform features, self-hosted vs managed tradeoffs, and setup costs.",
      "Configure or prototype a minimal DAG or tracking run with synthetic data.",
      "Document artifact storage, model registry lifecycle, and access control.",
      "Formulate monitoring rules for data drift and concept drift.",
      "Write an engineering assessment report with recommendations and limitations."
    ]
  }
];
projects.push(...dataProjects);

const dataRoles = [
  {
    "id": "dataengineer",
    "title": "Data engineer",
    "tag": "DATA INFRASTRUCTURE",
    "icon": "layers",
    "modules": [
      "data-foundations",
      "data-architecture",
      "data-pipelines"
    ],
    "project": "mlops-pipeline",
    "credential": "oreilly",
    "daily": "Design and maintain robust batch and streaming data pipelines, schemas, and warehouse models.",
    "desc": "Design and maintain robust batch and streaming data pipelines, schemas, and warehouse models.",
    "skills": [
      "Data lifecycle",
      "Lakehouse",
      "SQL / dbt",
      "Orchestration"
    ],
    "milestones": [
      "Build core data engineering, storage, and SQL foundations.",
      "Practice building pipeline models and automated DAGs.",
      "Produce an end-to-end data pipeline specification with quality assertions.",
      "Prepare for data platform and pipeline engineering roles."
    ]
  },
  {
    "id": "mlopsengineer",
    "title": "MLOps engineer",
    "tag": "MACHINE LEARNING OPERATIONS",
    "icon": "spark",
    "modules": [
      "data-pipelines",
      "data-mlops",
      "data-production"
    ],
    "project": "mlops-pipeline",
    "credential": "mlopsorg",
    "daily": "Automate model deployment, manage feature stores, track experiments, and prevent production drift.",
    "desc": "Automate model deployment, manage feature stores, track experiments, and prevent production drift.",
    "skills": [
      "MLflow",
      "Feature Stores",
      "CI/CD for ML",
      "Model Monitoring"
    ],
    "milestones": [
      "Understand the continuous delivery lifecycle for machine learning.",
      "Implement tracking, artifact versioning, and feature stores.",
      "Design automated evaluation gates and deployment workflows.",
      "Build automated drift detection and retraining triggers."
    ]
  },
  {
    "id": "analyticsengineer",
    "title": "Analytics engineer",
    "tag": "MODERN DATA STACK",
    "icon": "code",
    "modules": [
      "data-foundations",
      "data-pipelines"
    ],
    "project": "mlops-pipeline",
    "credential": "dbt",
    "daily": "Transform raw data with dbt, build dimensional models, and ensure data quality contracts.",
    "desc": "Transform raw data with dbt, build dimensional models, and ensure data quality contracts.",
    "skills": [
      "dbt",
      "Data Modeling",
      "Data Contracts",
      "Testing"
    ],
    "milestones": [
      "Learn modular transformation and dimensional modeling principles.",
      "Build testing suites and automated schema validation.",
      "Collaborate with data analysts and engineers on serving layers.",
      "Establish semantic layers and business metric definitions."
    ]
  }
];
roles.push(...dataRoles);
