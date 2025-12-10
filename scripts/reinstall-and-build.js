const fs = require('fs');
const path = require('path');
const { execSync, spawnSync } = require('child_process');

const rootDir = process.cwd();

// Конфигурация проектов
const projects = [
    {
        name: 'shared',
        path: path.join(rootDir, 'libs', 'shared'),
        packageJson: path.join(rootDir, 'libs', 'shared', 'package.json'),
        buildCommand: 'nx run shared:build',
    },
    {
        name: 'backend',
        path: path.join(rootDir, 'apps', 'backend'),
        packageJson: path.join(rootDir, 'apps', 'backend', 'package.json'),
        buildCommand: 'nx run backend:build',
    },
    {
        name: 'frontend',
        path: path.join(rootDir, 'apps', 'frontend'),
        packageJson: path.join(rootDir, 'apps', 'frontend', 'package.json'),
        buildCommandDev: 'nx run frontend:build --configuration=development',
        buildCommandProd: 'nx run frontend:build --configuration=production',
    },
];

// Утилиты для работы с командами
function runCommand(command, cwd = rootDir, showOutput = true) {
    console.log(`\n> ${command}`);
    console.log(`  in: ${cwd}`);

    try {
        const options = {
            cwd,
            stdio: showOutput ? 'inherit' : 'pipe',
            encoding: 'utf-8',
            shell: true,
        };

        const result = execSync(command, options);
        if (!showOutput && result) {
            console.log(result);
        }
        return { success: true, output: result };
    } catch (error) {
        console.error(`❌ Command failed: ${command}`);
        console.error(`Error: ${error.message}`);
        if (error.stdout) {
            console.error(`Stdout: ${error.stdout}`);
        }
        if (error.stderr) {
            console.error(`Stderr: ${error.stderr}`);
        }
        return { success: false, error: error.message };
    }
}

function runYarnCommand(args, cwd = rootDir, showOutput = true) {
    const command = `yarn ${args}`;
    return runCommand(command, cwd, showOutput);
}

function runNxCommand(args, cwd = rootDir) {
    const command = `npx nx ${args}`;
    return runCommand(command, cwd, true);
}

// Функции очистки
function deleteNodeModules(dir) {
    const nodeModulesPath = path.join(dir, 'node_modules');
    if (fs.existsSync(nodeModulesPath)) {
        console.log(`🗑️  Deleting ${nodeModulesPath}`);
        try {
            fs.rmSync(nodeModulesPath, {
                recursive: true,
                force: true,
                maxRetries: 3,
            });
        } catch (error) {
            console.warn(
                `⚠️  Failed to delete ${nodeModulesPath}: ${error.message}`,
            );
        }
    }
}

function deleteDist(dir) {
    const distPath = path.join(dir, 'dist');
    if (fs.existsSync(distPath)) {
        console.log(`🗑️  Deleting ${distPath}`);
        try {
            fs.rmSync(distPath, {
                recursive: true,
                force: true,
                maxRetries: 3,
            });
        } catch (error) {
            console.warn(`⚠️  Failed to delete ${distPath}: ${error.message}`);
        }
    }
}

function deleteLockFiles(dir) {
    const lockFiles = ['package-lock.json', 'yarn.lock'];
    lockFiles.forEach((lockFile) => {
        const lockFilePath = path.join(dir, lockFile);
        if (fs.existsSync(lockFilePath)) {
            console.log(`🗑️  Deleting ${lockFilePath}`);
            try {
                fs.unlinkSync(lockFilePath);
            } catch (error) {
                console.warn(
                    `⚠️  Failed to delete ${lockFilePath}: ${error.message}`,
                );
            }
        }
    });
}

function cleanDirectory(dir) {
    console.log(`\n🧹 Cleaning ${dir}`);
    deleteNodeModules(dir);
    deleteDist(dir);
    deleteLockFiles(dir);
}

// Установка зависимостей
function installDependencies(project) {
    console.log(`\n📦 Installing dependencies for ${project.name}`);

    // Проверяем наличие package.json
    if (!fs.existsSync(project.packageJson)) {
        console.log(`❌ Package.json not found at ${project.packageJson}`);
        return { success: false, error: 'Package.json not found' };
    }

    try {
        // Используем yarn
        const result = runYarnCommand('install', project.path);

        if (!result.success) {
            console.log(`⚠️  Trying with npm instead...`);
            // Если yarn не сработал, пробуем npm
            const npmResult = runCommand('npm install', project.path);
            return npmResult;
        }

        return result;
    } catch (error) {
        console.error(
            `❌ Failed to install dependencies for ${project.name}: ${error.message}`,
        );
        return { success: false, error: error.message };
    }
}

// Сборка проектов
function buildProject(project, mode) {
    console.log(`\n🔨 Building ${project.name} (${mode})`);

    try {
        let buildCommand;

        if (project.name === 'frontend') {
            buildCommand =
                mode === 'dev'
                    ? project.buildCommandDev
                    : project.buildCommandProd;
        } else {
            buildCommand = project.buildCommand;
        }

        const result = runCommand(buildCommand, rootDir);
        return result;
    } catch (error) {
        console.error(`❌ Failed to build ${project.name}: ${error.message}`);
        return { success: false, error: error.message };
    }
}

// Основная функция
async function main() {
    const args = process.argv.slice(2);
    const mode = args.includes('--mode=prod') ? 'prod' : 'dev';
    const skipClean = args.includes('--skip-clean');
    const skipInstall = args.includes('--skip-install');
    const skipBuild = args.includes('--skip-build');

    console.log('🚀 Starting reinstall and build process');
    console.log(`📊 Mode: ${mode}`);
    console.log(`⚙️  Skip clean: ${skipClean}`);
    console.log(`⚙️  Skip install: ${skipInstall}`);
    console.log(`⚙️  Skip build: ${skipBuild}`);

    const results = {
        clean: { success: false, errors: [] },
        install: [],
        build: [],
    };

    try {
        // 1. Очистка
        if (!skipClean) {
            console.log('\n=== STEP 1: CLEANING ===');

            // Очищаем корень
            cleanDirectory(rootDir);

            // Очищаем все проекты
            for (const project of projects) {
                cleanDirectory(project.path);
            }

            // Удаляем кэш Nx
            const nxCacheDir = path.join(rootDir, '.nx', 'cache');
            if (fs.existsSync(nxCacheDir)) {
                console.log(`🗑️  Deleting Nx cache at ${nxCacheDir}`);
                fs.rmSync(nxCacheDir, { recursive: true, force: true });
            }

            results.clean.success = true;
            console.log('✅ Cleanup completed!');
        } else {
            console.log('⏭️  Skipping cleanup');
            results.clean.success = true;
        }

        // 2. Установка зависимостей
        if (!skipInstall) {
            console.log('\n=== STEP 2: INSTALLING DEPENDENCIES ===');

            // Устанавливаем корневые зависимости
            console.log('\n📦 Installing root dependencies');
            const rootInstall = runYarnCommand('install', rootDir);
            if (!rootInstall.success) {
                console.log('⚠️  Root install failed, trying npm...');
                runCommand('npm install', rootDir);
            }

            // Устанавливаем зависимости проектов
            for (const project of projects) {
                const installResult = installDependencies(project);
                results.install.push({
                    project: project.name,
                    success: installResult.success,
                    error: installResult.error,
                });

                if (!installResult.success) {
                    console.log(
                        `❌ Skipping ${project.name} due to installation failure`,
                    );
                }
            }
        } else {
            console.log('⏭️  Skipping installation');
            projects.forEach((project) => {
                results.install.push({
                    project: project.name,
                    success: true,
                    error: null,
                });
            });
        }

        // 3. Сборка проектов
        if (!skipBuild) {
            console.log('\n=== STEP 3: BUILDING PROJECTS ===');

            const buildOrder = ['shared', 'backend', 'frontend'];

            for (const projectName of buildOrder) {
                const project = projects.find((p) => p.name === projectName);
                if (!project) continue;

                // Проверяем, установился ли проект
                const installResult = results.install.find(
                    (r) => r.project === projectName,
                );
                const canBuild = installResult ? installResult.success : true;

                if (!canBuild) {
                    console.log(
                        `⏭️  Skipping build for ${projectName} (installation failed)`,
                    );
                    results.build.push({
                        project: projectName,
                        success: false,
                        error: 'Installation failed',
                        skipped: true,
                    });
                    continue;
                }

                try {
                    const buildResult = buildProject(project, mode);
                    results.build.push({
                        project: projectName,
                        success: buildResult.success,
                        error: buildResult.error,
                        skipped: false,
                    });

                    if (!buildResult.success) {
                        console.log(
                            `⚠️  Build failed for ${projectName}, but continuing...`,
                        );
                    }
                } catch (error) {
                    console.error(
                        `❌ Build error for ${projectName}: ${error.message}`,
                    );
                    results.build.push({
                        project: projectName,
                        success: false,
                        error: error.message,
                        skipped: false,
                    });
                    // Продолжаем со следующим проектом
                }
            }
        } else {
            console.log('⏭️  Skipping build');
        }

        // Вывод результатов
        console.log('\n=== RESULTS ===');

        if (!skipInstall) {
            console.log('\n📦 Installation Results:');
            results.install.forEach((result) => {
                const status = result.success ? '✅' : '❌';
                console.log(
                    `  ${status} ${result.project}: ${result.success ? 'Success' : 'Failed'}`,
                );
                if (result.error) {
                    console.log(`     Error: ${result.error}`);
                }
            });
        }

        if (!skipBuild) {
            console.log('\n🔨 Build Results:');
            results.build.forEach((result) => {
                const status = result.success
                    ? '✅'
                    : result.skipped
                      ? '⏭️'
                      : '❌';
                console.log(
                    `  ${status} ${result.project}: ${result.success ? 'Success' : result.skipped ? 'Skipped' : 'Failed'}`,
                );
                if (result.error && !result.skipped) {
                    console.log(`     Error: ${result.error}`);
                }
            });
        }

        // Статистика
        const successfulInstalls = results.install.filter(
            (r) => r.success,
        ).length;
        const successfulBuilds = results.build.filter((r) => r.success).length;
        const totalProjects = projects.length;

        console.log('\n📊 Statistics:');
        console.log(`  Total projects: ${totalProjects}`);
        if (!skipInstall) {
            console.log(
                `  Successfully installed: ${successfulInstalls}/${totalProjects}`,
            );
        }
        if (!skipBuild) {
            console.log(
                `  Successfully built: ${successfulBuilds}/${totalProjects}`,
            );
        }

        // Определяем успешность выполнения
        const hasFailedBuilds = results.build.some(
            (r) => !r.success && !r.skipped,
        );
        const hasFailedInstalls = results.install.some((r) => !r.success);

        if (hasFailedBuilds) {
            console.log('\n⚠️  Some builds failed, but process completed.');
            process.exit(0); // Выходим с кодом 0, так как мы продолжили после ошибок
        } else if (hasFailedInstalls && !skipInstall) {
            console.log('\n⚠️  Some installations failed.');
            process.exit(1);
        } else {
            console.log('\n🎉 All tasks completed successfully!');
            process.exit(0);
        }
    } catch (error) {
        console.error('\n💥 Fatal error:', error.message);
        console.error(error.stack);
        process.exit(1);
    }
}

// Запускаем
main();
