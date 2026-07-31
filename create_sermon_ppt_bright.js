const pptxgen = require('pptxgenjs');
const path = require('path');
const os = require('os');

let pptx = new pptxgen();

// Master Slide Design - 환하고 따뜻한 화려함 (Bright & Warm)
pptx.defineSlideMaster({
    title: 'BRIGHT_FANCY',
    background: { fill: 'FFF9F5' }, // 따뜻한 미색 (Soft Peach White)
    objects: [
        // 상단 포인트 라인 (골드 & 오렌지 계열)
        { rect: { x: 0, y: 0, w: '100%', h: 0.15, fill: { color: 'FF9A8B' } } },
        { rect: { x: 0, y: 0.15, w: '100%', h: 0.05, fill: { color: 'FF6A88' } } },
        // 하단 포인트 라인
        { rect: { x: 0, y: '97%', w: '100%', h: 0.1, fill: { color: 'FF9A8B' } } },
        { rect: { x: 0, y: '98%', w: '100%', h: 0.1, fill: { color: 'FF6A88' } } }
    ]
});

// Helper function to add slides easily
function addBrightSlide(titleText, contentArray) {
    let slide = pptx.addSlide({ masterName: 'BRIGHT_FANCY' });
    
    // Title
    slide.addText(titleText, { 
        x: 0.5, y: 0.6, w: '90%', h: 1, 
        fontSize: 34, 
        color: 'D23669', // 진한 핑크/버건디 계열로 또렷하게
        bold: true,
        shadow: { type: 'outer', color: 'FFFFFF', blur: 2, offset: 1, angle: 45 }
    });
    
    // Content
    slide.addText(contentArray, { 
        x: 0.6, y: 1.8, w: '88%', h: '70%', 
        fontSize: 22, 
        color: '333333', // 짙은 회색으로 가독성 확보
        valign: 'top',
        lineSpacing: 38
    });
}

// Slide 1 (Title slide)
let slide1 = pptx.addSlide({ masterName: 'BRIGHT_FANCY' });
slide1.addText("내 눈을 열어주소서", { 
    x: '10%', y: '30%', w: '80%', h: 1.2, 
    fontSize: 54, align: 'center', bold: true, color: 'D23669',
    shadow: { type: 'outer', color: 'FF9A8B', blur: 3, offset: 2, angle: 45 }
});
slide1.addText("상상 그 이상의 능력과 소망을 발견하는 삶\n에베소서 1:15-23", { 
    x: '10%', y: '50%', w: '80%', h: 1.5, 
    fontSize: 26, align: 'center', color: '555555', bold: true 
});

// Slide 2
addBrightSlide("서론: 감사로 시작하는 깊은 기도 (15-16절)", [
    { text: "에베소 성도들의 믿음과 사랑을 향한 끝없는 감사", options: { bullet: { type: 'number' }, bold: true, color: 'FF6A88' } },
    { text: "자녀가 잘 자라는 모습을 보는 부모의 벅찬 기쁨처럼", options: { bullet: true } },
    { text: "이미 받은 축복을 넘어 진정한 의미를 깨닫기를 바라는 간절함", options: { bullet: true } }
]);

// Slide 3
addBrightSlide("1. 영적 GPS를 켜는 기도 (17-19a절)", [
    { text: "\"지혜와 계시의 영을 주사 하나님을 알게 하시고\"", options: { bullet: { type: 'number' }, bold: true, color: 'D23669' } },
    { text: "최고의 지도가 있어도 영적 GPS(성령님)가 켜져야 합니다.", options: { bullet: true } },
    { text: "성령님이 마음의 눈을 열어주시지 않으면 볼 수 없는 영광", options: { bullet: true } },
    { text: "머리가 아닌 가슴으로 만나는 생생한 하나님과의 동행", options: { bullet: true } }
]);

// Slide 4
addBrightSlide("마음의 눈을 열어 보아야 할 세 가지", [
    { text: "첫째, 부르심의 소망", options: { bullet: true, bold: true, color: 'FF6A88' } },
    { text: "하나님의 신실하심에 근거한 확실하고 영광스러운 우리의 미래", options: { indentLevel: 1 } },
    { text: "둘째, 기업의 영광의 풍성함", options: { bullet: true, bold: true, color: 'FF6A88' } },
    { text: "우리는 이미 구원과 사랑을 가진 영적으로 가장 부요한 자녀!", options: { indentLevel: 1 } },
    { text: "셋째, 지극히 크신 능력", options: { bullet: true, bold: true, color: 'FF6A88' } },
    { text: "지금도 우리 안에 활발하게 살아 숨 쉬는 역동적인 힘", options: { indentLevel: 1 } }
]);

// Slide 5
addBrightSlide("2. 상상 그 이상의 능력 (19b-21절)", [
    { text: "어떤 능력일까요? 죽음을 이기고 다시 살아나신 파워!", options: { bullet: { type: 'number' }, bold: true, color: 'D23669' } },
    { text: "모든 권세 위에 뛰어나신 절대적인 주권과 승리", options: { bullet: true } },
    { text: "단순히 과거의 사건이 아니라 지금 내 안에서 역사하는 힘", options: { bullet: true } },
    { text: "우리의 한계를 뛰어넘고 두려움을 잠재우는 생명의 능력입니다.", options: { bullet: true, bold: true, color: 'FF6A88' } }
]);

// Slide 6
addBrightSlide("3. 당신은 거대한 계획의 일부입니다 (22-23절)", [
    { text: "그리스도는 만물의 머리요, 우리는 그분의 '살아있는 몸'", options: { bullet: { type: 'number' }, bold: true, color: 'D23669' } },
    { text: "\"만물 안에서 만물을 충만하게 하시는 이의 충만함\"", options: { bullet: true } },
    { text: "우주를 채우시는 하나님께서 우리를 통해 영광을 나타내십니다.", options: { bullet: true } },
    { text: "여러분 한 사람, 그리고 우리 교회가 바로 이 놀라운 계획의 중심!", options: { bullet: true, bold: true, color: 'FF6A88' } }
]);

// Slide 7
addBrightSlide("실천과 감동: 이제 어떻게 살아야 할까요?", [
    { text: "\"주님, 제 눈을 열어주세요!\"", options: { bullet: true, bold: true, color: 'D23669' } },
    { text: "날마다 성령님께 마음의 눈을 열어달라고 간절히 구합시다.", options: { indentLevel: 1 } },
    { text: "그분의 능력으로 오늘을 살아갑시다.", options: { bullet: true, bold: true, color: 'D23669' } },
    { text: "두려움을 이기고 부활의 능력을 의지하여 담대히 나아가십시오.", options: { indentLevel: 1 } },
    { text: "우리는 그리스도의 몸입니다!", options: { bullet: true, bold: true, color: 'D23669' } },
    { text: "서로 사랑하고 섬기며, 이 세상에 흘러넘치는 축복의 통로가 됩시다.", options: { indentLevel: 1 } }
]);

const outputPath = path.join(os.homedir(), 'Desktop', '에베소서_설교_환하고화려한PPT.pptx');
pptx.writeFile({ fileName: outputPath }).then(fileName => {
    console.log(`Saved PPT to ${fileName}`);
}).catch(err => {
    console.error(err);
});
