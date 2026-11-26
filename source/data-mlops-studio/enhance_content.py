"""Add practical lessons and question banks to the core learning modules."""
import json
from pathlib import Path
R=Path(__file__).parent
modules=json.loads((R/'dist/data.json').read_text())
extras=[
('SQL checks, contracts & safe retries','Turn quality expectations into checks that a pipeline can run.',[
('Specify the contract','For an orders table, define order_id as a unique non-null key, amount as a non-negative number and event_time as a timestamp. Record the source owner, freshness target and the action to take when a rule fails. A schema check alone cannot tell you whether the values are meaningful.'),
('Inspect before publishing','Count rows, null keys and duplicate keys before loading the serving table. Compare the row count with a sensible reference window. Quarantine unexpected records for investigation rather than silently discarding them. The thresholds below are illustrative; choose them from your business requirements.'),
('Make retries safe','A retry may read the same batch twice. Use stable event identifiers and an idempotent merge so the second attempt does not duplicate orders. Store the input partition and completion status, then make backfills explicit. A successful task should mean the expected data was published, not just that a script exited.')],
'Write three SQL checks for an orders dataset, then explain how your load avoids duplicates when the job retries.',
'SELECT order_id, COUNT(*) AS copies\nFROM orders\nGROUP BY order_id\nHAVING COUNT(*) > 1;\n\nSELECT COUNT(*) AS missing_keys\nFROM orders\nWHERE order_id IS NULL;',
'Illustrative SQL: a duplicate-key query should return no rows before promotion.'),
('Write an architecture decision record','Justify a storage and orchestration design with explicit trade-offs.',[
('State the workload','A fictional retailer needs a daily sales report by 08:00 and a weekly model-training dataset. Begin with a batch design because the requirement does not call for sub-second data. Record volume, privacy constraints, failure tolerance and expected growth before selecting services.'),
('Choose and compare','Compare an analytical warehouse with files in object storage plus a query engine. Consider schema evolution, query patterns, access control, operational effort and cost. A lake stores varied data; it still needs metadata, quality and lifecycle management to remain usable.'),
('Make the decision revisitable','An architecture decision record captures context, options, decision, consequences and a review trigger. For orchestration, represent extract, validate, transform and publish as tasks with dependencies. Airflow represents workflows as directed acyclic graphs; task retries still require idempotent data operations.')],
'Write a one-page decision record for the retailer. Include a rejected option, an outage scenario and a trigger for reassessing the design.',
'Context: daily report, ready by 08:00\nDecision: scheduled batch ingestion\nQuality gate: schema + keys + freshness\nRecovery: retry the same partition safely\nReview trigger: freshness needs fall below 5 minutes',
'Illustrative architecture decision outline, not a product recommendation.'),
('Track an experiment with MLflow','Map experiment metadata to a minimal tracking workflow.',[
('Give each run an identity','A run connects a candidate model to its parameters, metrics and artifacts. Choose an experiment name, record the code revision and dataset identifier, and log the evaluation metric. These records make comparisons reviewable; they do not guarantee that the underlying evaluation design is sound.'),
('Separate artifacts from numbers','Metrics such as validation MAE describe measured behavior. Parameters record configuration. Artifacts include plots, feature lists, environment specifications and model files. Keep confidential data out of logs and restrict access to tracking storage.'),
('Use tracking with a good split','Fit preprocessing on the training partition only, then apply it to validation data. MLflow can log an experiment, but it will not automatically prevent leakage in your feature construction. The minimal example below illustrates logging; it does not train or validate a real model.')],
'Design two comparable training runs. List what remains fixed, what changes and which artifacts a reviewer needs.',
'import mlflow\n\nmlflow.set_experiment("house-price-baseline")\nwith mlflow.start_run():\n    mlflow.log_param("dataset_version", "demo-v1")\n    mlflow.log_param("split_strategy", "time-based")\n    mlflow.log_metric("validation_mae", 42000.0)',
'Illustrative logging example. The metric is fictional. Install and configure MLflow separately to run it.'),
('Design release gates & a rollback record','Specify evidence required to promote a candidate and recover safely.',[
('Make the candidate identifiable','A release record links the model artifact, training dataset version, code commit, environment and evaluation report. Include the expected request schema and response contract. This allows a release to be investigated without guessing which model file was deployed.'),
('Separate kinds of tests','Unit tests check transformation logic; data checks validate inputs; model checks evaluate quality; integration tests exercise prediction interfaces; load tests assess runtime behavior. A single accuracy threshold cannot substitute for these other checks. Compare the candidate with the deployed baseline under equivalent conditions.'),
('Rehearse recovery','Before a canary, retain the last approved release and compatible configuration. Define who can stop the rollout, which metrics trigger rollback and how delayed labels affect the decision. Validate that the older model can still read the current input schema. A rollback that exists only on paper is not an operational plan.')],
'Draft a release record and three go/no-go gates. Add an owner, an observation window and a rollback decision for each.',
'release: house-price-demo-v2\nmodel: immutable-artifact-id\ndata: training-snapshot-id\ncode: source-commit-id\ngates:\n  - schema-compatible\n  - evaluation-approved\n  - latency-within-target\nrollback: last-approved-release',
'Illustrative release record. Targets and approval rules depend on the application.'),
('Write a monitoring incident playbook','Turn an alert into an owned, evidence-based response.',[
('Begin with a concrete signal','Suppose the missing-value rate for floor_area rises after a data-source change. An input alert is evidence of changed data, not proof of model failure. Inspect collection, schemas, transformations and affected traffic before acting. Record the baseline and the alert window.'),
('Separate diagnosis from retraining','If a broken unit conversion caused the shift, repair the data path first. Retraining on corrupted inputs can reinforce the error. When labels arrive, compare outcome metrics and error slices against the baseline. Keep service failures, data drift and concept changes distinct in the investigation.'),
('Close the feedback loop','Record the incident, impact, owner, corrective action and follow-up check. For any retraining decision, version the new data and reuse evaluation and release gates. Update the model card when intended use, limitations or measured behavior changes.')],
'Create a playbook for a sudden missing-feature alert. Include triage checks, an escalation owner and evidence required before retraining.',
'Alert → acknowledge → inspect source\n      → validate transformations\n      → assess affected predictions\n      → repair / rollback / evaluate retraining\n      → validate recovery → record lessons',
'A conceptual response flow. Operational thresholds must be set for the actual system.')]
for m,e in zip(modules,extras):
 m['outcome']=['Foundations','Architecture','Experiments','Delivery','Trust'][m['id']-1]
 for l in m['lessons']:
  for s in l['sections']:s['body']=s['body'].replace('The syllabus introduces financial model risk management and privacy frameworks such as GDPR and CCPA.','Model governance includes risk management, privacy-aware data handling and clear accountability.')
 m['lessons'].append(dict(id=f"m{m['id']}l4",title=e[0],objective=e[1],sections=[dict(title=s[0],body=s[1]) for s in e[2]],activity=e[3],code=e[4],codeCaption=e[5]))
 m['quizzes']=[m.pop('quiz')]

# Each bank contains ten distinct questions with explanations. Answer indices are shuffled in the UI.
questions=[
[
('Which role most directly owns a dependable ingestion and transformation system?', ['Data engineer','Only a graphic designer','Only the model end user'],0,'Data engineers build and operate systems that make data reliably available to consumers.'),
('A daily report arrives late even though its rows are correct. Which quality concern failed?', ['Uniqueness','Freshness','Encoding'],1,'Freshness concerns whether data is available within the time window required by its consumers.'),
('A source sends the same batch twice after a timeout. What helps prevent duplicate output?', ['A random output filename each time','An idempotent load using stable keys','Deleting every historical record'],1,'Stable identifiers and idempotent operations let a retry produce the same intended result.'),
('Which is a business responsibility of a data engineer?', ['Clarifying which decision the data should support','Choosing tools without requirements','Ignoring downstream consumers'],0,'Business context connects technical work to a useful outcome and defines practical service expectations.'),
('A new column appears upstream. What is the best first response?', ['Automatically treat all values as valid','Evaluate schema compatibility and downstream expectations','Disable all tests permanently'],1,'A schema change needs to be assessed against contracts and consumers before it is accepted.'),
('Which activity belongs to the wider data lifecycle?', ['Only calculating a model score','Retention and eventual deletion','Only building a chart'],1,'Data persists beyond transformation and serving; retention and deletion are part of its wider lifecycle.'),
('Which workload is a reasonable starting point for scheduled batch ingestion?', ['A report required once each morning','A strict sub-second alerting requirement','Every workload without considering latency'],0,'Scheduled batch processing can fit daily reporting when the freshness requirement allows it.'),
('Why document a dataset owner?', ['To avoid writing schemas','To make responsibility and incident response clear','To guarantee the data never changes'],1,'An owner is accountable for expectations, changes and coordination when issues occur.'),
('A duplicate-key SQL query returns rows. What should happen before publishing?', ['Ignore the result because the script ran','Investigate or quarantine the duplicates according to the contract','Declare the dataset unique'],1,'The query identifies a contract violation that needs an explicit response before promotion.')],
[
('Why use a stable interface between services?', ['To hide every failure','To reduce dependence on implementation details','To remove all coordination'],1,'Stable interfaces can reduce coupling, although distributed systems still require coordination and operations.'),
('What should an architecture decision record include?', ['Only the final product name','Context, alternatives, consequences and a review trigger','Only the monthly bill'],1,'A decision record makes the reasoning and conditions behind an architecture choice reviewable.'),
('What is a practical cost of introducing many microservices?', ['They eliminate all deployment work','Additional coordination and operational complexity','They make failures impossible'],1,'Service boundaries may enable independence but also introduce network, observability and operational work.'),
('Which design directly acknowledges partial failure?', ['Assuming every network call succeeds','Timeouts, bounded retries and recovery paths','Removing error handling'],1,'Distributed components may fail independently; designs need explicit behavior for those failures.'),
('Hybrid cloud generally combines…', ['Local infrastructure and cloud environments','Two tables in one database','Only two branches in Git'],0,'Hybrid cloud connects on-premises or private infrastructure with public-cloud environments.'),
('Why consider team capability before choosing a tool?', ['Operating and maintaining it is part of the design cost','Tools never require learning','It removes the need for reliability'],0,'A tool has to fit the skills and operational capacity of the people who will run it.'),
('What is a workflow DAG used to represent?', ['Dependencies between tasks without directed cycles','Only a model accuracy score','A list of passwords'],0,'A directed acyclic graph expresses task dependencies and valid ordering in a workflow.'),
('A data lake stores raw files. What is still needed?', ['Nothing; files govern themselves','Metadata, access control and quality management','A guarantee that every query is fast'],1,'Storage alone does not make data understandable, trustworthy or appropriately accessible.'),
('A daily batch design must now support a five-second freshness target. What should the team do?', ['Revisit the architecture against the new requirement','Ignore the changed requirement','Rename the existing job'],0,'A changed service expectation is a reason to reassess the architecture and its trade-offs.')],
[
('Which is an example of target leakage in churn prediction?', ['Account age before the prediction date','A cancellation flag recorded after the prediction date','Usage measured before the prediction date'],1,'A future cancellation flag would not be available when making the intended prediction.'),
('When should a scaler learn its parameters?', ['From the training partition only','From the combined training and test partitions','From future production labels'],0,'Fit preprocessing on training data and reuse the learned transformation on held-out data.'),
('Why compare against a simple baseline?', ['To establish whether added complexity is useful','To avoid evaluating the candidate','To guarantee the baseline is always best'],0,'A baseline provides context for judging improvements and the cost of additional complexity.'),
('Which record is an experiment parameter?', ['A learning-rate setting','A validation error measured after training','An exported plot'],0,'Parameters describe configuration; metrics record measurements and artifacts store output files.'),
('Which record is an experiment artifact?', ['A saved feature-importance plot','Only a scalar learning rate','Only an experiment name'],0,'Artifacts can include files such as plots, models and environment specifications.'),
('A model has 99% accuracy on a highly imbalanced dataset. What should you do?', ['Assume it is ready for production','Inspect class-specific metrics and error patterns','Discard the test labels'],1,'Accuracy alone can hide poor performance on a small but important class.'),
('Do random seeds always guarantee identical results across hardware?', ['Yes, in every library and environment','No; document the environment and expected variability','Seeds make versioning unnecessary'],1,'Hardware, libraries and nondeterministic operations can affect reproducibility despite fixed seeds.'),
('What is MLflow Tracking primarily useful for in an experiment?', ['Recording run metadata, metrics and artifacts','Automatically eliminating every data leak','Replacing every production monitor'],0,'Tracking makes run inputs and outputs reviewable, but evaluation design and operations remain your responsibility.'),
('Which is a sound model-development starting point?', ['Choose the largest model before defining the task','Define intended use, prediction target and evaluation criteria','Optimize only the training score'],1,'A clear objective and evaluation plan give the modeling work a meaningful target.')],
[
('What is a canary release?', ['Sending a limited traffic share to a candidate version','Deleting the previous model immediately','Replacing every user request without observation'],0,'A canary limits initial exposure so the candidate can be observed before expanding the rollout.'),
('What distinguishes shadow deployment?', ['Candidate predictions are evaluated without driving live decisions','The candidate receives no inputs','Monitoring is disabled'],0,'Shadow deployment observes a candidate alongside production without using its outputs for the live decision.'),
('A production runtime must include…', ['Only a notebook filename','Compatible dependencies, configuration and prediction interfaces','Only a model accuracy number'],1,'The model artifact needs a compatible environment and clear input/output expectations.'),
('What does continuous delivery emphasize?', ['A validated candidate kept ready for release','Automatic release with no checks','Training a model exactly once'],0,'Continuous delivery prepares validated changes for release; deployment may still require approval.'),
('What evidence belongs in a release record?', ['Model version, code revision, data version and evaluation report','Only the developer’s name','Only an unversioned model filename'],0,'A release record connects the deployed artifact to the evidence and inputs that justify it.'),
('Which test checks that the prediction endpoint accepts the expected input?', ['An interface or integration test','A font comparison','Only a training-loss plot'],0,'An interface test exercises the schema and behavior expected by clients of the prediction service.'),
('Why test rollback before a rollout?', ['To verify the earlier release remains compatible and recoverable','To avoid keeping the earlier artifact','To ensure the new model never needs monitoring'],0,'Recovery depends on retained artifacts and compatibility, not just a written intention to roll back.'),
('Which serving mode suits a nightly list of predicted demand values?', ['Scheduled batch prediction','Only one-request-at-a-time interactive serving','No serving mode can support it'],0,'Batch prediction fits results produced on a schedule when the business can wait for the batch.'),
('A model beats the baseline but exceeds the latency limit. Should it automatically pass?', ['Yes, quality scores override every requirement','No; operational requirements are also release gates','Yes, if its filename contains “final”'],1,'Production readiness includes runtime constraints as well as model-quality criteria.')],
[
('Which observation directly measures model error when outcomes are available?', ['Comparing predictions with ground-truth labels','Counting input columns alone','Checking only the service hostname'],0,'Ground-truth evaluation measures predictive behavior against observed outcomes.'),
('A unit conversion bug changes a feature distribution. What should happen first?', ['Retrain immediately on the corrupted inputs','Investigate and repair the data transformation','Disable the alert forever'],1,'An upstream defect should be fixed before considering retraining on the changed data.'),
('What should a model card document?', ['Intended use, evaluation and known limitations','Only the model file extension','Only the cloud invoice'],0,'Model cards support informed use by describing purpose, evaluation and constraints.'),
('Why can production accuracy be unavailable immediately?', ['Outcome labels may arrive later','Accuracy never requires labels','Model versions remove the need for outcomes'],0,'Many tasks have delayed ground truth, so early signals must be distinguished from confirmed outcome performance.'),
('What is a monitoring baseline?', ['A documented reference for comparison','A guarantee that drift is harmful','A replacement for incident ownership'],0,'A baseline defines the reference distribution or performance against which changes are assessed.'),
('Should a retrained model skip release validation?', ['Yes, retraining proves it is better','No, it should pass evaluation and release gates','Yes, if the data is newer'],1,'New training data can introduce new failures; a retrained model needs evidence before promotion.'),
('How should governance effort relate to model risk?', ['Controls should reflect the impact and context of use','Every model needs identical controls regardless of impact','Higher impact means less documentation'],0,'Proportionate controls focus review and accountability where potential harm or failure matters most.'),
('Which belongs in an alert playbook?', ['An owner, diagnostic checks and escalation decisions','Only a chart color','Only a model nickname'],0,'An actionable playbook links a signal to accountable investigation and recovery decisions.'),
('A new customer population changes the relationship between features and outcomes. What concern does this suggest?', ['Possible concept drift requiring outcome-based evaluation','Only a visual formatting issue','Proof that the network is unavailable'],0,'A changed feature-to-outcome relationship suggests concept drift; evaluate behavior with suitable outcome evidence.')]
]
for m,bank in zip(modules,questions):
 for q,opts,a,why in bank:m['quizzes'].append(dict(question=q,options=opts,answer=a,explanation=why))
 for i,q in enumerate(m['quizzes']):q['id']=f"m{m['id']}q{i+1}"
 m['videoIds']={1:['etl'],2:['lake','micro'],3:['mlops','tracking'],4:['cloud','best'],5:['governance']}[m['id']]
assert sum(len(m['quizzes']) for m in modules)==50
assert sum(len(m['lessons']) for m in modules)==20
(R/'dist/data.json').write_text(json.dumps(modules,ensure_ascii=False,indent=2))
print('Built 20 lessons and 50 explained quiz questions.')
