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
  const { id } = req.params;
  const [[wiseSayingRow]] = await pool.query(
    `
    SELECT *
    FROM wise_saying
    ORDER BY RAND()
    LIMIT 1
    `,
    [id]
  );

  if (wiseSayingRow == undefined) {
    res.status(404).json({
      resultCode: "F-1",
      msg: "404 not found",
    });
    return;
  }

  res.json({
    resultCode: "S-1",
    msg: "성공",
    data: wiseSayingRow,
  });
});

app.listen(port, () => {
  console.log(`Example app listening on port ${port}`);
});
