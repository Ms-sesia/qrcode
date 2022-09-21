/**
 * QRCode 생성
 * 1. png파일로 QRCode 생성
 * 2. 생성된 png파일을 svg파일로 변경.
 * 3. svg 파일을 dwg/dxf로 변경.(유료 라이브러리 vector express.)
 */
import QRCode from "qrcode";
import path from "path";
import fs from "fs";
import potrace from "potrace";
// import vectorExpress from "./SVGToDWG_vectorExpress";
import dotenv from "dotenv";
dotenv.config();

const QRAccessUrl = "https://www.platcube.com";
const QRStoragePath = path.join(__dirname, "./QRImage");
const svgDirPath = path.join(__dirname, "./QRsvg");

// QRImage 디렉토리 확인
fs.readdir(QRStoragePath, (err, dir) => {
  if (err) {
    console.log("QRImage 디렉토리가 없어 생성합니다.");
    fs.mkdirSync(QRStoragePath);
  }
});
fs.readdir(svgDirPath, (err, dir) => {
  if (err) {
    console.log("svg 저장 디렉토리가 없어 생성합니다.");
    fs.mkdirSync(svgDirPath);
  }
});

// QR코드 출력 번호(첫 번째 출력, 두 번째 출력...)
const QRNumber = 1;

const QRNumber_set =
  QRNumber < 10
    ? "000" + QRNumber
    : QRNumber < 100
    ? "00" + QRNumber
    : QRNumber < 1000
    ? "0" + QRNumber
    : // : QRNumber < 10000
      // ? "0" + QRNumber
      QRNumber;
// 출력할 QR코드 수
const QRPubNumber = 2;

const today = new Date(new Date().setHours(new Date().getHours() + 9)).toISOString();
const todayToString = `${today.split("T")[0].replace(/-/g, "")}${today
  .split("T")[1]
  .split(".")[0]
  .replace(/:/g, "")}`.substring(2);

// QRCode png 파일 생성
for (let i = 1; i <= QRPubNumber; i++) {
  // 출력번호
  const pubNumber = i < 10 ? "0000" + i : i < 100 ? "000" + i : i < 1000 ? "00" + i : i < 10000 ? "0" + i : i;
  // 생성할 QRCode
  const QRData = `${QRAccessUrl}/${todayToString}N${QRNumber_set}_${pubNumber}`;

  // 생성할 파일 경로
  const QRcode_file = `${QRStoragePath}/safety_QRCode_${pubNumber}.png`;
  QRCode.toFile(QRcode_file, [{ data: Buffer.from(QRData), mode: "byte" }], { errorCorrectionLevel: "M" }, (err) => {
    if (err) console.log("QRcode 생성 에러 =======>\n", err);
  });
}

const pngList = fs.readdirSync(QRStoragePath);
// QRCode png to svg
pngList.forEach(async (file, index) => {
  const pubNumber =
    index + 1 < 10
      ? "0000" + (index + 1)
      : index + 1 < 100
      ? "000" + (index + 1)
      : index + 1 < 1000
      ? "00" + (index + 1)
      : index + 1 < 10000
      ? "0" + (index + 1)
      : index + 1;
  const svgOpt = { threshold: 200 };
  potrace.trace(`${QRStoragePath}/${file}`, svgOpt, (err, svg) => {
    if (err) console.log("SVG파일 변환 에러 ======>\n", err);
    fs.writeFileSync(`${svgDirPath}/safety_QRCode_${pubNumber}.svg`, svg);
  });
});

// dwg 변환 안됨
// const svgList = fs.readdirSync(svgDirPath);
// svgList.forEach(async (file, index) => {
//   const svgFilePath = `${svgDirPath}/${file}`;
//   const svgFile = fs.readFileSync(svgFilePath);
//   vectorExpress.process("svg", ["exclude-groups"], { save: true, svgFile }).then((res) => {
//     console.log(res);
//     /*
//       undefined
//       'file.svg' is saved in the current working directory
//     */
//   });

//   console.log("-----------------------------------------------");
// });
