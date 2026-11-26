/* Original editorial directory; provider details require current review. */
const atlas=[
  {
    "id": "wireshark",
    "kind": "toolkit",
    "title": "Wireshark",
    "url": "https://www.wireshark.org/",
    "groups": [
      "Network Security"
    ],
    "module": "networks",
    "roles": [
      "soc"
    ],
    "task": "Inspect protocol observations and explain a network control.",
    "desc": "Packet inspection and protocol analysis.",
    "sources": [
      "Signal Vault"
    ]
  },
  {
    "id": "nmap",
    "kind": "toolkit",
    "title": "Nmap",
    "url": "https://nmap.org/",
    "groups": [
      "Network Security",
      "Penetration Tester / Red Team"
    ],
    "module": "networks",
    "roles": [
      "soc"
    ],
    "task": "Inspect protocol observations and explain a network control.",
    "desc": "Host, port, and service observation in an authorized scope.",
    "sources": [
      "Signal Vault",
      "Tools by Role"
    ]
  },
  {
    "id": "zeek",
    "kind": "toolkit",
    "title": "Zeek",
    "url": "https://zeek.org/",
    "groups": [
      "Network Security"
    ],
    "module": "networks",
    "roles": [
      "soc"
    ],
    "task": "Inspect protocol observations and explain a network control.",
    "desc": "Structured network telemetry for investigation.",
    "sources": [
      "Signal Vault"
    ]
  },
  {
    "id": "suricata",
    "kind": "toolkit",
    "title": "Suricata",
    "url": "https://suricata.io/",
    "groups": [
      "Network Security",
      "SOC Analyst"
    ],
    "module": "networks",
    "roles": [
      "soc"
    ],
    "task": "Inspect protocol observations and explain a network control.",
    "desc": "Rule-based network intrusion detection and prevention.",
    "sources": [
      "Signal Vault",
      "Tools by Role"
    ]
  },
  {
    "id": "pfsense",
    "kind": "toolkit",
    "title": "pfSense",
    "url": "https://www.pfsense.org/",
    "groups": [
      "Network Security"
    ],
    "module": "networks",
    "roles": [
      "soc"
    ],
    "task": "Inspect protocol observations and explain a network control.",
    "desc": "Network routing and firewall policy administration.",
    "sources": [
      "Signal Vault"
    ]
  },
  {
    "id": "snort",
    "kind": "toolkit",
    "title": "Snort",
    "url": "https://www.snort.org/",
    "groups": [
      "Network Security"
    ],
    "module": "networks",
    "roles": [
      "soc"
    ],
    "task": "Inspect protocol observations and explain a network control.",
    "desc": "Network traffic inspection using detection rules.",
    "sources": [
      "Signal Vault"
    ]
  },
  {
    "id": "nessus",
    "kind": "toolkit",
    "title": "Nessus",
    "url": "https://www.tenable.com/products/nessus",
    "groups": [
      "Vulnerability Assessment",
      "Penetration Tester / Red Team"
    ],
    "module": "assessment",
    "roles": [
      "pentest"
    ],
    "task": "Validate a finding against an advisory and record remediation evidence.",
    "desc": "Vulnerability assessment and configuration review.",
    "sources": [
      "Signal Vault",
      "Tools by Role"
    ]
  },
  {
    "id": "openvas",
    "kind": "toolkit",
    "title": "OpenVAS",
    "url": "https://www.openvas.org/",
    "groups": [
      "Vulnerability Assessment"
    ],
    "module": "assessment",
    "roles": [
      "pentest"
    ],
    "task": "Validate a finding against an advisory and record remediation evidence.",
    "desc": "Vulnerability-scanning workflows and finding review.",
    "sources": [
      "Signal Vault"
    ]
  },
  {
    "id": "metasploit-framework",
    "kind": "toolkit",
    "title": "Metasploit Framework",
    "url": "https://www.metasploit.com/",
    "groups": [
      "Vulnerability Assessment",
      "Penetration Tester / Red Team"
    ],
    "module": "assessment",
    "roles": [
      "pentest"
    ],
    "task": "Validate a finding against an advisory and record remediation evidence.",
    "desc": "Assessment framework; study components, evidence, and cleanup.",
    "sources": [
      "Signal Vault",
      "Tools by Role"
    ]
  },
  {
    "id": "nikto",
    "kind": "toolkit",
    "title": "Nikto",
    "url": "https://cirt.net/Nikto2",
    "groups": [
      "Vulnerability Assessment"
    ],
    "module": "assessment",
    "roles": [
      "pentest"
    ],
    "task": "Validate a finding against an advisory and record remediation evidence.",
    "desc": "Web-server configuration and exposure checks.",
    "sources": [
      "Signal Vault"
    ]
  },
  {
    "id": "openscap",
    "kind": "toolkit",
    "title": "OpenSCAP",
    "url": "https://www.open-scap.org/",
    "groups": [
      "Vulnerability Assessment",
      "GRC / Compliance Analyst"
    ],
    "module": "assessment",
    "roles": [
      "pentest"
    ],
    "task": "Validate a finding against an advisory and record remediation evidence.",
    "desc": "Machine-readable security baseline assessment.",
    "sources": [
      "Signal Vault",
      "Tools by Role"
    ]
  },
  {
    "id": "burp-suite",
    "kind": "toolkit",
    "title": "Burp Suite",
    "url": "https://portswigger.net/burp",
    "groups": [
      "Web Application Security"
    ],
    "module": "webdepth",
    "roles": [
      "appsec"
    ],
    "task": "Explain an application trust boundary and a root-cause fix.",
    "desc": "An intercepting proxy and application testing toolkit.",
    "sources": [
      "Signal Vault"
    ]
  },
  {
    "id": "owasp-zap",
    "kind": "toolkit",
    "title": "OWASP ZAP",
    "url": "https://www.zaproxy.org/",
    "groups": [
      "Web Application Security",
      "Penetration Tester / Red Team",
      "AppSec / DevSecOps Engineer"
    ],
    "module": "webdepth",
    "roles": [
      "appsec"
    ],
    "task": "Explain an application trust boundary and a root-cause fix.",
    "desc": "Web application proxying and scanning workflows.",
    "sources": [
      "Signal Vault",
      "Tools by Role"
    ]
  },
  {
    "id": "sqlmap",
    "kind": "toolkit",
    "title": "SQLMap",
    "url": "https://sqlmap.org/",
    "groups": [
      "Web Application Security",
      "Penetration Tester / Red Team"
    ],
    "module": "webdepth",
    "roles": [
      "appsec"
    ],
    "task": "Explain an application trust boundary and a root-cause fix.",
    "desc": "SQL injection assessment tooling; use only explicit training scope.",
    "sources": [
      "Signal Vault",
      "Tools by Role"
    ]
  },
  {
    "id": "owasp-dependency-check",
    "kind": "toolkit",
    "title": "OWASP Dependency-Check",
    "url": "https://owasp.org/www-project-dependency-check/",
    "groups": [
      "Web Application Security",
      "AppSec / DevSecOps Engineer"
    ],
    "module": "webdepth",
    "roles": [
      "appsec"
    ],
    "task": "Explain an application trust boundary and a root-cause fix.",
    "desc": "Dependency inventory and known-vulnerability correlation.",
    "sources": [
      "Signal Vault",
      "Tools by Role"
    ]
  },
  {
    "id": "autopsy-the-sleuth-kit",
    "kind": "toolkit",
    "title": "Autopsy / The Sleuth Kit",
    "url": "https://www.autopsy.com/",
    "groups": [
      "Digital Forensics",
      "Forensics & Malware Analyst"
    ],
    "module": "forensics",
    "roles": [
      "dfir"
    ],
    "task": "Preserve an artifact and explain the limits of an evidence-based timeline.",
    "desc": "Disk and filesystem forensic analysis.",
    "sources": [
      "Signal Vault",
      "Tools by Role"
    ]
  },
  {
    "id": "volatility",
    "kind": "toolkit",
    "title": "Volatility",
    "url": "https://volatilityfoundation.org/",
    "groups": [
      "Digital Forensics",
      "Forensics & Malware Analyst"
    ],
    "module": "forensics",
    "roles": [
      "dfir"
    ],
    "task": "Preserve an artifact and explain the limits of an evidence-based timeline.",
    "desc": "Memory-artifact analysis and investigation.",
    "sources": [
      "Signal Vault",
      "Tools by Role"
    ]
  },
  {
    "id": "ftk-imager",
    "kind": "toolkit",
    "title": "FTK Imager",
    "url": "https://www.exterro.com/ftk-imager",
    "groups": [
      "Digital Forensics"
    ],
    "module": "forensics",
    "roles": [
      "dfir"
    ],
    "task": "Preserve an artifact and explain the limits of an evidence-based timeline.",
    "desc": "Forensic acquisition and evidence integrity workflows.",
    "sources": [
      "Signal Vault"
    ]
  },
  {
    "id": "redline",
    "kind": "toolkit",
    "title": "Redline",
    "url": "https://cloud.google.com/blog/topics/threat-intelligence",
    "groups": [
      "Digital Forensics"
    ],
    "module": "forensics",
    "roles": [
      "dfir"
    ],
    "task": "Preserve an artifact and explain the limits of an evidence-based timeline.",
    "desc": "Host-triage workflow from a legacy tool ecosystem; verify availability.",
    "sources": [
      "Signal Vault"
    ],
    "status": "Legacy reference; source link corrected"
  },
  {
    "id": "cuckoo-sandbox",
    "kind": "toolkit",
    "title": "Cuckoo Sandbox",
    "url": "https://cuckoosandbox.org/",
    "groups": [
      "Malware Analysis",
      "Forensics & Malware Analyst"
    ],
    "module": "malware",
    "roles": [
      "dfir"
    ],
    "task": "Compare static and behavioral evidence using benign educational artifacts.",
    "desc": "Automated behavioral-analysis ecosystem; review version and containment requirements.",
    "sources": [
      "Signal Vault",
      "Tools by Role"
    ]
  },
  {
    "id": "ghidra",
    "kind": "toolkit",
    "title": "Ghidra",
    "url": "https://ghidra-sre.org/",
    "groups": [
      "Malware Analysis",
      "Forensics & Malware Analyst"
    ],
    "module": "malware",
    "roles": [
      "dfir"
    ],
    "task": "Compare static and behavioral evidence using benign educational artifacts.",
    "desc": "Disassembly, decompilation, and software reverse engineering.",
    "sources": [
      "Signal Vault",
      "Tools by Role"
    ]
  },
  {
    "id": "yara",
    "kind": "toolkit",
    "title": "YARA",
    "url": "https://virustotal.github.io/yara/",
    "groups": [
      "Malware Analysis",
      "Forensics & Malware Analyst"
    ],
    "module": "malware",
    "roles": [
      "dfir"
    ],
    "task": "Compare static and behavioral evidence using benign educational artifacts.",
    "desc": "Rule-based artifact matching and classification.",
    "sources": [
      "Signal Vault",
      "Tools by Role"
    ]
  },
  {
    "id": "pestudio",
    "kind": "toolkit",
    "title": "PEStudio",
    "url": "https://www.winitor.com/",
    "groups": [
      "Malware Analysis"
    ],
    "module": "malware",
    "roles": [
      "dfir"
    ],
    "task": "Compare static and behavioral evidence using benign educational artifacts.",
    "desc": "Static inspection of Windows executable characteristics.",
    "sources": [
      "Signal Vault"
    ]
  },
  {
    "id": "thehive",
    "kind": "toolkit",
    "title": "TheHive",
    "url": "https://thehive-project.org/",
    "groups": [
      "Incident Response & Threat Intel",
      "CISO / Leadership"
    ],
    "module": "defense",
    "roles": [
      "soc"
    ],
    "task": "Correlate events and document a defensible incident handover.",
    "desc": "Case-management and investigation coordination.",
    "sources": [
      "Signal Vault",
      "Tools by Role"
    ]
  },
  {
    "id": "misp",
    "kind": "toolkit",
    "title": "MISP",
    "url": "https://www.misp-project.org/",
    "groups": [
      "Incident Response & Threat Intel",
      "CISO / Leadership",
      "Threat Intelligence & IOC Lookup"
    ],
    "module": "defense",
    "roles": [
      "soc"
    ],
    "task": "Correlate events and document a defensible incident handover.",
    "desc": "Structured sharing and management of threat observations.",
    "sources": [
      "Signal Vault",
      "Tools by Role",
      "OSINT & Threat Intel"
    ]
  },
  {
    "id": "wazuh",
    "kind": "toolkit",
    "title": "Wazuh",
    "url": "https://wazuh.com/",
    "groups": [
      "Incident Response & Threat Intel",
      "SOC Analyst"
    ],
    "module": "defense",
    "roles": [
      "soc"
    ],
    "task": "Correlate events and document a defensible incident handover.",
    "desc": "Endpoint telemetry and security monitoring workflows.",
    "sources": [
      "Signal Vault",
      "Tools by Role"
    ]
  },
  {
    "id": "elastic-stack-elk",
    "kind": "toolkit",
    "title": "Elastic Stack (ELK)",
    "url": "https://www.elastic.co/elastic-stack",
    "groups": [
      "Incident Response & Threat Intel",
      "SOC Analyst"
    ],
    "module": "defense",
    "roles": [
      "soc"
    ],
    "task": "Correlate events and document a defensible incident handover.",
    "desc": "Search, normalization, and analysis of event data.",
    "sources": [
      "Signal Vault",
      "Tools by Role"
    ]
  },
  {
    "id": "openssl",
    "kind": "toolkit",
    "title": "OpenSSL",
    "url": "https://www.openssl.org/",
    "groups": [
      "Cryptography & Identity"
    ],
    "module": "identity",
    "roles": [
      "iam"
    ],
    "task": "Distinguish credential protection, cryptographic purpose, and access control.",
    "desc": "Cryptographic protocol and certificate tooling.",
    "sources": [
      "Signal Vault"
    ]
  },
  {
    "id": "gnupg",
    "kind": "toolkit",
    "title": "GnuPG",
    "url": "https://gnupg.org/",
    "groups": [
      "Cryptography & Identity"
    ],
    "module": "identity",
    "roles": [
      "iam"
    ],
    "task": "Distinguish credential protection, cryptographic purpose, and access control.",
    "desc": "Encryption and digital-signature workflows.",
    "sources": [
      "Signal Vault"
    ]
  },
  {
    "id": "bitwarden",
    "kind": "toolkit",
    "title": "Bitwarden",
    "url": "https://bitwarden.com/",
    "groups": [
      "Cryptography & Identity"
    ],
    "module": "identity",
    "roles": [
      "iam"
    ],
    "task": "Distinguish credential protection, cryptographic purpose, and access control.",
    "desc": "Password and secret management workflows.",
    "sources": [
      "Signal Vault"
    ]
  },
  {
    "id": "hashicorp-vault",
    "kind": "toolkit",
    "title": "HashiCorp Vault",
    "url": "https://www.vaultproject.io/",
    "groups": [
      "Cryptography & Identity"
    ],
    "module": "identity",
    "roles": [
      "iam"
    ],
    "task": "Distinguish credential protection, cryptographic purpose, and access control.",
    "desc": "Secret lifecycle and access-management tooling.",
    "sources": [
      "Signal Vault"
    ]
  },
  {
    "id": "theharvester",
    "kind": "toolkit",
    "title": "theHarvester",
    "url": "https://github.com/laramies/theHarvester",
    "groups": [
      "Defensive OSINT"
    ],
    "module": "recon",
    "roles": [
      "pentest"
    ],
    "task": "Record provenance and avoid unnecessary collection of personal information.",
    "desc": "Collection of public-source asset leads.",
    "sources": [
      "Signal Vault"
    ]
  },
  {
    "id": "shodan",
    "kind": "toolkit",
    "title": "Shodan",
    "url": "https://www.shodan.io/",
    "groups": [
      "Defensive OSINT"
    ],
    "module": "recon",
    "roles": [
      "pentest"
    ],
    "task": "Record provenance and avoid unnecessary collection of personal information.",
    "desc": "An index of externally observed service information.",
    "sources": [
      "Signal Vault"
    ]
  },
  {
    "id": "have-i-been-pwned",
    "kind": "toolkit",
    "title": "Have I Been Pwned",
    "url": "https://haveibeenpwned.com/",
    "groups": [
      "Defensive OSINT"
    ],
    "module": "recon",
    "roles": [
      "pentest"
    ],
    "task": "Record provenance and avoid unnecessary collection of personal information.",
    "desc": "Exposure-awareness service; use only authorized account or domain workflows.",
    "sources": [
      "Signal Vault"
    ]
  },
  {
    "id": "spiderfoot",
    "kind": "toolkit",
    "title": "SpiderFoot",
    "url": "https://github.com/smicallef/spiderfoot",
    "groups": [
      "Defensive OSINT"
    ],
    "module": "recon",
    "roles": [
      "pentest"
    ],
    "task": "Record provenance and avoid unnecessary collection of personal information.",
    "desc": "Automated public-source investigation workflows.",
    "sources": [
      "Signal Vault"
    ]
  },
  {
    "id": "osint-framework",
    "kind": "toolkit",
    "title": "OSINT Framework",
    "url": "https://osintframework.com/",
    "groups": [
      "Defensive OSINT"
    ],
    "module": "recon",
    "roles": [
      "pentest"
    ],
    "task": "Record provenance and avoid unnecessary collection of personal information.",
    "desc": "A taxonomy for selecting public-source research methods.",
    "sources": [
      "Signal Vault"
    ]
  },
  {
    "id": "owasp-amass",
    "kind": "toolkit",
    "title": "OWASP Amass",
    "url": "https://github.com/OWASP/Amass",
    "groups": [
      "Defensive OSINT"
    ],
    "module": "recon",
    "roles": [
      "pentest"
    ],
    "task": "Record provenance and avoid unnecessary collection of personal information.",
    "desc": "External asset-discovery and relationship mapping.",
    "sources": [
      "Signal Vault"
    ]
  },
  {
    "id": "censys",
    "kind": "toolkit",
    "title": "Censys",
    "url": "https://search.censys.io/",
    "groups": [
      "Defensive OSINT"
    ],
    "module": "recon",
    "roles": [
      "pentest"
    ],
    "task": "Record provenance and avoid unnecessary collection of personal information.",
    "desc": "Searchable internet-service and certificate observations.",
    "sources": [
      "Signal Vault"
    ]
  },
  {
    "id": "crt-sh",
    "kind": "toolkit",
    "title": "crt.sh",
    "url": "https://crt.sh/",
    "groups": [
      "Defensive OSINT",
      "Domain & Network Intelligence"
    ],
    "module": "recon",
    "roles": [
      "pentest"
    ],
    "task": "Record provenance and avoid unnecessary collection of personal information.",
    "desc": "Certificate-transparency record search.",
    "sources": [
      "Signal Vault",
      "OSINT & Threat Intel"
    ]
  },
  {
    "id": "mitre-att-ck",
    "kind": "toolkit",
    "title": "MITRE ATT&CK",
    "url": "https://attack.mitre.org/",
    "groups": [
      "Frameworks & Knowledge Bases"
    ],
    "module": "professional",
    "roles": [
      "grc"
    ],
    "task": "Identify what the reference describes and where it does not establish evidence.",
    "desc": "A knowledge base of observed adversary behavior.",
    "sources": [
      "Signal Vault"
    ]
  },
  {
    "id": "att-ck-navigator",
    "kind": "toolkit",
    "title": "ATT&CK Navigator",
    "url": "https://mitre-attack.github.io/attack-navigator/",
    "groups": [
      "Frameworks & Knowledge Bases"
    ],
    "module": "professional",
    "roles": [
      "grc"
    ],
    "task": "Identify what the reference describes and where it does not establish evidence.",
    "desc": "A visual way to organize ATT&CK coverage hypotheses.",
    "sources": [
      "Signal Vault"
    ]
  },
  {
    "id": "capec",
    "kind": "toolkit",
    "title": "CAPEC",
    "url": "https://capec.mitre.org/",
    "groups": [
      "Frameworks & Knowledge Bases"
    ],
    "module": "professional",
    "roles": [
      "grc"
    ],
    "task": "Identify what the reference describes and where it does not establish evidence.",
    "desc": "A catalog of recurring attack-pattern concepts.",
    "sources": [
      "Signal Vault"
    ]
  },
  {
    "id": "cve-nvd",
    "kind": "toolkit",
    "title": "CVE / NVD",
    "url": "https://www.cve.org/",
    "groups": [
      "Frameworks & Knowledge Bases"
    ],
    "module": "professional",
    "roles": [
      "grc"
    ],
    "task": "Identify what the reference describes and where it does not establish evidence.",
    "desc": "Identifiers and enriched records for known vulnerabilities.",
    "sources": [
      "Signal Vault"
    ]
  },
  {
    "id": "owasp-top-10",
    "kind": "toolkit",
    "title": "OWASP Top 10",
    "url": "https://owasp.org/www-project-top-ten/",
    "groups": [
      "Frameworks & Knowledge Bases"
    ],
    "module": "professional",
    "roles": [
      "grc"
    ],
    "task": "Identify what the reference describes and where it does not establish evidence.",
    "desc": "A web-risk awareness map, distinct from a full testing method.",
    "sources": [
      "Signal Vault"
    ]
  },
  {
    "id": "cvss-calculator",
    "kind": "toolkit",
    "title": "CVSS Calculator",
    "url": "https://www.first.org/cvss/",
    "groups": [
      "Frameworks & Knowledge Bases"
    ],
    "module": "professional",
    "roles": [
      "grc"
    ],
    "task": "Identify what the reference describes and where it does not establish evidence.",
    "desc": "A structured severity-scoring aid, not a complete risk decision.",
    "sources": [
      "Signal Vault"
    ]
  },
  {
    "id": "prowler",
    "kind": "toolkit",
    "title": "Prowler",
    "url": "https://github.com/prowler-cloud/prowler",
    "groups": [
      "Cloud & Container Security",
      "Cloud Security Engineer"
    ],
    "module": "cloud",
    "roles": [
      "cloud"
    ],
    "task": "Review workload permissions, build artifacts, and configuration.",
    "desc": "Cloud configuration and security-posture assessment.",
    "sources": [
      "Signal Vault",
      "Tools by Role"
    ]
  },
  {
    "id": "trivy",
    "kind": "toolkit",
    "title": "Trivy",
    "url": "https://trivy.dev/",
    "groups": [
      "Cloud & Container Security",
      "AppSec / DevSecOps Engineer",
      "Cloud Security Engineer"
    ],
    "module": "cloud",
    "roles": [
      "cloud"
    ],
    "task": "Review workload permissions, build artifacts, and configuration.",
    "desc": "Artifact, dependency, and configuration scanning.",
    "sources": [
      "Signal Vault",
      "Tools by Role"
    ]
  },
  {
    "id": "falco",
    "kind": "toolkit",
    "title": "Falco",
    "url": "https://falco.org/",
    "groups": [
      "Cloud & Container Security",
      "Cloud Security Engineer"
    ],
    "module": "cloud",
    "roles": [
      "cloud"
    ],
    "task": "Review workload permissions, build artifacts, and configuration.",
    "desc": "Runtime security-event detection.",
    "sources": [
      "Signal Vault",
      "Tools by Role"
    ]
  },
  {
    "id": "kube-hunter",
    "kind": "toolkit",
    "title": "kube-hunter",
    "url": "https://github.com/aquasecurity/kube-hunter",
    "groups": [
      "Cloud & Container Security",
      "Cloud Security Engineer"
    ],
    "module": "cloud",
    "roles": [
      "cloud"
    ],
    "task": "Review workload permissions, build artifacts, and configuration.",
    "desc": "Kubernetes assessment project; check maintenance before selecting a lab.",
    "sources": [
      "Signal Vault",
      "Tools by Role"
    ]
  },
  {
    "id": "mobsf",
    "kind": "toolkit",
    "title": "MobSF",
    "url": "https://mobsf.github.io/Mobile-Security-Framework-MobSF/",
    "groups": [
      "Mobile Security"
    ],
    "module": "mobileot",
    "roles": [
      "appsec"
    ],
    "task": "Map client, platform, and server-side responsibilities in a training app.",
    "desc": "Mobile application assessment workflows.",
    "sources": [
      "Signal Vault"
    ]
  },
  {
    "id": "frida",
    "kind": "toolkit",
    "title": "Frida",
    "url": "https://frida.re/",
    "groups": [
      "Mobile Security"
    ],
    "module": "mobileot",
    "roles": [
      "appsec"
    ],
    "task": "Map client, platform, and server-side responsibilities in a training app.",
    "desc": "Dynamic instrumentation for authorized software analysis.",
    "sources": [
      "Signal Vault"
    ]
  },
  {
    "id": "objection",
    "kind": "toolkit",
    "title": "Objection",
    "url": "https://objection.sensepost.com/",
    "groups": [
      "Mobile Security"
    ],
    "module": "mobileot",
    "roles": [
      "appsec"
    ],
    "task": "Map client, platform, and server-side responsibilities in a training app.",
    "desc": "Mobile instrumentation and assessment workflows.",
    "sources": [
      "Signal Vault"
    ]
  },
  {
    "id": "john-the-ripper",
    "kind": "toolkit",
    "title": "John the Ripper",
    "url": "https://www.openwall.com/john/",
    "groups": [
      "Password & Credential Auditing"
    ],
    "module": "credentialaudit",
    "roles": [
      "pentest"
    ],
    "task": "Compare audit evidence and controls using synthetic data only.",
    "desc": "Password-verification auditing with authorized data.",
    "sources": [
      "Signal Vault"
    ]
  },
  {
    "id": "hashcat",
    "kind": "toolkit",
    "title": "Hashcat",
    "url": "https://hashcat.net/hashcat/",
    "groups": [
      "Password & Credential Auditing"
    ],
    "module": "credentialaudit",
    "roles": [
      "pentest"
    ],
    "task": "Compare audit evidence and controls using synthetic data only.",
    "desc": "Accelerated offline password-verification auditing.",
    "sources": [
      "Signal Vault"
    ]
  },
  {
    "id": "kali-linux",
    "kind": "toolkit",
    "title": "Kali Linux",
    "url": "https://www.kali.org/",
    "groups": [
      "Lab & Training Environments",
      "Penetration Tester / Red Team"
    ],
    "module": "labsetup",
    "roles": [
      "pentest"
    ],
    "task": "Read the platform rules and build a scoped, isolated exercise.",
    "desc": "A distribution of security-testing tools and documentation.",
    "sources": [
      "Signal Vault",
      "Tools by Role"
    ]
  },
  {
    "id": "tryhackme",
    "kind": "toolkit",
    "title": "TryHackMe",
    "url": "https://tryhackme.com/",
    "groups": [
      "Lab & Training Environments"
    ],
    "module": "labsetup",
    "roles": [
      "pentest"
    ],
    "task": "Read the platform rules and build a scoped, isolated exercise.",
    "desc": "Provider-hosted learning paths and lab environments.",
    "sources": [
      "Signal Vault"
    ]
  },
  {
    "id": "hack-the-box",
    "kind": "toolkit",
    "title": "Hack The Box",
    "url": "https://www.hackthebox.com/",
    "groups": [
      "Lab & Training Environments"
    ],
    "module": "labsetup",
    "roles": [
      "pentest"
    ],
    "task": "Read the platform rules and build a scoped, isolated exercise.",
    "desc": "Security practice and training environments.",
    "sources": [
      "Signal Vault"
    ]
  },
  {
    "id": "dvwa",
    "kind": "toolkit",
    "title": "DVWA",
    "url": "https://github.com/digininja/DVWA",
    "groups": [
      "Lab & Training Environments"
    ],
    "module": "labsetup",
    "roles": [
      "pentest"
    ],
    "task": "Read the platform rules and build a scoped, isolated exercise.",
    "desc": "A deliberately vulnerable web application for isolated practice.",
    "sources": [
      "Signal Vault"
    ]
  },
  {
    "id": "metasploitable",
    "kind": "toolkit",
    "title": "Metasploitable",
    "url": "https://docs.rapid7.com/metasploit/metasploitable-2/",
    "groups": [
      "Lab & Training Environments"
    ],
    "module": "labsetup",
    "roles": [
      "pentest"
    ],
    "task": "Read the platform rules and build a scoped, isolated exercise.",
    "desc": "Legacy vulnerable VM teaching environments; keep isolated.",
    "sources": [
      "Signal Vault"
    ]
  },
  {
    "id": "picoctf",
    "kind": "toolkit",
    "title": "picoCTF",
    "url": "https://cylabacademy.org/",
    "groups": [
      "Lab & Training Environments"
    ],
    "module": "labsetup",
    "roles": [
      "pentest"
    ],
    "task": "Read the platform rules and build a scoped, isolated exercise.",
    "desc": "Historical learning brand; continue at CyLab Security Academy.",
    "sources": [
      "Signal Vault"
    ],
    "status": "Learning platform moved"
  },
  {
    "id": "ctftime-org",
    "kind": "toolkit",
    "title": "CTFtime.org",
    "url": "https://ctftime.org/",
    "groups": [
      "Lab & Training Environments"
    ],
    "module": "labsetup",
    "roles": [
      "pentest"
    ],
    "task": "Read the platform rules and build a scoped, isolated exercise.",
    "desc": "A directory of capture-the-flag events and teams.",
    "sources": [
      "Signal Vault"
    ]
  },
  {
    "id": "hackerone",
    "kind": "toolkit",
    "title": "HackerOne",
    "url": "https://www.hackerone.com/",
    "groups": [
      "Lab & Training Environments"
    ],
    "module": "labsetup",
    "roles": [
      "pentest"
    ],
    "task": "Read the platform rules and build a scoped, isolated exercise.",
    "desc": "Coordinated disclosure and program-specific assessment scopes.",
    "sources": [
      "Signal Vault"
    ]
  },
  {
    "id": "bugcrowd",
    "kind": "toolkit",
    "title": "Bugcrowd",
    "url": "https://www.bugcrowd.com/",
    "groups": [
      "Lab & Training Environments"
    ],
    "module": "labsetup",
    "roles": [
      "pentest"
    ],
    "task": "Read the platform rules and build a scoped, isolated exercise.",
    "desc": "Vulnerability-disclosure programs and program-specific rules.",
    "sources": [
      "Signal Vault"
    ]
  },
  {
    "id": "splunk-enterprise-security",
    "kind": "toolkit",
    "title": "Splunk Enterprise Security",
    "url": "https://www.splunk.com/en_us/products/enterprise-security.html",
    "groups": [
      "SOC Analyst"
    ],
    "module": "defense",
    "roles": [
      "SOC Analyst"
    ],
    "task": "Connect event collection to triage, detection, and escalation.",
    "desc": "Enterprise event-analysis and security-operations workflows.",
    "sources": [
      "Tools by Role"
    ]
  },
  {
    "id": "microsoft-sentinel",
    "kind": "toolkit",
    "title": "Microsoft Sentinel",
    "url": "https://azure.microsoft.com/en-us/products/microsoft-sentinel",
    "groups": [
      "SOC Analyst"
    ],
    "module": "defense",
    "roles": [
      "SOC Analyst"
    ],
    "task": "Connect event collection to triage, detection, and escalation.",
    "desc": "Cloud security monitoring and investigation workflows.",
    "sources": [
      "Tools by Role"
    ]
  },
  {
    "id": "ibm-qradar",
    "kind": "toolkit",
    "title": "IBM QRadar",
    "url": "https://www.ibm.com/qradar",
    "groups": [
      "SOC Analyst"
    ],
    "module": "defense",
    "roles": [
      "SOC Analyst"
    ],
    "task": "Connect event collection to triage, detection, and escalation.",
    "desc": "Enterprise security-event correlation workflows.",
    "sources": [
      "Tools by Role"
    ]
  },
  {
    "id": "burp-suite-professional",
    "kind": "toolkit",
    "title": "Burp Suite Professional",
    "url": "https://portswigger.net/burp/pro",
    "groups": [
      "Penetration Tester / Red Team"
    ],
    "module": "assessment",
    "roles": [
      "Penetration Tester / Red Team"
    ],
    "task": "Scope an assessment and distinguish a tool finding from a validated risk.",
    "desc": "Commercial application-testing workflows; compare current editions.",
    "sources": [
      "Tools by Role"
    ]
  },
  {
    "id": "cobalt-strike",
    "kind": "toolkit",
    "title": "Cobalt Strike",
    "url": "https://www.cobaltstrike.com/",
    "groups": [
      "Penetration Tester / Red Team"
    ],
    "module": "assessment",
    "roles": [
      "Penetration Tester / Red Team"
    ],
    "task": "Scope an assessment and distinguish a tool finding from a validated risk.",
    "desc": "Adversary-simulation platform; reference and detection orientation only.",
    "sources": [
      "Tools by Role"
    ]
  },
  {
    "id": "ida-pro",
    "kind": "toolkit",
    "title": "IDA Pro",
    "url": "https://hex-rays.com/ida-pro/",
    "groups": [
      "Forensics & Malware Analyst"
    ],
    "module": "malware",
    "roles": [
      "Forensics & Malware Analyst"
    ],
    "task": "Compare file, memory, and runtime observations without executing unknown code on your host.",
    "desc": "Software disassembly and reverse-engineering workflows.",
    "sources": [
      "Tools by Role"
    ]
  },
  {
    "id": "ftk-imager-ftk",
    "kind": "toolkit",
    "title": "FTK Imager / FTK",
    "url": "https://www.exterro.com/ftk-imager",
    "groups": [
      "Forensics & Malware Analyst"
    ],
    "module": "malware",
    "roles": [
      "Forensics & Malware Analyst"
    ],
    "task": "Compare file, memory, and runtime observations without executing unknown code on your host.",
    "desc": "Forensic acquisition and analysis products; distinguish editions.",
    "sources": [
      "Tools by Role"
    ]
  },
  {
    "id": "magnet-axiom",
    "kind": "toolkit",
    "title": "Magnet AXIOM",
    "url": "https://www.magnetforensics.com/products/magnet-axiom/",
    "groups": [
      "Forensics & Malware Analyst"
    ],
    "module": "malware",
    "roles": [
      "Forensics & Malware Analyst"
    ],
    "task": "Compare file, memory, and runtime observations without executing unknown code on your host.",
    "desc": "Digital-forensic artifact collection and analysis.",
    "sources": [
      "Tools by Role"
    ]
  },
  {
    "id": "semgrep",
    "kind": "toolkit",
    "title": "Semgrep",
    "url": "https://semgrep.dev/",
    "groups": [
      "AppSec / DevSecOps Engineer"
    ],
    "module": "webdepth",
    "roles": [
      "AppSec / DevSecOps Engineer"
    ],
    "task": "Connect code, dependency, and runtime observations to a mitigation.",
    "desc": "Rule-driven source-code analysis.",
    "sources": [
      "Tools by Role"
    ]
  },
  {
    "id": "snyk",
    "kind": "toolkit",
    "title": "Snyk",
    "url": "https://snyk.io/",
    "groups": [
      "AppSec / DevSecOps Engineer"
    ],
    "module": "webdepth",
    "roles": [
      "AppSec / DevSecOps Engineer"
    ],
    "task": "Connect code, dependency, and runtime observations to a mitigation.",
    "desc": "Dependency and application-security review workflows.",
    "sources": [
      "Tools by Role"
    ]
  },
  {
    "id": "checkmarx",
    "kind": "toolkit",
    "title": "Checkmarx",
    "url": "https://checkmarx.com/",
    "groups": [
      "AppSec / DevSecOps Engineer"
    ],
    "module": "webdepth",
    "roles": [
      "AppSec / DevSecOps Engineer"
    ],
    "task": "Connect code, dependency, and runtime observations to a mitigation.",
    "desc": "Enterprise source-code and application-risk analysis.",
    "sources": [
      "Tools by Role"
    ]
  },
  {
    "id": "wiz",
    "kind": "toolkit",
    "title": "Wiz",
    "url": "https://www.wiz.io/",
    "groups": [
      "Cloud Security Engineer"
    ],
    "module": "cloud",
    "roles": [
      "Cloud Security Engineer"
    ],
    "task": "Review identity, deployment, and configuration boundaries.",
    "desc": "Cloud configuration and workload-risk analysis.",
    "sources": [
      "Tools by Role"
    ]
  },
  {
    "id": "keycloak",
    "kind": "toolkit",
    "title": "Keycloak",
    "url": "https://www.keycloak.org/",
    "groups": [
      "IAM Engineer"
    ],
    "module": "identity",
    "roles": [
      "IAM Engineer"
    ],
    "task": "Explain identity lifecycle, federation, access decisions, and revocation.",
    "desc": "Identity federation and access-management workflows.",
    "sources": [
      "Tools by Role"
    ]
  },
  {
    "id": "freeipa",
    "kind": "toolkit",
    "title": "FreeIPA",
    "url": "https://www.freeipa.org/",
    "groups": [
      "IAM Engineer"
    ],
    "module": "identity",
    "roles": [
      "IAM Engineer"
    ],
    "task": "Explain identity lifecycle, federation, access decisions, and revocation.",
    "desc": "Centralized identity, policy, and directory administration.",
    "sources": [
      "Tools by Role"
    ]
  },
  {
    "id": "okta",
    "kind": "toolkit",
    "title": "Okta",
    "url": "https://www.okta.com/",
    "groups": [
      "IAM Engineer"
    ],
    "module": "identity",
    "roles": [
      "IAM Engineer"
    ],
    "task": "Explain identity lifecycle, federation, access decisions, and revocation.",
    "desc": "Identity and access-lifecycle services.",
    "sources": [
      "Tools by Role"
    ]
  },
  {
    "id": "microsoft-entra-id-azure-ad",
    "kind": "toolkit",
    "title": "Microsoft Entra ID (Azure AD)",
    "url": "https://www.microsoft.com/en-us/security/business/identity-access/microsoft-entra-id",
    "groups": [
      "IAM Engineer"
    ],
    "module": "identity",
    "roles": [
      "IAM Engineer"
    ],
    "task": "Explain identity lifecycle, federation, access decisions, and revocation.",
    "desc": "Cloud identity, federation, and access-policy administration.",
    "sources": [
      "Tools by Role"
    ]
  },
  {
    "id": "ping-identity",
    "kind": "toolkit",
    "title": "Ping Identity",
    "url": "https://www.pingidentity.com/",
    "groups": [
      "IAM Engineer"
    ],
    "module": "identity",
    "roles": [
      "IAM Engineer"
    ],
    "task": "Explain identity lifecycle, federation, access decisions, and revocation.",
    "desc": "Identity and federation services.",
    "sources": [
      "Tools by Role"
    ]
  },
  {
    "id": "eramba",
    "kind": "toolkit",
    "title": "Eramba",
    "url": "https://www.eramba.org/",
    "groups": [
      "GRC / Compliance Analyst"
    ],
    "module": "grc",
    "roles": [
      "GRC / Compliance Analyst"
    ],
    "task": "Map a risk to a control, owner, evidence artifact, and review date.",
    "desc": "Governance, risk, and control evidence management.",
    "sources": [
      "Tools by Role"
    ]
  },
  {
    "id": "vanta",
    "kind": "toolkit",
    "title": "Vanta",
    "url": "https://www.vanta.com/",
    "groups": [
      "GRC / Compliance Analyst"
    ],
    "module": "grc",
    "roles": [
      "GRC / Compliance Analyst"
    ],
    "task": "Map a risk to a control, owner, evidence artifact, and review date.",
    "desc": "Compliance evidence and control-monitoring workflows.",
    "sources": [
      "Tools by Role"
    ]
  },
  {
    "id": "onetrust",
    "kind": "toolkit",
    "title": "OneTrust",
    "url": "https://www.onetrust.com/",
    "groups": [
      "GRC / Compliance Analyst"
    ],
    "module": "grc",
    "roles": [
      "GRC / Compliance Analyst"
    ],
    "task": "Map a risk to a control, owner, evidence artifact, and review date.",
    "desc": "Privacy and governance workflows.",
    "sources": [
      "Tools by Role"
    ]
  },
  {
    "id": "servicenow-grc",
    "kind": "toolkit",
    "title": "ServiceNow GRC",
    "url": "https://www.servicenow.com/products/governance-risk-compliance.html",
    "groups": [
      "GRC / Compliance Analyst"
    ],
    "module": "grc",
    "roles": [
      "GRC / Compliance Analyst"
    ],
    "task": "Map a risk to a control, owner, evidence artifact, and review date.",
    "desc": "Risk, control, and organizational accountability workflows.",
    "sources": [
      "Tools by Role"
    ]
  },
  {
    "id": "pytorch",
    "kind": "toolkit",
    "title": "PyTorch",
    "url": "https://pytorch.org/",
    "groups": [
      "ML / AI Engineer"
    ],
    "module": "mobileot",
    "roles": [
      "ML / AI Engineer"
    ],
    "task": "Track data and model provenance, evaluation, access, and deployment.",
    "desc": "ML model development and evaluation framework.",
    "sources": [
      "Tools by Role"
    ]
  },
  {
    "id": "tensorflow",
    "kind": "toolkit",
    "title": "TensorFlow",
    "url": "https://www.tensorflow.org/",
    "groups": [
      "ML / AI Engineer"
    ],
    "module": "mobileot",
    "roles": [
      "ML / AI Engineer"
    ],
    "task": "Track data and model provenance, evaluation, access, and deployment.",
    "desc": "ML model development and deployment framework.",
    "sources": [
      "Tools by Role"
    ]
  },
  {
    "id": "mlflow",
    "kind": "toolkit",
    "title": "MLflow",
    "url": "https://mlflow.org/",
    "groups": [
      "ML / AI Engineer"
    ],
    "module": "mobileot",
    "roles": [
      "ML / AI Engineer"
    ],
    "task": "Track data and model provenance, evaluation, access, and deployment.",
    "desc": "Experiment and model-lifecycle tracking.",
    "sources": [
      "Tools by Role"
    ]
  },
  {
    "id": "hugging-face-open-models-hub",
    "kind": "toolkit",
    "title": "Hugging Face (open models/hub)",
    "url": "https://huggingface.co/",
    "groups": [
      "ML / AI Engineer"
    ],
    "module": "mobileot",
    "roles": [
      "ML / AI Engineer"
    ],
    "task": "Track data and model provenance, evaluation, access, and deployment.",
    "desc": "Model and dataset distribution with provenance and access considerations.",
    "sources": [
      "Tools by Role"
    ]
  },
  {
    "id": "weights-biases",
    "kind": "toolkit",
    "title": "Weights & Biases",
    "url": "https://wandb.ai/",
    "groups": [
      "ML / AI Engineer"
    ],
    "module": "mobileot",
    "roles": [
      "ML / AI Engineer"
    ],
    "task": "Track data and model provenance, evaluation, access, and deployment.",
    "desc": "Experiment tracking and model evaluation workflows.",
    "sources": [
      "Tools by Role"
    ]
  },
  {
    "id": "mitre-att-ck-navigator",
    "kind": "toolkit",
    "title": "MITRE ATT&CK Navigator",
    "url": "https://mitre-attack.github.io/attack-navigator/",
    "groups": [
      "CISO / Leadership"
    ],
    "module": "professional",
    "roles": [
      "CISO / Leadership"
    ],
    "task": "Connect risk and operational evidence to an accountable decision.",
    "desc": "Visual organization of ATT&CK behavior and coverage hypotheses.",
    "sources": [
      "Tools by Role"
    ]
  },
  {
    "id": "servicenow-security-operations",
    "kind": "toolkit",
    "title": "ServiceNow Security Operations",
    "url": "https://www.servicenow.com/products/security-operations.html",
    "groups": [
      "CISO / Leadership"
    ],
    "module": "professional",
    "roles": [
      "CISO / Leadership"
    ],
    "task": "Connect risk and operational evidence to an accountable decision.",
    "desc": "Security incident and vulnerability-response coordination.",
    "sources": [
      "Tools by Role"
    ]
  },
  {
    "id": "rsa-archer",
    "kind": "toolkit",
    "title": "RSA Archer",
    "url": "https://www.archerirm.com/",
    "groups": [
      "CISO / Leadership"
    ],
    "module": "professional",
    "roles": [
      "CISO / Leadership"
    ],
    "task": "Connect risk and operational evidence to an accountable decision.",
    "desc": "Enterprise risk and control-management workflows.",
    "sources": [
      "Tools by Role"
    ]
  },
  {
    "id": "virustotal",
    "kind": "toolkit",
    "title": "VirusTotal",
    "url": "https://www.virustotal.com/",
    "groups": [
      "Threat Intelligence & IOC Lookup"
    ],
    "module": "intel",
    "roles": [
      "soc"
    ],
    "task": "Corroborate an indicator with context, time, and local evidence.",
    "desc": "Artifact and indicator reputation context; consider submission privacy.",
    "sources": [
      "OSINT & Threat Intel"
    ]
  },
  {
    "id": "alienvault-otx",
    "kind": "toolkit",
    "title": "AlienVault OTX",
    "url": "https://otx.alienvault.com/",
    "groups": [
      "Threat Intelligence & IOC Lookup"
    ],
    "module": "intel",
    "roles": [
      "soc"
    ],
    "task": "Corroborate an indicator with context, time, and local evidence.",
    "desc": "Community threat-observation sharing.",
    "sources": [
      "OSINT & Threat Intel"
    ]
  },
  {
    "id": "urlscan-io",
    "kind": "toolkit",
    "title": "urlscan.io",
    "url": "https://urlscan.io/",
    "groups": [
      "Threat Intelligence & IOC Lookup"
    ],
    "module": "intel",
    "roles": [
      "soc"
    ],
    "task": "Corroborate an indicator with context, time, and local evidence.",
    "desc": "Webpage observation and analysis; submissions can disclose sensitive URLs.",
    "sources": [
      "OSINT & Threat Intel"
    ]
  },
  {
    "id": "abuseipdb",
    "kind": "toolkit",
    "title": "AbuseIPDB",
    "url": "https://www.abuseipdb.com/",
    "groups": [
      "Threat Intelligence & IOC Lookup"
    ],
    "module": "intel",
    "roles": [
      "soc"
    ],
    "task": "Corroborate an indicator with context, time, and local evidence.",
    "desc": "Community IP reputation signals requiring corroboration.",
    "sources": [
      "OSINT & Threat Intel"
    ]
  },
  {
    "id": "greynoise",
    "kind": "toolkit",
    "title": "GreyNoise",
    "url": "https://viz.greynoise.io/",
    "groups": [
      "Threat Intelligence & IOC Lookup"
    ],
    "module": "intel",
    "roles": [
      "soc"
    ],
    "task": "Corroborate an indicator with context, time, and local evidence.",
    "desc": "Context for observed internet scanning and background activity.",
    "sources": [
      "OSINT & Threat Intel"
    ]
  },
  {
    "id": "whois-lookup",
    "kind": "toolkit",
    "title": "WHOIS Lookup",
    "url": "https://who.is/",
    "groups": [
      "Domain & Network Intelligence"
    ],
    "module": "recon",
    "roles": [
      "pentest"
    ],
    "task": "Distinguish historical, registration, DNS, and current ownership evidence.",
    "desc": "Domain registration lookup; ownership and identity need corroboration.",
    "sources": [
      "OSINT & Threat Intel"
    ]
  },
  {
    "id": "dnsdumpster",
    "kind": "toolkit",
    "title": "DNSDumpster",
    "url": "https://dnsdumpster.com/",
    "groups": [
      "Domain & Network Intelligence"
    ],
    "module": "recon",
    "roles": [
      "pentest"
    ],
    "task": "Distinguish historical, registration, DNS, and current ownership evidence.",
    "desc": "DNS-related asset leads and relationship observations.",
    "sources": [
      "OSINT & Threat Intel"
    ]
  },
  {
    "id": "securitytrails",
    "kind": "toolkit",
    "title": "SecurityTrails",
    "url": "https://securitytrails.com/",
    "groups": [
      "Domain & Network Intelligence"
    ],
    "module": "recon",
    "roles": [
      "pentest"
    ],
    "task": "Distinguish historical, registration, DNS, and current ownership evidence.",
    "desc": "Domain and infrastructure history for contextual research.",
    "sources": [
      "OSINT & Threat Intel"
    ]
  },
  {
    "id": "bellingcat-s-online-investigation-toolkit",
    "kind": "toolkit",
    "title": "Bellingcat's Online Investigation Toolkit",
    "url": "https://www.bellingcat.com/resources/how-tos/",
    "groups": [
      "OSINT Methodology & Frameworks"
    ],
    "module": "intel",
    "roles": [
      "grc"
    ],
    "task": "Write an intelligence question with collection and privacy limits.",
    "desc": "Methods and utilities for evidence-based open-source investigations.",
    "sources": [
      "OSINT & Threat Intel"
    ]
  },
  {
    "id": "bellingcat-resources-library",
    "kind": "toolkit",
    "title": "Bellingcat Resources Library",
    "url": "https://www.bellingcat.com/category/resources/",
    "groups": [
      "OSINT Methodology & Frameworks"
    ],
    "module": "intel",
    "roles": [
      "grc"
    ],
    "task": "Write an intelligence question with collection and privacy limits.",
    "desc": "Research methods and verification-oriented reading.",
    "sources": [
      "OSINT & Threat Intel"
    ]
  },
  {
    "id": "sans-sec487",
    "kind": "toolkit",
    "title": "SANS SEC487",
    "url": "https://www.sans.org/cyber-security-courses/open-source-intelligence-gathering-analysis-production/",
    "groups": [
      "OSINT Methodology & Frameworks"
    ],
    "module": "intel",
    "roles": [
      "grc"
    ],
    "task": "Write an intelligence question with collection and privacy limits.",
    "desc": "Provider-led OSINT training reference; check current course details.",
    "sources": [
      "OSINT & Threat Intel"
    ]
  },
  {
    "id": "rdap-lookup",
    "kind": "toolkit",
    "title": "RDAP Lookup",
    "url": "https://client.rdap.org/",
    "groups": [
      "Investigation Utilities"
    ],
    "module": "intel",
    "roles": [
      "dfir"
    ],
    "task": "Validate a transformation or observation and preserve its provenance.",
    "desc": "Structured registration-data retrieval.",
    "sources": [
      "OSINT & Threat Intel"
    ]
  },
  {
    "id": "zxing-qr-code-decoder",
    "kind": "toolkit",
    "title": "ZXing QR Code Decoder",
    "url": "https://zxing.org/w/decode.jspx",
    "groups": [
      "Investigation Utilities"
    ],
    "module": "intel",
    "roles": [
      "dfir"
    ],
    "task": "Validate a transformation or observation and preserve its provenance.",
    "desc": "Decode a QR payload before deciding whether to visit it.",
    "sources": [
      "OSINT & Threat Intel"
    ]
  },
  {
    "id": "epoch-converter",
    "kind": "toolkit",
    "title": "Epoch Converter",
    "url": "https://www.epochconverter.com/",
    "groups": [
      "Investigation Utilities"
    ],
    "module": "intel",
    "roles": [
      "dfir"
    ],
    "task": "Validate a transformation or observation and preserve its provenance.",
    "desc": "Time representation conversion; record the original units and zone.",
    "sources": [
      "OSINT & Threat Intel"
    ]
  },
  {
    "id": "cert-spotter",
    "kind": "toolkit",
    "title": "Cert Spotter",
    "url": "https://sslmate.com/certspotter/",
    "groups": [
      "Investigation Utilities"
    ],
    "module": "intel",
    "roles": [
      "dfir"
    ],
    "task": "Validate a transformation or observation and preserve its provenance.",
    "desc": "Certificate-transparency monitoring and observation.",
    "sources": [
      "OSINT & Threat Intel"
    ]
  },
  {
    "id": "webbkoll",
    "kind": "toolkit",
    "title": "Webbkoll",
    "url": "https://webbkoll.dataskydd.net/",
    "groups": [
      "Investigation Utilities"
    ],
    "module": "intel",
    "roles": [
      "dfir"
    ],
    "task": "Validate a transformation or observation and preserve its provenance.",
    "desc": "Website privacy and security observation.",
    "sources": [
      "OSINT & Threat Intel"
    ]
  },
  {
    "id": "jeffrey-s-exif-viewer",
    "kind": "toolkit",
    "title": "Jeffrey's Exif Viewer",
    "url": "http://exif.regex.info/exif.cgi",
    "groups": [
      "File & Metadata Forensics"
    ],
    "module": "forensics",
    "roles": [
      "dfir"
    ],
    "task": "Inspect only authorized artifacts and explain what metadata can and cannot prove.",
    "desc": "Image metadata inspection; avoid uploading confidential images.",
    "sources": [
      "OSINT & Threat Intel"
    ],
    "status": "External upload; avoid private files"
  },
  {
    "id": "exiftool",
    "kind": "toolkit",
    "title": "ExifTool",
    "url": "https://exiftool.org/",
    "groups": [
      "File & Metadata Forensics"
    ],
    "module": "forensics",
    "roles": [
      "dfir"
    ],
    "task": "Inspect only authorized artifacts and explain what metadata can and cannot prove.",
    "desc": "Local file metadata reading and transformation.",
    "sources": [
      "OSINT & Threat Intel"
    ]
  },
  {
    "id": "forensically-29a-ch",
    "kind": "toolkit",
    "title": "Forensically (29a.ch)",
    "url": "https://29a.ch/photo-forensics/",
    "groups": [
      "File & Metadata Forensics"
    ],
    "module": "forensics",
    "roles": [
      "dfir"
    ],
    "task": "Inspect only authorized artifacts and explain what metadata can and cannot prove.",
    "desc": "Image-analysis utilities; results need contextual interpretation.",
    "sources": [
      "OSINT & Threat Intel"
    ]
  },
  {
    "id": "zsteg",
    "kind": "toolkit",
    "title": "zsteg",
    "url": "https://github.com/zed-0xff/zsteg",
    "groups": [
      "File & Metadata Forensics"
    ],
    "module": "forensics",
    "roles": [
      "dfir"
    ],
    "task": "Inspect only authorized artifacts and explain what metadata can and cannot prove.",
    "desc": "Inspection of steganographic patterns in supported image formats.",
    "sources": [
      "OSINT & Threat Intel"
    ]
  },
  {
    "id": "nist-cybersecurity-framework-csf-2-0",
    "kind": "frameworks",
    "title": "NIST Cybersecurity Framework (CSF 2.0)",
    "url": "https://www.nist.gov/cyberframework",
    "groups": [
      "Frameworks & White Papers"
    ],
    "module": "professional",
    "roles": [
      "grc"
    ],
    "task": "Read the primary source and record scope, revision, and evidence requirements.",
    "desc": "Compare purpose, scope, revision, and the evidence required to apply this reference.",
    "sources": [
      "Standards & Law"
    ]
  },
  {
    "id": "nist-sp-800-53",
    "kind": "frameworks",
    "title": "NIST SP 800-53",
    "url": "https://csrc.nist.gov/pubs/sp/800/53/r5/upd1/final",
    "groups": [
      "Frameworks & White Papers"
    ],
    "module": "professional",
    "roles": [
      "grc"
    ],
    "task": "Read the primary source and record scope, revision, and evidence requirements.",
    "desc": "Compare purpose, scope, revision, and the evidence required to apply this reference.",
    "sources": [
      "Standards & Law"
    ]
  },
  {
    "id": "nist-sp-800-171",
    "kind": "frameworks",
    "title": "NIST SP 800-171",
    "url": "https://csrc.nist.gov/pubs/sp/800/171/r3/final",
    "groups": [
      "Frameworks & White Papers"
    ],
    "module": "professional",
    "roles": [
      "grc"
    ],
    "task": "Read the primary source and record scope, revision, and evidence requirements.",
    "desc": "Compare purpose, scope, revision, and the evidence required to apply this reference.",
    "sources": [
      "Standards & Law"
    ]
  },
  {
    "id": "iso-iec-27001",
    "kind": "frameworks",
    "title": "ISO/IEC 27001",
    "url": "https://www.iso.org/standard/27001",
    "groups": [
      "Frameworks & White Papers"
    ],
    "module": "professional",
    "roles": [
      "grc"
    ],
    "task": "Read the primary source and record scope, revision, and evidence requirements.",
    "desc": "Compare purpose, scope, revision, and the evidence required to apply this reference.",
    "sources": [
      "Standards & Law"
    ]
  },
  {
    "id": "cis-critical-security-controls",
    "kind": "frameworks",
    "title": "CIS Critical Security Controls",
    "url": "https://www.cisecurity.org/controls",
    "groups": [
      "Frameworks & White Papers"
    ],
    "module": "professional",
    "roles": [
      "grc"
    ],
    "task": "Read the primary source and record scope, revision, and evidence requirements.",
    "desc": "Compare purpose, scope, revision, and the evidence required to apply this reference.",
    "sources": [
      "Standards & Law"
    ]
  },
  {
    "id": "mitre-att-ck",
    "kind": "frameworks",
    "title": "MITRE ATT&CK",
    "url": "https://attack.mitre.org/",
    "groups": [
      "Frameworks & White Papers"
    ],
    "module": "professional",
    "roles": [
      "grc"
    ],
    "task": "Read the primary source and record scope, revision, and evidence requirements.",
    "desc": "Compare purpose, scope, revision, and the evidence required to apply this reference.",
    "sources": [
      "Standards & Law"
    ]
  },
  {
    "id": "mitre-d3fend",
    "kind": "frameworks",
    "title": "MITRE D3FEND",
    "url": "https://d3fend.mitre.org/",
    "groups": [
      "Frameworks & White Papers"
    ],
    "module": "professional",
    "roles": [
      "grc"
    ],
    "task": "Read the primary source and record scope, revision, and evidence requirements.",
    "desc": "Compare purpose, scope, revision, and the evidence required to apply this reference.",
    "sources": [
      "Standards & Law"
    ]
  },
  {
    "id": "mitre-cwe-common-weakness-enumeration",
    "kind": "frameworks",
    "title": "MITRE CWE (Common Weakness Enumeration)",
    "url": "https://cwe.mitre.org/",
    "groups": [
      "Frameworks & White Papers"
    ],
    "module": "professional",
    "roles": [
      "grc"
    ],
    "task": "Read the primary source and record scope, revision, and evidence requirements.",
    "desc": "Compare purpose, scope, revision, and the evidence required to apply this reference.",
    "sources": [
      "Standards & Law"
    ]
  },
  {
    "id": "owasp-top-10",
    "kind": "frameworks",
    "title": "OWASP Top 10",
    "url": "https://owasp.org/www-project-top-ten/",
    "groups": [
      "Frameworks & White Papers"
    ],
    "module": "professional",
    "roles": [
      "grc"
    ],
    "task": "Read the primary source and record scope, revision, and evidence requirements.",
    "desc": "Compare purpose, scope, revision, and the evidence required to apply this reference.",
    "sources": [
      "Standards & Law"
    ]
  },
  {
    "id": "cloud-security-alliance-research-white-papers",
    "kind": "frameworks",
    "title": "Cloud Security Alliance — Research & White Papers",
    "url": "https://cloudsecurityalliance.org/research/",
    "groups": [
      "Frameworks & White Papers"
    ],
    "module": "professional",
    "roles": [
      "grc"
    ],
    "task": "Read the primary source and record scope, revision, and evidence requirements.",
    "desc": "Compare purpose, scope, revision, and the evidence required to apply this reference.",
    "sources": [
      "Standards & Law"
    ]
  },
  {
    "id": "sans-reading-room",
    "kind": "frameworks",
    "title": "SANS Reading Room",
    "url": "https://www.sans.org/white-papers/",
    "groups": [
      "Frameworks & White Papers"
    ],
    "module": "professional",
    "roles": [
      "grc"
    ],
    "task": "Read the primary source and record scope, revision, and evidence requirements.",
    "desc": "Compare purpose, scope, revision, and the evidence required to apply this reference.",
    "sources": [
      "Standards & Law"
    ]
  },
  {
    "id": "enisa-threat-landscape-report",
    "kind": "frameworks",
    "title": "ENISA Threat Landscape Report",
    "url": "https://www.enisa.europa.eu/publications",
    "groups": [
      "Frameworks & White Papers"
    ],
    "module": "professional",
    "roles": [
      "grc"
    ],
    "task": "Read the primary source and record scope, revision, and evidence requirements.",
    "desc": "Compare purpose, scope, revision, and the evidence required to apply this reference.",
    "sources": [
      "Standards & Law"
    ]
  },
  {
    "id": "cobit",
    "kind": "frameworks",
    "title": "COBIT",
    "url": "https://www.isaca.org/resources/cobit",
    "groups": [
      "Frameworks & White Papers"
    ],
    "module": "professional",
    "roles": [
      "grc"
    ],
    "task": "Read the primary source and record scope, revision, and evidence requirements.",
    "desc": "Compare purpose, scope, revision, and the evidence required to apply this reference.",
    "sources": [
      "Standards & Law"
    ]
  },
  {
    "id": "cvss-common-vulnerability-scoring-system",
    "kind": "frameworks",
    "title": "CVSS (Common Vulnerability Scoring System)",
    "url": "https://www.first.org/cvss/",
    "groups": [
      "Frameworks & White Papers"
    ],
    "module": "professional",
    "roles": [
      "grc"
    ],
    "task": "Read the primary source and record scope, revision, and evidence requirements.",
    "desc": "Compare purpose, scope, revision, and the evidence required to apply this reference.",
    "sources": [
      "Standards & Law"
    ]
  },
  {
    "id": "owasp-top-10-for-llm-applications",
    "kind": "frameworks",
    "title": "OWASP Top 10 for LLM Applications",
    "url": "https://genai.owasp.org/llm-top-10/",
    "groups": [
      "Frameworks & White Papers"
    ],
    "module": "professional",
    "roles": [
      "grc"
    ],
    "task": "Read the primary source and record scope, revision, and evidence requirements.",
    "desc": "Compare purpose, scope, revision, and the evidence required to apply this reference.",
    "sources": [
      "Standards & Law"
    ]
  },
  {
    "id": "nist-secure-software-development-framework-ssdf",
    "kind": "frameworks",
    "title": "NIST Secure Software Development Framework (SSDF)",
    "url": "https://csrc.nist.gov/Projects/ssdf",
    "groups": [
      "Frameworks & White Papers"
    ],
    "module": "professional",
    "roles": [
      "grc"
    ],
    "task": "Read the primary source and record scope, revision, and evidence requirements.",
    "desc": "Compare purpose, scope, revision, and the evidence required to apply this reference.",
    "sources": [
      "Standards & Law"
    ]
  },
  {
    "id": "slsa-supply-chain-levels-for-software-artifacts",
    "kind": "frameworks",
    "title": "SLSA (Supply-chain Levels for Software Artifacts)",
    "url": "https://slsa.dev/",
    "groups": [
      "Frameworks & White Papers"
    ],
    "module": "professional",
    "roles": [
      "grc"
    ],
    "task": "Read the primary source and record scope, revision, and evidence requirements.",
    "desc": "Compare purpose, scope, revision, and the evidence required to apply this reference.",
    "sources": [
      "Standards & Law"
    ]
  },
  {
    "id": "nist-privacy-framework",
    "kind": "frameworks",
    "title": "NIST Privacy Framework",
    "url": "https://www.nist.gov/privacy-framework",
    "groups": [
      "Frameworks & White Papers"
    ],
    "module": "professional",
    "roles": [
      "grc"
    ],
    "task": "Read the primary source and record scope, revision, and evidence requirements.",
    "desc": "Compare purpose, scope, revision, and the evidence required to apply this reference.",
    "sources": [
      "Standards & Law"
    ]
  },
  {
    "id": "ieee-symposium-on-security-and-privacy-s-p",
    "kind": "research",
    "title": "IEEE Symposium on Security and Privacy (S&P)",
    "url": "https://www.ieee-security.org/TC/SP-Index.html",
    "groups": [
      "Academic & Research Venues"
    ],
    "module": "professional",
    "roles": [
      "grc"
    ],
    "task": "Read the primary source and record scope, revision, and evidence requirements.",
    "desc": "Read methods, evaluations, limitations, and available artifacts in original research.",
    "sources": [
      "Standards & Law"
    ]
  },
  {
    "id": "usenix-security-symposium",
    "kind": "research",
    "title": "USENIX Security Symposium",
    "url": "https://www.usenix.org/conferences/byname/108",
    "groups": [
      "Academic & Research Venues"
    ],
    "module": "professional",
    "roles": [
      "grc"
    ],
    "task": "Read the primary source and record scope, revision, and evidence requirements.",
    "desc": "Read methods, evaluations, limitations, and available artifacts in original research.",
    "sources": [
      "Standards & Law"
    ]
  },
  {
    "id": "acm-ccs-computer-and-communications-security",
    "kind": "research",
    "title": "ACM CCS (Computer and Communications Security)",
    "url": "https://www.sigsac.org/ccs.html",
    "groups": [
      "Academic & Research Venues"
    ],
    "module": "professional",
    "roles": [
      "grc"
    ],
    "task": "Read the primary source and record scope, revision, and evidence requirements.",
    "desc": "Read methods, evaluations, limitations, and available artifacts in original research.",
    "sources": [
      "Standards & Law"
    ]
  },
  {
    "id": "ndss-network-and-distributed-system-security",
    "kind": "research",
    "title": "NDSS (Network and Distributed System Security)",
    "url": "https://www.ndss-symposium.org/",
    "groups": [
      "Academic & Research Venues"
    ],
    "module": "professional",
    "roles": [
      "grc"
    ],
    "task": "Read the primary source and record scope, revision, and evidence requirements.",
    "desc": "Read methods, evaluations, limitations, and available artifacts in original research.",
    "sources": [
      "Standards & Law"
    ]
  },
  {
    "id": "ieee-transactions-on-dependable-and-secure-computing",
    "kind": "research",
    "title": "IEEE Transactions on Dependable and Secure Computing",
    "url": "https://www.computer.org/csdl/journal/tq",
    "groups": [
      "Academic & Research Venues"
    ],
    "module": "professional",
    "roles": [
      "grc"
    ],
    "task": "Read the primary source and record scope, revision, and evidence requirements.",
    "desc": "Read methods, evaluations, limitations, and available artifacts in original research.",
    "sources": [
      "Standards & Law"
    ]
  },
  {
    "id": "acm-transactions-on-privacy-and-security-tops",
    "kind": "research",
    "title": "ACM Transactions on Privacy and Security (TOPS)",
    "url": "https://dl.acm.org/journal/tops",
    "groups": [
      "Academic & Research Venues"
    ],
    "module": "professional",
    "roles": [
      "grc"
    ],
    "task": "Read the primary source and record scope, revision, and evidence requirements.",
    "desc": "Read methods, evaluations, limitations, and available artifacts in original research.",
    "sources": [
      "Standards & Law"
    ]
  },
  {
    "id": "nist",
    "kind": "institutions",
    "title": "NIST",
    "url": "https://www.nist.gov/",
    "groups": [
      "Standards Organizations"
    ],
    "module": "professional",
    "roles": [
      "grc"
    ],
    "task": "Read the primary source and record scope, revision, and evidence requirements.",
    "desc": "Find the organization’s original publications, advisories, and technical resources.",
    "sources": [
      "Standards & Law"
    ]
  },
  {
    "id": "iso-iec",
    "kind": "institutions",
    "title": "ISO / IEC",
    "url": "https://www.iso.org/",
    "groups": [
      "Standards Organizations"
    ],
    "module": "professional",
    "roles": [
      "grc"
    ],
    "task": "Read the primary source and record scope, revision, and evidence requirements.",
    "desc": "Find the organization’s original publications, advisories, and technical resources.",
    "sources": [
      "Standards & Law"
    ]
  },
  {
    "id": "enisa",
    "kind": "institutions",
    "title": "ENISA",
    "url": "https://www.enisa.europa.eu/",
    "groups": [
      "Standards Organizations"
    ],
    "module": "professional",
    "roles": [
      "grc"
    ],
    "task": "Read the primary source and record scope, revision, and evidence requirements.",
    "desc": "Find the organization’s original publications, advisories, and technical resources.",
    "sources": [
      "Standards & Law"
    ]
  },
  {
    "id": "mitre",
    "kind": "institutions",
    "title": "MITRE",
    "url": "https://www.mitre.org/",
    "groups": [
      "Standards Organizations"
    ],
    "module": "professional",
    "roles": [
      "grc"
    ],
    "task": "Read the primary source and record scope, revision, and evidence requirements.",
    "desc": "Find the organization’s original publications, advisories, and technical resources.",
    "sources": [
      "Standards & Law"
    ]
  },
  {
    "id": "owasp",
    "kind": "institutions",
    "title": "OWASP",
    "url": "https://owasp.org/",
    "groups": [
      "Standards Organizations"
    ],
    "module": "professional",
    "roles": [
      "grc"
    ],
    "task": "Read the primary source and record scope, revision, and evidence requirements.",
    "desc": "Find the organization’s original publications, advisories, and technical resources.",
    "sources": [
      "Standards & Law"
    ]
  },
  {
    "id": "cis-center-for-internet-security",
    "kind": "institutions",
    "title": "CIS (Center for Internet Security)",
    "url": "https://www.cisecurity.org/",
    "groups": [
      "Standards Organizations"
    ],
    "module": "professional",
    "roles": [
      "grc"
    ],
    "task": "Read the primary source and record scope, revision, and evidence requirements.",
    "desc": "Find the organization’s original publications, advisories, and technical resources.",
    "sources": [
      "Standards & Law"
    ]
  },
  {
    "id": "ietf",
    "kind": "institutions",
    "title": "IETF",
    "url": "https://www.ietf.org/",
    "groups": [
      "Standards Organizations"
    ],
    "module": "professional",
    "roles": [
      "grc"
    ],
    "task": "Read the primary source and record scope, revision, and evidence requirements.",
    "desc": "Find the organization’s original publications, advisories, and technical resources.",
    "sources": [
      "Standards & Law"
    ]
  },
  {
    "id": "itu-telecommunication-standardization",
    "kind": "institutions",
    "title": "ITU (Telecommunication Standardization)",
    "url": "https://www.itu.int/en/ITU-T/cybersecurity/",
    "groups": [
      "Standards Organizations"
    ],
    "module": "professional",
    "roles": [
      "grc"
    ],
    "task": "Read the primary source and record scope, revision, and evidence requirements.",
    "desc": "Find the organization’s original publications, advisories, and technical resources.",
    "sources": [
      "Standards & Law"
    ]
  },
  {
    "id": "isaca",
    "kind": "institutions",
    "title": "ISACA",
    "url": "https://www.isaca.org/",
    "groups": [
      "Standards Organizations"
    ],
    "module": "professional",
    "roles": [
      "grc"
    ],
    "task": "Read the primary source and record scope, revision, and evidence requirements.",
    "desc": "Find the organization’s original publications, advisories, and technical resources.",
    "sources": [
      "Standards & Law"
    ]
  },
  {
    "id": "cert-in",
    "kind": "institutions",
    "title": "CERT-In",
    "url": "https://www.cert-in.org.in/",
    "groups": [
      "Standards Organizations"
    ],
    "module": "professional",
    "roles": [
      "grc"
    ],
    "task": "Read the primary source and record scope, revision, and evidence requirements.",
    "desc": "Find the organization’s original publications, advisories, and technical resources.",
    "sources": [
      "Standards & Law"
    ]
  },
  {
    "id": "nciipc",
    "kind": "institutions",
    "title": "NCIIPC",
    "url": "https://nciipc.gov.in/",
    "groups": [
      "Standards Organizations"
    ],
    "module": "professional",
    "roles": [
      "grc"
    ],
    "task": "Read the primary source and record scope, revision, and evidence requirements.",
    "desc": "Find the organization’s original publications, advisories, and technical resources.",
    "sources": [
      "Standards & Law"
    ]
  },
  {
    "id": "i4c",
    "kind": "institutions",
    "title": "I4C",
    "url": "https://i4c.mha.gov.in/",
    "groups": [
      "Standards Organizations"
    ],
    "module": "professional",
    "roles": [
      "grc"
    ],
    "task": "Read the primary source and record scope, revision, and evidence requirements.",
    "desc": "Find the organization’s original publications, advisories, and technical resources.",
    "sources": [
      "Standards & Law"
    ]
  },
  {
    "id": "cyber-swachhta-kendra",
    "kind": "institutions",
    "title": "Cyber Swachhta Kendra",
    "url": "https://www.csk.gov.in/",
    "groups": [
      "Standards Organizations"
    ],
    "module": "professional",
    "roles": [
      "grc"
    ],
    "task": "Read the primary source and record scope, revision, and evidence requirements.",
    "desc": "Find the organization’s original publications, advisories, and technical resources.",
    "sources": [
      "Standards & Law"
    ]
  },
  {
    "id": "ncsc-uk",
    "kind": "institutions",
    "title": "NCSC (UK)",
    "url": "https://www.ncsc.gov.uk/",
    "groups": [
      "Standards Organizations"
    ],
    "module": "professional",
    "roles": [
      "grc"
    ],
    "task": "Read the primary source and record scope, revision, and evidence requirements.",
    "desc": "Find the organization’s original publications, advisories, and technical resources.",
    "sources": [
      "Standards & Law"
    ]
  },
  {
    "id": "first-org",
    "kind": "institutions",
    "title": "FIRST.org",
    "url": "https://www.first.org/",
    "groups": [
      "Standards Organizations"
    ],
    "module": "professional",
    "roles": [
      "grc"
    ],
    "task": "Read the primary source and record scope, revision, and evidence requirements.",
    "desc": "Find the organization’s original publications, advisories, and technical resources.",
    "sources": [
      "Standards & Law"
    ]
  },
  {
    "id": "it-act-2000-india",
    "kind": "law",
    "title": "IT Act, 2000 (India)",
    "url": "https://www.meity.gov.in/content/information-technology-act-2000",
    "groups": [
      "Laws & Acts"
    ],
    "module": "professional",
    "roles": [
      "grc"
    ],
    "task": "Read the primary source and record scope, revision, and evidence requirements.",
    "desc": "Read the primary legal source, amendments, scope, and commencement; applicability requires contextual review.",
    "sources": [
      "Standards & Law"
    ]
  },
  {
    "id": "digital-personal-data-protection-act-2023-dpdp",
    "kind": "law",
    "title": "Digital Personal Data Protection Act, 2023 (DPDP)",
    "url": "https://www.meity.gov.in/data-protection-framework",
    "groups": [
      "Laws & Acts"
    ],
    "module": "professional",
    "roles": [
      "grc"
    ],
    "task": "Read the primary source and record scope, revision, and evidence requirements.",
    "desc": "Study the Act together with the 2025 Rules and phased enforcement notices.",
    "sources": [
      "Standards & Law"
    ],
    "noteUrl": "https://www.meity.gov.in/documents/act-and-policies/digital-personal-data-protection-rules-2025-gDOxUjMtQWa?pageTitle=Digital-Personal-Data-Protection-Rules-2025%3B"
  },
  {
    "id": "indian-penal-code-ipc-cybercrime-relevant-sections",
    "kind": "law",
    "title": "Indian Penal Code (IPC) — cybercrime-relevant sections",
    "url": "https://www.indiacode.nic.in/handle/123456789/2263",
    "groups": [
      "Laws & Acts"
    ],
    "module": "professional",
    "roles": [
      "grc"
    ],
    "task": "Read the primary source and record scope, revision, and evidence requirements.",
    "desc": "Historical reference. BNS replaced the IPC from July 2024, subject to commencement and transitional provisions.",
    "sources": [
      "Standards & Law"
    ],
    "status": "Historical · see BNS",
    "noteUrl": "https://www.pib.gov.in/PressReleasePage.aspx?PRID=2082757"
  },
  {
    "id": "gdpr-eu",
    "kind": "law",
    "title": "GDPR (EU)",
    "url": "https://eur-lex.europa.eu/eli/reg/2016/679/oj",
    "groups": [
      "Laws & Acts"
    ],
    "module": "professional",
    "roles": [
      "grc"
    ],
    "task": "Read the primary source and record scope, revision, and evidence requirements.",
    "desc": "EU data-protection regulation; consult the official text and applicable guidance.",
    "sources": [
      "Standards & Law"
    ]
  },
  {
    "id": "computer-misuse-act-1990-uk",
    "kind": "law",
    "title": "Computer Misuse Act, 1990 (UK)",
    "url": "https://www.legislation.gov.uk/ukpga/1990/18/contents",
    "groups": [
      "Laws & Acts"
    ],
    "module": "professional",
    "roles": [
      "grc"
    ],
    "task": "Read the primary source and record scope, revision, and evidence requirements.",
    "desc": "Read the primary legal source, amendments, scope, and commencement; applicability requires contextual review.",
    "sources": [
      "Standards & Law"
    ]
  },
  {
    "id": "computer-fraud-and-abuse-act-cfaa-us",
    "kind": "law",
    "title": "Computer Fraud and Abuse Act (CFAA, US)",
    "url": "https://www.justice.gov/jm/jm-9-48000-computer-fraud",
    "groups": [
      "Laws & Acts"
    ],
    "module": "professional",
    "roles": [
      "grc"
    ],
    "task": "Read the primary source and record scope, revision, and evidence requirements.",
    "desc": "Read the primary legal source, amendments, scope, and commencement; applicability requires contextual review.",
    "sources": [
      "Standards & Law"
    ]
  },
  {
    "id": "hipaa-us",
    "kind": "law",
    "title": "HIPAA (US)",
    "url": "https://www.hhs.gov/hipaa/index.html",
    "groups": [
      "Laws & Acts"
    ],
    "module": "professional",
    "roles": [
      "grc"
    ],
    "task": "Read the primary source and record scope, revision, and evidence requirements.",
    "desc": "Read the primary legal source, amendments, scope, and commencement; applicability requires contextual review.",
    "sources": [
      "Standards & Law"
    ]
  },
  {
    "id": "ccpa-cpra-california-us",
    "kind": "law",
    "title": "CCPA / CPRA (California, US)",
    "url": "https://oag.ca.gov/privacy/ccpa",
    "groups": [
      "Laws & Acts"
    ],
    "module": "professional",
    "roles": [
      "grc"
    ],
    "task": "Read the primary source and record scope, revision, and evidence requirements.",
    "desc": "Read the primary legal source, amendments, scope, and commencement; applicability requires contextual review.",
    "sources": [
      "Standards & Law"
    ]
  },
  {
    "id": "pipeda-canada",
    "kind": "law",
    "title": "PIPEDA (Canada)",
    "url": "https://laws-lois.justice.gc.ca/eng/acts/p-8.6/",
    "groups": [
      "Laws & Acts"
    ],
    "module": "professional",
    "roles": [
      "grc"
    ],
    "task": "Read the primary source and record scope, revision, and evidence requirements.",
    "desc": "Read the primary legal source, amendments, scope, and commencement; applicability requires contextual review.",
    "sources": [
      "Standards & Law"
    ]
  },
  {
    "id": "pdpa-singapore",
    "kind": "law",
    "title": "PDPA (Singapore)",
    "url": "https://www.pdpc.gov.sg/overview-of-pdpa/the-legislation/personal-data-protection-act",
    "groups": [
      "Laws & Acts"
    ],
    "module": "professional",
    "roles": [
      "grc"
    ],
    "task": "Read the primary source and record scope, revision, and evidence requirements.",
    "desc": "Read the primary legal source, amendments, scope, and commencement; applicability requires contextual review.",
    "sources": [
      "Standards & Law"
    ]
  },
  {
    "id": "budapest-convention-on-cybercrime",
    "kind": "law",
    "title": "Budapest Convention on Cybercrime",
    "url": "https://rm.coe.int/1680081561",
    "groups": [
      "Laws & Acts"
    ],
    "module": "professional",
    "roles": [
      "grc"
    ],
    "task": "Read the primary source and record scope, revision, and evidence requirements.",
    "desc": "Read the primary legal source, amendments, scope, and commencement; applicability requires contextual review.",
    "sources": [
      "Standards & Law"
    ]
  },
  {
    "id": "sarbanes-oxley-act-sox-us",
    "kind": "law",
    "title": "Sarbanes-Oxley Act (SOX, US)",
    "url": "https://www.congress.gov/bill/107th-congress/house-bill/3763",
    "groups": [
      "Laws & Acts"
    ],
    "module": "professional",
    "roles": [
      "grc"
    ],
    "task": "Read the primary source and record scope, revision, and evidence requirements.",
    "desc": "Read the primary legal source, amendments, scope, and commencement; applicability requires contextual review.",
    "sources": [
      "Standards & Law"
    ]
  },
  {
    "id": "bharatiya-nyaya-sanhita-bns-2023",
    "kind": "law",
    "title": "Bharatiya Nyaya Sanhita (BNS), 2023",
    "url": "https://www.pib.gov.in/PressReleasePage.aspx?PRID=2082757",
    "groups": [
      "Laws & Acts"
    ],
    "module": "professional",
    "roles": [
      "grc"
    ],
    "task": "Read the primary source and record scope, revision, and evidence requirements.",
    "desc": "Official notice on the commencement of India’s new criminal laws; read primary text and transitional provisions for application.",
    "sources": [
      "Editorial update"
    ]
  },
  {
    "id": "comptia-security",
    "kind": "credentials",
    "title": "CompTIA Security+",
    "url": "https://www.comptia.org/certifications/security",
    "groups": [
      "Entry Level"
    ],
    "module": "professional",
    "roles": [
      "grc"
    ],
    "task": "Choose this only if its current objectives support a role and portfolio plan. Reference group follows the source, not a universal provider tier.",
    "desc": "Compare the provider’s current objectives, eligibility, exam format, maintenance requirements, and total cost.",
    "sources": [
      "Certifications"
    ],
    "status": "Provider status to check"
  },
  {
    "id": "google-cybersecurity-certificate",
    "kind": "credentials",
    "title": "Google Cybersecurity Certificate",
    "url": "https://www.coursera.org/professional-certificates/google-cybersecurity",
    "groups": [
      "Entry Level"
    ],
    "module": "professional",
    "roles": [
      "grc"
    ],
    "task": "Choose this only if its current objectives support a role and portfolio plan. Reference group follows the source, not a universal provider tier.",
    "desc": "Compare the provider’s current objectives, eligibility, exam format, maintenance requirements, and total cost.",
    "sources": [
      "Certifications"
    ],
    "status": "Provider status to check"
  },
  {
    "id": "comptia-network",
    "kind": "credentials",
    "title": "CompTIA Network+",
    "url": "https://www.comptia.org/certifications/network",
    "groups": [
      "Entry Level"
    ],
    "module": "professional",
    "roles": [
      "grc"
    ],
    "task": "Choose this only if its current objectives support a role and portfolio plan. Reference group follows the source, not a universal provider tier.",
    "desc": "Compare the provider’s current objectives, eligibility, exam format, maintenance requirements, and total cost.",
    "sources": [
      "Certifications"
    ],
    "status": "Provider status to check"
  },
  {
    "id": "aws-certified-cloud-practitioner",
    "kind": "credentials",
    "title": "AWS Certified Cloud Practitioner",
    "url": "https://aws.amazon.com/certification/certified-cloud-practitioner/",
    "groups": [
      "Entry Level"
    ],
    "module": "professional",
    "roles": [
      "grc"
    ],
    "task": "Choose this only if its current objectives support a role and portfolio plan. Reference group follows the source, not a universal provider tier.",
    "desc": "Compare the provider’s current objectives, eligibility, exam format, maintenance requirements, and total cost.",
    "sources": [
      "Certifications"
    ],
    "status": "Provider status to check"
  },
  {
    "id": "certified-ethical-hacker-ceh",
    "kind": "credentials",
    "title": "Certified Ethical Hacker (CEH)",
    "url": "https://www.eccouncil.org/train-certify/certified-ethical-hacker-ceh/",
    "groups": [
      "Associate Level"
    ],
    "module": "professional",
    "roles": [
      "grc"
    ],
    "task": "Choose this only if its current objectives support a role and portfolio plan. Reference group follows the source, not a universal provider tier.",
    "desc": "Compare the provider’s current objectives, eligibility, exam format, maintenance requirements, and total cost.",
    "sources": [
      "Certifications"
    ],
    "status": "Provider status to check"
  },
  {
    "id": "comptia-pentest",
    "kind": "credentials",
    "title": "CompTIA PenTest+",
    "url": "https://www.comptia.org/certifications/pentest",
    "groups": [
      "Associate Level"
    ],
    "module": "professional",
    "roles": [
      "grc"
    ],
    "task": "Choose this only if its current objectives support a role and portfolio plan. Reference group follows the source, not a universal provider tier.",
    "desc": "Compare the provider’s current objectives, eligibility, exam format, maintenance requirements, and total cost.",
    "sources": [
      "Certifications"
    ],
    "status": "Provider status to check"
  },
  {
    "id": "comptia-cysa",
    "kind": "credentials",
    "title": "CompTIA CySA+",
    "url": "https://www.comptia.org/certifications/cybersecurity-analyst",
    "groups": [
      "Associate Level"
    ],
    "module": "professional",
    "roles": [
      "grc"
    ],
    "task": "Choose this only if its current objectives support a role and portfolio plan. Reference group follows the source, not a universal provider tier.",
    "desc": "Compare the provider’s current objectives, eligibility, exam format, maintenance requirements, and total cost.",
    "sources": [
      "Certifications"
    ],
    "status": "Provider status to check"
  },
  {
    "id": "aws-certified-security-specialty",
    "kind": "credentials",
    "title": "AWS Certified Security – Specialty",
    "url": "https://aws.amazon.com/certification/certified-security-specialty/",
    "groups": [
      "Associate Level"
    ],
    "module": "professional",
    "roles": [
      "grc"
    ],
    "task": "Choose this only if its current objectives support a role and portfolio plan. Reference group follows the source, not a universal provider tier.",
    "desc": "Compare the provider’s current objectives, eligibility, exam format, maintenance requirements, and total cost.",
    "sources": [
      "Certifications"
    ],
    "status": "Provider status to check"
  },
  {
    "id": "microsoft-certified-azure-security-engineer-associate",
    "kind": "credentials",
    "title": "Microsoft Certified: Azure Security Engineer Associate",
    "url": "https://learn.microsoft.com/en-us/credentials/certifications/azure-security-engineer/",
    "groups": [
      "Associate Level"
    ],
    "module": "professional",
    "roles": [
      "grc"
    ],
    "task": "Choose this only if its current objectives support a role and portfolio plan. Reference group follows the source, not a universal provider tier.",
    "desc": "Microsoft lists this credential as retired. Compare its current Cloud and AI Security Engineer Associate path.",
    "sources": [
      "Certifications"
    ],
    "status": "Retired · 31 August 2026",
    "noteUrl": "https://learn.microsoft.com/en-us/credentials/support/credential-retirement"
  },
  {
    "id": "certified-kubernetes-security-specialist-cks",
    "kind": "credentials",
    "title": "Certified Kubernetes Security Specialist (CKS)",
    "url": "https://www.cncf.io/training/certification/cks/",
    "groups": [
      "Associate Level"
    ],
    "module": "professional",
    "roles": [
      "grc"
    ],
    "task": "Choose this only if its current objectives support a role and portfolio plan. Reference group follows the source, not a universal provider tier.",
    "desc": "Compare the provider’s current objectives, eligibility, exam format, maintenance requirements, and total cost.",
    "sources": [
      "Certifications"
    ],
    "status": "Provider status to check"
  },
  {
    "id": "giac-certified-incident-handler-gcih",
    "kind": "credentials",
    "title": "GIAC Certified Incident Handler (GCIH)",
    "url": "https://www.giac.org/certifications/certified-incident-handler-gcih/",
    "groups": [
      "Associate Level"
    ],
    "module": "professional",
    "roles": [
      "grc"
    ],
    "task": "Choose this only if its current objectives support a role and portfolio plan. Reference group follows the source, not a universal provider tier.",
    "desc": "Compare the provider’s current objectives, eligibility, exam format, maintenance requirements, and total cost.",
    "sources": [
      "Certifications"
    ],
    "status": "Provider status to check"
  },
  {
    "id": "isa-iec-62443-cybersecurity-fundamentals-specialist",
    "kind": "credentials",
    "title": "ISA/IEC 62443 Cybersecurity Fundamentals Specialist",
    "url": "https://www.isa.org/certification/isa-iec-62443-cybersecurity-certificate-programs",
    "groups": [
      "Associate Level"
    ],
    "module": "professional",
    "roles": [
      "grc"
    ],
    "task": "Choose this only if its current objectives support a role and portfolio plan. Reference group follows the source, not a universal provider tier.",
    "desc": "Compare the provider’s current objectives, eligibility, exam format, maintenance requirements, and total cost.",
    "sources": [
      "Certifications"
    ],
    "status": "Provider status to check"
  },
  {
    "id": "certified-information-privacy-professional-europe-cipp-e",
    "kind": "credentials",
    "title": "Certified Information Privacy Professional/Europe (CIPP/E)",
    "url": "https://iapp.org/certify/cipp-e/",
    "groups": [
      "Associate Level"
    ],
    "module": "professional",
    "roles": [
      "grc"
    ],
    "task": "Choose this only if its current objectives support a role and portfolio plan. Reference group follows the source, not a universal provider tier.",
    "desc": "Compare the provider’s current objectives, eligibility, exam format, maintenance requirements, and total cost.",
    "sources": [
      "Certifications"
    ],
    "status": "Provider status to check"
  },
  {
    "id": "offensive-security-certified-professional-oscp",
    "kind": "credentials",
    "title": "Offensive Security Certified Professional (OSCP)",
    "url": "https://www.offsec.com/courses/pen-200/",
    "groups": [
      "Professional Level"
    ],
    "module": "professional",
    "roles": [
      "grc"
    ],
    "task": "Choose this only if its current objectives support a role and portfolio plan. Reference group follows the source, not a universal provider tier.",
    "desc": "Compare the provider’s current objectives, eligibility, exam format, maintenance requirements, and total cost.",
    "sources": [
      "Certifications"
    ],
    "status": "Provider status to check"
  },
  {
    "id": "certified-information-systems-security-professional-cissp",
    "kind": "credentials",
    "title": "Certified Information Systems Security Professional (CISSP)",
    "url": "https://www.isc2.org/certifications/cissp",
    "groups": [
      "Professional Level"
    ],
    "module": "professional",
    "roles": [
      "grc"
    ],
    "task": "Choose this only if its current objectives support a role and portfolio plan. Reference group follows the source, not a universal provider tier.",
    "desc": "Compare the provider’s current objectives, eligibility, exam format, maintenance requirements, and total cost.",
    "sources": [
      "Certifications"
    ],
    "status": "Provider status to check"
  },
  {
    "id": "certified-information-security-manager-cism",
    "kind": "credentials",
    "title": "Certified Information Security Manager (CISM)",
    "url": "https://www.isaca.org/credentialing/cism",
    "groups": [
      "Professional Level"
    ],
    "module": "professional",
    "roles": [
      "grc"
    ],
    "task": "Choose this only if its current objectives support a role and portfolio plan. Reference group follows the source, not a universal provider tier.",
    "desc": "Compare the provider’s current objectives, eligibility, exam format, maintenance requirements, and total cost.",
    "sources": [
      "Certifications"
    ],
    "status": "Provider status to check"
  },
  {
    "id": "giac-reverse-engineering-malware-grem",
    "kind": "credentials",
    "title": "GIAC Reverse Engineering Malware (GREM)",
    "url": "https://www.giac.org/certifications/reverse-engineering-malware-grem/",
    "groups": [
      "Professional Level"
    ],
    "module": "professional",
    "roles": [
      "grc"
    ],
    "task": "Choose this only if its current objectives support a role and portfolio plan. Reference group follows the source, not a universal provider tier.",
    "desc": "Compare the provider’s current objectives, eligibility, exam format, maintenance requirements, and total cost.",
    "sources": [
      "Certifications"
    ],
    "status": "Provider status to check"
  },
  {
    "id": "certified-hacking-forensic-investigator-chfi",
    "kind": "credentials",
    "title": "Certified Hacking Forensic Investigator (CHFI)",
    "url": "https://www.eccouncil.org/train-certify/computer-hacking-forensic-investigator-chfi/",
    "groups": [
      "Professional Level"
    ],
    "module": "professional",
    "roles": [
      "grc"
    ],
    "task": "Choose this only if its current objectives support a role and portfolio plan. Reference group follows the source, not a universal provider tier.",
    "desc": "Compare the provider’s current objectives, eligibility, exam format, maintenance requirements, and total cost.",
    "sources": [
      "Certifications"
    ],
    "status": "Provider status to check"
  },
  {
    "id": "certified-cloud-security-professional-ccsp",
    "kind": "credentials",
    "title": "Certified Cloud Security Professional (CCSP)",
    "url": "https://www.isc2.org/certifications/ccsp",
    "groups": [
      "Professional Level"
    ],
    "module": "professional",
    "roles": [
      "grc"
    ],
    "task": "Choose this only if its current objectives support a role and portfolio plan. Reference group follows the source, not a universal provider tier.",
    "desc": "Compare the provider’s current objectives, eligibility, exam format, maintenance requirements, and total cost.",
    "sources": [
      "Certifications"
    ],
    "status": "Provider status to check"
  },
  {
    "id": "certified-in-risk-and-information-systems-control-crisc",
    "kind": "credentials",
    "title": "Certified in Risk and Information Systems Control (CRISC)",
    "url": "https://www.isaca.org/credentialing/crisc",
    "groups": [
      "Professional Level"
    ],
    "module": "professional",
    "roles": [
      "grc"
    ],
    "task": "Choose this only if its current objectives support a role and portfolio plan. Reference group follows the source, not a universal provider tier.",
    "desc": "Compare the provider’s current objectives, eligibility, exam format, maintenance requirements, and total cost.",
    "sources": [
      "Certifications"
    ],
    "status": "Provider status to check"
  },
  {
    "id": "iso-iec-27001-lead-auditor",
    "kind": "credentials",
    "title": "ISO/IEC 27001 Lead Auditor",
    "url": "https://pecb.com/en/education-and-certification-for-individuals/iso-iec-27001",
    "groups": [
      "Professional Level"
    ],
    "module": "professional",
    "roles": [
      "grc"
    ],
    "task": "Choose this only if its current objectives support a role and portfolio plan. Reference group follows the source, not a universal provider tier.",
    "desc": "Compare the provider’s current objectives, eligibility, exam format, maintenance requirements, and total cost.",
    "sources": [
      "Certifications"
    ],
    "status": "Provider status to check"
  },
  {
    "id": "tensorflow-developer-certificate",
    "kind": "credentials",
    "title": "TensorFlow Developer Certificate",
    "url": "https://www.tensorflow.org/certificate",
    "groups": [
      "Professional Level"
    ],
    "module": "professional",
    "roles": [
      "grc"
    ],
    "task": "Choose this only if its current objectives support a role and portfolio plan. Reference group follows the source, not a universal provider tier.",
    "desc": "The official certificate page says the exam is closed. Retained for comparison, not a new exam recommendation.",
    "sources": [
      "Certifications"
    ],
    "status": "Exam closed"
  },
  {
    "id": "aws-certified-machine-learning-specialty",
    "kind": "credentials",
    "title": "AWS Certified Machine Learning – Specialty",
    "url": "https://aws.amazon.com/certification/certified-machine-learning-specialty/",
    "groups": [
      "Professional Level"
    ],
    "module": "professional",
    "roles": [
      "grc"
    ],
    "task": "Choose this only if its current objectives support a role and portfolio plan. Reference group follows the source, not a universal provider tier.",
    "desc": "The provider lists 31 March 2026 as the last exam date. Existing credential validity is governed by AWS terms.",
    "sources": [
      "Certifications"
    ],
    "status": "Retired · 31 March 2026"
  },
  {
    "id": "google-professional-cloud-security-engineer",
    "kind": "credentials",
    "title": "Google Professional Cloud Security Engineer",
    "url": "https://cloud.google.com/certification/cloud-security-engineer",
    "groups": [
      "Professional Level"
    ],
    "module": "professional",
    "roles": [
      "grc"
    ],
    "task": "Choose this only if its current objectives support a role and portfolio plan. Reference group follows the source, not a universal provider tier.",
    "desc": "Compare the provider’s current objectives, eligibility, exam format, maintenance requirements, and total cost.",
    "sources": [
      "Certifications"
    ],
    "status": "Provider status to check"
  },
  {
    "id": "giac-global-industrial-cyber-security-professional-gicsp",
    "kind": "credentials",
    "title": "GIAC Global Industrial Cyber Security Professional (GICSP)",
    "url": "https://www.giac.org/certifications/global-industrial-cyber-security-professional-gicsp/",
    "groups": [
      "Professional Level"
    ],
    "module": "professional",
    "roles": [
      "grc"
    ],
    "task": "Choose this only if its current objectives support a role and portfolio plan. Reference group follows the source, not a universal provider tier.",
    "desc": "Compare the provider’s current objectives, eligibility, exam format, maintenance requirements, and total cost.",
    "sources": [
      "Certifications"
    ],
    "status": "Provider status to check"
  },
  {
    "id": "certified-information-privacy-manager-cipm",
    "kind": "credentials",
    "title": "Certified Information Privacy Manager (CIPM)",
    "url": "https://iapp.org/certify/cipm/",
    "groups": [
      "Professional Level"
    ],
    "module": "professional",
    "roles": [
      "grc"
    ],
    "task": "Choose this only if its current objectives support a role and portfolio plan. Reference group follows the source, not a universal provider tier.",
    "desc": "Compare the provider’s current objectives, eligibility, exam format, maintenance requirements, and total cost.",
    "sources": [
      "Certifications"
    ],
    "status": "Provider status to check"
  },
  {
    "id": "offensive-security-experienced-penetration-tester-osep",
    "kind": "credentials",
    "title": "Offensive Security Experienced Penetration Tester (OSEP)",
    "url": "https://www.offsec.com/courses/pen-300/",
    "groups": [
      "Expert Level"
    ],
    "module": "professional",
    "roles": [
      "grc"
    ],
    "task": "Choose this only if its current objectives support a role and portfolio plan. Reference group follows the source, not a universal provider tier.",
    "desc": "Compare the provider’s current objectives, eligibility, exam format, maintenance requirements, and total cost.",
    "sources": [
      "Certifications"
    ],
    "status": "Provider status to check"
  },
  {
    "id": "giac-security-expert-gse",
    "kind": "credentials",
    "title": "GIAC Security Expert (GSE)",
    "url": "https://www.giac.org/certifications/security-expert-gse/",
    "groups": [
      "Expert Level"
    ],
    "module": "professional",
    "roles": [
      "grc"
    ],
    "task": "Choose this only if its current objectives support a role and portfolio plan. Reference group follows the source, not a universal provider tier.",
    "desc": "Compare the provider’s current objectives, eligibility, exam format, maintenance requirements, and total cost.",
    "sources": [
      "Certifications"
    ],
    "status": "Provider status to check"
  },
  {
    "id": "offensive-security-certified-expert-osce3",
    "kind": "credentials",
    "title": "Offensive Security Certified Expert (OSCE3)",
    "url": "https://www.offsec.com/nl/lp/oscp3/",
    "groups": [
      "Expert Level"
    ],
    "module": "professional",
    "roles": [
      "grc"
    ],
    "task": "Choose this only if its current objectives support a role and portfolio plan. Reference group follows the source, not a universal provider tier.",
    "desc": "Compare the provider’s current objectives, eligibility, exam format, maintenance requirements, and total cost.",
    "sources": [
      "Certifications"
    ],
    "status": "Provider status to check"
  },
  {
    "id": "cissp-issap-architecture-concentration",
    "kind": "credentials",
    "title": "CISSP-ISSAP (Architecture Concentration)",
    "url": "https://www.isc2.org/certifications/cissp/cissp-issap",
    "groups": [
      "Expert Level"
    ],
    "module": "professional",
    "roles": [
      "grc"
    ],
    "task": "Choose this only if its current objectives support a role and portfolio plan. Reference group follows the source, not a universal provider tier.",
    "desc": "Compare the provider’s current objectives, eligibility, exam format, maintenance requirements, and total cost.",
    "sources": [
      "Certifications"
    ],
    "status": "Provider status to check"
  },
  {
    "id": "certified-chief-information-security-officer-c-ciso",
    "kind": "credentials",
    "title": "Certified Chief Information Security Officer (C|CISO)",
    "url": "https://www.eccouncil.org/train-certify/certified-chief-information-security-officer-cciso/",
    "groups": [
      "Expert Level"
    ],
    "module": "professional",
    "roles": [
      "grc"
    ],
    "task": "Choose this only if its current objectives support a role and portfolio plan. Reference group follows the source, not a universal provider tier.",
    "desc": "Compare the provider’s current objectives, eligibility, exam format, maintenance requirements, and total cost.",
    "sources": [
      "Certifications"
    ],
    "status": "Provider status to check"
  },
  {
    "id": "microsoft-cloud-and-ai-security-engineer-associate",
    "kind": "credentials",
    "title": "Microsoft Cloud and AI Security Engineer Associate",
    "url": "https://learn.microsoft.com/en-us/credentials/certifications/cloud-and-ai-security-engineer-associate/",
    "groups": [
      "Cloud security"
    ],
    "module": "professional",
    "roles": [
      "grc"
    ],
    "task": "Read the primary source and record scope, revision, and evidence requirements.",
    "desc": "Review Microsoft’s current cloud and AI security credential page, prerequisites, and objectives.",
    "sources": [
      "Editorial update"
    ],
    "status": "Current provider page reviewed"
  }
];
