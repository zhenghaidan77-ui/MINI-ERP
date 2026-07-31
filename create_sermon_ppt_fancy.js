const pptxgen = require('pptxgenjs');
const path = require('path');
const os = require('os');

let pptx = new pptxgen();

// Master Slide Design
pptx.defineSlideMaster({
    title: 'FANCY',
    background: { fill: '0f2027' }, // Dark elegant background
    objects: [
        // Top accent bar
        { rect: { x: 0, y: 0, w: '100%', h: 0.1, fill: { color: 'f2a65a' } } },
        // Bottom accent bar
        { rect: { x: 0, y: '98%', w: '100%', h: 0.2, fill: { color: 'f2a65a' } } }
    ]
});

// Helper function to add default slide
function addFancySlide(titleText, contentArray) {
    let slide = pptx.addSlide({ masterName: 'FANCY' });
    
    // Title
    slide.addText(titleText, { 
        x: 0.5, y: 0.5, w: '90%', h: 1, 
        fontSize: 32, 
        color: 'f2a65a', // Gold/Orange-ish
        bold: true,
        shadow: { type: 'outer', color: '000000', blur: 3, offset: 2, angle: 45 }
    });
    
    // Content
    slide.addText(contentArray, { 
        x: 0.5, y: 1.8, w: '90%', h: '70%', 
        fontSize: 22, 
        color: 'ffffff', 
        valign: 'top',
        lineSpacing: 36
    });
}

// Slide 1 (Title slide)
let slide1 = pptx.addSlide({ masterName: 'FANCY' });
slide1.addText("에베소서 1:15-23", { 
    x: '10%', y: '30%', w: '80%', h: 1, 
    fontSize: 48, align: 'center', bold: true, color: 'f2a65a',
    shadow: { type: 'outer', color: '000000', blur: 3, offset: 2, angle: 45 }
});
slide1.addText("감사와 중보, 그리고 부활의 능력\n은혜로운 금요 기도회", { 
    x: '10%', y: '50%', w: '80%', h: 1.5, 
    fontSize: 26, align: 'center', color: 'ffffff' 
});

// Slide 2
addFancySlide("감사와 중보, 기도의 시작입니다 (15-16절)", [
    { text: "바울의 기도는 ‘감사’로 시작됩니다.", options: { bullet: { type: 'number' }, bold: true } },
    { text: "하나님께 드리는 청구서가 아닌, 성도들의 진실한 믿음과 사랑을 향한 벅찬 감사", options: { bullet: true } },
    { text: "우리 기도의 바탕에도 이 ‘감사’가 있어야 합니다.", options: { bullet: { type: 'number' }, bold: true } },
    { text: "억지로 하는 의무감이 아닌 기쁨과 감사의 사명", options: { bullet: true } },
    { text: "여러분의 기도 한 줄로 누군가는 다시 살아납니다.", options: { bullet: true } }
]);

// Slide 3
addFancySlide("지식을 넘어선 체험, 마음의 눈을 여십시오 (17절)", [
    { text: "지혜와 계시의 영을 주사 (17절)", options: { bullet: { type: 'number' }, bold: true, color: '87ceeb' } },
    { text: "단순한 성경 지식을 더 달라는 기도가 아닙니다.", options: { bullet: true } },
    { text: "성령님께서 우리의 닫힌 '마음의 눈'을 활짝 열어달라는 간구", options: { bullet: true } },
    { text: "하나님을 아는 것은 가슴으로 부딪히고 경험하는 생생한 체험입니다.", options: { bullet: { type: 'number' }, bold: true, color: '87ceeb' } },
    { text: "머리에 머물던 십자가의 진리가 뜨거운 가슴으로 내려오는 역사", options: { bullet: true } }
]);

// Slide 4
addFancySlide("마음의 눈을 열어 보아야 할 세 가지 진리", [
    { text: "첫째, 부르심의 소망", options: { bullet: true, bold: true, color: 'f2a65a' } },
    { text: "막연한 바람이 아닌, 하나님의 신실하심에 굳게 뿌리내린 흔들리지 않는 확신", options: { indentLevel: 1 } },
    { text: "둘째, 기업의 영광의 풍성함", options: { bullet: true, bold: true, color: 'f2a65a' } },
    { text: "하나님 자신이 바로 우리의 가장 큰 보물이자 영광스러운 유업", options: { indentLevel: 1 } },
    { text: "셋째, 베푸신 능력의 지극히 크심", options: { bullet: true, bold: true, color: 'f2a65a' } },
    { text: "지금도 우리 안에서 역동적으로 살아 숨 쉬고 있는 하나님의 거대한 능력", options: { indentLevel: 1 } }
]);

// Slide 5
addFancySlide("부활의 능력과 교회의 영광 (19-23절)", [
    { text: "예수 그리스도를 죽음에서 다시 살리신 능력", options: { bullet: { type: 'number' }, bold: true } },
    { text: "죄와 사망 권세를 박살 내시고 하늘 보좌 우편에 앉히신 어마어마한 능력", options: { bullet: true } },
    { text: "그 위대하신 그리스도를 ‘교회의 머리’로 삼으셨습니다.", options: { bullet: { type: 'number' }, bold: true } },
    { text: "교회는 세상 끝자락의 초라한 모임이 아닌 그분의 몸!", options: { bullet: true } },
    { text: "우주를 가득 채우시는 그리스도의 임재와 영광을 세상에 나타내는 통로", options: { bullet: true, color: '87ceeb' } }
]);

// Slide 6
addFancySlide("오늘 밤, 우리의 기도가 달라져야 합니다", [
    { text: "감사와 중보의 기도를 회복합시다.", options: { bullet: true, bold: true, color: 'f2a65a' } },
    { text: "내 옆의 지체들, 교회를 위해 감사와 사랑을 담아 중보합시다.", options: { indentLevel: 1 } },
    { text: "영적인 눈을 열어달라고 부르짖읍시다.", options: { bullet: true, bold: true, color: 'f2a65a' } },
    { text: "부르신 소망과 그 크신 능력을 온몸으로 경험하게 하옵소서!", options: { indentLevel: 1 } },
    { text: "그리스도의 주권적인 능력 안에서 평안을 누리십시오.", options: { bullet: true, bold: true, color: 'f2a65a' } },
    { text: "부활의 능력이 내 안에도 동일하게 역사하고 있음을 믿으십시오.", options: { indentLevel: 1 } },
    { text: "영광스러운 교회의 지체로 살아갑시다.", options: { bullet: true, bold: true, color: 'f2a65a' } },
    { text: "생명력 넘치는 주의 몸, 세상 앞에 그리스도의 영광을 비추는 교회가 되도록", options: { indentLevel: 1 } }
]);

const outputPath = path.join(os.homedir(), 'Desktop', '에베소서_설교_화려한PPT.pptx');
pptx.writeFile({ fileName: outputPath }).then(fileName => {
    console.log(`Saved PPT to ${fileName}`);
}).catch(err => {
    console.error(err);
});
