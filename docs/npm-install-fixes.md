# NPM Installation Troubleshooting Guide

This document details common installation issues encountered with Idle Ace Commander and their solutions.

## Table of Contents
- [Primary Issue: Missing Rollup Windows Binary](#primary-issue-missing-rollup-windows-binary)
- [Quick Fix](#quick-fix)
- [Detailed Troubleshooting](#detailed-troubleshooting)
- [Prevention & Best Practices](#prevention--best-practices)
- [Technical Background](#technical-background)

---

## Primary Issue: Missing Rollup Windows Binary

### Symptom

When running `npm run dev` after installation, you encounter this error:

```
Error: Cannot find module @rollup/rollup-win32-x64-msvc. npm has a bug related to 
optional dependencies (https://github.com/npm/cli/issues/4828). Please try `npm i` 
again after removing both package-lock.json and node_modules directory.
```

### Root Cause

This is a **known npm bug** affecting Windows systems where npm fails to correctly install optional platform-specific dependencies. The Vite build tool uses Rollup, which requires native binaries for different operating systems. On Windows x64 systems, the `@rollup/rollup-win32-x64-msvc` package is required but npm often fails to install it.

**Affected Systems:**
- Windows 10/11 x64
- npm versions 7.x - 10.x
- Node.js 18.x - 22.x

---

## Quick Fix

### Recommended Solution: Use pnpm

**pnpm** handles optional dependencies correctly and is the recommended package manager for this project.

```bash
# 1. Install pnpm globally (if not already installed)
npm install -g pnpm

# 2. Remove existing node_modules (if present)
Remove-Item -Path "node_modules" -Recurse -Force  # PowerShell
# OR
rm -rf node_modules  # Bash/Git Bash

# 3. Remove package-lock.json (if present)
Remove-Item -Path "package-lock.json" -Force  # PowerShell
# OR
rm package-lock.json  # Bash/Git Bash

# 4. Install dependencies with pnpm
pnpm install

# 5. Run the dev server
npm run dev
```

The dev server should now start successfully on `http://localhost:8080`.

---

## Detailed Troubleshooting

### If Quick Fix Doesn't Work

#### Step 1: Verify Your Environment

```bash
# Check Node.js version (should be 18.x or higher)
node --version

# Check npm version
npm --version

# Check if pnpm is installed
pnpm --version
```

#### Step 2: Clean npm Cache

```bash
npm cache clean --force
```

#### Step 3: Complete Clean Install

```bash
# Remove all artifacts
Remove-Item -Path "node_modules" -Recurse -Force -ErrorAction SilentlyContinue
Remove-Item -Path "package-lock.json" -Force -ErrorAction SilentlyContinue
Remove-Item -Path "pnpm-lock.yaml" -Force -ErrorAction SilentlyContinue

# Clear npm cache
npm cache clean --force

# Install with pnpm
pnpm install
```

#### Step 4: Verify Installation

Check if the Rollup binary was installed:

```bash
# PowerShell
Test-Path "node_modules/@rollup/rollup-win32-x64-msvc"

# Should return: True
```

### Alternative: Manual Binary Installation

If you must use npm, you can manually install the missing binary:

```bash
# After running npm install, add the missing binary
npm install @rollup/rollup-win32-x64-msvc@4.53.1

# Verify installation
npm run dev
```

**Note:** This is not recommended as it's a workaround, not a fix. Future reinstalls may encounter the same issue.

---

## Prevention & Best Practices

### 1. Use pnpm as Default

Add this to your global npm configuration to prefer pnpm:

```bash
# Set default package manager
npm config set prefer-pnpm true
```

### 2. Use Corepack (Node.js 16.9+)

Corepack ensures the correct package manager version is used:

```bash
# Enable corepack
corepack enable

# Use the project's specified package manager
corepack install
```

The project's `package.json` includes a `packageManager` field that Corepack will respect.

### 3. Environment-Specific Installation

For CI/CD pipelines or team environments, document the requirement:

```yaml
# .github/workflows/build.yml example
steps:
  - uses: actions/setup-node@v3
    with:
      node-version: '18'
  - uses: pnpm/action-setup@v2
    with:
      version: 10
  - run: pnpm install
  - run: pnpm run build
```

---

## Technical Background

### Why This Happens

1. **Optional Dependencies**: Rollup uses platform-specific native binaries as optional dependencies
2. **npm Bug**: npm's dependency resolver has issues with optional dependencies when:
   - The dependency tree is complex
   - Platform-specific packages are involved
   - Hoisting conflicts occur

3. **pnpm Advantage**: pnpm uses a different installation strategy:
   - Content-addressable storage
   - Symlink-based node_modules structure
   - Better handling of optional dependencies

### Affected Packages

The following optional dependencies may be affected by this npm bug:
- `@rollup/rollup-win32-x64-msvc` (Windows x64)
- `@rollup/rollup-linux-x64-gnu` (Linux x64)
- `@rollup/rollup-darwin-x64` (macOS Intel)
- `@rollup/rollup-darwin-arm64` (macOS Apple Silicon)
- `@esbuild/win32-x64` (Windows - Vite dependency)

### Version Information

This issue was documented with:
- npm: 10.x
- Node.js: v22.14.0
- Rollup: 4.53.1
- Vite: 5.4.21
- OS: Windows 11

---

## Solutions Attempted (Historical Record)

During troubleshooting, the following solutions were attempted:

### ❌ Failed Solutions

1. **Standard Reinstall**
   ```bash
   rm -rf node_modules package-lock.json
   npm install
   ```
   *Result: Binary still missing*

2. **Force Cache Clear**
   ```bash
   npm cache clean --force
   npm install
   ```
   *Result: Binary still missing*

3. **Manual Binary Install**
   ```bash
   npm install @rollup/rollup-win32-x64-msvc --save-optional
   ```
   *Result: Installed but didn't persist*

4. **Platform Configuration**
   ```bash
   # Created .npmrc with:
   platform=win32
   arch=x64
   npm install
   ```
   *Result: Binary still missing*

5. **Force Flag**
   ```bash
   npm install --force
   ```
   *Result: Binary still missing*

### ✅ Successful Solution

**pnpm Installation**
```bash
pnpm install
```
*Result: All dependencies including @rollup/rollup-win32-x64-msvc installed correctly on first attempt*

---

## Additional Resources

- [npm Optional Dependencies Bug](https://github.com/npm/cli/issues/4828)
- [pnpm Documentation](https://pnpm.io/)
- [Rollup GitHub Issues](https://github.com/rollup/rollup/issues)
- [Vite Troubleshooting](https://vitejs.dev/guide/troubleshooting.html)

---

## Getting Help

If you continue to experience issues:

1. Check the [GitHub Issues](https://github.com/MushroomFleet/ace-commander-ai/issues)
2. Verify your environment matches the requirements
3. Try the complete clean install procedure
4. Open a new issue with:
   - Your OS and version
   - Node.js and npm/pnpm versions
   - Complete error output
   - Steps you've already tried

---

**Last Updated**: November 10, 2025  
**Document Version**: 1.0.0
