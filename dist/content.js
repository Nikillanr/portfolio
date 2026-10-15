/* Adapted from Nikillan_2026_resume.pdf. SVG covers are placeholders. Projects follow resume order. */
window.portfolio = {
  "name": "Nikillan Rajesh",
  "role": "Robotics · Perception · AI systems",
  "email": "nr3139@columbia.edu",
  "github": "https://github.com/Nikillanr",
  "linkedin": "https://linkedin.com/in/nikillan-rajesh",
  "bio": "I’m Nikillan, an M.S. Artificial Intelligence student at Columbia University, concentrating in Robotics and Perception. I develop software for robotics, machine learning, and research systems, with experience in perception, backend services, and AI tools.",
  "education": [
    {
      "name": "Columbia University",
      "detail": "M.S. Artificial Intelligence",
      "summary": "Concentration in Robotics and Perception · New York, NY",
      "date": "Expected Dec 2027"
    },
    {
      "name": "Manipal Institute of Technology",
      "detail": "B.Tech, Computer and Communication Engineering",
      "summary": "CGPA: 8.7/10 · Manipal, India",
      "date": "2022–2026"
    }
  ],
  "experience": [
    {
      "name": "Eli Lilly and Company",
      "detail": "Software Product Intern · Research Data",
      "summary": "Built tools for natural-language access to research data, cloud integrations, and observability.",
      "date": "Jan–Jul 2026"
    },
    {
      "name": "GE HealthCare",
      "detail": "Software Engineering Intern",
      "summary": "Developed detector microservices and validated software on physical X-ray test systems.",
      "date": "May–Aug 2025"
    }
  ],
  "research": [
    {
      "name": "ROAR Lab · Columbia University",
      "detail": "Research Contributor",
      "summary": "Machine learning for adaptive VR rehabilitation and individualized training.",
      "date": "Oct 2026–present"
    },
    {
      "name": "Columbia Robotics Club · CCBR",
      "detail": "Perception Team Member",
      "summary": "Quadruped perception and simulation integration for uneven-terrain locomotion.",
      "date": "Sep 2026–present"
    },
    {
      "name": "Project MANAS",
      "detail": "Team Manager · AI & Robotics",
      "summary": "Led a 45-member AI and robotics team, secured university support for a Unitree Go2 EDU, and helped establish research and testing infrastructure.",
      "date": "Nov 2022–Mar 2025"
    }
  ],
  "skillGroups": [
    {
      "name": "Languages",
      "items": [
        "Python",
        "Java",
        "C/C++",
        "JavaScript / TypeScript",
        "SQL"
      ]
    },
    {
      "name": "Robotics & machine learning",
      "items": [
        "ROS",
        "Unitree SDK",
        "Unreal Engine",
        "OpenCV",
        "PyTorch",
        "TensorFlow"
      ]
    },
    {
      "name": "Backend & data",
      "items": [
        "Spring Boot",
        "FastAPI",
        "REST",
        "gRPC",
        "Trino",
        "MySQL",
        "MCP",
        "Text-to-SQL"
      ]
    },
    {
      "name": "Cloud & infrastructure",
      "items": [
        "AWS",
        "AWS CDK",
        "Docker",
        "Kubernetes",
        "Git",
        "CI/CD",
        "Grafana",
        "Prometheus",
        "CloudWatch"
      ]
    }
  ],
  "projects": [
    {
      "title": "Research,",
      "accent": "connected.",
      "category": "AI & research infrastructure",
      "year": "2026",
      "image": "assets/research.svg",
      "alt": "Concept illustration connecting a molecule to a natural-language research interface",
      "subtitle": "From natural language to scientific data.",
      "organization": "Eli Lilly and Company · Software Product Intern",
      "description": "Built an MCP server, a semantic database for Trino research data, and a text-to-SQL skill so scientists could query molecule and experiment data and generate visualizations through Claude Desktop. Also developed AWS/EKS MCP integrations, FastAPI data-exchange services, and observability infrastructure across four environments.",
      "disciplines": [
        "MCP / text-to-SQL",
        "Trino / FastAPI",
        "AWS CDK / EKS",
        "Grafana / Prometheus"
      ],
      "highlights": [
        {
          "value": "< 2 seconds",
          "label": "Automated ticket creation, down from 5–10 minutes"
        },
        {
          "value": "4 environments",
          "label": "Observability coverage"
        },
        {
          "value": "8+ dashboards",
          "label": "With 18+ alert rules deployed"
        }
      ],
      "note": "Cover: original concept illustration. It contains no internal screenshots, research data, or proprietary architecture.",
      "link": "",
      "id": "lilly",
      "displayTitle": "Eli Lilly · Research Intelligence"
    },
    {
      "title": "Signal to",
      "accent": "system.",
      "category": "Healthcare engineering",
      "year": "2025",
      "image": "assets/healthcare.svg",
      "alt": "Concept illustration of detector signals connected to modular software services",
      "subtitle": "Software that connects to the physical world.",
      "organization": "GE HealthCare · Software Engineering Intern",
      "description": "Built a Java Spring Boot detector microservice with REST APIs, decoupling UI logic from CORBA, and implemented gRPC client/server methods and Protobuf definitions. Deployed the service to physical X-ray test systems, validated detector-information retrieval through the operator UI, and traced command-response logs to diagnose communication failures.",
      "disciplines": [
        "Java / Spring Boot",
        "REST / gRPC",
        "Protobuf",
        "Integration testing"
      ],
      "highlights": [
        {
          "value": "~87%",
          "label": "Estimated modularity improvement reported in resume"
        },
        {
          "value": "30% faster",
          "label": "Cycle time with a GitHub Copilot agent workflow"
        }
      ],
      "note": "Cover: original systems illustration, with no patient imagery or internal interface screenshots.",
      "link": "",
      "id": "ge-healthcare",
      "displayTitle": "GE HealthCare · Software Systems"
    },
    {
      "title": "Human in",
      "accent": "the loop.",
      "category": "ML & rehabilitation",
      "year": "2026 — ongoing",
      "image": "assets/rehab.svg",
      "alt": "Concept illustration of human motion tracking within an adaptive virtual environment",
      "subtitle": "Adaptive intelligence. Individual progress.",
      "organization": "Robotics and Rehabilitation (ROAR) Lab · Columbia",
      "description": "Researching machine-learning approaches for adaptive VR rehabilitation under Dr. Siddharth Bhardwaj. Responsible for end-to-end model development targeting individualized training and generalization across patients.",
      "disciplines": [
        "Machine learning",
        "Adaptive VR",
        "Model development",
        "Individualized training"
      ],
      "highlights": [
        {
          "value": "Individualized",
          "label": "Training as a model-development target"
        },
        {
          "value": "Across patients",
          "label": "Generalization as a research objective"
        }
      ],
      "note": "Cover: original concept illustration. This is ongoing research; no clinical outcomes are claimed.",
      "link": "",
      "id": "roar-lab",
      "displayTitle": "Adaptive Rehabilitation"
    },
    {
      "id": "ccbr",
      "displayTitle": "Quadruped Perception",
      "title": "Quadruped",
      "accent": "perception.",
      "category": "Robotics & perception",
      "year": "Sep 2026–present",
      "image": "assets/perception.svg",
      "alt": "SVG placeholder of a point cloud and planned path across uneven terrain",
      "subtitle": "Perception for the next step.",
      "organization": "Columbia University Robotics Club · CCBR · Perception Team Member",
      "description": "Designing quadruped perception and simulation integration for uneven-terrain locomotion in the Caltech–Columbia–Berkeley–Rutgers open-source collaboration. Also designing the physical training environment for repeatable testing and data collection.",
      "disciplines": [
        "Quadruped perception",
        "Simulation integration",
        "Training environments",
        "Repeatable testing"
      ],
      "highlights": [
        {
          "value": "Uneven terrain",
          "label": "Perception and simulation integration focus"
        },
        {
          "value": "In progress",
          "label": "Training-environment design and data-collection setup"
        }
      ],
      "note": "Cover: SVG placeholder, not actual sensor output. This work is ongoing.",
      "link": ""
    },
    {
      "title": "Built to",
      "accent": "move.",
      "category": "Autonomous quadruped",
      "year": "2026 — ongoing",
      "image": "assets/quadruped.svg",
      "alt": "Concept illustration of an articulated quadruped robot on a drafting grid",
      "subtitle": "Software that brings a robot into motion.",
      "organization": "Robotics Studio · Columbia University",
      "description": "Developing software for an autonomous quadruped in Professor Hod Lipson’s Robotics Studio at Columbia University. My focus is the control logic and software integration needed for robot actuation.",
      "disciplines": [
        "Control software",
        "Raspberry Pi software",
        "Robot actuation",
        "Software integration"
      ],
      "highlights": [
        {
          "value": "Control software",
          "label": "Software for quadruped actuation"
        },
        {
          "value": "In progress",
          "label": "Software integration and robot control"
        }
      ],
      "note": "Cover: original concept illustration, not an exact CAD rendering or photograph. Project is in development.",
      "link": "",
      "id": "robotics-studio",
      "displayTitle": "Autonomous Quadruped"
    },
    {
      "title": "Leading",
      "accent": "Project MANAS",
      "category": "Team leadership & robotics",
      "year": "Nov 2022–Mar 2025",
      "image": "assets/leadership.svg",
      "alt": "SVG placeholder showing a team network organized around Project MANAS",
      "subtitle": "45 people. A shared direction.",
      "organization": "Project MANAS · Team Manager",
      "description": "Led a 45-member AI and robotics team at Project MANAS. Secured university support to acquire a Unitree Go2 EDU for locomotion research, and helped establish the initial testing and simulation infrastructure, including work with the Unitree SDK. Contributed to rebuilding build and deployment pipelines after failures, reducing deployment downtime by 40%. Alongside team leadership, contributed to ROS-based ground-vehicle systems and synthetic-data pipelines for drone perception.",
      "disciplines": [
        "Team leadership",
        "University support",
        "Research infrastructure",
        "Systems delivery"
      ],
      "highlights": [
        {
          "value": "45 members",
          "label": "AI and robotics team led as Team Manager"
        },
        {
          "value": "University support",
          "label": "Secured for acquiring a Unitree Go2 EDU"
        },
        {
          "value": "4th / 71",
          "label": "Team result · SUAS 2024"
        },
        {
          "value": "1st Design",
          "label": "Team result · IGVC 2024–2025; 3rd AutoNav"
        },
        {
          "value": "40% less",
          "label": "Deployment downtime after pipeline rebuilds"
        }
      ],
      "note": "Cover: SVG placeholder for team leadership. Competition placements are team results.",
      "link": "",
      "id": "project-manas",
      "displayTitle": "Leading Project MANAS"
    },
    {
      "title": "Fresh",
      "accent": "thinking.",
      "category": "Computer vision",
      "year": "Project",
      "image": "assets/freshness.svg",
      "alt": "Concept illustration of produce inside a computer-vision detection grid",
      "subtitle": "Finding useful signals in everyday things.",
      "organization": "Produce Freshness & Shelf-Life Estimation",
      "description": "Built an OpenCV augmentation and decay-synthesis pipeline, then trained EfficientNet-B0 with frozen backbones on 2,698 images including augmentations. Mapped freshness outputs to baseline shelf-life estimates and qualified in Flipkart Grid, an event with more than 300,000 participants.",
      "disciplines": [
        "OpenCV",
        "EfficientNet-B0",
        "TensorFlow / PyTorch",
        "Data augmentation"
      ],
      "highlights": [
        {
          "value": "2,698 images",
          "label": "Training data including augmentations"
        },
        {
          "value": "Freshness → time",
          "label": "Baseline shelf-life estimation"
        }
      ],
      "note": "Cover: original concept illustration, not actual model output. Shelf-life estimates are baseline project estimates.",
      "link": "",
      "id": "produce-freshness",
      "displayTitle": "Freshness Estimation"
    }
  ]
};
