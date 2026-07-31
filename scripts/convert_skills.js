const fs = require('fs');
const path = require('path');

const rootDir = 'd:\\NATAS Harnes-menu';
const skillsDir = path.join(rootDir, '.agents', 'skills');

if (!fs.existsSync(skillsDir)) {
    fs.mkdirSync(skillsDir, { recursive: true });
}

const fallbackMap = {
    '라이프-개인재정관리': 'personal_finance',
    '라이프-식탁관리': 'meal_management',
    '콘텐츠-Youtube 영상 콘텐츠의 기획': 'youtube_planner'
};

const extractSkillName = (dirName) => {
    if (fallbackMap[dirName]) return fallbackMap[dirName];
    
    // Extract english words at the end
    const match = dirName.match(/([a-z\s&]+)$/i);
    if (match) {
        return match[1].trim().toLowerCase().replace(/[\s&]+/g, '_');
    }
    
    // Fallback if no english found
    return 'skill_' + Date.now();
};

const processDir = (dir) => {
    const geminiPath = path.join(rootDir, dir, 'GEMINI.md');
    const agentsPath = path.join(rootDir, dir, 'AGENTS.md');
    
    let sourcePath = null;
    if (fs.existsSync(geminiPath)) sourcePath = geminiPath;
    else if (fs.existsSync(agentsPath)) sourcePath = agentsPath;
    
    if (!sourcePath) return;
    
    const content = fs.readFileSync(sourcePath, 'utf8');
    
    // skip if it's the e-commerce launcher since we already made it a skill manually
    if (dir.includes('e-commerce launcher')) return;
    
    const skillName = extractSkillName(dir);
    
    // Extract title and description
    let title = skillName;
    let desc = dir + " 에이전트 스킬입니다.";
    
    const lines = content.split('\n');
    let titleFound = false;
    for (const line of lines) {
        if (line.startsWith('# ') && !titleFound) {
            title = line.substring(2).trim();
            titleFound = true;
        } else if (titleFound && line.trim().length > 0 && !line.startsWith('>')) {
            desc = line.trim();
            break;
        }
    }
    
    const yaml = `---\nname: ${skillName}\ndescription: ${desc}\n---\n\n`;
    
    const finalContent = yaml + content;
    
    const targetSkillDir = path.join(skillsDir, skillName);
    if (!fs.existsSync(targetSkillDir)) {
        fs.mkdirSync(targetSkillDir, { recursive: true });
    }
    
    const targetFilePath = path.join(targetSkillDir, 'SKILL.md');
    fs.writeFileSync(targetFilePath, finalContent, 'utf8');
    
    console.log(`Converted: ${dir} -> ${skillName}`);
};

const dirs = fs.readdirSync(rootDir, { withFileTypes: true })
    .filter(dirent => dirent.isDirectory())
    .map(dirent => dirent.name);

for (const dir of dirs) {
    if (dir.startsWith('.')) continue; // skip hidden dirs
    processDir(dir);
}

console.log('Conversion complete!');
