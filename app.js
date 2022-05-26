import express from "express";
import mysql from "mysql2/promise";

// db 연결
const pool = mysql.createPool({
  host: "localhost",
  user: "sbsst",
  password: "sbs123414",
  database: "project1_3_220526",
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0,
  dateStrings: true, // 날짜시간을 깔끔하게 보여주기 위해서 설정
});

const app = express();
app.use(express.json());
const port = 3000;

// 단건조회
app.get("/wise-sayings/random", async (req, res) => {
  const [[wiseSayingRow]] = await pool.query(
    `
    SELECT *
    FROM wise_saying
    ORDER BY RAND()
    LIMIT 1
    `
  );

  if (wiseSayingRow == undefined) {
    res.status(404).json({
      resultCode: "F-1",
      msg: "404 not found",
    });
    return;
  }

  // 조회수 증가
  wiseSayingRow.hitCount++; // hitCount 증가를 먼저 시킨 후에 증가 된 값인 wiseSayingRow.hitCount를 넣음
  // UPDATE로 hitCount = hitCount + 1 한 다음에 wiseSayingRow.hitCount++;를 나중에 적어도 됨

  await pool.query(
    `
    UPDATE wise_saying
    SET hitCount = ?
    WHERE id = ?
    `,
    [wiseSayingRow.hitCount, wiseSayingRow.id]
  );

  res.json({
    resultCode: "S-1",
    msg: "성공",
    data: wiseSayingRow,
  });
});

app.listen(port, () => {
  console.log(`wise saying app listening on port ${port}`);
});
