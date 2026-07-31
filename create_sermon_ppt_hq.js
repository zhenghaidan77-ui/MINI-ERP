const pptxgen = require('pptxgenjs');
const path = require('path');
const os = require('os');

let pptx = new pptxgen();

// Master Slide Design - High Quality, Sharp, and Dignified (Navy & Gold)
pptx.defineSlideMaster({
    title: 'HIGH_QUALITY',
    background: { fill: 'FFFFFF' }, // Pure white for maximum sharpness and contrast
    objects: [
        // Top Navy Bar
        { rect: { x: 0, y: 0, w: '100%', h: 0.25, fill: { color: '1A365D' } } },
        // Thin Gold line below the Navy Bar
        { rect: { x: 0, y: 0.25, w: '100%', h: 0.05, fill: { color: 'C5A059' } } },
        // Bottom Gold Bar
        { rect: { x: 0, y: '96.5%', w: '100%', h: 0.05, fill: { color: 'C5A059' } } },
        // Bottom Navy Bar
        { rect: { x: 0, y: '97%', w: '100%', h: 0.15, fill: { color: '1A365D' } } }
    ]
});

// Helper function to add slides easily
function addHQSlide(titleText, contentArray) {
    let slide = pptx.addSlide({ masterName: 'HIGH_QUALITY' });
    
    // Title
    slide.addText(titleText, { 
        x: 0.5, y: 0.7, w: '90%', h: 1, 
        fontSize: 36, 
        color: '1A365D', // Navy
        bold: true,
        shadow: { type: 'outer', color: 'DDDDDD', blur: 2, offset: 1, angle: 45 }
    });
    
    // Content
    slide.addText(contentArray, { 
        x: 0.6, y: 2.0, w: '88%', h: '65%', 
        fontSize: 24, 
        color: '212529', // Dark Gray/Black for sharp reading
        valign: 'top',
        lineSpacing: 40
    });
}

// Slide 1 (Title slide)
let slide1 = pptx.addSlide({ masterName: 'HIGH_QUALITY' });
slide1.addText("우리의 눈을 열어 보게 하옵소서", { 
    x: '10%', y: '35%', w: '80%', h: 1.2, 
    fontSize: 54, align: 'center', bold: true, color: '1A365D',
    shadow: { type: 'outer', color: 'C5A059', blur: 3, offset: 2, angle: 45 }
});
slide1.addText("에베소서 1장 15-23절\n\n은혜로운 금요 기도회", { 
    x: '10%', y: '55%', w: '80%', h: 1.5, 
    fontSize: 28, align: 'center', color: '4A5568', bold: true 
});

// Slide 2
addHQSlide("1. 감사와 중보기도 (15-16절)", [
    { text: "진정한 믿음과 사랑에 대한 끝없는 감사", options: { bullet: { type: 'number' }, bold: true, color: 'C5A059' } },
    { text: "우리의 기도는 요구가 아닌 '감사'로 가득 차야 합니다.", options: { bullet: true } },
    { text: "누군가가 매일 나를 위해 기도하고 있다면!", options: { bullet: { type: 'number' }, bold: true, color: 'C5A059' } },
    { text: "누군가가 생각난다면, 그것은 하나님이 주신 중보의 사명입니다.", options: { bullet: true } },
    { text: "나의 기도로 누군가는 생명을 얻고 사역을 감당합니다.", options: { bullet: true } }
]);

// Slide 3
addHQSlide("2. 영적인 조명을 위한 열렬한 간구 (17-19a절)", [
    { text: "더 많은 정보가 아닌, '계시를 통한 변화'를 위한 기도", options: { bullet: { type: 'number' }, bold: true, color: '1A365D' } },
    { text: "성령님께서 우리의 '마음의 눈'을 열어주시기를 구합니다.", options: { bullet: true } },
    { text: "단순한 지적 동의를 넘어선 경험적인 지식", options: { bullet: { type: 'number' }, bold: true, color: '1A365D' } },
    { text: "진리가 우리의 머리에서 가슴으로 내려와야 합니다.", options: { bullet: true } }
]);

// Slide 4
addHQSlide("3. 깨달아야 할 영광스러운 진리 (1)", [
    { text: "그의 부르심의 소망", options: { bullet: true, bold: true, color: 'C5A059' } },
    { text: "막연한 바람이 아닌, 하나님의 신실하심에 근거한 확신에 찬 기대", options: { indentLevel: 1 } },
    { text: "그의 영광스러운 유업의 풍성함", options: { bullet: true, bold: true, color: 'C5A059' } },
    { text: "우리가 소유한 헤아릴 수 없는 영적 부요함", options: { indentLevel: 1 } },
    { text: "하나님 자신이 우리의 가장 큰 보물입니다.", options: { indentLevel: 1 } }
]);

// Slide 5
addHQSlide("4. 깨달아야 할 영광스러운 진리 (2)", [
    { text: "베푸신 능력의 지극히 크심", options: { bullet: true, bold: true, color: 'C5A059' } },
    { text: "우리 삶 속에 역사하는 무한하고 활동적이며 역동적인 능력!", options: { indentLevel: 1 } },
    { text: "그 능력은 어떻게 나타났습니까?", options: { bullet: true, bold: true, color: '1A365D' } },
    { text: "그리스도를 죽음에서 살리신 '부활의 능력'", options: { indentLevel: 1 } },
    { text: "모든 권세 위에 뛰어나신 하나님의 보좌 우편에 앉으신 '승천의 능력'", options: { indentLevel: 1 } },
    { text: "그리스도의 승리는 완전합니다.", options: { indentLevel: 1, color: 'C5A059', bold: true } }
]);

// Slide 6
addHQSlide("5. 교회의 위대한 정체성 (22-23절)", [
    { text: "만물 위에 교회의 머리가 되신 그리스도", options: { bullet: { type: 'number' }, bold: true, color: '1A365D' } },
    { text: "교회는 나중에 생각된 것이 아닌, 보편적 권위의 직접적인 수혜자입니다.", options: { bullet: true } },
    { text: "만물 안에서 만물을 충만하게 하시는 이의 충만함", options: { bullet: { type: 'number' }, bold: true, color: '1A365D' } },
    { text: "지상의 교회를 통해 하나님의 임재와 영광을 세상에 나타내십니다.", options: { bullet: true } }
]);

// Slide 7
addHQSlide("결론: 우리의 삶과 기도에 대한 적용", [
    { text: "감사와 중보기도의 정신을 함양하십시오.", options: { bullet: true, bold: true, color: 'C5A059' } },
    { text: "동료 신자들의 삶을 보며 구체적으로 감사하고 기도합시다.", options: { indentLevel: 1 } },
    { text: "영적인 조명을 위해 간절히 기도하십시오.", options: { bullet: true, bold: true, color: 'C5A059' } },
    { text: "내 마음의 눈이 열려 하나님의 크신 능력을 깊이 체험하게 하옵소서.", options: { indentLevel: 1 } },
    { text: "그리스도의 주권적인 능력 안에서 안식하십시오.", options: { bullet: true, bold: true, color: 'C5A059' } },
    { text: "두려움 앞에서도 만물 위에 뛰어나신 주님을 굳게 신뢰합시다.", options: { indentLevel: 1 } },
    { text: "영광스러운 교회의 지체로 살아갑시다.", options: { bullet: true, bold: true, color: 'C5A059' } },
    { text: "세상 앞에 생명력 넘치는 주의 몸으로 그리스도의 영광을 비추십시다.", options: { indentLevel: 1 } }
]);

const outputPath = path.join(os.homedir(), 'Desktop', '우리의_눈을_열어보게_하옵소서_고퀄리티.pptx');
pptx.writeFile({ fileName: outputPath }).then(fileName => {
    console.log(`Saved PPT to ${fileName}`);
}).catch(err => {
    console.error(err);
});
