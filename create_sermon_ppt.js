const pptxgen = require('pptxgenjs');
const path = require('path');
const os = require('os');

let pptx = new pptxgen();

// Slide 1 (Title slide)
let slide1 = pptx.addSlide();
slide1.addText("에베소서 1:15-23", { x: '10%', y: '30%', w: '80%', h: 1, fontSize: 36, align: 'center', bold: true });
slide1.addText("그리스도 안에서 우리의 기도와 능력\n영광스러운 하나님의 얼굴을 구하며", { x: '10%', y: '50%', w: '80%', h: 1.5, fontSize: 24, align: 'center' });

// Slide 2
let slide2 = pptx.addSlide();
slide2.addText("서론: 진정한 기도의 기초 (15-16절)", { x: '5%', y: '5%', w: '90%', h: 1, fontSize: 28, bold: true });
slide2.addText(
    [
        { text: "감사와 끊임없는 중보기도", options: { bullet: true } },
        { text: "신자들의 진정한 믿음과 사랑에 대한 감사", options: { bullet: true } },
        { text: "요구가 아닌 감사로 충만한 기도", options: { bullet: true } }
    ],
    { x: '10%', y: '20%', w: '80%', h: '70%', fontSize: 20 }
);

// Slide 3
let slide3 = pptx.addSlide();
slide3.addText("영적인 조명을 위한 기도 (17-19절 상)", { x: '5%', y: '5%', w: '90%', h: 1, fontSize: 28, bold: true });
slide3.addText(
    [
        { text: "지혜와 계시의 영을 통한 변화", options: { bullet: true } },
        { text: "피상적 지식이 아닌 하나님을 아는 경험적 지식", options: { bullet: true } },
        { text: "마음의 눈을 밝히사 진리를 깨닫게 하심", options: { bullet: true } }
    ],
    { x: '10%', y: '20%', w: '80%', h: '70%', fontSize: 20 }
);

// Slide 4
let slide4 = pptx.addSlide();
slide4.addText("우리가 깨달아야 할 세 가지 진리", { x: '5%', y: '5%', w: '90%', h: 1, fontSize: 28, bold: true });
slide4.addText(
    [
        { text: "1. 부르심의 소망: 신자를 기다리는 확실한 미래", options: { bullet: true } },
        { text: "2. 기업의 영광의 풍성함: 헤아릴 수 없는 영적 부요함", options: { bullet: true } },
        { text: "3. 베푸신 능력의 지극히 크심: 우리 안에서 역사하시는 무한한 능력", options: { bullet: true } }
    ],
    { x: '10%', y: '20%', w: '80%', h: '70%', fontSize: 20 }
);

// Slide 5
let slide5 = pptx.addSlide();
slide5.addText("그리스도의 지상권과 하나님의 능력 (19절 하-23절)", { x: '5%', y: '5%', w: '90%', h: 1, fontSize: 28, bold: true });
slide5.addText(
    [
        { text: "그리스도의 부활: 능력의 궁극적 증명", options: { bullet: true } },
        { text: "승천과 우편 좌정: 만물에 대한 절대적 주권", options: { bullet: true } },
        { text: "교회의 머리 되신 그리스도", options: { bullet: true } }
    ],
    { x: '10%', y: '20%', w: '80%', h: '70%', fontSize: 20 }
);

// Slide 6
let slide6 = pptx.addSlide();
slide6.addText("교회: 그리스도의 몸", { x: '5%', y: '5%', w: '90%', h: 1, fontSize: 28, bold: true });
slide6.addText(
    [
        { text: "그리스도의 보편적 권위의 수혜자", options: { bullet: true } },
        { text: "만물을 충만하게 하시는 이의 충만함", options: { bullet: true } },
        { text: "세상을 향한 그리스도의 임재의 가시적 표현", options: { bullet: true } }
    ],
    { x: '10%', y: '20%', w: '80%', h: '70%', fontSize: 20 }
);

// Slide 7
let slide7 = pptx.addSlide();
slide7.addText("우리의 기도와 삶에 대한 적용", { x: '5%', y: '5%', w: '90%', h: 1, fontSize: 28, bold: true });
slide7.addText(
    [
        { text: "감사와 중보기도의 정신 함양", options: { bullet: true } },
        { text: "영적 조명을 위한 간절한 기도", options: { bullet: true } },
        { text: "그리스도의 주권적 능력 안에서의 안식", options: { bullet: true } },
        { text: "그리스도의 몸으로서의 적극적인 삶", options: { bullet: true } }
    ],
    { x: '10%', y: '20%', w: '80%', h: '70%', fontSize: 20 }
);

const outputPath = path.join(os.homedir(), 'Desktop', '에베소서_설교_PPT.pptx');
pptx.writeFile({ fileName: outputPath }).then(fileName => {
    console.log(`Saved PPT to ${fileName}`);
}).catch(err => {
    console.error(err);
});
