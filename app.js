import express from "express";
import mysql from "mysql2/promise";
import cors from "cors";

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
app.use(cors());
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

// 수정
app.patch("/wise-sayings/:id", async (req, res) => {
  const { id } = req.params; // id 가져옴
  const [[wiseSayingRow]] = await pool.query(
    `
    SELECT *
    FROM wise_saying
    WHERE id = ?
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

  const {
    // 수정 할 수 있는 것들 content, author, goodLikeCount, badLikeCount
    // content, author, goodLikeCount, badLikeCount -> 값을 이렇게 넣으면 한가지만 수정하려고 해도 값을 새로 다 넣어야 함, 만약 값이 없다면 undefinded 처리 됨
    content = wiseSayingRow.content, // req.body안에 content값이 없다면 wiseSayingRow안에 있는 content 값을 주겠다는 뜻 / wiseSayingRow == db / 따라서 값이 없으면 수정이 안됨
    author = wiseSayingRow.author,
    goodLikeCount = wiseSayingRow.goodLikeCount,
    badLikeCount = wiseSayingRow.badLikeCount,
  } = req.body; // req.body에서 값을 받음

  await pool.query(
    `
    UPDATE wise_saying
    SET content = ?,
    author = ?,
    goodLikeCount = ?,
    badLikeCount = ?
    WHERE id = ?
    `,
    [content, author, goodLikeCount, badLikeCount, id]
  );

  // 수정된 db를 다시 한 번 더 가져옴
  const [[justModifiedWiseSayingRow]] = await pool.query(
    `
    SELECT *
    FROM wise_saying
    WHERE id = ?
    `,
    [id]
  );

  // 성공 했을 시 가져온 db 내용을 보여 줌
  res.json({
    resultCode: "S-1",
    msg: "성공",
    data: justModifiedWiseSayingRow,
  });
});

app.listen(port, () => {
  console.log(`wise saying app listening on port ${port}`);
});
