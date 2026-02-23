cl# Delicious Dry Fruits

Welcome to the Delicious Dry Fruits project! This is a Next.js application built for an e-commerce platform.

## 🚀 Getting Started

These instructions will help you set up the project on your local machine for development and testing purposes.

### Prerequisites

Ensure you have the following installed on your system:
- [Node.js](https://nodejs.org/) (Version 18 or higher recommended)
- [Git](https://git-scm.com/)

### 🛠️ Installation

1.  **Clone the repository**
    Open your terminal (Command Prompt, PowerShell, or Git Bash on Windows; Terminal on Mac) and run:
    ```bash
    git clone https://github.com/tayseerfarooq/DeliciousDryFruits.git
    cd DeliciousDryFruits
    ```

2.  **Install Dependencies**
    Install the necessary packages using npm:
    ```bash
    npm install
    ```
    *Note: This command connects to the internet to download all the libraries required for the project (stored in `node_modules`).*

3.  **Run the Development Server**
    Start the local development server:
    ```bash
    npm run dev
    ```

4.  **View the App**
    Open your browser and navigate to [http://localhost:3000](http://localhost:3000).

---

## 🤝 Collaboration Workflow

Check out this guide to keep our work organized and avoid conflicts!

### 1. Before You Start Coding
Always make sure you have the latest code from the main repository:
```bash
git checkout main
git pull origin main
```

### 2. Create a Feature Branch
**Never push directly to `main`!** Create a new branch for every task or feature you work on.
Name your branch descriptively (e.g., `feature/login-page`, `fix/cart-bug`, `update/homepage-style`).

```bash
# Create and switch to a new branch
git checkout -b feature/your-feature-name
```

### 3. Make Your Changes
Write your code, save your files, and verify everything works locally.

### 4. Commit Your Work
When you are ready to save your progress:

```bash
# Add all changed files
git add .

# Commit with a meaningful message
git commit -m "Add login form components"
```

### 5. Push to GitHub
Upload your branch to the remote repository:

```bash
git push origin feature/your-feature-name
```

### 6. Merge Your Code
1.  Go to the [GitHub Repository](https://github.com/tayseerfarooq/DeliciousDryFruits).
2.  You should see a prompt to "Compare & pull request". Click it.
3.  Review your changes and click **Create Pull Request**.
4.  Once reviewed, merge the Pull Request into `main`.

---

## 💡 Notes for Windows Users
- If you encounter issues with scripts, ensure you are running your terminal as Administrator or using PowerShell.
- The `rm -rf` commands or similar unix-based commands in `package.json` scripts might need adjustment (e.g., typically using `rimraf` helps cross-platform compatibility). For standard `npm run dev`, you should be fine!

Happy Coding! 🥥🥜
