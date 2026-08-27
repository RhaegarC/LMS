# LMS - Learning Management System

> **A cloud-based Learning Management System designed for teaching English to children under 10.**

[![Azure](https://img.shields.io/badge/Azure-0078D4?style=for-the-badge&logo=microsoftazure&logoColor=white)](https://azure.microsoft.com/)
[![Status](https://img.shields.io/badge/Status-Planning-blue?style=for-the-badge)]()
[![Version](https://img.shields.io/badge/Version-1.0-green?style=for-the-badge)]()
[![License](https://img.shields.io/badge/License-MIT-yellow?style=for-the-badge)]()

---

## 🎯 Overview

LMS is a purpose-built platform for young English learners (under 10) and their teachers. The system focuses on the **core homework lifecycle**:
📝 Assignments → 📤 Submissions → ⭐ Feedback
Built with simplicity, encouragement, and child-friendly UX at its heart, LMS helps teachers manage classes, create multimedia assignments, and provide personalized feedback through stars, text, and voice.

---

## ✨ Features

### 👨‍🏫 For Teachers

| Feature | Description |
| :--- | :--- |
| **Class Management** | Create, edit, and manage student rosters |
| **Assignment Creation** | Build assignments with rich text, video, and voice instructions |
| **Draft & Clone** | Save drafts, clone existing assignments, and edit after publishing |
| **Feedback Queue** | View pending submissions sorted by date |
| **Item-Level Grading** | Rate each assignment item with 0.5–5.0 stars |
| **Voice Feedback** | Record personalized audio feedback (max 1 minute) |
| **Quick Comments** | Pre-defined emoji-rich responses for faster grading |
| **Batch Statistics** | View per-item average stars across all submissions |
| **Reports** | Student progress cards and class engagement snapshots |

### 🧒 For Students

| Feature | Description |
| :--- | :--- |
| **Assignment View** | See all assigned quests with clear instructions |
| **Multimedia Responses** | Submit text, video, or voice recordings |
| **Optional Preview** | Review before submitting (not required) |
| **Late Submissions** | Accepted with a friendly "⏰ Late" badge |
| **Edit Before Grading** | Update submissions until feedback is published |
| **Confetti Celebration** | 🎉 Fun animation upon successful submission |
| **Feedback View** | See star ratings, text comments, and voice feedback |
| **Progress Card** | Track your performance across all classes |

### 🔐 For Sys Admins

| Feature | Description |
| :--- | :--- |
| **User Management** | Create, delete, and assign roles to all users |
| **Full System Access** | View and manage any class, assignment, or submission |
| **Audit Trail** | All critical actions logged |
| **Soft Delete** | 30-day archive for deleted items |
| **Manual Overrides** | Fix corrupted submissions or re-open locked submissions |

---

## 🏗️ Architecture (High-Level)

Single-page app → REST API (modular monolith) → Azure SQL + Blob Storage.

| Component | Technology |
| :--- | :--- |
| **Frontend** | Angular SPA (hosted on Azure Static Web Apps) |
| **API** | .NET 10 on Azure Container Apps |
| **Database** | Azure SQL (serverless) |
| **Media** | Azure Blob Storage — read/written through the API |
| **Auth** | Microsoft Entra ID (authentication only) + roles handled in-app |
| **Observability** | Application Insights |

See [docs/architecture.md](docs/architecture.md) for the full system architecture.
---

## 🛠️ Tech Stack

| Layer | Technology | Purpose |
| :--- | :--- | :--- |
| **Frontend** | Angular | Student & teacher dashboard |
| **Hosting** | Azure Static Web Apps | Global CDN, free SSL, CI/CD |
| **API** | Azure Container APP | HTTP endpoints, business logic |
| **Database** | Azure SQL (Serverless) | Relational data, ACID transactions |
| **Storage** | Azure Blob Storage (Hot) | Media files (video, voice, images) |
| **Auth** | Microsoft Entra ID | Authentication (JWT) — roles handled in-app |
| **Notifications** | In-app feed | Alerts read on page load (no push in V1) |
| **Monitoring** | Application Insights | Logging, performance, exceptions |

---

## 📁 Project Structure

lms/
├── .claude/             # Claude Code project instructions & skills
├── api/                 # .NET backend
│   ├── Lms.Api/         # HTTP controllers, authz, validation
│   ├── Lms.Domain/      # entities + business logic (no EF/UI deps)
│   ├── Lms.Data/        # EF Core DbContext, migrations, seeds
│   └── Lms.Tests/       # xUnit tests (unit + integration)
├── web/                 # Angular SPA
├── docs/
│   ├── PRD.md           # Product requirements
│   ├── architecture.md  # System architecture
│   ├── testing-and-tdd.md
│   ├── features/        # Feature specs (numbered)
│   └── bugs/            # Bug tracker
├── .github/
│   └── workflows/       # deploy-frontend.yml, deploy-backend.yml
└── README.md
---

## 🚀 Getting Started

### Prerequisites

- Azure subscription (free tier sufficient for development)
- .NET 10 SDK
- Node.js 24+ with npm
- Azure CLI
- VS Code with Claude Code extensions (optional)

### Quick Start

```bash
# 1. Clone the repository
git clone git@github.com:RhaegarC/LMS.git
cd lms

# 2. Start the backend (api/)
cd api
dotnet restore
dotnet run
cd ..

# 3. Start the frontend (web/)
cd web
npm install
npm start

# 4. Open http://localhost:4200
```

> ⚠️ `api/` and `web/` are empty until the Phase 0 scaffolding is complete
> (see the Development Workflow in `.claude/CLAUDE.md`).

### Testing

```bash
# Backend unit & integration tests (xUnit)
cd api
dotnet test

# Frontend unit & component tests (Vitest)
cd web
npm test
```
🤝 Contributing
We welcome contributions! Please read our Contributing Guide first.
1. Fork the repo
2. Create your feature branch (git checkout -b feature/amazing-feature)
3. Commit changes (git commit -m 'Add amazing feature')
4. Push to branch (git push origin feature/amazing-feature)
5. Open a Pull Request

📄 License
- This project is licensed under the MIT License – see the LICENSE file for details.

📞 Support
- Channel Link
- Issues GitHub Issues
- Discussions GitHub Discussions
- Documentation	Wiki

🏆 Roadmap
- V1.0 (Current)
✅ Class management
✅ Assignment creation (text/video/voice)
✅ Student submissions
✅ Feedback (star ratings, text, voice)
✅ Basic reports

- V2.0 (Planned)
Parent portal (read-only)
Email notifications
Gamification (stickers, badges)
Advanced analytics

- V3.0 (Future)
Mobile apps (iOS/Android)
Live classes
Content marketplace

🙏 Acknowledgments
Built on Microsoft Azure
Inspired by the needs of young English learners and their dedicated teachers
Made with ❤️ for teachers and students everywhere.