const pptxgen = require('pptxgenjs');
const https = require('https');
const fs = require('fs');
const path = require('path');
const os = require('os');

// Helper to download image with fallback
function downloadImage(url, filename) {
    return new Promise((resolve) => {
        const req = https.get(url, (res) => {
            if (res.statusCode === 301 || res.statusCode === 302) {
                return downloadImage(res.headers.location, filename).then(resolve);
            }
            if (res.statusCode !== 200) {
                console.error(`Failed to download ${url}: ${res.statusCode}`);
                return resolve(null);
            }
            const fileStream = fs.createWriteStream(filename);
            res.pipe(fileStream);
            fileStream.on('error', () => {
                resolve(null);
            });
            fileStream.on('finish', () => {
                fileStream.close();
                resolve(filename);
            });
        });
        req.on('error', () => {
            resolve(null);
        });
    });
}

// Colors
const CREAM = 'FDFBF7';
const BEIGE = 'E8E1D5';
const MUTED_GOLD = 'C5A059';
const CHARCOAL = '2D2D2D';

async function createPPT() {
    console.log("Downloading high-quality images...");
    const img1 = path.join(os.tmpdir(), 'img1.jpg');
    const img2 = path.join(os.tmpdir(), 'img2.jpg');
    const img3 = path.join(os.tmpdir(), 'img3.jpg');
    const img4 = path.join(os.tmpdir(), 'img4.jpg');

    const [img1Path, img2Path, img3Path, img4Path] = await Promise.all([
        downloadImage('https://images.unsplash.com/photo-1490730141103-6cac27aaab94?w=1920&q=80', img1), // Sunset/Warm Light
        downloadImage('https://images.unsplash.com/photo-1544427920-562db94d6c70?w=800&q=80', img2), // Praying hands
        downloadImage('https://images.unsplash.com/photo-1506452305024-9d3f02d1c9b5?w=800&q=80', img3), // Light piercing
        downloadImage('https://images.unsplash.com/photo-1548625361-ec2c99aebaf8?w=1920&q=80', img4), // Church interior
    ]);
    console.log("Images downloaded.");

    let pptx = new pptxgen();
    pptx.layout = 'LAYOUT_16x9';

    // Slide 1: Title Layout
    let slide1 = pptx.addSlide();
    if (img1Path) {
        slide1.background = { path: img1Path };
    } else {
        slide1.background = { fill: BEIGE };
    }
    slide1.addShape(pptx.ShapeType.rect, { x: 0, y: 0, w: '100%', h: '100%', fill: { color: CHARCOAL, transparency: 60 } }); // Opacity overlay
    slide1.addText("우리의 눈을 열어 보게 하옵소서", { x: '10%', y: '40%', w: '80%', h: 1.5, fontSize: 44, color: CREAM, bold: true, align: 'center', fontFace: 'Malgun Gothic' });
    slide1.addShape(pptx.ShapeType.line, { x: '45%', y: '52%', w: '10%', h: 0, line: { color: MUTED_GOLD, width: 2 } });
    slide1.addText("에베소서 1장 15-23절 | 금요기도회 말씀", { x: '10%', y: '55%', w: '80%', h: 1, fontSize: 20, color: MUTED_GOLD, align: 'center', fontFace: 'Malgun Gothic' });

    // Slide 2: Image Right Text Left
    let slide2 = pptx.addSlide();
    slide2.background = { fill: CREAM };
    if (img2Path) {
        slide2.addImage({ path: img2Path, x: '55%', y: 0, w: '45%', h: '100%', sizing: { type: 'crop' } });
    }
    slide2.addText("감사와 중보기도", { x: '5%', y: '10%', w: '45%', h: 1, fontSize: 32, color: CHARCOAL, bold: true, fontFace: 'Malgun Gothic' });
    slide2.addShape(pptx.ShapeType.line, { x: '5%', y: '20%', w: '10%', h: 0, line: { color: MUTED_GOLD, width: 3 } });
    slide2.addText([
        { text: "바울의 기도는 무언가를 달라는 ‘청구서’가 아닙니다.", options: { bullet: { type: 'number' }, breakLine: true } },
        { text: "에베소 성도들의 믿음과 사랑의 소식을 듣고 벅찬 ‘감사’로 기도를 시작합니다.", options: { bullet: { type: 'number' }, breakLine: true } },
        { text: "의무감이 아니라, 영혼 안에서 일하시는 하나님을 향한 기쁨으로 중보해야 합니다.", options: { bullet: { type: 'number' }, breakLine: true } },
        { text: "누군가를 위해 기도하는 것, 이것은 주님이 맡기신 사람을 살리는 가장 위대한 사역입니다.", options: { bullet: { type: 'number' }, breakLine: true, color: MUTED_GOLD, bold: true } }
    ], { x: '5%', y: '25%', w: '45%', h: '60%', fontSize: 20, color: CHARCOAL, lineSpacing: 36, fontFace: 'Malgun Gothic', valign: 'top' });

    // Slide 3: Tiled Text with Icons
    let slide3 = pptx.addSlide();
    slide3.background = { fill: CREAM };
    slide3.addText("영적인 눈이 열릴 때 보게 되는 3가지 진리", { x: '5%', y: '8%', w: '90%', h: 1, fontSize: 32, color: CHARCOAL, bold: true, align: 'center', fontFace: 'Malgun Gothic' });
    
    // Tile 1
    slide3.addShape(pptx.ShapeType.rect, { x: '5%', y: '25%', w: '28%', h: '60%', fill: { color: BEIGE }, line: { color: MUTED_GOLD, width: 1 } });
    slide3.addText("⚓", { x: '5%', y: '30%', w: '28%', h: 0.5, fontSize: 36, align: 'center' });
    slide3.addText("부르심의 소망", { x: '5%', y: '40%', w: '28%', h: 0.5, fontSize: 22, color: CHARCOAL, bold: true, align: 'center', fontFace: 'Malgun Gothic' });
    slide3.addText("막연한 기대가 아니라 하나님의 신실하심에 뿌리내린 흔들리지 않는 약속입니다.", { x: '7%', y: '50%', w: '24%', h: '30%', fontSize: 18, color: CHARCOAL, align: 'center', fontFace: 'Malgun Gothic', valign: 'top', lineSpacing: 24 });

    // Tile 2
    slide3.addShape(pptx.ShapeType.rect, { x: '36%', y: '25%', w: '28%', h: '60%', fill: { color: CHARCOAL }, line: { color: MUTED_GOLD, width: 1 } });
    slide3.addText("💎", { x: '36%', y: '30%', w: '28%', h: 0.5, fontSize: 36, align: 'center' });
    slide3.addText("기업의 영광", { x: '36%', y: '40%', w: '28%', h: 0.5, fontSize: 22, color: MUTED_GOLD, bold: true, align: 'center', fontFace: 'Malgun Gothic' });
    slide3.addText("그리스도 안에서 우리가 누리게 된 엄청난 영적인 부요함과 축복입니다.", { x: '38%', y: '50%', w: '24%', h: '30%', fontSize: 18, color: CREAM, align: 'center', fontFace: 'Malgun Gothic', valign: 'top', lineSpacing: 24 });

    // Tile 3
    slide3.addShape(pptx.ShapeType.rect, { x: '67%', y: '25%', w: '28%', h: '60%', fill: { color: BEIGE }, line: { color: MUTED_GOLD, width: 1 } });
    slide3.addText("✨", { x: '67%', y: '30%', w: '28%', h: 0.5, fontSize: 36, align: 'center' });
    slide3.addText("지극히 크신 능력", { x: '67%', y: '40%', w: '28%', h: 0.5, fontSize: 22, color: CHARCOAL, bold: true, align: 'center', fontFace: 'Malgun Gothic' });
    slide3.addText("죽음을 이기신 생명의 능력이 믿는 우리 안에도 동일하게 역사합니다.", { x: '69%', y: '50%', w: '24%', h: '30%', fontSize: 18, color: CHARCOAL, align: 'center', fontFace: 'Malgun Gothic', valign: 'top', lineSpacing: 24 });

    // Slide 4: Bleed Image Right
    let slide4 = pptx.addSlide();
    slide4.background = { fill: CREAM };
    if (img3Path) {
        slide4.addImage({ path: img3Path, x: '50%', y: 0, w: '50%', h: '100%', sizing: { type: 'crop' } });
    }
    slide4.addText("부활과 승리의 능력", { x: '5%', y: '25%', w: '40%', h: 1, fontSize: 32, color: CHARCOAL, bold: true, fontFace: 'Malgun Gothic' });
    slide4.addShape(pptx.ShapeType.line, { x: '5%', y: '35%', w: '10%', h: 0, line: { color: MUTED_GOLD, width: 3 } });
    slide4.addText("그 능력이 대체 어떤 능력입니까? 바로 예수 그리스도를 죽음에서 다시 살리신 부활의 능력입니다! 죄와 사망의 권세를 박살 내시고 하늘 보좌 우편에 앉히신 그 권능이 지금 우리 안에 숨 쉬고 있습니다.\n\n예수님의 승리는 완전하며, 그분은 만물의 주관자이십니다.", { x: '5%', y: '40%', w: '40%', h: '50%', fontSize: 20, color: CHARCOAL, lineSpacing: 34, fontFace: 'Malgun Gothic', valign: 'top' });

    // Slide 5: Full Background Image
    let slide5 = pptx.addSlide();
    if (img4Path) {
        slide5.background = { path: img4Path };
    } else {
        slide5.background = { fill: CHARCOAL };
    }
    slide5.addShape(pptx.ShapeType.rect, { x: 0, y: 0, w: '100%', h: '100%', fill: { color: CHARCOAL, transparency: 65 } });
    slide5.addText("교회의 영광", { x: '10%', y: '25%', w: '80%', h: 1, fontSize: 44, color: MUTED_GOLD, bold: true, align: 'center', fontFace: 'Malgun Gothic' });
    slide5.addText("만물을 충만하게 하시는 그리스도의 영광이 담긴 그분의 몸.\n\n예수님은 바로 지상의 교회를 통해, 저와 여러분을 통해 그분의 임재를 세상에 나타내기로 작정하셨습니다.", { x: '15%', y: '45%', w: '70%', h: '35%', fontSize: 26, color: CREAM, align: 'center', lineSpacing: 40, fontFace: 'Malgun Gothic', valign: 'top' });

    // Slide 6: Closing Layout
    let slide6 = pptx.addSlide();
    slide6.background = { fill: CREAM };
    slide6.addShape(pptx.ShapeType.rect, { x: '10%', y: '10%', w: '80%', h: '80%', fill: { color: CHARCOAL }, line: { color: MUTED_GOLD, width: 4 } });
    slide6.addText("결단과 기도", { x: '10%', y: '25%', w: '80%', h: 1, fontSize: 36, color: MUTED_GOLD, bold: true, align: 'center', fontFace: 'Malgun Gothic' });
    slide6.addShape(pptx.ShapeType.line, { x: '45%', y: '38%', w: '10%', h: 0, line: { color: MUTED_GOLD, width: 2 } });
    slide6.addText("주님! 내 마음의 눈을 열어 주시옵소서!\n\n나를 부르신 그 확고한 소망과 능력을 내 온몸으로 경험하게 하옵소서.", { x: '15%', y: '45%', w: '70%', h: '30%', fontSize: 26, color: CREAM, align: 'center', lineSpacing: 40, fontFace: 'Malgun Gothic', bold: true });

    const outputPath = path.join(os.homedir(), 'Desktop', '우리의_눈을_열어보게_하옵소서_디자이너.pptx');
    await pptx.writeFile({ fileName: outputPath });
    console.log(`Saved PPT to ${outputPath}`);
}

createPPT().catch(console.error);
